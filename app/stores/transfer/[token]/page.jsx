import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { storeTransferRequests } from "@/db/schema/storeTransferRequests";
import { stores } from "@/db/schema/stores";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
    title: "Store ownership transfer | Hishab Khata",
};

export default async function StoreTransferPage({ params }) {
    const { token } = await params;

    const [transfer] = await db
        .select({
            id: storeTransferRequests.id,
            storeId: storeTransferRequests.storeId,
            targetEmail: storeTransferRequests.targetEmail,
            status: storeTransferRequests.status,
            expiresAt: storeTransferRequests.expiresAt,
            storeName: stores.name,
        })
        .from(storeTransferRequests)
        .innerJoin(
            stores,
            eq(
                storeTransferRequests.storeId,
                stores.id,
            ),
        )
        .where(
            eq(
                storeTransferRequests.token,
                token,
            ),
        )
        .limit(1);

    if (!transfer) {
        notFound();
    }

    if (
        transfer.status !== "pending"
    ) {
        return (
            <TransferUnavailable
                status={transfer.status}
            />
        );
    }

    if (
        new Date(transfer.expiresAt) < new Date()
    ) {
        return (
            <TransferUnavailable status="expired" />
        );
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        const next = `/stores/transfer/${token}`;

        redirect(
            `/user/login?next=${encodeURIComponent(next)}`,
        );
    }

    const userEmail = user.email?.toLowerCase();
    const targetEmail =
        transfer.targetEmail.toLowerCase();

    if (userEmail !== targetEmail) {
        return (
            <div className="mx-auto max-w-xl">
                <div className="card border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body">
                        <h1 className="card-title">
                            This transfer is not for you
                        </h1>

                        <p className="text-base-content/60">
                            This ownership transfer was sent
                            to a different email address.
                        </p>

                        <div className="card-actions mt-4">
                            <Link
                                href="/user/profile"
                                className="btn btn-primary"
                            >
                                Go to profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl space-y-6">
            <div>
                <div className="breadcrumbs text-sm text-base-content/60">
                    <ul>
                        <li>Store ownership</li>
                        <li>Transfer</li>
                    </ul>
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    Store ownership transfer
                </h1>

                <p className="mt-2 text-base-content/60">
                    You have been invited to become the owner
                    of this store.
                </p>
            </div>

            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body gap-5">
                    <div>
                        <p className="text-sm text-base-content/50">
                            Store
                        </p>

                        <h2 className="mt-1 text-xl font-semibold">
                            {transfer.storeName}
                        </h2>
                    </div>

                    <div>
                        <p className="text-sm text-base-content/50">
                            Transfer to
                        </p>

                        <p className="mt-1 font-medium">
                            {transfer.targetEmail}
                        </p>
                    </div>

                    <div className="alert alert-warning alert-soft">
                        <span className="text-sm">
                            Accepting this request does not
                            immediately transfer ownership.
                            The current store owner must confirm
                            the transfer afterward.
                        </span>
                    </div>

                    {/* Accept / decline form will go here */}
                </div>
            </div>
        </div>
    );
}

function TransferUnavailable({ status }) {
    const messages = {
        expired: {
            title: "Transfer request expired",
            message:
                "This ownership transfer request is no longer valid.",
        },
        accepted: {
            title: "Transfer already accepted",
            message:
                "This transfer is waiting for confirmation from the current owner.",
        },
        completed: {
            title: "Transfer completed",
            message:
                "This ownership transfer has already been completed.",
        },
        declined: {
            title: "Transfer declined",
            message:
                "This ownership transfer was declined.",
        },
        cancelled: {
            title: "Transfer cancelled",
            message:
                "This ownership transfer was cancelled by the store owner.",
        },
    };

    const content =
        messages[status] || {
            title: "Transfer unavailable",
            message:
                "This ownership transfer is no longer available.",
        };

    return (
        <div className="mx-auto max-w-xl">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                    <h1 className="card-title">
                        {content.title}
                    </h1>

                    <p className="text-base-content/60">
                        {content.message}
                    </p>

                    <div className="card-actions mt-4">
                        <Link
                            href="/user/profile"
                            className="btn btn-primary"
                        >
                            Go to profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}