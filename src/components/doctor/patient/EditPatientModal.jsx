import { useState, useEffect } from "react"
import { Button, Input, Select } from "../common-ui-components"
import ApiDoctor from "../../../apis/ApiDoctor"

// Component chỉnh sửa thông tin y tế của bệnh nhân
const EditPatientModal = ({ show, onHide, patient, onSave }) => {
    // State để lưu dữ liệu form, chỉ bao gồm các trường y tế trực tiếp
    const [formData, setFormData] = useState({
        disease: "",
        status: "Theo dõi",
        allergies: "",
        notes: "",
    })

    // State để lưu lỗi validation
    const [errors, setErrors] = useState({})

    // Cập nhật formData khi patient thay đổi
    useEffect(() => {
        if (patient) {
            setFormData({
                disease: patient.disease || "",
                status: patient.status || "Theo dõi",
                allergies: patient.allergies || "",
                notes: patient.notes || "",
            })
        }
    }, [patient])

    // Hàm kiểm tra dữ liệu đầu vào
    const validateForm = () => {
        const newErrors = {}

        if (!formData.disease.trim()) newErrors.disease = "Bệnh là bắt buộc"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await ApiDoctor.updatePatientHealthInfo(patient.id, formData);
                onSave({ ...patient, ...formData });
                setErrors({});
                onHide();
            } catch (error) {
                console.error("Lỗi khi cập nhật thông tin y tế:", error);
                setErrors({ api: "Không thể cập nhật thông tin. Vui lòng thử lại sau." });
            }
        }
    };

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
                        <h5 className="modal-title fw-bold">Chỉnh sửa thông tin y tế bệnh nhân</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                {/* Thông tin y tế */}
                                <div className="col-12">
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
                            {errors.api && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {errors.api}
                                </div>
                            )}
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
    );
}

export default EditPatientModal