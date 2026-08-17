export default function SkeletonTable({
    rows = 7,
    columns = 6,
}) {
    return (
        <div
            className="overflow-x-auto"
            aria-hidden="true"
        >
            <table className="table">
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index}>
                                <div className="skeleton h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, columnIndex) => (
                                <td key={columnIndex}>
                                    {columnIndex === 0 ? (
                                        <div className="flex items-center gap-3">
                                            <div className="skeleton size-10 shrink-0 rounded-lg" />

                                            <div className="space-y-2">
                                                <div className="skeleton h-4 w-32" />
                                                <div className="skeleton h-3 w-20" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="skeleton h-4 w-20" />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}