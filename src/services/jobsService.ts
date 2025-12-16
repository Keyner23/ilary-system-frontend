import { apiClient } from '@/config/api'
import type { Job, CreateJobDto, JobFilters } from '@/types/job'

export const jobsService = {
    /**
     * Get all jobs with optional filters
     */
    async getAll(filters?: JobFilters): Promise<Job[]> {
        const response = await apiClient.get<Job[]>('/jobs', { params: filters })
        return response.data
    },

    /**
     * Get a single job by ID
     */
    async getById(id: string): Promise<Job> {
        const response = await apiClient.get<Job>(`/jobs/${id}`)
        return response.data
    },

    /**
     * Create a new job (recruiter only)
     */
    async create(data: CreateJobDto): Promise<Job> {
        const response = await apiClient.post<Job>('/jobs', data)
        return response.data
    },

    /**
     * Update a job (recruiter only)
     */
    async update(id: string, data: Partial<CreateJobDto>): Promise<Job> {
        const response = await apiClient.put<Job>(`/jobs/${id}`, data)
        return response.data
    },

    /**
     * Delete a job (recruiter only)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/jobs/${id}`)
    },

    /**
     * Apply to a job (candidate only)
     */
    async apply(jobId: string, coverLetter?: string): Promise<void> {
        await apiClient.post(`/jobs/${jobId}/apply`, { coverLetter })
    },

    /**
     * Get featured jobs
     */
    async getFeatured(): Promise<Job[]> {
        const response = await apiClient.get<Job[]>('/jobs/featured')
        return response.data
    },

    /**
     * Search jobs
     */
    async search(query: string): Promise<Job[]> {
        const response = await apiClient.get<Job[]>('/jobs/search', {
            params: { q: query }
        })
        return response.data
    }
}
