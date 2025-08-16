import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Info, LineChart, Heart, User, Calendar, Clock, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const following = (userData) => {
  const latestReading = 7.2;

  const readingStatus = {
    status: latestReading < 6 ? 'normal' : latestReading < 7 ? 'prediabetes' : 'danger',
    color: latestReading < 6 ? 'text-success' : latestReading < 7 ? 'text-warning' : 'text-danger',
    bg: latestReading < 6 ? 'bg-success bg-opacity-10' : latestReading < 7 ? 'bg-warning bg-opacity-10' : 'bg-danger bg-opacity-10',
    border: latestReading < 6 ? 'border-success' : latestReading < 7 ? 'border-warning' : 'border-danger'
  };

  return <div className="container py-3">
    {/* Header */}
    <div className="bg-white rounded shadow-sm border p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold text-dark mb-1 fs-4">Theo dõi sức khỏe</h2>
          <p className="text-muted">Quản lý chỉ số đường huyết của bạn</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="text-end">
            <div className="text-muted small">Lần đo gần nhất</div>
            <div className={`fw-semibold fs-6 ${readingStatus.color}`}>{latestReading} mmol/L</div>
          </div>
          <div className={`p-2 rounded-circle border ${readingStatus.bg} ${readingStatus.border}`}>
            <Heart size={20} className={readingStatus.color} />
          </div>
        </div>
      </div>
    </div>

    <div className="row g-2 align-items-stretch">
      {/* User Info */}
      <div className="col-lg-4">
        <div className="bg-white rounded shadow-sm border p-4 h-100">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded">
              <User size={18} className="text-primary" />
            </div>
            <h5 className="fw-semibold mb-0">Thông tin cá nhân</h5>
          </div>
          <ul className="list-unstyled small mb-0">
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Họ tên:</span><span>{userData.name}</span></li>
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Tuổi:</span><span>{userData.age}</span></li>
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Giới tính:</span><span>{userData.gender}</span></li>
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Tình trạng:</span><span className="text-danger">{userData.condition}</span></li>
            <li className="d-flex justify-content-between"><span className="text-muted">Bác sĩ:</span><span>{userData.doctor}</span></li>
          </ul>
        </div>
      </div>

      {/* Appointment */}
      <div className="col-lg-4">
        <div className="bg-white rounded shadow-sm border p-4 text-center h-100">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="bg-success bg-opacity-10 p-2 rounded">
              <Calendar size={18} className="text-success" />
            </div>
            <h5 className="fw-semibold mb-0">Lịch hẹn tiếp theo</h5>
          </div>
          <div className="fs-4 fw-bold text-dark mb-1">
            {new Date(userData.nextAppointment).toLocaleDateString('vi-VN')}
          </div>
          <div className="text-muted mb-3">
            {new Date(userData.nextAppointment).toLocaleDateString('vi-VN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
          <div className="d-flex justify-content-center align-items-center gap-1 text-muted small">
            <Clock size={14} className="text-danger" /> <span className="text-danger">Nhớ chuẩn bị trước 30 phút</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="col-lg-4">
        <div className="bg-white rounded shadow-sm border p-4 h-100">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="bg-purple bg-opacity-10 p-2 rounded">
              <Activity size={18} className="text-purple" />
            </div>
            <h5 className="fw-semibold mb-0">Tình trạng hiện tại</h5>
          </div>

          <div className={`p-3 rounded ${readingStatus.bg} ${readingStatus.border} border`}>
            <div className="d-flex align-items-center gap-2 mb-2">
              {readingStatus.status === 'normal' ? (
                <CheckCircle size={18} className="text-success" />
              ) : (
                <AlertTriangle size={18} className="text-warning" />
              )}
              <strong className={readingStatus.color}>
                {readingStatus.status === 'normal' ? 'Bình thường' : readingStatus.status === 'prediabetes' ? 'Tiền tiểu đường' : 'Cần chú ý'}
              </strong>
            </div>
            <div className="small text-muted">
              {readingStatus.status === 'normal' ? 'Chỉ số đường huyết trong mức bình thường' :
                readingStatus.status === 'prediabetes' ? 'Chỉ số cao hơn bình thường, cần theo dõi' :
                  'Chỉ số cao, cần tham khảo ý kiến bác sĩ'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

const char = () => {
  return <div className="bg-white rounded shadow-sm border p-4 mb-4">
    <div className="d-flex align-items-center gap-2 mb-3">
      <div className="p-2 rounded bg-indigo bg-opacity-10 d-inline-flex align-items-center justify-content-center">
        <LineChart size={20} className="text-indigo" />
      </div>
      <h5 className="mb-0 fw-semibold text-dark">Biểu đồ theo dõi</h5>
    </div>
    <div id="health-chart" className="w-100" style={{ height: "16rem" }}></div>
  </div>
}

const Plan = (aiPlan, user) => {
  const applyMedicine = async (medicinePlan) => {
    let data = {
      email: user.email,
      medicinePlan: medicinePlan,
    }

    try {
      const res = await axios.post(
        "http://localhost:5678/webhook-test/apply-medicine", // Thay bằng webhook thực tế của bạn
        {
          message: {
            text: data,
          }
        },
      );

      const botResponse = res.data.myField;


      console.log("Bot response AI:", botResponse);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {/* KẾ HOẠCH THUỐC */}
      <div className="bg-light border rounded p-3 mt-3">
        <h5 className="fw-semibold mb-2">📋 Kế hoạch dùng thuốc</h5>
        <ul className="list-unstyled small mb-3">
          <li><strong>Sáng:</strong> {aiPlan.thuoc.sang && aiPlan.thuoc.sang.length > 0 ? aiPlan.thuoc.sang.join(", ") : "Không dùng"}</li>
          <li><strong>Trưa:</strong> {aiPlan.thuoc.trua && aiPlan.thuoc.trua.length > 0 ? aiPlan.thuoc.trua.join(", ") : "Không dùng"}</li>
          <li><strong>Tối:</strong> {aiPlan.thuoc.toi && aiPlan.thuoc.toi.length > 0 ? aiPlan.thuoc.toi.join(", ") : "Không dùng"}</li>
        </ul>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-success" onClick={() => applyMedicine(aiPlan.thuoc)}>
            Áp dụng thuốc
          </button>
        </div>
      </div>

      {/* KẾ HOẠCH DINH DƯỠNG */}
      <div className="bg-light border rounded p-3 mt-3">
        <h5 className="fw-semibold mb-2">🥗 Kế hoạch dinh dưỡng</h5>
        <div className="mb-2"><strong>Calo/ngày:</strong> {aiPlan.cheDoAn.caloNgay}</div>
        <ul className="list-unstyled mt-2 small">
          <li><strong>Sáng:</strong> {aiPlan.cheDoAn.buaAn.sang.mon} ({aiPlan.cheDoAn.buaAn.sang.kcal} Kcal)</li>
          <li><strong>Trưa:</strong> {aiPlan.cheDoAn.buaAn.trua.mon} ({aiPlan.cheDoAn.buaAn.trua.kcal} Kcal)</li>
          <li><strong>Tối:</strong> {aiPlan.cheDoAn.buaAn.toi.mon} ({aiPlan.cheDoAn.buaAn.toi.kcal} Kcal)</li>
          <li><strong>Phụ:</strong> {aiPlan.cheDoAn.buaAn.phu.mon} ({aiPlan.cheDoAn.buaAn.phu.kcal} Kcal)</li>
        </ul>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-success" onClick={() => alert("Đã áp dụng chế độ ăn!")}>
            Áp dụng chế độ ăn
          </button>
        </div>
      </div>

    </>
  )
}

const HealthTabs = () => {
  const [messageInput, setMessageInput] = useState([]);
  const [aiPlan, setAiPlan] = useState(null);
  let user = useSelector((state) => state.auth.userInfo);
  const [measurementType, setMeasurementType] = useState("before");

  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    condition: "Tiểu đường type 2",
    doctor: "Bác sĩ Trần Thị B",
    nextAppointment: "2025-06-30",
    bloodSugar: [5.6, 6.2, 5.8, 6.5, 6.0, 5.9, 6.3],
  });

  useEffect(() => {
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
  }, [userData.bloodSugar]);

  const handleAiAgent = async () => {
    if (messageInput.trim() === "") return;

    // xử lý dữ liệu
    let result = '';

    if (measurementType === "before") {
      if (messageInput < 3.9) {
        result = '<3,9';
      } else if (messageInput >= 3.9 && messageInput <= 5.6) {
        result = '3,9 – 5,6';
      } else if (messageInput > 5.6 && messageInput <= 6.9) {
        result = '5,7 – 6,9';
      } else if (messageInput >= 7) {
        result = '>=7';
      } else {
        result = 'Giá trị không hợp lệ';
      }
    } else if (measurementType === "after") {
      if (messageInput < 3.9) {
        result = '<3,9';
      } else if (messageInput >= 3.9 && messageInput <= 7.7) {
        result = '3,9 – 7,7';
      } else if (messageInput > 7.8 && messageInput <= 11) {
        result = '7,8 - 11';
      } else if (messageInput > 11) {
        result = '>11';
      } else {
        result = 'Giá trị không hợp lệ';
      }
    }

    setMessageInput("");

    try {
      const res = await axios.post(
        "http://localhost:5678/webhook-test/mess-fb-new", // Thay bằng webhook thực tế của bạn
        {
          message: {
            input: messageInput,
            measurementType: measurementType,
            type: result
          }
        },
      );

      const botResponse = res.data;
      console.log('ssssssssssssssssssss ', botResponse);

      setAiPlan(botResponse);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* tiêu đề */}
      {following(userData)}

      {/* Biểu đồ */}
      {char()}

      <div className="d-flex flex-column flex-lg-row gap-4">
        {/* Nhập chỉ số mới */}
        {/* Nhập chỉ số mới */}
        <div className="bg-white rounded shadow-lg p-4 flex-fill">
          <h3 className="fw-semibold mb-3 fs-6">Nhập chỉ số mới</h3>

          <div className="d-flex flex-column flex-sm-row gap-2">
            {/* Chọn loại chỉ số */}
            <select
              className="form-select form-select-sm w-auto"
              value={measurementType}
              onChange={(e) => setMeasurementType(e.target.value)}
            >
              <option value="before">Trước ăn</option>
              <option value="after">Sau ăn</option>
            </select>

            {/* Ô nhập */}
            <input
              type="text"
              className={`form-control form-control-sm ${measurementType === "before" ? "border-primary" : "border-warning"
                }`}
              placeholder="Nhập chỉ số đường huyết"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiAgent()}
            />

            {/* Nút lưu */}
            <button
              className="btn btn-sm btn-primary fw-medium"
              onClick={() => handleAiAgent()}
            >
              Lưu
            </button>
          </div>

          <div className="mt-3 text-secondary small d-flex align-items-center">
            <Info size={14} className="me-1" />
            Nhập chỉ số đường huyết theo đơn vị mmol/L
          </div>

          {aiPlan && Plan(aiPlan, user)}
        </div>


        {/* Thông tin thêm */}
        <div className="bg-white rounded shadow-sm p-4 flex-fill">
          <h3 className="fw-semibold mb-3 fs-6">Thông tin thêm</h3>
          <div className="d-flex flex-column gap-3 small">
            <div className="bg-success bg-opacity-10 p-3 rounded">
              <div className="fw-medium text-success mb-1">Chỉ số bình thường</div>
              <p className="text-success mb-1">Đường huyết lúc đói: 3.9 - 5.5 mmol/L</p>
              <p className="text-success">Đường huyết sau ăn 2h: &lt; 7.8 mmol/L</p>
            </div>

            <div className="bg-warning bg-opacity-10 p-3 rounded">
              <div className="fw-medium text-warning mb-1">Chỉ số tiền tiểu đường</div>
              <p className="text-warning mb-1">Đường huyết lúc đói: 5.6 - 6.9 mmol/L</p>
              <p className="text-warning">Đường huyết sau ăn 2h: 7.8 - 11.0 mmol/L</p>
            </div>

            <div className="bg-danger bg-opacity-10 p-3 rounded">
              <div className="fw-medium text-danger mb-1">Chỉ số tiểu đường</div>
              <p className="text-danger mb-1">Đường huyết lúc đói: ≥ 7.0 mmol/L</p>
              <p className="text-danger">Đường huyết sau ăn 2h: ≥ 11.1 mmol/L</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTabs;
