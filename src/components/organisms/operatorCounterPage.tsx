"use client";

import { useEffect, useState } from "react";
import { getAllCounters, createCounter, updateCounter, updateCounterStatus, deleteCounter } from "@/services/counter/api.service";

interface Counter {
  id: number;
  name: string;
  maxQueue: number;
  isActive: boolean;
}

export default function CounterOperatorPage() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const fetchCounters = async () => {
    const data = await getAllCounters();
    setCounters(data);
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  const handleUpdate = async (counter: Counter) => {
    const name = prompt("Update nama counter:", counter.name);
    if (!name) return;
    setLoadingId(counter.id);
    try {
      await updateCounter(counter.id, { name });
      await fetchCounters();
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (counter: Counter) => {
    if (!confirm(`Hapus counter "${counter.name}"?`)) return;
    setLoadingId(counter.id);
    try {
      await deleteCounter(counter.id);
      await fetchCounters();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Operator Counter Management</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {counters.map(counter => (
          <div key={counter.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {counter.name}{" "}
                {counter.isActive ? (
                  <span className="text-green-600 font-medium">(Active)</span>
                ) : (
                  <span className="text-red-600 font-medium">(Inactive)</span>
                )}
              </h2>
              <p className="text-gray-500 mb-4">Max Queue: {counter.maxQueue}</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                disabled={loadingId === counter.id}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition"
                onClick={() => handleUpdate(counter)}
              >
                Edit
              </button>

              {/* Uncomment untuk handle status change */}
              {/* {counter.isActive ? (
                <button
                  disabled={loadingId === counter.id}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  onClick={() => handleStatusChange(counter, "inactive")}
                >
                  Nonaktifkan
                </button>
              ) : (
                <button
                  disabled={loadingId === counter.id}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                  onClick={() => handleStatusChange(counter, "active")}
                >
                  Aktifkan
                </button>
              )} */}

              <button
                disabled={loadingId === counter.id}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition"
                onClick={() => handleDelete(counter)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
