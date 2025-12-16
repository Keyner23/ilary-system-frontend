import { apiClient } from '@/config/api'
import type { JobApplication, CreateJobApplicationDto } from '@/types/jobApplication'

export const applicationsService = {
    /**
     * Create a new job application
     */
    async create(data: CreateJobApplicationDto): Promise<void> {
        await apiClient.post('/JobApplication', data)
    },

    // Keeping other methods as placeholders/legacy for now

    async getMyApplications(): Promise<JobApplication[]> {
        const response = await apiClient.get<JobApplication[]>('/applications')
        return response.data
    },

    async getById(id: string): Promise<JobApplication> {
        const response = await apiClient.get<JobApplication>(`/applications/${id}`)
        return response.data
    },

    async withdraw(id: string): Promise<void> {
        await apiClient.delete(`/applications/${id}`)
    },

    async getStats(): Promise<any> {
        const response = await apiClient.get('/applications/stats')
        return response.data
    },

    async updateStatus(id: string, status: string): Promise<JobApplication> {
        const response = await apiClient.patch<JobApplication>(`/applications/${id}/status`, {
            status
        })
        return response.data
    }
}

