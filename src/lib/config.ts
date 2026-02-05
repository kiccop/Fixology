const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        // If on local dev, use the current origin
        if (window.location.hostname === 'localhost') return window.location.origin
        // Otherwise favor the custom domain
        return 'https://mybikelog.app'
    }

    const envUrl = process.env.NEXT_PUBLIC_APP_URL
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('vercel.app')) {
        return envUrl
    }

    return 'https://mybikelog.app'
}

export const APP_CONFIG = {
    isMobile: typeof window !== 'undefined' && (window as any).Capacitor !== undefined,
    webUrl: getBaseUrl(),
    getApiUrl: (path: string) => {
        return `${getBaseUrl()}${path}`
    }
}
