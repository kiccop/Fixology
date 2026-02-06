import { NextResponse } from 'next/server'
import { stravaService } from '@/lib/strava/service'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Generate state with user ID for security
        const state = user?.id || 'anonymous'

        const authUrl = stravaService.getAuthorizationUrl(state)

        return NextResponse.redirect(authUrl)
    } catch (error) {
        console.error('Strava auth error:', error)
        return NextResponse.redirect(new URL('/login?error=strava_auth_failed', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
    }
}
