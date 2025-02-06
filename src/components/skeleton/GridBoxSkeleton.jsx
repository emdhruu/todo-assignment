import React from "react";

const GridBoxSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="rounded-2xl bg-gray-200 p-5 flex flex-col justify-between shadow-lg animate-pulse"
        >
          {/* Todo Content */}
          <div className="flex flex-col">
            <div className="bg-gray-300 h-6 w-3/4 rounded mb-4"></div>
          </div>

          {/* Actions - Delete & Checkbox */}
          <div className="flex justify-between items-center mt-4">
            <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
            <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridBoxSkeleton;
