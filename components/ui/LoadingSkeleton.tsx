export function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-700 rounded-lg p-4">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 