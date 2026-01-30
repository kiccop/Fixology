import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Keyboard } from '@capacitor/keyboard'

export const initializeMobileApp = async () => {
    // Only run on native platforms
    if (!Capacitor.isNativePlatform()) {
        return
    }

    try {
        // Configure Status Bar
        await StatusBar.setStyle({ style: Style.Dark })
        await StatusBar.setBackgroundColor({ color: '#0a0a0f' }) // var(--neutral-950)

        // Configure Keyboard
        await Keyboard.setAccessoryBarVisible({ isVisible: true })

        console.log('Mobile app initialized successfully')
    } catch (error) {
        console.error('Error initializing mobile app:', error)
    }
}

// Haptic feedback helper
export const triggerHaptic = async (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!Capacitor.isNativePlatform()) {
        return
    }

    try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics')

        const styleMap = {
            light: ImpactStyle.Light,
            medium: ImpactStyle.Medium,
            heavy: ImpactStyle.Heavy,
        }

        await Haptics.impact({ style: styleMap[type] })
    } catch (error) {
        // Haptics not available, silently fail
    }
}
