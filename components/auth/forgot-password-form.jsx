"use client";

import Link from "next/link";

// Client Component: isolated for future submit state and field validation.
export default function ForgotPasswordForm() {
  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          পাসওয়ার্ড রিসেট করুন
        </h1>
        <p className="text-sm text-base-content/60">
          আপনার ইমেইল দিন, আমরা রিসেট নির্দেশনা পাঠাব।
        </p>
      </header>

      <form className="grid gap-5">
        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text font-medium">ইমেইল</span>
          </span>
          <input
            className="input input-bordered w-full"
            placeholder="you@example.com"
            type="email"
          />
        </label>

        <button className="btn btn-primary w-full" type="button">
          রিসেট লিংক পাঠান
        </button>
      </form>

      <p className="text-center text-sm text-base-content/60">
        পাসওয়ার্ড মনে পড়েছে?{" "}
        <Link className="link link-primary font-medium" href="/login">
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  );
}
