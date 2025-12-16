import { apiClient } from '@/config/api'
import type { Company, CreateCompanyDto } from '@/types/company'

export const companiesService = {
    /**
     * Get all companies
     */
    async getAll(): Promise<Company[]> {
        const response = await apiClient.get<Company[]>('/Company')
        return response.data
    },

    /**
     * Create a new company
     */
    async create(data: CreateCompanyDto): Promise<void> {
        await apiClient.post('/Company', data)
    },

    /**
     * Get a single company by ID
     * Note: Not currently supported by backend
     */
    async getById(id: string): Promise<Company> {
        // Placeholder or keep existing if it was working with a different backend
        const response = await apiClient.get<Company>(`/Company/${id}`)
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

