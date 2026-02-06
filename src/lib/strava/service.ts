import { StravaTokenResponse, StravaAthlete, StravaBike, Bike } from '@/types'
import { APP_CONFIG } from '@/lib/config'

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize'
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const STRAVA_API_URL = 'https://www.strava.com/api/v3'

export class StravaService {
    private clientId: string
    private clientSecret: string
    private redirectUri: string

    constructor() {
        this.clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || ''
        this.clientSecret = process.env.STRAVA_CLIENT_SECRET || ''

        // Force mybikelog.app for production redirects regardless of Vercel env vars
        // This ensures the redirect_uri always matches the Strava API settings.
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mybikelog.app'

        if (appUrl.includes('localhost')) {
            this.redirectUri = `${appUrl}/api/auth/strava/callback`
        } else {
            // Always use the primary domain for Strava in production
            this.redirectUri = 'https://mybikelog.app/api/auth/strava/callback'
        }
    }

    /**
     * Generate the Strava authorization URL
     * @param state - State parameter for CSRF protection
     * @param useMobileScheme - If true, uses custom scheme for mobile deep linking
     */
    getAuthorizationUrl(state?: string, useMobileScheme: boolean = false): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: useMobileScheme
                ? 'mybikelog://auth/callback'
                : this.redirectUri,
            response_type: 'code',
            scope: 'read,profile:read_all,activity:read',
            ...(state && { state }),
        })

        return `${STRAVA_AUTH_URL}?${params.toString()}`
    }

    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code: string): Promise<StravaTokenResponse> {
        const response = await fetch(STRAVA_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                grant_type: 'authorization_code',
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Failed to exchange code: ${error}`)
        }

        return response.json()
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshToken: string): Promise<StravaTokenResponse> {
        const response = await fetch(STRAVA_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Failed to refresh token: ${error}`)
        }

        return response.json()
    }

    /**
     * Get athlete profile (includes bikes)
     */
    async getAthlete(accessToken: string): Promise<StravaAthlete> {
        const response = await fetch(`${STRAVA_API_URL}/athlete`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch athlete data')
        }

        return response.json()
    }

    /**
     * Convert Strava frame type to our frame type
     */
    static convertFrameType(stravaFrameType: number): Bike['frame_type'] {
        const frameTypeMap: Record<number, Bike['frame_type']> = {
            1: 'mtb',
            2: 'gravel',
            3: 'road',
            4: 'road', // TT bike -> road
            5: 'other',
        }
        return frameTypeMap[stravaFrameType] || 'other'
    }

    /**
     * Convert Strava bike to our Bike format
     */
    static stravaBikeToLocalBike(stravaBike: StravaBike, userId: string): Partial<Bike> {
        return {
            user_id: userId,
            strava_id: stravaBike.id,
            name: stravaBike.name,
            brand: stravaBike.brand_name,
            model: stravaBike.model_name,
            total_km: Math.round(stravaBike.distance / 1000), // Convert meters to km
            is_primary: stravaBike.primary,
            frame_type: this.convertFrameType(stravaBike.frame_type),
            last_synced: new Date().toISOString(),
        }
    }
}

export const stravaService = new StravaService()
