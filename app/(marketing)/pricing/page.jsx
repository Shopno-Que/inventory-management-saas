import Link from "next/link";

const plans = [
    {
        name: "ফ্রি",
        price: "৳০",
        description: "ছোট দোকান শুরু করার জন্য।",
        features: [
            "১টি দোকান",
            "পণ্য ব্যবস্থাপনা",
            "বেসিক POS",
            "স্টক ব্যবস্থাপনা",
        ],
        button: "বিনামূল্যে শুরু করুন",
        href: "/stores/new",
    },
    {
        name: "বেসিক",
        price: "৳২৯৯",
        period: "/মাস",
        description: "নিয়মিত দোকান পরিচালনার জন্য।",
        features: [
            "১টি দোকান",
            "সম্পূর্ণ POS",
            "স্টক ব্যবস্থাপনা",
            "বিক্রির রিপোর্ট",
            "কর্মী যোগ করার সুবিধা",
        ],
        button: "শুরু করুন",
        href: "/stores/new",
        popular: true,
    },
    {
        name: "ব্যবসা",
        price: "৳৫৯৯",
        period: "/মাস",
        description: "বড় বা একাধিক দোকানের জন্য।",
        features: [
            "একাধিক দোকান",
            "সম্পূর্ণ POS",
            "উন্নত ইনভেন্টরি",
            "বিস্তারিত রিপোর্ট",
            "টিম ও কর্মী ব্যবস্থাপনা",
            "ভূমিকা ও অনুমতি",
        ],
        button: "শুরু করুন",
        href: "/stores/new",
    },
];

export default function PricingPage() {
    return (
        <main>
            <section className="bg-base-100">
                <div className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="badge badge-primary badge-outline mb-5">
                            মূল্য
                        </div>

                        <h1 className="text-4xl font-bold sm:text-5xl">
                            আপনার দোকানের জন্য
                            <span className="text-primary"> সহজ মূল্য</span>
                        </h1>

                        <p className="mt-5 text-lg text-base-content/60">
                            আপনার ব্যবসার প্রয়োজন অনুযায়ী একটি প্ল্যান বেছে নিন।
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`card border bg-base-100 ${plan.popular
                                        ? "border-primary shadow-lg"
                                        : "border-base-300"
                                    }`}
                            >
                                <div className="card-body">
                                    {plan.popular && (
                                        <div className="badge badge-primary">
                                            সবচেয়ে জনপ্রিয়
                                        </div>
                                    )}

                                    <h2 className="mt-2 text-2xl font-bold">
                                        {plan.name}
                                    </h2>

                                    <p className="min-h-12 text-sm text-base-content/60">
                                        {plan.description}
                                    </p>

                                    <div className="my-5">
                                        <span className="text-4xl font-bold">
                                            {plan.price}
                                        </span>

                                        {plan.period && (
                                            <span className="text-base-content/60">
                                                {plan.period}
                                            </span>
                                        )}
                                    </div>

                                    <ul className="space-y-3 text-sm">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex gap-2">
                                                <span className="text-success">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="card-actions mt-6">
                                        <Link
                                            href={plan.href}
                                            className={`btn w-full ${plan.popular
                                                    ? "btn-primary"
                                                    : "btn-outline"
                                                }`}
                                        >
                                            {plan.button}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-base-content/50">
                        মূল্য ও সুবিধা ভবিষ্যতে পরিবর্তিত হতে পারে। আপনার বর্তমান
                        প্ল্যান অনুযায়ী প্রযোজ্য সুবিধাগুলোই ব্যবহার করতে পারবেন।
                    </p>
                </div>
            </section>
        </main>
    );
}