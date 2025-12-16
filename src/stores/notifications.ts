import { ref } from 'vue'
import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
    id: string
    type: NotificationType
    message: string
    duration?: number
}

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([])

    const show = (type: NotificationType, message: string, duration: number = 5000) => {
        const id = `notification-${Date.now()}-${Math.random()}`

        notifications.value.push({
            id,
            type,
            message,
            duration
        })

        if (duration > 0) {
            setTimeout(() => {
                remove(id)
            }, duration)
        }
    }

    const remove = (id: string) => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    const success = (message: string, duration?: number) => show('success', message, duration)
    const error = (message: string, duration?: number) => show('error', message, duration)
    const warning = (message: string, duration?: number) => show('warning', message, duration)
    const info = (message: string, duration?: number) => show('info', message, duration)

    return {
        notifications,
        show,
        remove,
        success,
        error,
        warning,
        info
    }
})
