import React, { useEffect, useRef, useState } from "react";

const AppointmentTab = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Chào bác sĩ, tôi đang gặp vấn đề về huyết áp", sender: "patient", time: "09:15" },
    { text: "Chào anh Bình, anh có thể cho tôi biết chỉ số huyết áp gần đây của anh không?", sender: "doctor", time: "09:16" },
    { text: "Hôm qua đo được 160/95, tôi đã uống thuốc như bác sĩ kê đơn", sender: "patient", time: "09:18" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const appointments = [
    {
      id: 1,
      patient: {
        name: "Trần Văn Bình",
        age: 68,
        image: "https://readdy.ai/api/search-image?query=elderly%20asian%20man%20portrait%2C%2070%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient1&orientation=squarish",
        condition: "Tăng huyết áp, Tiểu đường type 2"
      },
      date: "23/06/2025",
      time: "09:30",
      status: "confirmed",
      type: "Tái khám",
      notes: "Kiểm tra huyết áp và đường huyết"
    },
    {
      id: 2,
      patient: {
        name: "Nguyễn Thị Mai",
        age: 52,
        image: "https://readdy.ai/api/search-image?query=middle%20aged%20asian%20woman%20portrait%2C%2050%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient2&orientation=squarish",
        condition: "Tiểu đường type 2"
      },
      date: "23/06/2025",
      time: "10:45",
      status: "confirmed",
      type: "Tái khám",
      notes: "Kiểm tra đường huyết, điều chỉnh liều insulin"
    },
    {
      id: 3,
      patient: {
        name: "Lê Minh Tuấn",
        age: 35,
        image: "https://readdy.ai/api/search-image?query=young%20asian%20man%20portrait%2C%2030%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient3&orientation=squarish",
        condition: "Viêm phổi"
      },
      date: "23/06/2025",
      time: "14:00",
      status: "pending",
      type: "Tái khám",
      notes: "Kiểm tra tình trạng phổi, đánh giá hiệu quả điều trị"
    },
    {
      id: 4,
      patient: {
        name: "Phạm Thị Hương",
        age: 72,
        image: "https://readdy.ai/api/search-image?query=elderly%20asian%20woman%20portrait%2C%2075%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient4&orientation=squarish",
        condition: "Suy tim, Tăng huyết áp"
      },
      date: "24/06/2025",
      time: "08:15",
      status: "confirmed",
      type: "Tái khám",
      notes: "Đánh giá chức năng tim, điều chỉnh thuốc"
    },
    {
      id: 5,
      patient: {
        name: "Đỗ Thanh Hà",
        age: 45,
        image: "https://readdy.ai/api/search-image?query=middle%20aged%20asian%20woman%20portrait%2C%2045%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient5&orientation=squarish",
        condition: "Viêm khớp dạng thấp"
      },
      date: "24/06/2025",
      time: "11:30",
      status: "confirmed",
      type: "Khám mới",
      notes: "Đau khớp gối và cổ tay, nghi ngờ viêm khớp dạng thấp"
    }
  ];

  // const formatDate = (date: Date): string => {
  //   const options: Intl.DateTimeFormatOptions = {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   };
  //   return date.toLocaleDateString('vi-VN', options);
  // };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setChatMessages([
        ...chatMessages,
        {
          text: newMessage,
          sender: 'doctor',
          time: timeString
        }
      ]);
      setNewMessage("");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lịch hẹn khám bệnh</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center !rounded-button">
          <i className="fas fa-plus mr-2"></i>
          Tạo lịch hẹn mới
        </button>
      </div>

      {/* Date selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <button className="p-2 rounded-full hover:bg-gray-100 mr-4 cursor-pointer !rounded-button">
              <i className="fas fa-chevron-left text-gray-600"></i>
            </button>
            <h2 className="text-lg font-medium">Thứ Hai, 23 tháng 6, 2025</h2>
            <button className="p-2 rounded-full hover:bg-gray-100 ml-4 cursor-pointer !rounded-button">
              <i className="fas fa-chevron-right text-gray-600"></i>
            </button>
          </div>
          <div className="flex">
            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md mr-2 !rounded-button">Hôm nay</button>
            <button className="px-3 py-1 text-sm text-gray-600 rounded-md !rounded-button">Tuần này</button>
          </div>
        </div>
      </div>

      {/* Appointment list */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Lịch hẹn hôm nay (3)</h3>
            <div className="relative">
              <input
                type="text"
                className="pl-8 pr-4 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Tìm kiếm lịch hẹn..."
              />
              <div className="absolute left-2 top-1.5 text-gray-400">
                <i className="fas fa-search text-sm"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {appointments.filter(app => app.date === "23/06/2025").map((appointment) => (
            <div
              key={appointment.id}
              className={`p-4 hover:bg-blue-50 transition-colors ${selectedAppointment === appointment.id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedAppointment(appointment.id)}
            >
              <div className="flex justify-between">
                <div className="flex items-start">
                  <img
                    src={appointment.patient.image}
                    alt={appointment.patient.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium">{appointment.patient.name}</h4>
                    <p className="text-sm text-gray-500">{appointment.patient.age} tuổi - {appointment.patient.condition}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600 mr-4">
                        <i className="far fa-clock mr-1"></i> {appointment.time}
                      </span>
                      <span className="text-sm text-gray-600">
                        <i className="far fa-calendar-alt mr-1"></i> {appointment.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  <div className="mt-2 flex">
                    <button
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 mr-1 cursor-pointer !rounded-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChatModal(true);
                      }}
                    >
                      <i className="fas fa-comment-medical"></i>
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 mr-1 cursor-pointer !rounded-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCallModal(true);
                      }}
                    >
                      <i className="fas fa-phone-alt"></i>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 cursor-pointer !rounded-button">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              </div>
              {selectedAppointment === appointment.id && (
                <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-sm mb-2">Ghi chú</h5>
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm mr-2 !rounded-button">
                      Hủy lịch hẹn
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm !rounded-button">
                      Xác nhận đã khám
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-medium">Lịch hẹn sắp tới</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {appointments.filter(app => app.date === "24/06/2025").map((appointment) => (
            <div key={appointment.id} className="p-4 hover:bg-blue-50 transition-colors">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <img
                    src={appointment.patient.image}
                    alt={appointment.patient.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium">{appointment.patient.name}</h4>
                    <p className="text-sm text-gray-500">{appointment.patient.age} tuổi - {appointment.patient.condition}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600 mr-4">
                        <i className="far fa-clock mr-1"></i> {appointment.time}
                      </span>
                      <span className="text-sm text-gray-600 mr-4">
                        <i className="far fa-calendar-alt mr-1"></i> {appointment.date}
                      </span>
                      <span className="text-sm text-gray-600">
                        <i className="fas fa-tag mr-1"></i> {appointment.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                  <div className="mt-2 flex">
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 mr-1 cursor-pointer !rounded-button">
                      <i className="fas fa-comment-medical"></i>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 mr-1 cursor-pointer !rounded-button">
                      <i className="fas fa-phone-alt"></i>
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 cursor-pointer !rounded-button">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src="https://readdy.ai/api/search-image?query=elderly%20asian%20man%20portrait%2C%2070%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=40&height=40&seq=patient1&orientation=squarish"
                  alt="Bệnh nhân"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium">Trần Văn Bình</h3>
                  <p className="text-xs text-green-500">Đang trực tuyến</p>
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer !rounded-button"
                onClick={() => setShowChatModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'patient' && (
                      <img
                        src="https://readdy.ai/api/search-image?query=elderly%20asian%20man%20portrait%2C%2070%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=30&height=30&seq=patient1&orientation=squarish"
                        alt="Bệnh nhân"
                        className="w-8 h-8 rounded-full mr-2 self-end"
                      />
                    )}
                    <div>
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === 'doctor'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                          }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                    </div>
                    {message.sender === 'doctor' && (
                      <img
                        src="https://readdy.ai/api/search-image?query=professional%20male%20doctor%20portrait%2C%20asian%20doctor%2C%20wearing%20white%20coat%2C%20stethoscope%2C%20friendly%20smile%2C%20high%20quality%2C%20studio%20lighting%2C%20medical%20professional%2C%20isolated%20on%20light%20blue%20background%2C%20centered%20composition&width=30&height=30&seq=doctor1&orientation=squarish"
                        alt="Bác sĩ"
                        className="w-8 h-8 rounded-full ml-2 self-end"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100 mr-2 cursor-pointer !rounded-button">
                  <i className="fas fa-paperclip"></i>
                </button>
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="bg-blue-600 text-white p-2 rounded-full ml-2 cursor-pointer !rounded-button"
                  onClick={handleSendMessage}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <img
              src="https://readdy.ai/api/search-image?query=elderly%20asian%20man%20portrait%2C%2070%20years%20old%2C%20natural%20lighting%2C%20neutral%20expression%2C%20high%20quality%2C%20detailed%20face%2C%20indoor%20setting%2C%20centered%20composition&width=120&height=120&seq=patient1&orientation=squarish"
              alt="Bệnh nhân"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">Trần Văn Bình</h3>
            <p className="text-gray-500 mb-6">Đang gọi...</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-red-600 text-white p-4 rounded-full cursor-pointer !rounded-button" onClick={() => setShowCallModal(false)}>
                <i className="fas fa-phone-slash text-xl"></i>
              </button>
              <button className="bg-green-600 text-white p-4 rounded-full cursor-pointer !rounded-button">
                <i className="fas fa-phone-alt text-xl"></i>
              </button>
              <button className="bg-blue-600 text-white p-4 rounded-full cursor-pointer !rounded-button">
                <i className="fas fa-video text-xl"></i>
              </button>
            </div>
            <div className="mt-6">
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer !rounded-button"
                onClick={() => setShowCallModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentTab;
