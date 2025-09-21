import { Calendar, Phone, Mail, MapPin, Heart, AlertTriangle, User, FileText, UserCheck } from "lucide-react";
import { Button, Badge, Avatar } from "../common-ui-components";

const ViewPatientModal = ({ show, onHide, patient, onEdit }) => {
    if (!show || !patient) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable" style={{ marginTop: "5rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Chi tiết bệnh nhân</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-4">
                        {/* Header với avatar và thông tin cơ bản */}
                        <div className="d-flex align-items-center gap-4 mb-4 p-4 bg-light rounded-4">
                            <Avatar
                                src={patient.avatar}
                                alt={patient.name}
                                fallback={patient.name?.split(" ").map((n) => n[0]).join("")}
                                style={{ width: "96px", height: "96px", fontSize: "2.5rem" }}
                            />
                            <div className="flex-grow-1">
                                <h4 className="fw-bold mb-1">{patient.name}</h4>
                                <div className="text-muted mb-2 d-flex align-items-center gap-2">
                                    <span className="fw-semibold">Mã bệnh nhân:</span> {patient.patientCount}
                                </div>
                                <Badge className={`${patient.statusColor} ${patient.statusTextColor}`}>
                                    {patient.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="row g-4">
                            {/* Thông tin cá nhân */}
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm bg-white rounded-4">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <User size={18} />
                                            Thông tin cá nhân
                                        </h6>
                                        <div className="d-grid gap-2">
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Họ tên:</label>
                                                <div className="fw-medium text-end">{patient.name}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Giới tính:</label>
                                                <div className="fw-medium text-end">{patient.gender}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <label className="small fw-medium text-muted">Tuổi:</label>
                                                <div className="fw-medium text-end">{patient.patientCount}</div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="small fw-medium text-muted">Ngày sinh:</label>
                                                <div className="fw-medium text-end">{patient.dob}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm bg-white rounded-4">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <UserCheck size={18} />
                                            Thông tin liên hệ
                                        </h6>
                                        <div className="d-grid gap-2">
                                            {patient.phone && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Phone size={16} className="text-muted flex-shrink-0" />
                                                    <span className="small">{patient.phone}</span>
                                                </div>
                                            )}
                                            {patient.email && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Mail size={16} className="text-muted flex-shrink-0" />
                                                    <span className="small">{patient.email}</span>
                                                </div>
                                            )}
                                            {patient.address && (
                                                <div className="d-flex align-items-start gap-2">
                                                    <MapPin size={16} className="text-muted mt-1 flex-shrink-0" />
                                                    <span className="small">{patient.address}</span>
                                                </div>
                                            )}
                                            {patient.emergencyContact && (
                                                <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top">
                                                    <label className="small fw-medium text-muted">Liên hệ khẩn cấp:</label>
                                                    <div className="fw-medium text-end">{patient.emergencyContact}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tình trạng sức khỏe */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm bg-white rounded-4">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <Heart size={18} />
                                            Tình trạng sức khỏe
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1">Bệnh</div>
                                                    <div className="fw-medium">{patient.disease}</div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1">Mã BHYT</div>
                                                    <div className="fw-medium">{patient.patientId}</div>
                                                </div>
                                            </div>
                                            {patient.bloodType && (
                                                <div className="col-md-3">
                                                    <div className="bg-light p-3 rounded-3 h-100">
                                                        <div className="small text-muted mb-1">Nhóm máu</div>
                                                        <div className="fw-medium">{patient.bloodType}</div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-md-3">
                                                <div className="bg-light p-3 rounded-3 h-100">
                                                    <div className="small text-muted mb-1 d-flex align-items-center gap-1 text-danger">
                                                        <AlertTriangle size={14} /> Dị ứng
                                                    </div>
                                                    <div className="fw-medium">{patient.allergies || "Không"}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lịch sử khám */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm bg-white rounded-4">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <Calendar size={18} />
                                            Lịch sử khám gần đây
                                        </h6>
                                        <div className="timeline">
                                            <div className="d-flex gap-3 mb-3">
                                                <div
                                                    className="bg-primary rounded-circle mt-2 flex-shrink-0"
                                                    style={{ width: "8px", height: "8px" }}
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

                            {/* Hồ sơ sức khỏe chi tiết */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm bg-white rounded-4">
                                    <div className="card-body">
                                        <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                            <FileText size={18} />
                                            Hồ sơ sức khỏe chi tiết
                                        </h6>
                                        {patient.healthRecords && patient.healthRecords.length > 0 ? (
                                            <div className="table-responsive">
                                                <table className="table table-striped table-hover rounded-3 overflow-hidden">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th className="py-2">Ngày</th>
                                                            <th className="py-2">Huyết áp</th>
                                                            <th className="py-2">Nhịp tim</th>
                                                            <th className="py-2">Đường huyết</th>
                                                            <th className="py-2">Thời gian ghi nhận</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {patient.healthRecords.map((record) => (
                                                            <tr key={record.id}>
                                                                <td>{record.date}</td>
                                                                <td>{record.bloodPressure}</td>
                                                                <td>{record.heartRate}</td>
                                                                <td>{record.bloodSugar}</td>
                                                                <td>{record.recordedAt}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-muted">Không có hồ sơ sức khỏe nào.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Ghi chú */}
                            {patient.notes && (
                                <div className="col-12">
                                    <div className="card border-0 shadow-sm bg-white rounded-4">
                                        <div className="card-body">
                                            <h6 className="fw-semibold text-primary mb-3 d-flex align-items-center gap-2">
                                                <FileText size={18} />
                                                Ghi chú
                                            </h6>
                                            <p className="mb-0 text-muted">{patient.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
    );
};

export default ViewPatientModal;