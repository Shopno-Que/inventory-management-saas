import Link from "next/link";
import { FaTriangleExclamation } from "react-icons/fa6";

export default async function ErrorPage({ searchParams }) {
  const params = await searchParams;
  const errorCode = params?.error;

  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
          <FaTriangleExclamation className="size-6" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-semibold text-base-content">
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className="text-sm text-base-content/60">
          আপনার অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন অথবা সাইন ইন পেজে ফিরে যান।
        </p>
      </header>

      <div role="alert" className="alert alert-error alert-soft">
        <span>
          {errorCode ? `ত্রুটির কোড: ${errorCode}` : "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।"}
        </span>
      </div>

      <Link href="/user/login" className="btn btn-primary w-full">
        সাইন ইন পেজে যান
      </Link>
    </div>
  );
}
