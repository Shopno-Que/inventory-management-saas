"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function SignupForm() {
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
    const fullName = form.get("fullName");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "পাসওয়ার্ড মেলেনি।" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/user/auth/confirm?next=/user/profile`,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;
      formRef.current?.reset();
      router.push("/user/register-success");
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
        {/* Full Name */}
        <div className="form-control w-full">
          <label htmlFor="fullName" className="label mb-1">
            <span className="label-text font-medium">পূর্ণ নাম</span>
          </label>

          <div className="input validator w-full">
            <FaUser className="text-base-content/50" aria-hidden="true" />

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="আপনার নাম"
              minLength={2}
              maxLength={100}
            />
          </div>

          <p className="validator-hint hidden">আপনার পূর্ণ নাম লিখুন।</p>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="form-control w-full">
          <label htmlFor="password" className="label mb-1">
            <span className="label-text font-medium">পাসওয়ার্ড</span>
          </label>

          <div className="input validator w-full">
            <FaLock className="text-base-content/50" aria-hidden="true" />

            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              title="পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
            />
          </div>

          <p className="validator-hint hidden">
            পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।
          </p>
        </div>

        {/* Re-write Password */}
        <div className="form-control w-full">
          <label htmlFor="confirmPassword" className="label mb-1">
            <span className="label-text font-medium">পাসওয়ার্ড পুনরায় লিখুন</span>
          </label>

          <div className="input validator w-full">
            <FaLock className="text-base-content/50" aria-hidden="true" />

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              title="একই পাসওয়ার্ড পুনরায় লিখুন"
            />
          </div>

          <p className="validator-hint hidden">একই পাসওয়ার্ড পুনরায় লিখুন।</p>
        </div>

        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="loading loading-bars loading-sm"></span>}
          অ্যাকাউন্ট তৈরি করুন
        </button>
      </fieldset>
    </form>
  );
}
