<template>
  <div class="jobs-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Explorar Empleos</h1>
        <p class="page-subtitle">Descubre tu próxima oportunidad profesional entre miles de ofertas de trabajo</p>
      </div>

      <!-- Search and Filters -->
      <div class="search-section card">
        <div class="search-bar">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar empleos por título, empresa o palabras clave..."
            @input="handleSearch"
          />
        </div>
        <div class="filters">
          <select v-model="filters.type" class="filter-select" @change="handleFilterChange">
            <option value="">Todos los Tipos</option>
            <option value="full-time">Tiempo Completo</option>
            <option value="part-time">Medio Tiempo</option>
            <option value="contract">Contrato</option>
            <option value="remote">Remoto</option>
          </select>
          <select v-model="filters.location" class="filter-select" @change="handleFilterChange">
            <option value="">Todas las Ubicaciones</option>
            <option value="remote">Remoto</option>
            <option value="hybrid">Híbrido</option>
            <option value="onsite">Presencial</option>
          </select>
          <select v-model="filters.experience" class="filter-select" @change="handleFilterChange">
            <option value="">Todos los Niveles</option>
            <option value="entry">Nivel Inicial</option>
            <option value="mid">Nivel Intermedio</option>
            <option value="senior">Nivel Senior</option>
          </select>
        </div>
      </div>

      <!-- Jobs List -->
      <div class="jobs-section">
        <div class="jobs-header">
          <p class="jobs-count">{{ filteredJobs.length }} empleos encontrados</p>
          <select v-model="sortBy" class="sort-select" @change="handleSort">
            <option value="recent">Más Recientes</option>
            <option value="relevant">Más Relevantes</option>
            <option value="salary">Mayor Salario</option>
          </select>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando empleos...</p>
        </div>

        <div v-else-if="filteredJobs.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>No se encontraron empleos</h3>
          <p>Intenta ajustar tus filtros o términos de búsqueda</p>
        </div>

        <div v-else class="jobs-grid">
          <div v-for="job in filteredJobs" :key="job.id" class="job-card card">
            <div class="job-header">
              <div class="company-logo">
                {{ job.company.charAt(0) }}
              </div>
              <div class="job-meta">
                <h3 class="job-title">{{ job.title }}</h3>
                <p class="job-company">{{ job.company }}</p>
              </div>
            </div>
            <div class="job-details">
              <div class="job-detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{{ job.location }}</span>
              </div>
              <div class="job-detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>{{ job.type }}</span>
              </div>
              <div class="job-detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{{ job.postedAt }}</span>
              </div>
            </div>
            <p class="job-description">{{ job.description }}</p>
            <div class="job-tags">
              <span v-for="skill in job.skills" :key="skill" class="badge badge-primary">{{ skill }}</span>
            </div>
            <div class="job-footer">
              <div class="job-salary">{{ job.salary }}</div>
              <router-link :to="`/jobs/${job.id}`" class="btn btn-primary btn-sm">Ver Detalles</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  description: string
  skills: string[]
  salary: string
  postedAt: string
}

const isLoading = ref(false)
const searchQuery = ref('')
const sortBy = ref('recent')
const filters = ref({
  type: '',
  location: '',
  experience: ''
})

// Mock data - Replace with API call
const jobs = ref<Job[]>([
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced Frontend Developer to join our team and build amazing user experiences.',
    skills: ['Vue.js', 'TypeScript', 'CSS'],
    salary: '$80,000 - $120,000',
    postedAt: '2 days ago'
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our creative team to design beautiful and intuitive user interfaces for web and mobile applications.',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    salary: '$70,000 - $100,000',
    postedAt: '1 week ago'
  },
  {
    id: '3',
    title: 'Data Analyst',
    company: 'Analytics Inc',
    location: 'Hybrid',
    type: 'Full-time',
    description: 'Analyze complex datasets and provide actionable insights to drive business decisions.',
    skills: ['Python', 'SQL', 'Tableau'],
    salary: '$75,000 - $110,000',
    postedAt: '3 days ago'
  }
])

const filteredJobs = computed(() => {
  let result = jobs.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    )
  }

  // Type filter
  if (filters.value.type) {
    result = result.filter((job) => job.type.toLowerCase().includes(filters.value.type))
  }

  // Location filter
  if (filters.value.location) {
    result = result.filter((job) => job.location.toLowerCase().includes(filters.value.location))
  }

  return result
})

const handleSearch = () => {
  // Debounce search if needed
}

const handleFilterChange = () => {
  // Apply filters
}

const handleSort = () => {
  // Sort jobs
}
</script>

<style scoped>
.jobs-page {
  padding: var(--spacing-3xl) 0;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.search-section {
  margin-bottom: var(--spacing-2xl);
}

.search-bar {
  position: relative;
  margin-bottom: var(--spacing-lg);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  font-size: var(--font-size-base);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.filter-select,
.sort-select {
  padding: 0.75rem 1rem;
  font-size: var(--font-size-base);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-select:focus,
.sort-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
}

.jobs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.jobs-count {
  font-weight: 600;
  color: var(--color-text-primary);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--color-text-secondary);
}

.empty-state svg {
  margin: 0 auto var(--spacing-lg);
  color: var(--color-text-tertiary);
}

.jobs-grid {
  display: grid;
  gap: var(--spacing-xl);
}

.job-card {
  transition: all var(--transition-base);
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.job-header {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.company-logo {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  flex-shrink: 0;
}

.job-meta {
  flex: 1;
}

.job-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text-primary);
}

.job-company {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.job-detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.job-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
}

.job-salary {
  font-weight: 600;
  color: var(--color-primary-600);
  font-size: var(--font-size-lg);
}
</style>
