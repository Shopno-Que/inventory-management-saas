import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";

import { stores, storeMembers } from "@/db/schema/stores";
import { and, desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (!tokenHash || !type) {
    redirect(
      "/user/auth/error?error=No token hash or type",
    );
  }

  const supabase = await createClient();

  /*
   * Verify the email confirmation token.
   */
  const { error: verifyError } =
    await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

  if (verifyError) {
    redirect(
      `/user/auth/error?error=${encodeURIComponent(
        verifyError.message,
      )}`,
    );
  }

  /*
   * The user should now have an authenticated
   * Supabase session.
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/user/auth/error?error=User session could not be established",
    );
  }

  try {
    const result = await db.transaction(
      async (tx) => {
        /*
         * Find the pending store created during
         * the store onboarding flow.
         */
        const [pendingStore] = await tx
          .select({
            id: stores.id,
            slug: stores.slug,
          })
          .from(stores)
          .where(
            and(
              eq(stores.ownerId, user.id),
              eq(stores.isActive, false),
            ),
          )
          .orderBy(desc(stores.createdAt))
          .limit(1);

        if (!pendingStore) {
          return null;
        }

        /*
         * Activate the store.
         */
        await tx
          .update(stores)
          .set({
            isActive: true,
            updatedAt: new Date(),
          })
          .where(
            eq(
              stores.id,
              pendingStore.id,
            ),
          );

        /*
         * Activate the user's membership.
         */
        await tx
          .update(storeMembers)
          .set({
            status: "active",
            joinedAt: new Date(),
          })
          .where(
            and(
              eq(
                storeMembers.storeId,
                pendingStore.id,
              ),
              eq(
                storeMembers.userId,
                user.id,
              ),
              eq(
                storeMembers.status,
                "pending",
              ),
            ),
          );

        return pendingStore;
      },
    );

    if (!result) {
      redirect(
        "/user/profile/stores?verified=true",
      );
    }

    /*
     * Email verified and pending store activated.
     */
    redirect(`/stores/${result.slug}`);
  } catch (error) {
    console.error(
      "Pending store activation failed:",
      error,
    );

    redirect(
      "/user/auth/error?error=Store activation failed",
    );
  }
}