import React, { useState, useEffect, useCallback } from "react";
import { Phone, Video, Calendar, Clock, MapPin, Star, CheckCircle, Shield, Award, ClockIcon as Clock24, MessageSquare, X, Bot, Send, Trash2, CheckCircle2 } from 'lucide-react';
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import ApiBooking from "../../apis/ApiBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { sendStatus } from "../../utils/SetupSignFireBase";

// CSS cho phân trang
const paginationStyles = `
  .pagination-btn:hover {
    background-color: #0d6efd !important;
    color: white !important;
    border-color: #0d6efd !important;
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = paginationStyles;
  document.head.appendChild(style);
}


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

// Modal Component
const Modal = ({ show, onClose, title, children, type = "info" }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={48} className="text-success mb-3" />;
      case "danger":
        return <Trash2 size={48} className="text-danger mb-3" />;
      case "warning":
        return <Clock size={48} className="text-warning mb-3" />;
      default:
        return <Calendar size={48} className="text-primary mb-3" />;
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center py-4">
            {getIcon()}
            <h4 className="modal-title mb-3">{title}</h4>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const UpcomingAppointment = ({ handleStartCall, refreshTrigger, onNewAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelErrorModal, setShowCancelErrorModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelErrorMessage, setCancelErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [refreshTrigger]);

  useEffect(() => {
    if (onNewAppointment) {
      setAppointments((prev) => {
        // Kiểm tra tránh trùng lặp
        const exists = prev.some(appt => appt._id === onNewAppointment._id);
        if (!exists) {
          return [...prev, onNewAppointment];
        }
        return prev;
      });
    }
  }, [onNewAppointment]);

  // Pagination functions
  const itemsPerPage = 2;
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, endIndex);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Hủy lịch hẹn
  const handleCancelBooking = (appointmentId) => {
    setAppointmentToCancel(appointmentId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    if (!appointmentToCancel) return;

    try {
      setCancelling(true);
      await ApiBooking.cancelBooking(appointmentToCancel);

      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== appointmentToCancel)
      );

      // Reset page nếu trang hiện tại không còn lịch hẹn nào
      const remainingAppointments = appointments.filter((appt) => appt._id !== appointmentToCancel);
      const newTotalPages = Math.ceil(remainingAppointments.length / itemsPerPage);
      if (currentPage >= newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages - 1);
      }

      // gửi tín hiệu trạng thái hủy lịch tới bác sĩ qua Firestore
      await sendStatus(user?.uid, receiverId, "Hủy lịch");

      setShowCancelModal(false);
      setAppointmentToCancel(null);
    } catch (err) {
      console.error("Lỗi khi hủy lịch:", err);
      const errorMsg = err.response?.data?.message || err.message || "Không thể hủy lịch. Vui lòng thử lại sau.";
      setCancelErrorMessage(errorMsg);
      setShowCancelErrorModal(true);
    } finally {
      setCancelling(false);
    }
  };

  // chat với bác sĩ
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
      isWelcome: true
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
    <div className="container">
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


          {!loading && !error && appointments.length === 0 && (
            <div className="text-center text-muted">
              <p>Không có lịch hẹn sắp tới.</p>
            </div>
          )}

          {!loading && !error && currentAppointments.length > 0 && (
            <>
              {currentAppointments.map((appointment, index) => (
                <div
                  key={appointment._id || appointment.id || index}
                  className="card shadow-sm mb-3"
                  style={{ backgroundColor: "#f0f2ff", border: "none", borderRadius: "16px" }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                          <img
                            src={
                              appointment.doctorId?.userId.avatar ||
                              "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                            }
                            alt="Doctor Avatar"
                            className="rounded-circle"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <h5 className="mb-1 fw-bold text-dark">
                            {appointment.doctorId?.userId.username || "Bác sĩ Trần Thị B"}
                          </h5>
                          <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                            {appointment.doctorId?.hospital || "Chuyên khoa Nội tiết"}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <span className="badge rounded-pill bg-success mb-2 px-2 py-1 d-flex align-items-center" style={{ fontSize: "10px" }}>
                          <span className="me-1" style={{ fontSize: "0.6rem" }}>
                            ●
                          </span>{" "}
                          Online
                        </span>
                        <div className="d-flex gap-1">
                          <Button
                            variant="primary"
                            size="sm"
                            className="p-1"
                            onClick={() => setShowChatbot(true)}
                            title="Nhắn tin"
                            style={{ minWidth: "32px", height: "32px" }}
                          >
                            <MessageSquare size={12} />
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="p-1"
                            onClick={() =>
                              handleStartCall(
                                user,
                                {
                                  uid: "weHP9TWfdrZo5L9rmY81BRYxNXr2",
                                  name: appointment.doctorId?.name || "Bác sĩ Trần Thị B",
                                  role: "doctor",
                                },
                                "patient"
                              )
                            }
                            title="Gọi điện"
                            style={{ minWidth: "32px", height: "32px" }}
                          >
                            <Phone size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-1">
                        <Calendar className="text-primary me-2" size={14} />
                        <span className="text-dark" style={{ fontSize: "13px" }}>
                          {new Date(appointment.date).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Clock className="text-primary me-2" size={14} />
                        <span className="text-dark" style={{ fontSize: "13px" }}>{appointment.time}</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <CheckCircle
                          className={appointment.status === "pending" ? "text-warning me-2" : "text-success me-2"}
                          size={14}
                        />
                        <span
                          className={
                            appointment.status === "pending" ? "text-warning fw-medium" : "text-success fw-medium"
                          }
                          style={{ fontSize: "12px" }}
                        >
                          {appointment.status === "pending" ? "Chờ xác nhận" : "Đã xác nhận"}
                        </span>
                      </div>
                      <button
                        className="btn btn-sm rounded-pill px-3 py-1 btn-outline-danger"
                        onClick={() => handleCancelBooking(appointment._id || appointment.id)}
                        disabled={cancelling}
                      >
                        {cancelling ? "Đang hủy..." : "Hủy"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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

        {/* Pagination cho lịch hẹn sắp tới */}
        {!loading && !error && appointments.length > 2 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-primary btn-sm px-3 py-2 d-flex align-items-center pagination-btn"
              onClick={handlePrev}
              disabled={appointments.length <= 2}
            >
              <span className="me-1">←</span> Trước
            </button>

            <div className="d-flex align-items-center">
              <div className="bg-primary px-3 py-2 text-white fw-semibold" style={{ fontSize: "14px", borderRadius: "5px" }}>
                {currentPage + 1} / {totalPages}
              </div>
            </div>

            <button
              className="btn btn-outline-primary btn-sm px-3 py-2 d-flex align-items-center pagination-btn"
              onClick={handleNext}
              disabled={appointments.length <= 2}
              style={{ borderRadius: "5px" }}
            >
              Sau <span className="ms-1">→</span>
            </button>
          </div>
        )}

        {/* Hiển thị số lượng lịch hẹn khi không có pagination */}
        {!loading && !error && appointments.length > 0 && appointments.length <= 2 && (
          <div className="text-center mt-3">
            <small className="text-muted">
              Hiển thị {appointments.length} lịch hẹn sắp tới
            </small>
          </div>
        )}

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

        {/* Cancel Confirmation Modal */}
        <Modal
          show={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Xác nhận hủy lịch hẹn"
          type="danger"
        >
          <p className="mb-4">Bạn có chắc chắn muốn hủy lịch hẹn này không?</p>
          <div className="d-flex gap-2 justify-content-center">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
            >
              Hủy
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmCancelBooking}
              disabled={cancelling}
            >
              {cancelling ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Đang hủy...</span>
                  </div>
                  Đang hủy...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </button>
          </div>
        </Modal>

        {/* Cancel Error Modal */}
        <Modal
          show={showCancelErrorModal}
          onClose={() => setShowCancelErrorModal(false)}
          title="Lỗi hủy lịch hẹn"
          type="danger"
        >
          <p className="mb-4">{cancelErrorMessage}</p>
          <button
            className="btn btn-danger"
            onClick={() => setShowCancelErrorModal(false)}
          >
            Đóng
          </button>
        </Modal>

        {/* General Error Modal */}
        <Modal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Lỗi"
          type="danger"
        >
          <p className="mb-4">{errorMessage}</p>
          <button
            className="btn btn-danger"
            onClick={() => setShowErrorModal(false)}
          >
            Đóng
          </button>
        </Modal>
      </div>
    </div>
  );
};

const BookingNew = ({ handleSubmit }) => {
  const [appointmentType, setAppointmentType] = useState("onsite");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Mặc định chọn ngày hiện tại
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const user = useSelector((state) => state.auth.userInfo);


  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
        setErrorMessage("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
        setShowErrorModal(true);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedDate]);

  const onSubmit = useCallback(async () => {
    console.log("onSubmit called");

    // Kiểm tra các trường bắt buộc
    if (!user?.uid) {
      console.log("Error: User not logged in", user); // Log thông tin user
      setErrorMessage("Vui lòng đăng nhập để đặt lịch.");
      setShowErrorModal(true);
      return;
    }
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      console.log("Error: Missing required fields", {
        selectedDoctor,
        selectedDate,
        selectedTime,
        reason
      }); // Log các trường bắt buộc
      setErrorMessage("Vui lòng chọn bác sĩ, ngày, giờ khám và nhập lý do khám.");
      setShowErrorModal(true);
      return;
    }

    // Kiểm tra ngày hợp lệ (cho phép chọn ngày hiện tại)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    if (selected < today) {
      console.log("Error: Invalid date", { selectedDate, today }); // Log ngày
      setErrorMessage("Không thể chọn ngày trong quá khứ.");
      setShowErrorModal(true);
      return;
    }

    // Kiểm tra thời gian trong khung giờ làm việc của bác sĩ
    const selectedDoctorData = doctors.find(d => (d.id || d._id || d.doctorId) === selectedDoctor);
    if (!selectedDoctorData) {
      console.log("Error: Invalid doctor", { selectedDoctor, doctors }); // Log bác sĩ
      setErrorMessage("Bác sĩ không hợp lệ. Vui lòng chọn lại.");
      setShowErrorModal(true);
      return;
    }
    const doctorStartTime = selectedDoctorData?.shift?.start || "08:00";
    const doctorEndTime = selectedDoctorData?.shift?.end || "17:00";
    if (selectedTime < doctorStartTime || selectedTime > doctorEndTime) {
      console.log("Error: Invalid time", { selectedTime, doctorStartTime, doctorEndTime }); // Log thời gian
      setErrorMessage("Thời gian chọn không nằm trong khung giờ làm việc của bác sĩ.");
      setShowErrorModal(true);
      return;
    }

    try {
      const payload = {
        firebaseUid: user.uid,
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        reason: reason.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString() // Thêm thời gian tạo để theo dõi
      };

      const response = await ApiBooking.bookAppointment(payload);

      const newAppointment = {
        _id: response._id || response.id || Date.now().toString(), // Đảm bảo có _id
        doctorId: {
          _id: selectedDoctor,
          name: selectedDoctorData.name,
          specialty: selectedDoctorData.specialty || "Chuyên khoa Nội tiết",
          image: selectedDoctorData.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
        },
        date: selectedDate,
        time: selectedTime,
        status: response.status || "pending" // Mặc định là pending nếu API không trả về status
      };

      const successMsg = `Đặt lịch khám thành công với bác sĩ ${selectedDoctorData.name} vào ${selectedTime} ngày ${new Date(selectedDate).toLocaleDateString("vi-VN")}!`;
       // gửi tín hiệu trạng thái đặt lịch tới bác sĩ qua Firestore
       await sendStatus(user?.uid, receiverId, "Đặt lịch");
      setSuccessMessage(successMsg);
      setShowSuccessModal(true);

      // Reset form (giữ nguyên ngày hiện tại)
      setSelectedDoctor(null);
      // Giữ nguyên ngày hiện tại, không reset
      setSelectedTime("");
      setReason("");
      setNotes("");
      setAppointmentType("onsite");

      // Gọi handleSubmit từ props
      handleSubmit(newAppointment);

    } catch (err) {
      console.error("Lỗi khi đặt lịch:", err);
      // SỬA: Thông báo lỗi chi tiết hơn bằng modal
      const errorMsg = err.response?.data?.message || err.message || "Không thể đặt lịch. Vui lòng kiểm tra kết nối và thử lại.";
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
    } finally {
      setLoadingSubmit(false);
    }
  }, [user, selectedDoctor, selectedDate, selectedTime, reason, notes, appointmentType, doctors, handleSubmit]);

  return (
    <div className="container">
      <div className="bg-white rounded shadow border p-4">
        <div className="text-center mb-4">
          <h2 className="h4 mb-2 fw-bold text-dark">🩺 Đặt lịch khám mới</h2>
          <p className="text-muted mb-0">
            Vui lòng điền đầy đủ thông tin để đặt lịch
          </p>
        </div>

        {/* Hiển thị thông báo lỗi hoặc thành công */}
        {/* Appointment Type */}
        <div className="mb-4">
          <label className="form-label fw-bold mb-3">
            Loại hình khám
          </label>
          <div className="row g-2">
            <div className="col-6">
              <button
                className={`btn w-100 py-2 border fs-6 ${appointmentType === "onsite" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setAppointmentType("onsite")}
              >
                <MapPin size={16} className="me-2" />
                Tại phòng khám
              </button>
            </div>
            <div className="col-6">
              <button
                className={`btn w-100 py-2 border fs-6 ${appointmentType === "online" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setAppointmentType("online")}
              >
                <Video size={16} className="me-2" />
                Khám trực tuyến
              </button>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <div className="row align-items-center">
            <div className="col-md-auto pe-2">
              <label className="form-label fw-bold mb-0 d-flex align-items-center">
                <Calendar size={20} className="me-2 text-primary" />
                Chọn ngày khám
              </label>
            </div>
            <div className="col-md ps-2">
              <div className="position-relative">
                <DatePicker
                  selected={selectedDate ? new Date(selectedDate + 'T00:00:00') : null}
                  onChange={(date) => {
                    if (date) {
                      // Format trực tiếp để tránh timezone issues
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      setSelectedDate(`${year}-${month}-${day}`);
                    } else {
                      setSelectedDate("");
                    }
                  }}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="DD/MM/YYYY"
                  showPopperArrow={false}
                  autoComplete="off"
                  style={{ fontSize: "18px", height: "40px" }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Doctor Selection */}
        <div className="mb-4">
          <label className="form-label fw-bold mb-2">
            Chọn bác sĩ
          </label>
          {loadingDoctors ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <div className="text-muted">Đang tải danh sách bác sĩ...</div>
            </div>
          ) : doctors.length === 0 && selectedDate ? (
            <div className="text-center py-3">
              <div className="text-muted">Không có bác sĩ làm việc thời gian này.</div>
            </div>
          ) : (
            <div className="row g-2">
              {doctors.map((doctor) => (
                <div className="col-md-6" key={doctor.id || doctor._id}>
                  <div
                    className={`card p-3 border ${selectedDoctor === (doctor.doctorId || doctor.id || doctor._id)
                      ? "border-primary"
                      : ""
                      }`}
                    onClick={() => setSelectedDoctor(doctor.doctorId || doctor.id || doctor._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          doctor.avatar ||
                          "https://png.pngtree.com/png-clipart/20210310/original/pngtree-hospital-hotline-avatar-female-doctor-png-image_5951490.jpg"
                        }
                        alt={doctor.name}
                        className="rounded-circle me-3"
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover"
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold">{doctor.name}</h6>
                        <small className="text-muted d-block mb-1">
                          {doctor.hospital || "Bệnh viện chưa cập nhật"}
                        </small>
                        <div className="d-flex align-items-center gap-2">
                          <div className="d-flex align-items-center text-warning">
                            <Star size={12} className="me-1" />
                            <small>4.9</small>
                          </div>
                          <small className="text-muted">•</small>
                          <small className="text-muted">{doctor.exp || "10"} năm KN</small>
                        </div>
                      </div>
                      {selectedDoctor === (doctor.doctorId || doctor.id || doctor._id) && (
                        <div className="text-primary">
                          <CheckCircle size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time */}
        <div className="mb-4">
          <label className="form-label fw-bold mb-2">
            Chọn giờ khám
            {!selectedDoctor && (
              <small className="ms-2 text-muted">(Vui lòng chọn bác sĩ trước)</small>
            )}
          </label>
          {(() => {
            // Tạo tất cả các giờ từ 08:00 đến 16:30 (30 phút một lần)
            const allTimeSlots = [];
            for (let hour = 8; hour <= 16; hour++) {
              for (let minute = 0; minute < 60; minute += 30) {
                if (hour === 16 && minute > 30) break;
                const timeString = `${hour.toString().padStart(2, "0")}:${minute
                  .toString()
                  .padStart(2, "0")}`;
                allTimeSlots.push(timeString);
              }
            }

            // Lấy thông tin bác sĩ đã chọn (nếu có)
            const selectedDoctorData = selectedDoctor
              ? doctors.find(
                (d) => (d.id || d._id || d.doctorId) === selectedDoctor
              )
              : null;
            const doctorStartTime = selectedDoctorData?.shift?.start || "08:00";
            const doctorEndTime = selectedDoctorData?.shift?.end || "17:00";

            // Kiểm tra giờ nào nằm trong khung làm việc của bác sĩ đã chọn
            const isTimeInWorkingHours = (time) => {
              if (!selectedDoctor) return false;
              return time >= doctorStartTime && time <= doctorEndTime;
            };

            return (
              <div className="d-flex flex-wrap gap-2">
                {allTimeSlots.map((time) => {
                  const isInWorkingHours = isTimeInWorkingHours(time);
                  const canSelect = selectedDoctor && isInWorkingHours;

                  // kiểm tra nút đang được chọn
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      onClick={() => canSelect && setSelectedTime(time)}
                      disabled={!canSelect}
                      style={{
                        minWidth: "120px",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: canSelect ? "pointer" : "not-allowed",
                        fontWeight: "500",
                        color: isSelected ? "white" : "black",
                        background: isSelected
                          ? "linear-gradient(135deg, #4fc9feff 0%, #ff66f0ff 100%)" // gradient khi chọn
                          : canSelect
                            ? "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" // nền xám nhạt đẹp
                            : "#f0f0f0", // disabled
                        opacity: canSelect ? 1 : 0.5,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            );

          })()}
        </div>


        {/* Reason */}
        <div className="mb-4">
          <label className="form-label fw-bold mb-2">
            Lý do khám
          </label>
          <textarea
            className="form-control"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Mô tả ngắn gọn lý do bạn muốn khám..."
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            className="btn btn-primary px-4"
            style={{ fontSize: "14px", padding: "12px 24px" }}
            onClick={onSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Đang xử lý...</span>
              </div>
            ) : (
              <CheckCircle size={16} className="me-2" />
            )}
            {loadingSubmit ? "Đang đặt lịch..." : "Xác nhận đặt lịch khám"}
          </button>
        </div>



        {/* Success Modal */}
        <Modal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Đặt lịch thành công!"
          type="success"
        >
          <p className="mb-4">{successMessage}</p>
          <button
            className="btn btn-success"
            onClick={() => setShowSuccessModal(false)}
          >
            Đóng
          </button>
        </Modal>

        {/* Error Modal */}
        <Modal
          show={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          title="Lỗi đặt lịch hẹn"
          type="danger"
        >
          <p className="mb-4">{errorMessage}</p>
          <button
            className="btn btn-danger"
            onClick={() => setShowErrorModal(false)}
          >
            Đóng
          </button>
        </Modal>
      </div>
    </div>
  );
};

const BookingTabs = ({ handleStartCall }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [newAppointment, setNewAppointment] = useState(null);

  const handleSubmit = (appointment) => {
    setRefreshTrigger((prev) => prev + 1);
    setNewAppointment(appointment);
  };

  return (
    <div className="row g-1">
      <div className="col-12 col-md-4">
        <UpcomingAppointment
          handleStartCall={handleStartCall}
          refreshTrigger={refreshTrigger}
          onNewAppointment={newAppointment}
        />
      </div>
      <div className="col-12 col-md-8">
        <BookingNew handleSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default BookingTabs;