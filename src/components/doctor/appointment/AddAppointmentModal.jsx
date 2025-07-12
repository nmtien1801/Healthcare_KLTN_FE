"use client"

import { useState } from "react"
import { Clock, CalendarDays, User, Stethoscope, FileText } from "lucide-react"
import { Button, Input, Select } from "../common-ui-components"

const AddAppointmentModal = ({ show, onHide, onSave }) => {
    const [formData, setFormData] = useState({
        patientName: "",
        patientAge: "",
        patientDisease: "",
        date: "",
        time: "",
        type: "Tái khám",
        reason: "",
        doctor: "",
        notes: "",
        status: "Chờ xác nhận", // Default status for new appointments
    })

    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}
        if (!formData.patientName.trim()) newErrors.patientName = "Tên bệnh nhân là bắt buộc"
        if (!formData.patientAge || formData.patientAge < 1 || formData.patientAge > 120)
            newErrors.patientAge = "Tuổi phải từ 1-120"
        if (!formData.patientDisease.trim()) newErrors.patientDisease = "Bệnh là bắt buộc"
        if (!formData.date.trim()) newErrors.date = "Ngày hẹn là bắt buộc"
        if (!formData.time.trim()) newErrors.time = "Giờ hẹn là bắt buộc"
        if (!formData.reason.trim()) newErrors.reason = "Lý do khám là bắt buộc"
        if (!formData.doctor.trim()) newErrors.doctor = "Bác sĩ là bắt buộc"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            onSave(formData)
            setFormData({
                patientName: "",
                patientAge: "",
                patientDisease: "",
                date: "",
                time: "",
                type: "Tái khám",
                reason: "",
                doctor: "",
                notes: "",
                status: "Chờ xác nhận",
            })
            setErrors({})
            onHide()
        }
    }

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" })
        }
    }

    if (!show) return null

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-md" style={{ marginTop: "5rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Tạo lịch hẹn mới</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <h6 className="fw-semibold text-primary mb-3">Thông tin bệnh nhân</h6>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label fw-medium d-flex align-items-center gap-1">
                                        <User size={14} />
                                        Tên bệnh nhân *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.patientName}
                                        onChange={(e) => handleChange("patientName", e.target.value)}
                                        placeholder="Nhập tên bệnh nhân"
                                        className={errors.patientName ? "is-invalid" : ""}
                                    />
                                    {errors.patientName && <div className="invalid-feedback">{errors.patientName}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Tuổi *</label>
                                    <Input
                                        type="number"
                                        value={formData.patientAge}
                                        onChange={(e) => handleChange("patientAge", e.target.value)}
                                        placeholder="Nhập tuổi"
                                        className={errors.patientAge ? "is-invalid" : ""}
                                    />
                                    {errors.patientAge && <div className="invalid-feedback">{errors.patientAge}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Bệnh *</label>
                                    <Input
                                        type="text"
                                        value={formData.patientDisease}
                                        onChange={(e) => handleChange("patientDisease", e.target.value)}
                                        placeholder="Nhập bệnh"
                                        className={errors.patientDisease ? "is-invalid" : ""}
                                    />
                                    {errors.patientDisease && <div className="invalid-feedback">{errors.patientDisease}</div>}
                                </div>

                                <div className="col-12 mt-4">
                                    <h6 className="fw-semibold text-primary mb-3">Thông tin lịch hẹn</h6>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium d-flex align-items-center gap-1">
                                        <CalendarDays size={14} />
                                        Ngày hẹn *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleChange("date", e.target.value)}
                                        className={errors.date ? "is-invalid" : ""}
                                    />
                                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium d-flex align-items-center gap-1">
                                        <Clock size={14} />
                                        Giờ hẹn *
                                    </label>
                                    <Input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => handleChange("time", e.target.value)}
                                        className={errors.time ? "is-invalid" : ""}
                                    />
                                    {errors.time && <div className="invalid-feedback">{errors.time}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Loại khám</label>
                                    <Select value={formData.type} onChange={(value) => handleChange("type", value)}>
                                        <option value="Tái khám">Tái khám</option>
                                        <option value="Khám mới">Khám mới</option>
                                        <option value="Tư vấn">Tư vấn</option>
                                    </Select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium d-flex align-items-center gap-1">
                                        <Stethoscope size={14} />
                                        Bác sĩ *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.doctor}
                                        onChange={(e) => handleChange("doctor", e.target.value)}
                                        placeholder="Nhập tên bác sĩ"
                                        className={errors.doctor ? "is-invalid" : ""}
                                    />
                                    {errors.doctor && <div className="invalid-feedback">{errors.doctor}</div>}
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Lý do khám *</label>
                                    <textarea
                                        className={`form-control border-0 shadow-sm ${errors.reason ? "is-invalid" : ""}`}
                                        style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
                                        rows="2"
                                        value={formData.reason}
                                        onChange={(e) => handleChange("reason", e.target.value)}
                                        placeholder="Mô tả lý do khám"
                                    />
                                    {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium d-flex align-items-center gap-1">
                                        <FileText size={14} />
                                        Ghi chú
                                    </label>
                                    <textarea
                                        className="form-control border-0 shadow-sm"
                                        style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
                                        rows="2"
                                        value={formData.notes}
                                        onChange={(e) => handleChange("notes", e.target.value)}
                                        placeholder="Ghi chú thêm về lịch hẹn"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <Button variant="secondary" onClick={onHide}>
                                Hủy
                            </Button>
                            <Button type="submit" variant="primary">
                                Tạo lịch hẹn
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddAppointmentModal
