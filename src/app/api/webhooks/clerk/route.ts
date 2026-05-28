export const dynamic = 'force-dynamic'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// CRITICAL FIX: Next.js needs the req parameter available for dynamic async headers mapping
export async function POST(req: Request) {
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing security headers', { status: 400 })
  }

  const blob = await req.text()
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)

  let evt: WebhookEvent

  try {
    evt = wh.verify(blob, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error: Security verification failed', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data
    const primaryEmail = email_addresses[0]?.email_address

    const { error } = await supabase
      .from('users')
      .insert({ 
        id: id,        
        email: primaryEmail 
      })

    if (error) {
      console.error('Supabase error inserting user:', error)
      return new Response('Database insertion crash', { status: 500 })
    }

    return new Response('User synced to Supabase successfully!', { status: 200 })
  }

  return new Response('Webhook processed, ignoring event type', { status: 200 })
}

// CRITICAL DEBUG HANDLER: Captures traffic if an upstream router forces a GET redirect
export async function GET() {
  return new Response("If you see this, a network redirect transformed Clerk's POST request into a GET request.", { status: 405 });
}
