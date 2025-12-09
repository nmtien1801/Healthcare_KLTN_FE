import React, { useEffect, useState } from "react";
import * as echarts from "echarts";
import { Info, LineChart, Heart, User, Calendar, Clock, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { get_advice } from "../../apis/assistant";
import { useSelector, useDispatch } from "react-redux";
import { suggestFoodsByAi, GetCaloFood } from '../../redux/foodAiSlice'
import { useNavigate } from "react-router-dom";
import { fetchBloodSugar, saveBloodSugar } from '../../redux/patientSlice'
import ApiBooking from '../../apis/ApiBooking'
import { InsertFoods, GetListFood } from '../../redux/foodSlice';
import ApiNotification from "../../apis/ApiNotification";
import { sendStatus } from "../../utils/SetupSignFireBase";

const Following = ({ user, nearestAppointment, warning, isNewInput, setIsNewInput }) => {
  let bloodSugar = useSelector((state) => state.patient.bloodSugar);
  const latestReading = bloodSugar?.DT?.bloodSugarData[0]?.value;
  const safeWarning = Array.isArray(warning) ? warning : [];
  const warningCount = safeWarning.length;

  const readingStatus = {
    status: warningCount > 1 ? 'danger' : 'normal',
    color: warningCount > 1 ? 'text-danger' : 'text-success',
    bg: warningCount > 1 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10',
    border: warningCount > 1 ? 'border-danger' : 'border-success',
    content: warningCount > 1 ? safeWarning.join('\n\n') + '\n\n Vui lòng tham khảo ý kiến bác sĩ!' : "Chỉ số đường huyết trong mức bình thường"
  };

  useEffect(() => {
    if (warningCount > 1 && isNewInput) {
      const fetchWarning = async () => {
        try {
          await ApiNotification.createNotification({
            receiverId: user.uid,
            title: "Cảnh báo vượt mức nguy hiểm đường huyết",
            content: safeWarning.join('\n'),
            type: "system",
            metadata: {
              link: `/patient/appointments/${user.uid}`,
            },
            avatar: user.avatar || "",
          });
          // alert("Cảnh báo: Chỉ số đường huyết của bạn vượt mức nguy hiểm. Vui lòng tham khảo ý kiến bác sĩ!");
          await sendStatus(user?.uid, user?.uid, "warning");

          setIsNewInput(false);

        } catch (err) {
          console.error("Lỗi khi gửi cảnh báo:", err);
        }
      };

      fetchWarning();
    }
  }, [warningCount, isNewInput]);

  return <div className="py-3">
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
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Họ tên:</span><span>{user.username}</span></li>
            <li className="d-flex justify-content-between mb-2">
              <span className="text-muted">Tuổi:</span>
              <span>
                {(() => {
                  if (!user.dob) return "";
                  const dob = new Date(user.dob);
                  const today = new Date();
                  let age = today.getFullYear() - dob.getFullYear();
                  const m = today.getMonth() - dob.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                    age--;
                  }
                  return age;
                })()}
              </span>
            </li>
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Giới tính:</span><span>{user.gender}</span></li>
            <li className="d-flex justify-content-between mb-2"><span className="text-muted">Tình trạng:</span><span className="text-danger">Tiểu đường type 2</span></li>
            <li className="d-flex justify-content-between"><span className="text-muted">Bác sĩ:</span><span>Bác sĩ Trần Thị B</span></li>
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
          {nearestAppointment ? (
            <>
              <div className="fs-4 fw-bold text-dark mb-1">
                {new Date(nearestAppointment.date).toLocaleDateString('vi-VN')}
              </div>
              <div className="text-muted mb-2">
                {nearestAppointment.time}
              </div>
              <div className="text-muted mb-2">
                <strong>Bác sĩ:</strong> {nearestAppointment.doctorId.userId.username}
              </div>
              <div className="text-muted mb-2">
                <strong>Địa điểm:</strong> {nearestAppointment.type === 'onsite' ? 'Tại phòng khám' : 'Trực tuyến'}
              </div>
              {nearestAppointment.reason && (
                <div className="text-muted mb-2">
                  <strong>Lý do:</strong> {nearestAppointment.reason}
                </div>
              )}
              <div className="d-flex justify-content-center align-items-center gap-1 text-muted small">
                <Clock size={14} className="text-danger" /> <span className="text-danger">Nhớ chuẩn bị trước 30 phút</span>
              </div>
            </>
          ) : (
            <div className="text-muted">
              <p>Chưa có lịch hẹn sắp tới</p>
            </div>
          )}
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
                {readingStatus.status === 'normal' ? 'Bình thường' : 'Cần chú ý'}
              </strong>
            </div>
            <div className="small text-muted">
              {readingStatus.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

const bloodSugarDaily = ({ bloodSugar }) => {
  // 👉 Nhóm dữ liệu theo ngày và tính trung bình
  const dailyData = {};

  bloodSugar.forEach(item => {
    const date = new Date(item.time);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { fasting: [], postMeal: [] };
    }

    if (item.type === 'fasting') {
      dailyData[dateKey].fasting.push(item.value);
    } else if (item.type === 'postMeal') {
      dailyData[dateKey].postMeal.push(item.value);
    }
  });

  // 👉 Tính trung bình cho mỗi ngày
  const sortedDates = Object.keys(dailyData).sort();
  const dates = sortedDates.map(date => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  });

  const fastingData = sortedDates.map(date => {
    const values = dailyData[date].fasting;
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  });

  const postMealData = sortedDates.map(date => {
    const values = dailyData[date].postMeal;
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
  });

  return { dates, fastingData, postMealData }
}

