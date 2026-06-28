import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    const rateLimitResponse = await rateLimit(request, { maxRequests: 20, windowMs: 60 * 1000 })
    if (rateLimitResponse) return rateLimitResponse

    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const accessToken = authHeader.slice(7)

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        // Verify token by creating a temporary authenticated client
        const authClient = createClient(supabaseUrl, supabaseAnonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
        })

        const { data: { user }, error: userError } = await authClient.auth.getUser()
        if (userError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { base64, bikeId, filename } = await request.json()
        if (!base64 || !bikeId || !filename) {
            return NextResponse.json({ error: 'Missing required fields: base64, bikeId, filename' }, { status: 400 })
        }

        // Verify user owns this bike
        const { data: bike, error: bikeError } = await authClient
            .from('bikes')
            .select('id')
            .eq('id', bikeId)
            .eq('user_id', user.id)
            .single()

        if (bikeError || !bike) {
            return NextResponse.json({ error: 'Bike not found or access denied' }, { status: 404 })
        }

        // Convert base64 to buffer for upload to Supabase Storage
        const pdfBuffer = Buffer.from(base64, 'base64')

        // Use service role admin client to bypass RLS on Storage
        const adminClient = createClient(
            supabaseUrl,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        )

        const filePath = `${bikeId}/${Date.now()}_${filename}`

        const { error: uploadError } = await adminClient.storage
            .from('receipts')
            .upload(filePath, pdfBuffer, {
                contentType: 'application/pdf',
                cacheControl: '3600',
            })

        if (uploadError) {
            console.error('Service role storage upload error:', uploadError)
            return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 })
        }

        // Create signed URL valid for 10 minutes
        const { data: signedData, error: signedError } = await adminClient.storage
            .from('receipts')
            .createSignedUrl(filePath, 600)

        if (signedError || !signedData?.signedUrl) {
            return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 })
        }

        // Schedule cleanup after 10 minutes
        setTimeout(async () => {
            try {
                await adminClient.storage.from('receipts').remove([filePath])
            } catch (e) {
                // Cleanup errors are non-critical
            }
        }, 10 * 60 * 1000)

        return NextResponse.json({ signedUrl: signedData.signedUrl })
    } catch (err) {
        console.error('PDF upload API error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
