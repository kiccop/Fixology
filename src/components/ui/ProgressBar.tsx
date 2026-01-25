'use client'

import { motion } from 'framer-motion'
import { ComponentStatus } from '@/types'

interface ProgressBarProps {
    value: number // 0-100
    status?: ComponentStatus
    showLabel?: boolean
    size?: 'sm' | 'md' | 'lg'
    animated?: boolean
}

const statusColors = {
    ok: 'progress-ok',
    warning: 'progress-warning',
    danger: 'progress-danger',
    replaced: 'bg-neutral-500',
}

const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
}

export function ProgressBar({
    value,
    status = 'ok',
    showLabel = false,
    size = 'md',
    animated = true,
}: ProgressBarProps) {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value))

    // Auto-determine status based on value if not explicitly set
    const autoStatus = status !== 'replaced'
        ? value >= 100
            ? 'danger'
            : value >= 75
                ? 'warning'
                : 'ok'
        : status

    return (
        <div className="w-full">
            <div className={`progress-bar ${heights[size]}`}>
                <motion.div
                    className={`progress-fill ${statusColors[autoStatus]}`}
                    initial={animated ? { width: 0 } : { width: `${clampedValue}%` }}
                    animate={{ width: `${clampedValue}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between mt-1 text-xs text-neutral-400">
                    <span>{Math.round(clampedValue)}%</span>
                    {value > 100 && (
                        <span className="text-danger-400 font-medium">
                            +{Math.round(value - 100)}% oltre
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
