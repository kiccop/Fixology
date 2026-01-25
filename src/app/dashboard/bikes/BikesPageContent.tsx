'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    Bike,
    Plus,
    ChevronRight,
    MoreVertical,
    Edit,
    Trash2,
    Star,
    RefreshCw,
    Zap,
} from 'lucide-react'
import { Card, Button, Modal, Badge, StravaLogo } from '@/components/ui'
import { AddBikeModal } from './AddBikeModal'
import { createClient } from '@/lib/supabase/client'

interface BikesPageContentProps {
    bikes: any[]
    stravaConnected: boolean
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

const frameTypeIcons: Record<string, string> = {
    road: '🚴',
    mtb: '🚵',
    gravel: '🚴‍♂️',
    city: '🚲',
    ebike: '⚡',
    other: '🚴',
}

export function BikesPageContent({ bikes, stravaConnected }: BikesPageContentProps) {
    const t = useTranslations('bikes')
    const tStrava = useTranslations('strava')
    const router = useRouter()
    const supabase = createClient()

    const [addModalOpen, setAddModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedBike, setSelectedBike] = useState<any>(null)
    const [syncing, setSyncing] = useState(false)

    const handleSync = async () => {
        setSyncing(true)
        try {
            const response = await fetch('/api/strava/sync', { method: 'POST' })
            if (response.ok) {
                toast.success(tStrava('syncSuccess'))
                router.refresh()
            } else {
                toast.error(tStrava('syncError'))
            }
        } catch {
            toast.error(tStrava('syncError'))
        } finally {
            setSyncing(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedBike) return

        const { error } = await supabase
            .from('bikes')
            .delete()
            .eq('id', selectedBike.id)

        if (error) {
            toast.error('Errore durante l\'eliminazione')
        } else {
            toast.success('Bici eliminata')
            router.refresh()
        }

        setDeleteModalOpen(false)
        setSelectedBike(null)
    }

    const getComponentStats = (components: any[]) => {
        const total = components?.length || 0
        const warning = components?.filter(c => c.status === 'warning').length || 0
        const danger = components?.filter(c => c.status === 'danger').length || 0
        return { total, warning, danger }
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                animate: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">{t('title')}</h1>
                    <p className="text-neutral-400 mt-1">
                        {bikes.length} {t('registered')}
                    </p>
                </div>

                <div className="flex gap-3">
                    {stravaConnected && (
                        <Button
                            variant="secondary"
                            onClick={handleSync}
                            loading={syncing}
                            icon={syncing ? undefined : <RefreshCw className="w-4 h-4" />}
                        >
                            {syncing ? tStrava('syncing') : t('importFromStrava')}
                        </Button>
                    )}
                    <Button onClick={() => setAddModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                        {t('addBike')}
                    </Button>
                </div>
            </motion.div>

            {/* Strava Connect Banner */}
            {!stravaConnected && bikes.length === 0 && (
                <motion.div variants={fadeIn}>
                    <Card className="!bg-gradient-to-r from-[#FC4C02]/10 to-[#FC4C02]/5 !border-[#FC4C02]/20">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#FC4C02]/20 flex items-center justify-center">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FC4C02">
                                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{t('importFromStrava')}</h3>
                                    <p className="text-neutral-400 text-sm">
                                        {tStrava('autoSyncDescription')}
                                    </p>
                                </div>
                            </div>
                            <Link href="/api/auth/strava">
                                <StravaLogo variant="connect-button" />
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Bikes Grid */}
            {bikes.length === 0 ? (
                <motion.div variants={fadeIn}>
                    <Card className="text-center py-16">
                        <Bike className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                        <h3 className="text-xl font-semibold mb-2">{t('noBikes')}</h3>
                        <p className="text-neutral-400 mb-6">{t('noBikesDescription')}</p>
                        <Button onClick={() => setAddModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
                            {t('addBike')}
                        </Button>
                    </Card>
                </motion.div>
            ) : (
                <motion.div
                    variants={fadeIn}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {bikes.map((bike, index) => {
                        const stats = getComponentStats(bike.components)

                        return (
                            <motion.div
                                key={bike.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    interactive
                                    className="h-full"
                                    onClick={() => router.push(`/dashboard/bikes/${bike.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center text-2xl">
                                                {frameTypeIcons[bike.frame_type] || '🚴'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{bike.name}</h3>
                                                    {bike.is_primary && (
                                                        <Star className="w-4 h-4 text-warning-400 fill-warning-400" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-neutral-400">
                                                    {bike.brand} {bike.model}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedBike(bike)
                                                setDeleteModalOpen(true)
                                            }}
                                            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <MoreVertical className="w-4 h-4 text-neutral-400" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Km */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-400">{t('kilometers')}</span>
                                            <span className="font-medium">{bike.total_km?.toLocaleString() || 0} km</span>
                                        </div>

                                        {/* Components */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-400">{t('components')}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{stats.total}</span>
                                                {stats.danger > 0 && (
                                                    <Badge status="danger" size="sm">{stats.danger}</Badge>
                                                )}
                                                {stats.warning > 0 && (
                                                    <Badge status="warning" size="sm">{stats.warning}</Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Frame Type */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-400">{t('type')}</span>
                                            <span className="capitalize">{t(`frameTypes.${bike.frame_type}`)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-neutral-500">
                                                {bike.strava_id ? t('syncedFromStrava') : t('addedManually')}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-neutral-500" />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}

            {/* Add Bike Modal */}
            <AddBikeModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setSelectedBike(null)
                }}
                title={t('confirmDelete')}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-neutral-400">
                        {t('deleteConfirm')}
                    </p>
                    <p className="text-sm text-neutral-500">
                        {t('deleteWarning')}
                    </p>
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={() => {
                                setDeleteModalOpen(false)
                                setSelectedBike(null)
                            }}
                        >
                            Annulla
                        </Button>
                        <Button
                            variant="danger"
                            fullWidth
                            onClick={handleDelete}
                        >
                            Elimina
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}
