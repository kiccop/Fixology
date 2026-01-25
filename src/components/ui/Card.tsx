'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface CardProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    interactive?: boolean
    glow?: 'primary' | 'secondary' | 'none'
    padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
}

export function Card({
    children,
    interactive = false,
    glow = 'none',
    padding = 'md',
    className = '',
    ...props
}: CardProps) {
    const glowClass = glow === 'primary'
        ? 'glow-primary'
        : glow === 'secondary'
            ? 'glow-secondary'
            : ''

    return (
        <motion.div
            className={`
        card 
        ${paddingClasses[padding]}
        ${interactive ? 'card-interactive cursor-pointer' : ''} 
        ${glowClass}
        ${className}
      `.trim()}
            whileHover={interactive ? { y: -4 } : undefined}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// Card Header component
interface CardHeaderProps {
    title: string
    subtitle?: string
    action?: ReactNode
    icon?: ReactNode
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
    return (
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-primary-500/10 text-primary-400">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="font-semibold text-neutral-100">{title}</h3>
                    {subtitle && (
                        <p className="text-sm text-neutral-400">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}

// Card Content
export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>
}

// Card Footer
export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div className={`mt-4 pt-4 border-t border-white/5 ${className}`}>
            {children}
        </div>
    )
}
