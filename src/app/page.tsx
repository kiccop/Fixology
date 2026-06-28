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
  Shield,
  Smartphone,
  Lock,
  FileText,
} from 'lucide-react'
import { Button, StravaLogo } from '@/components/ui'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const sectionTitle = (overline: string, title: string, subtitle?: string) => (
  <div className="flex flex-col items-center text-center mb-16 sm:mb-20">
    <span className="text-primary-500 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] mb-3 sm:mb-4">
      {overline}
    </span>
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-[1.05] max-w-3xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 sm:mt-5 text-neutral-400 text-base sm:text-lg max-w-xl text-balance">
        {subtitle}
      </p>
    )}
  </div>
)

const features = [
  { icon: RefreshCw, titleKey: 'sync', color: 'text-orange-500', showStrava: true },
  { icon: Settings, titleKey: 'components', color: 'text-blue-500' },
  { icon: Bell, titleKey: 'alerts', color: 'text-emerald-500' },
  { icon: History, titleKey: 'history', color: 'text-purple-500' },
  { icon: FileText, titleKey: 'booklet', color: 'text-primary-400' },
  { icon: Shield, titleKey: 'receipts', color: 'text-secondary-400' },
  { icon: Lock, titleKey: 'privacy', color: 'text-green-500' },
  { icon: Smartphone, titleKey: 'multiplatform', color: 'text-blue-400' },
]

const steps = [
  { id: '01', titleKey: 'steps.step1.title', descKey: 'steps.step1.description' },
  { id: '02', titleKey: 'steps.step2.title', descKey: 'steps.step2.description' },
  { id: '03', titleKey: 'steps.step3.title', descKey: 'steps.step3.description' },
]

