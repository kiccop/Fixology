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
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">{tCommon('appName')}</span>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Accedi
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Registrati
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                Connetti Strava • Monitora • Pedala
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold"
            >
              {t('hero.title')}{' '}
              <span className="text-gradient">{t('hero.titleHighlight')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-neutral-400 max-w-2xl mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/register">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  {t('hero.cta')}
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary" size="lg">
                  {t('hero.secondaryCta')}
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="pt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { value: '100%', label: 'Gratuito' },
                { value: '14+', label: 'Componenti' },
                { value: '∞', label: 'Bici' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-neutral-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t('features.title')}
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Gestisci la manutenzione della tua bici come un professionista
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: RefreshCw,
                title: t('features.sync.title'),
                description: t('features.sync.description'),
                gradient: 'from-orange-500 to-red-500',
              },
              {
                icon: Settings,
                title: t('features.components.title'),
                description: t('features.components.description'),
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Bell,
                title: t('features.alerts.title'),
                description: t('features.alerts.description'),
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: History,
                title: t('features.history.title'),
                description: t('features.history.description'),
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="card h-full p-6 hover:border-white/10 transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-neutral-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Come funziona
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Tre semplici passi per tenere la tua bici sempre efficiente
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connetti Strava',
                description: 'Collega il tuo account Strava per importare automaticamente le tue bici e i chilometri percorsi.',
              },
              {
                step: '02',
                title: 'Configura i componenti',
                description: 'Aggiungi i componenti della tua bici e imposta le soglie di manutenzione personalizzate.',
              },
              {
                step: '03',
                title: 'Ricevi notifiche',
                description: 'Fixology ti avviserà quando è ora di sostituire o controllare un componente.',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-gradient opacity-20 absolute -top-4 left-0">
                  {step.step}
                </div>
                <div className="pt-12">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-neutral-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Perché scegliere <span className="text-gradient">Fixology</span>?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: 'Sincronizzazione automatica',
                    description: 'I chilometri si aggiornano automaticamente da Strava ad ogni accesso.',
                  },
                  {
                    icon: Shield,
                    title: 'Manutenzione preventiva',
                    description: 'Evita rotture impreviste sostituendo i componenti al momento giusto.',
                  },
                  {
                    icon: Smartphone,
                    title: 'Sempre a portata di mano',
                    description: 'Accedi da qualsiasi dispositivo, ovunque tu sia.',
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-neutral-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 p-8 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-6 animate-float">
                    <Bike className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Dashboard intuitiva</h3>
                  <p className="text-neutral-400">
                    Visualizza lo stato di tutti i componenti a colpo d&apos;occhio
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-neutral-400 mb-8">
              {t('cta.subtitle')}
            </p>
            <Link href="/register">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                {t('cta.button')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Bike className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">{tCommon('appName')}</span>
            </div>
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Fixology. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
