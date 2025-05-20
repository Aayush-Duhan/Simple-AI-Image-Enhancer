import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Optional: Add a simple spinner animation if desired */}
      {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mb-4"></div> */}
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Enhancing your image, please wait...
      </p>
    </div>
  );
};

export default Loading;