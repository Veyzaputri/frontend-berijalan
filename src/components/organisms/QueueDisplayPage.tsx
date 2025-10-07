"use client";

import { useEffect, useState } from "react";
import { 
  apiGetCurrentQueues, 
  apiNextQueue, 
  apiReleaseQueue, 
  apiSkipQueue, 
  apiResetQueue 
} from "@/services/queue/api.service";
import { ActiveCounter, ActiveQueue } from "@/interfaces/service/queue.interface";

export default function QueueDisplayPage() {
  const [data, setData] = useState<ActiveCounter[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiGetCurrentQueues();
      if (res.status) setData(res.data ?? []);
      else setData([]);
    } catch (err) {
      console.error("Error fetching queue data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNext = async (queue: ActiveQueue, counterId: number) => {
    setActionLoading(queue.id);
    try {
      await apiNextQueue({ counter_id: counterId });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleRelease = async (queue: ActiveQueue, counterId: number) => {
    setActionLoading(queue.id);
    try {
      await apiReleaseQueue({ queueNumber: queue.number, counterId });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkip = async (queue: ActiveQueue, counterId: number) => {
    setActionLoading(queue.id);
    try {
      await apiSkipQueue({ counter_id: counterId });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReset = async (counterId: number) => {
    setActionLoading(counterId);
    try {
      await apiResetQueue({ counter_id: counterId });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleServe = async (queue: ActiveQueue, counterId: number) => {
    setActionLoading(queue.id);
    try {
      await fetch("/api/v1/queues/serve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: queue.id })
      });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Display Antrian</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((counter) => (
          <div
            key={counter.counterId}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">{counter.counterName}</h2>
            <p className="text-gray-500 mb-4 text-sm">
              Max Queue: <span className="font-medium">{counter.maxQueue ?? "-"}</span> | Status:{" "}
              {counter.isActive ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-red-600 font-semibold">Inactive</span>
              )}
            </p>

            {counter.queues.length > 0 ? (
              <div>
                <h3 className="font-semibold mb-2 text-gray-700 text-lg">Daftar Antrian:</h3>
                <ul className="space-y-3">
                  {counter.queues.map((q) => (
                    <li
                      key={q.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 p-3 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="mb-2 sm:mb-0">
                        <span className="font-semibold mr-3 text-gray-800">Nomor: {q.number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          q.status === "CLAIMED" ? "bg-yellow-100 text-yellow-800" :
                          q.status === "CALLED" ? "bg-blue-100 text-blue-800" :
                          q.status === "SERVED" ? "bg-green-100 text-green-800" :
                          q.status === "RELEASED" ? "bg-gray-100 text-gray-800" :
                          q.status === "SKIPPED" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {q.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {q.status !== "CALLED" && (
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                            disabled={actionLoading === q.id}
                            onClick={() => handleNext(q, counter.counterId)}
                          >
                            Next
                          </button>
                        )}
                        {q.status !== "RELEASED" && (
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                            disabled={actionLoading === q.id}
                            onClick={() => handleRelease(q, counter.counterId)}
                          >
                            Release
                          </button>
                        )}
                        {q.status !== "SKIPPED" && (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                            disabled={actionLoading === q.id}
                            onClick={() => handleSkip(q, counter.counterId)}
                          >
                            Skip
                          </button>
                        )}
                        {q.status !== "SERVED" && (
                          <button
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
                            disabled={actionLoading === q.id}
                            onClick={() => handleServe(q, counter.counterId)}
                          >
                            Selesai
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400 italic">Belum ada antrian</p>
            )}

            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                disabled={actionLoading === counter.counterId}
                onClick={() => handleReset(counter.counterId)}
              >
                Reset Counter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