// ✅ Kiểm tra ngưỡng cao và hiển thị alert
const checkHighThreshold = (dailyBloodSugar, setWarning) => {
  const todayIndex = dailyBloodSugar.dates.length - 1;
  const todayDate = dailyBloodSugar.dates[todayIndex];
  const todayFastingValue = dailyBloodSugar.fastingData[todayIndex];
  const todayPostMealValue = dailyBloodSugar.postMealData[todayIndex];

  const warnings = [];
  warnings.push(`Ngày ${todayDate}: `)
  // 2. Kiểm tra chỉ số lúc đói của ngày hôm nay (ngưỡng >= 7.0)
  if (todayFastingValue !== null && todayFastingValue >= 7.0) {
    warnings.push(`Đường huyết lúc đói cao (${todayFastingValue.toFixed(3)} mmol/L).`);
  }

  // 3. Kiểm tra chỉ số sau ăn của ngày hôm nay (ngưỡng >= 11.1)
  if (todayPostMealValue !== null && todayPostMealValue >= 11.1) {
    warnings.push(` - Đường huyết sau ăn cao (${todayPostMealValue.toFixed(3)} mmol/L).`);
  }

  // 4. Hiển thị alert nếu có cảnh báo
  if (warnings.length > 0) {
    setWarning(warnings)
  }
};

