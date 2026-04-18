import React from 'react';

const Progress = ({ value }) => {
  // Ensure value stays between 0 and 100
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-md">
      <div
        className="h-full bg-blue-600 text-xs text-white flex items-center justify-center transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default Progress;
