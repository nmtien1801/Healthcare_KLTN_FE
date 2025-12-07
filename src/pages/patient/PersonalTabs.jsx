import React, { useEffect, useState } from "react";
import { Camera, ChevronDown } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getPatientById, updatePatientInfo } from '../../redux/patientSlice';

const PersonalTabs = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  const patient = useSelector((state) => state.patient.patient);
  const loading = useSelector((state) => state.patient.loading);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    dob: user?.dob || "",
    gender: user?.gender || "Nam",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (user?.userId) {
        let res = await dispatch(getPatientById(user.userId));
      }
    };

    fetchPatient();
  }, [dispatch, user?.userId]);

  // Update formData when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.userId,
        username: user.username || "",
        dob: user.dob || "",
        gender: user.gender || "Nam",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateInfo = async () => {
    console.log("Cập nhật thông tin:", formData);
    let res = await dispatch(updatePatientInfo(formData));
  };

  // Format date for input[type="date"] (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="d-flex flex-column gap-4" style={{ backgroundColor: "#F8FAFC", padding: 20, borderRadius: 12 }}>

      {/* Hồ sơ cá nhân */}
      <div>
        <h2 className="fw-semibold fs-5 mb-2" style={{ color: "#4F46E5" }}>Hồ sơ cá nhân</h2>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", padding: 20, textAlign: "center" }}>
          <img
            src={user?.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"}
            alt={user?.username || "User"}
            className="rounded-circle me-3"
            style={{ width: 100, height: 100, objectFit: 'cover' }}
          />
          <h3 className="fw-semibold fs-5 mt-3">{user?.username || "Tên người dùng"}</h3>
          <button
            type="button"
            className="btn p-0 mt-2 d-inline-flex align-items-center gap-1"
            style={{ color: "#4F46E5", fontSize: 14, fontWeight: 500, border: "none", background: "none" }}
          >
            <Camera size={16} /> Thay đổi ảnh
          </button>
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", padding: 20 }}>
        <h3 className="fw-semibold mb-3" style={{ color: "#4F46E5" }}>Thông tin cá nhân</h3>
        <div className="d-flex flex-column gap-3">

          <div>
            <label className="form-label small fw-medium">Họ và tên</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Ngày sinh</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formatDateForInput(formData.dob)}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Giới tính</label>
              <div className="position-relative">
                <select
                  className="form-select form-select-sm pe-5"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <div className="position-absolute top-50 end-0 translate-middle-y pe-2" style={{ pointerEvents: "none" }}>
                  <ChevronDown size={16} style={{ color: "#94A3B8" }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label small fw-medium">Số điện thoại</label>
            <input
              type="tel"
              className="form-control form-control-sm"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label small fw-medium">Email</label>
            <input
              type="email"
              className="form-control form-control-sm"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label small fw-medium">Địa chỉ</label>
            <textarea
              rows={2}
              className="form-control form-control-sm"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <button
            className="btn w-100 text-white fw-medium"
            style={{
              backgroundColor: "#4F46E5",
              borderRadius: 8,
              padding: "10px 0",
              transition: "background 0.3s",
              border: "none"
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#4338CA"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#4F46E5"}
            onClick={handleUpdateInfo}
          >
            Cập nhật thông tin
          </button>

        </div>
      </div>

      {/* Thông tin bệnh án */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", padding: 20 }}>
        <h3 className="fw-semibold mb-3" style={{ color: "#4F46E5" }}>Thông tin bệnh án</h3>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : patient ? (
          <div className="d-flex flex-column gap-3">

            <div className="d-flex justify-content-between p-3" style={{ backgroundColor: "#F8FAFC", borderRadius: 8 }}>
              <div className="small">
                <div style={{ color: "#94A3B8" }}>Chẩn đoán</div>
                <div className="fw-medium">{patient.disease || "Chưa có thông tin"}</div>
              </div>
              <div className="small text-end">
                <div style={{ color: "#94A3B8" }}>Cập nhật</div>
                <div className="fw-medium">{formatDateForDisplay(patient.updatedAt)}</div>
              </div>
            </div>

            <div className="p-3" style={{ backgroundColor: "#F8FAFC", borderRadius: 8 }}>
              <div className="small">
                <div style={{ color: "#94A3B8" }}>Dị ứng</div>
                <div className="fw-medium">{patient.allergies || "Không có"}</div>
              </div>
            </div>

            <div className="p-3" style={{ backgroundColor: "#F8FAFC", borderRadius: 8 }}>
              <div className="small">
                <div style={{ color: "#94A3B8" }}>Ghi chú</div>
                <div className="fw-medium">{patient.notes || "Không có ghi chú"}</div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            <p>Chưa có thông tin bệnh án</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PersonalTabs;