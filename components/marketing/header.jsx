import Link from "next/link";
import { FaBars } from "react-icons/fa6";

export default function Header() {
    return (
        <header className="border-b border-base-300 bg-base-100">
            <div className="navbar mx-auto max-w-6xl px-6">
                <div className="navbar-start">
                    <Link
                        href="/"
                        className="text-xl font-bold text-base-content"
                    >
                        আপনার SaaS
                    </Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal gap-1">
                        <li>
                            <Link href="/">হোম</Link>
                        </li>

                        <li>
                            <Link href="/features">ফিচার</Link>
                        </li>

                        <li>
                            <Link href="/pricing">মূল্য</Link>
                        </li>

                        <li>
                            <Link href="/about">আমাদের সম্পর্কে</Link>
                        </li>

                        <li>
                            <Link href="/contact">যোগাযোগ</Link>
                        </li>
                    </ul>
                </div>

                <div className="navbar-end gap-2">
                    <Link
                        href="/user/login"
                        className="btn btn-ghost hidden sm:inline-flex"
                    >
                        সাইন ইন
                    </Link>

                    <Link
                        href="/user/register"
                        className="btn btn-primary"
                    >
                        শুরু করুন
                    </Link>

                    <div className="dropdown dropdown-end lg:hidden">
                        <button
                            type="button"
                            className="btn btn-ghost btn-square"
                            aria-label="মেনু খুলুন"
                        >
                            <FaBars className="size-5" aria-hidden="true" />
                        </button>

                        <ul
                            tabIndex={0}
                            className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
                        >
                            <li>
                                <Link href="/">হোম</Link>
                            </li>

                            <li>
                                <Link href="/features">ফিচার</Link>
                            </li>

                            <li>
                                <Link href="/pricing">মূল্য</Link>
                            </li>

                            <li>
                                <Link href="/about">আমাদের সম্পর্কে</Link>
                            </li>

                            <li>
                                <Link href="/contact">যোগাযোগ</Link>
                            </li>

                            <li className="sm:hidden">
                                <Link href="/user/login">সাইন ইন</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}