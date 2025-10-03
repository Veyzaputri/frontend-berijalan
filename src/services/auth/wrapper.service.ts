'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  apiCreateAdmin,
  apiDeleteAdmin,
  apiGetAdminById,
  apiGetAllAdmins,
  apiPostLogin,
  apiToggleAdminStatus,
  apiUpdateAdmin,
} from './api.service'
import {
  ICreateAdminRequest,
  ILoginRequest,
  IToggleAdminStatusRequest,
  IUpdateAdminRequest,

} from '@/interfaces/service/auth.interface'
import toast from 'react-hot-toast'
import {
  INextQueueRequest,
  IReleaseQueueRequest,
  IResetQueueRequest,
  ISkipQueueRequest,
  IReleaseQueueResponse,
  INextQueueResponse,
  ISkipQueueResponse,
  IResetQueueResponse
} from '@/interfaces/service/queue.interface'
import {
  apiClaimQueue,
  apiGetCurrentQueues,
  apiGetMetrics,
  apiNextQueue,
  apiReleaseQueue,
  apiResetQueue,
  apiSearchQueue,
  apiSkipQueue,
} from '../queue/api.service'
import { APIBaseResponse } from '@/interfaces/api.interface'


const AUTH_KEYS = {
  all: ['admins'] as const,
  byId: (id: number) => ['admins', id] as const,
}
export const useLoginUser = () => {
  return useMutation({
    mutationKey: ['post login user'],
    mutationFn: (payload: ILoginRequest) => apiPostLogin(payload),
    onSuccess: (response: any) => {
      if (response && response.error) {
        toast.error(response.error.message || 'Login failed')
        return
      }

      if (response && response.status === true) {
        toast.success('Login successful')
      } else {
        toast.error(response?.message || 'Login failed')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Login failed')
    },
  })
}

export const useGetAllAdmins = () => {
  return useQuery({
    queryKey: AUTH_KEYS.all,
    queryFn: () => apiGetAllAdmins(),
    refetchOnWindowFocus: false,
  })
}

export const useGetAdminById = (id: number) => {
  return useQuery({
    queryKey: AUTH_KEYS.byId(id),
    queryFn: () => apiGetAdminById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  })
}

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: (data: ICreateAdminRequest) => apiCreateAdmin(data),
    onSuccess: (response: any) => {
      if (response && response.error) {
        toast.error(response.error.message || 'Failed to create admin')
        return
      }

      if (response && response.status === true) {
        toast.success('Admin created successfully')
      } else {
        toast.error(response?.message || 'Failed to create admin')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create admin')
    },
  })
}

