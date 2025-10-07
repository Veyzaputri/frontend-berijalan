"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import AdminManagementPage from "@/components/organisms/AdminManagementPage";

export default async function AdminPages() {
  return (
    <DashboardLayout>
      <AdminManagementPage />
    </DashboardLayout>
  );
}
