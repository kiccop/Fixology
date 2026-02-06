import { useEffect } from 'react'
import { App, URLOpenListenerEvent } from '@capacitor/app'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

/**
 * Custom hook to handle Strava OAuth callback via deep links
 * Listens for app URL open events and processes the OAuth code
 */
export function useStravaAuth() {
    const router = useRouter()

    useEffect(() => {
        let listenerHandle: any

        const handleAppUrlOpen = async (event: URLOpenListenerEvent) => {
            const url = event.url

            // Check if this is a Strava OAuth callback
            // Expected format: https://mybikelog.app/api/auth/strava/callback?code=XXX&state=YYY
            if (url.includes('/api/auth/strava/callback')) {
                try {
                    const urlObj = new URL(url)
                    const code = urlObj.searchParams.get('code')
                    const error = urlObj.searchParams.get('error')
                    const state = urlObj.searchParams.get('state')

                    if (error) {
                        toast.error('Autenticazione Strava annullata')
                        return
                    }

                    if (!code) {
                        toast.error('Errore durante l\'autenticazione Strava')
                        return
                    }

                    // Show loading toast
                    toast.loading('Connessione a Strava in corso...')

                    // Call our API to exchange the code for tokens
                    const response = await fetch(
                        `/api/auth/strava/callback?code=${code}&state=${state || ''}`
                    )

                    if (response.ok) {
                        toast.dismiss()
                        toast.success('Strava connesso con successo!')
                        router.push('/dashboard/settings')
                        router.refresh()
                    } else {
                        toast.dismiss()
                        toast.error('Errore nella connessione a Strava')
                    }
                } catch (err) {
                    console.error('Error handling Strava callback:', err)
                    toast.error('Errore imprevisto')
                }
            }
        }

        const setupListener = async () => {
            // Add listener for app URL opens (deep links)
            listenerHandle = await App.addListener('appUrlOpen', handleAppUrlOpen)
        }

        setupListener()

        return () => {
            if (listenerHandle) {
                listenerHandle.remove()
            }
        }
    }, [router])
}
