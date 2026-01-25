'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
    variant?: ButtonVariant
    size?: ButtonSize
    loading?: boolean
    icon?: React.ReactNode
    iconPosition?: 'left' | 'right'
    fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
    success: 'btn-success',
}

const sizes: Record<ButtonSize, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            icon,
            iconPosition = 'left',
            fullWidth = false,
            children,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const buttonClasses = `
      btn 
      ${variants[variant]} 
      ${sizes[size]} 
      ${fullWidth ? 'w-full' : ''} 
      ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
      ${className}
    `.trim()

        return (
            <motion.button
                ref={ref}
                className={buttonClasses}
                disabled={disabled || loading}
                whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
                whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
                transition={{ duration: 0.15 }}
                {...props}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    iconPosition === 'left' && icon
                )}
                <>{children}</>
                {!loading && iconPosition === 'right' && icon}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'
