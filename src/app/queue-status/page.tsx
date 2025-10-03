"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import QueueStatus from "@/components/organisms/QueueStatus";

export default async function Page() {
  return (
    <DashboardLayout>
      <QueueStatus />
    </DashboardLayout>
  );
}
