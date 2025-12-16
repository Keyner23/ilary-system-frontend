import { apiClient } from '@/config/api'
import type { Coder, CreateCoderDto } from '@/types/coder'

export const coderService = {
    /**
     * Get all coders
     */
    async getAll(): Promise<Coder[]> {
        const response = await apiClient.get<Coder[]>('/Coder')
        return response.data
    },

    /**
     * Create a new coder
     */
    async create(data: CreateCoderDto): Promise<void> {
        await apiClient.post('/Coder', data)
    }
}
