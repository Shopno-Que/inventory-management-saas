"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supabase = createClient();

    setLoading(true);
    setMessage(null);

    const form = new FormData(e.currentTarget);

    const email = form.get("email");
    const password = form.get("password");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      formRef.current?.reset();
      router.replace("/user/profile");
    } catch (error) {
      setMessage({
        type: "error",
        text: error ? error.message : "কোন সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {message && (
        <div
          role="alert"
          className={`alert mb-5 ${
            message.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      <fieldset className="grid gap-5" disabled={loading}>
        <div className="form-control w-full">
          <label htmlFor="email" className="label mb-1">
            <span className="label-text font-medium">ইমেইল</span>
          </label>

          <div className="input validator w-full">
            <FaEnvelope className="text-base-content/50" aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <p className="validator-hint hidden">একটি সঠিক ইমেইল ঠিকানা লিখুন।</p>
        </div>

        <div className="form-control w-full">
          <div className="label mb-1 flex justify-between">
            <label htmlFor="password" className="label-text font-medium">
              পাসওয়ার্ড
            </label>

            <Link
              href="/user/forgot-password"
              className="link link-primary text-sm"
            >
              ভুলে গেছেন?
            </Link>
          </div>

          <div className="input validator w-full">
            <FaLock className="text-base-content/50" aria-hidden="true" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <p className="validator-hint hidden">
            পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।
          </p>
        </div>

        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="loading loading-bars loading-sm"></span>}
          সাইন ইন করুন
        </button>
      </fieldset>
    </form>
  );
}
