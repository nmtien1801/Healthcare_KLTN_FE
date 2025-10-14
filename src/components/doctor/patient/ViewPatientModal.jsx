import { useState, useEffect } from "react";
import {
    Calendar,
    Phone,
    Mail,
    MapPin,
    Heart,
    AlertTriangle,
    User,
    FileText,
    UserCheck,
} from "lucide-react";
import { Button, Badge, Avatar } from "../common-ui-components";
import PastAppointmentsModal from "./PastAppointmentsModal";
import { useSelector } from "react-redux";
import { listenStatus } from "../../../utils/SetupSignFireBase";
import ApiPatient from "../../../apis/ApiPatient";

// Hàm ánh xạ dữ liệu từ API sang định dạng phù hợp với component (tái sử dụng từ PatientTab)
const mapPatientData = (apiPatient, pastAppointments = []) => {
    const statusColors = {
        "Cần theo dõi": { color: "bg-danger", textColor: "text-white" },
        "Đang điều trị": { color: "bg-warning", textColor: "text-dark" },
        "Ổn định": { color: "bg-success", textColor: "text-white" },
    };

    const hasHealthRecords = apiPatient.healthRecords && Array.isArray(apiPatient.healthRecords) && apiPatient.healthRecords.length > 0;
    const healthRecords = hasHealthRecords
        ? apiPatient.healthRecords.map(record => ({
            id: record._id || `temp-${Date.now()}`,
            date: record.date
                ? new Date(record.date).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                : "-",
            bloodPressure: record.bloodPressure || "-",
            heartRate: record.heartRate || "-",
            bloodSugar: record.bloodSugar || "-",
            recordedAt: record.recordedAt
                ? new Date(record.recordedAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "-",
        }))
        : [];

    const userId = apiPatient.userId || {};
    const lastAppointment = pastAppointments.length > 0 ? pastAppointments[0] : null;
    const lastVisitDate = lastAppointment && lastAppointment.date ? new Date(lastAppointment.date) : null;

    return {
        id: apiPatient._id || `temp-${Date.now()}`,
        uid: userId._id || apiPatient.uid || "cq6SC0A1RZXdLwFE1TKGRJG8fgl2",
        name: userId.username || apiPatient.name || "Không xác định",
        age: apiPatient.age || 0,
        patientCount: `${apiPatient.age || 0} tuổi`,
        avatar: userId.avatar || apiPatient.avatar || "https://via.placeholder.com/150?text=User",
        disease: apiPatient.disease || "Không xác định",
        patientId: apiPatient.insuranceId || "-",
        status: apiPatient.status || "Ổn định",
        statusColor: statusColors[apiPatient.status]?.color || "bg-secondary",
        statusTextColor: statusColors[apiPatient.status]?.textColor || "text-white",
        lastVisit: lastVisitDate
            ? lastVisitDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "Chưa có",
        lastVisitDate: lastVisitDate || new Date(),
        phone: userId.phone || apiPatient.phone || "",
        email: userId.email || apiPatient.email || "",
        address: userId.address || apiPatient.address || "",
        bloodType: apiPatient.bloodType || "-",
        allergies: apiPatient.allergies || "Không có",
        emergencyContact: apiPatient.emergencyContact || "Không có",
        notes: apiPatient.notes || "",
        gender: userId.gender || "-",
        dob: userId.dob
            ? new Date(userId.dob).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            : "-",
        role: userId.role || "-",
        healthRecords,
    };
};

const ViewPatientModal = ({ show, onHide, patient, onEdit }) => {
    const [showPastAppointments, setShowPastAppointments] = useState(false);
    const [patientData, setPatientData] = useState(patient);
    const user = useSelector((state) => state.auth.userInfo);

    // Lấy uid để tạo roomChats
    const doctorUid = user?.uid;
    const patientUid = patient?.uid || "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";
    const roomChats = [doctorUid, patientUid].sort().join("_");

    // Khi mở modal hoặc patient thay đổi -> set lại state
    useEffect(() => {
        if (patient) {
            setPatientData(patient);
        }
    }, [patient]);

    // Lắng nghe tín hiệu cập nhật realtime từ Firebase
    useEffect(() => {
        if (!roomChats || !patient?.id) {
            return;
        }

        const unsub = listenStatus(roomChats, async (signal) => {
            if (signal?.status === "update_patient_info") {
                try {
                    const res = await ApiPatient.getAllPatients();
                    const allPatients = res.data || res;
                    const updatedApiPatient = allPatients.find(p => p._id === patient.id);
                    if (!updatedApiPatient) {
                        console.warn("Không tìm thấy bệnh nhân với ID:", patient.id);
                        return;
                    }
                    const updatedPatient = mapPatientData(updatedApiPatient);
                    setPatientData(updatedPatient);
                } catch (err) {
                    console.error("Lỗi khi tải lại thông tin bệnh nhân:", err);
                }
            }
        });

        return () => unsub && unsub();
    }, [roomChats, patient?.id]);

    if (!show || !patientData) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
            tabIndex="-1"
        >
            <div
                className="modal-dialog modal-lg modal-dialog-scrollable"
                style={{ marginTop: "6.5rem", maxWidth: "900px" }}
            >
                <div
                    className="modal-content"
                    style={{
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        border: "none",
                        overflow: "hidden",
                        maxHeight: "85vh",
                    }}
                >
                    <div
                        className="modal-header border-0 py-3 px-4"
                        style={{ backgroundColor: "#f8f9fa" }}
                    >
                        <h5 className="modal-title fw-bold text-dark">Hồ sơ bệnh nhân</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onHide}
                            style={{ fontSize: "1rem" }}
                        ></button>
                    </div>

                    <div className="modal-body p-4">
                        {/* Header với avatar và thông tin cơ bản */}
                        <div
                            className="d-flex align-items-center gap-4 mb-4 p-4 rounded-3"
                            style={{
                                background:
                                    "linear-gradient(135deg, #e6f0fa 0%, #f0f7ff 100%)",
                                border: "1px solid #e0e7ff",
                            }}
                        >
                            <Avatar
                                src={patientData.avatar}
                                alt={patientData.name}
                                fallback={patientData.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                style={{
                                    width: "96px",
                                    height: "96px",
                                    fontSize: "2.5rem",
                                    border: "3px solid #ffffff",
                                }}
                            />
                            <div className="flex-grow-1">
                                <h4 className="fw-bold mb-1 text-dark">
                                    {patientData.name}
                                </h4>
                                <div className="text-muted mb-2 d-flex align-items-center gap-2">
                                    <span className="fw-semibold">Tuổi:</span>{" "}
                                    {patientData.patientCount}
                                </div>
                                <Badge
                                    className={`${patientData.statusColor} ${patientData.statusTextColor} px-3 py-1`}
                                    style={{ fontSize: "0.85rem", borderRadius: "12px" }}
                                >
                                    {patientData.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Thông tin cá nhân */}
                            <div className="col-md-6">
                                <div
                                    className="card h-100 border-0 shadow-sm bg-white rounded-4"
                                    style={{ transition: "transform 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    <div className="card-body p-4">
                                        <h6
                                            className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2"
                                            style={{ color: "#1e40af" }}
                                        >
                                            <User size={18} />
                                            Thông tin cá nhân
                                        </h6>
                                        <div className="d-grid gap-2">
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Họ tên:</label>
                                                <div className="fw-medium text-dark text-end">{patientData.name}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Giới tính:</label>
                                                <div className="fw-medium text-dark text-end">{patientData.gender}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Tuổi:</label>
                                                <div className="fw-medium text-dark text-end">{patientData.patientCount}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="small fw-medium text-muted">Ngày sinh:</label>
                                                <div className="fw-medium text-dark text-end">{patientData.dob}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className="col-md-6">
                                <div
                                    className="card h-100 border-0 shadow-sm bg-white rounded-4"
                                    style={{ transition: "transform 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    <div className="card-body p-4">
                                        <h6
                                            className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2"
                                            style={{ color: "#1e40af" }}
                                        >
                                            <UserCheck size={18} />
                                            Thông tin liên hệ
                                        </h6>
                                        <div className="d-grid gap-2">
                                            {patientData.phone && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Phone size={16} className="text-muted flex-shrink-0" />
                                                    <span className="small text-dark">{patientData.phone}</span>
                                                </div>
                                            )}
                                            {patientData.email && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Mail size={16} className="text-muted flex-shrink-0" />
                                                    <span className="small text-dark">{patientData.email}</span>
                                                </div>
                                            )}
                                            {patientData.address && (
                                                <div className="d-flex align-items-start gap-2">
                                                    <MapPin size={16} className="text-muted mt-1 flex-shrink-0" />
                                                    <span className="small text-dark">{patientData.address}</span>
                                                </div>
                                            )}
                                            {patientData.emergencyContact && (
                                                <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top">
                                                    <label className="small fw-medium text-muted">Liên hệ khẩn cấp:</label>
                                                    <div className="fw-medium text-dark text-end">{patientData.emergencyContact}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tình trạng sức khỏe */}
                            <div className="col-12">
                                <div
                                    className="card border-0 shadow-sm bg-white rounded-4"
                                    style={{ transition: "transform 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    <div className="card-body p-4">
                                        <h6
                                            className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2"
                                            style={{ color: "#1e40af" }}
                                        >
                                            <Heart size={18} />
                                            Tình trạng sức khỏe
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1">Bệnh</div>
                                                    <div className="fw-medium text-dark">{patientData.disease}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1">Mã BHYT</div>
                                                    <div className="fw-medium text-dark">{patientData.patientId}</div>
                                                </div>
                                            </div>
                                            {patientData.bloodType && (
                                                <div className="col-md-3">
                                                    <div className="bg-light p-3 rounded-3 h-100">
                                                        <div className="small text-muted mb-1">Nhóm máu</div>
                                                        <div className="fw-medium text-dark">{patientData.bloodType}</div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1 d-flex align-items-center gap-1 text-danger">
                                                        <AlertTriangle size={14} /> Dị ứng
                                                    </div>
                                                    <div className="fw-medium text-dark">{patientData.allergies || "Không"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hồ sơ sức khỏe chi tiết */}
                            <div className="col-12">
                                <div
                                    className="card border-0 shadow-sm bg-white rounded-4"
                                    style={{ transition: "transform 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    <div className="card-body p-4">
                                        <h6
                                            className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2"
                                            style={{ color: "#1e40af" }}
                                        >
                                            <FileText size={18} />
                                            Hồ sơ sức khỏe chi tiết
                                        </h6>
                                        {patientData.healthRecords && patientData.healthRecords.length > 0 ? (
                                            <div className="table-responsive">
                                                <table
                                                    className="table table-striped table-hover rounded-3 overflow-hidden"
                                                    style={{ borderCollapse: "separate", borderSpacing: 0 }}
                                                >
                                                    <thead
                                                        style={{
                                                            backgroundColor: "#f8f9fa",
                                                            color: "#1e40af",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        <tr>
                                                            <th
                                                                style={{
                                                                    padding: "12px",
                                                                    borderTopLeftRadius: "8px",
                                                                    borderBottom: "1px solid #e0e7ff",
                                                                }}
                                                            >
                                                                Ngày
                                                            </th>
                                                            <th
                                                                style={{ padding: "12px", borderBottom: "1px solid #e0e7ff" }}
                                                            >
                                                                Huyết áp
                                                            </th>
                                                            <th
                                                                style={{ padding: "12px", borderBottom: "1px solid #e0e7ff" }}
                                                            >
                                                                Nhịp tim
                                                            </th>
                                                            <th
                                                                style={{ padding: "12px", borderBottom: "1px solid #e0e7ff" }}
                                                            >
                                                                Đường huyết
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: "12px",
                                                                    borderTopRightRadius: "8px",
                                                                    borderBottom: "1px solid #e0e7ff",
                                                                }}
                                                            >
                                                                Thời gian ghi nhận
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {patientData.healthRecords.map((record) => (
                                                            <tr
                                                                key={record.id}
                                                                style={{ transition: "background-color 0.2s" }}
                                                                onMouseEnter={(e) =>
                                                                    (e.currentTarget.style.backgroundColor = "#f0f7ff")
                                                                }
                                                                onMouseLeave={(e) =>
                                                                    (e.currentTarget.style.backgroundColor = "#ffffff")
                                                                }
                                                            >
                                                                <td style={{ padding: "12px" }}>{record.date}</td>
                                                                <td style={{ padding: "12px" }}>{record.bloodPressure}</td>
                                                                <td style={{ padding: "12px" }}>{record.heartRate}</td>
                                                                <td style={{ padding: "12px" }}>{record.bloodSugar}</td>
                                                                <td style={{ padding: "12px" }}>{record.recordedAt}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p
                                                className="text-muted mb-0"
                                                style={{ fontStyle: "italic", fontSize: "0.9rem" }}
                                            >
                                                Không có hồ sơ sức khỏe nào.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ghi chú */}
                            {patientData.notes && (
                                <div className="col-12">
                                    <div
                                        className="card border-0 shadow-sm bg-white rounded-4"
                                        style={{ transition: "transform 0.2s" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                    >
                                        <div className="card-body p-4">
                                            <h6
                                                className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2"
                                                style={{ color: "#1e40af" }}
                                            >
                                                <FileText size={18} />
                                                Ghi chú
                                            </h6>
                                            <p className="mb-0 text-dark" style={{ fontSize: "0.95rem" }}>
                                                {patientData.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lịch sử khám */}
                            <div className="col-12">
                                <div
                                    className="card border-0 shadow-sm bg-white rounded-4"
                                    style={{ transition: "transform 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6
                                                className="fw-semibold text-primary d-flex align-items-center gap-2"
                                                style={{ color: "#1e40af" }}
                                            >
                                                <Calendar size={18} />
                                                Lịch sử khám gần đây
                                            </h6>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => setShowPastAppointments(true)}
                                                style={{ borderRadius: "8px", padding: "6px 16px" }}
                                            >
                                                Xem tất cả
                                            </Button>
                                        </div>
                                        <div className="timeline">
                                            <div className="d-flex gap-3 mb-3">
                                                <div
                                                    className="bg-primary rounded-circle mt-2 flex-shrink-0"
                                                    style={{ width: "10px", height: "10px" }}
                                                ></div>
                                                <div>
                                                    <div className="fw-medium text-dark" style={{ fontSize: "0.95rem" }}>
                                                        {patientData.lastVisit}
                                                    </div>
                                                    <div
                                                        className="small text-muted"
                                                        style={{ fontSize: "0.85rem" }}
                                                    >
                                                        Khám định kỳ - {patientData.disease}
                                                    </div>
                                                    <div
                                                        className="small text-muted"
                                                        style={{ fontSize: "0.85rem" }}
                                                    >
                                                        Tình trạng: {patientData.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0 pb-4 px-4">
                        <Button
                            variant="primary"
                            onClick={() => onEdit(patientData)}
                            style={{ borderRadius: "8px", padding: "8px 20px" }}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={onHide}
                            style={{ borderRadius: "8px", padding: "8px 20px" }}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal hiển thị lịch sử khám */}
            <PastAppointmentsModal
                show={showPastAppointments}
                onHide={() => setShowPastAppointments(false)}
                patientId={patientData.id}
            />
        </div>
    );
};

export default ViewPatientModal;