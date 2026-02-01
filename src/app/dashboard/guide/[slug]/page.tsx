'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Clock, Calendar, Share2, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import { guideTopics } from '@/lib/guide-data'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui'

export default function GuideArticlePage() {
    const params = useParams()
    const router = useRouter()
    const t = useTranslations('guide')
    const tCommon = useTranslations('common')

    const slug = params.slug as string
    const topic = guideTopics.find(t => t.slug === slug)

    if (!topic) {
        notFound()
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Top Navigation */}
            <div className="mb-8">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="group bg-neutral-900 border border-white/10 hover:bg-neutral-800 rounded-full px-5 py-6"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform text-white/70 group-hover:text-white" />
                        <span className="text-white/70 group-hover:text-white font-medium">{tCommon('back')}</span>
                    </Button>
                </div>
            </div>

            <article className="max-w-4xl mx-auto relative">
                {/* Article Header Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-white/5 shadow-2xl mb-12 isolate">
                    {/* Background Gradients */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 opacity-30" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    </div>

                    <div className="relative z-10 p-10 md:p-16">
                        {/* Meta Grid */}
                        <div className="flex flex-wrap items-center gap-4 mb-10 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <topic.icon className="w-4 h-4 text-primary-400" />
                                <span className="text-white/90">{t(`categories.${topic.category}`)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                3 min lettura
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                            {t(`${topic.translationKey}.title`)}
                        </h1>

                        <p className="text-xl md:text-2xl text-neutral-300 font-medium leading-relaxed max-w-2xl border-l-4 border-primary-500 pl-6">
                            {t(`${topic.translationKey}.description`)}
                        </p>
                    </div>
                </div>

                {/* Content Body */}
                <div className="px-4 md:px-8">
                    <div className="prose prose-xl prose-invert max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h3:text-primary-100
                        prose-p:text-neutral-300 prose-p:leading-loose prose-p:mb-8
                        prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 hover:prose-a:underline
                        prose-strong:text-white prose-strong:font-bold
                        prose-ul:my-8 prose-ul:list-none prose-ul:pl-0
                        prose-li:relative prose-li:pl-8 prose-li:my-4 prose-li:text-neutral-300
                        [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-[0.6em] [&_li::before]:w-2 [&_li::before]:h-2 [&_li::before]:bg-primary-500 [&_li::before]:rounded-full
                        prose-ol:pl-8 prose-ol:marker:text-primary-500 prose-ol:marker:font-bold
                        prose-blockquote:border-l-primary-500 prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-neutral-200
                        prose-hr:border-white/10 prose-hr:my-12
                    ">
                        <div dangerouslySetInnerHTML={{ __html: t.raw(`${topic.translationKey}.content`) }} />
                    </div>
                </div>

                {/* Footer Engagement */}
                <div className="mt-16 mx-4 md:mx-8 p-8 rounded-3xl bg-neutral-900 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-white font-bold text-lg mb-1">Ti è stato utile?</h4>
                        <p className="text-neutral-500 text-sm">Aiutaci a migliorare la documentazione</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-primary-500/20 text-white hover:text-primary-400 border border-white/5 hover:border-primary-500/30 transition-all font-bold text-sm group">
                            <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Si, grazie
                        </button>
                    </div>
                </div>
            </article>
        </div>
    )
}
