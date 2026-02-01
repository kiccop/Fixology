'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Search, ChevronRight, Sparkles, BookOpen, LifeBuoy } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui'
import { guideTopics } from '@/lib/guide-data'

export default function GuidePage() {
    const t = useTranslations('guide')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredTopics = guideTopics.filter(topic => {
        const title = t(`${topic.translationKey}.title`).toLowerCase()
        return title.includes(searchQuery.toLowerCase())
    })

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Hero Section - Premium Glassmorphism */}
            <section className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl isolate">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-neutral-900">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[100px] opacity-40 animate-pulse-glow" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px] opacity-40 animate-pulse-glow" style={{ animationDelay: '1s' }} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
                </div>

                <div className="relative z-10 p-10 md:p-16 flex flex-col items-center text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-xs font-bold tracking-widest uppercase text-white/80">Help Center</span>
                    </div>

                    {/* Headline */}
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 drop-shadow-sm">
                            {t('title')}
                        </h1>
                        <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>

                    {/* Search Bar - Floating Glass */}
                    <div className="w-full max-w-xl group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity duration-500" />
                        <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl transition-all duration-300 group-focus-within:border-white/20 group-focus-within:translate-y-[-2px]">
                            <Search className="w-6 h-6 text-neutral-500 ml-4 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-white text-lg placeholder:text-neutral-600 focus:ring-0 px-4 py-3 h-14"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Categories Label */}
            <div className="flex items-center gap-4 px-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                    Argomenti Principali
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic, index) => (
                        <Link
                            href={`/dashboard/guide/${topic.slug}`}
                            key={topic.slug}
                            className="group relative block h-full"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="h-full relative overflow-hidden bg-neutral-900/40 border border-white/5 rounded-3xl p-8 hover:bg-neutral-800/60 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary-500/5 group-hover:-translate-y-1"
                            >
                                {/* Hover Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`
                                            w-14 h-14 rounded-2xl flex items-center justify-center
                                            bg-neutral-800 border-t border-white/5 shadow-inner
                                            group-hover:scale-110 group-hover:rotate-3
                                            transition-all duration-500 ease-out
                                        `}>
                                            <topic.icon className="w-7 h-7 text-neutral-400 group-hover:text-white transition-colors" />
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                <ChevronRight className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-primary-400 mb-2">
                                            {t(`categories.${topic.category}`)}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-100 transition-colors">
                                            {t(`${topic.translationKey}.title`)}
                                        </h3>
                                        <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
                                            {t(`${topic.translationKey}.description`)}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 flex items-center text-xs font-bold text-neutral-500 uppercase tracking-wider group-hover:text-primary-400 transition-colors">
                                        <BookOpen className="w-3.5 h-3.5 mr-2" />
                                        Leggi articolo
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 border border-white/5 mb-6">
                            <LifeBuoy className="w-10 h-10 text-neutral-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('noResults')}</h3>
                        <p className="text-neutral-500">Prova a cercare con parole diverse</p>
                    </div>
                )}
            </div>
        </div>
    )
}
