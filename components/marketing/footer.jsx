import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-base-300 bg-base-100">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            className="text-xl font-bold text-base-content"
                        >
                            হিসাব খাতা
                        </Link>

                        <p className="mt-3 max-w-md text-sm leading-6 text-base-content/60">
                            ছোট ব্যবসার জন্য সহজ POS, ইনভেন্টরি এবং দোকান
                            ব্যবস্থাপনা।
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">পণ্য</h3>

                        <ul className="mt-4 space-y-3 text-sm text-base-content/60">
                            <li>
                                <Link
                                    href="/features"
                                    className="hover:text-base-content"
                                >
                                    ফিচার
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/pricing"
                                    className="hover:text-base-content"
                                >
                                    মূল্য
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/stores/new"
                                    className="hover:text-base-content"
                                >
                                    শুরু করুন
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold">তথ্য</h3>

                        <ul className="mt-4 space-y-3 text-sm text-base-content/60">
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-base-content"
                                >
                                    আমাদের সম্পর্কে
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-base-content"
                                >
                                    যোগাযোগ
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-base-content"
                                >
                                    গোপনীয়তা নীতি
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-base-content"
                                >
                                    ব্যবহারের শর্তাবলি
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-base-300 pt-6 text-sm text-base-content/50">
                    © {new Date().getFullYear()} হিসাব খাতা. সর্বস্বত্ব সংরক্ষিত।
                </div>
            </div>
        </footer>
    );
}