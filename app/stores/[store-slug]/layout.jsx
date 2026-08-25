import { and, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { storeMembers, stores } from "@/db/schema/store";
import Image from "next/image";
import DashboardHeader from "@/components/dashboard/dashbaord-header";
import DashboardSidebar from "@/components/dashboard/dashbaord-sidebar";
import { storeNavigation } from "./navigation";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FaStore } from "react-icons/fa6";

export default async function ProfileLayout({ children, params }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/user/login");
  const { "store-slug": slug } = await params;
  const [store] = await db
    .select({
      id: stores.id,
      name: stores.name,
      slug: stores.slug,
      logoUrl: stores.logoUrl,
      currencyCode: stores.currencyCode,
      timezone: stores.timezone,
      countryCode: stores.countryCode,
      ownerId: stores.ownerId,
      memberStatus: storeMembers.status,
    })
    .from(stores)
    .leftJoin(
      storeMembers,
      and(
        eq(storeMembers.storeId, stores.id),
        eq(storeMembers.userId, user.id),
      ),
    )
    .where(
      and(
        eq(stores.slug, slug),
        or(eq(stores.ownerId, user.id), eq(storeMembers.userId, user.id)),
      ),
    )
    .limit(1);

  if (!store) {
    redirect("/user/profile/stores");
  }

  return (
    <>
      <DashboardSidebar
        baseUrl={`/stores/${store.slug}`}
        brand={{
          name: store.name ? store.name : store.slug,
          handle: `@${store.slug}`,
          mark: store.logoUrl ? <Image src={store.logoUrl} alt={`${store.name} logo`} width={40} height={40} className="h-10 w-10 rounded-full object-cover"/> : <FaStore size={24} className="" />
        }}
        navigation={storeNavigation}
      />

      <div className="min-h-screen lg:pl-72">
        <DashboardHeader
          title={store.name ? store.name : store.slug}
          subtitle={"@" +store.slug}
          user={user}
        />

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
          {children}
        </main>
      </div>
    </>
  );
}
