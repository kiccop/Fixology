'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
    Bell,
    CheckCheck,
    Trash2,
    AlertTriangle,
    RefreshCw,
    Info,
    Clock,
    Check
} from 'lucide-react'
import { Card, Button, Badge } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { it, enUS, fr, es } from 'date-fns/locale'

const locales = { it, en: enUS, fr, es }

interface Notification {
    id: string
    type: 'maintenance' | 'sync' | 'system'
    title: string
    message: string
    read: boolean
    created_at: string
}

export function NotificationsContent({ initialNotifications }: { initialNotifications: Notification[] }) {
    const t = useTranslations('notifications')
    const [notifications, setNotifications] = useState(initialNotifications)
    const supabase = createClient()

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id)

        if (!error) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
        }
    }

    const markAllRead = async () => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('read', false)

        if (!error) {
            setNotifications(notifications.map(n => ({ ...n, read: true })))
        }
    }

    const deleteNotification = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id)

        if (!error) {
            setNotifications(notifications.filter(n => n.id !== id))
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'maintenance': return <AlertTriangle className="w-5 h-5 text-warning-400" />
            case 'sync': return <Check className="w-5 h-5 text-secondary-400" />
            default: return <Info className="w-5 h-5 text-primary-400" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">{t('title')}</h1>
                    <p className="text-neutral-400 mt-1">
                        Hai {notifications.filter(n => !n.read).length} nuove notifiche
                    </p>
                </div>

                {notifications.some(n => !n.read) && (
                    <Button variant="ghost" size="sm" onClick={markAllRead} icon={<CheckCheck className="w-4 h-4" />}>
                        {t('markAllRead')}
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-neutral-600" />
                            </div>
                            <p className="text-neutral-500">{t('noNotifications')}</p>
                        </motion.div>
                    ) : (
                        notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <Card
                                    className={`relative overflow-hidden ${!n.read ? 'border-l-4 border-l-primary-500' : ''}`}
                                    padding="sm"
                                >
                                    <div className="flex gap-4">
                                        <div className={`p-2 rounded-xl h-fit ${!n.read ? 'bg-primary-500/10' : 'bg-neutral-800'}`}>
                                            {getIcon(n.type)}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={`font-semibold ${!n.read ? 'text-white' : 'text-neutral-300'}`}>
                                                        {n.title}
                                                    </h3>
                                                    <p className="text-sm text-neutral-400 mt-1">{n.message}</p>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: it })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-2 mt-3">
                                                {!n.read && (
                                                    <Button variant="ghost" size="sm" className="h-8 text-[11px]" onClick={() => markAsRead(n.id)}>
                                                        Segna come letta
                                                    </Button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(n.id)}
                                                    className="p-2 text-neutral-500 hover:text-danger-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
