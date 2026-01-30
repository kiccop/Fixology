'use client'

import { useState, useEffect } from 'react'
import { APP_CONFIG } from '@/lib/config'
import { X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Don't show on mobile app
        if (APP_CONFIG.isMobile) return

        // Check if user already accepted
        const accepted = localStorage.getItem('cookies-accepted')
        if (!accepted) {
            // Show after a short delay for better UX
            const timer = setTimeout(() => setVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const accept = () => {
        localStorage.setItem('cookies-accepted', 'true')
        setVisible(false)
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-neutral-900/95 backdrop-blur-xl border-t border-white/10"
                >
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-neutral-300">
                                Utilizziamo solo cookie tecnici essenziali per il funzionamento e l&apos;autenticazione.
                                <Link href="/cookie-policy" className="underline text-primary-400 ml-2 hover:text-primary-300 transition-colors">
                                    Scopri di più
                                </Link>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={accept}
                                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                            >
                                Ho capito
                            </button>
                            <button
                                onClick={accept}
                                className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                aria-label="Chiudi"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
