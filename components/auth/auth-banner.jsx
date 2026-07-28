import Image from "next/image";

// Server Component: this panel is static UI plus next/image, so it stays out of
// the client bundle and remains cheap to stream from the shared auth layout.
export default function AuthBanner() {
  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-neutral lg:block">
      <Image
        alt="পয়েন্ট অব সেল ড্যাশবোর্ডসহ আধুনিক খুচরা বিক্রয় কাউন্টার"
        className="object-cover opacity-75"
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        src="/images/auth-side.jpg"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/60 to-neutral/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_26rem)]" />

      <div className="absolute inset-x-0 bottom-0 p-10 text-neutral-content xl:p-14">
        <div className="mb-8 inline-flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-box bg-primary font-bold text-primary-content">
            HK
          </div>
          <div>
            <p className="font-semibold">হিসাব খাতা</p>
            <p className="text-sm text-neutral-content/65">
              ইনভেন্টরি ও পিওএস সলিউশন
            </p>
          </div>
        </div>

        <div className="mb-5 h-1 w-16 rounded-full bg-primary" />
        <h2 className="max-w-xl text-4xl font-bold leading-tight">
          স্টক, বিক্রয় এবং হিসাব রাখুন আরও সহজ ও নিয়ন্ত্রিতভাবে।
        </h2>
        <p className="mt-4 max-w-lg text-base leading-7 text-neutral-content/75">
          দ্রুত চেকআউট, পরিষ্কার রিপোর্ট এবং স্মার্ট ইনভেন্টরি সিদ্ধান্তের জন্য একটি শান্ত ও
          নির্ভরযোগ্য কর্মক্ষেত্র।
        </p>
      </div>
    </aside>
  );
}
