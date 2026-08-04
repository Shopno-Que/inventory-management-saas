"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FaLock } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const supabase = createClient();
    
    setLoading(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "পাসওয়ার্ড মেলেনি।" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      formRef.current?.reset();
      router.push("/");
    } catch (error) {
      setMessage({ type: "error", text: error ? error.message : "কোন সমস্যা হয়েছে। আবার চেষ্টা করুন।" })
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {message && (
        <div
          role="alert"
          className={`alert mb-5 ${message.type === "success" ? "alert-success" : "alert-error"}`}
        >
          <span>{message.text}</span>
        </div>
      )}

      <fieldset className="grid gap-5" disabled={loading}>
        <div className="form-control w-full">
          <label htmlFor="password" className="label mb-1">
            <span className="label-text font-medium">নতুন পাসওয়ার্ড</span>
          </label>

          <div className="input validator w-full">
            <FaLock className="text-base-content/50" aria-hidden="true" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
              title="পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
            />
          </div>

          <p className="validator-hint hidden">
            পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।
          </p>
        </div>

        <div className="form-control w-full">
          <label htmlFor="confirmPassword" className="label mb-1">
            <span className="label-text font-medium">পাসওয়ার্ড নিশ্চিত করুন</span>
          </label>

          <div className="input w-full">
            <FaLock className="text-base-content/50" aria-hidden="true" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="loading loading-bars loading-sm" />}
          পাসওয়ার্ড আপডেট করুন
        </button>
      </fieldset>
    </form>
  )
}
