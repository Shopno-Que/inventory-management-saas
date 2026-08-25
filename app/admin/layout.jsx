import DashboardHeader from "@/components/dashboard/dashbaord-header";
import DashboardSidebar from "@/components/dashboard/dashbaord-sidebar";
import { adminNavigation } from "./navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/user/login");
    return (
        <>
            <DashboardSidebar
                baseUrl="/admin"
                brand={{
                    name: "Admin",
                    handle: "@admin-dashboard",
                    mark: "A",
                }}
                navigation={adminNavigation}
            />

            <div className="min-h-screen lg:pl-72">
                <DashboardHeader
                    title="Admin"
                    subtitle="@admin-dashboard"
                    user={user}
                />

                <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </>
    );
}