import React, { useState } from "react";
import { Phone, Video, Calendar, Clock, MapPin, Star, CheckCircle, Shield, Award, ClockIcon as Clock24, MessageSquare, X, Bot, Send } from 'lucide-react';

// Custom Components
const Button = ({ children, className = "", variant = "primary", size = "md", onClick, disabled, ...props }) => {
  const baseClasses =
    "btn d-inline-flex align-items-center justify-content-center fw-medium transition-all border-0 shadow-sm"

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
  }

  const sizes = {
    sm: "btn-sm px-2 py-1",
    md: "btn-md px-3 py-2",
    lg: "btn-lg px-4 py-3",
  }

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
  )
}

const upcomingAppointment = () => {
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false); // chat với bác sĩ
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { text: "Xin chào! Tôi là bác sĩ tư vấn của bạn. Bạn cần hỗ trợ gì?", sender: "doctor" },
  ]);

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    setChatMessages((prev) => [...prev, { text: messageInput, sender: "patient" }]);
    const userMessage = messageInput;
    setMessageInput("");

    try {

      //////////////////////////
      setChatMessages((prev) => [...prev, { text: "botResponse", sender: "doctor" }]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        { text: "Lỗi kết nối đến máy chủ.", sender: "doctor" }
      ]);
    }
  };

  const handleToggleStatus = () => {
    setIsConfirmed((prev) => !prev);
  };

  return (
    <div className="container my-3" >
      <div className="bg-white rounded shadow border p-4">
        <div className="">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <Calendar className="text-primary me-2" size={24} />
            <h4 className="mb-0 fw-bold text-dark">Lịch hẹn sắp tới</h4>
          </div>

          {/* Appointment Card */}
          <div
            className="card shadow-sm mb-4"
            style={{ backgroundColor: "#f0f2ff", border: "none", borderRadius: "16px" }}
          >
            <div className="card-body p-4">
              {/* Doctor Info */}
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3">
                    <img
                      src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                      alt="Doctor Avatar"
                      className="rounded-circle"
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold text-dark">Bác sĩ Trần Thị B</h5>
                    <p className="mb-0 text-muted">Chuyên khoa Nội tiết</p>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="badge rounded-pill bg-success mb-2 px-3 py-2 d-flex align-items-center">
                    <span className="me-1" style={{ fontSize: "0.75rem" }}>●</span> Online
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
                      onClick={() => handleCallPatient(patient)}
                      title="Gọi điện"
                    >
                      <Phone size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <Calendar className="text-primary me-2" size={18} />
                  <span className="text-dark">23/6/2023</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <Clock className="text-primary me-2" size={18} />
                  <span className="text-dark">09:30 - 10:00</span>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="d-flex align-items-center justify-content-between">
                {/* Trạng thái xác nhận */}
                <div className="d-flex align-items-center">
                  <CheckCircle
                    className={isConfirmed ? "text-success me-2" : "text-warning me-2"}
                    size={18}
                  />
                  <span
                    className={isConfirmed ? "text-success fw-medium" : "text-warning fw-medium"}
                  >
                    {isConfirmed ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                </div>

                {/* Nút xác nhận hoặc hủy */}
                <button
                  className={`btn btn-sm rounded-pill px-3 py-2 ${isConfirmed ? "btn-outline-danger" : "btn-outline-primary"
                    }`}
                  onClick={handleToggleStatus}
                >
                  {isConfirmed ? "Hủy lịch" : "Xác nhận"}
                </button>
              </div>

            </div>
          </div>

          {/* Features Section */}
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
      </div>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="position-fixed bottom-0 end-0 m-3 shadow-lg rounded-4 bg-white" style={{ width: 320, height: 450, zIndex: 9999 }}>
          <div className="bg-primary text-white d-flex justify-content-between align-items-center p-2 rounded-top-4">
            <div><Bot size={18} className="me-1" /> Bác sĩ tư vấn</div>
            <button onClick={() => setShowChatbot(false)} className="btn btn-sm btn-light text-dark rounded-circle"><X size={16} /></button>
          </div>
          <div className="p-2" style={{ height: 340, overflowY: "auto" }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === "patient" ? "text-end" : "text-start"}`}>
                <div className={`d-inline-block px-3 py-2 rounded-3 ${msg.sender === "patient" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-top d-flex p-3 align-items-center">
            <input
              type="text"
              className="form-control form-control-sm rounded-pill me-2"
              placeholder="Nhập câu hỏi..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="btn btn-sm btn-primary rounded-pill"><Send size={16} /></button>
          </div>
        </div>
      )}

    </div>
  )
}

const BookingNew = (doctors, timeSlots, handleSubmit) => {
  const [appointmentType, setAppointmentType] = useState('clinic');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  return <div className="container my-4">
    <div className="bg-white rounded shadow border p-4">
      <h2 className="h5 mb-2">Đặt lịch khám mới</h2>
      <p className="text-muted mb-4">Vui lòng điền đầy đủ thông tin để đặt lịch</p>

      {/* Appointment Type */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Loại hình khám</label>
        <div className="row g-2">
          <div className="col">
            <button
              className={`btn w-100 ${appointmentType === 'clinic' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              onClick={() => setAppointmentType('clinic')}
            >
              <MapPin size={18} className="mb-1" /><br />Tại phòng khám
            </button>
          </div>
          <div className="col">
            <button
              className={`btn w-100 ${appointmentType === 'online' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
              onClick={() => setAppointmentType('online')}
            >
              <Video size={18} className="mb-1" /><br />Khám trực tuyến
            </button>
          </div>
        </div>
      </div>

      {/* Doctor Selection */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Chọn bác sĩ</label>
        <div className="row g-3">
          {doctors.map((doctor) => (
            <div className="col-md-6" key={doctor.id}>
              <div
                className={`card p-3 cursor-pointer ${selectedDoctor === doctor.id ? 'border-primary shadow' : ''}`}
                onClick={() => setSelectedDoctor(doctor.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="rounded-circle me-3"
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-0">{doctor.name}</h6>
                    <small className="text-muted d-block">{doctor.specialty}</small>
                    <small className="text-muted">{doctor.experience}</small>
                  </div>
                  <div className="text-end">
                    <div className="d-flex align-items-center text-warning">
                      <Star size={14} fill="currentColor" />
                      <span className="ms-1 small">{doctor.rating}</span>
                    </div>
                    <small className="text-muted">{doctor.patients}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Chọn ngày</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Time */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Chọn giờ</label>
        <div className="row g-2">
          {timeSlots.map((time) => (
            <div className="col-3" key={time}>
              <button
                className={`btn w-100 btn-sm ${selectedTime === time ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Lý do khám</label>
        <textarea
          className="form-control"
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Mô tả ngắn gọn lý do bạn muốn khám..."
        />
      </div>

      {/* Submit */}
      <button className="btn btn-primary w-100 py-3 fw-semibold" onClick={handleSubmit}>
        Xác nhận đặt lịch khám
      </button>

      <p className="text-center text-muted small mt-3">
        Bằng cách đặt lịch, bạn đồng ý với
        <a href="#" className="text-decoration-none ms-1">điều khoản sử dụng</a> và
        <a href="#" className="text-decoration-none ms-1">chính sách bảo mật</a>
      </p>
    </div>
  </div>
}

const BookingTabs = () => {
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
      {upcomingAppointment()}
      {BookingNew(doctors, timeSlots, handleSubmit)}
    </div>
  );
};

export default BookingTabs;
