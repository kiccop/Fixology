import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { BikesPageContent } from './BikesPageContent'

export default async function BikesPage() {
    const t = await getTranslations('bikes')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Get all bikes with component counts
    const { data: bikes } = await supabase
        .from('bikes')
        .select(`
      *,
      components:components(id, status)
    `)
        .eq('user_id', user?.id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false })

    // Check if Strava is connected
    const { data: stravaToken } = await supabase
        .from('strava_tokens')
        .select('id')
        .eq('user_id', user?.id)
        .single()

    return (
        <BikesPageContent
            bikes={bikes || []}
            stravaConnected={!!stravaToken}
        />
    )
}
