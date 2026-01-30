export const APP_CONFIG = {
    isMobile: typeof window !== 'undefined' && (window as any).Capacitor !== undefined,
    webUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://mybikelog.app',
    getApiUrl: (path: string) => {
        // If we are on mobile, we must use absolute URLs pointing to the hosted backend
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mybikelog.app'
        return `${baseUrl}${path}`
    }
}
