'use client'

import { Heart, Coffee } from 'lucide-react'
import { motion } from 'framer-motion'

export function DonationCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-amber-500/20 p-8 shadow-lg"
        >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-amber-500 font-bold text-sm tracking-wider uppercase">
                        <Coffee className="w-4 h-4" />
                        <span>Supporta il progetto</span>
                    </div>
                    <p className="text-neutral-300 font-medium max-w-xl">
                        Sentiti libero di offrirmi un caffè o contribuire allo sviluppo dell'app. Grazie!
                    </p>
                </div>

                <a
                    href="https://www.paypal.com/donate/?hosted_button_id=JSNCEXQNEEC6G"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20"
                >
                    <Heart className="w-5 h-5 fill-current" />
                    <span>Fai una donazione</span>
                </a>
            </div>
        </motion.div>
    )
}
