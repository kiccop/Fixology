'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Cookie, ShieldCheck, Lock, Globe } from 'lucide-react'
import { Button } from '@/components/ui'

export default function CookiePolicyPage() {
    const tCommon = useTranslations('common')

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary-500/30 flex flex-col">
            {/* Simple Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/50 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-neutral-500 group-hover:text-primary-400 transition-colors" />
                        <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-200 uppercase tracking-tighter transition-colors">Torna alla Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Cookie className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black italic uppercase tracking-tight text-sm">{tCommon('appName')}</span>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
                                Cookie <span className="text-gradient">Policy</span>
                            </h1>
                            <p className="text-neutral-400 text-lg leading-relaxed italic">
                                La tua privacy è la nostra priorità. Questa pagina spiega in modo trasparente come utilizziamo i cookie su MyBikelog.
                            </p>
                        </div>

                        <div className="grid gap-8">
                            <PolicySection
                                icon={ShieldCheck}
                                title="Cosa sono i Cookie?"
                                description="I cookie sono piccoli file di testo che vengono salvati sul tuo dispositivo quando visiti un sito web. Ci aiutano a far funzionare l'applicazione correttamente e a ricordare le tue preferenze."
                            />

                            <PolicySection
                                icon={Lock}
                                title="Cookie Tecnici Essenziali"
                                description="MyBikelog utilizza esclusivamente cookie tecnici necessari per il funzionamento del servizio. Questi includono i cookie di Supabase Auth, che ci permettono di mantenerti loggato in modo sicuro mentre navighi nell'app."
                            />

                            <PolicySection
                                icon={Lock}
                                title="Nessun Tracking di Terze Parti"
                                description="Non utilizziamo cookie di profilazione, marketing o tracking pubblicitario. Non vendiamo i tuoi dati a terzi e non utilizziamo strumenti come Google Analytics che tracciano il tuo comportamento su altri siti."
                            />

                            <PolicySection
                                icon={Globe}
                                title="I Tuoi Diritti (GDPR)"
                                description="Ai sensi del Regolamento UE 2016/679 (GDPR), hai il diritto di accedere, rettificare o cancellare i tuoi dati in qualsiasi momento. Poiché utilizziamo solo cookie necessari, il consenso preventivo non è obbligatorio, ma la trasparenza sì."
                            />
                        </div>

                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <p className="text-neutral-500 text-sm italic mb-6">
                                Ultimo aggiornamento: 30 Gennaio 2026
                            </p>
                            <Link href="/">
                                <Button variant="primary">Ho capito</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

function PolicySection({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-primary-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold uppercase italic tracking-tight mb-2">{title}</h2>
                <p className="text-neutral-500 leading-relaxed text-sm font-medium">{description}</p>
            </div>
        </div>
    )
}
