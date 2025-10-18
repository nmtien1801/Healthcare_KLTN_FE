import { useState, useEffect } from "react";
import { Button, Input, Select } from "../common-ui-components";
import { Plus, Trash2 } from "lucide-react";
import ApiDoctor from "../../../apis/ApiDoctor";
import { useDispatch, useSelector } from "react-redux";
import { listenStatus, sendStatus } from "../../../utils/SetupSignFireBase";
import { applyMedicines, fetchMedicines } from "../../../redux/medicineAiSlice";

const EditPatientModal = ({ show, onHide, patient, onSave }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.userInfo);
    const doctorUid = user?.uid;
    const patientUid = user?.uid;
    const roomChats = [doctorUid, patientUid].sort().join("_");

    // State form
    const [formData, setFormData] = useState({
        disease: "",
        status: "Theo dõi",
        allergies: "",
        notes: "",
    });

    // State thuốc
    const [medicines, setMedicines] = useState({
        sang: [],
        trua: [],
        toi: []
    });

    const categorizeMedicines = (list) => {
        const sang = [];
        const trua = [];
        const toi = [];

        const instructions = {
            sang: "uống sau ăn",
            trua: "uống trước ăn",
            toi: "tiêm trước khi đi ngủ",
        };

        list.forEach((m) => {
            const hour = m.time.split("T")[1].split(":")[0];
            const hourNum = parseInt(hour, 10);

            if (hourNum >= 5 && hourNum < 11) {
                sang.push(`${m.name} ${m.lieu_luong} - ${instructions.sang}`);
            } else if (hourNum >= 11 && hourNum < 17) {
                trua.push(`${m.name} ${m.lieu_luong} - ${instructions.trua}`);
            } else if (hourNum >= 17 && hourNum <= 22) {
                toi.push(`${m.name} ${m.lieu_luong} - ${instructions.toi}`);
            }
        });

        return { sang, trua, toi };
    };

    useEffect(() => {
        const fetchMedicine = async () => {
            const today = new Date();
            
            const res = await dispatch(fetchMedicines({ userId: patient.userId._id, date: today }));

            if (res?.payload?.DT) {
                const data = res.payload.DT;

                const categorized = categorizeMedicines(data);
                setMedicines(categorized);
            }
        };

        fetchMedicine();
    }, [dispatch, patient.userId._id]);

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

    // Lắng nghe realtime từ Firebase
    useEffect(() => {
        if (!roomChats) return;
        const unsubscribe = listenStatus(roomChats, (signal) => {
            if (signal?.status === "update_patient_info") {
                setFormData((prev) => ({
                    ...prev,
                    ...patient,
                }));
            }
        });
        return () => unsubscribe && unsubscribe();
    }, [roomChats, patient]);

    // Hàm thêm thuốc mới
    const addMedicine = (time) => {
        setMedicines(prev => ({
            ...prev,
            [time]: [...prev[time], ""]
        }));
    };

    // Hàm xóa thuốc
    const removeMedicine = (time, index) => {
        setMedicines(prev => ({
            ...prev,
            [time]: prev[time].filter((_, i) => i !== index)
        }));
    };

    // kiểm tra input thuốc
    const validateMedicineFormat = (medicineString) => {
        const regex = /^.+?\s\d+[\w\s]*\s-\s.+$/i;
        return regex.test(medicineString.trim());
    };

    // Hàm cập nhật thuốc
    const updateMedicine = (time, index, value) => {
        setMedicines(prev => ({
            ...prev,
            [time]: prev[time].map((item, i) => i === index ? value : item)
        }));

        if (value.trim() && !validateMedicineFormat(value)) {
            setErrors(prev => ({
                ...prev,
                medicine: {
                    ...prev.medicine,
                    [`${time}_${index}`]: "Định dạng sai: [Thuốc Liều lượng] - [Cách dùng]"
                }
            }));
        } else {
            setErrors(prev => {
                const newMedicineErrors = { ...prev.medicine };
                delete newMedicineErrors[`${time}_${index}`];
                return { ...prev, medicine: newMedicineErrors };
            });
        }
    };

    // Hàm kiểm tra dữ liệu đầu vào
    const validateForm = () => {
        const newErrors = {};
        if (!formData.disease.trim()) newErrors.disease = "Bệnh là bắt buộc";

        // Kiểm tra tất cả các mục thuốc
        const medicineErrors = {};
        Object.entries(medicines).forEach(([time, arr]) => {
            arr.forEach((item, index) => {
                // Chỉ kiểm tra các dòng không rỗng
                if (item.trim() && !validateMedicineFormat(item)) {
                    medicineErrors[`${time}_${index}`] = "Sai định dạng: Metformin 500mg - uống sau ăn";
                }
            });
        });

        if (Object.keys(medicineErrors).length > 0) {
            newErrors.medicine = medicineErrors;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Parse medicine
    function parseMedicine(item, time, userId) {
        const [thuocLieu, cachDung] = item.split(" - ");
        const parts = thuocLieu?.trim().split(" ") || [];
        const idx = parts.findIndex(p => /\d/.test(p));

        let thuoc = thuocLieu || "";
        let lieuluong = "";

        if (idx !== -1) {
            thuoc = parts.slice(0, idx).join(" ");
            lieuluong = parts.slice(idx).join(" ");
        }

        return {
            userId,
            name: thuoc.trim(),
            lieu_luong: lieuluong.trim(),
            Cachdung: cachDung?.trim(),
            time: time,
            status: false
        };
    }

    // Apply prescription
    const applyPrescriptionOneWeek = async () => {
        const allParsedMedicines = [];

        Object.entries(medicines).forEach(([time, arr]) => {
            arr.forEach(item => {
                if (item.trim()) {
                    const parsed = parseMedicine(item, time, patient?.userId._id);
                    allParsedMedicines.push(parsed);
                    console.log("=> parse:", parsed);
                    dispatch(applyMedicines(parsed));
                }
            });
        });

        return allParsedMedicines;
    };

    // Xử lý khi submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await applyPrescriptionOneWeek();

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
                api: error.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
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

    const timeLabels = {
        sang: "Sáng",
        trua: "Trưa",
        toi: "Tối"
    };

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
            <div className="modal-dialog modal-lg" style={{ marginTop: "5rem", maxHeight: "90vh" }}>
                <div className="modal-content" style={{ borderRadius: "12px", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">
                            Chỉnh sửa thông tin y tế bệnh nhân
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                        <div className="modal-body" style={{ overflowY: "auto", flex: 1 }}>
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

                                {/* Phần thuốc */}
                                <div className="col-12 mt-4">
                                    <h6 className="fw-semibold text-primary mb-3">Đơn thuốc</h6>
                                </div>

                                {Object.entries(medicines).map(([time, medicineList]) => (
                                    <div key={time} className="col-12">
                                        <div
                                            className="p-3"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "8px",
                                                border: "1px solid #e9ecef"
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <label className="form-label fw-semibold mb-0" style={{ color: "#4F46E5" }}>
                                                    {timeLabels[time]}
                                                </label>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm"
                                                    style={{
                                                        color: "#4F46E5",
                                                        border: "1px solid #4F46E5",
                                                        borderRadius: "6px",
                                                        padding: "4px 12px"
                                                    }}
                                                    onClick={() => addMedicine(time)}
                                                >
                                                    <Plus size={16} className="me-1" />
                                                    Thêm thuốc
                                                </button>
                                            </div>

                                            {medicineList.length === 0 ? (
                                                <div className="text-muted small text-center py-2">
                                                    Chưa có thuốc
                                                </div>
                                            ) : (
                                                <div className="d-flex flex-column gap-2">
                                                    {medicineList.map((medicine, index) => (
                                                        <div key={index} className="d-flex gap-2 align-items-center">
                                                            <input
                                                                type="text"
                                                                style={{
                                                                    borderRadius: "6px",
                                                                    backgroundColor: "white"
                                                                }}
                                                                value={medicine}
                                                                onChange={(e) => updateMedicine(time, index, e.target.value)}
                                                                placeholder="Ví dụ: Metformin 500mg - uống sau ăn"
                                                                className={`form-control form-control-sm ${errors.medicine?.[`${time}_${index}`] ? 'is-invalid' : ''}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                style={{
                                                                    borderRadius: "6px",
                                                                    padding: "4px 8px"
                                                                }}
                                                                onClick={() => removeMedicine(time, index)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                            {errors.medicine?.[`${time}_${index}`] && (
                                                                <div className="invalid-feedback d-block mt-1 small">
                                                                    {errors.medicine[`${time}_${index}`]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                            <Button type="submit" variant="primary" onClick={handleSubmit}>
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPatientModal;