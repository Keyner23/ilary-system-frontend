export interface CreateCoderDto {
    name: string;
    document: string;
    phoneNumber: string;
    email: string;
    description: string;
}

export interface Coder extends CreateCoderDto {
    id: string;
    // Add other fields if returned by backend
}
