# Guía de Integración con el Backend

Esta guía te ayudará a conectar el frontend con tu backend de Ilary System.

## 📋 Prerequisitos

1. Backend corriendo (por defecto en `http://localhost:5000`)
2. Base de datos Supabase configurada
3. Endpoints del backend documentados

## 🔧 Configuración Inicial

### 1. Configurar Variables de Entorno

Edita el archivo `.env`:

```env
# URL de tu API backend
VITE_API_BASE_URL=http://localhost:5000/api

# O si está desplegado:
# VITE_API_BASE_URL=https://tu-api.com/api
```

### 2. Verificar Endpoints del Backend

Asegúrate de que tu backend tenga estos endpoints:

#### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil

#### Jobs
- `GET /api/jobs` - Listar trabajos
- `GET /api/jobs/:id` - Obtener trabajo específico
- `POST /api/jobs` - Crear trabajo (recruiter)
- `PUT /api/jobs/:id` - Actualizar trabajo (recruiter)
- `DELETE /api/jobs/:id` - Eliminar trabajo (recruiter)
- `POST /api/jobs/:id/apply` - Aplicar a trabajo (candidate)

#### Applications
- `GET /api/applications` - Mis aplicaciones
- `GET /api/applications/:id` - Aplicación específica
- `DELETE /api/applications/:id` - Retirar aplicación
- `PATCH /api/applications/:id/status` - Actualizar estado (recruiter)

#### Companies
- `GET /api/companies` - Listar empresas
- `GET /api/companies/:id` - Empresa específica
- `GET /api/companies/:id/jobs` - Trabajos de una empresa

## 🔌 Integración Paso a Paso

### Paso 1: Actualizar el AuthStore

El store de autenticación ya está configurado, pero necesitas ajustar las respuestas según tu API:

```typescript
// src/stores/auth.ts

// Si tu API devuelve la respuesta de forma diferente, ajusta aquí:
const login = async (credentials: LoginCredentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials)
    
    // Ajusta según la estructura de tu respuesta:
    // Opción 1: { token, user }
    const { token: authToken, user: userData } = response.data
    
    // Opción 2: { data: { token, user } }
    // const { token: authToken, user: userData } = response.data.data
    
    // Opción 3: { accessToken, user }
    // const authToken = response.data.accessToken
    // const userData = response.data.user
    
    token.value = authToken
    user.value = userData
    
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    
    return true
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed'
    return false
  }
}
```

### Paso 2: Crear Store para Jobs

```typescript
// src/stores/jobs.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { jobsService, type Job } from '@/services/jobsService'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([])
  const currentJob = ref<Job | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchJobs = async (filters?: any) => {
    isLoading.value = true
    error.value = null
    try {
      jobs.value = await jobsService.getAll(filters)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch jobs'
    } finally {
      isLoading.value = false
    }
  }

  const fetchJobById = async (id: string) => {
    isLoading.value = true
    error.value = null
    try {
      currentJob.value = await jobsService.getById(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch job'
    } finally {
      isLoading.value = false
    }
  }

  const applyToJob = async (jobId: string, coverLetter?: string) => {
    isLoading.value = true
    error.value = null
    try {
      await jobsService.apply(jobId, coverLetter)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to apply'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    jobs,
    currentJob,
    isLoading,
    error,
    fetchJobs,
    fetchJobById,
    applyToJob
  }
})
```

### Paso 3: Usar el Store en JobsView

```typescript
// src/views/JobsView.vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useJobsStore } from '@/stores/jobs'
import { storeToRefs } from 'pinia'

const jobsStore = useJobsStore()
const { jobs, isLoading, error } = storeToRefs(jobsStore)

onMounted(() => {
  jobsStore.fetchJobs()
})

const handleSearch = () => {
  jobsStore.fetchJobs({ search: searchQuery.value })
}

const handleFilterChange = () => {
  jobsStore.fetchJobs(filters.value)
}
</script>
```

### Paso 4: Manejar Errores de Autenticación

El interceptor de Axios ya está configurado para manejar errores 401:

```typescript
// src/config/api.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirige al login si el token expiró
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## 🔐 Formato de Token

Si tu backend usa un formato de token diferente, ajusta el interceptor:

```typescript
// JWT Bearer Token (por defecto)
config.headers.Authorization = `Bearer ${token}`

// O si usa otro formato:
// config.headers.Authorization = token
// config.headers['X-Auth-Token'] = token
```

## 📝 Ejemplo Completo: Aplicar a un Trabajo

```typescript
// En JobDetailView.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

const coverLetter = ref('')
const isApplying = ref(false)

const handleApply = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  isApplying.value = true
  const success = await jobsStore.applyToJob(
    route.params.id as string,
    coverLetter.value
  )
  
  if (success) {
    alert('Application submitted successfully!')
    router.push('/applications')
  } else {
    alert('Failed to submit application')
  }
  isApplying.value = false
}
</script>

<template>
  <div>
    <h1>{{ jobsStore.currentJob?.title }}</h1>
    <textarea v-model="coverLetter" placeholder="Cover letter..."></textarea>
    <button @click="handleApply" :disabled="isApplying">
      {{ isApplying ? 'Applying...' : 'Apply Now' }}
    </button>
  </div>
</template>
```

## 🧪 Testing de la Integración

### 1. Probar Login

```bash
# En la consola del navegador (F12)
# Después de hacer login, verifica:
localStorage.getItem('auth_token')
localStorage.getItem('user')
```

### 2. Probar Llamadas a la API

```bash
# En la consola del navegador
# Importa el servicio y prueba:
import { jobsService } from '@/services/jobsService'
const jobs = await jobsService.getAll()
console.log(jobs)
```

### 3. Verificar Headers

Abre DevTools → Network → Selecciona una request → Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

## ⚠️ Problemas Comunes

### CORS Error
Si ves errores de CORS, configura tu backend:

```csharp
// En tu backend .NET
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

### Token No Se Envía
Verifica que el token esté en localStorage:
```javascript
console.log(localStorage.getItem('auth_token'))
```

### Respuesta 401
- Verifica que el token sea válido
- Verifica que el formato del header sea correcto
- Verifica que el token no haya expirado

## 📚 Recursos Adicionales

- [Axios Documentation](https://axios-http.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)

## ✅ Checklist de Integración

- [ ] Variables de entorno configuradas
- [ ] Backend corriendo y accesible
- [ ] CORS configurado en el backend
- [ ] Login funcional
- [ ] Token se guarda correctamente
- [ ] Token se envía en las requests
- [ ] Rutas protegidas funcionan
- [ ] Logout limpia el localStorage
- [ ] Manejo de errores implementado
- [ ] Loading states visibles

---

¡Una vez completados estos pasos, tu frontend estará completamente integrado con el backend!
