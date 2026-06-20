'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Shield, Database, Lock, Eye, UserCheck, Trash2, Mail, Server, Globe } from 'lucide-react'
import { Button } from '@/components/ui'

export default function PrivacyPolicyPage() {
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
                            <Shield className="w-4 h-4 text-white" />
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
                                Privacy <span className="text-gradient">Policy</span>
                            </h1>
                            <p className="text-neutral-400 text-lg leading-relaxed italic">
                                La tua privacy è fondamentale per noi. Questa informativa spiega in modo trasparente quali dati raccogliamo, come li utilizziamo e quali diritti hai ai sensi del GDPR.
                            </p>
                            <p className="text-neutral-600 text-sm mt-4">
                                Ultimo aggiornamento: 20 Giugno 2026
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="grid gap-8">
                            <PolicySection
                                icon={Database}
                                title="1. Titolare del Trattamento"
                                description="Il titolare del trattamento dei dati è Enrico Puddu, contattabile all'indirizzo email support@mybikelog.app. MyBikeLog è un'applicazione sviluppata e gestita in Italia, conformemente al Regolamento UE 2016/679 (GDPR)."
                            />

                            <PolicySection
                                icon={Server}
                                title="2. Dati Raccolti"
                                description="Raccogliamo esclusivamente i dati necessari per il funzionamento del servizio: email e nome (per l'account), dati delle tue biciclette e componenti (per il monitoraggio), token Strava (per la sincronizzazione), e ricevute di manutenzione (opzionali). Non raccogliamo dati di navigazione, posizione geografica, o dati di contatto del dispositivo."
                            />

                            <PolicySection
                                icon={Lock}
                                title="3. Finalità del Trattamento"
                                description="I dati sono trattati esclusivamente per: gestire il tuo account e l'autenticazione, monitorare l'usura dei componenti delle tue biciclette, sincronizzare i chilometri da Strava, inviarti notifiche di manutenzione, e generare report PDF della cronologia manutenzione. Nessun dato è utilizzato per profilazione, marketing o finalità commerciali."
                            />

                            <PolicySection
                                icon={Eye}
                                title="4. Condivisione con Terze Parti"
                                description="Condividiamo dati esclusivamente con: Supabase (hosting database e autenticazione, server in UE), Strava (solo per sincronizzare i dati delle tue biciclette, previa tua autorizzazione esplicita), e Vercel (hosting applicazione). Nessun dato è venduto, ceduto o condiviso con broker di dati o piattaforme pubblicitarie."
                            />

                            <PolicySection
                                icon={Globe}
                                title="5. Trasferimento Dati Extra-UE"
                                description="Supabase e Vercel utilizzano server principalmente in Europa. Strava (azienda statunitense) potrebbe trasferire dati negli USA, ma opera nell'ambito del Data Privacy Framework UE-USA. In ogni caso, i dati trasmessi a Strava sono limitati ai soli dati necessari per la sincronizzazione (ID atleta, dati biciclette)."
                            />

                            <PolicySection
                                icon={UserCheck}
                                title="6. Base Giuridica del Trattamento"
                                description="Il trattamento si basa su: esecuzione del contratto (fornitura del servizio richiesto), consenso esplicito (integrazione Strava, notifiche push), e legittimo interesse (sicurezza dell'account, prevenzione frodi). Puoi revocare il consenso in qualsiasi momento dalle impostazioni dell'app o disconnettendo Strava."
                            />

                            <PolicySection
                                icon={Trash2}
                                title="7. Conservazione dei Dati"
                                description="I dati sono conservati per tutta la durata del tuo account. Alla cancellazione dell'account, tutti i dati (profilo, biciclette, componenti, cronologia manutenzione, token Strava, ricevute) vengono eliminati definitivamente entro 30 giorni. I log di sistema sono conservati per massimo 12 mesi per finalità di sicurezza."
                            />

                            <PolicySection
                                icon={Shield}
                                title="8. Sicurezza dei Dati"
                                description="Adottiamo misure di sicurezza tecniche e organizzative: crittografia TLS per tutte le comunicazioni, autenticazione sicura tramite Supabase Auth (con supporto biometrico su mobile), Row Level Security (RLS) su tutte le tabelle del database per isolare i dati di ogni utente, e hash delle password gestito da Supabase."
                            />

                            <PolicySection
                                icon={UserCheck}
                                title="9. I Tuoi Diritti (GDPR Art. 15-22)"
                                description="Hai il diritto di: accedere ai tuoi dati (Art. 15), rettificare dati inaccurati (Art. 16), cancellare il tuo account e tutti i dati associati (Art. 17), limitare il trattamento (Art. 18), ricevere i tuoi dati in formato portabile (Art. 20), opporti al trattamento (Art. 21), e non essere sottoposto a decisioni automatizzate (Art. 22). Per esercitare questi diritti, scrivici a support@mybikelog.app."
                            />

                            <PolicySection
                                icon={Mail}
                                title="10. Contatti e Reclami"
                                description="Per qualsiasi domanda sulla privacy, esercitare i tuoi diritti, o segnalare una violazione dei dati, contattaci a support@mybikelog.app. Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it) se ritieni che il trattamento violi il GDPR."
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <p className="text-neutral-500 text-sm italic mb-6">
                                Questa informativa è stata redatta in conformità al Regolamento UE 2016/679 (GDPR) e alla normativa italiana in materia di protezione dei dati personali (D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018).
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/">
                                    <Button variant="primary">Torna alla Home</Button>
                                </Link>
                                <Link href="/cookie-policy">
                                    <Button variant="secondary">Cookie Policy</Button>
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
