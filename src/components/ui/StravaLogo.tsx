'use client'

import React from 'react'

interface StravaLogoProps {
    variant?: 'powered-by' | 'connect-button' | 'sync-button' | 'mark'
    className?: string
    loading?: boolean
    onClick?: () => void
}

/**
 * Component for official Strava branding.
 * Uses official assets to ensure compliance and visual quality.
 */
export function StravaLogo({ variant = 'powered-by', className = '', loading = false, onClick }: StravaLogoProps) {
    // Official Strava Orange: #FC4C02

    if (variant === 'mark') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={`${className}`}
                fill="#FC4C02"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
        )
    }

    if (variant === 'connect-button') {
        return (
            <div
                className={`inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-2.5 px-6 rounded shadow-lg transition-all cursor-pointer gap-3 active:scale-95 ${className}`}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                <span className="text-sm">Connetti con Strava</span>
            </div>
        )
    }

    if (variant === 'sync-button') {
        return (
            <button
                onClick={onClick}
                disabled={loading}
                className={`inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-2 px-4 rounded shadow-md transition-all cursor-pointer gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 ${className}`}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                    </svg>
                )}
                <span className="text-sm">Sincronizza ora</span>
            </button>
        )
    }

    // Default: Powered by Strava (using high quality PNG for guaranteed clarity)
    // Strava guidelines prefer this specific asset for footers/sidebars
    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">Powered by</span>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo_2021.svg"
                alt="Strava"
                className="h-5 w-auto"
            />
        </div>
    )
}
