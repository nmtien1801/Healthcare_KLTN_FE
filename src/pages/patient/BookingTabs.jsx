import React, { useState, useEffect } from "react";
import { Phone, Video, Calendar, Clock, MapPin, Star, CheckCircle, Shield, Award, ClockIcon as Clock24, MessageSquare, X, Bot, Send } from 'lucide-react';
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import ApiBooking from "../../apis/ApiBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Button = ({ children, className = "", variant = "primary", size = "md", onClick, disabled, ...props }) => {
  const baseClasses = "btn d-inline-flex align-items-center justify-content-center fw-medium transition-all border-0 shadow-sm";
  const variants = {
    primary: "btn-primary text-white",
    secondary: "btn-light text-dark border",
    success: "btn-success text-white",
    danger: "btn-danger text-white",
    warning: "btn-warning text-dark",
    info: "btn-info text-white",
    light: "btn-light text-dark",
    dark: "btn-dark text-white",
    outline: "btn-outline-primary",
    ghost: "btn-light text-muted border-0 shadow-none",
  };
  const sizes = {
    sm: "btn-sm px-2 py-1",
    md: "btn-md px-3 py-2",
    lg: "btn-lg px-4 py-3",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ borderRadius: "8px" }}
      {...props}
    >
      {children}
    </button>
  );
};

