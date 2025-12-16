import { apiClient } from '@/config/api'
import type { Job, CreateJobDto, JobFilters } from '@/types/job'
import type { JobApplication } from '@/types/jobApplication'

export const jobsService = {
    /**
     * Get all jobs with optional filters
     */
    async getAll(filters?: JobFilters): Promise<Job[]> {
        const response = await apiClient.get<Job[]>('/Job', { params: filters })
        return response.data
    },

    /**
     * Get a single job by ID
     */
    async getById(id: string): Promise<Job> {
        const response = await apiClient.get<Job>(`/Job/${id}`)
        return response.data
    },

    /**
     * Create a new job (recruiter only)
     */
    async create(data: CreateJobDto): Promise<Job> {
        const response = await apiClient.post<Job>('/Job', data)
        return response.data
    },

    /**
     * Update a job (recruiter only)
     */
    async update(id: string, data: Partial<CreateJobDto>): Promise<Job> {
        const response = await apiClient.put<Job>(`/Job/${id}`, data)
        return response.data
    },

    /**
     * Delete a job (recruiter only)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/Job/${id}`)
    },

    /**
     * Apply to a job (candidate only)
     */
    /**
     * Apply to a job (candidate only)
     */
    async apply(jobId: string, coderId: string): Promise<void> {
        await apiClient.post('/JobApplication', { jobId, coderId })
    },

    /**
     * Get jobs by company
     */
    async getByCompany(companyId: string): Promise<Job[]> {
        const response = await apiClient.get<Job[]>(`/Job/company/${companyId}`)
        return response.data
    },

    /**
     * Get applicants for a job
     */
    async getApplicants(jobId: string): Promise<JobApplication[]> {
        const response = await apiClient.get<JobApplication[]>(`/JobApplication/job/${jobId}`)
        return response.data
    },

    /**
     * Get applications for a coder
     */
    async getMyApplications(coderId: string): Promise<JobApplication[]> {
        const response = await apiClient.get<JobApplication[]>(`/JobApplication/coder/${coderId}`)
        return response.data
    },

    /**
     * Get featured jobs (placeholder)
     */
    async getFeatured(): Promise<Job[]> {
        // For now, just return all jobs
        return this.getAll()
    },

    /**
     * Search jobs (placeholder)
     */
    async search(query: string): Promise<Job[]> {
        // For now, just return all jobs
        return this.getAll()
    }
}
