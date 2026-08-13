export default function ContactPage() {
    return (
        <main>
            <section className="bg-base-100">
                <div className="mx-auto max-w-3xl px-6 py-20">
                    <div className="text-center">
                        <div className="badge badge-primary badge-outline mb-5">
                            যোগাযোগ
                        </div>

                        <h1 className="text-4xl font-bold sm:text-5xl">
                            আমাদের সাথে যোগাযোগ করুন
                        </h1>

                        <p className="mx-auto mt-5 max-w-xl text-lg text-base-content/60">
                            আপনার কোনো প্রশ্ন, সমস্যা বা পরামর্শ থাকলে আমাদের সাথে
                            যোগাযোগ করুন।
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2">
                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">সাপোর্ট</h2>

                                <p className="text-base-content/60">
                                    অ্যাকাউন্ট, দোকান বা সিস্টেম ব্যবহার সংক্রান্ত সমস্যার
                                    জন্য আমাদের সাথে যোগাযোগ করুন।
                                </p>

                                <a
                                    href="mailto:support@example.com"
                                    className="link link-primary mt-2"
                                >
                                    support@example.com
                                </a>
                            </div>
                        </div>

                        <div className="card border border-base-300 bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">ব্যবসায়িক যোগাযোগ</h2>

                                <p className="text-base-content/60">
                                    পার্টনারশিপ বা ব্যবসায়িক বিষয়ে যোগাযোগ করতে আমাদের
                                    সাথে কথা বলুন।
                                </p>

                                <a
                                    href="mailto:hello@example.com"
                                    className="link link-primary mt-2"
                                >
                                    hello@example.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}