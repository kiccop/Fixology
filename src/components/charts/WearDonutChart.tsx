'use client'

import { useTranslations } from 'next-intl'

interface WearDonutProps {
    ok: number
    warning: number
    danger: number
    replaced: number
}

export function WearDonutChart({ ok, warning, danger, replaced }: WearDonutProps) {
    const t = useTranslations('components')
    const total = ok + warning + danger + replaced

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                <div className="w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold">0</span>
                </div>
                <p className="text-xs">{t('noComponents')}</p>
            </div>
        )
    }

    const segments = [
        { value: ok, color: '#10b981', label: t('status.ok') },
        { value: warning, color: '#f59e0b', label: t('status.warning') },
        { value: danger, color: '#ef4444', label: t('status.danger') },
        { value: replaced, color: '#6b7280', label: t('status.replaced') },
    ].filter(s => s.value > 0)

    const radius = 52
    const circumference = 2 * Math.PI * radius
    let offset = 0

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                    />
                    {segments.map((segment, i) => {
                        const dash = (segment.value / total) * circumference
                        const circle = (
                            <circle
                                key={i}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="12"
                                strokeDasharray={`${dash} ${circumference - dash}`}
                                strokeDashoffset={-offset}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dasharray 0.5s ease' }}
                            />
                        )
                        offset += dash
                        return circle
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black italic tracking-tighter">{total}</span>
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Total</span>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                {segments.map((segment, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="text-xs text-neutral-400">{segment.label}</span>
                        <span className="text-xs font-bold text-neutral-200">{segment.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
