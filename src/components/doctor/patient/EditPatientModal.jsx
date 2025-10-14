import { useState, useEffect } from "react";
import { Button, Input, Select } from "../common-ui-components";
import ApiDoctor from "../../../apis/ApiDoctor";
import { useSelector } from "react-redux";
import { listenStatus, sendStatus } from "../../../utils/SetupSignFireBase";

const EditPatientModal = ({ show, onHide, patient, onSave }) => {
    const user = useSelector((state) => state.auth.userInfo);
    const doctorUid = user?.uid;
    const patientUid = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";
    const roomChats = [doctorUid, patientUid].sort().join("_");

    // State form
    const [formData, setFormData] = useState({
        disease: "",
        status: "Theo dõi",
        allergies: "",
        notes: "",
    });

    // State lỗi
    const [errors, setErrors] = useState({});

    // Khi mở modal, load lại dữ liệu bệnh nhân
    useEffect(() => {
        if (patient) {
            setFormData({
                disease: patient.disease || "",
                status: patient.status || "Theo dõi",
                allergies: patient.allergies || "",
                notes: patient.notes || "",
            });
        }
    }, [patient, show]);

    // Lắng nghe realtime từ Firebase (ví dụ bệnh nhân tự thay đổi hoặc cập nhật từ nơi khác)
    useEffect(() => {
        if (!roomChats) return;
        const unsubscribe = listenStatus(roomChats, (signal) => {
            if (signal?.status === "update_patient_info") {

                setFormData((prev) => ({
                    ...prev,
                    ...patient, // cập nhật lại từ patient mới nhất
                }));
            }
        });
        return () => unsubscribe && unsubscribe();
    }, [roomChats, patient]);

    // Hàm kiểm tra dữ liệu đầu vào
    const validateForm = () => {
        const newErrors = {};
        if (!formData.disease.trim()) newErrors.disease = "Bệnh là bắt buộc";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý khi submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await ApiDoctor.updatePatientHealthInfo(patient.id, formData);

            // Gửi tín hiệu realtime cho bên kia (bệnh nhân)
            sendStatus(doctorUid, patientUid, "update_patient_info");

            // Cập nhật danh sách tại giao diện hiện tại
            onSave({ ...patient, ...formData });

            setErrors({});
            onHide();
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin y tế:", error);
            setErrors({
                api:
                    error.response?.data?.message ||
                    "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
            });
        }
    };

    // Xử lý khi người dùng thay đổi input
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    if (!show || !patient) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
            <div className="modal-dialog modal-md" style={{ marginTop: "7rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            Chỉnh sửa thông tin y tế bệnh nhân
                        </h5>
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
                                    {errors.disease && (
                                        <div className="invalid-feedback">{errors.disease}</div>
                                    )}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-medium">Tình trạng *</label>
                                    <Select
                                        value={formData.status}
                                        onChange={(value) => handleChange("status", value)}
                                    >
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
                                        style={{
                                            borderRadius: "8px",
                                            backgroundColor: "#f8f9fa",
                                        }}
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
};

export default EditPatientModal;
