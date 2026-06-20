'use client'

import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineBanner() {
    const isOnline = useOnlineStatus()

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-[200] bg-danger-500/90 backdrop-blur-xl text-white px-4 py-3 flex items-center justify-center gap-3 pt-safe"
                >
                    <WifiOff className="w-5 h-5" />
                    <span className="text-sm font-medium">Sei offline. Alcune funzionalità potrebbero non essere disponibili.</span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
