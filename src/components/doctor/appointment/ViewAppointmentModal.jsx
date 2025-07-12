"use client"

import { Clock, CalendarDays, Stethoscope, FileText, MessageSquare, Phone } from "lucide-react"

// Custom Button Component (duplicated for self-containment, ideally shared)
const Button = ({ children, className = "", variant = "primary", size = "md", onClick, disabled, ...props }) => {
    const baseClasses =
        "btn d-inline-flex align-items-center justify-content-center fw-medium transition-all border-0 shadow-sm"

    const variants = {
        primary: "btn-primary text-white",
        secondary: "btn-light text-dark border",
        success: "btn-success text-white",
        danger: "btn-danger text-white",
        warning: "btn-warning text-dark",
        info: "btn-info text-white",
        light: "btn-light text-dark",
        dark: "btn-dark text-white",
        outline: "btn-outline-primary",
        ghost: "btn-light text-muted border-0 shadow-none",
    }

    const sizes = {
        sm: "btn-sm px-2 py-1",
        md: "btn-md px-3 py-2",
        lg: "btn-lg px-4 py-3",
    }

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{ borderRadius: "8px" }}
            {...props}
        >
            {children}
        </button>
    )
}

// Custom Badge Component (duplicated for self-containment, ideally shared)
const Badge = ({ children, className = "" }) => {
    return (
        <span
            className={`badge ${className}`}
            style={{ borderRadius: "6px", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
        >
            {children}
        </span>
    )
}

// Custom Avatar Component (duplicated for self-containment, ideally shared)
const Avatar = ({ src, alt, fallback, className = "" }) => {
    return (
        <div
            className={`position-relative d-inline-flex align-items-center justify-content-center rounded-circle bg-light ${className}`}
        >
            {src ? (
                <img src={src || "/placeholder.svg"} alt={alt} className="w-100 h-100 rounded-circle object-fit-cover" />
            ) : (
                <span className="fw-medium text-muted" style={{ fontSize: "1.5rem" }}>
                    {fallback}
                </span>
            )}
        </div>
    )
}

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
