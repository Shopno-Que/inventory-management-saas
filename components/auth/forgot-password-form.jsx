"use client";

import { useRef, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
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

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/user/reset-password`,
      });
      if (error) throw error;
      setMessage({
        type: "success",
        text: "পাসওয়ার্ড রিসেটের নির্দেশনা আপনার ইমেইলে পাঠানো হয়েছে। ইমেইল না পেলে স্প্যাম ফোল্ডারও দেখে নিন।",
      });
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

        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading && <span className="loading loading-bars loading-sm"></span>}
          রিসেট লিংক পাঠান
        </button>
      </fieldset>
    </form>
  );
}
