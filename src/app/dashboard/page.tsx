import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { DashboardContent } from './DashboardContent'

export default async function DashboardPage() {
    const t = await getTranslations('dashboard')
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Get user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    // Get bikes with component counts
    const { data: bikes } = await supabase
        .from('bikes')
        .select(`
      *,
      components:components(count)
    `)
        .eq('user_id', user?.id)
        .order('is_primary', { ascending: false })

    // Get components that need attention (warning or danger status)
    const { data: alertComponents } = await supabase
        .from('components')
        .select(`
      *,
      bike:bikes(name)
    `)
        .eq('bikes.user_id', user?.id)
        .in('status', ['warning', 'danger'])

    // Get Strava connection status
    const { data: stravaToken } = await supabase
        .from('strava_tokens')
        .select('id, updated_at')
        .eq('user_id', user?.id)
        .single()

    // Calculate totals
    const totalBikes = bikes?.length || 0
    const totalKm = bikes?.reduce((acc, bike) => acc + (bike.total_km || 0), 0) || 0
    const componentsToCheck = alertComponents?.length || 0

    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent
                userName={profile?.name || user?.email?.split('@')[0] || 'Ciclista'}
                totalBikes={totalBikes}
                totalKm={totalKm}
                componentsToCheck={componentsToCheck}
                bikes={bikes || []}
                alertComponents={alertComponents || []}
                stravaConnected={!!stravaToken}
                lastStravaSync={stravaToken?.updated_at}
            />
        </Suspense>
    )
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="skeleton h-10 w-64" />

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-6">
                        <div className="skeleton h-4 w-24 mb-2" />
                        <div className="skeleton h-8 w-32" />
                    </div>
                ))}
            </div>

            {/* Content skeleton */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="card p-6">
                    <div className="skeleton h-6 w-32 mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-16 w-full" />
                        ))}
                    </div>
                </div>
                <div className="card p-6">
                    <div className="skeleton h-6 w-40 mb-4" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="skeleton h-16 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