export default function LandingPage() {
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')
  const tAuth = useTranslations('auth')

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-primary-500/30 overflow-x-hidden flex flex-col items-center">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-neutral-950/60 backdrop-blur-xl border-b border-white/[0.04] pt-safe">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/15 group-hover:shadow-primary-500/30 group-hover:scale-105 transition-all duration-300">
              <Bike className="w-[18px] sm:w-5 h-[18px] sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight uppercase italic">
              {tCommon('appName')}
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-3 py-2"
            >
              {tAuth('login')}
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="!bg-primary-500 !text-white hover:!bg-primary-600 shadow-lg font-black uppercase italic tracking-tighter text-[11px] px-5"
              >
                {tAuth('register')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ──────── HERO ──────── */}
      <section className="relative min-h-screen flex items-center justify-center w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        {/* Decorative background graphic */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
          <Bike className="w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] lg:w-[50vw] lg:h-[50vw] text-white" strokeWidth={1} />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 py-20 sm:py-24 xl:py-32 text-center">
          <motion.div initial="initial" animate="animate" variants={stagger} className="flex flex-col items-center gap-6 sm:gap-8">

            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] text-primary-400 text-[10px] sm:text-[11px] font-black tracking-[0.25em] uppercase">
                <StravaLogo variant="mark" className="w-3.5 h-3.5" />
                {t('features.sync.title')}
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-[clamp(3rem,13vw,6.5rem)] font-black leading-[0.9] sm:leading-[0.88] tracking-tighter uppercase italic"
            >
              <div>Ride</div>
              <div className="text-primary-400">Limitless.</div>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-xl text-balance"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-sm"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="h-13 sm:h-14 w-full sm:px-10 text-[15px] sm:text-base shadow-2xl shadow-primary-600/30 uppercase italic font-black"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto sm:hidden">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-13 w-full text-[15px] border-white/10 hover:bg-white/5 uppercase italic font-bold"
                >
                  {tAuth('login')}
                </Button>
              </Link>
              <a href="#features" className="hidden sm:block">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 px-8 text-[15px] border-white/10 hover:bg-white/5 uppercase italic font-bold"
                >
                  {t('hero.secondaryCta')}
                </Button>
              </a>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              className="pt-4 flex flex-col items-center gap-1.5 opacity-25"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-[8px] uppercase tracking-[0.4em] font-black">Scroll</span>
              <div className="w-4 h-6 rounded-full border border-white/20 flex items-start justify-center p-1">
                <div className="w-1 h-1.5 rounded-full bg-white/40" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──────── FEATURES ──────── */}
      <section id="features" className="w-full py-20 sm:py-28 lg:py-32 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {sectionTitle(
            t('features.overline'),
            t('features.title'),
            t('hero.subtitle')
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group"
              >
                <div className="h-full p-6 sm:p-7 lg:p-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-400 flex flex-col items-start text-left">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-105 transition-transform duration-400`}>
                    <f.icon className={`w-5 h-5 sm:w-[22px] sm:h-[22px] ${f.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight mb-2">
                    {t(`features.${f.titleKey}.title`)}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed flex-1">
                    {t(`features.${f.titleKey}.description`)}
                  </p>
                  {f.showStrava && (
                    <div className="mt-4 pt-4 border-t border-white/[0.06] w-full">
                      <StravaLogo className="opacity-60 group-hover:opacity-100 transition-opacity h-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── STATS ──────── */}
      <section className="w-full py-20 sm:py-24 lg:py-28 bg-gradient-to-r from-primary-500/[0.03] via-transparent to-secondary-500/[0.03]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
            {[
              { value: '100%', label: t('hero.stats.cloudSync') },
              { value: '\u221E', label: t('hero.stats.bikeLimit') },
              { value: '4', label: t('hero.stats.languages') },
              { value: '24/7', label: t('hero.stats.monitoring') },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-[clamp(2.2rem,6vw,3.8rem)] font-black italic bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent leading-none mb-2 sm:mb-3">
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── VIDEO ──────── */}
      <section className="w-full py-20 sm:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {sectionTitle(
            t('video.overline'),
            t('video.title'),
            t('video.subtitle')
          )}

          <div className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-primary-500/5 bg-neutral-900">
            <iframe
              src="/demo.html"
              className="absolute inset-0 w-full h-full"
              allow="autoplay"
              title="myBikeLog Demo"
            />
          </div>
        </div>
      </section>

      {/* ──────── HOW IT WORKS ──────── */}
      <section className="w-full py-20 sm:py-28 lg:py-32 bg-neutral-900/30">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {sectionTitle(
            t('howItWorks.overline'),
            t('howItWorks.title')
          )}

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter text-white/[0.04] leading-none mb-2">
                  {step.id}
                </div>
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-5 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 sm:mb-3">
                  {t(`howItWorks.${step.titleKey}`)}
                </h3>
                <p className="text-sm sm:text-base text-neutral-500 max-w-xs text-balance">
                  {t(`howItWorks.${step.descKey}`)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-14 sm:mt-16"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-3 text-white/80 hover:text-primary-400 font-black uppercase text-sm sm:text-base italic tracking-widest transition-colors group"
            >
              {t('howItWorks.getStartedNow')}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="w-full py-24 sm:py-32 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/[0.03] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[200px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center space-y-10 sm:space-y-12"
        >
          <h2 className="text-[clamp(2rem,7vw,4rem)] font-black tracking-tighter uppercase italic leading-[0.9]">
            {t('cta.mainTitle')}
            <br />
            <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-400 bg-clip-text text-transparent">
              {t('cta.mainSubtitle')}
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-13 sm:h-14 w-full sm:px-12 text-[15px] sm:text-base shadow-2xl shadow-primary-600/30 uppercase italic font-black"
              >
                {t('cta.button')}
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="h-13 sm:h-14 w-full sm:px-10 text-[15px] sm:text-base uppercase italic font-bold border-white/10 hover:bg-white/5"
              >
                {tAuth('login')}
              </Button>
            </Link>
          </div>

          <p className="text-neutral-600 font-bold uppercase tracking-[0.5em] text-[9px] sm:text-[10px]">
            {t('cta.freeAccess')}
          </p>
        </motion.div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer className="w-full py-14 sm:py-16 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="flex items-center gap-2.5 opacity-70">
              <div className="w-7 h-7 rounded-md bg-neutral-800 flex items-center justify-center">
                <Bike className="w-4 h-4 text-white" />
              </div>
              <span className="text-base sm:text-lg font-black italic tracking-tight uppercase">
                {tCommon('appName')}
              </span>
            </div>
            <p className="text-xs text-neutral-600 font-medium italic">Advanced Cycle Analytics Platform</p>
          </div>

          <StravaLogo variant="powered-by" className="opacity-50" />

          <div className="text-[10px] sm:text-[11px] text-neutral-600 font-black uppercase tracking-[0.15em] italic">
            &copy; {new Date().getFullYear()} {tCommon('appName')} Labs
          </div>
        </div>
      </footer>
    </div>
  )
}
