'use server'

import { apiGetCurrentQueues, apiGetMetrics } from '@/services/queue/api.service'
import { ActiveCounter } from '@/interfaces/service/queue.interface'

export default async function QueueStatusPage() {
  const queueDataResponse = await apiGetCurrentQueues()
  const metricsResponse = await apiGetMetrics()

  const counters: ActiveCounter[] = queueDataResponse.data || []
  const metrics = metricsResponse.data || { waiting: 0, called: 0, released: 0, skipped: 0 }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Queue Status</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-5 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="font-semibold text-gray-700 mb-2">Waiting</h2>
          <p className="text-2xl font-bold text-blue-800">{metrics.waiting}</p>
        </div>
        <div className="bg-green-100 p-5 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="font-semibold text-gray-700 mb-2">Called</h2>
          <p className="text-2xl font-bold text-green-800">{metrics.called}</p>
        </div>
        <div className="bg-yellow-100 p-5 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="font-semibold text-gray-700 mb-2">Released</h2>
          <p className="text-2xl font-bold text-yellow-800">{metrics.released}</p>
        </div>
        <div className="bg-red-100 p-5 rounded-2xl shadow-md flex flex-col items-center">
          <h2 className="font-semibold text-gray-700 mb-2">Skipped</h2>
          <p className="text-2xl font-bold text-red-800">{metrics.skipped}</p>
        </div>
      </div>

      {/* Counters & Active Queues */}
      <div className="space-y-6">
        {counters.map(counter => (
          <div key={counter.counterId} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {counter.counterName}{" "}
              {counter.isActive ? (
                <span className="text-green-600 font-medium">(Active)</span>
              ) : (
                <span className="text-red-600 font-medium">(Inactive)</span>
              )}
            </h2>
            <p className="text-gray-500 mb-4">Max Queue: {counter.maxQueue ?? '-'}</p>

            {counter.queues.length === 0 ? (
              <p className="text-gray-400 italic">Tidak ada antrian aktif</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse text-center">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="border px-3 py-2 rounded-tl-lg">Queue Number</th>
                      <th className="border px-3 py-2">Status</th>
                      <th className="border px-3 py-2 rounded-tr-lg">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counter.queues.map(queue => (
                      <tr
                        key={queue.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="border px-3 py-2">{queue.number}</td>
                        <td className="border px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            queue.status === "CLAIMED" ? "bg-yellow-100 text-yellow-800" :
                            queue.status === "CALLED" ? "bg-blue-100 text-blue-800" :
                            queue.status === "SERVED" ? "bg-green-100 text-green-800" :
                            queue.status === "RELEASED" ? "bg-gray-100 text-gray-800" :
                            queue.status === "SKIPPED" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {queue.status}
                          </span>
                        </td>
                        <td className="border px-3 py-2">
                          {queue.createdAt ? new Date(queue.createdAt).toLocaleTimeString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
