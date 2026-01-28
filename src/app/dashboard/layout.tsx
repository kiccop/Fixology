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
    Lock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StravaLogo, Modal, Button, Input } from '@/components/ui'
import { useEffect } from 'react'

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
    { href: '/dashboard/bikes', icon: Bike, labelKey: 'bikes' },
    { href: '/dashboard/notifications', icon: Bell, labelKey: 'notifications' },
    { href: '/dashboard/settings', icon: Settings, labelKey: 'settings' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const t = useTranslations('nav')
    const tCommon = useTranslations('common')
    const tAuth = useTranslations('auth')
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

        // Optional: Set up real-time subscription
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
        <div className="min-h-screen flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-neutral-900/95 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-8 border-b border-white/5 bg-black/20">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/10 group-hover:scale-105 transition-transform">
                                <Bike className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter text-white uppercase italic group-hover:text-primary-400 transition-colors">{tCommon('appName')}</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href))

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                            : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/5'
                                        }
                  `}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{t(item.labelKey)}</span>
                                    {item.labelKey === 'notifications' && unreadCount > 0 && (
                                        <span className="ml-auto w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-white/5">
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary-400" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium text-sm truncate max-w-[120px]">{userName || t('user')}</div>
                                    <div className="text-xs text-neutral-500">{t('account')}</div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-xl bg-neutral-800 border border-white/10"
                                    >
                                        <div className="border-b border-white/5 pb-2 mb-2">
                                            <button
                                                onClick={() => {
                                                    setPasswordModalOpen(true)
                                                    setUserMenuOpen(false)
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-300 hover:bg-white/5 transition-colors"
                                            >
                                                <Key className="w-4 h-4" />
                                                <span className="text-sm">Cambia Password</span>
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger-400 hover:bg-danger-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">{tAuth('logout')}</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Strava Attribution - Footer of Sidebar */}
                    <div className="p-8 border-t border-white/5 bg-black/40">
                        <div className="flex flex-col gap-4">
                            <StravaLogo className="scale-90" />
                            <p className="text-[10px] text-neutral-600 font-medium leading-tight">
                                © {new Date().getFullYear()} {tCommon('appName')}<br />
                                All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5 px-4 flex items-center lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="ml-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Bike className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gradient">{tCommon('appName')}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile sidebar close button */}
            {sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="fixed top-4 right-4 z-50 p-2 rounded-full bg-neutral-800 text-white lg:hidden"
                >
                    <X className="w-6 h-6" />
                </button>
            )}

            {/* Change Password Modal */}
            <Modal
                isOpen={passwordModalOpen}
                onClose={() => {
                    if (!isUpdatingPassword) setPasswordModalOpen(false)
                }}
                title="Aggiorna password"
                size="sm"
            >
                <form onSubmit={handleUpdatePassword} className="space-y-4">
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
                    <div className="flex gap-3 pt-2">
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
