<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { jobsService } from '@/services/jobsService'
import { useAuthStore } from '@/stores/auth'
import type { JobApplication } from '@/types/jobApplication'

const authStore = useAuthStore()
const applications = ref<JobApplication[]>([])
const isLoading = ref(true)
const showDetailModal = ref(false)
const selectedApplication = ref<JobApplication | null>(null)

const loadApplications = async () => {
    if (!authStore.user?.id) return
    try {
        applications.value = await jobsService.getMyApplications(authStore.user.id)
    } catch (error) {
        console.error('Error loading applications:', error)
    } finally {
        isLoading.value = false
    }
}

const openDetailModal = (app: JobApplication) => {
    selectedApplication.value = app
    showDetailModal.value = true
}

const getStatusColor = (color: string) => {
    const colorMap: Record<string, string> = {
        'info': 'var(--color-primary-600)',
        'warning': '#f59e0b',
        'primary': 'var(--color-primary-600)',
        'success': 'var(--color-secondary-600)',
        'danger': '#ef4444'
    }
    return colorMap[color] || 'var(--color-primary-600)'
}

onMounted(() => {
    loadApplications()
})
</script>

<template>
    <div class="page-container">
        <div class="container content-wrapper">
            <div class="header-section">
                <div>
                    <h1 class="page-title">Mis Postulaciones</h1>
                    <p class="page-subtitle">Seguimiento de tus procesos de selección</p>
                </div>
                <div class="stats-card">
                    Total: <span class="stats-count">{{ applications.length }}</span> candidaturas
                </div>
            </div>

            <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Cargando tu historial...</p>
            </div>

            <div v-else-if="applications.length > 0" class="applications-list">
                <div v-for="app in applications" :key="app.id" class="card app-card">
                    <div 
                        class="status-indicator" 
                        :style="{ backgroundColor: getStatusColor(app.status?.color || 'info') }"
                    ></div>
                    
                    <div class="app-content">
                        <div class="app-main-info">
                            <div class="title-row">
                                <h2 class="job-title">{{ app.job?.title }}</h2>
                                <span 
                                    class="badge" 
                                    :class="`badge-${app.status?.color || 'info'}`"
                                >
                                    {{ app.status?.name || 'Enviada' }}
                                </span>
                            </div>
                            
                            <p class="company-name">
                                {{ app.job?.company?.name || 'Empresa Confidencial' }}
                            </p>

                            <div class="meta-info">
                                <span class="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    {{ app.job?.location }}
                                </span>
                                <span class="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="1" x2="12" y2="23"></line>
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                    ${{ app.job?.salary?.toLocaleString() }}
                                </span>
                                <span class="meta-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    Aplicado el {{ new Date(app.created).toLocaleDateString() }}
                                </span>
                            </div>
                        </div>

                        <div class="app-actions">
                            <button class="btn btn-outline btn-sm" @click="openDetailModal(app)">
                                Ver Estado
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state card">
                <div class="empty-illustration">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                </div>
                
                <h3>Aún no te has postulado</h3>
                <p>Tu carrera profesional comienza con el primer paso. Explora las ofertas disponibles y encuentra tu lugar ideal.</p>
                
                <router-link to="/jobs" class="btn btn-primary btn-lg">
                    Explorar Ofertas
                </router-link>
            </div>
        </div>

        <!-- Detail Modal -->
        <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Estado de tu Postulación</h2>
                    <button class="modal-close" @click="showDetailModal = false">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="modal-body" v-if="selectedApplication">
                    <div class="detail-section">
                        <h3 class="detail-title">{{ selectedApplication.job?.title }}</h3>
                        <p class="detail-company">{{ selectedApplication.job?.company?.name }}</p>
                    </div>

                    <div class="status-timeline">
                        <div class="status-current">
                            <div 
                                class="status-icon"
                                :style="{ backgroundColor: getStatusColor(selectedApplication.status?.color || 'info') }"
                            >
                                <svg v-if="selectedApplication.status?.color === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <svg v-else-if="selectedApplication.status?.color === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div class="status-info">
                                <h4>{{ selectedApplication.status?.name || 'Enviada' }}</h4>
                                <p>{{ selectedApplication.status?.description || 'Tu postulación ha sido enviada' }}</p>
                            </div>
                        </div>

                        <div class="timeline-details">
                            <div class="timeline-item">
                                <span class="timeline-label">Fecha de postulación:</span>
                                <span class="timeline-value">{{ new Date(selectedApplication.created).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                            </div>
                            <div class="timeline-item">
                                <span class="timeline-label">Última actualización:</span>
                                <span class="timeline-value">{{ new Date(selectedApplication.updated).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="job-details">
                        <h4>Detalles de la Oferta</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div>
                                    <span class="detail-label">Ubicación</span>
                                    <span class="detail-value">{{ selectedApplication.job?.location }}</span>
                                </div>
                            </div>
                            <div class="detail-item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                                <div>
                                    <span class="detail-label">Salario</span>
                                    <span class="detail-value">${{ selectedApplication.job?.salary?.toLocaleString() }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-outline" @click="showDetailModal = false">
                        Cerrar
                    </button>
                </div>
            </div>
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
    max-width: 1024px;
}

.header-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
}

@media (min-width: 768px) {
    .header-section {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }
}

.page-title {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-xs);
    color: var(--color-text-primary);
}

.page-subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin: 0;
}

.stats-card {
    background: var(--color-surface);
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    box-shadow: var(--shadow-sm);
}

.stats-count {
    color: var(--color-text-primary);
    font-weight: 700;
    font-size: var(--font-size-lg);
}

.applications-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.app-card {
    position: relative;
    padding: 0;
    overflow: hidden;
    display: flex;
}

.status-indicator {
    width: 6px;
    flex-shrink: 0;
}

.app-content {
    flex: 1;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

@media (min-width: 768px) {
    .app-content {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
}

.app-main-info {
    flex: 1;
}

.title-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xs);
    flex-wrap: wrap;
}

.job-title {
    font-size: var(--font-size-xl);
    margin: 0;
    color: var(--color-text-primary);
}

.company-name {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
}

.meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--font-size-sm);
    color: var(--color-text-tertiary);
    background: var(--color-background);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-md);
}

