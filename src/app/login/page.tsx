'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bike, Mail, Lock, Loader2, Fingerprint } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Card, StravaLogo } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { biometricAuth } from '@/lib/biometric'
import { useEffect } from 'react'

const loginSchema = z.object({
    email: z.string().email('Email non valida'),
    password: z.string().min(1, 'La password è obbligatoria'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const t = useTranslations('auth')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)

    useEffect(() => {
        const checkBiometric = async () => {
            const available = await biometricAuth.isAvailable()
            const lastUser = biometricAuth.getLastUser()
            const enabled = lastUser ? biometricAuth.isEnabledForUser(lastUser) : false
            setIsBiometricAvailable(available && enabled)

            // Auto-trigger biometric if available and enabled
            if (available && enabled) {
                handleBiometricLogin()
            }
        }
        checkBiometric()
    }, [])

    const handleBiometricLogin = async () => {
        const success = await biometricAuth.authenticate()
        if (success) {
            // In a real app, we would store a secure token or use Supabase's persistence.
            // For now, if authentication is successful, we try to refresh the session
            // or just redirect if the session is already valid.
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                toast.success(t('loginSuccess'))
                router.push('/dashboard')
            } else {
                toast.error('Sessione scaduta, effettua il login con password')
            }
        }
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            })

            if (error) {
                toast.error(t('invalidCredentials'))
                return
            }

            // Save last user ID for biometric association
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                biometricAuth.setLastUser(user.id)
            }

            toast.success(t('loginSuccess'))
            router.push('/dashboard')
            router.refresh()
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
                <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-secondary-500/20 rounded-full blur-[100px]" />
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
                    <h1 className="text-2xl font-bold">{t('login')}</h1>
                    <p className="text-neutral-400 mt-2">
                        {t('noAccount')}{' '}
                        <Link href="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                            {t('register')}
                        </Link>
                    </p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label={t('email')}
                            type="email"
                            placeholder="email@esempio.com"
                            leftIcon={<Mail className="w-4 h-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label={t('password')}
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="w-4 h-4" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                            >
                                {t('forgotPassword')}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('login')}
                        </Button>

                        {isBiometricAvailable && (
                            <div className="pt-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    fullWidth
                                    onClick={handleBiometricLogin}
                                    icon={<Fingerprint className="w-5 h-5" />}
                                >
                                    Usa Biometria
                                </Button>
                            </div>
                        )}
                    </form>
                </Card>

                {/* Back to home */}
                <p className="text-center mt-6 text-sm text-neutral-500">
                    <Link href="/" className="hover:text-neutral-300 transition-colors">
                        ← Torna alla home
                    </Link>
                </p>

                <div className="mt-8 pt-8 border-t border-white/5 opacity-50">
                    <p className="text-center text-[10px] text-neutral-600 uppercase tracking-tighter">Powered by mechanical precision</p>
                </div>
            </motion.div>
        </div>
    )
}
