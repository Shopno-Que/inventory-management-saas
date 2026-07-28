export default function AuthFormSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <div className="skeleton mx-auto h-8 w-44" />
        <div className="skeleton mx-auto h-4 w-60" />
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-12 w-full" />
        </div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-12 w-full" />
        </div>
        <div className="skeleton h-12 w-full" />
      </div>

      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-12 w-full" />
    </div>
  );
}
