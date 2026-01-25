'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import {
    Bike,
    Activity,
    AlertTriangle,
    RefreshCw,
    Plus,
    ChevronRight,
    Loader2,
    Zap,
    TrendingUp,
    Settings,
} from 'lucide-react'
import { Card, CardHeader, Button, ProgressBar, Badge, StravaLogo } from '@/components/ui'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

interface DashboardContentProps {
    userName: string
    totalBikes: number
    totalKm: number
    componentsToCheck: number
    bikes: any[]
    alertComponents: any[]
    stravaConnected: boolean
    lastStravaSync?: string
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export function DashboardContent({
    userName,
    totalBikes,
    totalKm,
    componentsToCheck,
    bikes,
    alertComponents,
    stravaConnected,
    lastStravaSync,
}: DashboardContentProps) {
    const t = useTranslations('dashboard')
    const tStrava = useTranslations('strava')
    const tComponents = useTranslations('components')
    const tBikes = useTranslations('bikes')
    const [syncing, setSyncing] = useState(false)

    const handleSync = async () => {
        setSyncing(true)
        try {
            const response = await fetch('/api/strava/sync', { method: 'POST' })
            const data = await response.json()

            if (response.ok) {
                toast.success(tStrava('syncSuccess'))
            } else {
                toast.error(data.error || tStrava('syncError'))
            }
        } catch {
            toast.error(tStrava('syncError'))
        } finally {
            setSyncing(false)
        }
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        {t('welcome')}, <span className="text-gradient">{userName}</span>! 👋
                    </h1>
                    <p className="text-neutral-400 mt-1">{t('overview')}</p>
                </div>

                {stravaConnected && (
                    <StravaLogo
                        variant="sync-button"
                        onClick={handleSync}
                        loading={syncing}
                    />
                )}
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    icon={Bike}
                    label={t('totalBikes')}
                    value={totalBikes.toString()}
                    gradient="from-blue-500 to-cyan-500"
                />
                <StatCard
                    icon={TrendingUp}
                    label={t('totalKm')}
                    value={totalKm.toLocaleString()}
                    suffix="km"
                    gradient="from-green-500 to-emerald-500"
                />
                <StatCard
                    icon={AlertTriangle}
                    label={t('componentsToCheck')}
                    value={componentsToCheck.toString()}
                    gradient={componentsToCheck > 0 ? "from-orange-500 to-red-500" : "from-gray-500 to-gray-600"}
                    alert={componentsToCheck > 0}
                />
            </motion.div>

            {/* Strava Connection Banner */}
            {!stravaConnected && (
                <motion.div variants={fadeIn}>
                    <Card className="!bg-gradient-to-r from-[#FC4C02]/10 to-[#FC4C02]/5 !border-[#FC4C02]/20">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#FC4C02]/20 flex items-center justify-center p-2.5">
                                    <StravaLogo variant="mark" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{tStrava('connect')}</h3>
                                    <p className="text-neutral-400 text-sm">
                                        {t('overview')}
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

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Bikes List */}
                <motion.div variants={fadeIn}>
                    <Card padding="none">
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">{t('yourBikes')}</h2>
                                <Link href="/dashboard/settings">
                                    <Button variant="ghost" icon={<Settings className="w-4 h-4" />}>
                                        {t('settings')}
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-4 flex flex-col items-end pr-2">
                                <StravaLogo className="scale-75 origin-right" />
                            </div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {bikes.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bike className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                                    <p className="text-neutral-400">{tBikes('noBikes')}</p>
                                    <Link href="/dashboard/bikes">
                                        <Button variant="secondary" size="sm" className="mt-4">
                                            {t('addFirstBike')}
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                bikes.slice(0, 4).map((bike) => (
                                    <Link
                                        key={bike.id}
                                        href={`/dashboard/bikes/${bike.id}`}
                                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                                                <Bike className="w-6 h-6 text-primary-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{bike.name}</h3>
                                                    {bike.is_primary && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400">
                                                            {tBikes('primary')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-neutral-400">
                                                    {bike.total_km?.toLocaleString() || 0} km
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-neutral-500" />
                                    </Link>
                                ))
                            )}
                        </div>

                        {bikes.length > 4 && (
                            <div className="p-4 border-t border-white/5">
                                <Link href="/dashboard/bikes">
                                    <Button variant="ghost" fullWidth size="sm">
                                        Vedi tutte ({bikes.length})
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Components Alerts */}
                <motion.div variants={fadeIn}>
                    <Card padding="none">
                        <div className="p-6 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">{t('upcomingMaintenance')}</h2>
                                {componentsToCheck > 0 && (
                                    <Badge status="warning">{componentsToCheck}</Badge>
                                )}
                            </div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {alertComponents.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Activity className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                                    <p className="text-neutral-400">{t('allClear')}</p>
                                </div>
                            ) : (
                                alertComponents.slice(0, 5).map((component) => (
                                    <div key={component.id} className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-medium">
                                                    {tComponents(`types.${component.type}`)}
                                                </h3>
                                                <p className="text-sm text-neutral-400">
                                                    {component.bike?.name}
                                                </p>
                                            </div>
                                            <Badge status={component.status}>
                                                {tComponents(`status.${component.status}`)}
                                            </Badge>
                                        </div>
                                        <div className="mt-2">
                                            <ProgressBar
                                                value={calculateWearPercentage(component)}
                                                showLabel
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Last Sync Info */}
            {stravaConnected && lastStravaSync && (
                <motion.div variants={fadeIn} className="text-center text-sm text-neutral-500">
                    {t('lastSync')}: {formatDistanceToNow(new Date(lastStravaSync), { addSuffix: true, locale: it })}
                </motion.div>
            )}
        </motion.div>
    )
}

// Stat Card Component
function StatCard({
    icon: Icon,
    label,
    value,
    suffix,
    gradient,
    alert,
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string
    suffix?: string
    gradient: string
    alert?: boolean
}) {
    return (
        <Card className={`relative overflow-hidden ${alert ? '!border-danger-500/30' : ''}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-neutral-400">{label}</p>
                    <p className="text-2xl font-bold">
                        {value}
                        {suffix && <span className="text-lg text-neutral-400 ml-1">{suffix}</span>}
                    </p>
                </div>
            </div>
            {alert && (
                <div className="absolute top-2 right-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-danger-500"></span>
                    </span>
                </div>
            )}
        </Card>
    )
}

// Helper function
function calculateWearPercentage(component: any): number {
    if (component.threshold_km && component.threshold_km > 0) {
        return (component.current_km / component.threshold_km) * 100
    }
    if (component.threshold_hours && component.threshold_hours > 0) {
        return (component.current_hours / component.threshold_hours) * 100
    }
    return 0
}
