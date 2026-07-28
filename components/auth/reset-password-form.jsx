"use client";

import Link from "next/link";

// Client Component: password confirmation and future mutation state stay here.
export default function ResetPasswordForm() {
  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          নতুন পাসওয়ার্ড সেট করুন
        </h1>
        <p className="text-sm text-base-content/60">
          নিরাপদ একটি নতুন পাসওয়ার্ড লিখুন।
        </p>
      </header>

      <form className="grid gap-5">
        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text font-medium">নতুন পাসওয়ার্ড</span>
          </span>
          <input
            className="input input-bordered w-full"
            placeholder="••••••••"
            type="password"
          />
        </label>

        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text font-medium">পাসওয়ার্ড নিশ্চিত করুন</span>
          </span>
          <input
            className="input input-bordered w-full"
            placeholder="••••••••"
            type="password"
          />
        </label>

        <button className="btn btn-primary w-full" type="button">
          পাসওয়ার্ড আপডেট করুন
        </button>
      </form>

      <p className="text-center text-sm text-base-content/60">
        ফিরে যেতে চান?{" "}
        <Link className="link link-primary font-medium" href="/login">
          সাইন ইন
        </Link>
      </p>
    </div>
  );
}
