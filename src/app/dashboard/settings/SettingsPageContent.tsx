'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
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
} from 'lucide-react'
import { Card, Button, Input, Modal } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { it } from 'date-fns/locale'

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
    const router = useRouter()
    const supabase = createClient()

    const [name, setName] = useState(profile?.name || '')
    const [selectedLocale, setSelectedLocale] = useState(profile?.locale || 'it')
    const [emailNotifications, setEmailNotifications] = useState(profile?.email_notifications ?? true)
    const [pushNotifications, setPushNotifications] = useState(profile?.push_notifications ?? true)
    const [isSaving, setIsSaving] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [disconnectModalOpen, setDisconnectModalOpen] = useState(false)

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

            toast.success('Impostazioni salvate')
            router.refresh()
        } catch {
            toast.error('Errore durante il salvataggio')
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

            toast.success('Strava disconnesso')
            setDisconnectModalOpen(false)
            router.refresh()
        } catch {
            toast.error('Errore durante la disconnessione')
        }
    }

    const handleDeleteAccount = async () => {
        try {
            // This would need a server action or API route for full deletion
            await supabase.auth.signOut()
            router.push('/')
        } catch {
            toast.error('Errore durante l\'eliminazione')
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
                <p className="text-neutral-400 mt-1">Gestisci il tuo account e le preferenze</p>
            </motion.div>

            {/* Account Section */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-400" />
                        </div>
                        <h2 className="text-lg font-semibold">{t('account')}</h2>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Il tuo nome"
                        />

                        <div>
                            <label className="label">Email</label>
                            <div className="input !bg-neutral-900 !cursor-not-allowed opacity-70">
                                {profile?.email}
                            </div>
                            <p className="text-xs text-neutral-500 mt-1">L&apos;email non può essere modificata</p>
                        </div>
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
                            description="Ricevi email quando un componente necessita manutenzione"
                            checked={emailNotifications}
                            onChange={setEmailNotifications}
                        />
                        <ToggleOption
                            label={t('pushNotifications')}
                            description="Ricevi notifiche push nel browser"
                            checked={pushNotifications}
                            onChange={setPushNotifications}
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Strava Section */}
            <motion.div variants={fadeIn}>
                <Card>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/10 flex items-center justify-center">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FC4C02">
                                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                            </svg>
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
                                                Ultima sync: {formatDistanceToNow(new Date(lastStravaSync), { addSuffix: true, locale: it })}
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
                                Connetti Strava per importare automaticamente le tue bici e sincronizzare i km
                            </p>
                            <a href="/api/auth/strava">
                                <Button className="!bg-[#FC4C02] hover:!bg-[#FC4C02]/80">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    {tStrava('connect')}
                                </Button>
                            </a>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div variants={fadeIn}>
                <Button onClick={handleSave} loading={isSaving} fullWidth size="lg">
                    Salva modifiche
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
                        Elimina account
                    </Button>
                </Card>
            </motion.div>

            {/* Disconnect Strava Modal */}
            <Modal
                isOpen={disconnectModalOpen}
                onClose={() => setDisconnectModalOpen(false)}
                title="Disconnetti Strava"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-neutral-400">
                        Sei sicuro di voler disconnettere Strava? Le tue bici rimarranno, ma non si sincronizzeranno più automaticamente.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" fullWidth onClick={() => setDisconnectModalOpen(false)}>
                            Annulla
                        </Button>
                        <Button variant="danger" fullWidth onClick={handleDisconnectStrava}>
                            Disconnetti
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Elimina account"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-neutral-400">
                        Questa azione è irreversibile. Tutti i tuoi dati, bici e componenti verranno eliminati permanentemente.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="ghost" fullWidth onClick={() => setDeleteModalOpen(false)}>
                            Annulla
                        </Button>
                        <Button variant="danger" fullWidth onClick={handleDeleteAccount}>
                            Elimina definitivamente
                        </Button>
                    </div>
                </div>
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
