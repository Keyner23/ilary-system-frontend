import { apiClient } from '@/config/api'

/**
 * Companies Service
 * Handles all company-related API calls
 */

export interface Company {
    id: string
    name: string
    description: string
    industry: string
    size: string
    location: string
    website?: string
    logo?: string
    openPositions: number
    founded?: string
}

export const companiesService = {
    /**
     * Get all companies
     */
    async getAll(): Promise<Company[]> {
        const response = await apiClient.get<Company[]>('/companies')
        return response.data
    },

    /**
     * Get a single company by ID
     */
    async getById(id: string): Promise<Company> {
        const response = await apiClient.get<Company>(`/companies/${id}`)
        return response.data
    },

    /**
     * Get jobs for a specific company
     */
    async getJobs(id: string) {
        const response = await apiClient.get(`/companies/${id}/jobs`)
        return response.data
    },

    /**
     * Search companies
     */
    async search(query: string): Promise<Company[]> {
        const response = await apiClient.get<Company[]>('/companies/search', {
            params: { q: query }
        })
        return response.data
    }
}
