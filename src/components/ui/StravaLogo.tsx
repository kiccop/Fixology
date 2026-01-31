'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

interface StravaLogoProps {
    variant?: 'powered-by' | 'connect-button' | 'sync-button' | 'mark'
    className?: string
    loading?: boolean
    onClick?: () => void
}

/**
 * COMPONENTE UFFICIALE STRAVA (RISTRETTISSIMO)
 * Utilizza esclusivamente tracciati SVG incorporati per garantire 0 errori di caricamento.
 * Segue le linee guida Strava API 2024.
 */
export function StravaLogo({ variant = 'powered-by', className = '', loading = false, onClick }: StravaLogoProps) {
    const tStrava = useTranslations('strava')

    // Il tracciato ufficiale del logo "M" di Strava (24x24)
    const officialPath = "M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"

    if (variant === 'mark') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={`w-6 h-6 text-[#FC4C02] ${className}`}
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d={officialPath} />
            </svg>
        )
    }

    if (variant === 'connect-button') {
        return (
            <button
                onClick={onClick}
                className={`inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-2.5 px-6 rounded shadow-lg transition-all gap-3 active:scale-95 ${className}`}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d={officialPath} />
                </svg>
                <span className="text-sm">{tStrava('connect')}</span>
            </button>
        )
    }

    if (variant === 'sync-button') {
        return (
            <button
                onClick={onClick}
                disabled={loading}
                className={`inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-2 px-4 rounded shadow-md transition-all gap-2 disabled:opacity-70 active:scale-95 ${className}`}
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d={officialPath} />
                    </svg>
                )}
                <span className="text-[10px] uppercase font-black tracking-tighter">{tStrava('syncNow')}</span>
            </button>
        )
    }

    // DEFAULT: "Powered by Strava" - ICONA + TESTO SVG (Non distorbibile)
    return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
            <span className="text-[9px] text-neutral-500 uppercase tracking-[0.2em] font-bold">Powered by</span>
            <div className="flex items-center gap-1.5 text-[#FC4C02]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={officialPath} />
                </svg>
                <span className="font-black text-lg italic tracking-tighter" style={{ fontFamily: 'sans-serif' }}>STRAVA</span>
            </div>
        </div>
    )
}
