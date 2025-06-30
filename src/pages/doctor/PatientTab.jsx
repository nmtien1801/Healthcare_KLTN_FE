import React, { useEffect, useRef, useState } from "react";

const PatientTab = () => {

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Quản lý bệnh nhân</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center !rounded-button">
          <i className="fas fa-plus mr-2"></i>
          Thêm bệnh nhân
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-2">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tìm kiếm bệnh nhân..."
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0 md:px-2">
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                <option value="">Tất cả bệnh</option>
                <option value="heart">Tim mạch</option>
                <option value="diabetes">Tiểu đường</option>
                <option value="respiratory">Hô hấp</option>
              </select>
              <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 md:pl-2">
            <div className="relative">
              <select className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                <option value="">Sắp xếp theo</option>
                <option value="name">Tên</option>
                <option value="date">Ngày khám gần nhất</option>
                <option value="status">Tình trạng</option>
              </select>
              <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient list */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bệnh nhân
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thông tin
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tình trạng
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lần khám gần nhất
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="https://readdy.ai/api/search-image?query=elderly%20asian%20man%20portrait%2C%2070%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient1&orientation=squarish" alt="Bệnh nhân" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Trần Văn Bình</div>
                    <div className="text-sm text-gray-500">68 tuổi</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Tăng huyết áp, Tiểu đường type 2</div>
                <div className="text-sm text-gray-500">BHYT: BH123456789</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Cần theo dõi
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15/06/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button">
                  <i className="fas fa-comment-medical"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="https://readdy.ai/api/search-image?query=middle%20aged%20asian%20woman%20portrait%2C%2050%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient2&orientation=squarish" alt="Bệnh nhân" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Nguyễn Thị Mai</div>
                    <div className="text-sm text-gray-500">52 tuổi</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Tiểu đường type 2</div>
                <div className="text-sm text-gray-500">BHYT: BH987654321</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                  Đang điều trị
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20/06/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button">
                  <i className="fas fa-comment-medical"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="https://readdy.ai/api/search-image?query=young%20asian%20man%20portrait%2C%2030%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient3&orientation=squarish" alt="Bệnh nhân" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Lê Minh Tuấn</div>
                    <div className="text-sm text-gray-500">35 tuổi</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Viêm phổi</div>
                <div className="text-sm text-gray-500">BHYT: BH456789123</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Theo dõi
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                21/06/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button">
                  <i className="fas fa-comment-medical"></i>
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded-full" src="https://readdy.ai/api/search-image?query=elderly%20asian%20woman%20portrait%2C%2075%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient4&orientation=squarish" alt="Bệnh nhân" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Phạm Thị Hương</div>
                    <div className="text-sm text-gray-500">72 tuổi</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Suy tim, Tăng huyết áp</div>
                <div className="text-sm text-gray-500">BHYT: BH789123456</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Ổn định
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                18/06/2025
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 mr-3 cursor-pointer !rounded-button">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-blue-600 hover:text-blue-900 cursor-pointer !rounded-button">
                  <i className="fas fa-comment-medical"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Patient health monitoring */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Theo dõi chỉ số sức khỏe - Trần Văn Bình</h2>
        <div id="health-chart" style={{ height: '300px' }}></div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-blue-800">Huyết áp</h3>
              <span className="text-red-500 text-sm font-semibold">Cao</span>
            </div>
            <p className="text-2xl font-bold mt-2">160/95</p>
            <p className="text-xs text-gray-500 mt-1">Cập nhật: 23/06/2025 08:15</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-purple-800">Nhịp tim</h3>
              <span className="text-yellow-500 text-sm font-semibold">Cao nhẹ</span>
            </div>
            <p className="text-2xl font-bold mt-2">92 bpm</p>
            <p className="text-xs text-gray-500 mt-1">Cập nhật: 23/06/2025 08:15</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-green-800">Đường huyết</h3>
              <span className="text-green-500 text-sm font-semibold">Bình thường</span>
            </div>
            <p className="text-2xl font-bold mt-2">6.5 mmol/L</p>
            <p className="text-xs text-gray-500 mt-1">Cập nhật: 23/06/2025 08:15</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTab;
