<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title fade-in">
              Encuentra el Trabajo de tus Sueños
              <span class="hero-title-highlight">Hoy</span>
            </h1>
            <p class="hero-subtitle fade-in">
              Conéctate con las mejores empresas y descubre oportunidades que se ajustan a tus habilidades y aspiraciones.
              Tu próximo paso profesional comienza aquí.
            </p>
            <div class="hero-actions fade-in">
              <router-link to="/jobs" class="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <span>Explorar Empleos</span>
              </router-link>
              <router-link v-if="!isAuthenticated" to="/register" class="btn btn-outline btn-lg">
                Comenzar
              </router-link>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-value">10,000+</div>
                <div class="stat-label">Empleos Activos</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">5,000+</div>
                <div class="stat-label">Empresas</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">50,000+</div>
                <div class="stat-label">Candidatos</div>
              </div>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-image-wrapper">
              <div class="floating-card card-1">
                <div class="card-icon">💼</div>
                <div class="card-content">
                  <div class="card-title">Software Engineer</div>
                  <div class="card-company">Tech Corp</div>
                  <div class="card-badge badge badge-success">Remote</div>
                </div>
              </div>
              <div class="floating-card card-2">
                <div class="card-icon">🎨</div>
                <div class="card-content">
                  <div class="card-title">UI/UX Designer</div>
                  <div class="card-company">Design Studio</div>
                  <div class="card-badge badge badge-primary">Full-time</div>
                </div>
              </div>
              <div class="floating-card card-3">
                <div class="card-icon">📊</div>
                <div class="card-content">
                  <div class="card-title">Data Analyst</div>
                  <div class="card-company">Analytics Inc</div>
                  <div class="card-badge badge badge-warning">Hybrid</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">¿Por Qué Elegir Ilary System?</h2>
          <p class="section-subtitle">Todo lo que necesitas para avanzar en tu carrera en una sola plataforma</p>
        </div>
        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <h3 class="feature-title">Búsqueda Inteligente</h3>
            <p class="feature-description">
              Nuestro algoritmo impulsado por IA te conecta con empleos que se ajustan a tus habilidades, experiencia y objetivos profesionales.
            </p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 class="feature-title">Contacto Directo</h3>
            <p class="feature-description">
              Conéctate directamente con reclutadores y gerentes de contratación para causar una impresión duradera.
            </p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 class="feature-title">Seguimiento de Postulaciones</h3>
            <p class="feature-description">
              Mantén un registro de todas tus postulaciones en un solo lugar y nunca pierdas una oportunidad.
            </p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3 class="feature-title">Ofertas Premium</h3>
            <p class="feature-description">
              Accede a ofertas de trabajo exclusivas de las mejores empresas antes de que se publiquen en otros lugares.
            </p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <h3 class="feature-title">Creador de Perfil</h3>
            <p class="feature-description">
              Crea un perfil profesional que muestre tus habilidades y experiencia a los empleadores.
            </p>
          </div>
          <div class="feature-card card">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3 class="feature-title">Análisis de Carrera</h3>
            <p class="feature-description">
              Obtén información personalizada y recomendaciones para ayudarte a crecer en tu carrera.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-card card-glass">
          <h2 class="cta-title">¿Listo para Dar el Siguiente Paso?</h2>
          <p class="cta-subtitle">
            Únete a miles de profesionales que han encontrado el trabajo de sus sueños a través de Ilary System
          </p>
          <div class="cta-actions">
            <router-link v-if="!isAuthenticated" to="/register" class="btn btn-primary btn-lg">
              Crear Cuenta Gratis
            </router-link>
            <router-link to="/jobs" class="btn btn-secondary btn-lg">
              Explorar Empleos
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  padding: var(--spacing-3xl) 0;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%);
  position: relative;
  overflow: hidden;
}

[data-theme='dark'] .hero {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(0, 150, 136, 0.1) 100%);
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 60%;
  height: 200%;
  background: radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-20px, 20px) rotate(5deg); }
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (min-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr 1fr;
  }
}

.hero-text {
  max-width: 600px;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-4xl);
  }
}

.hero-title-highlight {
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary-600);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.hero-image {
  display: none;
}

@media (min-width: 1024px) {
  .hero-image {
    display: block;
  }
}

.hero-image-wrapper {
  position: relative;
  height: 500px;
}

.floating-card {
  position: absolute;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  gap: var(--spacing-md);
  min-width: 280px;
  animation: floatCard 6s ease-in-out infinite;
}

.card-1 {
  top: 10%;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  top: 40%;
  right: 10%;
  animation-delay: 2s;
}

.card-3 {
  bottom: 10%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.card-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.card-company {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.card-badge {
  display: inline-block;
}

/* Features Section */
.features {
  padding: var(--spacing-3xl) 0;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto var(--spacing-3xl);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  text-align: center;
  transition: transform var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-700) 100%);
  color: white;
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-lg);
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.feature-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: var(--spacing-3xl) 0;
  background: var(--color-surface-variant);
}

.cta-card {
  text-align: center;
  padding: var(--spacing-3xl);
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.cta-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  justify-content: center;
}
</style>
