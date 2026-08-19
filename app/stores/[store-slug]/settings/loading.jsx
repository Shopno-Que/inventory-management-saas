import SkeletonBlock from "@/components/skeleton/SkeletonBlock";
import SkeletonCard from "@/components/skeleton/SkeletonCard";

export default function StoreSettingsLoading() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <SkeletonBlock
                    rows={3}
                    className="w-80"
                    rowClassName="h-4 first:h-4 first:w-20 last:w-72"
                />
            </div>

            {/* General settings */}
            <SkeletonCard>
                <div className="space-y-6">
                    <SkeletonBlock
                        rows={2}
                        className="w-72"
                        rowClassName="h-5 first:w-40 last:w-64"
                    />

                    <div className="grid gap-5">
                        <div className="space-y-2">
                            <div className="skeleton h-4 w-24" />
                            <div className="skeleton h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                            <div className="skeleton h-4 w-24" />
                            <div className="skeleton h-10 w-full" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="skeleton h-4 w-20" />
                                <div className="skeleton h-10 w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="skeleton h-4 w-20" />
                                <div className="skeleton h-10 w-full" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="skeleton h-4 w-20" />
                            <div className="skeleton h-10 w-full" />
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-base-300 pt-5">
                        <div className="skeleton h-10 w-28" />
                    </div>
                </div>
            </SkeletonCard>

            {/* Ownership */}
            <SkeletonCard>
                <div className="space-y-5">
                    <SkeletonBlock
                        rows={2}
                        className="w-72"
                        rowClassName="h-5 first:w-44 last:w-64"
                    />

                    <div className="max-w-xl space-y-2">
                        <div className="skeleton h-4 w-36" />
                        <div className="skeleton h-10 w-full" />
                    </div>

                    <div className="skeleton h-12 w-full" />

                    <div className="skeleton h-10 w-40" />
                </div>
            </SkeletonCard>

            {/* Danger zone */}
            <SkeletonCard>
                <div className="space-y-5">
                    <SkeletonBlock
                        rows={2}
                        className="w-72"
                        rowClassName="h-5 first:w-32 last:w-64"
                    />

                    <div className="skeleton h-12 w-full" />

                    <div className="max-w-md space-y-2">
                        <div className="skeleton h-4 w-48" />
                        <div className="skeleton h-10 w-full" />
                    </div>

                    <div className="skeleton h-10 w-32" />
                </div>
            </SkeletonCard>
        </div>
    );
}