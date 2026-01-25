import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { NotificationsContent } from './NotificationsContent'

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Recupera le notifiche dal DB
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

    return (
        <NotificationsContent
            initialNotifications={notifications || []}
        />
    )
}
