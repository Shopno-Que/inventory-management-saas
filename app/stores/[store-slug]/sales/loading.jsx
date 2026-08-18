import SkeletonBlock from "@/components/skeleton/SkeletonBlock";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import SkeletonTable from "@/components/skeleton/SkeletonTable";

export default function SalesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SkeletonBlock
          rows={3}
          className="w-72"
          rowClassName="h-4 first:h-4 first:w-20 last:w-64"
        />
        <div className="skeleton h-10 w-32" aria-hidden="true" />
      </div>

      <SkeletonCard>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="skeleton h-10 w-full" />
          <div className="skeleton h-10 w-36" />
          <div className="skeleton h-10 w-28" />
        </div>
      </SkeletonCard>

      <SkeletonCard className="overflow-hidden">
        <div className="-mx-6 -my-6">
          <SkeletonTable rows={6} columns={5} />
        </div>
      </SkeletonCard>
    </div>
  );
}