const Chart = ({ bloodSugar, setWarning }) => {
  // biểu đồ
  useEffect(() => {
    const chartDom = document.getElementById("health-chart");
    if (!chartDom) return;

    // Tạo chart instance
    const myChart = echarts.init(chartDom);

    // Xử lý data
    let dailyBloodSugar = { dates: [], fastingData: [], postMealData: [] };

    if (bloodSugar && bloodSugar.length > 0) {
      try {
        dailyBloodSugar = bloodSugarDaily({ bloodSugar });
        // Gọi hàm cảnh báo
        checkHighThreshold(dailyBloodSugar, setWarning);
      } catch (error) {
        console.error('Error processing bloodSugar data:', error);
      }
    }

    const option = {
      title: {
        text: "Chỉ số đường huyết (mmol/L) - Trung bình theo ngày",
        left: "center",
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: "axis",
        formatter: function (params) {
          let result = params[0].axisValue + '<br/>';
          params.forEach(param => {
            if (param.value !== null) {
              result += param.marker + ' ' + param.seriesName + ': ' + Number(param.value?.toFixed(1)) + ' mmol/L<br/>';
            }
          });
          return result;
        }
      },
      legend: {
        top: "10%",
        data: ["Lúc đói", "Sau ăn"],
      },
      xAxis: {
        type: "category",
        data: dailyBloodSugar.dates,
      },
      yAxis: {
        type: "value",
        min: 4,
        max: 13,
        axisLabel: { formatter: "{value} mmol/L" },
      },
      series: [
        {
          name: "Lúc đói",
          data: dailyBloodSugar.fastingData,
          type: "line",
          smooth: true,
          lineStyle: { color: "#3b82f6" }, // xanh
          itemStyle: { color: "#3b82f6" },
          connectNulls: false, // Không nối các điểm null
          markLine: {
            data: [
              {
                yAxis: 5.6,
                lineStyle: { color: "#10b981" },
                label: { formatter: "Trước ăn" },
              },
              {
                yAxis: 7.0,
                lineStyle: { color: "#ef4444" },
                label: { formatter: "Ngưỡng cao (đói)" },
              },
            ],
          },
        },
        {
          name: "Sau ăn",
          data: dailyBloodSugar.postMealData,
          type: "line",
          smooth: true,
          lineStyle: { color: "#f59e0b" }, // vàng cam
          itemStyle: { color: "#f59e0b" },
          connectNulls: false, // Không nối các điểm null
          markLine: {
            data: [
              {
                yAxis: 7.8,
                lineStyle: { color: "#10b981" },
                label: { formatter: "Sau ăn" },
              },
              {
                yAxis: 10,
                lineStyle: { color: "#ef4444" },
                label: { formatter: "Ngưỡng cao (sau ăn)" },
              },
            ],
          },
        },
      ],
      grid: { left: "10%", right: "10%", bottom: "15%" },
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [bloodSugar]);

  return (

    <div className="bg-white rounded shadow-sm border p-4 mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="p-2 rounded bg-indigo bg-opacity-10 d-inline-flex align-items-center justify-content-center">
          <LineChart size={20} className="text-indigo" />
        </div>
        <h5 className="mb-0 fw-semibold text-dark">Biểu đồ theo dõi</h5>
      </div>
      <div id="health-chart" className="w-100" style={{ height: "16rem", minHeight: "16rem" }}></div>
    </div>
  )
}

const getYesterdayAvg = ({ dailyBloodSugar }) => {
  const len = dailyBloodSugar.dates.length;
  if (len < 1) return null;

  const fasting = dailyBloodSugar.fastingData[len - 1];
  const postMeal = dailyBloodSugar.postMealData[len - 1];

  // Tính trung bình chung của hôm trước
  const avg = [fasting, postMeal].filter(v => v !== null)
    .reduce((a, b) => a + b, 0) /
    ([fasting, postMeal].filter(v => v !== null).length || 1);

  return { fasting, postMeal, avg };
};

const Plan = ({ aiPlan, user, bloodSugar }) => {
  const [food, setFood] = useState([]);
  const totalCalo = useSelector((state) => state.food.totalCalo);
  const [showAllFood, setShowAllFood] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // kiểm tra calo hiện tại
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const cached = await dispatch(GetListFood(user.userId));

        if (cached && cached?.payload?.DT && cached?.payload?.DT.length > 0) {
          setFood(cached.payload.DT);
          return;
        }

        let dailyBloodSugar = bloodSugarDaily({ bloodSugar });
        let yesterday = getYesterdayAvg({ dailyBloodSugar });

        const res = await dispatch(GetCaloFood(user.userId));
        const data = res?.payload?.DT?.menuFood;

        if (!data) {
          console.error('Không lấy được dữ liệu menuFood');
          return;
        }

        if (!yesterday) {
          console.error('Không có dữ liệu đường huyết ngày hôm qua');
          return;
        }

        const response = await dispatch(suggestFoodsByAi({
          min: data.caloMin,
          max: data.caloMax,
          mean: yesterday.avg,
          currentCalo: data.caloCurrent,
          menuFoodId: data._id
        }));

        if (response?.payload?.result) {
          await dispatch(InsertFoods({
            userId: user.userId,
            data: response?.payload?.result.chosen
          }));
          setFood(response.payload.result);
        }
      } catch (error) {
        console.error('Error fetching food:', error);
        // Có thể set state lỗi để hiển thị cho user
      }
    };

    if (user.userId && bloodSugar && bloodSugar.length > 0) {
      fetchFood();
    }
  }, [bloodSugar, user.userId]);

  return (
    <>
      {/* Lời khuyên */}
      <div className="bg-danger bg-opacity-10 p-3 rounded mt-3" >
        <h5 className="fw-medium text-danger mb-1">👉 Lời Khuyên</h5>
        <p className="mb-1 advice-text" >{aiPlan.advice || "Chưa có lời khuyên"}</p>
        <small className="text-muted fst-italic">
          — {aiPlan.assistant_name || "AI Assistant"}
        </small>
      </div >

      {/* KẾ HOẠCH DINH DƯỠNG */}
      <div className="bg-warning bg-opacity-10 p-3 rounded mt-3">
        <h5 className="fw-medium text-warning mb-2">🥗 Kế hoạch dinh dưỡng</h5>
        {food && food && food.length > 0 ? (
          <>
            <div className="mb-2"><strong>Calo/ngày:</strong> {totalCalo} calo</div>
            <ul className="list-unstyled mt-2 small">
              {food.slice(0, showAllFood ? undefined : 5).map((item, idx) => (
                <li key={idx} className="mb-1">
                  <strong>{item.name}:</strong> ({item.calo} calo) - {item.weight}g
                </li>
              ))}
            </ul>

            {food.length > 5 && (
              <div className="mt-2 d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-warning border-0"
                  onClick={() => setShowAllFood(!showAllFood)}
                >
                  {showAllFood ? 'Thu gọn' : `Xem thêm (${food.length - 5} món)`}
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="mt-2 btn btn-sm btn-warning" onClick={() => navigate('/suggestedFood')}>
            Khám phá thực đơn
          </button>
        )}
      </div>
    </>
  )
}

const HealthTabs = () => {
  const [messageInput, setMessageInput] = useState([]);
  const dispatch = useDispatch();
  const [aiPlan, setAiPlan] = useState({});
  let user = useSelector((state) => state.auth.userInfo);
  const [measurementType, setMeasurementType] = useState("before");
  const [bloodSugar, setBloodSugar] = useState([]);
  const [nearestAppointment, setNearestAppointment] = useState(null);
  const [warning, setWarning] = useState();   // chỉ số cảnh báo
  const [isNewInput, setIsNewInput] = useState(false);


  let fetchBloodSugarData = async () => {
    try {
      // Lấy cả dữ liệu lúc đói và sau ăn
      const [postMealRes, fastingRes] = await Promise.all([
        dispatch(fetchBloodSugar({ userId: user.userId, type: "postMeal", days: 6 })),
        dispatch(fetchBloodSugar({ userId: user.userId, type: "fasting", days: 6 }))
      ]);

      // Kiểm tra response structure - thử nhiều format khác nhau
      let postMealData = postMealRes.payload.DT.bloodSugarData;
      let fastingData = fastingRes.payload.DT.bloodSugarData;

      // Gộp dữ liệu từ cả hai API calls
      const allBloodSugarData = [...postMealData, ...fastingData];

      setBloodSugar(allBloodSugarData);
    } catch (error) {
      console.error('Error fetching blood sugar data:', error);
    }
  }

  // get bloodSugar
  useEffect(() => {
    if (!user?.userId) {
      console.log('No userId, skipping fetchBloodSugarData');
      return;
    }

    fetchBloodSugarData()
  }, [dispatch, user?.userId])

  // Lấy lịch hẹn gần nhất
  useEffect(() => {
    const fetchNearestAppointment = async () => {
      try {
        const appointments = await ApiBooking.getUpcomingAppointments();

        if (appointments && appointments.length > 0) {
          // Sắp xếp theo thời gian: kết hợp date và time
          const sortedAppointments = appointments.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            // Nếu cùng ngày, so sánh theo giờ
            if (dateA.getTime() === dateB.getTime()) {
              return a.time.localeCompare(b.time);
            }

            return dateA - dateB;
          });

          // Lấy lịch hẹn gần nhất (phần tử đầu tiên)
          setNearestAppointment(sortedAppointments[0]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy lịch hẹn:', error);
      }
    };

    fetchNearestAppointment();
  }, []);

  const handleAiAgent = async () => {
    if (messageInput.trim() === "") return;

    // Lưu giá trị input trước khi clear
    const inputValue = messageInput.trim();
    const inputType = measurementType;

    // xử lý dữ liệu
    let result = '';

    if (inputType === "before") {
      if (inputValue < 3.9) {
        result = '<3,9';
      } else if (inputValue >= 3.9 && inputValue <= 5.6) {
        result = '3,9 – 5,6';
      } else if (inputValue > 5.6 && inputValue <= 6.9) {
        result = '5,7 – 6,9';
      } else if (inputValue >= 7) {
        result = '>=7';
      } else {
        result = 'Giá trị không hợp lệ';
      }
    } else if (inputType === "after") {
      if (inputValue < 3.9) {
        result = '<3,9';
      } else if (inputValue >= 3.9 && inputValue <= 7.7) {
        result = '3,9 – 7,7';
      } else if (inputValue > 7.8 && inputValue <= 11) {
        result = '7,8 - 11';
      } else if (inputValue > 11) {
        result = '>11';
      } else {
        result = 'Giá trị không hợp lệ';
      }
    }

    // Clear input sau khi xử lý xong
    setMessageInput("");

    try {
      // Lưu chỉ số đường huyết vào BE
      const saveResult = await dispatch(saveBloodSugar({
        userId: user.userId,
        value: parseFloat(inputValue),
        type: inputType === "before" ? "fasting" : "postMeal"
      }));

      // Gọi AI để lấy lời khuyên
      const res = await get_advice.post(
        "/mess-fb-new", // Thay bằng webhook thực tế của bạn
        {
          message: {
            input: inputValue,
            measurementType: inputType,
            type: result
          }
        },
      );

      const botResponse = res.data;
      setAiPlan(botResponse);

      // Refresh blood sugar data để hiển thị trên chart
      await fetchBloodSugarData();
      setIsNewInput(true);

    } catch (err) {
      console.error('API error:', err);
      // Khôi phục input nếu API fail
      setMessageInput(inputValue);
      alert('Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!');
    }
  }

  return (
    <div className="d-flex flex-column gap-4">
      {/* tiêu đề */}
      <Following
        user={user}
        nearestAppointment={nearestAppointment}
        warning={warning}
        isNewInput={isNewInput}
        setIsNewInput={setIsNewInput}
      />


      {/* Biểu đồ */}
      <Chart bloodSugar={bloodSugar} setWarning={setWarning} />

      <div className="d-flex flex-column flex-lg-row gap-4">
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

          {aiPlan && <Plan aiPlan={aiPlan} user={user} bloodSugar={bloodSugar} />}
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