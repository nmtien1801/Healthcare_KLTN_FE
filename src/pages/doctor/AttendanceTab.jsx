import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import ApiWorkShift from "../../apis/ApiWorkShift";
import ApiDoctor from "../../apis/ApiDoctor";
import { formatDate } from "../../utils/formatDate";
import { listenStatus, sendStatus } from "../../utils/SetupSignFireBase";

// Shift options
const shiftOptions = [
    { key: "morning", label: "Sáng (08:00 - 12:00)", start: "08:00", end: "12:00" },
    { key: "afternoon", label: "Chiều (13:00 - 17:00)", start: "13:00", end: "17:00" },
    { key: "evening", label: "Tối (18:00 - 21:00)", start: "18:00", end: "21:00" },
];

// Work type options
const workTypeOptions = [
    { key: "fulltime", label: "Full Time", description: "Làm việc toàn thời gian" },
    { key: "parttime", label: "Part Time", description: "Làm việc bán thời gian" },
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

// Hàm tính ngày thứ Hai của tuần hiện tại
const getCurrentWeekStart = () => {
    const today = new Date();
    const day = today.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + offset);
    return monday.toISOString().split("T")[0];
};

// Confirmation Modal
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => (
    <div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
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
                            background: "#7d6c6cff",
                            border: "none",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "14px",
                        }}
                        onClick={onCancel}
                    >
                        Hủy
                    </button>
                    <button
                        className="btn px-3 py-2 fw-medium"
                        style={{
                            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                            border: "none",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "14px",
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
            <div className="modal-content" style={{ borderRadius: "12px", border: "none" }}>
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
                            border: "none",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "14px",
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
const ScheduleFormModal = ({
    show,
    onClose,
    weekStartDate,
    setWeekStartDate,
    handleWeekStartChange,
    handleSelectCurrentWeek,
    weeklySchedule,
    handleShiftToggle,
    isEditing,
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
        <div className="modal-dialog modal-dialog-centered modal-xl" style={{ marginTop: "70px" }}>
            <div className="modal-content" style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
                <div className="modal-header">
                    <h5 className="modal-title d-flex align-items-center gap-2">
                        <Edit size={20} />
                        {isEditing ? "Cập nhật lịch làm việc" : "Đăng ký lịch làm việc"}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        style={{ fontSize: "14px" }}
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
                                    border: "none",
                                    borderRadius: "6px",
                                    color: "white",
                                    fontSize: "14px",
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
                                        className={`card h-100 cursor-pointer ${workType === type.key ? "border-primary" : ""}`}
                                        style={{
                                            cursor: "pointer",
                                            border: workType === type.key ? "2px solid #007bff" : "1px solid #dee2e6",
                                            borderRadius: "8px",
                                            transition: "all 0.2s ease",
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
                                            <th key={shift.key} className="text-center">
                                                {shift.label}
                                            </th>
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
                            border: "none",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "14px",
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
                            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                            border: "none",
                            borderRadius: "6px",
                            color: "white",
                            fontSize: "14px",
                        }}
                        onClick={() => {
                            handleSaveOrUpdateSchedule();
                            onClose();
                        }}
                    >
                        {isEditing ? "Cập nhật" : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Saved Schedules Modal
const SavedSchedulesModal = ({ show, onClose, savedSchedules, formatDate, handleEditSchedule, handleDeleteSchedule }) => (
    <div
        className={`modal ${show ? "d-block" : "d-none"}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
        <div className="modal-dialog modal-dialog-centered modal-xl" style={{ marginTop: "70px" }}>
            <div className="modal-content" style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
                <div className="modal-header">
                    <h5 className="modal-title d-flex align-items-center gap-2">
                        <List size={20} /> Lịch làm việc đã lưu
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        style={{ fontSize: "14px" }}
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
                                    <th className="text-center">Loại hình</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedSchedules.map((item) => (
                                    <tr key={item.weekStartDate}>
                                        <td>{formatDate(item.weekStartDate)}</td>
                                        <td>
                                            {Object.entries(item.schedule).map(([dayKey, shifts]) => (
                                                <div key={dayKey} className="d-flex mb-1">
                                                    <div style={{ width: "80px", fontWeight: "bold" }}>
                                                        {weekdays.find((d) => d.key === dayKey)?.label}:
                                                    </div>
                                                    <div>
                                                        {shifts.length === 0 ? (
                                                            <span className="text-muted">Không có ca</span>
                                                        ) : (
                                                            shifts.map((shift, index) => (
                                                                <span
                                                                    key={`${dayKey}-${shift}-${index}`}
                                                                    className="badge bg-info text-white me-2"
                                                                >
                                                                    {shiftOptions.find((s) => s.key === shift)?.label}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-primary text-white">
                                                {workTypeOptions.find((wt) => wt.key === item.workType)?.label || "-"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn me-2 px-2 py-1 fw-medium"
                                                style={{
                                                    background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                    fontSize: "12px",
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
                                                    background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    color: "white",
                                                    fontSize: "12px",
                                                }}
                                                onClick={() => handleDeleteSchedule(item.weekStartDate)}
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

// CurrentSchedule component
const CurrentSchedule = ({ currentShift, user, doctorInfo, loadingDoctor }) => {
    return (
        <div className="m-2">
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
                            {loadingDoctor ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-start justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <div className="position-relative me-3">
                                            <img
                                                src={doctorInfo?.avatar || user?.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"}
                                                className="rounded-circle"
                                                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                            />
                                        </div>
                                        <div>
                                            <h5 className="mb-1 fw-bold text-dark">
                                                {doctorInfo?.username || user?.username || "Bác sĩ không xác định"}
                                            </h5>
                                            <p className="mb-0 text-muted">
                                                {doctorInfo?.specialty || "Chuyên khoa nội tiết"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column align-items-end">
                                        <span className="badge rounded-pill bg-success mb-2 px-3 py-2 d-flex align-items-center">
                                            <span className="me-1" style={{ fontSize: "0.75rem" }}>●</span> Online
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="mb-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Calendar className="text-primary me-2" size={18} />
                                    <span className="text-dark">
                                        {currentShift ? formatDate(currentShift.date) : "Không có ca làm việc hôm nay"}
                                    </span>
                                </div>
                                {currentShift && (
                                    <div className="d-flex align-items-center mb-3">
                                        <Clock className="text-primary me-2" size={18} />
                                        <span className="text-dark">{`${currentShift.start} - ${currentShift.end}`}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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
    const [currentShift, setCurrentShift] = useState(null);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoModalMessage, setInfoModalMessage] = useState("");
    const [infoModalTitle, setInfoModalTitle] = useState("");
    const [showScheduleFormModal, setShowScheduleFormModal] = useState(false);
    const [showSavedSchedulesModal, setShowSavedSchedulesModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState([]);
    const [filterType, setFilterType] = useState("week");
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
    const [weekStartDate, setWeekStartDate] = useState(getCurrentWeekStart());
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const [workType, setWorkType] = useState("parttime");
    const user = useSelector((state) => state.auth.userInfo);
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loadingDoctor, setLoadingDoctor] = useState(true);

    const firebaseUid = user?.uid || "doctor-firebase-uid";
    // Sửa: Sử dụng cùng UID cho doctor và patient để tạo room self-signaling
    const doctorUid = user.uid;
    const patientUid = user.uid; // Sử dụng cùng UID để đồng bộ trong cùng tài khoản
    const roomChats = [doctorUid, patientUid].sort().join("_"); // Room sẽ là uid_uid để lắng nghe tín hiệu tự gửi

    useEffect(() => {

        const unsub = listenStatus(roomChats, async (signal) => {
            console.log("Received signal:", signal, "from room:", roomChats); // Debug log
            if (!signal) return;
            if (["createWorkShifts", "deleteManyWorkShifts", "checkInWorkShift", "checkOutWorkShift"].includes(signal.status)) {
                try {
                    await fetchDoctorInfo();
                    await fetchShifts();

                } catch (error) {
                    console.error("Error syncing on signal:", error);
                }
            }
        })
        const fetchDoctorInfo = async () => {
            if (!firebaseUid) {
                setInfoModalTitle("Thông báo");
                setInfoModalMessage("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
                setShowInfoModal(true);
                setLoadingDoctor(false);
                return;
            }

            try {
                setLoadingDoctor(true);
                const response = await ApiDoctor.getDoctorInfo();
                setDoctorInfo({
                    username: response.userId?.username || "Bác sĩ không xác định",
                    hospital: response.hospital || "Bệnh viện không xác định",
                    avatar: response.userId?.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
                    experience: response.exp || 0,
                });
            } catch (error) {
                console.error("Error fetching doctor info:", error);
                setInfoModalTitle("Thông báo");
                setInfoModalMessage(`${error.message}`);
                setShowInfoModal(true);
                setDoctorInfo({
                    username: user?.username || "Bác sĩ không xác định",
                    hospital: "Bệnh viện không xác định",
                    avatarUrl: user?.avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
                    experience: 0,
                });
            } finally {
                setLoadingDoctor(false);
            }
        };

        fetchDoctorInfo();

        const fetchShifts = async () => {
            try {
                const shifts = await ApiWorkShift.getWorkShiftsByDoctor();
                console.log("Shifts from API:", shifts);

                const groupedSchedules = {};
                shifts.forEach((shift) => {
                    const date = new Date(shift.date);
                    if (isNaN(date.getTime())) return;

                    const weekStart = new Date(date);
                    const day = date.getDay();
                    const offset = day === 0 ? -6 : 1 - day;
                    weekStart.setDate(date.getDate() + offset);
                    const weekStartStr = weekStart.toISOString().split("T")[0];

                    if (!groupedSchedules[weekStartStr]) {
                        groupedSchedules[weekStartStr] = {
                            shiftIds: [],
                            weekStartDate: weekStartStr,
                            schedule: {},
                            workType: shift.workType || "parttime",
                        };
                    }

                    groupedSchedules[weekStartStr].shiftIds.push(shift._id);

                    const weekday = weekdays[day === 0 ? 6 : day - 1].key;
                    const shiftKey = shiftOptions.find(
                        (option) => option.start === shift.start && option.end === shift.end
                    )?.key || "parttime";

                    if (!groupedSchedules[weekStartStr].schedule[weekday]) {
                        groupedSchedules[weekStartStr].schedule[weekday] = [];
                    }
                    groupedSchedules[weekStartStr].schedule[weekday].push(shiftKey);
                });

                setSavedSchedules(Object.values(groupedSchedules));

                const todayShifts = await ApiWorkShift.getTodayWorkShifts();
                console.log("Today Shifts:", todayShifts);
                const current = todayShifts.find(
                    (s) => !s.attendance.checkedIn || (s.attendance.checkedIn && !s.attendance.checkedOut)
                );
                setCurrentShift(current || null);

                const history = shifts
                    .filter((shift) => shift.attendance?.checkedIn)
                    .map((shift) => {
                        const checkInTime = shift.attendance.checkInTime || "-";
                        const checkOutTime = shift.attendance.checkOutTime || "-";
                        let status = "-";
                        if (checkInTime !== "-") {
                            const [inHour, inMinute] = checkInTime.split(":").map(Number);
                            const [startHour, startMinute] = shift.start.split(":").map(Number);

                            // So sánh với giờ bắt đầu ca làm
                            if (inHour < startHour || (inHour === startHour && inMinute <= startMinute)) {
                                status = "Đúng giờ";
                            } else {
                                status = "Đi trễ";
                            }

                            // Xét thêm trạng thái check-out
                            if (shift.attendance.checkedOut) {
                                status = checkOutTime !== "-" ? status : "Online";
                            }
                        }

                        return {
                            date: shift.date,
                            checkIn: checkInTime,
                            checkOut: checkOutTime,
                            status,
                        };
                    });
                setAttendanceHistory(history);
            } catch (error) {
                console.error("Error fetching shifts:", error);
                setInfoModalTitle("Thông báo");
                setInfoModalMessage(`${error.message}`);
                setShowInfoModal(true);
            }
        };

        if (!firebaseUid) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            setShowInfoModal(true);
            return;
        }

        fetchShifts();

        return () => {
            unsub(); // Cleanup listener
        };
    }, [user.uid, roomChats]);
    // Thêm useEffect để tự động load lịch làm việc đã có cho tuần được chọn khi modal mở hoặc tuần thay đổi
    useEffect(() => {
        if (showScheduleFormModal) {
            const existingSchedule = savedSchedules.find((s) => s.weekStartDate === weekStartDate);
            if (existingSchedule) {
                setIsEditing(true);
                setWeeklySchedule(existingSchedule.schedule || {});
                setWorkType(existingSchedule.workType || "parttime");
            } else {
                setIsEditing(false);
                setWeeklySchedule({});
                setWorkType("parttime");
            }
        }
    }, [weekStartDate, showScheduleFormModal, savedSchedules]);

    const handleWeekStartChange = (e) => {
        const selectedDate = new Date(e.target.value);
        if (isNaN(selectedDate.getTime())) {
            setWeekStartDate(getCurrentWeekStart());
            return;
        }
        const day = selectedDate.getDay();
        const offset = day === 0 ? -6 : 1 - day;
        const monday = new Date(selectedDate);
        monday.setDate(selectedDate.getDate() + offset);
        setWeekStartDate(monday.toISOString().split("T")[0]);
    };

    const handleSelectCurrentWeek = () => {
        setWeekStartDate(getCurrentWeekStart());
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
            const fullTimeSchedule = {};
            weekdays.forEach((day) => {
                fullTimeSchedule[day.key] = shiftOptions.map((shift) => shift.key);
            });
            setWeeklySchedule(fullTimeSchedule);
        } else {
            setWeeklySchedule({});
        }
    };

    const handleSaveOrUpdateSchedule = async () => {
        if (!weekStartDate) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage("Vui lòng chọn ngày bắt đầu tuần.");
            setShowInfoModal(true);
            return;
        }

        try {
            const shiftsData = [];
            Object.entries(weeklySchedule).forEach(([dayKey, shifts]) => {
                const dayIndex = weekdays.findIndex((d) => d.key === dayKey);
                if (dayIndex === -1 || !shifts.length) return;

                const date = new Date(weekStartDate);
                date.setDate(date.getDate() + dayIndex);

                shifts.forEach((shiftKey) => {
                    const shiftOption = shiftOptions.find((s) => s.key === shiftKey);
                    if (shiftOption) {
                        shiftsData.push({
                            date: date.toISOString().split("T")[0],
                            start: shiftOption.start,
                            end: shiftOption.end,
                            workType,
                        });
                    }
                });
            });

            if (shiftsData.length === 0) {
                setInfoModalTitle("Thông báo");
                setInfoModalMessage("Vui lòng chọn ít nhất một ca làm việc.");
                setShowInfoModal(true);
                return;
            }

            let successMessage = "";
            if (isEditing) {
                // Edit: Xóa tất cả ca cũ của tuần, rồi tạo mới
                const editingSchedule = savedSchedules.find((s) => s.weekStartDate === weekStartDate);
                if (editingSchedule && editingSchedule.shiftIds.length > 0) {
                    await ApiWorkShift.deleteManyWorkShifts(editingSchedule.shiftIds);
                    sendStatus(doctorUid, patientUid, "deleteManyWorkShifts");
                }
                await ApiWorkShift.createWorkShifts({ shifts: shiftsData });
                sendStatus(doctorUid, patientUid, "createWorkShifts");
                successMessage = "Lịch làm việc đã được cập nhật!";
                setIsEditing(false); // Reset editing mode
            } else {
                // Create mới
                await ApiWorkShift.createWorkShifts({ shifts: shiftsData });
                sendStatus(doctorUid, patientUid, "createWorkShifts");
                successMessage = "Lịch làm việc đã được lưu!";
            }

            // Fetch lại để cập nhật state
            const shifts = await ApiWorkShift.getWorkShiftsByDoctor();
            const groupedSchedules = {};
            shifts.forEach((shift) => {
                const date = new Date(shift.date);
                if (isNaN(date.getTime())) return;

                const weekStart = new Date(date);
                const day = date.getDay();
                const offset = day === 0 ? -6 : 1 - day;
                weekStart.setDate(date.getDate() + offset);
                const weekStartStr = weekStart.toISOString().split("T")[0];

                if (!groupedSchedules[weekStartStr]) {
                    groupedSchedules[weekStartStr] = {
                        shiftIds: [],
                        weekStartDate: weekStartStr,
                        schedule: {},
                        workType: shift.workType || "parttime",
                    };
                }

                groupedSchedules[weekStartStr].shiftIds.push(shift._id);

                const weekday = weekdays[day === 0 ? 6 : day - 1].key;
                const shiftKey = shiftOptions.find(
                    (option) => option.start === shift.start && option.end === shift.end
                )?.key || "parttime";

                if (!groupedSchedules[weekStartStr].schedule[weekday]) {
                    groupedSchedules[weekStartStr].schedule[weekday] = [];
                }
                groupedSchedules[weekStartStr].schedule[weekday].push(shiftKey);
            });

            setSavedSchedules(Object.values(groupedSchedules));
            setInfoModalTitle("Thành công");
            setInfoModalMessage(successMessage);
            setShowInfoModal(true);
            resetScheduleForm();
        } catch (error) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage(`${error.response?.data?.message || error.message}`);
            setShowInfoModal(true);
        }
    };

    const resetScheduleForm = () => {
        setWeekStartDate(getCurrentWeekStart());
        setWeeklySchedule({});
        setIsEditing(false);
        setWorkType("parttime");
    };

    const handleEditSchedule = (schedule) => {
        setIsEditing(true);
        setWeekStartDate(schedule.weekStartDate);
        setWeeklySchedule(schedule.schedule);
        setWorkType(schedule.workType || "parttime");
        setShowScheduleFormModal(true);
    };

    const handleDeleteSchedule = async (weekStartDate) => {
        try {
            const schedule = savedSchedules.find((s) => s.weekStartDate === weekStartDate);
            if (schedule && schedule.shiftIds && schedule.shiftIds.length > 0) {
                setScheduleToDelete(schedule.shiftIds);
                setShowDeleteConfirmModal(true);
            } else {
                setInfoModalTitle("Thông báo");
                setInfoModalMessage("Không tìm thấy ca làm việc nào trong tuần này.");
                setShowInfoModal(true);
            }
        } catch (error) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage(`${error.response?.data?.message || error.message}`);
            setShowInfoModal(true);
        }
    };

    const confirmDeleteSchedule = async () => {
        if (scheduleToDelete && scheduleToDelete.length > 0) {
            try {
                const response = await ApiWorkShift.deleteManyWorkShifts(scheduleToDelete);
                sendStatus(doctorUid, patientUid, "deleteManyWorkShifts");

                // Fetch lại để cập nhật state
                const shifts = await ApiWorkShift.getWorkShiftsByDoctor();
                const groupedSchedules = {};
                shifts.forEach((shift) => {
                    const date = new Date(shift.date);
                    if (isNaN(date.getTime())) return;

                    const weekStart = new Date(date);
                    const day = date.getDay();
                    const offset = day === 0 ? -6 : 1 - day;
                    weekStart.setDate(date.getDate() + offset);
                    const weekStartStr = weekStart.toISOString().split("T")[0];

                    if (!groupedSchedules[weekStartStr]) {
                        groupedSchedules[weekStartStr] = {
                            shiftIds: [],
                            weekStartDate: weekStartStr,
                            schedule: {},
                            workType: shift.workType || "parttime",
                        };
                    }

                    groupedSchedules[weekStartStr].shiftIds.push(shift._id);

                    const weekday = weekdays[day === 0 ? 6 : day - 1].key;
                    const shiftKey = shiftOptions.find(
                        (option) => option.start === shift.start && option.end === shift.end
                    )?.key || "parttime";

                    if (!groupedSchedules[weekStartStr].schedule[weekday]) {
                        groupedSchedules[weekStartStr].schedule[weekday] = [];
                    }
                    groupedSchedules[weekStartStr].schedule[weekday].push(shiftKey);
                });

                setSavedSchedules(Object.values(groupedSchedules));
                setInfoModalTitle("Thành công");
                setInfoModalMessage(`Đã xóa ${response.deletedCount} ca làm việc!`);
                setShowInfoModal(true);
            } catch (error) {
                setInfoModalTitle("Thông báo");
                setInfoModalMessage(`${error.response?.data?.message || error.message}`);
                setShowInfoModal(true);
            }
        }
        setShowDeleteConfirmModal(false);
        setScheduleToDelete([]);
    };

    const cancelDeleteSchedule = () => {
        setShowDeleteConfirmModal(false);
        setScheduleToDelete([]);
    };

    const handleCheckIn = async () => {
        try {
            const now = new Date();
            const checkInTimeStr = now.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const shift = await ApiWorkShift.checkInWorkShift("webcam");
            sendStatus(doctorUid, patientUid, "checkInWorkShift");

            setCheckInTime(checkInTimeStr);
            setAttendanceHistory((prev) => {
                const todayDate = now.toISOString().split("T")[0];
                const existingEntryIndex = prev.findIndex((entry) => entry.date === todayDate);
                if (existingEntryIndex > -1) {
                    const updatedHistory = [...prev];
                    updatedHistory[existingEntryIndex] = {
                        ...updatedHistory[existingEntryIndex],
                        checkIn: checkInTimeStr,
                        checkOut: null,
                        status: "Online",
                    };
                    return updatedHistory;
                }
                return [
                    ...prev,
                    { date: todayDate, checkIn: checkInTimeStr, checkOut: null, status: "Online" },
                ];
            });

            setInfoModalTitle("Chấm công");
            setInfoModalMessage(`Bạn đã chấm công vào lúc: ${checkInTimeStr}`);
            setShowInfoModal(true);
            setCheckOutTime(null);

            const updatedShifts = await ApiWorkShift.getTodayWorkShifts();
            const current = updatedShifts.find(
                (s) => !s.attendance.checkedIn || (s.attendance.checkedIn && !s.attendance.checkedOut)
            );
            setCurrentShift(current || null);
        } catch (error) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage(`${error.response?.data?.message || error.message}`);
            setShowInfoModal(true);
        }
    };

    const handleCheckOut = async () => {
        if (!checkInTime) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage("Bạn phải chấm công vào trước khi chấm công ra.");
            setShowInfoModal(true);
            return;
        }

        try {
            const now = new Date();
            const checkOutTimeStr = now.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const shift = await ApiWorkShift.checkOutWorkShift("webcam");
            sendStatus(doctorUid, patientUid, "checkOutWorkShift");

            setCheckOutTime(checkOutTimeStr);
            setAttendanceHistory((prev) => {
                const todayDate = now.toISOString().split("T")[0];
                const existingEntryIndex = prev.findIndex((entry) => entry.date === todayDate);
                const existingCheckIn = prev[existingEntryIndex]?.checkIn;
                let status = "-";
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

            const updatedShifts = await ApiWorkShift.getTodayWorkShifts();
            const current = updatedShifts.find(
                (s) => !s.attendance.checkedIn || (s.attendance.checkedIn && !s.attendance.checkedOut)
            );
            setCurrentShift(current || null);
        } catch (error) {
            setInfoModalTitle("Thông báo");
            setInfoModalMessage(`${error.response?.data?.message || error.message}`);
            setShowInfoModal(true);
        }
    };

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
            <CurrentSchedule currentShift={currentShift} user={doctorInfo} loadingDoctor={loadingDoctor} />
            <div className="m-2">
                <div className="bg-white rounded shadow border p-4">
                    <h2 className="h5 mb-2">Chấm công</h2>
                    <p className="text-muted mb-4">Quản lý thời gian làm việc của bạn</p>

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

                    <div className="d-flex justify-content-center gap-3 mb-4">
                        <button
                            className="btn px-3 py-2 text-white fw-medium"
                            style={{
                                background: "#3A3DF7",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)",
                                transition: "all 0.2s ease",
                                minWidth: "120px",
                            }}
                            onClick={handleCheckIn}
                            disabled={checkInTime && !checkOutTime}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.transform = "translateY(-1px)";
                                    e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.4)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(40, 167, 69, 0.3)";
                            }}
                        >
                            <CheckCircle size={16} className="me-1" /> Chấm vào
                        </button>
                        <button
                            className="btn px-3 py-2 text-white fw-medium"
                            style={{
                                background: "#ff0019ff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
                                transition: "all 0.2s ease",
                                minWidth: "120px",
                            }}
                            onClick={handleCheckOut}
                            disabled={!checkInTime || checkOutTime}
                            onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                    e.target.style.transform = "translateY(-1px)";
                                    e.target.style.boxShadow = "0 4px 12px rgba(249, 8, 32, 0.4)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(227, 23, 43, 0.3)";
                            }}
                        >
                            <LogOut size={16} className="me-1" /> Chấm ra
                        </button>
                    </div>

                    <div className="d-flex justify-content-start gap-3 mb-4">
                        <button
                            className="btn px-3 py-2 text-white fw-medium d-flex align-items-center"
                            style={{
                                background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                boxShadow: "0 2px 8px rgba(0, 123, 255, 0.3)",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => setShowScheduleFormModal(true)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-1px)";
                                e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(0, 123, 255, 0.3)";
                            }}
                        >
                            <PlusCircle size={16} className="me-1" /> Đăng ký lịch
                        </button>
                        <button
                            className="btn px-3 py-2 text-white fw-medium d-flex align-items-center"
                            style={{
                                background: "linear-gradient(135deg, #17a2b8 0%, #0dcaf0 100%)",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                boxShadow: "0 2px 8px rgba(23, 162, 184, 0.3)",
                                transition: "all 0.2s ease",
                            }}
                            onClick={() => setShowSavedSchedulesModal(true)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = "translateY(-1px)";
                                e.target.style.boxShadow = "0 4px 12px hsla(190, 93%, 53%, 0.45)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "0 2px 8px rgba(14, 219, 251, 0.37)";
                            }}
                        >
                            <List size={16} className="me-1" /> Lịch đã lưu
                        </button>
                    </div>

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
                            <div className="alert alert-info text-center">
                                Chưa có lịch sử chấm công trong khoảng thời gian này.
                            </div>
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
                                                <td>{formatDate(entry.date)}</td>
                                                <td>{entry.checkIn || "-"}</td>
                                                <td>{entry.checkOut || "-"}</td>
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
                isEditing={isEditing}
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