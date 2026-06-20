'use client'

import { useTranslations } from 'next-intl'

interface ComponentWearItem {
    name: string
    type: string
    is_custom: boolean
    current_km: number
    threshold_km: number | null
    current_hours: number
    threshold_hours: number | null
    status: string
}

interface ComponentWearChartProps {
    components: ComponentWearItem[]
}

function calculateWearPercentage(c: ComponentWearItem): number {
    if (c.threshold_km && c.threshold_km > 0) {
        return Math.min(100, (c.current_km / c.threshold_km) * 100)
    }
    if (c.threshold_hours && c.threshold_hours > 0) {
        return Math.min(100, (c.current_hours / c.threshold_hours) * 100)
    }
    return 0
}

export function ComponentWearChart({ components }: ComponentWearChartProps) {
    const t = useTranslations('components')

    if (components.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 text-neutral-500 text-sm">
                {t('noComponents')}
            </div>
        )
    }

    const sorted = [...components]
        .map(c => ({ ...c, wear: calculateWearPercentage(c) }))
        .sort((a, b) => b.wear - a.wear)
        .slice(0, 6)

    const getWearColor = (wear: number, status: string) => {
        if (status === 'replaced') return 'from-neutral-500 to-neutral-600'
        if (wear >= 100 || status === 'danger') return 'from-danger-500 to-danger-400'
        if (wear >= 75 || status === 'warning') return 'from-warning-500 to-warning-400'
        return 'from-success-500 to-success-400'
    }

    return (
        <div className="space-y-3.5">
            {sorted.map((c, i) => (
                <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-neutral-300 truncate max-w-[55%]">
                            {c.is_custom ? c.name : t(`types.${c.type}`)}
                        </span>
                        <span className="text-xs font-bold tabular-nums">
                            {Math.round(c.wear)}%
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className={`h-full rounded-full bg-gradient-to-r ${getWearColor(c.wear, c.status)} transition-all duration-700`}
                            style={{ width: `${Math.max(2, c.wear)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
