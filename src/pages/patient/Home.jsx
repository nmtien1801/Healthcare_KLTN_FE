import React, { useState, useEffect } from "react";
import { Check, MessageCircleMore } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import ApiBooking from '../../apis/ApiBooking'
import { fetchMedicines, updateStatusMedicine } from '../../redux/medicineAiSlice';
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.userInfo);
  let bloodSugar = useSelector((state) => state.patient.bloodSugar);
  const [nearestAppointment, setNearestAppointment] = useState(null);

  let calculateAge = (user) => {
    if (!user.dob) return "";
    const dob = new Date(user.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

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

            // Kiểm tra xem date có hợp lệ không
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
              return 0;
            }

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

  useEffect(() => {
    if (!bloodSugar || !bloodSugar.DT) {
      console.log("Đang fetch lại dữ liệu đường huyết...");
    }
  }, [dispatch, bloodSugar, user.userId]);

  // Hàm tìm dữ liệu đường huyết mới nhất
  const getLatestBloodSugarData = (bloodSugar) => {
    const bloodSugarData = bloodSugar?.DT?.bloodSugarData;
    if (!bloodSugarData) return null;

    // Chuyển đối tượng { key: { value: X, time: Y } } thành mảng các item
    const dataArray = Object.values(bloodSugarData);

    if (dataArray.length === 0) return null;

    // Tìm item có time (thời gian) lớn nhất
    const latestItem = dataArray.reduce((latest, current) => {
      // Chuyển chuỗi thời gian thành đối tượng Date để so sánh
      const timeLatest = new Date(latest.time).getTime();
      const timeCurrent = new Date(current.time).getTime();

      return timeCurrent > timeLatest ? current : latest;
    });

    return latestItem;
  };
  const latestBloodSugar = getLatestBloodSugarData(bloodSugar);
  
  const userData = {
    name: user.username,
    age: calculateAge(user),
    gender: user.gender,
    condition: "Tiểu đường type 2",
    doctor: nearestAppointment?.doctorId?.userId?.username ?? "",
    nextAppointment: nearestAppointment?.date ? new Date(nearestAppointment.date).toLocaleDateString('vi-VN') : "13/09/2025",
    latestValue: latestBloodSugar?.value,
    latestTime: latestBloodSugar?.time,
  };

  // thuốc
  const [medications, setMedications] = useState([]);

  const handleMedicationToggle = async (index) => {
    const updated = [...medications];
    updated[index].status = !updated[index].status;
    setMedications(updated);

    await dispatch(updateStatusMedicine({ id: updated[index]._id, status: updated[index].status }))
  };

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        let res = await dispatch(fetchMedicines({ userId: user.userId, date: new Date() }));
        setMedications(res.payload.DT);
      } catch (error) {
        console.error('Lỗi khi lấy lịch hẹn:', error);
      }

    };

    fetchMedicine();
  }, []);

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
                  <div className="text-muted">Bác sĩ theo dõi</div>
                  <div className="fw-medium">{userData.doctor}</div>
                </div>
              </div>
              <div className="text-center mt-3">
                <small className="text-muted">Lịch hẹn tiếp theo: {userData.nextAppointment}</small>
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
                  className={`btn btn-sm btn-outline-primary custom-responsive-btn`}
                >
                  Xem Chi tiết
                </button>
              </div>
              <div className="bg-light rounded-3 p-3 text-center">
                <h4 className="text-primary fw-bold mb-1">{userData.latestValue ?? '--'} mmol/L</h4>
                <small className="text-muted">
                  {userData.latestTime
                    ? moment(userData.latestTime).format("HH:mm - DD/MM/YYYY")
                    : 'Không có dữ liệu'}
                </small>
                
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
                      <div className="text-muted small">{moment(med.time).utc().format("HH:mm:ss")}</div>
                    </div>
                    <button
                      onClick={() => handleMedicationToggle(idx)}
                      className={`btn btn-sm rounded-pill ${med.status ? "btn-success text-white" : "btn-outline-primary"}`}
                    >
                      {med.status ? <><Check size={16} className="me-1" /> Đã uống</> : "Đánh dấu"}
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
                  <small>Tư vẫn lịch uống thuốc</small>
                </div>
                <button onClick={() => navigate('/assitant')} className="btn btn-light text-primary btn-sm rounded-pill fw-medium">
                  <MessageCircleMore size={16} className="me-1" /> Chat ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;