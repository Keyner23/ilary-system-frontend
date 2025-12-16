<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="branding-content">
          <div class="logo-large">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="url(#gradient)" />
              <path d="M32 16L44 24V40L32 48L20 40V24L32 16Z" fill="white" />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stop-color="#2196F3" />
                  <stop offset="100%" stop-color="#1976D2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="branding-title">Bienvenido a Ilary System</h1>
          <p class="branding-subtitle">
            Conéctate con las mejores empresas y encuentra el trabajo de tus sueños. Únete a miles de profesionales
            que están avanzando en sus carreras.
          </p>
          <div class="branding-features">
            <div class="feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Acceso a ofertas de trabajo premium</span>
            </div>
            <div class="feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Contacto directo con reclutadores</span>
            </div>
            <div class="feature-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Rastrea tus postulaciones</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="auth-form-container">
        <div class="auth-form-wrapper">
          <div class="auth-header">
            <h2 class="auth-title">Iniciar Sesión</h2>
            <p class="auth-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                placeholder="tu@ejemplo.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <div class="form-label-row">
                <label for="password" class="form-label">Contraseña</label>
                <router-link to="/forgot-password" class="form-link">¿Olvidaste tu contraseña?</router-link>
              </div>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Ingresa tu contraseña"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="error" class="alert alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{{ error }}</span>
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="isLoading">
              <span v-if="!isLoading">Iniciar Sesión</span>
              <span v-else class="btn-loading">
                <span class="spinner"></span>
                <span>Iniciando sesión...</span>
              </span>
            </button>
          </form>

          <div class="auth-footer">
            <p class="auth-footer-text">
              ¿No tienes una cuenta?
              <router-link to="/register" class="auth-footer-link">Regístrate</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)

const formData = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

const handleLogin = async () => {
  const success = await authStore.login(formData.value)
  if (success) {
    if (authStore.isRecruiter) {
      router.push('/company/jobs')
    } else {
      router.push('/')
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%);
}

[data-theme='dark'] .auth-page {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 1200px;
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

@media (min-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr 1fr;
  }
}

.auth-branding {
  display: none;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  padding: var(--spacing-3xl);
  color: white;
}

@media (min-width: 1024px) {
  .auth-branding {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.branding-content {
  max-width: 28rem;
}

.logo-large {
  margin-bottom: var(--spacing-xl);
  animation: fadeIn 0.6s ease-out;
}

.branding-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: white;
  animation: fadeIn 0.8s ease-out;
}

.branding-subtitle {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin-bottom: var(--spacing-2xl);
  color: rgba(255, 255, 255, 0.9);
  animation: fadeIn 1s ease-out;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: rgba(255, 255, 255, 0.95);
  font-size: var(--font-size-base);
  animation: slideInRight 1.2s ease-out;
}

.auth-form-container {
  padding: var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .auth-form-container {
    padding: var(--spacing-3xl);
  }
}

.auth-form-wrapper {
  width: 100%;
  max-width: 28rem;
}

.auth-header {
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.auth-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.form-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.form-link:hover {
  color: var(--color-primary-700);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-text-primary);
}

.btn-block {
  width: 100%;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.alert-error {
  background: var(--color-error-light);
  color: var(--color-error-dark);
  border: 1px solid var(--color-error);
}

.auth-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.auth-footer-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-footer-link {
  color: var(--color-primary-600);
  font-weight: 600;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.auth-footer-link:hover {
  color: var(--color-primary-700);
}
</style>
