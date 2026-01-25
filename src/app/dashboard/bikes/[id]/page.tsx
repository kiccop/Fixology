import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BikeDetailContent } from './BikeDetailContent'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BikeDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Get bike with components
    const { data: bike, error } = await supabase
        .from('bikes')
        .select(`
      *,
      components:components(
        *,
        maintenance_logs:maintenance_logs(*)
      )
    `)
        .eq('id', id)
        .single()

    if (error || !bike) {
        notFound()
    }

    return <BikeDetailContent bike={bike} />
}
