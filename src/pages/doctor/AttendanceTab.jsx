import React, { useState, useEffect } from "react";
import {
    Calendar,
    Clock,
    CheckCircle,
    Trash2,
    Edit,
    Info,
    PlusCircle,
    List,
    Shield,
    Award,
    Clock as Clock24,
    LogOut,
} from "lucide-react";

// Shift options
const shiftOptions = [
    { key: "morning", label: "Sáng (08:00 - 12:00)" },
    { key: "afternoon", label: "Chiều (13:00 - 17:00)" },
    { key: "evening", label: "Tối (18:00 - 21:00)" },
];

// Work type options
const workTypeOptions = [
    { key: "fulltime", label: "Full Time", description: "Làm việc toàn thời gian" },
    { key: "custom", label: "Part Time", description: "Làm việc bán thời gian" },
];

// Weekday options
const weekdays = [
    { label: "Thứ 2", key: "monday" },
    { label: "Thứ 3", key: "tuesday" },
    { label: "Thứ 4", key: "wednesday" },
    { label: "Thứ 5", key: "thursday" },
    { label: "Thứ 6", key: "friday" },
    { label: "Thứ 7", key: "saturday" },
    { label: "Chủ nhật", key: "sunday" },
];

// Confirmation Modal
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => (
    <div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
                <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold text-danger d-flex align-items-center">
                        <Trash2 size={20} className="me-2" />
                        {title}
                    </h5>
                </div>
                <div className="modal-body py-3">
                    <p className="mb-0">{message}</p>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                    <button
                        className="btn px-3 py-2 fw-medium"
                        style={{
                            background: '#7d6c6cff',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn px-3 py-2 fw-medium"
                        style={{
                            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        onClick={onConfirm}
                    >
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Info Modal
const InfoModal = ({ show, title, message, onClose }) => (
    <div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
                <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold text-primary d-flex align-items-center">
                        <Info size={20} className="me-2" />
                        {title}
                    </h5>
                </div>
                <div className="modal-body py-3">
                    <p className="mb-0">{message}</p>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-end">
                    <button
                        className="btn px-3 py-2 fw-medium"
                        style={{
                            background: "linear-gradient(135deg, #4fc9feff 0%, #ff66f0ff 100%)",
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Schedule Form Modal
// Schedule Form Modal
const ScheduleFormModal = ({
    show,
    onClose,
    weekStartDate,
    setWeekStartDate,
    handleWeekStartChange,
    handleSelectCurrentWeek,
    weeklySchedule,
    handleShiftToggle,
    editingScheduleId,
    resetScheduleForm,
    handleSaveOrUpdateSchedule,
    workType,
    setWorkType,
    handleWorkTypeChange,
}) => (
    <div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog modal-dialog-centered modal-xl" style={{ marginTop: '70px' }}> {/* Hạ modal xuống 70px và tăng kích thước thành modal-xl */}
            <div className="modal-content" style={{ maxWidth: "900px", marginLeft: 'auto', marginRight: 'auto' }}> {/* Tăng maxWidth để modal dài hơn */}
                <div className="modal-header">
                    <h5 className="modal-title d-flex align-items-center gap-2">
                        <Edit size={20} />{" "}
                        {editingScheduleId ? "Cập nhật lịch làm việc" : "Đăng ký lịch làm việc"}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        style={{ fontSize: '14px' }}
                    ></button>
                </div>
                <div className="modal-body">
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Chọn tuần</label>
                        <div className="d-flex justify-content-center gap-2">
                            <input
                                type="date"
                                className="form-control w-auto"
                                value={weekStartDate}
                                onChange={handleWeekStartChange}
                                min={new Date().toISOString().split("T")[0]}
                            />
                            <button
                                className="btn px-3 py-2 fw-medium"
                                style={{
                                    background: "linear-gradient(135deg, #4fc9feff 0%, #ff66f0ff 100%)",
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    fontSize: '14px'
                                }}
                                onClick={handleSelectCurrentWeek}
                            >
                                <Calendar size={16} className="me-1" /> Tuần hiện tại
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Loại hình làm việc</label>
                        <div className="row g-3 justify-content-center">
                            {workTypeOptions.map((type) => (
                                <div key={type.key} className="col-md-6">
                                    <div
                                        className={`card h-100 cursor-pointer ${workType === type.key ? 'border-primary' : ''}`}
                                        style={{
                                            cursor: 'pointer',
                                            border: workType === type.key ? '2px solid #007bff' : '1px solid #dee2e6',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => handleWorkTypeChange(type.key)}
                                    >
                                        <div className="card-body text-center p-3">
                                            <h6 className="card-title mb-2">{type.label}</h6>
                                            <p className="card-text small text-muted mb-0">{type.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold text-center d-block">Chọn ca làm việc</label>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Ngày</th>
                                        {shiftOptions.map((shift) => (
                                            <th key={shift.key} className="text-center">{shift.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {weekdays.map((day) => (
                                        <tr key={day.key}>
                                            <td className="fw-semibold">{day.label}</td>
                                            {shiftOptions.map((shift) => (
                                                <td key={shift.key} className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`${day.key}-${shift.key}`}
                                                        className="form-check-input"
                                                        checked={weeklySchedule[day.key]?.includes(shift.key) || false}
                                                        onChange={() => handleShiftToggle(day.key, shift.key)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                    <button
                        className="btn px-3 py-2 fw-medium"
                        style={{
                            background: "linear-gradient(135deg, #4fc9feff 0%, #ff66f0ff 100%)",
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        onClick={() => {
                            resetScheduleForm();
                            onClose();
                        }}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn px-3 py-2 fw-medium"
                        style={{
                            background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px'
                        }}
                        onClick={() => {
                            handleSaveOrUpdateSchedule();
                            onClose();
                        }}
                    >
                        {editingScheduleId ? "Cập nhật" : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Saved Schedules Modal
const SavedSchedulesModal = ({
    show,
    onClose,
    savedSchedules,
    formatDate,
    handleEditSchedule,
    handleDeleteSchedule,
}) => (
    <div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog modal-dialog-centered modal-lg" style={{ marginTop: '50px' }}> {/* Hạ modal xuống 50px để tránh che header */}
            <div className="modal-content" style={{ maxWidth: "700px" }}>
                <div className="modal-header">
                    <h5 className="modal-title d-flex align-items-center gap-2">
                        <List size={20} /> Lịch làm việc đã lưu
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        style={{ fontSize: '14px' }}
                    ></button>
                </div>
                <div className="modal-body">
                    {savedSchedules.length === 0 ? (
                        <div className="alert alert-info">Chưa có lịch làm việc nào được lưu.</div>
                    ) : (
                        <table className="table table-bordered table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Tuần bắt đầu</th>
                                    <th>Lịch làm</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedSchedules.map((item) => (
                                    <tr key={item.id}>
                                        <td>{formatDate(item.weekStartDate)}</td>
                                        <td>
                                            {Object.entries(item.schedule).map(([dayKey, shifts]) => (
                                                <div key={dayKey} className="mb-1">
                                                    <strong>{weekdays.find((d) => d.key === dayKey)?.label}:</strong>{" "}
                                                    {shifts.length === 0 ? (
                                                        <span className="text-muted">Không có ca</span>
                                                    ) : (
                                                        shifts.map((shift) => (
                                                            <span key={shift} className="badge bg-info text-white me-1">
                                                                {shiftOptions.find((s) => s.key === shift)?.label}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn me-2 px-2 py-1 fw-medium"
                                                style={{
                                                    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => {
                                                    onClose();
                                                    handleEditSchedule(item);
                                                }}
                                            >
                                                <Edit size={14} className="me-1" />
                                                Sửa
                                            </button>
                                            <button
                                                className="btn px-2 py-1 fw-medium"
                                                style={{
                                                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    color: 'white',
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => handleDeleteSchedule(item.id)}
                                            >
                                                <Trash2 size={14} className="me-1" />
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-outline-secondary" onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// CurrentSchedule component (tương tự upcomingAppointment)
const CurrentSchedule = () => {
    return (
        <div className="container my-3">
            <div className="bg-white rounded shadow border p-4">
                <div>
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <Calendar className="text-primary me-2" size={24} />
                        <h4 className="mb-0 fw-bold text-dark">Lịch làm việc hiện tại</h4>
                    </div>

                    {/* Schedule Card */}
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
                                        <span className="me-1" style={{ fontSize: "0.75rem" }}>●</span> Đang làm việc
                                    </span>
                                </div>
                            </div>

                            {/* Schedule Details */}
                            <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Calendar className="text-primary me-2" size={18} />
                                    <span className="text-dark">Tuần từ 28/7/2025</span>
                                </div>
                                <div className="d-flex align-items-center mb-3">
                                    <Clock className="text-primary me-2" size={18} />
                                    <span className="text-dark">Sáng (08:00 - 12:00), Thứ 2 - Thứ 6</span>
                                </div>
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
        </div>
    );
};

// AttendanceTab component (main component)
const AttendanceTab = () => {
    const [savedSchedules, setSavedSchedules] = useState([]);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([
        { date: "2025-07-26", checkIn: "08:00", checkOut: "17:00", status: "Đúng giờ" },
        { date: "2025-07-27", checkIn: "08:15", checkOut: "17:00", status: "Đi trễ" },
        { date: "2025-07-28", checkIn: "07:55", checkOut: "17:05", status: "Đúng giờ" },
    ]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalMessage, setInfoModalMessage] = useState("");
    const [infoModalTitle, setInfoModalTitle] = useState("");
    const [showScheduleFormModal, setShowScheduleFormModal] = useState(false);
    const [showSavedSchedulesModal, setShowSavedSchedulesModal] = useState(false);
    const [filterType, setFilterType] = useState("week");
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
    const [weekStartDate, setWeekStartDate] = useState("");
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [editingScheduleId, setEditingScheduleId] = useState(null);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState(null);
    const [workType, setWorkType] = useState("custom");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleWeekStartChange = (e) => {
        const selectedDate = new Date(e.target.value);
        if (isNaN(selectedDate.getTime())) {
            setWeekStartDate("");
            return;
        }
        const day = selectedDate.getDay();
        const offset = day === 0 ? -6 : 1 - day;
        const monday = new Date(selectedDate);
        monday.setDate(selectedDate.getDate() + offset);
        setWeekStartDate(monday.toISOString().split("T")[0]);
    };

    const handleSelectCurrentWeek = () => {
        const today = new Date();
        const day = today.getDay();
        const offset = day === 0 ? -6 : 1 - day;
        const monday = new Date(today);
        monday.setDate(today.getDate() + offset);
        setWeekStartDate(monday.toISOString().split("T")[0]);
    };

    const handleShiftToggle = (dayKey, shiftKey) => {
        setWeeklySchedule((prev) => {
            const current = prev[dayKey] || [];
            const updated = current.includes(shiftKey)
                ? current.filter((s) => s !== shiftKey)
                : [...current, shiftKey];
            return { ...prev, [dayKey]: updated };
        });
    };

    const handleWorkTypeChange = (type) => {
        setWorkType(type);
        if (type === "fulltime") {
            // Full time: tất cả ngày, tất cả ca
            const fullTimeSchedule = {};
            weekdays.forEach(day => {
                fullTimeSchedule[day.key] = shiftOptions.map(shift => shift.key);
            });
            setWeeklySchedule(fullTimeSchedule);
        } else {
            // Part time (custom): reset về empty để người dùng tự chọn
            setWeeklySchedule({});
        }
    };

    const handleSaveOrUpdateSchedule = () => {
        if (!weekStartDate) {
            setInfoModalTitle("Lỗi");
            setInfoModalMessage("Vui lòng chọn ngày bắt đầu tuần.");
            setShowInfoModal(true);
            return;
        }

        const isDuplicateWeek = savedSchedules.some(
            (s) => s.weekStartDate === weekStartDate && s.id !== editingScheduleId
        );

        if (isDuplicateWeek) {
            setInfoModalTitle("Lỗi");
            setInfoModalMessage("Lịch làm việc cho tuần này đã tồn tại. Vui lòng chọn tuần khác hoặc chỉnh sửa lịch đã có.");
            setShowInfoModal(true);
            return;
        }

        if (editingScheduleId) {
            setSavedSchedules((prev) =>
                prev.map((s) =>
                    s.id === editingScheduleId
                        ? { ...s, weekStartDate, schedule: weeklySchedule }
                        : s
                )
            );
            setInfoModalTitle("Thành công");
            setInfoModalMessage("Lịch làm việc đã được cập nhật!");
        } else {
            const newSchedule = {
                id: Date.now(),
                weekStartDate,
                schedule: weeklySchedule,
            };
            setSavedSchedules((prev) => [...prev, newSchedule]);
            setInfoModalTitle("Thành công");
            setInfoModalMessage("Lịch làm việc đã được lưu!");
        }

        setShowInfoModal(true);
        resetScheduleForm();
    };

    const resetScheduleForm = () => {
        setWeekStartDate("");
        setWeeklySchedule({});
        setEditingScheduleId(null);
        setWorkType("custom");
    };

    const handleEditSchedule = (schedule) => {
        setEditingScheduleId(schedule.id);
        setWeekStartDate(schedule.weekStartDate);
        setWeeklySchedule(schedule.schedule);
        setShowScheduleFormModal(true);
    };

    const handleDeleteSchedule = (id) => {
        setScheduleToDelete(id);
        setShowDeleteConfirmModal(true);
    };

    const confirmDeleteSchedule = () => {
        if (scheduleToDelete) {
            setSavedSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete));
            setInfoModalTitle("Thành công");
            setInfoModalMessage("Lịch làm việc đã được xóa!");
            setShowInfoModal(true);
        }
        setShowDeleteConfirmModal(false);
        setScheduleToDelete(null);
    };

    const cancelDeleteSchedule = () => {
        setShowDeleteConfirmModal(false);
        setScheduleToDelete(null);
    };

    const handleCheckIn = () => {
        const now = new Date();
        const checkInTimeStr = now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const todayDate = now.toISOString().split("T")[0];

        setCheckInTime(checkInTimeStr);
        setAttendanceHistory((prev) => {
            const existingEntryIndex = prev.findIndex((entry) => entry.date === todayDate);
            if (existingEntryIndex > -1) {
                const updatedHistory = [...prev];
                updatedHistory[existingEntryIndex] = {
                    ...updatedHistory[existingEntryIndex],
                    checkIn: checkInTimeStr,
                    checkOut: null,
                    status: "Đang làm việc",
                };
                return updatedHistory;
            }
            return [
                ...prev,
                { date: todayDate, checkIn: checkInTimeStr, checkOut: null, status: "Đang làm việc" },
            ];
        });

        setInfoModalTitle("Chấm công");
        setInfoModalMessage(`Bạn đã chấm công vào lúc: ${checkInTimeStr}`);
        setShowInfoModal(true);
        setCheckOutTime(null);
    };

    const handleCheckOut = () => {
        if (!checkInTime) {
            setInfoModalTitle("Lỗi");
            setInfoModalMessage("Bạn phải chấm công vào trước khi chấm công ra.");
            setShowInfoModal(true);
            return;
        }

        const now = new Date();
        const checkOutTimeStr = now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const todayDate = now.toISOString().split("T")[0];

        setCheckOutTime(checkOutTimeStr);
        setAttendanceHistory((prev) => {
            const existingEntryIndex = prev.findIndex((entry) => entry.date === todayDate);
            const existingCheckIn = prev[existingEntryIndex]?.checkIn;
            let status = "N/A";
            if (existingCheckIn) {
                const [inHour, inMinute] = existingCheckIn.split(":").map(Number);
                status = inHour < 8 || (inHour === 8 && inMinute === 0) ? "Đúng giờ" : "Đi trễ";
            }

            if (existingEntryIndex > -1) {
                const updatedHistory = [...prev];
                updatedHistory[existingEntryIndex] = {
                    ...updatedHistory[existingEntryIndex],
                    checkOut: checkOutTimeStr,
                    status,
                };
                return updatedHistory;
            }
            return [
                ...prev,
                { date: todayDate, checkIn: checkInTime, checkOut: checkOutTimeStr, status },
            ];
        });

        setInfoModalTitle("Chấm công");
        setInfoModalMessage(`Bạn đã chấm công ra lúc: ${checkOutTimeStr}`);
        setShowInfoModal(true);
        setCheckInTime(null);
        setCheckOutTime(null);
    };

    const formatDate = (d) => {
        if (!d) return "";
        const [year, month, day] = d.split("-");
        return `${day}/${month}/${year}`;
    };

    // Filter attendance history by week or month
    const getFilteredHistory = () => {
        const selectedDate = new Date(filterDate);
        if (filterType === "week") {
            const day = selectedDate.getDay();
            const offset = day === 0 ? -6 : 1 - day;
            const weekStart = new Date(selectedDate);
            weekStart.setDate(selectedDate.getDate() + offset);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return attendanceHistory.filter((entry) => {
                const entryDate = new Date(entry.date);
                return entryDate >= weekStart && entryDate <= weekEnd;
            });
        } else {
            const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
            return attendanceHistory.filter((entry) => {
                const entryDate = new Date(entry.date);
                return entryDate >= monthStart && entryDate <= monthEnd;
            });
        }
    };

    const filteredHistory = getFilteredHistory();

    return (
        <div>
            <CurrentSchedule />
            <div className="container my-4">
                <div className="bg-white rounded shadow border p-4">
                    <h2 className="h5 mb-2">Chấm công</h2>
                    <p className="text-muted mb-4">Quản lý thời gian làm việc của bạn</p>

                    {/* Current Time */}
                    <div className="text-center mb-4">
                        <h5 className="fw-bold text-dark d-flex align-items-center justify-content-center gap-2">
                            <Clock size={20} className="text-primary" />
                            {currentTime.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </h5>
                    </div>

                    {/* Check-in/Check-out Buttons */}
                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <button
                            className="btn px-3 py-2 text-white fw-medium"
                            style={{
                                background: '#3A3DF7',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)',
                                transition: 'all 0.2s ease',
                                minWidth: '120px'
                            }}
                            onClick={handleCheckIn}
                            disabled={checkInTime && !checkOutTime}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
                            }}
                        >
                            <CheckCircle size={16} className="me-1" /> Chấm vào
                        </button>
                        <button
                            className="btn px-3 py-2 text-white fw-medium"
                            style={{
                                background: '#ff0019ff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                                transition: 'all 0.2s ease',
                                minWidth: '120px'
                            }}
                            onClick={handleCheckOut}
                            disabled={!checkInTime || checkOutTime}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.transform = 'translateY(-1px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(249, 8, 32, 0.4)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(227, 23, 43, 0.3)';
                            }}
                        >
                            <LogOut size={16} className="me-1" /> Chấm ra
                        </button>
                    </div>

                    {/* Action Buttons (Aligned Left) */}
                    <div className="d-flex justify-content-start gap-3 mb-4">
                        <button
                            className="btn px-3 py-2 text-white fw-medium d-flex align-items-center"
                            style={{
                                background: 'linear-gradient(135deg, #007bff 0%, #6610f2 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setShowScheduleFormModal(true)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
                            }}
                        >
                            <PlusCircle size={16} className="me-1" /> Đăng ký lịch
                        </button>
                        <button
                            className="btn px-3 py-2 text-white fw-medium d-flex align-items-center"
                            style={{
                                background: 'linear-gradient(135deg, #17a2b8 0%, #0dcaf0 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxShadow: '0 2px 8px rgba(23, 162, 184, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => setShowSavedSchedulesModal(true)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px hsla(190, 93%, 53%, 0.45)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = ' 0 2px 8px rgba(14, 219, 251, 0.37)';
                            }}
                        >
                            <List size={16} className="me-1" /> Lịch đã lưu
                        </button>
                    </div>

                    {/* Attendance History */}
                    <div className="mt-4">
                        <h5 className="mb-3 fw-semibold">Lịch sử chấm công</h5>
                        <div className="d-flex gap-2 mb-3">
                            <select
                                className="form-select w-auto"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="week">Theo tuần</option>
                                <option value="month">Theo tháng</option>
                            </select>
                            <input
                                type="date"
                                className="form-control w-auto"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                        {filteredHistory.length === 0 ? (
                            <div className="alert alert-info text-center">Chưa có lịch sử chấm công trong khoảng thời gian này.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Giờ vào</th>
                                            <th>Giờ ra</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredHistory.map((entry, idx) => (
                                            <tr key={idx}>
                                                <td>{entry.date}</td>
                                                <td>{entry.checkIn || "N/A"}</td>
                                                <td>{entry.checkOut || "N/A"}</td>
                                                <td>
                                                    <span
                                                        className={`badge rounded-pill ${entry.status === "Đúng giờ"
                                                            ? "bg-success"
                                                            : entry.status === "Đi trễ"
                                                                ? "bg-warning text-dark"
                                                                : "bg-info"
                                                            } text-white px-3 py-1`}
                                                    >
                                                        {entry.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ScheduleFormModal
                show={showScheduleFormModal}
                onClose={() => {
                    setShowScheduleFormModal(false);
                    resetScheduleForm();
                }}
                weekStartDate={weekStartDate}
                setWeekStartDate={setWeekStartDate}
                handleWeekStartChange={handleWeekStartChange}
                handleSelectCurrentWeek={handleSelectCurrentWeek}
                weeklySchedule={weeklySchedule}
                handleShiftToggle={handleShiftToggle}
                editingScheduleId={editingScheduleId}
                resetScheduleForm={resetScheduleForm}
                handleSaveOrUpdateSchedule={handleSaveOrUpdateSchedule}
                workType={workType}
                setWorkType={setWorkType}
                handleWorkTypeChange={handleWorkTypeChange}
            />
            <SavedSchedulesModal
                show={showSavedSchedulesModal}
                onClose={() => setShowSavedSchedulesModal(false)}
                savedSchedules={savedSchedules}
                formatDate={formatDate}
                handleEditSchedule={handleEditSchedule}
                handleDeleteSchedule={handleDeleteSchedule}
            />
            <InfoModal
                show={showInfoModal}
                title={infoModalTitle}
                message={infoModalMessage}
                onClose={() => setShowInfoModal(false)}
            />
            <ConfirmationModal
                show={showDeleteConfirmModal}
                title="Xác nhận xóa"
                message="Bạn có chắc chắn muốn xóa lịch làm việc này không? Hành động này không thể hoàn tác."
                onConfirm={confirmDeleteSchedule}
                onCancel={cancelDeleteSchedule}
            />
        </div>
    );
};

export default AttendanceTab;