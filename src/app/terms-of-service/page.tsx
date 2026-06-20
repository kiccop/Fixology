'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, FileText, Scale, AlertTriangle, Shield, Ban, CheckCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui'

export default function TermsOfServicePage() {
    const tCommon = useTranslations('common')

    return (
        <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary-500/30 flex flex-col">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/50 backdrop-blur-xl border-b border-white/5 pt-safe">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft className="w-5 h-5 text-neutral-500 group-hover:text-primary-400 transition-colors" />
                        <span className="text-sm font-medium text-neutral-400 group-hover:text-neutral-200 uppercase tracking-tighter transition-colors">Torna alla Home</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black italic uppercase tracking-tight text-sm">{tCommon('appName')}</span>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-40 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* Header */}
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">
                                Termini di <span className="text-gradient">Servizio</span>
                            </h1>
                            <p className="text-neutral-400 text-lg leading-relaxed italic">
                                Questi termini regolano l'utilizzo di MyBikeLog. Utilizzando il servizio, accetti queste condizioni. Leggile attentamente.
                            </p>
                            <p className="text-neutral-600 text-sm mt-4">
                                Ultimo aggiornamento: 20 Giugno 2026
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="grid gap-8">
                            <PolicySection
                                icon={BookOpen}
                                title="1. Accettazione dei Termini"
                                description="Utilizzando MyBikeLog (sito web o applicazione mobile), accetti di essere vincolato da questi Termini di Servizio. Se non accetti questi termini, non utilizzare il servizio. Ci riserviamo il diritto di modificare questi termini in qualsiasi momento; le modifiche sono efficaci dalla data di pubblicazione."
                            />

                            <PolicySection
                                icon={Shield}
                                title="2. Descrizione del Servizio"
                                description="MyBikeLog è una piattaforma di monitoraggio della manutenzione delle biciclette. Il servizio permette di: registrare biciclette e componenti, tracciare l'usura in base ai chilometri o ore di utilizzo, sincronizzare dati da Strava, ricevere notifiche di manutenzione, e generare report PDF. Il servizio è fornito 'così com'è' senza garanzie implicite."
                            />

                            <PolicySection
                                icon={CheckCircle}
                                title="3. Account e Responsabilità"
                                description="Sei responsabile di mantenere la riservatezza delle tue credenziali e di tutte le attività svolte con il tuo account. Devi avere almeno 16 anni per utilizzare il servizio. Non puoi condividere il tuo account con terzi. Ci riserviamo il diritto di sospendere o terminare account che violano questi termini."
                            />

                            <PolicySection
                                icon={Scale}
                                title="4. Limitazione di Responsabilità"
                                description="MyBikeLog è uno strumento di supporto alla manutenzione, non un sostituto del giudizio meccanico professionale. Le soglie di usura sono indicative e basate su linee guida generali. Non siamo responsabili per danni alla bicicletta, infortuni, o perdite economiche derivanti dall'utilizzo del servizio. Verifica sempre lo stato reale dei componenti prima dell'uso."
                            />

                            <PolicySection
                                icon={AlertTriangle}
                                title="5. Integrazione Strava"
                                description="L'integrazione con Strava è opzionale e richiede la tua autorizzazione esplicita. Accedendo a Strava, accetti anche i Termini di Servizio di Strava. Non siamo responsabili per interruzioni del servizio Strava o modifiche alle loro API. Puoi disconnettere Strava in qualsiasi momento dalle impostazioni."
                            />

                            <PolicySection
                                icon={Ban}
                                title="6. Utilizzo Accettabile"
                                description="Non puoi: utilizzare il servizio per attività illegali, tentare di accedere ad account altrui, reverse-engineerare il software, caricare contenuti dannosi o malware, utilizzare il servizio per inviare spam, o violare i diritti di proprietà intellettuale di terzi. La violazione di queste regole comporta la terminazione immediata dell'account."
                            />

                            <PolicySection
                                icon={FileText}
                                title="7. Proprietà Intellettuale"
                                description="Il codice sorgente, il design, i loghi, e i contenuti di MyBikeLog sono protetti da copyright e sono di proprietà esclusiva del titolare. Il codice è reso pubblico su GitHub esclusivamente per consultazione e portfolio. È severamente vietata la copia, modifica, ridistribuzione o uso commerciale senza esplicito permesso scritto."
                            />

                            <PolicySection
                                icon={Shield}
                                title="8. Privacy"
                                description="Il trattamento dei dati personali è regolato dalla nostra Privacy Policy, che costituisce parte integrante di questi termini. Utilizzando il servizio, acconsenti al trattamento dei dati come descritto nella Privacy Policy."
                            />

                            <PolicySection
                                icon={Scale}
                                title="9. Legge Applicabile e Foro Competente"
                                description="Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia derivante dall'utilizzo del servizio, il foro competente è quello di Cagliari, Italia. Si applica il Regolamento UE 2016/679 (GDPR) per il trattamento dei dati personali."
                            />

                            <PolicySection
                                icon={BookOpen}
                                title="10. Contatti"
                                description="Per domande su questi Termini di Servizio, contattaci a support@mybikelog.app. Rispondiamo entro 48 ore lavorative."
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <p className="text-neutral-500 text-sm italic mb-6">
                                Registrandoti e utilizzando MyBikeLog, dichiari di aver letto, compreso e accettato questi Termini di Servizio e la Privacy Policy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/">
                                    <Button variant="primary">Torna alla Home</Button>
                                </Link>
                                <Link href="/privacy-policy">
                                    <Button variant="secondary">Privacy Policy</Button>
                                </Link>
                            </div>
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
