<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { jobsService } from '@/services/jobsService'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import type { Job } from '@/types/job'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const jobs = ref<Job[]>([])
const isLoading = ref(false)
const applyingId = ref<string | null>(null)
const searchQuery = ref('')
const selectedLocation = ref('')

const loadJobs = async () => {
    isLoading.value = true
    try {
        jobs.value = await jobsService.getAll()
    } catch (error) {
        console.error('Error loading jobs:', error)
    } finally {
        isLoading.value = false
    }
}

const handleApply = async (jobId: string) => {
    if (!authStore.user?.id) return
    applyingId.value = jobId
    try {
        await jobsService.apply(jobId, authStore.user.id)
        notificationStore.success('¡Postulación enviada exitosamente!')
    } catch (error) {
        console.error('Error applying to job:', error)
        notificationStore.error('Error al postular. Inténtalo de nuevo.')
    } finally {
        applyingId.value = null
    }
}

const filteredJobs = computed(() => {
    return jobs.value.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            job.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            job.company?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesLocation = !selectedLocation.value || job.location.toLowerCase().includes(selectedLocation.value.toLowerCase())
        return matchesSearch && matchesLocation
    })
})

const locations = computed(() => {
    const locs = new Set(jobs.value.map(j => j.location))
    return Array.from(locs)
})

onMounted(() => {
    loadJobs()
})
</script>

<template>
    <div class="page-container">
        <!-- Hero Section -->
        <div class="hero-section">
            <div class="container hero-content">
                <h1 class="hero-title">
                    Encuentra tu trabajo <span class="highlight">ideal</span>
                </h1>
                <p class="hero-subtitle">
                    Conectamos a los mejores talentos con empresas líderes. Explora oportunidades que impulsarán tu carrera profesional.
                </p>
                
                <!-- Search Bar -->
                <div class="search-bar card">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            v-model="searchQuery"
                            type="text" 
                            placeholder="Buscar por cargo, empresa o palabra clave..." 
                            class="search-input"
                        >
                    </div>
                    <div class="divider"></div>
                    <div class="location-wrapper">
                        <svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <select v-model="selectedLocation" class="location-select">
                            <option value="">Ubicación</option>
                            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                        </select>
                    </div>
                    <button class="btn btn-primary search-btn">Buscar</button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="container content-container">
            <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Buscando las mejores ofertas...</p>
            </div>

            <div v-else-if="filteredJobs.length > 0" class="jobs-grid">
                <div v-for="job in filteredJobs" :key="job.id" class="card job-card">
                    <div class="card-header">
                        <div class="company-logo">
                            {{ job.company?.name?.charAt(0).toUpperCase() || 'E' }}
                        </div>
                        <div class="job-info">
                            <h3 class="job-title">{{ job.title }}</h3>
                            <p class="company-name">{{ job.company?.name || 'Empresa Confidencial' }}</p>
                        </div>
                    </div>

                    <div class="tags">
                        <span class="tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {{ job.location }}
                        </span>
                        <span class="tag tag-success">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            {{ job.salary.toLocaleString() }}
                        </span>
                        <span class="tag tag-blue">Full Time</span>
                    </div>
                    
                    <p class="job-description">
                        {{ job.description }}
                    </p>

                    <button 
                        @click="handleApply(job.id)" 
                        :disabled="applyingId === job.id"
                        class="btn btn-primary btn-block apply-btn"
                    >
                        <span v-if="applyingId === job.id" class="spinner spinner-sm"></span>
                        {{ applyingId === job.id ? 'Enviando...' : 'Postularme Ahora' }}
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state card">
                <div class="empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <h3>No encontramos ofertas</h3>
                <p>No hay resultados que coincidan con tu búsqueda "{{ searchQuery }}". Intenta con otros términos o limpia los filtros.</p>
                <button @click="searchQuery = ''; selectedLocation = ''" class="btn btn-ghost">
                    Limpiar filtros
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    min-height: 100vh;
    background-color: var(--color-background);
    padding-bottom: var(--spacing-3xl);
}

.hero-section {
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: var(--spacing-3xl) 0;
    margin-bottom: var(--spacing-2xl);
}

.hero-content {
    text-align: center;
    max-width: 800px;
}

.hero-title {
    font-size: var(--font-size-5xl);
    font-weight: 800;
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
}

.highlight {
    color: var(--color-primary-600);
    background: linear-gradient(120deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0) 100%);
    padding: 0 0.2em;
}

.hero-subtitle {
    font-size: var(--font-size-xl);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-2xl);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* Search Bar */
.search-bar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    max-width: 800px;
    margin: 0 auto;
}

@media (min-width: 768px) {
    .search-bar {
        flex-direction: row;
        align-items: center;
        padding: var(--spacing-xs);
    }
}

.search-input-wrapper,
.location-wrapper {
    position: relative;
    flex: 1;
}

.search-icon,
.location-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-tertiary);
    pointer-events: none;
}

.search-input,
.location-select {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: none;
    background: transparent;
    font-size: var(--font-size-base);
    color: var(--color-text-primary);
    outline: none;
}

.location-select {
    cursor: pointer;
    appearance: none;
}

.divider {
    display: none;
    width: 1px;
    height: 2rem;
    background-color: var(--color-border);
    margin: 0 var(--spacing-xs);
}

@media (min-width: 768px) {
    .divider {
        display: block;
    }
}

.search-btn {
    border-radius: var(--radius-lg);
    padding: 0.75rem 2rem;
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
    height: 100%;
    transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.job-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
}

.card-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.company-logo {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: var(--radius-md);
    background: var(--color-primary-50);
    color: var(--color-primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);
    font-weight: 700;
}

.job-info {
    flex: 1;
}

.job-title {
    font-size: var(--font-size-lg);
    margin-bottom: 0.25rem;
    color: var(--color-text-primary);
}

.company-name {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin: 0;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-md);
    font-size: var(--font-size-xs);
    font-weight: 600;
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

.job-description {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
}

.apply-btn {
    width: 100%;
    margin-top: auto;
}

.spinner-sm {
    width: 1rem;
    height: 1rem;
    border-width: 2px;
    border-top-color: white;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
    text-align: center;
    padding: var(--spacing-3xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.empty-state {
    max-width: 600px;
    margin: 0 auto;
}

.empty-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--color-primary-50);
    color: var(--color-primary-600);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
}

/* Dark Mode Adjustments */
[data-theme='dark'] .company-logo {
    background: var(--color-surface-variant);
}

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

[data-theme='dark'] .highlight {
    background: linear-gradient(120deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0) 100%);
}
</style>
