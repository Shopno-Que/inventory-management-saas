"use client";

import Link from "next/link";

// Client Component: future validation and submit state stay here instead of
// making the page or shared layout client-side.
export default function SignupForm() {
  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-base-content">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm text-base-content/60">
          আপনার ব্যবসার তথ্য দিয়ে শুরু করুন
        </p>
      </header>

      <form className="grid gap-5">
        <label className="form-control w-full">
          <span className="label mb-1">
            <span className="label-text font-medium">পূর্ণ নাম</span>
          </span>
          <input
            className="input input-bordered w-full"
            placeholder="আপনার নাম"
            type="text"
          />
        </label>

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
          <span className="label mb-1">
            <span className="label-text font-medium">পাসওয়ার্ড</span>
          </span>
          <input
            className="input input-bordered w-full"
            placeholder="••••••••"
            type="password"
          />
        </label>

        <button className="btn btn-primary w-full" type="button">
          অ্যাকাউন্ট তৈরি করুন
        </button>
      </form>

      <p className="text-center text-sm text-base-content/60">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link className="link link-primary font-medium" href="/login">
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  );
}
