import DashboardLayout from "@/components/organisms/DashboardLayout";
import QueueStatus from "@/components/organisms/QueueStatus";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <DashboardLayout>
      <QueueStatus />
    </DashboardLayout>
  );
}
