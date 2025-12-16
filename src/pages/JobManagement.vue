<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { jobsService } from '@/services/jobsService'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import type { Job, CreateJobDto } from '@/types/job'
import type { JobApplication } from '@/types/jobApplication'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const jobs = ref<Job[]>([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const currentJobId = ref<string | null>(null)

// Applicants Modal
const showApplicantsModal = ref(false)
const currentApplicants = ref<JobApplication[]>([])
const isLoadingApplicants = ref(false)
const currentJobTitle = ref('')

const formData = ref<CreateJobDto>({
    title: '',
    description: '',
    salary: 0,
    location: '',
    companyId: ''
})

const loadJobs = async () => {
    if (!authStore.user?.id) return
    isLoading.value = true
    try {
        jobs.value = await jobsService.getByCompany(authStore.user.id)
    } catch (error) {
        console.error('Error loading jobs:', error)
    } finally {
        isLoading.value = false
    }
}

const openCreateModal = () => {
    isEditing.value = false
    currentJobId.value = null
    formData.value = {
        title: '',
        description: '',
        salary: 0,
        location: '',
        companyId: authStore.user?.id || ''
    }
    showModal.value = true
}

const openEditModal = (job: Job) => {
    isEditing.value = true
    currentJobId.value = job.id
    formData.value = {
        title: job.title,
        description: job.description,
        salary: job.salary,
        location: job.location,
        companyId: job.companyId
    }
    showModal.value = true
}

const openApplicantsModal = async (job: Job) => {
    currentJobTitle.value = job.title
    showApplicantsModal.value = true
    isLoadingApplicants.value = true
    try {
        currentApplicants.value = await jobsService.getApplicants(job.id)
    } catch (error) {
        console.error('Error loading applicants:', error)
    } finally {
        isLoadingApplicants.value = false
    }
}

const handleSubmit = async () => {
    // Ensure companyId is set
    if (!formData.value.companyId) {
        if (authStore.user?.id) {
            formData.value.companyId = authStore.user.id
        } else {
            notificationStore.error('No se pudo identificar la empresa. Por favor inicie sesión nuevamente.')
            return
        }
    }

    console.log('Sending job data:', formData.value)

    try {
        if (isEditing.value && currentJobId.value) {
            await jobsService.update(currentJobId.value, formData.value)
        } else {
            await jobsService.create(formData.value)
        }
        showModal.value = false
        await loadJobs()
        notificationStore.success('¡Oferta guardada exitosamente!')
    } catch (error: any) {
        console.error('Error saving job:', error)
        if (error.response) {
            console.error('Server response:', error.response.data)
            console.error('Status:', error.response.status)
        }
        notificationStore.error(`Error al guardar la oferta: ${error.response?.data?.message || error.message || 'Error desconocido'}`)
    }
}

const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta oferta?')) return
    try {
        await jobsService.delete(id)
        await loadJobs()
    } catch (error) {
        console.error('Error deleting job:', error)
    }
}

onMounted(() => {
    loadJobs()
})
</script>

<template>
    <div class="page-container">
        <div class="container">
            <!-- Header Section -->
            <div class="header-section">
                <div>
                    <h1 class="page-title">Panel de Gestión</h1>
                    <p class="page-subtitle">Administra tus ofertas y revisa postulaciones</p>
                </div>
                <button @click="openCreateModal" class="btn btn-primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Nueva Oferta
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
            </div>

            <!-- Jobs Grid -->
            <div v-else class="jobs-grid">
                <div v-for="job in jobs" :key="job.id" class="card job-card">
                    <div class="card-content">
                        <div class="card-header">
                            <div class="icon-box">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </div>
                            <div class="actions">
                                <button @click="openEditModal(job)" class="btn-icon" title="Editar">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button @click="handleDelete(job.id)" class="btn-icon btn-icon-danger" title="Eliminar">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <h2 class="job-title">{{ job.title }}</h2>
                        <div class="job-meta">
                            <span class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                {{ job.location }}
                            </span>
                            <span class="meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                                {{ job.salary }}
                            </span>
                        </div>
                        <p class="job-description">{{ job.description }}</p>
                    </div>

                    <div class="card-footer">
                        <button @click="openApplicantsModal(job)" class="btn btn-outline btn-block">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Ver Postulantes
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="jobs.length === 0" class="empty-state card">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <h3>No has publicado ofertas</h3>
                    <p>Comienza a buscar talento creando tu primera oferta de trabajo hoy mismo.</p>
                    <button @click="openCreateModal" class="btn btn-ghost">
                        Crear mi primera oferta
                    </button>
                </div>
            </div>

            <!-- Create/Edit Modal -->
            <div v-if="showModal" class="modal-backdrop">
                <div class="modal card">
                    <div class="modal-header">
                        <h2>{{ isEditing ? 'Editar Oferta' : 'Nueva Oferta' }}</h2>
                        <button @click="showModal = false" class="btn-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <form @submit.prevent="handleSubmit" class="modal-body">
                        <div class="form-group">
                            <label class="form-label">Título del Puesto</label>
                            <input 
                                v-model="formData.title" 
                                type="text" 
                                required 
                                placeholder="Ej. Senior Frontend Developer"
                                class="form-input"
                            >
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Salario (USD)</label>
                                <input 
                                    v-model="formData.salary" 
                                    type="number" 
                                    required 
                                    placeholder="5000"
                                    class="form-input"
                                >
                            </div>
                            <div class="form-group">
                                <label class="form-label">Ubicación</label>
                                <input 
                                    v-model="formData.location" 
                                    type="text" 
                                    required 
                                    placeholder="Ej. Remoto / Bogotá"
                                    class="form-input"
                                >
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea 
                                v-model="formData.description" 
                                required 
                                rows="5" 
                                placeholder="Describe las responsabilidades y requisitos del puesto..."
                                class="form-textarea"
                            ></textarea>
                        </div>

                        <div class="modal-footer">
                            <button type="button" @click="showModal = false" class="btn btn-ghost">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary">
                                {{ isEditing ? 'Guardar Cambios' : 'Publicar Oferta' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Applicants Modal -->
            <div v-if="showApplicantsModal" class="modal-backdrop">
                <div class="modal card modal-lg">
                    <div class="modal-header">
                        <div>
                            <h2>Postulantes</h2>
                            <p class="modal-subtitle">Para: <span>{{ currentJobTitle }}</span></p>
                        </div>
                        <button @click="showApplicantsModal = false" class="btn-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="modal-body scrollable">
                        <div v-if="isLoadingApplicants" class="loading-state">
                            <div class="spinner"></div>
                        </div>

                        <div v-else class="applicants-list">
                            <div v-for="app in currentApplicants" :key="app.id" class="applicant-card">
                                <div class="applicant-header">
                                    <div class="applicant-avatar">
                                        {{ app.coder?.name?.charAt(0).toUpperCase() }}
                                    </div>
                                    <div class="applicant-info">
                                        <h3>{{ app.coder?.name }}</h3>
                                        <div class="applicant-meta">
                                            <span>{{ app.coder?.email }}</span>
                                            <span>•</span>
                                            <span>{{ app.coder?.phoneNumber }}</span>
                                        </div>
                                    </div>
                                    <span class="applicant-date">
                                        {{ new Date(app.created).toLocaleDateString() }}
                                    </span>
                                </div>
                                
                                <div class="applicant-bio">
                                    <p>{{ app.coder?.description || 'Sin descripción disponible.' }}</p>
                                </div>
                            </div>

                            <div v-if="currentApplicants.length === 0" class="empty-state">
                                <div class="empty-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <h3>Aún no hay postulantes</h3>
                                <p>Tu oferta está visible, pronto llegarán candidatos.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button @click="showApplicantsModal = false" class="btn btn-secondary">
                            Cerrar
                        </button>
                    </div>
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
        align-items: center;
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

/* Jobs Grid */
.jobs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
}

@media (min-width: 768px) {
    .jobs-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .jobs-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.job-card {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
}

.card-content {
    padding: var(--spacing-lg);
    flex: 1;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
}

.icon-box {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-md);
    background: var(--color-primary-50);
    color: var(--color-primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
}

.actions {
    display: flex;
    gap: var(--spacing-xs);
}

.btn-icon {
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--color-text-tertiary);
    border-radius: var(--radius-full);
    transition: all var(--transition-fast);
}

.btn-icon:hover {
    background: var(--color-gray-100);
    color: var(--color-primary-600);
}

.btn-icon-danger:hover {
    color: var(--color-error);
    background: var(--color-error-light);
}

.job-title {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
}

.job-meta {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.job-description {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--color-surface-variant);
    border-top: 1px solid var(--color-border);
}

.btn-block {
    width: 100%;
}

/* Modal */
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
    z-index: var(--z-modal);
}

.modal {
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    padding: 0;
}

.modal-lg {
    max-width: 800px;
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
}

.modal-subtitle span {
    color: var(--color-primary-600);
    font-weight: 600;
}

.modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

/* Applicants List */
.applicants-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.applicant-card {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    background: var(--color-background);
}

.applicant-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
}

.applicant-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: var(--font-size-lg);
}

.applicant-info h3 {
    font-size: var(--font-size-lg);
    margin: 0;
    color: var(--color-text-primary);
}

.applicant-meta {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

.applicant-date {
    margin-left: auto;
    font-size: var(--font-size-xs);
    color: var(--color-text-tertiary);
    background: var(--color-surface-variant);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-full);
}

.applicant-bio {
    background: var(--color-surface-variant);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
}

/* Dark Mode Overrides */
[data-theme='dark'] .icon-box {
    background: var(--color-surface-variant);
}

[data-theme='dark'] .applicant-card {
    background: var(--color-surface);
}

[data-theme='dark'] .applicant-bio {
    background: var(--color-background);
}
</style>
