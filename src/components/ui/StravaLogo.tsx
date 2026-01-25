'use client'

import React from 'react'

interface StravaLogoProps {
    variant?: 'powered-by' | 'connect-button' | 'sync-button' | 'mark'
    className?: string
    loading?: boolean
    onClick?: () => void
}

export function StravaLogo({ variant = 'powered-by', className = '', loading = false, onClick }: StravaLogoProps) {
    if (variant === 'mark') {
        return (
            <svg
                viewBox="0 0 24 24"
                className={className}
                fill="#FC4C02"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
        )
    }

    const baseButtonClass = "inline-flex items-center bg-[#FC4C02] hover:bg-[#E34402] text-white font-bold py-2 px-4 rounded transition-all cursor-pointer gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-95"

    if (variant === 'connect-button') {
        return (
            <div className={`${baseButtonClass} ${className}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                <span>Connect with Strava</span>
            </div>
        )
    }

    if (variant === 'sync-button') {
        return (
            <button
                onClick={onClick}
                disabled={loading}
                className={`${baseButtonClass} ${className}`}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                    </svg>
                )}
                <span>Sincronizza ora</span>
            </button>
        )
    }

    // Default: Powered by Strava
    return (
        <div className={`flex flex-col items-center gap-1 ${className}`}>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Powered by</span>
            <svg
                width="100"
                height="18"
                viewBox="0 0 144 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M18.8 9.5c-2.4 0-4.4 1.7-5.5 3.9V10h-2.1v15.3h2.1V16.3c1.1 2.2 3.1 3.9 5.5 3.9 3.5 0 6.6-2.8 6.6-6.6s-3.1-6.6-6.6-6.6zm0 11c-2.6 0-4.6-2-4.6-4.4 0-2.4 2-4.4 4.6-4.4 2.6 0 4.6 2 4.6 4.4s-2 4.4-4.6 4.4zM42.3 9.5c-2.4 0-4.4 1.7-5.5 3.9V10h-2.1v15.3h2.1V16.3c1.1 2.2 3.1 3.9 5.5 3.9 3.5 0 6.6-2.8 6.6-6.6s-3.1-6.6-6.6-6.6zm0 11c-2.6 0-4.6-2-4.6-4.4 0-2.4 2-4.4 4.6-4.4 2.6 0 4.6 2 4.6 4.4s-2 4.4-4.6 4.4zM66.6 9.5c-3.1 0-5.7 2-6.5 4.8-.8-2.8-3.4-4.8-6.5-4.8-2.7 0-5.1 1.6-6.1 4V10h-1.9v9.6h2.1v-6.2c0-2 1.5-3.3 3.3-3.3s3.3 1.3 3.3 3.3v6.2h2.1v-6.2c0-2 1.5-3.3 3.3-3.3s3.3 1.3 3.3 3.3v6.2h2.1v-6.6c.1-3.1-2.2-6.1-5.3-6.1zM79.2 10.1v1.9l2.7-.1c0 1.2-.1 2.4-.4 3.6l-11-.1-.1 1.9 12.3.1c.5-1.8.8-3.6.8-5.5 0-1.2 0-2 .1-2.9l-4.4 1.1zM93.3 9.5c-3.7 0-6.7 3-6.7 6.6s3 6.6 6.7 6.6c3.7 0 6.7-3 6.7-6.6s-3-6.6-6.7-6.6zm0 11.2c-2.6 0-4.7-2-4.7-4.6 0-2.6 2.1-4.6 4.7-4.6s4.7 2 4.7 4.6c-.1 2.6-2.2 4.6-4.7 4.6zM114.9 9.5c-1.8 0-3.3.8-4.3 2.1V10h-2v15.3h2V16.6c1 1.3 2.5 2.1 4.3 2.1 3 0 5.4-2.5 5.4-5.3 0-2.2-3.1-3.9-5.4-3.9zm-.1 7.2c-1.8 0-3.3-1.4-3.3-3.1 0-1.7 1.5-3.1 3.3-3.1 1.8 0 3.3 1.4 3.3 3.1 0 1.7-1.5 3.1-3.3 3.1zM130.4 10c-3 0-5.5 2.5-5.5 5.5s2.5 5.5 5.5 5.5 5.5-2.5 5.5-5.5-2.5-5.5-5.5-5.5zm0 9.1c-1.9 0-3.5-1.6-3.5-3.6s1.6-3.6 3.5-3.6 3.5 1.6 3.5 3.6-1.6 3.6-3.5 3.6z" fill="#FC4C02" />
                <path d="M4 17.9L1.9 14.1H0L4 24l5-9.9H7.1L4 17.9zM10.7 4.4l2.7 5.3h4L10.7 0l-6.7 13.2h4l2.7-5.3z" fill="#FC4C02" />
            </svg>
        </div>
    )
}
