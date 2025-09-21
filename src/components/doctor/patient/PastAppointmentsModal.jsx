import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "../common-ui-components";
import ApiDoctor from "../../../apis/ApiDoctor";

const PastAppointmentsModal = ({ show, onHide, patientId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gọi API để lấy lịch hẹn đã khám
    useEffect(() => {
        if (!show || !patientId) return;

        const fetchPastAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await ApiDoctor.getPatientPastAppointments(patientId);
                console.log("Past Appointments Data:", response); // Debug
                setAppointments(Array.isArray(response) ? response : response.data || []);
            } catch (err) {
                console.error("Lỗi khi gọi API lịch hẹn:", err.message, err.response?.data);
                setError(
                    err.response?.data?.message || "Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPastAppointments();
    }, [show, patientId]);

    if (!show) return null;

    return (
        <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-lg" style={{ marginTop: "5rem", maxWidth: "800px" }}>
                <div
                    className="modal-content"
                    style={{
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        border: "none",
                        overflow: "hidden",
                    }}
                >
                    <div
                        className="modal-header border-0 py-3 px-4"
                        style={{ backgroundColor: "#f8f9fa" }}
                    >
                        <h5 className="modal-title fw-bold text-dark">Lịch sử khám</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onHide}
                            style={{ fontSize: "1rem" }}
                        ></button>
                    </div>
                    <div className="modal-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Đang tải danh sách lịch hẹn...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger" role="alert">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="table-responsive">
                                <table
                                    className="table table-hover"
                                    style={{ borderCollapse: "separate", borderSpacing: 0 }}
                                >
                                    <thead
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            color: "#1e40af",
                                            fontWeight: 600,
                                        }}
                                    >
                                        <tr>
                                            <th
                                                scope="col"
                                                style={{
                                                    padding: "12px",
                                                    borderTopLeftRadius: "8px",
                                                    borderBottom: "1px solid #e0e7ff",
                                                }}
                                            >
                                                Ngày
                                            </th>
                                            <th
                                                scope="col"
                                                style={{ padding: "12px", borderBottom: "1px solid #e0e7ff" }}
                                            >
                                                Giờ
                                            </th>
                                            <th
                                                scope="col"
                                                style={{ padding: "12px", borderBottom: "1px solid #e0e7ff" }}
                                            >
                                                Bác sĩ
                                            </th>
                                            <th
                                                scope="col"
                                                style={{
                                                    padding: "12px",
                                                    borderTopRightRadius: "8px",
                                                    borderBottom: "1px solid #e0e7ff",
                                                }}
                                            >
                                                Bệnh viện
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appt) => (
                                            <tr
                                                key={appt._id}
                                                style={{ transition: "background-color 0.2s" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f7ff")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                                            >
                                                <td style={{ padding: "12px" }}>
                                                    {new Date(appt.date).toLocaleDateString("vi-VN", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                                </td>
                                                <td style={{ padding: "12px" }}>{appt.time || "-"}</td>
                                                <td style={{ padding: "12px" }}>
                                                    {appt.doctorId?.userId?.username || "Không xác định"}
                                                </td>
                                                <td style={{ padding: "12px" }}>{appt.doctorId?.hospital || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p
                                className="text-muted mb-0"
                                style={{ fontStyle: "italic", fontSize: "0.9rem" }}
                            >
                                Không có lịch hẹn nào trong quá khứ.
                            </p>
                        )}
                    </div>
                    <div className="modal-footer border-0 pt-0 pb-4 px-4">
                        <Button
                            variant="secondary"
                            onClick={onHide}
                            style={{ borderRadius: "8px", padding: "8px 20px" }}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastAppointmentsModal;