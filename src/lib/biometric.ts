import { NativeBiometric, BiometryType } from 'capacitor-native-biometric'
import { APP_CONFIG } from './config'

export const biometricAuth = {
    /**
     * Checks if biometric authentication is available on the device.
     */
    async isAvailable() {
        if (!APP_CONFIG.isMobile) return false
        try {
            const result = await NativeBiometric.isAvailable()
            return !!result.isAvailable
        } catch (error) {
            console.error('Biometric availability check failed:', error)
            return false
        }
    },

    /**
     * Prompts the user for biometric authentication.
     */
    async authenticate(reason: string = 'Accedi a MyBikelog') {
        if (!APP_CONFIG.isMobile) return false

        try {
            await NativeBiometric.verifyIdentity({
                reason,
                title: 'Autenticazione Biometrica',
                subtitle: 'Usa il riconoscimento facciale o l\'impronta digitale',
                description: 'Verifica la tua identità per accedere velocemente.',
            })
            return true
        } catch (error) {
            console.error('Biometric authentication failed:', error)
            return false
        }
    },

    /**
     * Helper to get the biometry type (FaceID, TouchID, Fingerprint, etc.)
     */
    async getBiometryType(): Promise<BiometryType | null> {
        if (!APP_CONFIG.isMobile) return null
        try {
            const result = await NativeBiometric.isAvailable()
            return result.biometryType || null
        } catch {
            return null
        }
    },

    enableForUser(userId: string) {
        localStorage.setItem(`biometric-enabled-${userId}`, 'true')
    },

    disableForUser(userId: string) {
        localStorage.removeItem(`biometric-enabled-${userId}`)
    },

    isEnabledForUser(userId: string) {
        return localStorage.getItem(`biometric-enabled-${userId}`) === 'true'
    },

    setLastUser(userId: string) {
        localStorage.setItem('last-user-id', userId)
    },

    getLastUser() {
        return localStorage.getItem('last-user-id')
    }
}
