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
            className="space-y-12 max-w-6xl mx-auto px-4"
        >
            {/* Header - Minimal & Centered */}
            <motion.div variants={fadeIn} className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-1">{t('overview')}</p>
                    <h1 className="text-base sm:text-lg font-medium text-neutral-300 truncate">
                        {t('welcome')}, <span className="text-gradient font-semibold break-words">{userName}</span> 👋
                    </h1>
                </div>

                {stravaConnected && (
                    <div className="flex-shrink-0">
                        <StravaLogo
                            variant="sync-button"
                            onClick={handleSync}
                            loading={syncing}
                        />
                    </div>
                )}
            </motion.div>

            {/* Stats Grid - Compact */}
            <motion.div variants={fadeIn} className="grid grid-cols-3 gap-5">
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

            {/* Strava Connection Banner removed from here - moved exclusively to Settings */}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Bikes List */}
                <motion.div variants={fadeIn}>
                    <Card padding="none">
                        <div className="p-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-neutral-200">{t('yourBikes')}</h2>
                                <Link href="/dashboard/settings">
                                    <Button variant="ghost" size="sm" icon={<Settings className="w-3.5 h-3.5" />}>
                                        <span className="text-xs">{t('settings')}</span>
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-[10px] text-neutral-500 font-medium italic">Gestione flotta attiva</p>
                                <StravaLogo className="scale-60 origin-right opacity-60" />
                            </div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {bikes.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Bike className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
                                    <p className="text-sm text-neutral-400">{tBikes('noBikes')}</p>
                                    <Link href="/dashboard/bikes">
                                        <Button variant="secondary" size="sm" className="mt-3">
                                            {t('addFirstBike')}
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                bikes.slice(0, 4).map((bike) => (
                                    <Link
                                        key={bike.id}
                                        href={`/dashboard/bikes/${bike.id}`}
                                        className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                                                <Bike className="w-4 h-4 text-primary-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-medium">{bike.name}</h3>
                                                    {bike.is_primary && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-400">
                                                            {tBikes('primary')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-500">
                                                    {bike.total_km?.toLocaleString() || 0} km
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-neutral-600" />
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
                        <div className="p-4 border-b border-white/5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-neutral-200">{t('upcomingMaintenance')}</h2>
                                {componentsToCheck > 0 && (
                                    <Badge status="warning" size="sm">{componentsToCheck}</Badge>
                                )}
                            </div>
                        </div>

                        <div className="divide-y divide-white/5">
                            {alertComponents.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Activity className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
                                    <p className="text-sm text-neutral-400">{t('allClear')}</p>
                                </div>
                            ) : (
                                alertComponents.slice(0, 5).map((component) => (
                                    <div key={component.id} className="p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-sm font-medium">
                                                    {tComponents(`types.${component.type}`)}
                                                </h3>
                                                <p className="text-xs text-neutral-500">
                                                    {component.bike?.name}
                                                </p>
                                            </div>
                                            <Badge status={component.status} size="sm">
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
                <motion.div variants={fadeIn} className="text-center text-xs text-neutral-600">
                    {t('lastSync')}: {formatDistanceToNow(new Date(lastStravaSync), { addSuffix: true, locale: it })}
                </motion.div>
            )}
        </motion.div>
    )
}

// Stat Card Component - Compact Version
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
        <Card className={`relative overflow-hidden !p-4 transition-all duration-300 hover:scale-[1.02] border border-white/5 hover:border-white/10 ${alert ? '!border-danger-500/30 bg-danger-500/5' : 'bg-white/[0.02]'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-[0.1em] font-bold truncate">{label}</p>
                    <p className="text-lg sm:text-xl font-black leading-tight italic tracking-tight truncate">
                        {value}
                        {suffix && <span className="text-xs text-neutral-500 ml-1 font-medium lowercase italic">{suffix}</span>}
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
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-br ${gradient} opacity-5 blur-2xl rounded-full`} />
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
