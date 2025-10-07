"use client";

import { useState, useEffect } from "react";
import {
  IAdmin,
  ICreateAdminRequest,
  IUpdateAdminRequest,
  IToggleAdminStatusRequest,
  IToggleAdminStatusResponse
} from "@/interfaces/service/auth.interface";
import {
  apiGetAllAdmins,
  apiToggleAdminStatus,
  apiCreateAdmin,
  apiUpdateAdmin,
  apiDeleteAdmin,
} from "@/services/auth/api.service";

export default function ManagementAdminPage() {
  const [admins, setAdmins] = useState<IAdmin[]>([]);
  const [newAdmin, setNewAdmin] = useState<ICreateAdminRequest>({
    username: "",
    password: "",
    email: "",
    name: "",
  });
  const [editAdmin, setEditAdmin] = useState<IUpdateAdminRequest | null>(null);

  // Load all admins
  const fetchAdmins = async () => {
    const res = await apiGetAllAdmins();
    if (res?.status && Array.isArray(res.data)) {
      setAdmins(res.data as IAdmin[]);
    } else {
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Toggle status
  const handleToggleStatus = async (id: number) => {
    try {
      const res = await apiToggleAdminStatus({ id } as IToggleAdminStatusRequest) as {
        status: boolean;
        data: IToggleAdminStatusResponse;
      };

      if (res?.status && res.data?.admin) {
        setAdmins(prev => prev.map(a => (a.id === res.data!.admin.id ? res.data!.admin : a)));
      }
    } catch (error) {
      console.error("Failed to toggle admin status", error);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (id: number) => {
    try {
      const res = await apiDeleteAdmin(id);
      if (res?.status) setAdmins(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Failed to delete admin", error);
    }
  };

  // Create admin
  const handleCreateAdmin = async () => {
    const res = await apiCreateAdmin(newAdmin);
    if (res?.status && res.data) {
      setAdmins(prev => [...prev, res.data as IAdmin]);
      setNewAdmin({ username: "", password: "", email: "", name: "" });
    }
  };

  // Update admin
  const handleUpdateAdmin = async () => {
    if (!editAdmin?.id) return;

    try {
      const res = await apiUpdateAdmin(editAdmin) as {
        status: boolean;
        data: IAdmin;
        message?: string;
        error?: any;
      };

      if (res?.status && res.data) {
        setAdmins(prev => prev.map(a => (a.id === res.data!.id ? res.data! : a)));
        setEditAdmin(null);
      } else {
        console.error(res.message || "Gagal memperbarui admin");
      }
    } catch (err) {
      console.error("Error saat update admin:", err);
    }
  };


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Management Admin</h1>

      {/* Create Admin Form */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">Tambah Admin Baru</h2>
        <input
          type="text"
          placeholder="Username"
          value={newAdmin.username}
          onChange={(e) =>
            setNewAdmin(prev => ({ ...prev, username: e.target.value }))
          }
          className="border p-1 mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={(e) =>
            setNewAdmin(prev => ({ ...prev, password: e.target.value }))
          }
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Email"
          value={newAdmin.email}
          onChange={(e) =>
            setNewAdmin(prev => ({ ...prev, email: e.target.value }))
          }
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Name"
          value={newAdmin.name}
          onChange={(e) =>
            setNewAdmin(prev => ({ ...prev, name: e.target.value }))
          }
          className="border p-1 mr-2"
        />
        <button
          onClick={handleCreateAdmin}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Tambah Admin
        </button>
      </div>

      {/* Admin List */}
      <div>
        <h2 className="font-semibold mb-2">Daftar Admin</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td className="border p-2">{admin.id}</td>
                <td className="border p-2">{admin.username}</td>
                <td className="border p-2">{admin.email}</td>
                <td className="border p-2">{admin.name}</td>
                <td className="border p-2">{admin.role}</td>
                <td className="border p-2">{admin.isActive ? "Aktif" : "Nonaktif"}</td>
                <td className="border p-2 space-x-1">
                  <button
                    onClick={() => handleToggleStatus(admin.id)}
                    className="px-2 py-1 bg-yellow-400 rounded"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => setEditAdmin(admin)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Admin Form */}
      {editAdmin && (
        <div className="mt-6 border p-4 rounded">
          <h2 className="font-semibold mb-2">Edit Admin</h2>
          <input
            type="text"
            placeholder="Username"
            value={editAdmin.username || ""}
            onChange={(e) =>
              setEditAdmin(prev => prev && { ...prev, username: e.target.value })
            }
            className="border p-1 mr-2"
          />
          <input
            type="text"
            placeholder="Email"
            value={editAdmin.email || ""}
            onChange={(e) =>
              setEditAdmin(prev => prev && { ...prev, email: e.target.value })
            }
            className="border p-1 mr-2"
          />
          <input
            type="text"
            placeholder="Name"
            value={editAdmin.name || ""}
            onChange={(e) =>
              setEditAdmin(prev => prev && { ...prev, name: e.target.value })
            }
            className="border p-1 mr-2"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setEditAdmin(prev => prev && { ...prev, password: e.target.value })
            }
            className="border p-1 mr-2"
          />
          <button
            onClick={handleUpdateAdmin}
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Simpan Perubahan
          </button>
          <button
            onClick={() => setEditAdmin(null)}
            className="ml-2 px-3 py-1 bg-gray-400 text-white rounded"
          >
            Batal
          </button>
        </div>
      )}
    </div>
  )
}
