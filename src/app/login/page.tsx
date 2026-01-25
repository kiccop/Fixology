'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bike, Mail, Lock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input, Card, StravaLogo } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

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
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-neutral-800 text-neutral-500">
                                {tCommon('or')}
                            </span>
                        </div>
                    </div>

                    {/* Strava Connect */}
                    <Link href="/api/auth/strava">
                        <StravaLogo variant="connect-button" className="w-full justify-center shadow-lg transform active:scale-95 transition-all" />
                    </Link>
                </Card>

                {/* Back to home */}
                <p className="text-center mt-6 text-sm text-neutral-500">
                    <Link href="/" className="hover:text-neutral-300 transition-colors">
                        ← Torna alla home
                    </Link>
                </p>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <StravaLogo />
                </div>
            </motion.div>
        </div>
    )
}
