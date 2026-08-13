import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      {/* Hero */}
      <section className="bg-base-100">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-6 py-16">
          <div className="max-w-3xl">
            <div className="badge badge-primary badge-outline mb-5">
              ছোট ব্যবসার জন্য সহজ সমাধান
            </div>

            <h1 className="text-4xl font-bold leading-tight text-base-content sm:text-5xl lg:text-6xl">
              আপনার দোকান পরিচালনা করুন,
              <span className="text-primary"> সহজেই।</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-base-content/60">
              বিক্রি, পণ্যের মজুদ এবং দোকানের দৈনন্দিন কাজ এক জায়গা থেকে
              পরিচালনা করুন। ছোট দোকানের জন্য সহজ ও ব্যবহারযোগ্য POS এবং
              ইনভেন্টরি ম্যানেজমেন্ট।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link href="/user/profile" className="btn btn-primary">
                  আমার দোকানে যান
                </Link>
              ) : (
                <>
                  <Link href="/user/register" className="btn btn-primary">
                    বিনামূল্যে শুরু করুন
                  </Link>

                  <Link href="/user/login" className="btn btn-ghost">
                    সাইন ইন
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-base-200/50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-base-content">
              দোকানের প্রয়োজনীয় কাজ এক জায়গায়
            </h2>

            <p className="mt-3 text-base-content/60">
              প্রতিদিনের দোকান পরিচালনার কাজ সহজভাবে করুন।
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h3 className="card-title">POS</h3>
                <p className="text-base-content/60">
                  দ্রুত বিক্রি সম্পন্ন করুন এবং বিক্রির হিসাব রাখুন।
                </p>
              </div>
            </div>

            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h3 className="card-title">ইনভেন্টরি</h3>
                <p className="text-base-content/60">
                  পণ্যের স্টক এবং মজুদের পরিবর্তন সহজে পরিচালনা করুন।
                </p>
              </div>
            </div>

            <div className="card border border-base-300 bg-base-100">
              <div className="card-body">
                <h3 className="card-title">একাধিক দোকান</h3>
                <p className="text-base-content/60">
                  প্রয়োজন অনুযায়ী একাধিক দোকান পরিচালনা করুন এবং টিমকে
                  যুক্ত করুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">
            আজ থেকেই আপনার দোকান পরিচালনা শুরু করুন
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base-content/60">
            অ্যাকাউন্ট তৈরি করুন এবং আপনার প্রথম দোকান সেটআপ করুন।
          </p>

          {!user && (
            <Link
              href="/user/register"
              className="btn btn-primary mt-6"
            >
              বিনামূল্যে শুরু করুন
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}