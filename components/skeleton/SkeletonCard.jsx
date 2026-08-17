export default function SkeletonCard({
    className = "",
    children,
}) {
    return (
        <div
            className={`card border border-base-300 bg-base-100 shadow-sm ${className}`}
            aria-hidden="true"
        >
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}