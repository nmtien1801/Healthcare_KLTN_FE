"use client"

import { User, Mail, Phone, CalendarDays, Stethoscope, Hospital, Clock, FileText } from "lucide-react"
import { Input, Button } from "../common-ui-components" // Reusing Input, Select, Button from PatientTab
import { useState, useEffect } from "react"

export default function InfoSection({ doctor, isEditing, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        specialty: "",
        hospital: "",
        experienceYears: "",
        license: "",
    })

    useEffect(() => {
        if (doctor) {
            setFormData({
                fullName: doctor.basicInfo.fullName || "",
                email: doctor.basicInfo.email || "",
                phone: doctor.basicInfo.phone || "",
                dob: doctor.basicInfo.dob || "",
                specialty: doctor.professionalInfo.specialty || "",
                hospital: doctor.professionalInfo.hospital || "",
                experienceYears: doctor.professionalInfo.experienceYears || "",
                license: doctor.professionalInfo.license || "",
            })
        }
    }, [doctor])

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-4">
                {/* Basic Information */}
                <div className="col-12 col-md-6">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                        <User size={20} className="text-primary" />
                        Thông tin cơ bản
                    </h5>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <User size={14} />
                                Họ và tên
                            </label>
                            <Input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <Mail size={14} />
                                Email
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <Phone size={14} />
                                Số điện thoại
                            </label>
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <CalendarDays size={14} />
                                Ngày sinh
                            </label>
                            <Input
                                type="text" // Use text for display, could be date picker in edit mode
                                value={formData.dob}
                                onChange={(e) => handleChange("dob", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Information */}
                <div className="col-12 col-md-6">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                        <Stethoscope size={20} className="text-primary" />
                        Thông tin chuyên môn
                    </h5>
                    <div className="space-y-4">
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <Stethoscope size={14} />
                                Chuyên khoa
                            </label>
                            <Input
                                type="text"
                                value={formData.specialty}
                                onChange={(e) => handleChange("specialty", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <Hospital size={14} />
                                Bệnh viện
                            </label>
                            <Input
                                type="text"
                                value={formData.hospital}
                                onChange={(e) => handleChange("hospital", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <Clock size={14} />
                                Số năm kinh nghiệm
                            </label>
                            <Input
                                type="text"
                                value={formData.experienceYears}
                                onChange={(e) => handleChange("experienceYears", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-medium d-flex align-items-center gap-2 text-muted small">
                                <FileText size={14} />
                                Chứng chỉ hành nghề
                            </label>
                            <Input
                                type="text"
                                value={formData.license}
                                onChange={(e) => handleChange("license", e.target.value)}
                                readOnly={!isEditing}
                                className={!isEditing ? "bg-light" : ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button variant="secondary" onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="submit" variant="primary">
                        Lưu thay đổi
                    </Button>
                </div>
            )}
        </form>
    )
}