const upcomingAppointment = ({ handleStartCall }) => {
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.userInfo);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch appointments từ API
  useEffect(() => {
    const fetchAppointments = async () => {
      console.log("Fetching appointments...");
      try {
        setLoading(true);
        const response = await ApiBooking.getUpcomingAppointments();
        console.log("Appointments fetched:", response);

        // đảm bảo appointments luôn là array
        const data = Array.isArray(response)
          ? response
          : response?.appointments || response?.data || [];

        setAppointments(data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }

    };

    fetchAppointments();
  }, []);

  const handleToggleStatus = () => {
    setIsConfirmed((prev) => !prev);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : appointments.length - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < appointments.length - 1 ? prev + 1 : 0));
  };

  const currentAppointment = appointments[currentIndex];

  // Chat với bác sĩ
  const [showChatbot, setShowChatbot] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const senderId = user?.uid;
  const receiverId = "weHP9TWfdrZo5L9rmY81BRYxNXr2";
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      text: "Xin chào! Tôi là bác sĩ tư vấn của bạn. Bạn cần hỗ trợ gì?",
      sender: "doctor",
      timestamp: new Date(),
      isWelcome: true,
    },
  ]);

  const roomChats = [senderId, receiverId].sort().join('_');

  useEffect(() => {
    if (!senderId) return;

    const q = query(
      collection(db, 'chats', roomChats, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {

      const firebaseMessages = snapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          text: data.message || data.text || '', // Hỗ trợ cả 'message' và 'text'
          sender: data.senderId === senderId ? "patient" : "doctor",
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(), // Chuyển đổi Firestore timestamp
          originalData: data // Lưu trữ dữ liệu gốc để debug
        };
      });

      // Giữ lại tin nhắn chào mừng nếu không có tin nhắn từ Firebase
      if (firebaseMessages.length === 0) {
        setChatMessages(prev => prev.filter(msg => msg.isWelcome));
      } else {
        setChatMessages(firebaseMessages);
      }
    }, (error) => {
      console.error('Firebase listener error:', error);
    });

    return () => unsub();
  }, [senderId, roomChats]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    if (showChatbot && chatMessages.length > 0) {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [chatMessages, showChatbot]);

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    setIsSending(true);
    const userMessage = messageInput.trim();
    setMessageInput("");

    // Thêm tin nhắn vào UI ngay lập tức
    const tempMessage = {
      id: Date.now().toString(), // Tạo ID tạm thời
      text: userMessage,
      sender: "patient",
      timestamp: new Date(),
      isTemp: true // Đánh dấu là tin nhắn tạm thời
    };

    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      const docRef = await addDoc(collection(db, "chats", roomChats, "messages"), {
        senderId,
        receiverId,
        message: userMessage, // Sử dụng 'message' để nhất quán
        timestamp: serverTimestamp()
      });

      // Cập nhật tin nhắn tạm thời thành tin nhắn thật
      setChatMessages((prev) => prev.map(msg =>
        msg.isTemp && msg.text === userMessage
          ? { ...msg, id: docRef.id, isTemp: false }
          : msg
      ));

    } catch (err) {
      console.error('Error sending message:', err);
      // Xóa tin nhắn khỏi UI nếu gửi thất bại
      setChatMessages((prev) => prev.filter(msg => !msg.isTemp || msg.text !== userMessage));
      // Có thể thay thế bằng toast notification sau này
      console.error("Lỗi kết nối đến máy chủ:", err);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="container my-3">
      <div className="bg-white rounded shadow border p-4">
        <div>
          <div className="d-flex align-items-center mb-4">
            <Calendar className="text-primary me-2" size={24} />
            <h4 className="mb-0 fw-bold text-dark">Lịch hẹn sắp tới</h4>
          </div>

          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center text-muted">
              <p>Không có lịch hẹn sắp tới.</p>
            </div>
          )}

          {!loading && !error && currentAppointment && (
            <>
              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <button 
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 d-flex align-items-center"
                  onClick={handlePrev}
                  disabled={appointments.length <= 1}
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    borderColor: "#0ea5e9",
                    color: "#0ea5e9",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (appointments.length > 1) {
                      e.target.style.backgroundColor = "#0ea5e9";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateX(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (appointments.length > 1) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#0ea5e9";
                      e.target.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <span className="me-1">←</span> Trước
                </button>
                
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-pill px-3 py-2 text-white fw-semibold" style={{ fontSize: "14px" }}>
                    {currentIndex + 1} / {appointments.length}
                  </div>
                  {appointments.length > 1 && (
                    <div className="ms-3">
                      <div className="d-flex gap-1">
                        {appointments.map((_, index) => (
                          <div
                            key={index}
                            className={`rounded-circle ${index === currentIndex ? 'bg-primary' : 'bg-light'}`}
                            style={{
                              width: "8px",
                              height: "8px",
                              cursor: "pointer",
                              transition: "all 0.3s ease"
                            }}
                            onClick={() => setCurrentIndex(index)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 d-flex align-items-center"
                  onClick={handleNext}
                  disabled={appointments.length <= 1}
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    borderColor: "#0ea5e9",
                    color: "#0ea5e9",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    if (appointments.length > 1) {
                      e.target.style.backgroundColor = "#0ea5e9";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateX(2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (appointments.length > 1) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "#0ea5e9";
                      e.target.style.transform = "translateX(0)";
                    }
                  }}
                >
                  Sau <span className="ms-1">→</span>
                </button>
              </div>
              <div
                key={currentAppointment._id}
                className="card shadow-sm mb-4"
                style={{ backgroundColor: "#f0f2ff", border: "none", borderRadius: "16px" }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        <img
                          src={
                            currentAppointment.doctorId?.image ||
                            "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                          }
                          alt="Doctor Avatar"
                          className="rounded-circle"
                          style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <h5 className="mb-1 fw-bold text-dark">
                          {currentAppointment.doctorId?.name || "Bác sĩ Trần Thị B"}
                        </h5>
                        <p className="mb-0 text-muted">
                          {currentAppointment.doctorId?.specialty || "Chuyên khoa Nội tiết"}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end">
                      <span className="badge rounded-pill bg-success mb-2 px-3 py-2 d-flex align-items-center">
                        <span className="me-1" style={{ fontSize: "0.75rem" }}>
                          ●
                        </span>{" "}
                        Online
                      </span>
                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="p-2"
                          onClick={() => setShowChatbot(true)}
                          title="Nhắn tin"
                        >
                          <MessageSquare size={16} />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="p-2"
                          onClick={() =>
                            handleStartCall(
                              user,
                              {
                                uid: currentAppointment.doctorId?._id || "weHP9TWfdrZo5L9rmY81BRYxNXr2",
                                name: currentAppointment.doctorId?.name || "Bác sĩ Trần Thị B",
                                role: "doctor",
                              },
                              "patient"
                            )
                          }
                          title="Gọi điện"
                        >
                          <Phone size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <Calendar className="text-primary me-2" size={18} />
                      <span className="text-dark">
                        {new Date(currentAppointment.date).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <Clock className="text-primary me-2" size={18} />
                      <span className="text-dark">{currentAppointment.time}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <CheckCircle
                        className={currentAppointment.status === "pending" ? "text-warning me-2" : "text-success me-2"}
                        size={18}
                      />
                      <span
                        className={
                          currentAppointment.status === "pending" ? "text-warning fw-medium" : "text-success fw-medium"
                        }
                      >
                        {currentAppointment.status === "pending" ? "Chờ xác nhận" : "Đã xác nhận"}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm rounded-pill px-3 py-2 btn-outline-danger"
                      onClick={handleToggleStatus}
                    >
                      Hủy lịch
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="row g-3">
            <div className="col-4">
              <div className="text-center d-flex align-items-center justify-content-center gap-2">
                <div className="d-flex justify-content-center mb-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px", backgroundColor: "#e8f5e8" }}
                  >
                    <Shield className="text-success" size={20} />
                  </div>
                </div>
                <small className="text-dark fw-medium">Bảo mật 100%</small>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center d-flex align-items-center justify-content-center gap-2">
                <div className="d-flex justify-content-center mb-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px", backgroundColor: "#fff3cd" }}
                  >
                    <Award className="text-warning" size={20} />
                  </div>
                </div>
                <small className="text-dark fw-medium">Bác sĩ chuyên nghiệp</small>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center d-flex align-items-center justify-content-center gap-2">
                <div className="d-flex justify-content-center mb-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px", backgroundColor: "#cce7ff" }}
                  >
                    <Clock24 className="text-primary" size={20} />
                  </div>
                </div>
                <small className="text-dark fw-medium">Hỗ trợ 24/7</small>
              </div>
            </div>
          </div>
        </div>
        {/* Chatbot Popup */}
        {showChatbot && (
          <div className="position-fixed bottom-0 end-0 m-3 shadow-lg rounded-4 bg-white" style={{ width: 320, height: 450, zIndex: 9999 }}>
            <div className="bg-primary text-white d-flex justify-content-between align-items-center p-2 rounded-top-4">
              <div><Bot size={18} className="me-1" /> Chat với bác sĩ</div>
              <button onClick={() => setShowChatbot(false)} className="btn btn-sm btn-light text-dark rounded-circle"><X size={16} /></button>
            </div>

            <div className="p-2 chat-messages" style={{ height: 340, overflowY: "auto" }}>
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted mt-4">
                  <Bot size={24} className="mb-2" />
                  <div>Chưa có tin nhắn nào</div>
                  <small>Bắt đầu cuộc trò chuyện với bác sĩ</small>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={msg.id} className={`mb-2 ${msg.sender === "patient" ? "text-end" : "text-start"}`}>
                    <div className={`d-inline-block px-3 py-2 rounded-3 ${msg.sender === "patient" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                      {msg.text}
                    </div>
                    <div className={`small text-muted mt-1 ${msg.sender === "patient" ? "text-end" : "text-start"}`}>
                      {msg.timestamp && msg.timestamp instanceof Date ?
                        msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) :
                        (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '')
                      }
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-top d-flex p-3 align-items-center">
              <input
                type="text"
                className="form-control form-control-sm rounded-pill me-2"
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isSending && sendMessage()}
                disabled={isSending}
              />
              <button
                onClick={sendMessage}
                className="btn btn-sm btn-primary rounded-pill"
                disabled={isSending || !messageInput.trim()}
              >
                {isSending ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Đang gửi...</span>
                  </div>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BookingNew = ({ handleSubmit }) => {
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const timeSlots = {
    morning: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
    afternoon: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]
  };

  // Lấy bác sĩ theo ngày
  useEffect(() => {
    if (!selectedDate) return;

    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const response = await ApiBooking.getDoctorsByDate(selectedDate);
        // Chuẩn hóa data
        const data = Array.isArray(response)
          ? response
          : response?.data || [];
        setDoctors(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách bác sĩ:", err);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedDate]);

  return (
    <div className="container my-4">
      <div className="bg-white rounded-4 shadow-lg border-0 p-5" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)" }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)" }}>
            <Calendar size={28} className="text-white" />
          </div>
          <h2 className="h4 mb-2 fw-bold" style={{ color: "#2d3748" }}>🩺 Đặt lịch khám mới</h2>
          <p className="text-muted mb-0" style={{ fontSize: "16px" }}>
            Vui lòng điền đầy đủ thông tin để đặt lịch
          </p>
        </div>

        {/* Appointment Type */}
        <div className="mb-5">
          <label className="form-label fw-bold mb-3" style={{ color: "#2d3748", fontSize: "16px" }}>
            <span className="me-2">🏥</span>Loại hình khám
          </label>
          <div className="row g-3">
            <div className="col">
              <button
                className={`btn w-100 py-3 rounded-4 border-0 position-relative overflow-hidden ${appointmentType === "clinic"
                  ? "text-white"
                  : "text-dark"
                  }`}
                style={{
                  background: appointmentType === "clinic" 
                    ? "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)" 
                    : "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                  boxShadow: appointmentType === "clinic" 
                    ? "0 8px 25px rgba(13, 110, 253, 0.3)" 
                    : "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  border: appointmentType === "clinic" ? "none" : "2px solid #e2e8f0"
                }}
                onClick={() => setAppointmentType("clinic")}
                onMouseEnter={(e) => {
                  if (appointmentType !== "clinic") {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (appointmentType !== "clinic") {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                  }
                }}
              >
                <MapPin size={24} className="mb-2" />
                <div className="fw-semibold">Tại phòng khám</div>
                <small className="opacity-75">Khám trực tiếp tại bệnh viện</small>
                {appointmentType === "clinic" && (
                  <div className="position-absolute top-0 end-0 m-2">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>
                      <span className="text-primary fw-bold" style={{ fontSize: "12px" }}>✓</span>
                    </div>
                  </div>
                )}
              </button>
            </div>
            <div className="col">
              <button
                className={`btn w-100 py-3 rounded-4 border-0 position-relative overflow-hidden ${appointmentType === "online"
                  ? "text-white"
                  : "text-dark"
                  }`}
                style={{
                  background: appointmentType === "online" 
                    ? "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)" 
                    : "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
                  boxShadow: appointmentType === "online" 
                    ? "0 8px 25px rgba(13, 110, 253, 0.3)" 
                    : "0 4px 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  border: appointmentType === "online" ? "none" : "2px solid #e2e8f0"
                }}
                onClick={() => setAppointmentType("online")}
                onMouseEnter={(e) => {
                  if (appointmentType !== "online") {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (appointmentType !== "online") {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                  }
                }}
              >
                <Video size={24} className="mb-2" />
                <div className="fw-semibold">Khám trực tuyến</div>
                <small className="opacity-75">Tư vấn qua video call</small>
                {appointmentType === "online" && (
                  <div className="position-absolute top-0 end-0 m-2">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>
                      <span className="text-primary fw-bold" style={{ fontSize: "12px" }}>✓</span>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="mb-5">
          <label className="form-label fw-bold mb-3" style={{ color: "#2d3748", fontSize: "16px" }}>
            <span className="me-2">📅</span>Chọn ngày khám
          </label>
          <div className="position-relative">
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onChange={(date) => setSelectedDate(date.toISOString().split("T")[0])}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
              className="form-control form-control-lg rounded-4 border-2"
              placeholderText="📅 Chọn ngày khám"
              style={{
                borderColor: "#e2e8f0",
                fontSize: "14px",
                padding: "12px 16px",
                background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}
            />
            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
              <Calendar size={20} className="text-muted" />
            </div>
          </div>
        </div>


        {/* Doctor Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold mb-3" style={{ color: "#2d3748", fontSize: "16px" }}>
            <span className="me-2">👨‍⚕️</span>Chọn bác sĩ
          </label>
          {loadingDoctors ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <div className="text-muted">Đang tải danh sách bác sĩ...</div>
            </div>
          ) : doctors.length === 0 && selectedDate ? (
            <div className="text-center py-4">
              <div className="text-muted">
                <div className="mb-2">👨‍⚕️</div>
                Không có bác sĩ làm việc thời gian này.
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {doctors.map((doctor) => (
                <div className="col-md-6" key={doctor.id || doctor._id}>
                  <div
                    className={`card p-4 rounded-4 position-relative overflow-hidden ${selectedDoctor === (doctor.doctorId || doctor.id || doctor._id) 
                      ? "border-primary shadow-lg" 
                      : "border-0 shadow-sm"
                      }`}
                    onClick={() => setSelectedDoctor(doctor.doctorId || doctor.id || doctor._id)}
                    style={{ 
                      cursor: "pointer",
                      background: selectedDoctor === (doctor.doctorId || doctor.id || doctor._id)
                        ? "linear-gradient(135deg, #e7f1ff 0%, #f0f8ff 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      transition: "all 0.3s ease",
                      border: selectedDoctor === (doctor.doctorId || doctor.id || doctor._id) ? "2px solid #0d6efd" : "2px solid #e2e8f0"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDoctor !== (doctor.doctorId || doctor.id || doctor._id)) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDoctor !== (doctor.doctorId || doctor.id || doctor._id)) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                      }
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        <img
                          src={
                            doctor.avatar ||
                            "https://png.pngtree.com/png-clipart/20210310/original/pngtree-hospital-hotline-avatar-female-doctor-png-image_5951490.jpg"
                          }
                          alt={doctor.name}
                          className="rounded-circle"
                          style={{ 
                            width: 60, 
                            height: 60, 
                            objectFit: "cover",
                            border: "3px solid #e2e8f0"
                          }}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle" style={{ width: "16px", height: "16px", border: "2px solid white" }}>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold" style={{ color: "#2d3748" }}>{doctor.name}</h6>
                        <small className="text-muted d-block mb-1">
                          {doctor.hospital || "Bệnh viện chưa cập nhật"}
                        </small>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center text-warning">
                            <Star size={14} className="me-1" />
                            <small className="fw-semibold">4.9</small>
                          </div>
                          <small className="text-muted">•</small>
                          <small className="text-muted">{doctor.exp || "10"} năm KN</small>
                        </div>
                      </div>
                    </div>
                    {selectedDoctor === (doctor.doctorId || doctor.id || doctor._id) && (
                      <div className="position-absolute top-0 end-0 m-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>
                          <span className="text-white fw-bold" style={{ fontSize: "12px" }}>✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time */}
        <div className="mb-5">
          <label className="form-label fw-bold mb-3" style={{ color: "#2d3748", fontSize: "16px" }}>
            <span className="me-2">⏰</span>Chọn giờ khám
            {!selectedDoctor && (
              <small className="ms-2 text-muted">(Vui lòng chọn bác sĩ trước)</small>
            )}
          </label>
          {(() => {
            // Tạo tất cả các giờ từ 08:00 đến 16:30 (30 phút một lần)
            const allTimeSlots = [];
            for (let hour = 8; hour <= 16; hour++) {
              for (let minute = 0; minute < 60; minute += 30) {
                if (hour === 16 && minute > 30) break; // Dừng ở 16:30
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                allTimeSlots.push(timeString);
              }
            }
            
            // Lấy thông tin bác sĩ đã chọn (nếu có)
            const selectedDoctorData = selectedDoctor ? doctors.find(d => (d.id || d._id || d.doctorId) === selectedDoctor) : null;
            const doctorStartTime = selectedDoctorData?.shift?.start || "08:00";
            const doctorEndTime = selectedDoctorData?.shift?.end || "17:00";
            
            // Kiểm tra giờ nào nằm trong khung làm việc của bác sĩ đã chọn
            const isTimeInWorkingHours = (time) => {
              if (!selectedDoctor) return false; // Nếu chưa chọn bác sĩ thì không có giờ nào available
              return time >= doctorStartTime && time <= doctorEndTime;
            };

            // Phân chia giờ theo buổi
            const morningSlots = allTimeSlots.filter(time => time <= "12:00");
            const afternoonSlots = allTimeSlots.filter(time => time >= "12:30");

            return (
              <>
                {/* Buổi sáng */}
                {morningSlots.length > 0 && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" style={{ 
                        width: "32px", 
                        height: "32px", 
                        background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                      }}>
                        <span style={{ fontSize: "16px" }}>🌅</span>
                      </div>
                      <h6 className="mb-0 fw-bold" style={{ color: "#2d3748" }}>
                        Buổi sáng
                      </h6>
                      <div className="flex-grow-1"></div>
                      <small className="text-muted">
                        08:00 - 12:00
                      </small>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {morningSlots.map((time) => {
                        const isInWorkingHours = isTimeInWorkingHours(time);
                        const canSelect = selectedDoctor && isInWorkingHours;
                        return (
                          <button
                            key={time}
                            className={`btn py-2 px-3 rounded-4 position-relative overflow-hidden ${selectedTime === time
                              ? "text-white"
                              : canSelect ? "text-dark" : "text-muted"
                              }`}
                            onClick={() => canSelect && setSelectedTime(time)}
                            disabled={!canSelect}
                            style={{
                              background: selectedTime === time 
                                ? "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)" 
                                : canSelect 
                                  ? "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
                                  : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                              boxShadow: selectedTime === time 
                                ? "0 4px 15px rgba(13, 110, 253, 0.3)" 
                                : "0 2px 6px rgba(0,0,0,0.08)",
                              transition: "all 0.3s ease",
                              border: selectedTime === time ? "none" : "2px solid #e2e8f0",
                              fontSize: "13px",
                              fontWeight: "600",
                              minWidth: "70px",
                              opacity: canSelect ? 1 : 0.4,
                              cursor: canSelect ? "pointer" : "not-allowed"
                            }}
                            onMouseEnter={(e) => {
                              if (selectedTime !== time && canSelect) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedTime !== time && canSelect) {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                              }
                            }}
                          >
                            <Clock size={12} className="me-1" />
                            {time}
                            {selectedTime === time && (
                              <div className="position-absolute top-0 end-0 m-1">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "16px", height: "16px" }}>
                                  <span className="text-primary fw-bold" style={{ fontSize: "8px" }}>✓</span>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Buổi chiều */}
                {afternoonSlots.length > 0 && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" style={{ 
                        width: "32px", 
                        height: "32px", 
                        background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                      }}>
                        <span style={{ fontSize: "16px" }}>🌙</span>
                      </div>
                      <h6 className="mb-0 fw-bold" style={{ color: "#2d3748" }}>
                        Buổi chiều
                      </h6>
                      <div className="flex-grow-1"></div>
                      <small className="text-muted">
                        12:30 - 16:30
                      </small>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {afternoonSlots.map((time) => {
                        const isInWorkingHours = isTimeInWorkingHours(time);
                        const canSelect = selectedDoctor && isInWorkingHours;
                        return (
                          <button
                            key={time}
                            className={`btn py-2 px-3 rounded-4 position-relative overflow-hidden ${selectedTime === time
                              ? "text-white"
                              : canSelect ? "text-dark" : "text-muted"
                              }`}
                            onClick={() => canSelect && setSelectedTime(time)}
                            disabled={!canSelect}
                            style={{
                              background: selectedTime === time 
                                ? "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)" 
                                : canSelect 
                                  ? "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)"
                                  : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                              boxShadow: selectedTime === time 
                                ? "0 4px 15px rgba(13, 110, 253, 0.3)" 
                                : "0 2px 6px rgba(0,0,0,0.08)",
                              transition: "all 0.3s ease",
                              border: selectedTime === time ? "none" : "2px solid #e2e8f0",
                              fontSize: "13px",
                              fontWeight: "600",
                              minWidth: "70px",
                              opacity: canSelect ? 1 : 0.4,
                              cursor: canSelect ? "pointer" : "not-allowed"
                            }}
                            onMouseEnter={(e) => {
                              if (selectedTime !== time && canSelect) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedTime !== time && canSelect) {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                              }
                            }}
                          >
                            <Clock size={12} className="me-1" />
                            {time}
                            {selectedTime === time && (
                              <div className="position-absolute top-0 end-0 m-1">
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "16px", height: "16px" }}>
                                  <span className="text-primary fw-bold" style={{ fontSize: "8px" }}>✓</span>
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Reason */}
        <div className="mb-5">
          <label className="form-label fw-bold mb-3" style={{ color: "#2d3748", fontSize: "16px" }}>
            <span className="me-2">📝</span>Lý do khám
          </label>
          <textarea
            className="form-control form-control-lg rounded-4 border-2"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="📝 Mô tả ngắn gọn lý do bạn muốn khám..."
            style={{
              borderColor: "#e2e8f0",
              fontSize: "16px",
              padding: "16px",
              background: "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              resize: "none"
            }}
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            className="btn btn-lg w-100 py-4 fw-bold rounded-4 border-0 position-relative overflow-hidden"
            onClick={() =>
              handleSubmit({
                type: appointmentType,
                doctor: selectedDoctor,
                date: selectedDate,
                time: selectedTime,
                reason,
              })
            }
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
              color: "white",
              boxShadow: "0 8px 30px rgba(13, 110, 253, 0.4)",
              fontSize: "18px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 40px rgba(13, 110, 253, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 30px rgba(13, 110, 253, 0.4)";
            }}
          >
            <span className="me-2">✅</span>
            Xác nhận đặt lịch khám
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              transform: "translateX(-100%)",
              transition: "transform 0.6s ease"
            }}></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingTabs = ({ handleStartCall }) => {
  const [selectedTime, setSelectedTime] = useState("09:30")
  const [appointmentType, setAppointmentType] = useState("clinic")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("tran-thi-b")
  const [reason, setReason] = useState("")

  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"]

  const doctors = [
    {
      id: "tran-thi-b",
      name: "Bác sĩ Trần Thị B",
      specialty: "Chuyên khoa Nội tiết",
      experience: "15 năm kinh nghiệm",
      rating: 4.9,
      patients: "2,500+",
      image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "nguyen-van-a",
      name: "Bác sĩ Nguyễn Văn A",
      specialty: "Chuyên khoa Tim mạch",
      experience: "12 năm kinh nghiệm",
      rating: 4.8,
      patients: "1,800+",
      image: "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
    },
    {
      id: "le-thi-c",
      name: "Bác sĩ Lê Thị C",
      specialty: "Chuyên khoa Da liễu",
      experience: "10 năm kinh nghiệm",
      rating: 4.9,
      patients: "2,200+",
      image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
    }
  ]

  const handleSubmit = () => {
    console.log("Booking appointment:", {
      type: appointmentType,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason
    })
  }

  return (
    <div >
      {upcomingAppointment(handleStartCall)}
      {BookingNew(doctors, timeSlots, handleSubmit)}
    </div>
  );
};

export default BookingTabs;
