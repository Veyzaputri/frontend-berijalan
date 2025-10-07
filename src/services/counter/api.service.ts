'use server'

import { satellite } from "@/config/api.config"
import { ICounterResponse, ICreateCounterRequest, IUpdateCounterRequest } from "../../interfaces/service/counter.interface"

const API_BASE_PATH = '/api/counters'

export const getAllCounters = async (): Promise<ICounterResponse[]> => {
  const res = await satellite.get<ICounterResponse[]>(API_BASE_PATH)
  return res.data
}

export const getCounterById = async (id: number): Promise<ICounterResponse> => {
  const res = await satellite.get<ICounterResponse>(`${API_BASE_PATH}/${id}`)
  return res.data
}

export const createCounter = async (payload: ICreateCounterRequest): Promise<ICounterResponse> => {
  const res = await satellite.post<ICounterResponse>(API_BASE_PATH, payload)
  return res.data
}

export const updateCounter = async (id: number, payload: IUpdateCounterRequest): Promise<ICounterResponse> => {
  const res = await satellite.put<ICounterResponse>(`${API_BASE_PATH}/${id}`, payload)
  return res.data
}

export const updateCounterStatus = async (id: number, isActive: boolean) => {
  const status = isActive ? "active" : "inactive"
  const res = await satellite.patch(`${API_BASE_PATH}/${id}/status`, { status })
  return res.data
}

export const deleteCounter = async (id: number): Promise<void> => {
  await satellite.delete(`${API_BASE_PATH}/${id}`)
}