export const useUpdateAdmin = () => {
  return useMutation({
    mutationFn: (data: IUpdateAdminRequest) => apiUpdateAdmin(data),
    onSuccess: (response: any) => {
      if (response && response.error) {
        toast.error(response.error.message || 'Failed to update admin')
        return
      }

      if (response && response.status === true) {
        toast.success('Admin updated successfully')
      } else {
        toast.error(response?.message || 'Failed to update admin')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update admin')
    },
  })
}

export const useDeleteAdmin = () => {
  return useMutation({
    mutationFn: (id: number) => apiDeleteAdmin(id),
    onSuccess: (response: any) => {
      if (response && response.error) {
        toast.error(response.error.message || 'Failed to delete admin')
        return
      }

      if (response && response.status === true) {
        toast.success('Admin deleted successfully')
      } else {
        toast.error(response?.message || 'Failed to delete admin')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete admin')
    },
  })
}

export const useToggleAdminStatus = () => {
  return useMutation({
    mutationFn: (data: IToggleAdminStatusRequest) => apiToggleAdminStatus(data),
    onSuccess: (response: any) => {
      if (response && response.error) {
        toast.error(response.error.message || 'Failed to toggle admin status')
        return
      }

      if (response && response.status === true) {
        const newStatus = response.data?.newStatus ? 'activated' : 'deactivated'
        toast.success(`Admin ${newStatus} successfully`)
      } else {
        toast.error(response?.message || 'Failed to toggle admin status')
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to toggle admin status')
    },
  })
}

const QUEUE_KEYS = {
  all: ['queues'] as const,
  current: ['queues', 'current'] as const,
  metrics: ['queues', 'metrics'] as const,
  search: (query: string) => ['queues', 'search', query] as const,
}

export const useGetMetrics = () => {
  return useQuery({
    queryKey: QUEUE_KEYS.metrics,
    queryFn: () => apiGetMetrics(),
  })
}

export const useGetCurrentQueues = () => {
  return useQuery({
    queryKey: QUEUE_KEYS.current,
    queryFn: () => apiGetCurrentQueues(),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  })
}

export const useSearchQueue = (query: string) => {
  return useQuery({
    queryKey: QUEUE_KEYS.search(query),
    queryFn: () => apiSearchQueue(query),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  })
}

export const useClaimQueue = () => {
  return useMutation<any, Error>({
    mutationFn: () => apiClaimQueue(),
    onSuccess: response => {
      const toastId = toast.loading('Memproses permintaan...', { duration: 5000 })
      if (response && response.error) {
        toast.error(response.error.message || 'Failed to claim queue', { id: toastId })
        return
      }

      if (response && response.status === true) {
        toast.success('Nomor antrian berhasil diambil', { id: toastId })
      } else {
        toast.error(response?.message || 'Failed to claim queue', { id: toastId })
      }
    },
    onError: error => {
      toast.error(error?.message || 'Failed to claim queue')
    },
  })
}

export const useReleaseQueue = () => {
  return useMutation<
    APIBaseResponse<{ success: boolean }, { message: string }>,
    Error,
    IReleaseQueueRequest
  >({
    mutationFn: async (data) =>
      apiReleaseQueue(data) as Promise<
        APIBaseResponse<{ success: boolean }, { message: string }>
      >,
    onSuccess: (response) => {
      const toastId = toast.loading("Memproses permintaan...", { duration: 5000 })

      if (response?.error) {
        toast.error(response.error.message || "Failed to release queue", { id: toastId })
        return
      }

      if (response.status) {
        toast.success("Nomor antrian berhasil dilepaskan", { id: toastId })
      } else {
        toast.error(response.message || "Failed to release queue", { id: toastId })
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to release queue")
    },
  })
}


export const useNextQueue = () => {
  return useMutation<
    APIBaseResponse<INextQueueResponse, { message: string }>,
    Error,
    INextQueueRequest
  >({
    mutationFn: async (data) =>
      apiNextQueue(data) as Promise<
        APIBaseResponse<INextQueueResponse, { message: string }>
      >,
    onSuccess: (response) => {
      const toastId = toast.loading("Memproses permintaan...", { duration: 5000 })

      if (response?.error) {
        toast.error(response.error.message || "Failed to process next queue", { id: toastId })
        return
      }

      if (response.status) {
        toast.success("Berhasil memproses antrian berikutnya", { id: toastId })
      } else {
        toast.error(response.message || "Failed to process next queue", { id: toastId })
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to process next queue")
    },
  })
}


// useSkipQueue
export const useSkipQueue = () => {
  return useMutation<
    APIBaseResponse<ISkipQueueResponse, unknown>, // <- pakai tipe response sebenarnya
    Error,
    ISkipQueueRequest
  >({
    mutationFn: (data) => apiSkipQueue(data),
    onSuccess: (response) => {
      const toastId = toast.loading('Memproses permintaan...', { duration: 5000 })

      // safe extract message from error (error typed unknown)
      const apiErrorMessage = (response?.error as { message?: string } | undefined)?.message

      if (response?.error) {
        toast.error(apiErrorMessage || response?.message || 'Failed to skip queue', { id: toastId })
        return
      }

      if (response?.status) {
        toast.success('Berhasil melewati antrian', { id: toastId })
      } else {
        toast.error(response?.message || 'Failed to skip queue', { id: toastId })
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to skip queue')
    },
  })
}

// useResetQueues
export const useResetQueues = () => {
  return useMutation<
    APIBaseResponse<IResetQueueResponse, unknown>, // <- pakai tipe response sebenarnya
    Error,
    IResetQueueRequest
  >({
    mutationFn: (data) => apiResetQueue(data),
    onSuccess: (response) => {
      const toastId = toast.loading('Memproses permintaan...', { duration: 5000 })

      const apiErrorMessage = (response?.error as { message?: string } | undefined)?.message

      if (response?.error) {
        toast.error(apiErrorMessage || response?.message || 'Failed to reset queues', { id: toastId })
        return
      }

      if (response?.status) {
        toast.success('Berhasil mereset antrian', { id: toastId })
      } else {
        toast.error(response?.message || 'Failed to reset queues', { id: toastId })
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset queues')
    },
  })
}

