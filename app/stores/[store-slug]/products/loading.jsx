import SkeletonBlock from "@/components/skeleton/SkeletonBlock";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import SkeletonTable from "@/components/skeleton/SkeletonTable";

export default function ProductsLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SkeletonBlock
                    rows={3}
                    className="w-72"
                    rowClassName="h-4 first:h-4 first:w-20 last:w-64"
                />

                <div className="skeleton h-10 w-32" aria-hidden="true" />
            </div>

            {/* Filters */}
            <SkeletonCard>
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                    <div className="skeleton h-10 w-full" />
                    <div className="skeleton h-10 w-36" />
                    <div className="skeleton h-10 w-28" />
                </div>
            </SkeletonCard>

            {/* Products */}
            <SkeletonCard className="overflow-hidden">
                <div className="-mx-6 -my-6">
                    <SkeletonTable rows={7} columns={6} />
                </div>

                <div className="flex items-center justify-between border-t border-base-300 pt-4">
                    <div className="skeleton h-4 w-32" />

                    <div className="flex gap-2">
                        <div className="skeleton h-8 w-16" />
                        <div className="skeleton h-8 w-16" />
                    </div>
                </div>
            </SkeletonCard>
        </div>
    );
}