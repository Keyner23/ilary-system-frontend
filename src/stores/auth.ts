import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiClient } from '@/config/api'

export interface User {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    role?: string
    document?: string
    phoneNumber?: string
    description?: string
    nit?: string
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const isAdmin = computed(() => user.value?.role === 'admin')
    const isRecruiter = computed(() => user.value?.role === 'company' || user.value?.role === 'recruiter')
    const isCandidate = computed(() => user.value?.role === 'coder' || user.value?.role === 'candidate')

    // Initialize from localStorage
    const initAuth = () => {
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser) {
            token.value = savedToken
            user.value = JSON.parse(savedUser)
        }
    }

    // Login
    const login = async (credentials: LoginCredentials) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await apiClient.post('/Auth/login', credentials)
            const { token: authToken, user: userData } = response.data

            token.value = authToken
            user.value = userData

            localStorage.setItem('auth_token', authToken)
            localStorage.setItem('user', JSON.stringify(userData))

            return true
        } catch (err: any) {
            console.error('Login error:', err);
            if (err.response) {
                // Server responded with a status code outside 2xx
                error.value = `Error ${err.response.status}: ${err.response.data?.message || err.message}`;
            } else if (err.request) {
                // Request was made but no response received
                error.value = `No response from server. (${err.message})`;
            } else {
                // Something happened in setting up the request
                error.value = `Request error: ${err.message}`;
            }
            return false
        } finally {
            isLoading.value = false
        }
    }

    // Register
    const register = async (data: RegisterData) => {
        isLoading.value = true
        error.value = null

        try {
            let endpoint = ''
            if (data.role === 'recruiter') {
                endpoint = '/Auth/register/company'
            } else {
                // Default to candidate/coder
                endpoint = '/Auth/register/coder'
            }

            const response = await apiClient.post(endpoint, data)
            // Note: The backend register endpoints currently return a message, not the token/user.
            // We might need to auto-login or redirect to login.
            // For now, let's assume we redirect to login.
            return true
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Registration failed. Please try again.'
            return false
        } finally {
            isLoading.value = false
        }
    }



    // Logout
    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
    }

    // Update user profile
    const updateProfile = async (updates: Partial<User>) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await apiClient.put('/auth/profile', updates)
            user.value = response.data

            localStorage.setItem('user', JSON.stringify(response.data))
            return true
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Profile update failed.'
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        isAdmin,
        isRecruiter,
        isCandidate,
        initAuth,
        login,
        register,
        logout,
        updateProfile
    }
})
