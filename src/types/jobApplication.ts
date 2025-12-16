import type { Coder } from './coder'

export interface CreateJobApplicationDto {
    coderId: string;
    jobId: string;
}

export interface ApplicationStatus {
    id: string;
    name: string;
    description: string;
    color: string;
    order: number;
    created: string;
}

export interface JobApplication {
    id: number;
    coderId: string;
    coder?: Coder;
    jobId: string;
    job?: {
        id: string;
        title: string;
        location: string;
        salary: number;
        company?: {
            id: string;
            name: string;
        };
    };
    statusId: string;
    status?: ApplicationStatus;
    created: string;
    updated: string;
}
