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
  Globe,
  FileText
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
  const tAuth = useTranslations('auth')

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary-500/30 overflow-x-hidden flex flex-col items-center">
      {/* Navigation - Ultra Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-neutral-950/20 backdrop-blur-2xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white uppercase italic">{tCommon('appName')}</span>
          </div>

          {/* Auth Actions - Strictly Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <span className="text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer px-2">
                {tAuth('login')}
              </span>
            </Link>
            <Link href="/register">
              <Button size="sm" className="!bg-primary-500 !text-white hover:!bg-primary-600 shadow-lg font-black uppercase italic tracking-tighter text-xs">
                {tAuth('register')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Centered & Impactful */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden text-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-neutral-950/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1541625602330-2277a1cd13a2?q=80&w=2070&auto=format&fit=crop"
            alt="Bicycle detail"
            className="w-full h-full object-cover grayscale-[30%] brightness-[0.3] contrast-125 scale-110 blur-[2px]"
          />
          <div className="absolute inset-0 mesh-gradient opacity-40" />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col items-center space-y-10"
          >
            {/* Official Partner Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center px-5 py-2.5 rounded-full glass-card border-white/10 text-primary-400 text-[12px] font-black tracking-[0.2em] uppercase bg-white/5">
                <StravaLogo variant="mark" className="w-4 h-4 mr-3" />
                {t('features.sync.title')}
              </div>
            </motion.div>

            {/* Main Catchphrase */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl sm:text-8xl lg:text-9xl font-black leading-[0.8] tracking-tighter uppercase italic text-center"
            >
              Ride <br />
              <span className="text-gradient">Limitless.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-neutral-300 max-w-2xl leading-relaxed font-medium text-center mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Action Group */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 pt-4 w-full sm:w-80 md:w-auto justify-center items-center"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 w-full sm:px-12 text-xl shadow-2xl shadow-primary-600/30 uppercase italic font-black" icon={<ArrowRight className="w-6 h-6" />} iconPosition="right">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto md:hidden">
                <Button variant="secondary" size="lg" className="h-16 w-full px-12 text-xl border-white/10 hover:bg-white/5 uppercase italic font-bold">
                  {tAuth('login')}
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto hidden sm:block">
                <Button variant="secondary" size="lg" className="h-16 px-12 text-xl border-white/10 hover:bg-white/5 uppercase italic font-bold">
                  {t('hero.secondaryCta')}
                </Button>
              </a>
            </motion.div>

            {/* Social Proof / Stats */}
            <motion.div
              variants={fadeInUp}
              className="pt-12 flex items-center justify-center gap-12 border-t border-white/5 w-full max-w-md"
            >
              <div className="text-center">
                <div className="text-3xl font-black text-white italic tracking-tighter">100%</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Cloud Sync</div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black text-white italic tracking-tighter">∞</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Limit Bici</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-black italic">Discover More</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Features Grid - Centered & Symmetrical */}
      <section id="features" className="py-32 relative overflow-hidden bg-neutral-900/20 w-full flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center mb-24 mx-auto max-w-3xl">
            <span className="text-primary-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4 block italic text-center">Engineering Precision</span>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none mb-6 text-center">
              {t('features.title')}
            </h2>
            <p className="text-neutral-500 font-medium italic text-lg text-center mx-auto">
              Sviluppato per ciclisti che esigono il massimo dalla propria meccanica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full place-items-center">
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
              },
              {
                icon: FileText,
                title: t('features.booklet.title'),
                description: t('features.booklet.description'),
                color: "text-primary-400"
              },
              {
                icon: Shield,
                title: t('features.receipts.title'),
                description: t('features.receipts.description'),
                color: "text-secondary-400"
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
                <div className="glass-card h-full p-10 glass-card-hover transition-all duration-500 border-white/5 group-hover:border-primary-500/20 text-center flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight italic uppercase text-center">{feature.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed font-medium mb-8 text-center">
                    {feature.description}
                  </p>

                  {feature.title === t('features.sync.title') && (
                    <div className="pt-6 border-t border-white/5 w-full flex justify-center">
                      <StravaLogo className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Elegant Flow */}
      <section className="py-32 relative bg-black text-center w-full flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-20 mx-auto max-w-3xl">
            <span className="text-primary-500 text-[11px] font-black uppercase tracking-[0.3em] italic mb-4 block text-center">Step by Step</span>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none text-center">Ready in Seconds.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 w-full place-items-center">
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="text-7xl font-black italic tracking-tighter text-neutral-800 opacity-30">{step.id}</div>
                <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                <h3 className="text-2xl font-black uppercase italic tracking-tight flex items-center justify-center gap-3 text-center">
                  {step.title}
                </h3>
                <p className="text-neutral-500 font-medium leading-relaxed italic max-w-xs text-center mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <Link href="/register" className="inline-block mt-20">
            <div className="flex items-center gap-4 text-white font-black uppercase text-lg italic tracking-widest group cursor-pointer hover:text-primary-400 transition-colors">
              Get Started Now <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Modern CTA Footer */}
      <section className="py-48 relative bg-neutral-950 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-500/5 rounded-full blur-[200px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl px-6 space-y-12 relative z-10"
        >
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.8]">
            Don&apos;t Just Ride. <br />
            <span className="text-gradient">Optimize.</span>
          </h2>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-20 px-16 text-2xl font-black shadow-2xl uppercase italic tracking-tighter">
                {t('cta.button')}
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="h-20 px-12 text-2xl font-black uppercase italic tracking-tighter border-white/20 hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
          <p className="text-neutral-600 font-bold uppercase tracking-[0.6em] text-[10px] pt-4">Free Access for Individual Riders</p>
        </motion.div>
      </section>

      {/* Footer Minimalist */}
      <footer className="py-20 border-t border-white/5 bg-neutral-950 w-full flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
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
            © {new Date().getFullYear()} {tCommon('appName')} Labs. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

