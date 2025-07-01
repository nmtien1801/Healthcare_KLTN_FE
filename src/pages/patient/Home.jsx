import React, { useState, useEffect } from "react";
import * as echarts from "echarts";
import { Check, MessageCircleMore, X, Bot, Send } from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    condition: "Tiểu đường type 2",
    doctor: "Bác sĩ Trần Thị B",
    nextAppointment: "2025-06-30",
    bloodSugar: [5.6, 6.2, 5.8, 6.5, 6.0, 5.9, 6.3],
  });

  const [medications, setMedications] = useState([
    { name: "Metformin", dosage: "500mg", time: "08:00", taken: false },
    { name: "Gliclazide", dosage: "80mg", time: "12:00", taken: false },
    { name: "Metformin", dosage: "500mg", time: "20:00", taken: false },
  ]);

  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      text: "Xin chào! Tôi là trợ lý AI về bệnh tiểu đường. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
    },
  ]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (activeTab === "health") {
      const chartDom = document.getElementById("health-chart");
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const dates = [
          "17/06",
          "18/06",
          "19/06",
          "20/06",
          "21/06",
          "22/06",
          "23/06",
        ];

        const option = {
          title: {
            text: "Chỉ số đường huyết (mmol/L)",
            left: "center",
            textStyle: {
              fontSize: 14,
            },
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: dates,
          },
          yAxis: {
            type: "value",
            min: 4,
            max: 8,
            axisLabel: {
              formatter: "{value} mmol/L",
            },
          },
          series: [
            {
              data: userData.bloodSugar,
              type: "line",
              smooth: true,
              lineStyle: {
                color: "#4f46e5",
              },
              itemStyle: {
                color: "#4f46e5",
              },
              markLine: {
                data: [
                  {
                    yAxis: 5.6,
                    lineStyle: { color: "#10b981" },
                    label: { formatter: "Mức bình thường" },
                  },
                  {
                    yAxis: 7.0,
                    lineStyle: { color: "#ef4444" },
                    label: { formatter: "Ngưỡng cao" },
                  },
                ],
              },
            },
          ],
          grid: {
            left: "10%",
            right: "10%",
            bottom: "15%",
          },
        };

        myChart.setOption(option);

        return () => {
          myChart.dispose();
        };
      }
    }
  }, [activeTab, userData.bloodSugar]);

  const handleMedicationToggle = (index) => {
    const updatedMedications = [...medications];
    updatedMedications[index].taken = !updatedMedications[index].taken;
    setMedications(updatedMedications);
  };

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    setChatMessages([...chatMessages, { text: messageInput, sender: "user" }]);
    setMessageInput("");

    // Giả lập phản hồi từ chatbot
    setTimeout(() => {
      let response = "";
      if (
        messageInput.toLowerCase().includes("đường huyết") ||
        messageInput.toLowerCase().includes("glucose")
      ) {
        response =
          "Chỉ số đường huyết bình thường khi đói nên từ 3.9 đến 5.5 mmol/L. Sau ăn 2 giờ không nên vượt quá 7.8 mmol/L.";
      } else if (
        messageInput.toLowerCase().includes("ăn") ||
        messageInput.toLowerCase().includes("dinh dưỡng")
      ) {
        response =
          "Người bệnh tiểu đường nên ăn nhiều rau xanh, protein nạc, và hạn chế carbohydrate đơn giản. Bạn nên tham khảo chế độ ăn chi tiết từ bác sĩ của mình.";
      } else if (
        messageInput.toLowerCase().includes("thuốc") ||
        messageInput.toLowerCase().includes("metformin")
      ) {
        response =
          "Metformin là thuốc phổ biến điều trị tiểu đường type 2. Thuốc nên uống trong bữa ăn để giảm tác dụng phụ về tiêu hóa.";
      } else {
        response =
          "Cảm ơn câu hỏi của bạn. Tôi sẽ chuyển thông tin này đến bác sĩ của bạn để được tư vấn chi tiết hơn.";
      }

      setChatMessages((prev) => [...prev, { text: response, sender: "bot" }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="bg-light min-vh-100 text-dark position-relative">
      <div className="pt-4 pb-5 px-3">
        <div className="d-flex flex-column gap-4">
          {/* User Info */}
          <div className="bg-white rounded shadow-sm p-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-primary bg-opacity-25 text-primary d-flex align-items-center justify-content-center fw-semibold fs-5" style={{ width: 48, height: 48 }}>
                {userData.name.charAt(0)}
              </div>
              <div>
                <h5 className="fw-semibold mb-0">{userData.name}</h5>
                <small className="text-muted">{userData.condition}</small>
              </div>
            </div>

            <div className="row g-2 text-sm">
              <div className="col-6">
                <div className="bg-light p-2 rounded">
                  <div className="text-muted">Tuổi</div>
                  <div className="fw-medium">{userData.age}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-2 rounded">
                  <div className="text-muted">Giới tính</div>
                  <div className="fw-medium">{userData.gender}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-2 rounded">
                  <div className="text-muted">Bác sĩ</div>
                  <div className="fw-medium">{userData.doctor}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-light p-2 rounded">
                  <div className="text-muted">Lịch hẹn</div>
                  <div className="fw-medium">
                    {new Date(userData.nextAppointment).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Sugar */}
          <div className="bg-white rounded shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Chỉ số đường huyết gần đây</h6>
              <button className="btn btn-link text-primary p-0 text-decoration-none" onClick={() => setActiveTab("health")}>
                Xem chi tiết
              </button>
            </div>
            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: 130 }}>
              <div className="text-center">
                <div className="fs-4 fw-semibold text-primary">
                  {userData.bloodSugar[userData.bloodSugar.length - 1]} mmol/L
                </div>
                <div className="text-muted small">Hôm nay, 23/06/2025</div>
                <span className="badge bg-warning text-dark mt-1">Cao hơn bình thường</span>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded shadow-sm p-3">
            <h6 className="fw-semibold mb-3">Lịch uống thuốc hôm nay</h6>
            <div className="d-flex flex-column gap-2">
              {medications.map((med, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <div>
                    <div className="fw-medium">{med.name} {med.dosage}</div>
                    <div className="small text-muted">{med.time}</div>
                  </div>
                  <button
                    className={`btn btn-sm rounded-pill ${med.taken ? "btn-success text-white" : "btn-outline-primary"}`}
                    onClick={() => handleMedicationToggle(index)}
                  >
                    {med.taken ? (
                      <>
                        <Check size={16} className="me-1" /> Đã uống
                      </>
                    ) : (
                      "Đánh dấu"
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Support */}
          <div className="rounded shadow-sm p-3 text-white" style={{ background: "linear-gradient(to right, #6366F1, #8B5CF6)" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-semibold mb-1">Hỗ trợ tư vấn 24/7</h6>
                <small className="text-light">Đặt câu hỏi về bệnh tiểu đường</small>
              </div>
              <button className="btn btn-light text-primary btn-sm rounded-pill fw-medium" onClick={() => setShowChatbot(true)}>
                <MessageCircleMore size={16} className="me-1" /> Chat ngay
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Chatbot */}
      {showChatbot && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3 p-3">
          <div className="bg-white rounded-3 w-100" style={{ maxWidth: '500px', height: '500px', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center border-bottom p-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex justify-content-center align-items-center me-2" style={{ width: '32px', height: '32px' }}>
                  <Bot size={18} className="text-primary" />
                </div>
                <div>
                  <h6 className="mb-0">Trợ lý AI</h6>
                  <small className="text-muted">Hỗ trợ 24/7</small>
                </div>
              </div>
              <button className="btn btn-sm btn-light"
                onClick={() => setShowChatbot(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow-1 overflow-auto p-3">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-3 ${msg.sender === 'user' ? 'bg-primary text-white rounded-end-0' : 'bg-light text-dark rounded-start-0'}`}
                    style={{ maxWidth: '80%' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-top p-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Nhập câu hỏi của bạn..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary btn-sm" onClick={sendMessage}>
                  <Send size={16} />
                </button>
              </div>
              <div className="form-text mt-1">
                Gợi ý: Chỉ số đường huyết bình thường? Chế độ ăn cho người tiểu đường?
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
