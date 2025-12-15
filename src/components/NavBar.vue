<template>
  <header class="navbar">
    <div class="container navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#gradient)" />
            <path d="M16 8L22 12V20L16 24L10 20V12L16 8Z" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#2196F3" />
                <stop offset="100%" stop-color="#1976D2" />
              </linearGradient>
            </defs>
          </svg>
          <span class="brand-name">Ilary System</span>
        </div>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="navbar-nav desktop-nav">
        <router-link to="/jobs" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span>Empleos</span>
        </router-link>
        <router-link to="/companies" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span>Empresas</span>
        </router-link>
        <router-link v-if="isAuthenticated && isCandidate" to="/applications" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Mis Postulaciones</span>
        </router-link>
      </nav>

      <!-- Right Section -->
      <div class="navbar-actions">
        <!-- Theme Toggle -->
        <button @click="toggleTheme" class="btn-icon" aria-label="Toggle theme">
          <svg v-if="!isDark" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>

        <!-- Auth Buttons -->
        <template v-if="!isAuthenticated">
          <router-link to="/login" class="btn btn-ghost btn-sm">Iniciar Sesión</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">Registrarse</router-link>
        </template>

        <!-- User Menu -->
        <div v-else class="user-menu" ref="userMenuRef">
          <button @click="toggleUserMenu" class="user-menu-trigger">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user.name" class="user-avatar" />
            <div v-else class="user-avatar-placeholder">
              {{ user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="user-name">{{ user?.name }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <transition name="dropdown">
            <div v-if="isUserMenuOpen" class="user-dropdown">
              <div class="user-dropdown-header">
                <div class="user-info">
                  <p class="user-info-name">{{ user?.name }}</p>
                  <p class="user-info-email">{{ user?.email }}</p>
                </div>
                <span class="badge badge-primary">{{ user?.role }}</span>
              </div>
              <div class="user-dropdown-divider"></div>
              <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Perfil</span>
              </router-link>
              <router-link to="/settings" class="dropdown-item" @click="closeUserMenu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                </svg>
                <span>Configuración</span>
              </router-link>
              <div class="user-dropdown-divider"></div>
              <button @click="handleLogout" class="dropdown-item dropdown-item-danger">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Mobile Menu Toggle -->
        <button @click="toggleMobileMenu" class="btn-icon mobile-menu-toggle">
          <svg v-if="!isMobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <transition name="mobile-menu">
      <nav v-if="isMobileMenuOpen" class="mobile-nav">
        <router-link to="/jobs" class="mobile-nav-link" @click="closeMobileMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span>Empleos</span>
        </router-link>
        <router-link to="/companies" class="mobile-nav-link" @click="closeMobileMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          </svg>
          <span>Empresas</span>
        </router-link>
        <router-link v-if="isAuthenticated && isCandidate" to="/applications" class="mobile-nav-link" @click="closeMobileMenu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Mis Postulaciones</span>
        </router-link>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const { user, isAuthenticated, isCandidate } = storeToRefs(authStore)
const { isDark } = storeToRefs(themeStore)

const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeUserMenu()
  router.push('/login')
}

// Close user menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  gap: var(--spacing-lg);
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: opacity var(--transition-fast);
}

.navbar-brand:hover {
  opacity: 0.8;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.brand-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.desktop-nav {
  display: none;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0.5rem 1rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--color-primary-600);
  background: var(--color-surface-variant);
}

.nav-link.router-link-active {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

[data-theme='dark'] .nav-link.router-link-active {
  background: rgba(33, 150, 243, 0.1);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  background: var(--color-surface-variant);
  color: var(--color-text-primary);
}

.mobile-menu-toggle {
  display: flex;
}

@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
}

/* User Menu */
.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.375rem 0.75rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-menu-trigger:hover {
  background: var(--color-surface-variant);
  border-color: var(--color-primary-300);
}

.user-avatar,
.user-avatar-placeholder {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.user-name {
  display: none;
  font-weight: 500;
  color: var(--color-text-primary);
}

@media (min-width: 768px) {
  .user-name {
    display: block;
  }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 16rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: var(--z-dropdown);
}

.user-dropdown-header {
  padding: var(--spacing-md);
  background: var(--color-surface-variant);
}

.user-info-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.user-info-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.user-dropdown-divider {
  height: 1px;
  background: var(--color-divider);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 0.75rem var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--color-surface-variant);
}

.dropdown-item-danger {
  color: var(--color-error);
}

.dropdown-item-danger:hover {
  background: var(--color-error-light);
  color: var(--color-error-dark);
}

/* Mobile Navigation */
.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.75rem var(--spacing-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-weight: 500;
}

.mobile-nav-link:hover {
  color: var(--color-primary-600);
  background: var(--color-surface-variant);
}

.mobile-nav-link.router-link-active {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

[data-theme='dark'] .mobile-nav-link.router-link-active {
  background: rgba(33, 150, 243, 0.1);
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-fast);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all var(--transition-base);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
