import { NextResponse } from 'next/server'
import { stravaService, StravaService } from '@/lib/strava/service'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
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

        // Update components km based on new bike totals
        const { data: bikes } = await supabase
            .from('bikes')
            .select('id, total_km')
            .eq('user_id', user.id)

        if (bikes) {
            for (const bike of bikes) {
                // Get components for this bike
                const { data: components } = await supabase
                    .from('components')
                    .select('id, install_km')
                    .eq('bike_id', bike.id)
                    .neq('status', 'replaced')

                if (components) {
                    for (const component of components) {
                        const currentKm = bike.total_km - component.install_km

                        await supabase
                            .from('components')
                            .update({
                                current_km: Math.max(0, currentKm),
                                updated_at: new Date().toISOString(),
                            })
                            .eq('id', component.id)
                    }
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
