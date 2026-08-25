import SkeletonBlock from "@/components/skeleton/SkeletonBlock";
import SkeletonCard from "@/components/skeleton/SkeletonCard";

export default function SaasLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SkeletonBlock
                    rows={2}
                    className="w-72"
                    rowClassName="h-4 first:h-8 first:w-48"
                />

                <div className="flex gap-2" aria-hidden="true">
                    <div className="skeleton h-8 w-24" />
                    <div className="skeleton h-8 w-32" />
                </div>
            </div>

            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCard key={index}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <div className="skeleton h-4 w-24" />
                                <div className="skeleton h-8 w-32" />
                            </div>

                            <div className="skeleton size-11 rounded-lg" />
                        </div>

                        <div className="skeleton h-3 w-36" />
                    </SkeletonCard>
                ))}
            </div>

            {/* Main */}
            <div className="grid gap-6 lg:grid-cols-3">
                <SkeletonCard className="lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="skeleton h-5 w-32" />
                            <div className="skeleton h-3 w-56" />
                        </div>

                        <div className="skeleton h-8 w-24" />
                    </div>

                    <div className="mt-4 flex h-64 items-end gap-3 rounded-lg border border-base-300 p-4">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex flex-1 flex-col items-center justify-end gap-2"
                            >
                                <div
                                    className="skeleton w-full rounded-t"
                                    style={{
                                        height: `${45 + ((index * 17) % 45)}%`,
                                    }}
                                />

                                <div className="skeleton h-3 w-7" />
                            </div>
                        ))}
                    </div>
                </SkeletonCard>

                <SkeletonCard>
                    <div className="space-y-2">
                        <div className="skeleton h-5 w-28" />
                        <div className="skeleton h-3 w-44" />
                    </div>

                    <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-lg border border-base-300 p-3"
                            >
                                <div className="skeleton size-10 rounded-lg" />

                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-4 w-24" />
                                    <div className="skeleton h-3 w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                </SkeletonCard>
            </div>

            {/* Recent / Stock */}
            <div className="grid gap-6 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, cardIndex) => (
                    <SkeletonCard key={cardIndex}>
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="skeleton h-5 w-32" />
                                <div className="skeleton h-3 w-48" />
                            </div>

                            <div className="skeleton h-8 w-20" />
                        </div>

                        <div className="divide-y divide-base-300">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between gap-4 py-3"
                                >
                                    <div className="space-y-2">
                                        <div className="skeleton h-4 w-28" />
                                        <div className="skeleton h-3 w-36" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="skeleton h-4 w-20" />
                                        <div className="skeleton h-3 w-12" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>
                ))}
            </div>
        </div>
    );
}