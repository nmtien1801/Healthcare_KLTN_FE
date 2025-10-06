import { useState, useEffect } from "react";
import { Clock, CalendarDays, User, Stethoscope, FileText } from "lucide-react";
import { Button, Input, Select } from "../common-ui-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { TYPE_OPTIONS, STATUS_OPTIONS } from "../../../utils/appointmentConstants";
import { book_appointment } from "../../../apis/assistant";
import { useSelector, useDispatch } from "react-redux";

const EditAppointmentModal = ({ show, onHide, appointment, onSave }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.userInfo);
    const [formData, setFormData] = useState({
        patientName: "",
        patientAge: "",
        patientDisease: "",
        date: "",
        time: "",
        type: "",
        reason: "",
        doctor: "",
        notes: "",
        status: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (appointment) {
            setFormData({
                patientName: appointment.patientName || "",
                patientAge: appointment.patientAge || "",
                patientDisease: appointment.patientDisease || "",
                date: appointment.date || "", // Đã ở định dạng DD/MM/YYYY
                time: appointment.time || "",
                type: appointment.type || "onsite",
                reason: appointment.reason || "",
                doctor: appointment.doctor || "",
                notes: appointment.notes || "",
                status: appointment.status || "pending",
            });
        }
    }, [appointment]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.patientName.trim()) newErrors.patientName = "Tên bệnh nhân là bắt buộc";
        if (!formData.patientAge || formData.patientAge < 1 || formData.patientAge > 120)
            newErrors.patientAge = "Tuổi phải từ 1-120";
        if (!formData.patientDisease.trim()) newErrors.patientDisease = "Bệnh là bắt buộc";
        if (!formData.date.trim()) newErrors.date = "Ngày hẹn là bắt buộc";
        if (!formData.time.trim()) newErrors.time = "Giờ hẹn là bắt buộc";
        if (!formData.reason.trim()) newErrors.reason = "Lý do khám là bắt buộc";
        if (!formData.doctor.trim()) newErrors.doctor = "Bác sĩ là bắt buộc";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        date.setHours(date.getHours() + 7);
        return date;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const parsedDate = parseDate(formData.date);

            const payload = {
                ...appointment,
                ...formData,
                id: appointment.id,
                date: parsedDate ? parsedDate.toISOString().split("T")[0] : "", // Gửi YYYY-MM-DD cho API
            };

            // Kiểm tra nếu tình trạng là "đã xác nhận"
            if (formData.status === "confirmed") {
                try {
                    // Hàm chuyển đổi định dạng ngày/giờ
                    const formatDateTime = (dateStr, timeStr) => {
                        const [day, month, year] = dateStr.split('/');
                        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                        const formattedTime = timeStr;
                        return `${formattedDate}T${formattedTime}`;
                    };

                    const calendarTime = formatDateTime(appointment.date, appointment.time);

                    const res = await book_appointment.post(
                        "/create-calendar-schedule",
                        {
                            email_Patient: appointment.patientEmail,
                            email_Docter: user.email,
                            period: 30,  // thời lượng buổi hẹn
                            time: calendarTime,
                            location: appointment.type  // "online"
                        }
                    );
                } catch (err) {
                    console.error(err);
                }
            }

            onSave(payload);
            setErrors({});
            onHide();
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    if (!show || !appointment) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-md" style={{ marginTop: "5rem" }}>
                <div className="modal-content" style={{ borderRadius: "12px" }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Chỉnh sửa lịch hẹn</h5>
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
                                    <DatePicker
                                        selected={formData.date ? parseDate(formData.date) : null}
                                        onChange={(date) =>
                                            handleChange("date", date ? date.toLocaleDateString("vi-VN") : "")
                                        }
                                        dateFormat="dd/MM/yyyy"
                                        className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                        placeholderText="Chọn ngày"
                                        locale={vi}
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
                                    <Select
                                        value={formData.type}
                                        onChange={(value) => handleChange("type", value)}
                                    >
                                        {TYPE_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
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
                                <div className="col-12">
                                    <label className="form-label fw-medium">Tình trạng</label>
                                    <Select
                                        value={formData.status}
                                        onChange={(value) => handleChange("status", value)}
                                    >
                                        {STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </Select>
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
    );
};

export default EditAppointmentModal;