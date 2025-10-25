import { useState } from "react";
import { Button, Input, Select, Modal } from "../common-ui-components";
import ApiBooking from "../../../apis/ApiBooking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { book_appointment } from "../../../apis/assistant";
import { useSelector } from "react-redux";
import { sendStatus } from "../../../utils/SetupSignFireBase";
import ApiNotification from "../../../apis/ApiNotification";
import { getBalanceService, withdrawService } from "../../../apis/paymentService";

const CreateFollowUpModal = ({ show, onHide, patient, onSave }) => {
    const user = useSelector((state) => state.auth.userInfo);
    const [formData, setFormData] = useState({
        date: null,
        time: "",
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
    const [showTimeList, setShowTimeList] = useState(false);
    const BOOKING_FEE = import.meta.env.VITE_BOOKING_FEE;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const formattedDate = formData.date.toISOString().split("T")[0];
            const formattedTime = formData.time;
            const fullDateTime = `${formattedDate}T${formattedTime}`; // 👈 chỉ dùng cho calendar

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
                content: `Bác sĩ ${user.username || ""} đã đặt lịch tái khám vào ${formattedDate} lúc ${formattedTime}.`,
                type: "system",
                metadata: {
                    link: `/patient/appointments/${response.id}`,
                },
                avatar: user.avatar || "",
            });

            await sendStatus(user?.uid, patient.uid, "Đặt lịch");
            await book_appointment.post("/create-calendar-schedule", {
                email_Patient: patient.email,
                email_Docter: user.email,
                period: 30,
                time: fullDateTime,
                location: formData.type,
            });

            // trừ phí đặt lịch
            await withdrawService(patient.userId, BOOKING_FEE);

            setSuccessMessage(`Đặt lịch hẹn tái khám thành công với bệnh nhân ${patient.name} vào ${formattedDate} lúc ${formattedTime}!`);
            setShowSuccessModal(true);
            onSave(response);
            onHide();
        } catch (err) {
            const msg = err.message || "Không thể tạo lịch, vui lòng thử lại.";
            setErrorMessage(msg);
            setShowErrorModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Danh sách giờ
    const availableTimes = [];
    for (let hour = 8; hour <= 16; hour++) {
        const h = hour.toString().padStart(2, "0");
        if (hour === 12) {
            availableTimes.push(`${h}:00`);
            continue;
        }
        availableTimes.push(`${h}:00`);
        availableTimes.push(`${h}:30`);
    }

    if (!show) return null;

    return (
        <>
            <div
                className="modal fade show d-block mt-5"
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
                                    {/* Bệnh nhân */}
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Bệnh nhân
                                        </label>
                                        <Input
                                            value={patient?.name || ""}
                                            disabled
                                            className="bg-light shadow-sm"
                                        />
                                    </div>

                                    {/* Ngày tái khám */}
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
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Giờ tái khám */}
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Giờ tái khám
                                        </label>
                                        <div style={{ position: "relative", width: "60%" }}>
                                            <div
                                                onClick={() =>
                                                    setShowTimeList((prev) => !prev)
                                                }
                                                className="shadow-sm bg-light"
                                                style={{
                                                    borderRadius: "8px",
                                                    padding: "8px",
                                                    cursor: "pointer",
                                                    border: "1px solid #ced4da",
                                                }}
                                            >
                                                {formData.time || "-- Chọn giờ --"}
                                            </div>

                                            {showTimeList && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "100%",
                                                        left: 0,
                                                        right: 0,
                                                        zIndex: 1000,
                                                        background: "#fff",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "8px",
                                                        maxHeight: "150px", // 👈 chỉ hiển thị ~5 dòng
                                                        overflowY: "auto",
                                                    }}
                                                >
                                                    {availableTimes.map((time) => (
                                                        <div
                                                            key={time}
                                                            onClick={() => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    time,
                                                                }));
                                                                setShowTimeList(false);
                                                            }}
                                                            style={{
                                                                padding: "6px 10px",
                                                                cursor: "pointer",
                                                                backgroundColor:
                                                                    formData.time === time
                                                                        ? "#e9ecef"
                                                                        : "white",
                                                            }}
                                                            onMouseEnter={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                "#f1f3f5")
                                                            }
                                                            onMouseLeave={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                formData.time === time
                                                                    ? "#e9ecef"
                                                                    : "white")
                                                            }
                                                        >
                                                            {time}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Loại lịch hẹn */}
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Loại lịch hẹn
                                        </label>
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

                                    {/* Lý do tái khám */}
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Lý do tái khám
                                        </label>
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
                                            }}
                                        />
                                    </div>

                                    {/* Ghi chú */}
                                    <div>
                                        <label className="form-label fw-semibold">
                                            Ghi chú
                                        </label>
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
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
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
