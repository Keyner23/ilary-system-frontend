import { apiClient } from '@/config/api'

/**
 * Applications Service
 * Handles all job application-related API calls
 */

export interface Application {
    id: string
    jobId: string
    jobTitle: string
    company: string
    status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected'
    coverLetter?: string
    appliedAt: string
    updatedAt: string
}

export interface ApplicationStats {
    total: number
    pending: number
    reviewing: number
    interview: number
    accepted: number
    rejected: number
}

export const applicationsService = {
    /**
     * Get all applications for the current user
     */
    async getMyApplications(): Promise<Application[]> {
        const response = await apiClient.get<Application[]>('/applications')
        return response.data
    },

    /**
     * Get a single application by ID
     */
    async getById(id: string): Promise<Application> {
        const response = await apiClient.get<Application>(`/applications/${id}`)
        return response.data
    },

    /**
     * Withdraw an application
     */
    async withdraw(id: string): Promise<void> {
        await apiClient.delete(`/applications/${id}`)
    },

    /**
     * Get application statistics
     */
    async getStats(): Promise<ApplicationStats> {
        const response = await apiClient.get<ApplicationStats>('/applications/stats')
        return response.data
    },

    /**
     * Update application status (recruiter only)
     */
    async updateStatus(
        id: string,
        status: Application['status']
    ): Promise<Application> {
        const response = await apiClient.patch<Application>(`/applications/${id}/status`, {
            status
        })
        return response.data
    }
}
