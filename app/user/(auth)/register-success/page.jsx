import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";

export default function RegisterSuccessPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-success">
          <FaCircleCheck className="size-6" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-semibold text-base-content">
          নিবন্ধন সফল হয়েছে
        </h1>

        <p className="text-sm text-base-content/60">
          আপনার ইমেইলে একটি যাচাইকরণ লিংক পাঠানো হয়েছে। ইমেইল না পেলে স্প্যাম ফোল্ডারও দেখে নিন।
        </p>
      </header>

      <Link href="/user/login" className="btn btn-primary w-full">
        সাইন ইন পেজে যান
      </Link>
    </div>
  );
}
