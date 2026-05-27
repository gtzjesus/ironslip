import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client using your project keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // Security Check: Block the request if headers are missing
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: No svix headers', { status: 400 })
  }

  // Read the raw body text for crypto verification
  const blob = await req.text()
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: WebhookEvent

  // Verify that this packet actually came from Clerk
  try {
    evt = wh.verify(blob, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  const eventType = evt.type

  // If a new user was just created in Clerk, catch them!
  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data
    const primaryEmail = email_addresses[0]?.email_address

    // HERE IS THE DATABASE INSERTION!
    const { error } = await supabase
      .from('users')
      .insert({ 
        id: id,          // Saves Clerk User ID to Supabase 'id' column
        email: primaryEmail // Saves email address to Supabase 'email' column
      })

    if (error) {
      console.error('Supabase save error:', error)
      return new Response('Database insertion failed', { status: 500 })
    }

    return new Response('User successfully synced to Supabase!', { status: 200 })
  }

  return new Response('Webhook received, but ignored event type', { status: 200 })
}