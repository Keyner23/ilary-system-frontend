import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
    // State
    const isDark = ref(false)

    // Initialize theme from localStorage or system preference
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            isDark.value = savedTheme === 'dark'
        } else {
            isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        applyTheme()
    }

    // Apply theme to document
    const applyTheme = () => {
        if (isDark.value) {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
    }

    // Toggle theme
    const toggleTheme = () => {
        isDark.value = !isDark.value
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
        applyTheme()
    }

    // Computed
    const currentTheme = computed(() => (isDark.value ? 'dark' : 'light'))

    return {
        isDark,
        currentTheme,
        initTheme,
        toggleTheme
    }
})
