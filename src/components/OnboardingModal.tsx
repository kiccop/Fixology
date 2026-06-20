'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Bike, Link2, Wrench, X, ArrowRight, Check } from 'lucide-react'
import { Button, StravaLogo } from '@/components/ui'
import { APP_CONFIG } from '@/lib/config'
import { Browser } from '@capacitor/browser'

export function OnboardingModal() {
    const t = useTranslations('dashboard.onboarding')
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(0)

    useEffect(() => {
        const seen = localStorage.getItem('onboarding-completed')
        if (!seen) {
            const timer = setTimeout(() => setIsOpen(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
        localStorage.setItem('onboarding-completed', 'true')
    }

    const handleSkip = () => {
        handleClose()
    }

    const handleFinish = () => {
        handleClose()
    }

    const handleConnectStrava = async () => {
        const authUrl = APP_CONFIG.getApiUrl('/api/auth/strava')
        if (APP_CONFIG.isMobile) {
            await Browser.open({ url: authUrl })
        } else {
            window.location.href = authUrl
        }
        setStep(1)
    }

    const steps = [
        {
            icon: Link2,
            title: t('step1'),
            description: t('step1Description'),
            action: (
                <Button onClick={handleConnectStrava} fullWidth icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    {t('connectStrava')}
                </Button>
            ),
            actionSecondary: true,
        },
        {
            icon: Bike,
            title: t('step2'),
            description: t('step2Description'),
            action: (
                <Button onClick={() => { router.push('/dashboard/bikes'); handleClose() }} fullWidth icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                    {t('addBike')}
                </Button>
            ),
            actionSecondary: true,
        },
        {
            icon: Wrench,
            title: t('step3'),
            description: t('step3Description'),
            action: (
                <Button onClick={() => { router.push('/dashboard/bikes'); handleClose() }} fullWidth icon={<Check className="w-4 h-4" />} iconPosition="right">
                    {t('addComponent')}
                </Button>
            ),
            actionSecondary: false,
        },
    ]

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-lg text-neutral-500 hover:text-white hover:bg-white/5 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Progress indicator */}
                        <div className="flex gap-2 p-6 pb-0">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                        i <= step ? 'bg-primary-500' : 'bg-white/10'
                                    }`}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Icon */}
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-white/5 flex items-center justify-center">
                                            {steps[step].icon === Link2 ? (
                                                <StravaLogo variant="mark" className="w-8 h-8" />
                                            ) : (
                                                (() => {
                                                    const Icon = steps[step].icon
                                                    return <Icon className="w-8 h-8 text-primary-400" />
                                                })()
                                            )}
                                        </div>
                                    </div>

                                    {/* Step indicator */}
                                    <div className="text-center">
                                        <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold">
                                            {step + 1} / {steps.length}
                                        </span>
                                    </div>

                                    {/* Title & description */}
                                    <div className="text-center space-y-2">
                                        <h2 className="text-xl font-bold tracking-tight">
                                            {step === 0 ? t('welcome') : steps[step].title}
                                        </h2>
                                        <p className="text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto">
                                            {step === 0 ? t('welcomeDescription') : steps[step].description}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <div className="space-y-3 pt-2">
                                        {steps[step].action}
                                        {steps[step].actionSecondary && (
                                            <button
                                                onClick={() => setStep(step + 1)}
                                                className="w-full text-xs text-neutral-500 hover:text-neutral-300 transition-colors py-2"
                                            >
                                                {t('skip')} →
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Bottom navigation */}
                            {step < steps.length - 1 ? (
                                <div className="flex justify-between pt-4 mt-4 border-t border-white/5">
                                    <button
                                        onClick={handleSkip}
                                        className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                                    >
                                        {t('skip')}
                                    </button>
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        {t('next')} →
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 mt-4 border-t border-white/5">
                                    <Button onClick={handleFinish} fullWidth variant="primary">
                                        {t('finish')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
