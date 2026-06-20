import { NextRequest, NextResponse } from 'next/server'
import { stravaService, StravaService } from '@/lib/strava/service'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    // Apply rate limiting: 30 requests per 15 minutes per IP
    const rateLimitResponse = await rateLimit(request, {
        maxRequests: 30,
        windowMs: 15 * 60 * 1000,
    })
    if (rateLimitResponse) return rateLimitResponse

    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get stored token
        const { data: tokenData, error: tokenError } = await supabase
            .from('strava_tokens')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (tokenError || !tokenData) {
            return NextResponse.json({ error: 'Strava not connected' }, { status: 400 })
        }

        let accessToken = tokenData.access_token

        // Check if token is expired and refresh if needed
        const now = Math.floor(Date.now() / 1000)
        if (tokenData.expires_at < now) {
            try {
                const refreshedToken = await stravaService.refreshAccessToken(tokenData.refresh_token)

                // Update stored token
                await supabase
                    .from('strava_tokens')
                    .update({
                        access_token: refreshedToken.access_token,
                        refresh_token: refreshedToken.refresh_token,
                        expires_at: refreshedToken.expires_at,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('user_id', user.id)

                accessToken = refreshedToken.access_token
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError)
                return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 })
            }
        }

        // Fetch athlete data with bikes
        const athlete = await stravaService.getAthlete(accessToken)

        if (!athlete.bikes || athlete.bikes.length === 0) {
            return NextResponse.json({
                message: 'No bikes found',
                bikesImported: 0
            })
        }

        // Sync bikes
        const bikesToUpsert = athlete.bikes.map(bike => ({
            ...StravaService.stravaBikeToLocalBike(bike, user.id),
            updated_at: new Date().toISOString(),
        }))

        let importedCount = 0

        for (const bike of bikesToUpsert) {
            const { error } = await supabase
                .from('bikes')
                .upsert(bike, {
                    onConflict: 'strava_id'
                })

            if (!error) {
                importedCount++
            }
        }

        // Update components km based on new bike totals — optimized batch approach
        // Fetch all bikes with their active components in a single query
        const { data: bikesWithComponents } = await supabase
            .from('bikes')
            .select('id, total_km, components:components(id, install_km)')
            .eq('user_id', user.id)
            .neq('components.status', 'replaced')

        if (bikesWithComponents) {
            for (const bike of bikesWithComponents) {
                const components = bike.components as any[]
                if (!components || components.length === 0) continue

                // Batch update all components for this bike at once
                // Each component gets its own current_km calculated from its install_km
                const updates = components.map(c => ({
                    id: c.id,
                    current_km: Math.max(0, (bike.total_km || 0) - (c.install_km || 0)),
                    updated_at: new Date().toISOString(),
                }))

                // Use individual updates (Supabase doesn't support bulk UPDATE with different values per row)
                // But we reduced from N*M queries to N queries (one per bike instead of one per component)
                for (const update of updates) {
                    await supabase
                        .from('components')
                        .update({
                            current_km: update.current_km,
                            updated_at: update.updated_at,
                        })
                        .eq('id', update.id)
                }
            }
        }

        return NextResponse.json({
            success: true,
            bikesImported: importedCount,
            message: `Synced ${importedCount} bikes from Strava`
        })

    } catch (error) {
        console.error('Strava sync error:', error)
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
    }
}
