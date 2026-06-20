import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    // Apply strict rate limiting: 3 requests per hour per IP
    const rateLimitResponse = await rateLimit(request, {
        maxRequests: 3,
        windowMs: 60 * 60 * 1000,
    })
    if (rateLimitResponse) return rateLimitResponse

    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = user.id

        // 1. Delete notifications
        await supabase.from('notifications').delete().eq('user_id', userId)

        // 2. Get all bikes to find receipt files to delete
        const { data: bikes } = await supabase
            .from('bikes')
            .select('id')
            .eq('user_id', userId)

        // 3. Delete receipt files from storage
        if (bikes && bikes.length > 0) {
            const bikeIds = bikes.map(b => b.id)

            // First get all component IDs for these bikes
            const { data: componentsForReceipts } = await supabase
                .from('components')
                .select('id')
                .in('bike_id', bikeIds)

            const componentIds = componentsForReceipts?.map(c => c.id) || []

            if (componentIds.length > 0) {
                const { data: logs } = await supabase
                    .from('maintenance_logs')
                    .select('receipt_url')
                    .in('component_id', componentIds)
                    .not('receipt_url', 'is', null)

                if (logs) {
                    for (const log of logs) {
                        if (log.receipt_url) {
                            // Extract path from URL: https://.../receipts/bikeId/...
                            const urlParts = log.receipt_url.split('/receipts/')
                            if (urlParts.length > 1) {
                                const filePath = urlParts[1]
                                await supabase.storage.from('receipts').remove([filePath])
                            }
                        }
                    }
                }
            }
        }

        // 4. Delete maintenance_logs (via components)
        const { data: components } = await supabase
            .from('components')
            .select('id')
            .in('bike_id', bikes?.map(b => b.id) || [])

        if (components && components.length > 0) {
            await supabase
                .from('maintenance_logs')
                .delete()
                .in('component_id', components.map(c => c.id))
        }

        // 5. Delete components
        if (bikes && bikes.length > 0) {
            await supabase
                .from('components')
                .delete()
                .in('bike_id', bikes.map(b => b.id))
        }

        // 6. Delete bikes
        await supabase.from('bikes').delete().eq('user_id', userId)

        // 7. Delete strava tokens
        await supabase.from('strava_tokens').delete().eq('user_id', userId)

        // 8. Delete profile
        await supabase.from('profiles').delete().eq('id', userId)

        // 9. Finally delete the auth user using admin client (requires service role key)
        const adminClient = createAdminClient()
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)

        if (deleteError) {
            console.error('Error deleting auth user:', deleteError)
            return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Delete account error:', error)
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
}
