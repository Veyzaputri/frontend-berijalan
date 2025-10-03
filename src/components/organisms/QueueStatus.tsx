"use client"
import { useGetCurrentQueues, useSkipQueue, useResetQueues } from "@/services/auth/wrapper.service"
import { EQueueStatus, ICurrentQueuesResponse } from "@/interfaces/service/queue.interface"
import CurrentQueueDisplay from "@/components/molecules/CurrentQueueDisplay"

export default function QueueStatusPage() {
  const { data, isLoading, isError } = useGetCurrentQueues()
  const skipQueue = useSkipQueue()
  const resetQueues = useResetQueues()

  // pastikan data.data adalah array
  const queues: ICurrentQueuesResponse[] =
  (data?.data as unknown as ICurrentQueuesResponse[]) || []

  if (isLoading) return <p className="p-6">Loading queues...</p>
  if (isError) return <p className="p-6 text-red-500">Failed to load queues</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Queue Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {queues.map((q: ICurrentQueuesResponse) => (
          <div key={q.id} className="flex flex-col items-center space-y-3">
            <CurrentQueueDisplay
              queueNumber={q.currentQueue}
              counterName={q.name}
              status={q.status as EQueueStatus}
              className="w-full"
            />

            <div className="flex space-x-2">
              <button
                onClick={() => skipQueue.mutate({ counter_id: q.id })}
                disabled={skipQueue.isPending}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                {skipQueue.isPending ? "Skipping..." : "Skip"}
              </button>

              <button
                onClick={() => resetQueues.mutate({ counter_id: q.id })}
                disabled={resetQueues.isPending}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                {resetQueues.isPending ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>
        ))}

        {queues.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            Tidak ada queue aktif saat ini
          </div>
        )}
      </div>
    </div>
  )
}