.app-actions {
    display: flex;
    align-items: center;
}

/* Badge colors */
.badge-info {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
}

.badge-warning {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
}

.badge-primary {
    background: var(--color-primary-50);
    color: var(--color-primary-700);
}

.badge-success {
    background: var(--color-secondary-50);
    color: var(--color-secondary-700);
}

.badge-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

[data-theme='dark'] .badge-info {
    background: rgba(33, 150, 243, 0.15);
    color: var(--color-primary-300);
}

[data-theme='dark'] .badge-warning {
    background: rgba(245, 158, 11, 0.15);
    color: #fcd34d;
}

[data-theme='dark'] .badge-success {
    background: rgba(0, 150, 136, 0.15);
    color: var(--color-secondary-300);
}

[data-theme='dark'] .badge-danger {
    background: rgba(239, 68, 68, 0.15);
    color: #fca5a5;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-md);
}

.modal-content {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
    margin: 0;
    font-size: var(--font-size-xl);
}

.modal-close {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    border-radius: var(--radius-md);
    transition: all 0.2s;
}

.modal-close:hover {
    background: var(--color-surface-variant);
    color: var(--color-text-primary);
}

.modal-body {
    padding: var(--spacing-xl);
}

.detail-section {
    margin-bottom: var(--spacing-xl);
}

.detail-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xs);
    color: var(--color-text-primary);
}

.detail-company {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    margin: 0;
}

.status-timeline {
    background: var(--color-background);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-xl);
}

.status-current {
    display: flex;
    gap: var(--spacing-lg);
    align-items: flex-start;
    margin-bottom: var(--spacing-lg);
}

.status-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.status-info h4 {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-lg);
    color: var(--color-text-primary);
}

.status-info p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
}

.timeline-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
}

.timeline-item {
    display: flex;
    justify-content: space-between;
    font-size: var(--font-size-sm);
}

.timeline-label {
    color: var(--color-text-secondary);
}

.timeline-value {
    color: var(--color-text-primary);
    font-weight: 500;
}

.job-details h4 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-lg);
}

.detail-grid {
    display: grid;
    gap: var(--spacing-md);
}

.detail-item {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-start;
    padding: var(--spacing-md);
    background: var(--color-background);
    border-radius: var(--radius-md);
}

.detail-item svg {
    color: var(--color-primary-600);
    flex-shrink: 0;
}

.detail-item > div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-label {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.detail-value {
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    font-weight: 500;
}

.modal-footer {
    padding: var(--spacing-lg) var(--spacing-xl);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-3xl);
    max-width: 600px;
    margin: 2rem auto;
}

.empty-illustration {
    color: var(--color-primary-300);
    margin-bottom: var(--spacing-lg);
}

/* Loading State */
.loading-state {
    text-align: center;
    padding: var(--spacing-3xl);
}
</style>
