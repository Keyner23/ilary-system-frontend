export interface CreateJobApplicationDto {
    coderId: string;
    companyId: string;
}

export interface JobApplication {
    id: string;
    coderId: string;
    companyId: string;
    // Add other fields if returned by backend
}
