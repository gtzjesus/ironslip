'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface LegInput {
  _id: string;
  task: string;
  creditReward: number;
}

interface SlipInput {
  title: string;
  type: string;
  wagerAllocated: number;
  totalPayout: number;
  multiplier: number;
  legs: LegInput[];
}

export async function executeSlipContract(slipData: SlipInput) {
  try {
    // 1. Identificar al operador mediante Clerk de forma segura
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'UNAUTHORIZED_OPERATOR' };

    const activeWager = Math.floor(slipData.wagerAllocated);
    if (activeWager <= 0) return { success: false, error: 'INVALID_WAGER_AMOUNT' };

    // 2. Traer el perfil del usuario para verificar su balance real en el servidor
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      console.error('❌ Error leyendo billetera del usuario:', userError?.message);
      return { success: false, error: 'ACCOUNT_WALLET_NOT_FOUND' };
    }

    // 🛡️ CONTROL DE CRÉDITOS LAS VEGAS
    if (userProfile.credits < activeWager) {
      return { success: false, error: 'INSUFFICIENT_ENERGY_FUNDS' };
    }

    // 3. RETIRAR CRÉDITOS DE LA BILLETERA (Atomic Update)
    const newBalance = userProfile.credits - activeWager;
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Falló el retiro bancario en Supabase:', updateError.message);
      return { success: false, error: 'TRANSACTION_BANK_DECLINED' };
    }

    // 4. Insertar el Slip Maestro
    const { data: newSlip, error: slipError } = await supabase
      .from('slips')
      .insert({
        user_id: userId,
        title: slipData.title,
        type: slipData.type,
        wager_allocated: activeWager,
        total_payout: Math.floor(slipData.totalPayout),
        multiplier: slipData.multiplier,
        status: 'active'
      })
      .select()
      .single();

    if (slipError || !newSlip) {
      // ROLLBACK MANUAL si falla el slip maestro para no robarle los créditos al usuario
      await supabase.from('users').update({ credits: userProfile.credits }).eq('id', userId);
      return { success: false, error: 'MASTER_CONTRACT_FAIL_ROLLBACK' };
    }

    // 5. Bulk insert de las piernas asociadas
    const legsToInsert = slipData.legs.map((leg) => ({
      slip_id: newSlip.id,
      leg_id: leg._id,
      task: leg.task,
      credit_reward: leg.creditReward
    }));

    const { error: legsError } = await supabase.from('slip_legs').insert(legsToInsert);

    if (legsError) {
      console.error('❌ Error crítico en slip_legs:', legsError.message);
      return { success: false, error: 'LEGS_TRANSMISSION_ERROR' };
    }

    return { success: true, slipId: newSlip.id, remainingCredits: newBalance };

  } catch (err) {
    console.error('💥 Crash total en el motor financiero:', err);
    return { success: false, error: 'SYSTEM_BANK_CRASH' };
  }
}

export async function getUserBalance() {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'UNAUTHORIZED', credits: 0 };

    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('❌ Error al consultar balance en servidor:', error?.message);
      return { success: false, error: 'WALLET_NOT_FOUND', credits: 0 };
    }

    return { success: true, credits: data.credits };
  } catch (err) {
    console.error('💥 Crash en getUserBalance:', err);
    return { success: false, error: 'INTERNAL_ERROR', credits: 0 };
  }
}