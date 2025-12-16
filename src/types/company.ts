export interface CreateCompanyDto {
    name: string;
    nit: string;
    description: string;
}

export interface Company extends CreateCompanyDto {
    id: string;
    // Add other fields if returned by backend
}
