"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

// Client Component: form controls and future submit handlers belong in the
// smallest possible client boundary.
export default function LoginForm() {
  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-base-content">সাইন ইন করুন</h1>
        <p className="text-sm text-base-content/60">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
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

        <label className="form-control w-full">
          <span className="label mb-1 flex items-center justify-between">
            <span className="label-text font-medium">পাসওয়ার্ড</span>
            <Link className="link link-primary text-sm" href="/forgot-password">
              ভুলে গেছেন?
            </Link>
          </span>
          <input
            className="input input-bordered w-full"
            placeholder="••••••••"
            type="password"
          />
        </label>

        <button className="btn btn-primary w-full" type="button">
          সাইন ইন
        </button>
      </form>

      <div className="divider">অথবা</div>

      <button
        className="btn btn-outline flex w-full items-center justify-center gap-3"
        type="button"
      >
        <FcGoogle aria-hidden="true" className="text-xl" />
        Google দিয়ে সাইন ইন করুন
      </button>

      <p className="text-center text-sm text-base-content/60">
        নতুন অ্যাকাউন্ট দরকার?{" "}
        <Link className="link link-primary font-medium" href="/signup">
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
}
