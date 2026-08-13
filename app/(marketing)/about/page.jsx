import Link from "next/link";

export default function AboutPage() {
    return (
        <main>
            <section className="bg-base-100">
                <div className="mx-auto max-w-4xl px-6 py-20">
                    <div className="text-center">
                        <div className="badge badge-primary badge-outline mb-5">
                            আমাদের সম্পর্কে
                        </div>

                        <h1 className="text-4xl font-bold sm:text-5xl">
                            ছোট ব্যবসাকে
                            <span className="text-primary"> সহজভাবে পরিচালনা করতে </span>
                            সাহায্য করি
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-base-content/60">
                            ছোট দোকান পরিচালনা করা যেন কঠিন না হয়—এই লক্ষ্যেই আমাদের
                            প্ল্যাটফর্ম তৈরি। POS, ইনভেন্টরি এবং দোকানের দৈনন্দিন
                            ব্যবস্থাপনার কাজ এক জায়গায় আনার চেষ্টা করছি।
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-base-200/50">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">সহজ</h2>
                                <p className="text-base-content/60">
                                    প্রযুক্তিগত জ্ঞান না থাকলেও সহজে ব্যবহার করা যায়—
                                    এমন অভিজ্ঞতা তৈরি করাই আমাদের লক্ষ্য।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">স্থানীয় ব্যবসার জন্য</h2>
                                <p className="text-base-content/60">
                                    বাংলাদেশের ছোট ও মাঝারি দোকানের বাস্তব প্রয়োজন
                                    মাথায় রেখে পণ্যটি তৈরি করা হচ্ছে।
                                </p>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">এক জায়গায়</h2>
                                <p className="text-base-content/60">
                                    বিক্রি, স্টক এবং টিম পরিচালনার কাজ আলাদা আলাদা
                                    সিস্টেমে না রেখে এক জায়গায় আনার লক্ষ্য।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-base-100">
                <div className="mx-auto max-w-3xl px-6 py-16 text-center">
                    <h2 className="text-3xl font-bold">
                        আপনার দোকান দিয়ে শুরু করুন
                    </h2>

                    <p className="mt-3 text-base-content/60">
                        অ্যাকাউন্ট তৈরি করুন এবং আপনার প্রথম দোকান সেটআপ করুন।
                    </p>

                    <Link href="/user/register" className="btn btn-primary mt-6">
                        বিনামূল্যে শুরু করুন
                    </Link>
                </div>
            </section>
        </main>
    );
}