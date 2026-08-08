import Link from "next/link";
import {FaArrowRight, FaCalendarAlt, FaCheckCircle, FaCog, FaEnvelope, FaUser} from "react-icons/fa";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "প্রোফাইল | হিসাব খাতা" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();
  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "আপনার অ্যাকাউন্ট";

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-base-content/60">অ্যাকাউন্ট</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">আমার প্রোফাইল</h1>
          <p className="mt-2 text-base-content/60">
            আপনার তথ্য ও অ্যাকাউন্টের অবস্থা এক নজরে দেখুন।
          </p>
        </div>
      </div>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">অ্যাকাউন্টের তথ্য</h2>
          <div className="divider my-0" />
          <dl className="grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <FaUser
                className="mt-1 text-base-content/55"
                aria-hidden="true"
              />
              <div>
                <dt className="text-sm text-base-content/55">নাম</dt>
                <dd className="font-medium">{name}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <FaEnvelope
                className="mt-1 text-base-content/55"
                aria-hidden="true"
              />
              <div>
                <dt className="text-sm text-base-content/55">ইমেইল</dt>
                <dd className="font-medium break-all">{user?.email}</dd>
              </div>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
