'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface LegInput {
  _id: string;
  task: string;
  category?: string;
  selectedVariantName?: string;
  target?: string;
  verificationMethod?: string;
  aiPrompt?: string;
  creditReward: number;
  probabilityWeight?: number;
  demonMultiplier?: number;
  isDemonSupported?: boolean;
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
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'UNAUTHORIZED_OPERATOR' };

    const activeWager = Math.floor(slipData.wagerAllocated);
    if (activeWager <= 0) return { success: false, error: 'INVALID_WAGER_AMOUNT' };

    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError || !userProfile) {
      console.error('❌ Wallet query failed:', userError?.message);
      return { success: false, error: 'ACCOUNT_WALLET_NOT_FOUND' };
    }

    if (userProfile.credits < activeWager) {
      return { success: false, error: 'INSUFFICIENT_ENERGY_FUNDS' };
    }

    const newBalance = userProfile.credits - activeWager;
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Bank transaction declined:', updateError.message);
      return { success: false, error: 'TRANSACTION_BANK_DECLINED' };
    }

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
      console.error('❌ Master slip contract failed:', slipError?.message);
      await supabase.from('users').update({ credits: userProfile.credits }).eq('id', userId);
      return { success: false, error: 'MASTER_CONTRACT_FAIL_ROLLBACK' };
    }

    const legsToInsert = slipData.legs.map((leg) => ({
      slip_id: newSlip.id,
      leg_id: String(leg._id || 'unknown'),
      task: String(leg.task || 'Untitled Task'),
      variant_name: leg.selectedVariantName || null,
      target_description: leg.target || leg.task || null,
      category: leg.category || 'EXECUTION',
      verification_method: leg.verificationMethod || 'video',
      ai_prompt: leg.aiPrompt || null,
      credit_reward: Number(leg.creditReward || 0),
      probability_weight: Number(leg.probabilityWeight || 1.5),
      is_demon: Boolean(leg.isDemonSupported),
    }));

    const { error: legsError } = await supabase
      .from('slip_legs')
      .insert(legsToInsert);

    if (legsError) {
      console.error('❌ Critical error inserting legs:', JSON.stringify(legsError, null, 2));
      await supabase.from('slips').delete().eq('id', newSlip.id);
      await supabase.from('users').update({ credits: userProfile.credits }).eq('id', userId);
      return { success: false, error: `LEGS_TRANSMISSION_ERROR: ${legsError.message}` };
    }

    revalidatePath('/slips');
    revalidatePath('/legs');

    return { success: true, slipId: newSlip.id, remainingCredits: newBalance };

  } catch (err: any) {
    console.error('💥 Financial Engine Crash:', err);
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
      console.error('❌ Error reading wallet balance:', error?.message);
      return { success: false, error: 'WALLET_NOT_FOUND', credits: 0 };
    }

    return { success: true, credits: data.credits };
  } catch (err: any) {
    console.error('💥 Crash in getUserBalance:', err);
    return { success: false, error: 'INTERNAL_ERROR', credits: 0 };
  }
}