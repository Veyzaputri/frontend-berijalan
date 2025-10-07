"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import ManajemenCounterPage from "@/components/organisms/counterManagementPage";

export default async function ManajemenCounterPages() {
  return <DashboardLayout>
<ManajemenCounterPage />
  </DashboardLayout>;
}
