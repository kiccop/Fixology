import { LocalNotifications } from '@capacitor/local-notifications'
import { Capacitor } from '@capacitor/core'

export const notificationService = {
    async requestPermissions() {
        if (!Capacitor.isNativePlatform()) return false
        try {
            const status = await LocalNotifications.requestPermissions()
            return status.display === 'granted'
        } catch (error) {
            console.error('Error requesting notification permissions:', error)
            return false
        }
    },

    async checkPermissions() {
        if (!Capacitor.isNativePlatform()) return true
        try {
            const status = await LocalNotifications.checkPermissions()
            return status.display === 'granted'
        } catch {
            return false
        }
    },

    async scheduleMaintenanceAlert(componentName: string, bikeName: string, id: number) {
        if (!Capacitor.isNativePlatform()) return

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
