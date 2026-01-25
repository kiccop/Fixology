'use client'

import React from 'react'

interface StravaLogoProps {
    variant?: 'powered-by' | 'connect-button' | 'sync-button' | 'mark'
    className?: string
    loading?: boolean
    onClick?: () => void
}

/**
 * Componente per il branding ufficiale Strava.
 * Utilizza asset certificati e dimensioni bloccate per evitare ogni distorsione.
 */
export function StravaLogo({ variant = 'powered-by', className = '', loading = false, onClick }: StravaLogoProps) {

    // Icona "M" di Strava (usata nei bottoni)
    const StravaIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
    )

    const baseButtonClass = "inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-2.5 px-6 rounded shadow-lg transition-all cursor-pointer gap-3 active:scale-95 disabled:opacity-70"

    if (variant === 'mark') {
        return (
            <div className={`text-[#FC4C02] w-6 h-6 ${className}`}>
                <StravaIcon />
            </div>
        )
    }

    if (variant === 'connect-button') {
        return (
            <div onClick={onClick} className={`${baseButtonClass} ${className}`}>
                <StravaIcon />
                <span className="text-sm">Connetti con Strava</span>
            </div>
        )
    }

    if (variant === 'sync-button') {
        return (
            <button onClick={onClick} disabled={loading} className={`${baseButtonClass} py-2 px-4 shadow-md ${className}`}>
                {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <StravaIcon />
                )}
                <span className="text-sm uppercase tracking-tight">Sincronizza ora</span>
            </button>
        )
    }

    // DEFAULT: "Powered by Strava" professionale
    return (
        <div className={`flex flex-col items-center gap-1.5 ${className}`}>
            <span className="text-[8px] text-neutral-500 uppercase tracking-[0.2em] font-bold">Powered by</span>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo_2021.svg"
                alt="Strava"
                className="h-4 w-auto block"
                style={{ minWidth: '80px', filter: 'brightness(1.1)' }}
            />
        </div>
    )
}
