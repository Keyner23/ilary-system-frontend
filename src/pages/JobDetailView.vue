<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jobsService } from '@/services/jobsService'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import type { Job } from '@/types/job'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const job = ref<Job | null>(null)
const isLoading = ref(true)
const isApplying = ref(false)

const loadJob = async () => {
    const id = route.params.id as string
    try {
        job.value = await jobsService.getById(id)
    } catch (error) {
        console.error('Error loading job:', error)
        // router.push('/404')
    } finally {
        isLoading.value = false
    }
}

const handleApply = async () => {
    if (!authStore.user?.id || !job.value) return
    isApplying.value = true
    try {
        await jobsService.apply(job.value.id, authStore.user.id)
        notificationStore.success('¡Postulación enviada exitosamente!')
        router.push('/jobs')
    } catch (error) {
        console.error('Error applying to job:', error)
        notificationStore.error('Error al postular. Inténtalo de nuevo.')
    } finally {
        isApplying.value = false
    }
}

onMounted(() => {
    loadJob()
})
</script>

<template>
    <div class="page-container">
        <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando detalles...</p>
        </div>

        <div v-else-if="job" class="container content-wrapper">
            <div class="card detail-card">
                <div class="card-header">
                    <div class="header-content">
                        <h1 class="job-title">{{ job.title }}</h1>
                        <p class="company-name">{{ job.company?.name || 'Empresa Confidencial' }}</p>
                        
                        <div class="meta-tags">
                            <span class="tag">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                {{ job.location }}
                            </span>
                            <span class="tag tag-success">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                                {{ job.salary.toLocaleString() }}
                            </span>
                            <span class="tag tag-blue">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Publicado: {{ new Date(job.created).toLocaleDateString() }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="card-body">
                    <h3 class="section-title">Descripción del Puesto</h3>
                    <div class="job-description">
                        {{ job.description }}
                    </div>
                </div>

                <div class="card-footer">
                    <router-link to="/jobs" class="btn btn-ghost">
                        ← Volver a Empleos
                    </router-link>
                    
                    <button 
                        v-if="authStore.user?.role === 'coder'"
                        @click="handleApply" 
                        :disabled="isApplying"
                        class="btn btn-primary btn-lg"
                    >
                        <span v-if="isApplying" class="spinner spinner-sm"></span>
                        {{ isApplying ? 'Enviando...' : 'Postularme Ahora' }}
                    </button>
                    <div v-else-if="!authStore.isAuthenticated" class="auth-prompt">
                        <router-link to="/login" class="link">Inicia sesión</router-link> para postularte.
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="empty-state">
            <h3>Oferta no encontrada</h3>
            <router-link to="/jobs" class="btn btn-primary">
                Volver a Empleos
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    min-height: 100vh;
    background-color: var(--color-background);
    padding: var(--spacing-2xl) 0;
}

.content-wrapper {
    max-width: 800px;
}

.detail-card {
    padding: 0;
    overflow: hidden;
}

.card-header {
    padding: var(--spacing-2xl);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
}

.job-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-xs);
    color: var(--color-text-primary);
}

.company-name {
    font-size: var(--font-size-xl);
    color: var(--color-primary-600);
    margin-bottom: var(--spacing-lg);
    font-weight: 500;
}

.meta-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    background: var(--color-gray-100);
    color: var(--color-text-secondary);
}

.tag-success {
    background: var(--color-secondary-50);
    color: var(--color-secondary-700);
}

.tag-blue {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
}

.card-body {
    padding: var(--spacing-2xl);
}

.section-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
    color: var(--color-text-primary);
}

.job-description {
    font-size: var(--font-size-base);
    line-height: 1.8;
    color: var(--color-text-secondary);
    white-space: pre-line;
}

.card-footer {
    padding: var(--spacing-xl) var(--spacing-2xl);
    background: var(--color-surface-variant);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.auth-prompt {
    color: var(--color-text-secondary);
    font-style: italic;
}

.link {
    color: var(--color-primary-600);
    font-weight: 600;
}

.link:hover {
    text-decoration: underline;
}

.loading-state,
.empty-state {
    text-align: center;
    padding: var(--spacing-3xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
}

.spinner-sm {
    width: 1rem;
    height: 1rem;
    border-width: 2px;
    border-top-color: white;
}

/* Dark Mode Overrides */
[data-theme='dark'] .tag {
    background: var(--color-surface-variant);
    color: var(--color-text-secondary);
}

[data-theme='dark'] .tag-success {
    background: rgba(0, 150, 136, 0.1);
    color: var(--color-secondary-300);
}

[data-theme='dark'] .tag-blue {
    background: rgba(33, 150, 243, 0.1);
    color: var(--color-primary-300);
}
</style>
