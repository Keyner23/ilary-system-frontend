<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
</script>

<template>
    <div class="notification-container">
        <TransitionGroup name="notification">
            <div 
                v-for="notification in notificationStore.notifications" 
                :key="notification.id"
                :class="['notification', `notification-${notification.type}`]"
                @click="notificationStore.remove(notification.id)"
            >
                <div class="notification-icon">
                    <svg v-if="notification.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <svg v-else-if="notification.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <svg v-else-if="notification.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
                <div class="notification-content">
                    {{ notification.message }}
                </div>
                <button 
                    class="notification-close"
                    @click.stop="notificationStore.remove(notification.id)"
                    aria-label="Cerrar"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.notification-container {
    position: fixed;
    top: var(--spacing-xl);
    right: var(--spacing-xl);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    max-width: 400px;
    pointer-events: none;
}

.notification {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
    pointer-events: auto;
    cursor: pointer;
    transition: all 0.3s ease;
}

.notification:hover {
    transform: translateX(-4px);
    box-shadow: var(--shadow-xl);
}

.notification-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
}

.notification-content {
    flex: 1;
    font-size: var(--font-size-sm);
    line-height: 1.5;
    color: var(--color-text-primary);
    padding-top: 4px;
}

.notification-close {
    flex-shrink: 0;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--color-text-secondary);
    opacity: 0.6;
    transition: opacity 0.2s;
    border-radius: var(--radius-sm);
}

.notification-close:hover {
    opacity: 1;
    background: var(--color-surface-variant);
}

/* Success */
.notification-success {
    border-left: 4px solid var(--color-secondary-600);
}

.notification-success .notification-icon {
    background: var(--color-secondary-50);
    color: var(--color-secondary-700);
}

/* Error */
.notification-error {
    border-left: 4px solid #ef4444;
}

.notification-error .notification-icon {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

/* Warning */
.notification-warning {
    border-left: 4px solid #f59e0b;
}

.notification-warning .notification-icon {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
}

/* Info */
.notification-info {
    border-left: 4px solid var(--color-primary-600);
}

.notification-info .notification-icon {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
}

/* Dark mode adjustments */
[data-theme='dark'] .notification {
    background: var(--color-surface);
    border-color: var(--color-border);
}

[data-theme='dark'] .notification-success .notification-icon {
    background: rgba(0, 150, 136, 0.15);
    color: var(--color-secondary-300);
}

[data-theme='dark'] .notification-error .notification-icon {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
}

[data-theme='dark'] .notification-warning .notification-icon {
    background: rgba(245, 158, 11, 0.15);
    color: #fcd34d;
}

[data-theme='dark'] .notification-info .notification-icon {
    background: rgba(33, 150, 243, 0.15);
    color: var(--color-primary-300);
}

/* Animations */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
}

.notification-move {
    transition: transform 0.3s ease;
}

/* Mobile responsive */
@media (max-width: 640px) {
    .notification-container {
        top: var(--spacing-md);
        right: var(--spacing-md);
        left: var(--spacing-md);
        max-width: none;
    }

    .notification {
        padding: var(--spacing-md);
    }
}
</style>
