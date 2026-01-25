'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bike, Mail, Lock, User, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Card } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

const registerSchema = z.object({
    name: z.string().min(1, 'Il nome è obbligatorio'),
    email: z.string().email('Email non valida'),
    password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const t = useTranslations('auth')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const password = watch('password', '')

    // Password strength indicators
    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                    },
                },
            })

            if (error) {
                toast.error(error.message)
                return
            }

            toast.success(t('registerSuccess'))
            router.push('/login')
        } catch {
            toast.error(tCommon('error'))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-secondary-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Bike className="w-7 h-7 text-white" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold">{t('register')}</h1>
                    <p className="text-neutral-400 mt-2">
                        {t('hasAccount')}{' '}
                        <Link href="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                            {t('login')}
                        </Link>
                    </p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label={t('name')}
                            type="text"
                            placeholder="Il tuo nome"
                            leftIcon={<User className="w-4 h-4" />}
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label={t('email')}
                            type="email"
                            placeholder="email@esempio.com"
                            leftIcon={<Mail className="w-4 h-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div>
                            <Input
                                label={t('password')}
                                type="password"
                                placeholder="••••••••"
                                leftIcon={<Lock className="w-4 h-4" />}
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            {/* Password strength */}
                            {password && (
                                <div className="mt-2 space-y-1">
                                    <PasswordCheck checked={hasMinLength} text="Almeno 8 caratteri" />
                                    <PasswordCheck checked={hasUppercase} text="Una lettera maiuscola" />
                                    <PasswordCheck checked={hasNumber} text="Un numero" />
                                </div>
                            )}
                        </div>

                        <Input
                            label={t('confirmPassword')}
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="w-4 h-4" />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('register')}
                        </Button>
                    </form>

                    {/* Terms */}
                    <p className="text-xs text-neutral-500 text-center mt-4 pt-4 border-t border-white/5">
                        Registrandoti accetti i nostri{' '}
                        <a href="#" className="text-primary-400 hover:underline">Termini di Servizio</a>
                        {' '}e la{' '}
                        <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
                    </p>
                </Card>

                {/* Back to home */}
                <p className="text-center mt-6 text-sm text-neutral-500">
                    <Link href="/" className="hover:text-neutral-300 transition-colors">
                        ← Torna alla home
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

function PasswordCheck({ checked, text }: { checked: boolean; text: string }) {
    return (
        <div className={`flex items-center gap-2 text-xs ${checked ? 'text-success-400' : 'text-neutral-500'}`}>
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${checked ? 'bg-success-500/20' : 'bg-neutral-700'}`}>
                {checked && <Check className="w-3 h-3" />}
            </div>
            {text}
        </div>
    )
}
