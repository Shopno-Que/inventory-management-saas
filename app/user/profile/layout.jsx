import DashboardHeader from "@/components/dashboard/dashbaord-header";
import DashboardSidebar from "@/components/dashboard/dashbaord-sidebar";
import { profileNavigation } from "./navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FaStore } from "react-icons/fa6";

export default async function ProfileLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/user/login");
  return (
    <>
      <DashboardSidebar
        baseUrl="/user/profile"
        brand={{
          name: "হিসাব খাতা",
          handle: "@user-profile",
          mark: <FaStore size={24} className="" />,
        }}
        navigation={profileNavigation}
      />

      <div className="min-h-screen lg:pl-72">
        <DashboardHeader
          title="হিসাব খাতা"
          subtitle="@user-profile"
          user={user}
        />

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          {children}
        </main>
      </div>
    </>
  );
}
