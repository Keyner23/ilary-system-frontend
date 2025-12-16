import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/pages/HomeView.vue'
import LoginView from '@/pages/LoginView.vue'
import RegisterView from '@/pages/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Inicio - Ilary System' }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Iniciar Sesión - Ilary System', guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Crear Cuenta - Ilary System', guest: true }
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/pages/JobsView.vue'),
      meta: { title: 'Explorar Empleos - Ilary System' }
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('@/pages/JobDetailView.vue'),
      meta: { title: 'Detalles del Empleo - Ilary System' }
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('@/pages/CompaniesView.vue'),
      meta: { title: 'Empresas - Ilary System' }
    },
    {
      path: '/applications',
      name: 'applications',
      component: () => import('@/pages/ApplicationsView.vue'),
      meta: { title: 'Mis Postulaciones - Ilary System', requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfileView.vue'),
      meta: { title: 'Mi Perfil - Ilary System', requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SettingsView.vue'),
      meta: { title: 'Configuración - Ilary System', requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundView.vue'),
      meta: { title: '404 - Página No Encontrada' }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isGuest = to.matched.some((record) => record.meta.guest)

  // Set page title
  document.title = (to.meta.title as string) || 'Ilary System'

  // Check authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (isGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
