'use client'

import { ComponentStatus } from '@/types'

interface BadgeProps {
    status?: ComponentStatus | 'default' | 'primary' | 'secondary' | 'outline'
    children: React.ReactNode
    size?: 'sm' | 'md'
    dot?: boolean
    className?: string
}

const statusClasses = {
    ok: 'status-ok',
    warning: 'status-warning',
    danger: 'status-danger',
    replaced: 'bg-neutral-800 text-neutral-400 border border-white/10',
    default: 'bg-neutral-800 text-neutral-400 border border-white/10',
    primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
    secondary: 'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20',
    outline: 'bg-transparent text-neutral-400 border border-white/10',
}

const dotColors = {
    ok: 'bg-success-400',
    warning: 'bg-warning-400',
    danger: 'bg-danger-400',
    replaced: 'bg-neutral-500',
    default: 'bg-neutral-500',
    primary: 'bg-primary-400',
    secondary: 'bg-secondary-400',
    outline: 'bg-neutral-500',
}

export function Badge({ status = 'default', children, size = 'md', dot = false, className = '' }: BadgeProps) {
    const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''
    // @ts-ignore
    const statusClass = statusClasses[status] || statusClasses.default
    // @ts-ignore
    const dotColor = dotColors[status] || dotColors.default

    return (
        <span className={`status-badge ${statusClass} ${sizeClass} ${className}`}>
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${status === 'danger' ? 'animate-pulse' : ''}`} />
            )}
            {children}
        </span>
    )
}
