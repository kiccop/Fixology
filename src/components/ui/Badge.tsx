'use client'

import { ComponentStatus } from '@/types'

interface BadgeProps {
    status: ComponentStatus
    children: React.ReactNode
    size?: 'sm' | 'md'
    dot?: boolean
}

const statusClasses = {
    ok: 'status-ok',
    warning: 'status-warning',
    danger: 'status-danger',
    replaced: 'bg-neutral-700 text-neutral-300 border border-neutral-600',
}

const dotColors = {
    ok: 'bg-success-400',
    warning: 'bg-warning-400',
    danger: 'bg-danger-400',
    replaced: 'bg-neutral-400',
}

export function Badge({ status, children, size = 'md', dot = true }: BadgeProps) {
    const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : ''

    return (
        <span className={`status-badge ${statusClasses[status]} ${sizeClass}`}>
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]} animate-pulse`} />
            )}
            {children}
        </span>
    )
}

// Simple variant badge
interface SimpleBadgeProps {
    variant?: 'default' | 'primary' | 'secondary'
    children: React.ReactNode
}

export function SimpleBadge({ variant = 'default', children }: SimpleBadgeProps) {
    const variantClasses = {
        default: 'bg-neutral-700/50 text-neutral-300 border border-neutral-600/50',
        primary: 'bg-primary-500/15 text-primary-400 border border-primary-500/30',
        secondary: 'bg-secondary-500/15 text-secondary-400 border border-secondary-500/30',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${variantClasses[variant]}`}>
            {children}
        </span>
    )
}
