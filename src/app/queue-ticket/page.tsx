"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import QueueTicketPage from "@/components/organisms/QueueTicketPage";

export default async function Page() {
  return (
    <DashboardLayout>
      <QueueTicketPage />
    </DashboardLayout>
  );
}
