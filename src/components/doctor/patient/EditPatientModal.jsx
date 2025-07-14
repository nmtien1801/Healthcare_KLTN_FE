

import { useState, useEffect } from "react"
import { Button, Input, Select } from "../common-ui-components" // Import from common-ui-components

const EditPatientModal = ({ show, onHide, patient, onSave }) => {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        phone: "",
        email: "",
        address: "",
        disease: "",
        patientId: "",
        status: "Theo dõi",
        bloodType: "",
        allergies: "",
        emergencyContact: "",
        notes: "",
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name || "",
                age: patient.age || "",
                phone: patient.phone || "",
                email: patient.email || "",
                address: patient.address || "",
                disease: patient.disease || "",
                patientId: patient.patientId || "",
                status: patient.status || "Theo dõi",
                bloodType: patient.bloodType || "",
                allergies: patient.allergies || "",
                emergencyContact: patient.emergencyContact || "",
                notes: patient.notes || "",
            })
        }
    }, [patient])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "Họ tên là bắt buộc"
        if (!formData.age || formData.age < 1 || formData.age > 120) newErrors.age = "Tuổi phải từ 1-120"
        if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc"
        if (!formData.disease.trim()) newErrors.disease = "Bệnh là bắt buộc"
        if (!formData.patientId.trim()) newErrors.patientId = "Mã BHYT là bắt buộc"

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            onSave({ ...patient, ...formData })
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

    if (!show || !patient) return null

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-md" style={{ marginTop: "5rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Chỉnh sửa thông tin bệnh nhân</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                {/* Thông tin cơ bản */}
                                <div className="col-12">
                                    <h6 className="fw-semibold text-primary mb-3">Thông tin cơ bản</h6>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Họ và tên *</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className={errors.name ? "is-invalid" : ""}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Tuổi *</label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleChange("age", e.target.value)}
                                        placeholder="Nhập tuổi"
                                        className={errors.age ? "is-invalid" : ""}
                                    />
                                    {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Số điện thoại *</label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className={errors.phone ? "is-invalid" : ""}
                                    />
                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Email</label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="Nhập email"
                                        className={errors.email ? "is-invalid" : ""}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Địa chỉ</label>
                                    <Input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        placeholder="Nhập địa chỉ"
                                    />
                                </div>

                                {/* Thông tin y tế */}
                                <div className="col-12 mt-4">
                                    <h6 className="fw-semibold text-primary mb-3">Thông tin y tế</h6>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Bệnh *</label>
                                    <Input
                                        type="text"
                                        value={formData.disease}
                                        onChange={(e) => handleChange("disease", e.target.value)}
                                        placeholder="Nhập tên bệnh"
                                        className={errors.disease ? "is-invalid" : ""}
                                    />
                                    {errors.disease && <div className="invalid-feedback">{errors.disease}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Mã BHYT *</label>
                                    <Input
                                        type="text"
                                        value={formData.patientId}
                                        onChange={(e) => handleChange("patientId", e.target.value)}
                                        placeholder="Nhập mã BHYT"
                                        className={errors.patientId ? "is-invalid" : ""}
                                    />
                                    {errors.patientId && <div className="invalid-feedback">{errors.patientId}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Nhóm máu</label>
                                    <Select value={formData.bloodType} onChange={(value) => handleChange("bloodType", value)}>
                                        <option value="">Chọn nhóm máu</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </Select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Tình trạng *</label>
                                    <Select value={formData.status} onChange={(value) => handleChange("status", value)}>
                                        <option value="Cần theo dõi">Cần theo dõi</option>
                                        <option value="Đang điều trị">Đang điều trị</option>
                                        <option value="Theo dõi">Theo dõi</option>
                                        <option value="Ổn định">Ổn định</option>
                                    </Select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Dị ứng</label>
                                    <Input
                                        type="text"
                                        value={formData.allergies}
                                        onChange={(e) => handleChange("allergies", e.target.value)}
                                        placeholder="Nhập thông tin dị ứng (nếu có)"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Liên hệ khẩn cấp</label>
                                    <Input
                                        type="text"
                                        value={formData.emergencyContact}
                                        onChange={(e) => handleChange("emergencyContact", e.target.value)}
                                        placeholder="Tên và số điện thoại người liên hệ khẩn cấp"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Ghi chú</label>
                                    <textarea
                                        className="form-control border-0 shadow-sm"
                                        style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
                                        rows="3"
                                        value={formData.notes}
                                        onChange={(e) => handleChange("notes", e.target.value)}
                                        placeholder="Ghi chú thêm về bệnh nhân"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <Button variant="secondary" onClick={onHide}>
                                Hủy
                            </Button>
                            <Button type="submit" variant="primary">
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditPatientModal
