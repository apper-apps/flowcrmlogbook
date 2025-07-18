import Card from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto"></div>
                <div className="h-6 bg-gray-700 rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;