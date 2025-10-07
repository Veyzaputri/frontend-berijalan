import CurrentQueueDisplay from '../../components/molecules/CurrentQueueDisplay';
import { ActiveQueue } from './queue.interface';
export interface ICounter {
    id: number
    name: string
    CurrentQueue: number
    maxQueue: number
    isActive?: boolean
    createdAt: string
    updateAt: string
    deletedAt: string | null
}

export interface ICreateCounterRequest {
    name: string
    max_queue: number
    is_active: boolean
}

export interface IUpdateCounterRequest {
    name?: string
    max_queue?: number
    is_active?: boolean
    currentQueue?: number   // <--- tambahkan ini
}

export interface ICounterResponse {
    id: number
    name: string
    CurrentQueue: number
    maxQueue: number
    isActive: boolean
    createdAt: string
    updateAt: string
    deletedAt: string | null
}

