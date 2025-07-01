import React, { useEffect, useRef, useState } from "react";
import { Camera, ChevronDown } from "lucide-react";

const PersonalTabs = () => {
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    condition: "Tiểu đường type 2",
    doctor: "Bác sĩ Trần Thị B",
    nextAppointment: "2025-06-30",
    bloodSugar: [5.6, 6.2, 5.8, 6.5, 6.0, 5.9, 6.3],
  });
  const [address, setAddress] = useState("123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh");

  return (
    <div className="d-flex flex-column gap-4">
      {/* Hồ sơ cá nhân */}
      <div>
        <h2 className="fw-semibold fs-5 mb-2">Hồ sơ cá nhân</h2>
        <div className="bg-white rounded shadow-sm p-4 text-center">
          <div className="rounded-circle bg-indigo text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 80, height: 80, fontSize: 32, backgroundColor: "#eef2ff", color: "#4f46e5" }}>
            {userData.name.charAt(0)}
          </div>
          <h3 className="fw-semibold fs-5">{userData.name}</h3>
          <p className="text-muted small">ID: BN12345678</p>
          <button type="button" className="btn btn-link text-indigo p-0 mt-2 d-inline-flex align-items-center gap-1">
            <Camera size={16} /> Thay đổi ảnh
          </button>
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <div className="bg-white rounded shadow-sm p-4">
        <h3 className="fw-semibold mb-3">Thông tin cá nhân</h3>
        <div className="d-flex flex-column gap-3">

          <div>
            <label className="form-label small fw-medium">Họ và tên</label>
            <input type="text" className="form-control form-control-sm" value={userData.name} readOnly />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-medium">Ngày sinh</label>
              <input type="date" className="form-control form-control-sm" value="1980-05-15" readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-medium">Giới tính</label>
              <div className="position-relative">
                <select className="form-select form-select-sm pe-5">
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
                <div className="position-absolute top-50 end-0 translate-middle-y pe-2">
                  <ChevronDown size={16} className="text-muted" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="form-label small fw-medium">Số điện thoại</label>
            <input type="tel" className="form-control form-control-sm" value="0912345678" readOnly />
          </div>

          <div>
            <label className="form-label small fw-medium">Email</label>
            <input type="email" className="form-control form-control-sm" value="nguyenvana@email.com" readOnly />
          </div>

          <div>
            <label className="form-label small fw-medium">Địa chỉ</label>
            <textarea
              rows={2}
              className="form-control form-control-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button className="btn btn-indigo w-100 text-white fw-medium" style={{ backgroundColor: "#4f46e5" }}>
            Cập nhật thông tin
          </button>
        </div>
      </div>

      {/* Thông tin bệnh án */}
      <div className="bg-white rounded shadow-sm p-4">
        <h3 className="fw-semibold mb-3">Thông tin bệnh án</h3>
        <div className="d-flex flex-column gap-3">

          <div className="d-flex justify-content-between p-3 bg-light rounded">
            <div className="small">
              <div className="text-muted">Chẩn đoán</div>
              <div className="fw-medium">{userData.condition}</div>
            </div>
            <div className="small text-end">
              <div className="text-muted">Từ ngày</div>
              <div className="fw-medium">15/03/2023</div>
            </div>
          </div>

          <div className="p-3 bg-light rounded">
            <div className="small">
              <div className="text-muted">Tiền sử bệnh</div>
              <div className="fw-medium">Tăng huyết áp (2018), Rối loạn lipid máu (2020)</div>
            </div>
          </div>

          <div className="p-3 bg-light rounded">
            <div className="small">
              <div className="text-muted">Dị ứng</div>
              <div className="fw-medium">Không</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PersonalTabs;
