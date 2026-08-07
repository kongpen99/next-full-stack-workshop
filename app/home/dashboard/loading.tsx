export default function DashboardLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="h-8 w-48 bg-gray-300 rounded-md"></div>
                <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
            </div>

            {/* Summary KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                    </div>
                ))}
            </div>

            {/* Charts Skeleton Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded"></div>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full border-8 border-gray-200 border-t-gray-300 animate-spin"></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div className="h-6 w-40 bg-gray-300 rounded"></div>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full border-8 border-gray-200 border-t-gray-300 animate-spin"></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 lg:col-span-2">
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                    <div className="h-72 bg-gray-100 rounded-lg flex items-end justify-around p-4 space-x-4">
                        <div className="w-12 bg-gray-200 h-1/3 rounded-t"></div>
                        <div className="w-12 bg-gray-200 h-2/3 rounded-t"></div>
                        <div className="w-12 bg-gray-200 h-1/2 rounded-t"></div>
                        <div className="w-12 bg-gray-200 h-4/5 rounded-t"></div>
                        <div className="w-12 bg-gray-200 h-3/5 rounded-t"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
