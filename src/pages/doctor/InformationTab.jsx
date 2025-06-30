import React, { useEffect, useRef, useState } from "react";

const InformationTab = () => {

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Thông tin cá nhân</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src="https://readdy.ai/api/search-image?query=professional%20male%20doctor%20portrait%2C%20asian%20doctor%2C%20wearing%20white%20coat%2C%20stethoscope%2C%20friendly%20smile%2C%20high%20quality%2C%20studio%20lighting%2C%20medical%20professional%2C%20isolated%20on%20light%20blue%20background%2C%20centered%20composition&width=120&height=120&seq=doctor1&orientation=squarish"
              alt="Bác sĩ"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mx-auto"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-md cursor-pointer !rounded-button">
              <i className="fas fa-camera text-sm"></i>
            </button>
          </div>
          <h2 className="text-xl font-semibold mt-4">BS. Nguyễn Văn An</h2>
          <p className="text-gray-500">Bác sĩ chuyên khoa Tim mạch</p>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Thông tin cơ bản</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="Nguyễn Văn An"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="nguyenvanan@healthcare.vn"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="0912345678"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="15/08/1980"
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Thông tin chuyên môn</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="Tim mạch"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh viện</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="Bệnh viện Đa khoa Trung ương"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số năm kinh nghiệm</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="15 năm"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chứng chỉ hành nghề</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value="00123456/BYT-CCHN"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md !rounded-button">
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationTab;
