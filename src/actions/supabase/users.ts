'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Fail early if keys are missing on the execution environment
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ CRITICAL: Supabase Environment variables are missing on the server backend!");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function syncUserToSupabase(id: string, email: string) {
  // THIS WILL PRINT IN YOUR TERMINAL/VERCEL LOGS GUARANTEED
  console.log(`🚀 [Server Action] Attempting sync for ID: ${id}, Email: ${email}`);

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        { id: id, email: email, avatar_skin: '/models/avatar.glb' },
        { onConflict: 'id' }
      )
      .select()

    if (error) {
      console.error('❌ Supabase DB Rejected Upsert:', error.message, error.details, error.hint);
      return { success: false, error: `${error.message} (${error.details})` }
    }

    console.log('✅ Supabase DB successfully acknowledged write:', data);
    return { success: true }
  } catch (err: any) {
    console.error('💥 Severe Server Action Crash:', err);
    return { success: false, error: err.message || 'Internal Server Error' }
  }
}