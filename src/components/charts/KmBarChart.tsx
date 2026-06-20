'use client'

import { useTranslations } from 'next-intl'

interface KmBarChartProps {
    bikes: { name: string; total_km: number }[]
}

export function KmBarChart({ bikes }: KmBarChartProps) {
    const t = useTranslations('dashboard')

    if (bikes.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 text-neutral-500 text-sm">
                {t('noData')}
            </div>
        )
    }

    const maxKm = Math.max(...bikes.map(b => b.total_km || 0), 1)
    const sortedBikes = [...bikes].sort((a, b) => b.total_km - a.total_km).slice(0, 6)

    return (
        <div className="space-y-3">
            {sortedBikes.map((bike, i) => {
                const percentage = ((bike.total_km || 0) / maxKm) * 100
                return (
                    <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-neutral-300 truncate max-w-[60%]">{bike.name}</span>
                            <span className="text-xs font-bold text-neutral-400 tabular-nums">
                                {(bike.total_km || 0).toLocaleString()} km
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
