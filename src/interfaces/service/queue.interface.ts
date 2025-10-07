import { create } from 'zustand';
export type EQueueStatus =
| "CLAIMED"
| "CALLED"
| "SERVED"
| "SKIPPED"import { create } from 'zustand';
export type EQueueStatus =
| "CLAIMED"
| "CALLED"
| "SERVED"
| "SKIPPED"
| "RELEASED"
| "RESET";

export interface ICurrentQueuesResponse {
    id: number
    number: number
    isActive: boolean
    name: string
    currentQueue: number
    maxQueue?: number
    status: EQueueStatus
    counterId: number;
    counter?: {
        id: number;
        name: string;
    } | null; 
}

export interface IQueue {
    id: number
    queueNumber: number
    status: EQueueStatus
    counter?: {
        id: number
        name: string
    } | null
    createdAt: string
    updatedAt: string
}

export interface IClaimQueueResponse {
    queueNumber: number
    counterName: string
    counterId: number
    estimatedWaitTime: number
    positionQueue: number
}
export interface IGetQueueMetricsResponse {
    waiting: number
    called: number
    released: number
    skipped: number
    served: number
}

export interface IReleaseQueueRequest {
    queueNumber: number
    counterId: number
}

export interface IReleaseQueueResponse {
  success: boolean
}


export interface INextQueueRequest {
    counter_id: number
}
export interface INextQueueResponse {
    queue: IQueue
    previousQueue?: IQueue | null
}
export interface ISkipQueueRequest {
    counter_id: number
}
export interface ISkipQueueResponse {
    skippedQueue: IQueue
    nextQueue?: IQueue | null
}
export interface IResetQueueRequest {
    counter_id: number
}
export interface IResetQueueResponse {
    affectedQueues: number
}

export interface ActiveQueue {
  id: number;
  number: number;
  status: EQueueStatus;
  createdAt?: string;
}

export interface ActiveCounter {
  counterId: number;
  counterName: string;
  isActive: boolean;
  maxQueue: number | null;
  queues: ActiveQueue[];
}
| "RELEASED"
| "RESET";

export interface ICurrentQueuesResponse {
    id: number
    isActive: boolean
    name: string
    currentQueue: number
    maxQueue?: number
    status: EQueueStatus 
}

export interface IQueue {
    id: number
    queueNumber: number
    status: EQueueStatus
    counter?: {
        id: number
        name: string
    } | null
    createdAt: string
    updatedAt: string
}

export interface IClaimQueueResponse {
    queueNumber: number
    counterName: string
    counterId: number
    estimatedWaitTime: number
    positionQueue: number
}
export interface IGetQueueMetricsResponse {
    waiting: number
    called: number
    released: number
    skipped: number
}

export interface IReleaseQueueRequest {
    queueNumber: number
    counterId: number
}

export interface IReleaseQueueResponse {
  success: boolean
}


export interface INextQueueRequest {
    counter_id: number
}
export interface INextQueueResponse {
    queue: IQueue
    previousQueue?: IQueue | null
}
export interface ISkipQueueRequest {
    counter_id: number
}
export interface ISkipQueueResponse {
    skippedQueue: IQueue
    nextQueue?: IQueue | null
}
export interface IResetQueueRequest {
    counter_id: number
}
export interface IResetQueueResponse {
    affectedQueues: number
}
