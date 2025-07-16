import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import { Check, MessageCircleMore, X, Bot, Send } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { text: "Xin chào! Tôi là trợ lý AI. Bạn cần hỗ trợ gì?", sender: "bot" },
  ]);

  const userData = {
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    condition: "Tiểu đường type 2",
    doctor: "Bác sĩ Trần Thị B",
    nextAppointment: "2025-06-30",
    bloodSugar: [5.6, 6.2, 5.8, 6.5, 6.0, 5.9, 6.3],
  };

  const [medications, setMedications] = useState([
    { name: "Metformin", dosage: "500mg", time: "08:00", taken: false },
    { name: "Gliclazide", dosage: "80mg", time: "12:00", taken: false },
    { name: "Metformin", dosage: "500mg", time: "20:00", taken: false },
  ]);


  const handleMedicationToggle = (index) => {
    const updated = [...medications];
    updated[index].taken = !updated[index].taken;
    setMedications(updated);
  };

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    setChatMessages((prev) => [...prev, { text: messageInput, sender: "user" }]);
    setMessageInput("");

    setTimeout(() => {
      let response = "Tôi sẽ ghi nhận thông tin và chuyển đến bác sĩ.";
      const lower = messageInput.toLowerCase();

      if (lower.includes("đường huyết")) {
        response = "Chỉ số bình thường khi đói: 3.9 - 5.5 mmol/L. Sau ăn: không quá 7.8 mmol/L.";
      } else if (lower.includes("ăn")) {
        response = "Bạn nên ăn nhiều rau xanh, hạn chế đường và tinh bột.";
      } else if (lower.includes("thuốc")) {
        response = "Metformin giúp kiểm soát đường huyết. Nên uống sau bữa ăn.";
      }

      setChatMessages((prev) => [...prev, { text: response, sender: "bot" }]);
    }, 800);
  };

  return (
    <div className="bg-light min-vh-100 p-3">
      <div className="container py-4">
        <div className="mb-4 text-center">
          <h4 className="fw-bold text-primary">Chăm sóc sức khỏe - Tiểu đường</h4>
          <p className="text-muted small">Xin chào, {userData.name}</p>
        </div>

        <div className="row g-3">

          {/* Thông tin bệnh nhân */}
          <div className="col-12 col-md-6">
            <div className="bg-white rounded-4 shadow-sm p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                  {userData.name.charAt(0)}
                </div>
                <div>
                  <h5 className="mb-1 fw-semibold">{userData.name}</h5>
                  <small className="text-muted">{userData.condition}</small>
                </div>
              </div>

              <hr />
              <div className="row text-center small">
                <div className="col">
                  <div className="text-muted">Tuổi</div>
                  <div className="fw-medium">{userData.age}</div>
                </div>
                <div className="col">
                  <div className="text-muted">Giới tính</div>
                  <div className="fw-medium">{userData.gender}</div>
                </div>
                <div className="col">
                  <div className="text-muted">Bác sĩ</div>
                  <div className="fw-medium">{userData.doctor}</div>
                </div>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">Lịch hẹn tiếp theo: {new Date(userData.nextAppointment).toLocaleDateString("vi-VN")}</small>
              </div>
            </div>
          </div>

          {/* Chỉ số đường huyết */}
          <div className="col-12 col-md-6">
            <div className="bg-white rounded-4 shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-semibold mb-0">Đường huyết hôm nay</h6>
                <button
                  onClick={() => navigate('/healthTabs')}
                  className={`btn btn-sm btn-outline-primary`}
                >
                  Xem Chi tiết
                </button>
              </div>
              <div className="bg-light rounded-3 p-3 text-center">
                <h4 className="text-primary fw-bold mb-1">{userData.bloodSugar.slice(-1)[0]} mmol/L</h4>
                <small className="text-muted">23/06/2025</small>
                <div className="mt-2">
                  <span className="badge bg-warning text-dark">Cao hơn bình thường</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thuốc */}
          <div className="col-12">
            <div className="bg-white rounded-4 shadow-sm p-3">
              <h6 className="fw-semibold mb-3">Lịch uống thuốc</h6>
              <div className="d-flex flex-column gap-2">
                {medications.map((med, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3">
                    <div>
                      <strong>{med.name} {med.dosage}</strong>
                      <div className="text-muted small">{med.time}</div>
                    </div>
                    <button
                      onClick={() => handleMedicationToggle(idx)}
                      className={`btn btn-sm rounded-pill ${med.taken ? "btn-success text-white" : "btn-outline-primary"}`}
                    >
                      {med.taken ? <><Check size={16} className="me-1" /> Đã uống</> : "Đánh dấu"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hỗ trợ Chatbot */}
          <div className="col-12">
            <div className="rounded-4 p-3 shadow-sm text-white" style={{ background: "linear-gradient(to right, #6366F1, #8B5CF6)" }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-semibold mb-1">Trợ lý sức khỏe AI</h6>
                  <small>Hỏi đáp mọi lúc mọi nơi</small>
                </div>
                <button onClick={() => setShowChatbot(true)} className="btn btn-light text-primary btn-sm rounded-pill fw-medium">
                  <MessageCircleMore size={16} className="me-1" /> Chat ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="position-fixed bottom-0 end-0 m-3 shadow-lg rounded-4 bg-white" style={{ width: 320, height: 450, zIndex: 9999 }}>
          <div className="bg-primary text-white d-flex justify-content-between align-items-center p-2 rounded-top-4">
            <div><Bot size={18} className="me-1" /> Trợ lý AI</div>
            <button onClick={() => setShowChatbot(false)} className="btn btn-sm btn-light text-dark rounded-circle"><X size={16} /></button>
          </div>
          <div className="p-2" style={{ height: 340, overflowY: "auto" }}>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-end" : "text-start"}`}>
                <div className={`d-inline-block px-3 py-2 rounded-3 ${msg.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-top d-flex">
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
  );
};

export default Home;
