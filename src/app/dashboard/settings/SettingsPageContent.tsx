'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import {
    User,
    Globe,
    Bell,
    Link2,
    Trash2,
    Check,
    LogOut,
    ExternalLink,
    Fingerprint,
    Lock as LockIcon
} from 'lucide-react'
import { Card, Button, Input, Modal, StravaLogo } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { APP_CONFIG } from '@/lib/config'
import { Browser } from '@capacitor/browser'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'
import { biometricAuth } from '@/lib/biometric'
import { useEffect } from 'react'

interface SettingsPageContentProps {
    profile: any
    stravaConnected: boolean
    lastStravaSync?: string
}

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
}

const languages = [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export function SettingsPageContent({
    profile,
    stravaConnected,
    lastStravaSync,
}: SettingsPageContentProps) {
    const t = useTranslations('settings')
    const tStrava = useTranslations('strava')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const supabase = createClient()

    const [name, setName] = useState(profile?.name || '')
    const [selectedLocale, setSelectedLocale] = useState(profile?.locale || 'it')
    const [emailNotifications, setEmailNotifications] = useState(profile?.email_notifications ?? true)
    const [pushNotifications, setPushNotifications] = useState(profile?.push_notifications ?? true)
    const [biometricEnabled, setBiometricEnabled] = useState(false)
    const [biometricAvailable, setBiometricAvailable] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)
    const [accountModalOpen, setAccountModalOpen] = useState(false)
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [isUpdatingPass, setIsUpdatingPass] = useState(false)

    useEffect(() => {
        const checkBiometric = async () => {
            const available = await biometricAuth.isAvailable()
            setBiometricAvailable(available)
            if (available && profile?.id) {
                setBiometricEnabled(biometricAuth.isEnabledForUser(profile.id))
            }
        }
        checkBiometric()
    }, [profile?.id])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    name,
                    locale: selectedLocale,
                    email_notifications: emailNotifications,
                    push_notifications: pushNotifications,
                })
                .eq('id', profile.id)

            if (error) throw error

            // Update locale cookie
            Cookies.set('locale', selectedLocale, { expires: 365 })

            toast.success(t('toasts.settingsSaved'))

            // Save biometric preference locally
            if (biometricAvailable && profile?.id) {
                if (biometricEnabled) {
                    biometricAuth.enableForUser(profile.id)
                } else {
                    biometricAuth.disableForUser(profile.id)
                }
            }

            router.refresh()
        } catch {
            toast.error(t('toasts.settingsError'))
        } finally {
            setIsSaving(false)
        }
    }

    const handleDisconnectStrava = async () => {
        try {
            await supabase
                .from('strava_tokens')
                .delete()
                .eq('user_id', profile.id)

            toast.success(t('toasts.stravaDisconnected'))
            setDisconnectModalOpen(false)
            router.refresh()
        } catch {
            toast.error(t('toasts.disconnectError'))
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await supabase.auth.signOut()
            router.push('/')
        } catch {
            toast.error(t('toasts.deleteError'))
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPass !== confirmPass) {
            toast.error(t('toasts.passwordMismatch'))
            return
        }
        setIsUpdatingPass(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: newPass })
            if (error) throw error
            toast.success(t('toasts.passwordUpdated'))
            setAccountModalOpen(false)
            setNewPass('')
            setConfirmPass('')
        } catch (error: any) {
            toast.error(error.message || t('toasts.updateError'))
        } finally {
            setIsUpdatingPass(false)
        }
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={{
                animate: { transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-6 max-w-2xl"
        >
            {/* Header */}
            <motion.div variants={fadeIn}>
                <h1 className="text-2xl lg:text-3xl font-bold">{t('title')}</h1>
                <p className="text-neutral-400 mt-1">{t('subtitle')}</p>
            </motion.div>

            {/* Security & Account Section */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <LockIcon className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-lg font-semibold">{t('security.title')}</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex items-center justify-between">
                            <div>
                                <p className="font-medium">{t('security.password')}</p>
                                <p className="text-xs text-neutral-500 mt-1">{t('security.passwordDescription')}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    // We need to trigger the modal from the layout or move the modal here
                                    // For now, I'll use a custom event or a shared state if possible.
                                    // Actually, I'll just implement the modal here too for simplicity if needed,
                                    // or better, I'll add a section in the layout that listens for this.
                                    // But the user wants it VISIBLE.
                                    toast.info(t('toasts.useMenuHint'))
                                    // I'll actually implement the password change logic here too.
                                    setAccountModalOpen(true)
                                }}
                            >
                                {t('security.changePassword')}
                            </Button>
                        </div>

                        {biometricAvailable && (
                            <div className="pt-4 border-t border-white/5">
                                <ToggleOption
                                    label={t('security.biometric')}
                                    description={t('security.biometricDescription')}
                                    checked={biometricEnabled}
                                    onChange={setBiometricEnabled}
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Language Section */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-secondary-400" />
                        </div>
                        <h2 className="text-lg font-semibold">{t('language')}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLocale(lang.code)}
                                className={`
                  p-4 rounded-xl border transition-all text-left flex items-center gap-3
                  ${selectedLocale === lang.code
                                        ? 'bg-primary-500/10 border-primary-500/50'
                                        : 'bg-neutral-800/50 border-white/5 hover:border-white/10'
                                    }
                `}
                            >
                                <span className="text-2xl">{lang.flag}</span>
                                <span className="font-medium">{lang.name}</span>
                                {selectedLocale === lang.code && (
                                    <Check className="w-4 h-4 ml-auto text-primary-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Notifications Section */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-warning-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-warning-400" />
                        </div>
                        <h2 className="text-lg font-semibold">{t('notifications')}</h2>
                    </div>

                    <div className="space-y-4">
                        <ToggleOption
                            label={t('emailNotifications')}
                            description={t('emailNotificationsDescription')}
                            checked={emailNotifications}
                            onChange={setEmailNotifications}
                        />
                        <ToggleOption
                            label={t('pushNotifications')}
                            description={t('pushNotificationsDescription')}
                            checked={pushNotifications}
                            onChange={async (checked) => {
                                if (checked) {
                                    const { notificationService } = await import('@/lib/notifications')
                                    const granted = await notificationService.requestPermissions()
                                    if (!granted) {
                                        toast.error(t('toasts.notificationDenied'))
                                        return
                                    }
                                }
                                setPushNotifications(checked)
                            }}
                        />

                        {biometricAvailable && (
                            <div className="pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <Fingerprint className="w-5 h-5 text-primary-400" />
                                    <h3 className="font-semibold">{t('security.title')}</h3>
                                </div>
                                <ToggleOption
                                    label={t('security.biometric')}
                                    description={t('security.biometricDescription')}
                                    checked={biometricEnabled}
                                    onChange={setBiometricEnabled}
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Strava Section */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/10 flex items-center justify-center">
                            <StravaLogo variant="mark" className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold">{t('stravaIntegration')}</h2>
                    </div>

                    {stravaConnected ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-success-500/10 border border-success-500/20">
                                <div className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-success-400" />
                                    <div>
                                        <p className="font-medium text-success-400">{tStrava('connected')}</p>
                                        {lastStravaSync && (
                                            <p className="text-sm text-neutral-400">
                                                {t('strava_section.lastSync')}: {formatDistanceToNow(new Date(lastStravaSync), { addSuffix: true, locale: it })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDisconnectModalOpen(true)}
                                >
                                    {tStrava('disconnect')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-neutral-400 mb-4">
                                {t('strava_section.syncDescription')}
                            </p>
                            <Button
                                variant="ghost"
                                className="p-0 h-auto hover:bg-transparent"
                                onClick={async () => {
                                    const authUrl = APP_CONFIG.getApiUrl('/api/auth/strava')
                                    if (APP_CONFIG.isMobile) {
                                        await Browser.open({ url: authUrl })
                                    } else {
                                        window.location.href = authUrl
                                    }
                                }}
                            >
                                <StravaLogo variant="connect-button" />
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <StravaLogo />
                    </div>
                </Card>
            </motion.div>

            {/* Support Section - NEW for Strava Review */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold">{t('support.title')}</h2>
                    </div>
                    <p className="text-neutral-400 text-sm mb-4">
                        {t('support.description')}
                    </p>
                    <div className="p-4 rounded-xl bg-neutral-900 border border-white/5">
                        <p className="text-sm text-neutral-300">{t('support.emailText')}:</p>
                        <a href="mailto:support@mybikelog.app" className="text-primary-400 font-medium hover:underline">
                            support@mybikelog.app
                        </a>
                    </div>
                </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div variants={fadeIn}>
                <Button onClick={handleSave} loading={isSaving} fullWidth size="lg">
                    {t('saveButton')}
                </Button>
            </motion.div>

            {/* Danger Zone */}
            <motion.div variants={fadeIn}>
                <Card className="!border-danger-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-danger-500/10 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-danger-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-danger-400">{t('deleteAccount')}</h2>
                    </div>
                    <p className="text-neutral-400 text-sm mb-4">
                        {t('deleteAccountWarning')}
                    </p>
                    <Button
                        variant="danger"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        {t('deleteButton')}
                    </Button>
                </Card>
            </motion.div>

            {/* Disconnect Strava Modal */}
            <Modal
                isOpen={disconnectModalOpen}
                onClose={() => setDisconnectModalOpen(false)}
                title={t('disconnectStravaTitle')}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-neutral-400">
                        {t('disconnectStravaMessage')}
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" fullWidth onClick={() => setDisconnectModalOpen(false)}>
                            {tCommon('cancel')}
                        </Button>
                        <Button variant="danger" fullWidth onClick={handleDisconnectStrava}>
                            {t('disconnectButton')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title={t('deleteAccountTitle')}
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-neutral-400">
                        {t('deleteAccountMessage')}
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" fullWidth onClick={() => setDeleteModalOpen(false)}>
                            {tCommon('cancel')}
                        </Button>
                        <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
                            {t('deleteAccountConfirm')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Password Modal */}
            <Modal
                isOpen={accountModalOpen}
                onClose={() => setAccountModalOpen(false)}
                title={t('security.changePassword')}
                size="sm"
            >
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <Input
                        label={t('security.newPassword')}
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                    />
                    <Input
                        label={t('security.confirmPassword')}
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required
                    />
                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" fullWidth onClick={() => setAccountModalOpen(false)}>
                            {tCommon('cancel')}
                        </Button>
                        <Button type="submit" fullWidth loading={isUpdatingPass}>
                            {tCommon('save')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    )
}

// Toggle Option Component
function ToggleOption({
    label,
    description,
    checked,
    onChange,
}: {
    label: string
    description: string
    checked: boolean
    onChange: (value: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`
          relative w-12 h-6 rounded-full transition-colors
          ${checked ? 'bg-primary-500' : 'bg-neutral-700'}
        `}
            >
                <div
                    className={`
            absolute top-1 w-4 h-4 rounded-full bg-white transition-transform
            ${checked ? 'left-7' : 'left-1'}
          `}
                />
            </button>
        </div>
    )
}
