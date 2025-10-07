"use client"

import { useEffect, useState } from "react";
import {
  getAllCounters,
  createCounter,
  updateCounterStatus,
  deleteCounter,
} from "@/services/counter/api.service";
import { ICounterResponse, ICreateCounterRequest } from "@/interfaces/service/counter.interface";

export default function ManajemenCounterPage() {
  const [counters, setCounters] = useState<ICounterResponse[]>([]);
  const [newCounter, setNewCounter] = useState<ICreateCounterRequest>({
    name: "",
    max_queue: 50,
    is_active: true,
  });

  const fetchCounters = async () => {
    const data = await getAllCounters();
    setCounters(data);
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  const handleCreate = async () => {
    if (!newCounter.name.trim()) return alert("Nama counter wajib diisi!");
    await createCounter(newCounter);
    setNewCounter({ name: "", max_queue: 50, is_active: true });
    fetchCounters();
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    await updateCounterStatus(id, !isActive);
    fetchCounters();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus counter ini?")) {
      await deleteCounter(id);
      fetchCounters();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manajemen Counter</h1>

      {/* Form Tambah Counter */}
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Nama counter"
          value={newCounter.name}
          onChange={(e) => setNewCounter({ ...newCounter, name: e.target.value })}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Max queue"
          value={newCounter.max_queue}
          onChange={(e) => setNewCounter({ ...newCounter, max_queue: Number(e.target.value) })}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Tambah Counter
        </button>
      </div>

      {/* Tabel Counter */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Nama</th>
              <th className="border p-3 text-left">Maks Antrian</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {counters.map((c) => (
              <tr key={c.id} className="text-center border-b hover:bg-gray-50 transition">
                <td className="p-3">{c.id}</td>
                <td className="p-3 font-medium text-gray-700">{c.name}</td>
                <td className="p-3">{c.maxQueue}</td>
                <td className="p-3">
                  <span
                    className={`font-semibold ${
                      c.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {c.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleToggleStatus(c.id, c.isActive)}
                    className={`px-3 py-1 rounded-xl text-white ${
                      c.isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                    } transition`}
                  >
                    {c.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
