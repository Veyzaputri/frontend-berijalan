"use server";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import LoginPage from "@/components/organisms/loginPage";

export default async function LoginPages() {
  return (
    <DashboardLayout>
      <LoginPage />
    </DashboardLayout>
  );
}
