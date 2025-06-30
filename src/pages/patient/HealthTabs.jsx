import React, { useEffect, useRef, useState } from "react";

const HealthTabs = () => {
  const handlePress = () => {
    alert('Chào bạn!\nBạn đã nhấn nút.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-2xl font-bold text-blue-500 mb-3">
        Chào mừng đến với HealthTabs!
      </h1>
      <p className="text-gray-700 text-base mb-6 text-center">
        Đây là màn hình React cơ bản với Tailwind CSS.
      </p>
      <button
        onClick={handlePress}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Nhấn tôi
      </button>
    </div>
  );
};

export default HealthTabs;
