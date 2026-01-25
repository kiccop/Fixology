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
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
    { href: '/dashboard/bikes', icon: Bike, labelKey: 'bikes' },
    { href: '/dashboard/notifications', icon: Bell, labelKey: 'notifications' },
    { href: '/dashboard/settings', icon: Settings, labelKey: 'settings' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const t = useTranslations('nav')
    const tCommon = useTranslations('common')
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
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
                    <div className="p-6 border-b border-white/5">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <Bike className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">{tCommon('appName')}</span>
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
                                    {item.labelKey === 'notifications' && (
                                        <span className="ml-auto w-5 h-5 rounded-full bg-danger-500 text-white text-xs flex items-center justify-center">
                                            3
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
                                    <div className="font-medium text-sm">Utente</div>
                                    <div className="text-xs text-neutral-500">Account</div>
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
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-danger-400 hover:bg-danger-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-sm">Esci</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Strava Attribution - Footer of Sidebar */}
                    <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col items-center gap-2">
                        <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-medium">Integrazione Ufficiale</p>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FC4C02]/10 border border-[#FC4C02]/20">
                            <span className="text-[10px] text-neutral-300 font-semibold uppercase">Powered by</span>
                            <svg className="w-12 h-3" viewBox="0 0 54 11" fill="#FC4C02">
                                <path d="M7.4 2.8c-1.2 0-2.3.6-2.9 1.6V3h-1v7.6h1V6.2c.6-1 1.6-1.6 2.8-1.6.8 0 1.5.3 2 .8s.7 1.2.7 2.1v3.1h1V7.5c0-1.2-.3-2-.9-2.7-.6-.8-1.6-1.3-2.7-1.3zM25 .3V3h1.2v.9h-1.2v4.2c0 .5.1.8.3 1 .2.2.5.3.9.3.5 0 1-.2 1.3-.4l.3.8c-.4.3-1 .5-1.7.5s-1.2-.2-1.5-.6c-.3-.4-.4-1-.4-1.6V3.9h-.9V3h.9V1.3l1-1zM53.5 3h-1.2l-2.6 6.3L47 .3H46l3.1 7.2-1.3 3.1h1l4.7-7.6zM17.4 3h-1.1v7.6h1l.1-3.6c.3 0 .7.1 1.1.1 1.1 0 2-.4 2.7-1.1.6-.8 1-1.7 1-2.9 0-1.1-.3-2.1-1-2.8-.7-.7-1.6-1.1-2.7-1.1-1.1-.1-2.4 0-3 .6s-.8 1.5-.8 2.5c0 .3 0 .6.1.9l.9-.1c0-.2-.1-.5-.1-.8 0-1.4.6-2.1 1.7-2.1.8 0 1.4.3 1.9.9.5.6.7 1.4.7 2.3s-.2 1.8-.7 2.4c-.4.6-1.1.9-1.9.9-.4 0-.8-.1-1.1-.2V3zm17 0c-1.3 0-2.4.5-3.1 1.4-.7 1-1.1 2.1-1.1 3.2 0 1.1.4 2.2 1.1 3.1.7.9 1.8 1.4 3.1 1.4 1.3 0 2.4-.5 3.1-1.4.7-1 1.1-2.1 1.1-3.2 0-1.1-.4-2.1-1.1-3.1s-1.8-1.4-3.1-1.4zm0 8.2c-1.1 0-1.9-.4-2.4-1.2-.5-.8-.8-1.7-.8-2.7 0-1.1.3-2 .8-2.8.5-.8 1.3-1.2 2.4-1.2s1.9.4 2.4 1.2.8 1.7.8 2.8c0 1.1-.3 2-.8 2.8s-1.3 1.1-2.4 1.1zm8.1-5.4l1.3-2.8h-1.1l-.8 1.8-.8-1.8h-1.1l1.3 2.8-1.5 3.1h1.1l.4-.9.4.9h1.1l-1.5-3.1z" />
                            </svg>
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
        </div>
    )
}
