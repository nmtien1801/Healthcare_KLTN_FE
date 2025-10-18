import { useState } from "react";
import { Button, Input, Select, Modal } from "../common-ui-components";
import ApiBooking from "../../../apis/ApiBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { book_appointment } from "../../../apis/assistant";
import { useSelector } from "react-redux";
import { sendStatus } from "../../../utils/SetupSignFireBase";
import ApiNotification from "../../../apis/ApiNotification";

const CreateFollowUpModal = ({ show, onHide, patient, onSave }) => {
    const user = useSelector((state) => state.auth.userInfo);
    const [formData, setFormData] = useState({
        date: null,
        time: null,
        type: "onsite",
        reason: "",
        notes: "",
    });

    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modals
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [showCancelErrorModal, setShowCancelErrorModal] = useState(false);
    const [cancelErrorMessage, setCancelErrorMessage] = useState("");

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, date }));
    };

    const handleTimeChange = (time) => {
        setFormData((prev) => ({ ...prev, time }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const formattedDate = formData.date
                ? formData.date.toISOString().split("T")[0]
                : "";
            const formattedTime = formData.time
                ? formData.time.toTimeString().slice(0, 5)
                : "";

            if (!formattedDate || !formattedTime) {
                throw new Error("Vui lòng chọn ngày và giờ tái khám.");
            }

            const response = await ApiBooking.createFollowUpAppointment({
                firebaseUid: user.uid,
                patientId: patient.id,
                date: formattedDate,
                time: formattedTime,
                type: formData.type,
                reason: formData.reason,
                notes: formData.notes,
            });
            await ApiNotification.createNotification({
                receiverId: patient.uid,
                title: "Bác sĩ đặt lịch tái khám",
                content: `Bác sĩ ${user.username || ""} đã đặt lịch tái khám cho bạn vào ngày ${formattedDate} lúc ${formattedTime}. Vui lòng kiểm tra chi tiết lịch hẹn.`,
                type: "system",
                metadata: {
                    link: `/patient/appointments/${response.id}`,
                },
                avatar: user.avatar || "", // avatar người gửi (nếu có)
            });
            await sendStatus(patient.uid, user?.uid, "Đặt lịch");
            await book_appointment.post(
                "/create-calendar-schedule",
                {
                    email_Patient: patient.email,
                    email_Docter: user.email,
                    period: 30,
                    time: formattedTime,
                    location: formData.type
                }
            );
            setSuccessMessage("Đặt lịch hẹn tái khám thành công!");
            setShowSuccessModal(true);
            onSave(response);
            onHide();
        } catch (err) {
            const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Không thể tạo lịch. Vui lòng thử lại sau.";
            setCancelErrorMessage(errorMsg);
            setShowCancelErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tạo danh sách giờ từ 8:00 đến 16:30
    const availableTimes = [];
    for (let hour = 8; hour <= 16; hour++) {
        availableTimes.push(new Date().setHours(hour, 0, 0, 0));
        if (hour < 16) {
            availableTimes.push(new Date().setHours(hour, 30, 0, 0));
        } else if (hour === 16) {
            availableTimes.push(new Date().setHours(hour, 30, 0, 0));
        }
    }

    if (!show) return null;

    return (
        <>
            <div
                className="modal fade show d-block"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                onClick={onHide}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="modal-content border-0 shadow-sm"
                        style={{ borderRadius: "12px" }}
                    >
                        <div className="modal-header bg-primary text-white border-0">
                            <h5 className="modal-title fw-semibold">
                                Tạo Lịch Hẹn Tái Khám
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onHide}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body p-4">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="d-flex flex-column gap-3">
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Bệnh nhân
                                        </label>
                                        <div>
                                            <Input
                                                value={patient?.name || ""}
                                                disabled
                                                className="bg-light shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">
                                            Ngày tái khám
                                        </label>
                                        <div>
                                            <DatePicker
                                                selected={formData.date}
                                                onChange={handleDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Chọn ngày"
                                                className="form-control shadow-sm"
                                                style={{
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f8f9fa",
                                                    width: "100%",
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">
                                            Giờ tái khám
                                        </label>
                                        <div>
                                            <DatePicker
                                                selected={formData.time}
                                                onChange={handleTimeChange}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                includeTimes={availableTimes}
                                                dateFormat="HH:mm"
                                                placeholderText="Chọn giờ (08:00 - 16:30)"
                                                className="form-control shadow-sm"
                                                style={{
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f8f9fa",
                                                    width: "100%",
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">
                                            Loại lịch hẹn
                                        </label>
                                        <div>
                                            <Select
                                                name="type"
                                                value={formData.type}
                                                onChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        type: value,
                                                    }))
                                                }
                                                className="shadow-sm"
                                            >
                                                <option value="onsite">Tại phòng khám</option>
                                                <option value="online">Trực tuyến</option>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">
                                            Lý do tái khám
                                        </label>
                                        <div>
                                            <textarea
                                                className="form-control shadow-sm"
                                                name="reason"
                                                value={formData.reason}
                                                onChange={handleChange}
                                                placeholder="Nhập lý do tái khám..."
                                                rows={3}
                                                style={{
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f8f9fa",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">
                                            Ghi chú
                                        </label>
                                        <div>
                                            <textarea
                                                className="form-control shadow-sm"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                placeholder="Nhập ghi chú (nếu có)..."
                                                rows={3}
                                                style={{
                                                    borderRadius: "8px",
                                                    backgroundColor: "#f8f9fa",
                                                    width: "100%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">
                                    <Button
                                        variant="light"
                                        onClick={onHide}
                                        disabled={isSubmitting}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Đang tạo...
                                                </span>
                                            </div>
                                        ) : (
                                            "Tạo lịch hẹn"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Đặt lịch thành công!"
                type="success"
            >
                <p className="mb-4">{successMessage}</p>
                <button
                    className="btn btn-success"
                    onClick={() => setShowSuccessModal(false)}
                >
                    Đóng
                </button>
            </Modal>

            {/* Cancel Error Modal */}
            <Modal
                show={showCancelErrorModal}
                onClose={() => setShowCancelErrorModal(false)}
                title="Lỗi tạo lịch hẹn"
                type="danger"
            >
                <p className="mb-4">{cancelErrorMessage}</p>
                <button
                    className="btn btn-danger"
                    onClick={() => setShowCancelErrorModal(false)}
                >
                    Đóng
                </button>
            </Modal>

            {/* General Error Modal */}
            <Modal
                show={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Lỗi"
                type="danger"
            >
                <p className="mb-4">{errorMessage}</p>
                <button
                    className="btn btn-danger"
                    onClick={() => setShowErrorModal(false)}
                >
                    Đóng
                </button>
            </Modal>
        </>
    );
};

export default CreateFollowUpModal;