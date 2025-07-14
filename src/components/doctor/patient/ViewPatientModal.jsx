

import { Calendar, Phone, Mail, MapPin, Heart, AlertTriangle, User, FileText } from "lucide-react"
import { Button, Badge, Avatar } from "../common-ui-components" // Import from common-ui-components

const ViewPatientModal = ({ show, onHide, patient, onEdit }) => {
    if (!show || !patient) return null

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-md" style={{ marginTop: "5rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Chi tiết bệnh nhân</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        {/* Header với avatar và thông tin cơ bản */}
                        <div className="d-flex align-items-center gap-4 mb-4 p-3 bg-light rounded-3">
                            <Avatar
                                src={patient.avatar}
                                alt={patient.name}
                                fallback={patient.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                style={{ width: "80px", height: "80px" }}
                            />
                            <div className="flex-grow-1">
                                <h4 className="fw-bold mb-1">{patient.name}</h4>
                                <p className="text-muted mb-2">{patient.age} tuổi</p>
                                <Badge className={`${patient.statusColor} ${patient.statusTextColor}`}>{patient.status}</Badge>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Thông tin liên hệ */}
                            <div className="col-md-6">
                                <div className="card h-100 border-0 bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <User size={16} />
                                            Thông tin liên hệ
                                        </h6>
                                        <div className="space-y-3">
                                            {patient.phone && (
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <Phone size={14} className="text-muted" />
                                                    <span className="small">{patient.phone}</span>
                                                </div>
                                            )}
                                            {patient.email && (
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <Mail size={14} className="text-muted" />
                                                    <span className="small">{patient.email}</span>
                                                </div>
                                            )}
                                            {patient.address && (
                                                <div className="d-flex align-items-start gap-2 mb-2">
                                                    <MapPin size={14} className="text-muted mt-1" />
                                                    <span className="small">{patient.address}</span>
                                                </div>
                                            )}
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <Calendar size={14} className="text-muted" />
                                                <span className="small">Khám gần nhất: {patient.lastVisit}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin y tế */}
                            <div className="col-md-6">
                                <div className="card h-100 border-0 bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <Heart size={16} />
                                            Thông tin y tế
                                        </h6>
                                        <div className="space-y-3">
                                            <div className="mb-3">
                                                <label className="small fw-medium text-muted">Bệnh:</label>
                                                <div className="fw-medium">{patient.disease}</div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="small fw-medium text-muted">Mã BHYT:</label>
                                                <div className="fw-medium">{patient.patientId}</div>
                                            </div>
                                            {patient.bloodType && (
                                                <div className="mb-3">
                                                    <label className="small fw-medium text-muted">Nhóm máu:</label>
                                                    <div className="fw-medium">{patient.bloodType}</div>
                                                </div>
                                            )}
                                            {patient.allergies && (
                                                <div className="mb-3">
                                                    <label className="small fw-medium text-muted d-flex align-items-center gap-1">
                                                        <AlertTriangle size={12} />
                                                        Dị ứng:
                                                    </label>
                                                    <div className="fw-medium text-warning">{patient.allergies}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Liên hệ khẩn cấp */}
                            {patient.emergencyContact && (
                                <div className="col-12">
                                    <div className="card border-0 bg-light">
                                        <div className="card-body">
                                            <h6 className="fw-semibold text-primary mb-3">Liên hệ khẩn cấp</h6>
                                            <p className="mb-0">{patient.emergencyContact}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Ghi chú */}
                            {patient.notes && (
                                <div className="col-12">
                                    <div className="card border-0 bg-light">
                                        <div className="card-body">
                                            <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                                <FileText size={16} />
                                                Ghi chú
                                            </h6>
                                            <p className="mb-0">{patient.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lịch sử khám */}
                            <div className="col-12">
                                <div className="card border-0 bg-light">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3">Lịch sử khám gần đây</h6>
                                        <div className="timeline">
                                            <div className="d-flex gap-3 mb-3">
                                                <div
                                                    className="bg-primary rounded-circle"
                                                    style={{ width: "8px", height: "8px", marginTop: "6px" }}
                                                ></div>
                                                <div>
                                                    <div className="fw-medium">{patient.lastVisit}</div>
                                                    <div className="small text-muted">Khám định kỳ - {patient.disease}</div>
                                                    <div className="small text-muted">Tình trạng: {patient.status}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <Button variant="secondary" onClick={onHide}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={() => onEdit(patient)}>
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewPatientModal
