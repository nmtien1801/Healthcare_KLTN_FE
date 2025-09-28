import { useState } from "react";
import { Calendar, Phone, Mail, MapPin, Heart, AlertTriangle, User, FileText, UserCheck } from "lucide-react";
import { Button, Badge, Avatar } from "../common-ui-components";
import PastAppointmentsModal from "./PastAppointmentsModal";

const ViewPatientModal = ({ show, onHide, patient, onEdit }) => {
    const [showPastAppointments, setShowPastAppointments] = useState(false);

    if (!show || !patient) return null;

    return (
        <div
            className="modal show d-block "
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
                        maxHeight: "85vh"
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
                                background: "linear-gradient(135deg, #e6f0fa 0%, #f0f7ff 100%)",
                                border: "1px solid #e0e7ff",
                                transition: "all 0.2s",
                            }}
                        >
                            <Avatar
                                src={patient.avatar}
                                alt={patient.name}
                                fallback={patient.name?.split(" ").map((n) => n[0]).join("")}
                                style={{ width: "96px", height: "96px", fontSize: "2.5rem", border: "3px solid #ffffff" }}
                            />
                            <div className="flex-grow-1">
                                <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: "1.5rem" }}>
                                    {patient.name}
                                </h4>
                                <div className="text-muted mb-2 d-flex align-items-center gap-2">
                                    <span className="fw-semibold">Tuổi:</span> {patient.patientCount}
                                </div>
                                <Badge
                                    className={`${patient.statusColor} ${patient.statusTextColor} px-3 py-1`}
                                    style={{ fontSize: "0.85rem", borderRadius: "12px" }}
                                >
                                    {patient.status}
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
                                                <div className="fw-medium text-dark text-end">{patient.name}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Giới tính:</label>
                                                <div className="fw-medium text-dark text-end">{patient.gender}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Tuổi:</label>
                                                <div className="fw-medium text-dark text-end">{patient.patientCount}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="small fw-medium text-muted">Ngày sinh:</label>
                                                <div className="fw-medium text-dark text-end">{patient.dob}</div>
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
                                            {patient.phone && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Phone size={16} className="text-muted flex-shrink-0" />
                                                    <span className="small text-dark">{patient.phone}</span>
                                                </div>
                                            )}
                                            {patient.email && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Mail size={16} className="text-muted flex-shrink-0" />
                                                    <span className="small text-dark">{patient.email}</span>
                                                </div>
                                            )}
                                            {patient.address && (
                                                <div className="d-flex align-items-start gap-2">
                                                    <MapPin size={16} className="text-muted mt-1 flex-shrink-0" />
                                                    <span className="small text-dark">{patient.address}</span>
                                                </div>
                                            )}
                                            {patient.emergencyContact && (
                                                <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top">
                                                    <label className="small fw-medium text-muted">Liên hệ khẩn cấp:</label>
                                                    <div className="fw-medium text-dark text-end">{patient.emergencyContact}</div>
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
                                                    <div className="fw-medium text-dark">{patient.disease}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1">Mã BHYT</div>
                                                    <div className="fw-medium text-dark">{patient.patientId}</div>
                                                </div>
                                            </div>
                                            {patient.bloodType && (
                                                <div className="col-md-3">
                                                    <div className="bg-light p-3 rounded-3 h-100">
                                                        <div className="small text-muted mb-1">Nhóm máu</div>
                                                        <div className="fw-medium text-dark">{patient.bloodType}</div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1 d-flex align-items-center gap-1 text-danger">
                                                        <AlertTriangle size={14} /> Dị ứng
                                                    </div>
                                                    <div className="fw-medium text-dark">{patient.allergies || "Không"}</div>
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
                                        {patient.healthRecords && patient.healthRecords.length > 0 ? (
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
                                                        {patient.healthRecords.map((record) => (
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
                            {patient.notes && (
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
                                                {patient.notes}
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
                                                        {patient.lastVisit}
                                                    </div>
                                                    <div
                                                        className="small text-muted"
                                                        style={{ fontSize: "0.85rem" }}
                                                    >
                                                        Khám định kỳ - {patient.disease}
                                                    </div>
                                                    <div
                                                        className="small text-muted"
                                                        style={{ fontSize: "0.85rem" }}
                                                    >
                                                        Tình trạng: {patient.status}
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
                            onClick={() => onEdit(patient)}
                            style={{ borderRadius: "8px", padding: "8px 20px" }}
                        >
                            Chỉnh sửa
                        </Button> <Button
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
                patientId={patient.id}
            />
        </div>
    );
};

export default ViewPatientModal;