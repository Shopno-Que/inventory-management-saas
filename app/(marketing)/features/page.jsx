import Link from "next/link";

export default function FeaturesPage() {
    return (
        <main>
            {/* Header */}
            <section className="bg-base-100">
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="max-w-3xl">
                        <div className="badge badge-primary badge-outline mb-5">
                            ফিচার
                        </div>

                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                            দোকান পরিচালনার জন্য
                            <span className="text-primary"> প্রয়োজনীয় সবকিছু</span>
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-base-content/60">
                            বিক্রি থেকে শুরু করে পণ্যের মজুদ এবং টিম পরিচালনা—
                            আপনার দোকানের দৈনন্দিন কাজ এক জায়গা থেকে পরিচালনা করুন।
                        </p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-base-200/50">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">সহজ POS</h2>
                                <p className="text-base-content/60">
                                    দ্রুত বিক্রি সম্পন্ন করুন এবং প্রতিটি বিক্রির হিসাব
                                    সংরক্ষণ করুন।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">ইনভেন্টরি ব্যবস্থাপনা</h2>
                                <p className="text-base-content/60">
                                    পণ্যের স্টক, মূল্য এবং মজুদের পরিবর্তন সহজে পরিচালনা করুন।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">একাধিক দোকান</h2>
                                <p className="text-base-content/60">
                                    একই অ্যাকাউন্ট থেকে একাধিক দোকান পরিচালনা করুন।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">টিম ও কর্মী</h2>
                                <p className="text-base-content/60">
                                    আপনার দোকানে অন্যদের আমন্ত্রণ জানান এবং তাদের
                                    নির্দিষ্ট দায়িত্ব অনুযায়ী কাজের সুযোগ দিন।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">ভূমিকা ও অনুমতি</h2>
                                <p className="text-base-content/60">
                                    কে কোন কাজ করতে পারবে তা ভূমিকা ও অনুমতির মাধ্যমে
                                    নিয়ন্ত্রণ করুন।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">বিক্রির রিপোর্ট</h2>
                                <p className="text-base-content/60">
                                    আপনার দোকানের বিক্রি এবং ব্যবসার কার্যক্রম সম্পর্কে
                                    পরিষ্কার ধারণা রাখুন।
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
                        আপনার দোকান পরিচালনা শুরু করুন
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-base-content/60">
                        অ্যাকাউন্ট তৈরি করে আপনার প্রথম দোকান সেটআপ করুন।
                    </p>

                    <Link href="/stores/new" className="btn btn-primary mt-6">
                        বিনামূল্যে শুরু করুন
                    </Link>
                </div>
            </section>
        </main>
    );
}