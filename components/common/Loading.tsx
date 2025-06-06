import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
  );
};

export const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-xl border bg-zinc-800 p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-zinc-700" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-zinc-700 rounded mb-1" />
            <div className="h-2 w-16 bg-zinc-700 rounded" />
          </div>
        </div>
        <div className="h-4 w-full bg-zinc-700 rounded mb-2" />
        <div className="h-3 w-1/2 bg-zinc-700 rounded" />
      </div>
    ))}
  </div>
);

export default Loading; 