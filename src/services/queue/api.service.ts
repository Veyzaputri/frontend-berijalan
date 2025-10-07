'use server'

import { satellite } from '@/config/api.config'
import { APIBaseResponse } from '@/interfaces/api.interface'
import {
    IClaimQueueResponse,
    ICurrentQueuesResponse,
    IGetQueueMetricsResponse,
    INextQueueRequest,
    INextQueueResponse,
    IQueue,
    IReleaseQueueRequest,
    IResetQueueRequest,
    IResetQueueResponse,
    ISkipQueueRequest,
    ISkipQueueResponse,
    ActiveCounter,
    
} from '@/interfaces/service/queue.interface'
import { errorMessage } from '@/utils/error.util'


const API_BASE_PATH = '/api/v1/queues'

export const apiGetMetrics = async () => {
    try {
        const res = await satellite.get<APIBaseResponse<IGetQueueMetricsResponse>>(`${API_BASE_PATH}/metrics`)
        return res.data
    } catch (error) {
        return errorMessage<IGetQueueMetricsResponse>(error)
    }
}

export const apiClaimQueue = async () => {
    try {
        const res = await satellite.post<APIBaseResponse<IClaimQueueResponse>>(`${API_BASE_PATH}/claim`)
        return res.data
    } catch (error) {
        return errorMessage<IClaimQueueResponse>(error)
    }
}

export const apiReleaseQueue = async (data: IReleaseQueueRequest) => {
    try {
        const res = await satellite.post<APIBaseResponse<{success: boolean}>>(`${API_BASE_PATH}/release`, data)
        return res.data
    } catch (error) {
        return errorMessage<{success: boolean}>(error)
    }
}


export const apiGetCurrentQueues = async (): Promise<APIBaseResponse<ActiveCounter[]>> => {
  try {
    const res = await satellite.get(`/api/v1/queues/current`);
    return res.data; // ✅ return full API response object
  } catch (error) {
    console.error("Error fetching current queues:", error);
    return {
      status: false,
      message: "Gagal mengambil data antrian",
      data: [],
    };
  }
};

export const apiGetQueues = async () => {
  try {
    const res = await satellite.get<APIBaseResponse<IQueue[]>>(`${API_BASE_PATH}`)
    const allQueues = res.data.data || [];

    // filter queues yang "current" misal status = 'active'
    const currentQueues = allQueues.filter(
      q => q.status === "CLAIMED" || q.status === "CALLED"
    );

    return {
      success: true,
      data: currentQueues
    }
  } catch (error) {
    return errorMessage<IQueue[]>(error)
  }
}

export const apiSearchQueue = async (queueNumberCounterName: string) => {
    try {
        const res = await satellite.get<APIBaseResponse<IQueue[]>>(`${API_BASE_PATH}/search?q=${queueNumberCounterName}`)
        return res.data
    } catch (error) {
        return errorMessage<IQueue[]>(error)
    }
}

export const apiNextQueue = async (data:INextQueueRequest) => {
    try {
        const res = await satellite.post<APIBaseResponse<INextQueueResponse>>(`${API_BASE_PATH}/next`, data)
        return res.data
    } catch (error) {
        return errorMessage<INextQueueResponse>(error)
    }
}

export const apiSkipQueue = async (data:ISkipQueueRequest) => {
    try {
        const res = await satellite.post<APIBaseResponse<ISkipQueueResponse>>(`${API_BASE_PATH}/skip`, data)
        return res.data
    } catch (error) {
        return errorMessage<ISkipQueueResponse>(error)
    }
}

export const apiResetQueue = async (data: IResetQueueRequest) => {
    try {
        const res = await satellite.post<APIBaseResponse<IResetQueueResponse>>(`${API_BASE_PATH}/reset`, data)
        return res.data
    } catch (error) {
        return errorMessage<IResetQueueResponse>(error)
    }
}

export interface IServeQueueRequest {
  id: number; // id queue
}

export const apiServeQueue = async (data: IServeQueueRequest) => {
  try {
    const res = await satellite.post<APIBaseResponse<IQueue>>(`${API_BASE_PATH}/serve`, data);
    return res.data;
  } catch (error) {
    return errorMessage<IQueue>(error);
  }
};
