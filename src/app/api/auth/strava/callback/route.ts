import { NextRequest, NextResponse } from 'next/server'
import { stravaService, StravaService } from '@/lib/strava/service'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Handle Strava authorization errors
    if (error) {
        console.error('Strava auth error:', error)
        return NextResponse.redirect(new URL('/dashboard?error=strava_denied', baseUrl))
    }

    if (!code) {
        return NextResponse.redirect(new URL('/dashboard?error=no_code', baseUrl))
    }

    try {
        const supabase = await createClient()

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(new URL('/login?error=not_authenticated', baseUrl))
        }

        // Verify state matches user ID
        if (state && state !== user.id) {
            console.warn('State mismatch, possible CSRF')
        }

        // Exchange code for tokens
        const tokenResponse = await stravaService.exchangeCodeForToken(code)

        // Store tokens in database
        const { error: dbError } = await supabase
            .from('strava_tokens')
            .upsert({
                user_id: user.id,
                access_token: tokenResponse.access_token,
                refresh_token: tokenResponse.refresh_token,
                expires_at: tokenResponse.expires_at,
                athlete_id: tokenResponse.athlete.id,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            })

        if (dbError) {
            console.error('Error storing tokens:', dbError)
            return NextResponse.redirect(new URL('/dashboard?error=db_error', baseUrl))
        }

        // Import bikes from Strava
        const athlete = await stravaService.getAthlete(tokenResponse.access_token)

        if (athlete.bikes && athlete.bikes.length > 0) {
            const bikesToInsert = athlete.bikes.map(bike =>
                StravaService.stravaBikeToLocalBike(bike, user.id)
            )

            // Upsert bikes (update if strava_id exists, insert if not)
            for (const bike of bikesToInsert) {
                await supabase
                    .from('bikes')
                    .upsert(bike, {
                        onConflict: 'strava_id'
                    })
            }
        }

        // Update user profile with Strava info
        await supabase
            .from('profiles')
            .update({
                avatar_url: tokenResponse.athlete.profile,
                name: `${tokenResponse.athlete.firstname} ${tokenResponse.athlete.lastname}`,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        return NextResponse.redirect(new URL('/dashboard?strava=connected', baseUrl))

    } catch (error) {
        console.error('Strava callback error:', error)
        return NextResponse.redirect(new URL('/dashboard?error=strava_callback_failed', baseUrl))
    }
}
