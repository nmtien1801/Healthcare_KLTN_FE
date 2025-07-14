

import { Clock, CalendarDays, Stethoscope, FileText, MessageSquare, Phone } from "lucide-react"
import { Button, Badge, Avatar } from "../common-ui-components" // Import from common-ui-components

const ViewAppointmentModal = ({ show, onHide, appointment, onEdit }) => {
    if (!show || !appointment) return null

    const getStatusColors = (status) => {
        switch (status) {
            case "Đã xác nhận":
                return { color: "bg-success", textColor: "text-white" }
            case "Chờ xác nhận":
                return { color: "bg-warning", textColor: "text-dark" }
            case "Đã hủy":
                return { color: "bg-danger", textColor: "text-white" }
            case "Hoàn thành":
                return { color: "bg-primary", textColor: "text-white" }
            default:
                return { color: "bg-secondary", textColor: "text-white" }
        }
    }

    const { color, textColor } = getStatusColors(appointment.status)

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-md" style={{ marginTop: "5rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Chi tiết lịch hẹn</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        {/* Header với avatar và thông tin cơ bản */}
                        <div className="d-flex align-items-center gap-4 mb-4 p-3 bg-light rounded-3">
                            <Avatar
                                src={appointment.patientAvatar}
                                alt={appointment.patientName}
                                fallback={appointment.patientName
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                style={{ width: "64px", height: "64px" }}
                            />
                            <div className="flex-grow-1">
                                <h4 className="fw-bold mb-1">{appointment.patientName}</h4>
                                <p className="text-muted mb-2">
                                    {appointment.patientAge} tuổi • {appointment.patientDisease}
                                </p>
                                <Badge className={`${color} ${textColor}`}>{appointment.status}</Badge>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-12">
                                <h6 className="fw-semibold text-primary mb-3">Thông tin lịch hẹn</h6>
                            </div>
                            <div className="col-md-6">
                                <label className="small fw-medium text-muted d-flex align-items-center gap-1">
                                    <CalendarDays size={14} />
                                    Ngày hẹn:
                                </label>
                                <div className="fw-medium">{appointment.date}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="small fw-medium text-muted d-flex align-items-center gap-1">
                                    <Clock size={14} />
                                    Giờ hẹn:
                                </label>
                                <div className="fw-medium">{appointment.time}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="small fw-medium text-muted">Loại khám:</label>
                                <div className="fw-medium">{appointment.type}</div>
                            </div>
                            <div className="col-md-6">
                                <label className="small fw-medium text-muted d-flex align-items-center gap-1">
                                    <Stethoscope size={14} />
                                    Bác sĩ:
                                </label>
                                <div className="fw-medium">{appointment.doctor}</div>
                            </div>
                            <div className="col-12">
                                <label className="small fw-medium text-muted">Lý do khám:</label>
                                <div className="fw-medium">{appointment.reason}</div>
                            </div>
                            {appointment.notes && (
                                <div className="col-12">
                                    <label className="small fw-medium text-muted d-flex align-items-center gap-1">
                                        <FileText size={14} />
                                        Ghi chú:
                                    </label>
                                    <div className="fw-medium">{appointment.notes}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0 d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button variant="info" size="sm" className="p-2">
                                <MessageSquare size={16} />
                            </Button>
                            <Button variant="info" size="sm" className="p-2">
                                <Phone size={16} />
                            </Button>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="secondary" onClick={onHide}>
                                Đóng
                            </Button>
                            <Button variant="primary" onClick={() => onEdit(appointment)}>
                                Chỉnh sửa
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewAppointmentModal
