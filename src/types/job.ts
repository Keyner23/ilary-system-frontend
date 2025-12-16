export interface CreateJobDto {
    title: string
    description: string
    salary: number
    location: string
    companyId: string
}

export interface Job {
    id: string
    title: string
    description: string
    salary: number
    location: string
    created: string
    updated: string
    companyId: string
    company?: {
        id: string
        name: string
        email: string
        description: string
    }
}

export interface JobFilters {
    search?: string
    location?: string
    salaryMin?: number
    salaryMax?: number
}
