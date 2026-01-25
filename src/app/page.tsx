'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Bike,
  RefreshCw,
  Settings,
  Bell,
  History,
  ArrowRight,
  ChevronDown,
  Zap,
  Shield,
  Smartphone,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react'
import { Button, StravaLogo } from '@/components/ui'

// Animation variants for a professional entrance
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
}

export default function LandingPage() {
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary-500/30 overflow-x-hidden">
      {/* Navigation - Ultra Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-neutral-950/20 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase italic">{tCommon('appName')}</span>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:text-blue-400 transition-colors">
                {tCommon('back')}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="!bg-white !text-black hover:!bg-neutral-200 shadow-xl">
                {t('cta.button')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Cinematic Professional */}
      <section className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[50%] h-full opacity-40 md:opacity-100 pointer-events-none">
            {/* Using the generated professional image as a visual anchor */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-neutral-950 to-neutral-950 z-10" />
            <img
              src="https://images.unsplash.com/photo-1541625602330-2277a1cd13a2?q=80&w=2070&auto=format&fit=crop"
              alt="Bicycle detail"
              className="w-full h-full object-cover grayscale-[30%] brightness-75 contrast-125"
            />
          </div>
          <div className="absolute inset-0 mesh-gradient opacity-60" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Official Partner Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border-white/10 text-primary-400 text-[13px] font-bold tracking-widest uppercase">
                <StravaLogo variant="mark" className="w-4 h-4 mr-3" />
                INTEGRAZIONE UFFICIALE STRAVA
              </div>
            </motion.div>

            {/* Main Catchphrase */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic"
            >
              Ride <br />
              <span className="text-gradient">Limitless.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl text-neutral-400 max-w-lg leading-relaxed font-medium"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Action Group */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link href="/register">
                <Button size="lg" className="h-16 px-10 text-lg shadow-2xl shadow-primary-600/30" icon={<ArrowRight className="w-6 h-6" />} iconPosition="right">
                  {t('hero.cta')}
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" size="lg" className="h-16 px-10 text-lg border-white/10 hover:bg-white/5">
                  {t('hero.secondaryCta')}
                </Button>
              </a>
            </motion.div>

            {/* Social Proof / Stats */}
            <motion.div
              variants={fadeInUp}
              className="pt-10 flex items-center gap-8 border-t border-white/5 max-w-sm"
            >
              <div>
                <div className="text-3xl font-black text-white italic tracking-tighter">100%</div>
                <div className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold">Cloud Sync</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-black text-white italic tracking-tighter">∞</div>
                <div className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold">Limit Bici</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-black italic">Discover More</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Features Grid - Minimalist & Balanced */}
      <section id="features" className="py-32 relative overflow-hidden bg-white/2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-xl">
              <span className="text-primary-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4 block italic">Engineering Precision</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-tight">
                {t('features.title')}
              </h2>
            </div>
            <p className="text-neutral-500 font-medium md:mb-2 italic max-w-xs">
              Sviluppato per ciclisti che esigono il massimo dalla propria meccanica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: RefreshCw,
                title: t('features.sync.title'),
                description: t('features.sync.description'),
                color: "text-orange-500"
              },
              {
                icon: Settings,
                title: t('features.components.title'),
                description: t('features.components.description'),
                color: "text-blue-500"
              },
              {
                icon: Bell,
                title: t('features.alerts.title'),
                description: t('features.alerts.description'),
                color: "text-emerald-500"
              },
              {
                icon: History,
                title: t('features.history.title'),
                description: t('features.history.description'),
                color: "text-purple-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="glass-card h-full p-8 glass-card-hover transition-all duration-500 border-white/5 group-hover:border-primary-500/20">
                  <div className={`w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight italic uppercase">{feature.title}</h3>
                  <p className="text-neutral-500 text-[15px] leading-relaxed mb-6 font-medium line-clamp-3">
                    {feature.description}
                  </p>

                  {feature.title === t('features.sync.title') && (
                    <div className="pt-4 border-t border-white/5">
                      <StravaLogo className="!items-start opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Process Flow Look */}
      <section className="py-32 relative bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
              <span className="text-primary-500 text-[11px] font-black uppercase tracking-[0.3em] italic">Step by Step</span>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Ready in <br /> Seconds.</h2>
              <p className="text-neutral-500 font-medium leading-relaxed italic">
                Il setup è immediato. Accedi, connetti e lascia che Fixology faccia il lavoro sporco per te.
              </p>
              <Link href="/register" className="inline-block pt-4">
                <div className="flex items-center gap-3 text-white font-black uppercase text-sm italic tracking-widest group cursor-pointer hover:text-primary-400 transition-colors">
                  Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {[
                {
                  id: "01",
                  title: "Cloud Connection",
                  desc: "Collega Strava e importa anni di pedalate in frazioni di secondo.",
                  icon: Globe
                },
                {
                  id: "02",
                  title: "Component Stack",
                  desc: "Definisci le soglie di usura per ogni cuscinetto, catena o pneumatico.",
                  icon: Settings
                },
                {
                  id: "03",
                  title: "Smart Monitoring",
                  desc: "Ricevi push-notifications prima che un guasto rovini la tua uscita domenicale.",
                  icon: Bell
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 p-10 rounded-[32px] bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="text-6xl font-black italic tracking-tighter text-neutral-800 opacity-50 group-hover:text-primary-500 transition-colors">{step.id}</div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
                      <step.icon className="w-6 h-6 text-primary-500" />
                      {step.title}
                    </h3>
                    <p className="text-neutral-500 font-medium leading-relaxed italic pr-12">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security & Benefits - Enterprise Aesthetic */}
      <section className="py-32 relative overflow-hidden bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card p-12 lg:p-20 relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950 border-white/10">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
                    Massima <br /> <span className="text-gradient">Affidabilità.</span>
                  </h2>
                  <p className="text-neutral-400 font-medium leading-relaxed italic">
                    I tuoi dati sono protetti da crittografia end-to-end e monitorati costantemente tramite Supabase e Vercel Cloud Infrastructure.
                  </p>
                </div>

                <div className="grid gap-6">
                  {[
                    { icon: Lock, text: "Privacy garantita dei tuoi percorsi" },
                    { icon: Shield, text: "Infrastruttura di grado Enterprise" },
                    { icon: CheckCircle2, text: "Sincronizzazione in tempo reale" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors border border-white/5">
                        <item.icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <span className="font-bold uppercase tracking-tight italic text-neutral-300 group-hover:text-white transition-colors">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Visual */}
              <div className="relative">
                <div className="aspect-square glass-card bg-neutral-900/80 border-white/20 flex flex-col items-center justify-center p-12 text-center group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,107,53,0.3)] animate-pulse">
                    <Bike className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Live Dashboard</h3>
                  <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Ready for exploration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Footer */}
      <section className="py-40 relative bg-neutral-950 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[200px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl px-6 space-y-10 relative z-10"
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
            Don&apos;t Just Ride. <br />
            <span className="text-gradient">Optimize.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button size="lg" className="h-20 px-12 text-xl font-black shadow-2xl uppercase italic tracking-tighter">
                {t('cta.button')}
              </Button>
            </Link>
          </div>
          <p className="text-neutral-600 font-bold uppercase tracking-[0.5em] text-xs pt-4">Free Forever for Individual Riders</p>
        </motion.div>
      </section>

      {/* Footer Minimalist */}
      <footer className="py-20 border-t border-white/5 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-3 opacity-80">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black italic tracking-tight uppercase">{tCommon('appName')}</span>
            </div>
            <p className="text-neutral-600 text-sm font-medium italic">Advanced Cycle Analytics Platform</p>
          </div>

          <StravaLogo className="scale-110" variant="powered-by" />

          <div className="text-neutral-600 text-[11px] font-black uppercase tracking-[0.2em] italic">
            © {new Date().getFullYear()} Fixology Labs. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
