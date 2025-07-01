import React, { useState } from "react";
import { Hospital, Video, Calendar, Clock, ChevronDown } from 'lucide-react';


const BookingTabs = () => {
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    condition: "Tiểu đường type 2",
    doctor: "Bác sĩ Trần Thị B",
    nextAppointment: "2025-06-30",
    bloodSugar: [5.6, 6.2, 5.8, 6.5, 6.0, 5.9, 6.3],
  });

  const formattedDate = new Date(userData.nextAppointment).toLocaleDateString(
    "vi-VN"
  );

  const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"];

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-2">
        <h2 className="font-semibold text-lg">Đặt lịch khám</h2>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <h3 className="fw-semibold mb-3">Lịch hẹn sắp tới</h3>

        <div className="bg-light p-4 rounded">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-medium text-primary">{userData.doctor}</div>
              <div className="text-muted small">Chuyên khoa Nội tiết</div>
              <div className="text-muted small mt-1 d-flex align-items-center gap-1">
                <Calendar size={16} className="text-muted" />
                {formattedDate}
              </div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <Clock size={16} className="text-muted" />
                09:30 - 10:00
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <button className="btn btn-sm btn-primary rounded-pill d-flex align-items-center gap-1">
                <Video size={16} />
                Khám online
              </button>
              <button className="btn btn-sm btn-outline-primary rounded-pill">
                Hủy lịch
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm p-4">
        <h3 className="fw-semibold mb-3">Đặt lịch khám mới</h3>
        <div className="d-flex flex-column gap-3">
          {/* Loại hình khám */}
          <div>
            <label className="form-label small fw-medium text-muted">
              Loại hình khám
            </label>
            <div className="row g-3">
              <div className="col-6">
                <div className="border border-primary bg-light rounded text-center p-3 cursor-pointer">
                  <Hospital size={20} className="text-primary mb-2 d-block mx-auto" />
                  <div className="small fw-medium text-primary">
                    Khám tại phòng khám
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="border border-secondary rounded text-center p-3 cursor-pointer">
                  <Video
                    size={20}
                    className="text-secondary mb-2 d-block mx-auto"
                  />
                  <div className="small fw-medium text-secondary">
                    Khám trực tuyến
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chọn bác sĩ */}
          <div>
            <label className="form-label small fw-medium text-muted">
              Chọn bác sĩ
            </label>
            <div className="position-relative">
              <select className="form-select form-select-sm">
                <option>Bác sĩ Trần Thị B - Chuyên khoa Nội tiết</option>
                <option>Bác sĩ Lê Văn C - Chuyên khoa Nội tiết</option>
                <option>Bác sĩ Phạm Thị D - Chuyên khoa Nội tiết</option>
              </select>
              <div className="position-absolute top-50 end-0 translate-middle-y pe-3 pointer-events-none">
                <ChevronDown size={16} className="text-muted" />
              </div>
            </div>
          </div>

          {/* Chọn ngày */}
          <div>
            <label className="form-label small fw-medium text-muted">
              Chọn ngày
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              min="2025-06-24"
            />
          </div>

          {/* Chọn giờ */}
          <div>
            <label className="form-label small fw-medium text-muted">
              Chọn giờ
            </label>
            <div className="row g-2">
              {timeSlots.map((time, index) => (
                <div key={index} className="col-4">
                  <div
                    className={`text-center small p-2 rounded border ${index === 3
                      ? "border-primary bg-light text-primary"
                      : "border-secondary text-secondary"
                      } cursor-pointer`}
                  >
                    {time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lý do khám */}
          <div>
            <label className="form-label small fw-medium text-muted">
              Lý do khám
            </label>
            <textarea
              rows={3}
              className="form-control form-control-sm"
              placeholder="Mô tả ngắn gọn lý do bạn muốn khám"
            ></textarea>
          </div>

          {/* Nút xác nhận */}
          <button className="btn btn-primary w-100 fw-medium">
            Xác nhận đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTabs;
