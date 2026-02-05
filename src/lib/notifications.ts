import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

export const notificationService = {
    async requestPermissions() {
        if (!Capacitor.isNativePlatform()) {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                const permission = await Notification.requestPermission()
                return permission === 'granted'
            }
            return false
        }
        try {
            const status = await LocalNotifications.requestPermissions()
            return status.display === 'granted'
        } catch (error) {
            console.error('Error requesting notification permissions:', error)
            return false
        }
    },

    async checkPermissions() {
        if (!Capacitor.isNativePlatform()) {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                return Notification.permission === 'granted'
            }
            return true // Fallback for browsers without notification API
        }
        try {
            const status = await LocalNotifications.checkPermissions()
            return status.display === 'granted'
        } catch {
            return false
        }
    },

    async scheduleMaintenanceAlert(componentName: string, bikeName: string, id: number) {
        if (!Capacitor.isNativePlatform()) {
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('Manutenzione Necessaria', {
                    body: `Il componente ${componentName} su ${bikeName} ha raggiunto la soglia di usura.`,
                    icon: '/favicon.ico' // Or a specific app icon
                })
            }
            return
        }

        try {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title: 'Manutenzione Necessaria',
                        body: `Il componente ${componentName} su ${bikeName} ha raggiunto la soglia di usura.`,
                        id: id,
                        schedule: { at: new Date(Date.now() + 1000) }, // Schedule for now
                        sound: 'default',
                        attachments: [],
                        actionTypeId: '',
                        extra: null,
                        channelId: 'maintenance'
                    }
                ]
            })
        } catch (error) {
            console.error('Error scheduling notification:', error)
        }
    },

    async cancelAll() {
        if (!Capacitor.isNativePlatform()) return
        try {
            const pending = await LocalNotifications.getPending()
            if (pending.notifications.length > 0) {
                await LocalNotifications.cancel(pending)
            }
        } catch (error) {
            console.error('Error canceling notifications:', error)
        }
    }
}
