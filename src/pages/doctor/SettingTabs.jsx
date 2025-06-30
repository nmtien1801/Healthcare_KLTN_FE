import React, { useEffect, useRef, useState } from "react";

const SettingTabs = () => {

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Cài đặt</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Thông báo</h3>
                <p className="text-sm text-gray-500">Quản lý thông báo từ ứng dụng</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input type="checkbox" id="notification" className="sr-only" defaultChecked />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform translate-x-6"></div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Chế độ tối</h3>
                <p className="text-sm text-gray-500">Thay đổi giao diện sang chế độ tối</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input type="checkbox" id="darkmode" className="sr-only" />
                <div className="block bg-gray-300 w-12 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Ngôn ngữ</h3>
                <p className="text-sm text-gray-500">Thay đổi ngôn ngữ hiển thị</p>
              </div>
              <div className="relative">
                <select className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
                <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Bảo mật</h3>
                <p className="text-sm text-gray-500">Thay đổi mật khẩu và cài đặt bảo mật</p>
              </div>
              <button className="text-blue-600 !rounded-button">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Trợ giúp & Hỗ trợ</h3>
                <p className="text-sm text-gray-500">Liên hệ với đội ngũ hỗ trợ</p>
              </div>
              <button className="text-blue-600 !rounded-button">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-red-600">Đăng xuất</h3>
                <p className="text-sm text-gray-500">Đăng xuất khỏi tài khoản</p>
              </div>
              <button className="text-red-600 !rounded-button">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingTabs;
