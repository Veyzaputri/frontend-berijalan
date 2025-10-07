"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import OperatorCounterPage from "@/components/organisms/OperatorCounterPage";

export default async function OperatorCounterPages() {
  return <DashboardLayout>
<OperatorCounterPage />
  </DashboardLayout>;
}
