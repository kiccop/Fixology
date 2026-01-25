import { createClient } from '@/lib/supabase/server'
import { SettingsPageContent } from './SettingsPageContent'

export default async function SettingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    const { data: stravaToken } = await supabase
        .from('strava_tokens')
        .select('athlete_id, updated_at')
        .eq('user_id', user?.id)
        .single()

    return (
        <SettingsPageContent
            profile={profile}
            stravaConnected={!!stravaToken}
            lastStravaSync={stravaToken?.updated_at}
        />
    )
}
