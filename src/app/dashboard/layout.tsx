'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
    LayoutDashboard,
    Bike,
    Settings,
    Bell,
    LogOut,
    Menu,
    X,
    User,
    ChevronDown,
    Key,
    Loader2,
    Lock,
    History,
    BookOpen
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StravaLogo, Modal, Button, Input } from '@/components/ui'
import { useEffect } from 'react'

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
    { href: '/dashboard/bikes', icon: Bike, labelKey: 'bikes' },
    { href: '/dashboard/guide', icon: BookOpen, labelKey: 'guide' },
    { href: '/dashboard/notifications', icon: Bell, labelKey: 'notifications' },
    { href: '/dashboard/settings', icon: Settings, labelKey: 'settings' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const t = useTranslations('nav')
    const tCommon = useTranslations('common')
    const tAuth = useTranslations('auth')
    const tSettings = useTranslations('settings')
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [userName, setUserName] = useState('')

    // Password state
    const [passwordModalOpen, setPasswordModalOpen] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch unread notifications
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('read', false)

            setUnreadCount(count || 0)

            // Fetch user profile name
            const { data: profile } = await supabase
                .from('profiles')
                .select('name')
                .eq('id', user.id)
                .single()

            if (profile?.name) {
                setUserName(profile.name)
            } else {
                setUserName(user.email?.split('@')[0] || 'Ciclista')
            }
        }

        fetchUserData()

        const channel = supabase
            .channel('unread-notifications')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications'
            }, () => {
                fetchUserData()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast.error('Le password non corrispondono')
            return
        }
        if (newPassword.length < 8) {
            toast.error('La password deve avere almeno 8 caratteri')
            return
        }

        setIsUpdatingPassword(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })
            if (error) throw error
            toast.success('Password aggiornata con successo')
            setPasswordModalOpen(false)
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            toast.error(error.message || 'Errore durante l\'aggiornamento')
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-black lg:gap-8">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-neutral-950 border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full bg-gradient-to-b from-neutral-900/50 to-transparent">
                    {/* Logo */}
                    <div className="p-6 h-24 flex items-center">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <Bike className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white uppercase italic">MYBIKELOG</span>
                        </Link>
                    </div>

                    {/* Main Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-10 py-12 space-y-24">
                        {/* Navigation */}
                        <div className="space-y-12">
                            <p className="px-4 text-[12px] font-bold text-neutral-500 uppercase tracking-[0.25em] mb-8">Menu Principale</p>
                            <nav className="space-y-8">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href ||
                                        (item.href !== '/dashboard' && pathname.startsWith(item.href))

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`
                                                flex items-center gap-6 px-7 py-6 rounded-2xl
                                                transition-all duration-200 group relative
                                                ${isActive
                                                    ? 'bg-white/10 text-white shadow-sm'
                                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    className="absolute left-0 w-2 h-12 bg-primary-500 rounded-full"
                                                />
                                            )}
                                            <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-primary-400' : 'group-hover:text-primary-400'}`} />
                                            <span className="font-bold text-base tracking-tight">{t(item.labelKey)}</span>
                                            {item.labelKey === 'notifications' && unreadCount > 0 && (
                                                <span className="ml-auto px-2 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-black">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Account Section */}
                        <div className="space-y-12">
                            <p className="px-4 text-[12px] font-bold text-neutral-500 uppercase tracking-[0.25em] mb-8">Il Tuo Account</p>
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className={`
                                        w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200
                                        ${userMenuOpen ? 'bg-white/5 shadow-inner' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/5 flex items-center justify-center shrink-0">
                                        <User className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-black text-base text-white truncate">{userName || t('user')}</div>
                                        <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-widest">{t('account')}</div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-neutral-600 transition-transform duration-300 ${userMenuOpen ? 'rotate-180 text-white' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="overflow-hidden bg-white/[0.03] rounded-2xl border border-white/5"
                                        >
                                            <div className="p-2 space-y-1">
                                                <button
                                                    onClick={() => {
                                                        setPasswordModalOpen(true)
                                                        setUserMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center">
                                                        <Key className="w-3.5 h-3.5" />
                                                    </div>
                                                    {tSettings('security.changePassword')}
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger-400 hover:bg-danger-500/10 transition-all text-sm font-medium"
                                                >
                                                    <div className="w-7 h-7 rounded-lg bg-danger-500/10 flex items-center justify-center">
                                                        <LogOut className="w-3.5 h-3.5 text-danger-400" />
                                                    </div>
                                                    {tAuth('logout')}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Footer attribution pinned to bottom */}
                    <div className="mt-auto p-4 lg:p-6 border-t border-white/5 bg-black/20">
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                            <StravaLogo className="opacity-80 scale-90 -translate-x-1" />
                            <div className="space-y-1">
                                <p className="text-[10px] text-neutral-600 font-bold tracking-tight leading-none uppercase">
                                    © {new Date().getFullYear()} {tCommon('appName')}
                                </p>
                                <p className="text-[9px] text-neutral-700 font-medium">Versione 2.1.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar - Mobile only */}
                <header className="sticky top-0 z-30 h-24 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center lg:hidden pt-[max(env(safe-area-inset-top),32px)]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors touch-manipulation"
                    >
                        <Menu className="w-7 h-7 text-white" />
                    </button>
                    <div className="ml-4 flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                            <Bike className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-base tracking-tighter uppercase italic text-white leading-none">MYBIKELOG</span>
                    </div>
                    <Link href="/dashboard/settings" className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-400" />
                    </Link>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-10 pb-safe overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Change Password Modal */}
            <Modal
                isOpen={passwordModalOpen}
                onClose={() => {
                    if (!isUpdatingPassword) setPasswordModalOpen(false)
                }}
                title={tAuth('password')}
                size="sm"
            >
                <form onSubmit={handleUpdatePassword} className="space-y-4 pt-4">
                    <Input
                        label="Nuova Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4" />}
                    />
                    <Input
                        label="Conferma Password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4" />}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="ghost"
                            fullWidth
                            type="button"
                            onClick={() => setPasswordModalOpen(false)}
                            disabled={isUpdatingPassword}
                        >
                            Annulla
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            type="submit"
                            loading={isUpdatingPassword}
                        >
                            Aggiorna
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
