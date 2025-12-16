export interface CreateJobDto {
    title: string
    description: string
    company: string
    location: string
    type: string
    salary: string
    skills: string[]
    requirements: string[]
    benefits: string[]
}

export interface Job extends CreateJobDto {
    id: string
    postedAt: string
    expiresAt: string
    isActive: boolean
}

export interface JobFilters {
    search?: string
    type?: string
    location?: string
    experience?: string
    skills?: string[]
    salaryMin?: number
    salaryMax?: number
}
