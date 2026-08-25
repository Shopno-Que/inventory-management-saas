import { count, eq } from "drizzle-orm";
import { FiActivity, FiShoppingBag, FiUsers } from "react-icons/fi";

import { db } from "@/db";
import { supabaseAuthUser } from "@/db/ref-schema";
import { stores } from "@/db/schema/store";

export const metadata = {
    title: "SaaS dashboard | Hishab Khata",
};

export default async function SaasDashboard() {
    const [
        [userStats],
        [storeStats],
        [activeStoreStats],
    ] = await Promise.all([
        db
            .select({
                count: count(),
            })
            .from(supabaseAuthUser),

        db
            .select({
                count: count(),
            })
            .from(stores),

        db
            .select({
                count: count(),
            })
            .from(stores)
            .where(eq(stores.isActive, true)),
    ]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <section>
                <p className="text-sm text-base-content/60">
                    SaaS administration
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    Overview
                </h1>

                <p className="mt-2 text-base-content/60">
                    An overview of your platform activity.
                </p>
            </section>

            {/* Platform statistics */}
            <section
                className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                aria-label="Platform statistics"
            >
                <StatCard
                    label="Total users"
                    value={userStats.count}
                    icon={FiUsers}
                />

                <StatCard
                    label="Total stores"
                    value={storeStats.count}
                    icon={FiShoppingBag}
                />

                <StatCard
                    label="Active stores"
                    value={activeStoreStats.count}
                    icon={FiActivity}
                />
            </section>
        </div>
    );
}

function StatCard({ label, value, icon: Icon }) {
    return (
        <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-3">
                <Icon
                    className="text-base-content/60"
                    size={22}
                    aria-hidden="true"
                />

                <div>
                    <p className="text-sm text-base-content/60">
                        {label}
                    </p>

                    <p className="mt-1 text-3xl font-semibold">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}