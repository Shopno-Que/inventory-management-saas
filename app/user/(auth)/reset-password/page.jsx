import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
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

      <ResetPasswordForm />

      <p className="text-center text-sm text-base-content/60">
        ফিরে যেতে চান?{" "}
        <Link className="link link-primary font-medium" href="/user/login">
          সাইন ইন
        </Link>
      </p>
    </div>
  );
}
