import SkeletonBlock from "@/components/skeleton/SkeletonBlock";
import SkeletonCard from "@/components/skeleton/SkeletonCard";

export default function EditProductLoading() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}
            <SkeletonBlock
                rows={3}
                className="w-80"
                rowClassName="h-4 first:w-32 first:h-4 last:w-72"
            />

            {/* Form */}
            <SkeletonCard>
                <div className="space-y-2">
                    <div className="skeleton h-4 w-24" />
                    <div className="skeleton h-12 w-full" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <div className="skeleton h-4 w-20" />
                            <div className="skeleton h-12 w-full" />
                            <div className="skeleton h-3 w-48" />
                        </div>
                    ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <div className="skeleton h-4 w-24" />
                            <div className="skeleton h-12 w-full" />
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <div className="skeleton h-4 w-28" />
                    <div className="skeleton h-28 w-full" />
                </div>

                <div className="flex items-center gap-3">
                    <div className="skeleton size-5 rounded" />
                    <div className="skeleton h-4 w-64" />
                </div>

                <div className="flex items-center justify-between border-t border-base-300 pt-5">
                    <div className="skeleton h-10 w-32" />

                    <div className="flex gap-2">
                        <div className="skeleton h-10 w-20" />
                        <div className="skeleton h-10 w-32" />
                    </div>
                </div>
            </SkeletonCard>
        </div>
    );
}