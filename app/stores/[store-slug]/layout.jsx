import { and, eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import StoreDashboardShell from "@/components/store/StoreDashboardShell";
import { db } from "@/db";
import { storeMembers, stores } from "@/db/schema/stores";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children, params }) {
  const { "store-slug": slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/user/login");
  }

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
    <StoreDashboardShell
      store={store}
      user={{ email: user.email || "Account" }}
    >
      {children}
    </StoreDashboardShell>
  );
}
