import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Pill } from "lucide-react";
import { Button } from "../common-ui-components";
import ApiDoctor from "../../../apis/ApiDoctor";
import ApiPatient from "../../../apis/ApiPatient"; // Thêm nếu bạn gọi từ service bệnh nhân

const PastAppointmentsModal = ({ show, onHide, patientId }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [medicines, setMedicines] = useState({});
    const [loadingMed, setLoadingMed] = useState(false);

    useEffect(() => {
        if (!show || !patientId) return;
        const fetchPastAppointments = async () => {
            setLoading(true);
            try {
                const response = await ApiDoctor.getPatientPastAppointments(patientId);
                setAppointments(Array.isArray(response) ? response : response.data || []);
            } catch (err) {
                setError("Không thể tải danh sách lịch hẹn.");
            } finally {
                setLoading(false);
            }
        };
        fetchPastAppointments();
    }, [show, patientId]);

    const handleToggle = async (id) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }
        setExpandedId(id);
        if (!medicines[id]) {
            setLoadingMed(true);
            try {
                const res = await ApiPatient.getMedicinesByAppointment(id);
                setMedicines((prev) => ({ ...prev, [id]: res.DT || [] }));
            } catch (error) {
                console.error("Lỗi tải thuốc:", error);
            } finally {
                setLoadingMed(false);
            }
        }
    };

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
                        overflow: "hidden",
                    }}
                >
                    <div className="modal-header border-0 py-3 px-4" style={{ backgroundColor: "#f8f9fa" }}>
                        <h5 className="modal-title fw-bold text-dark">Lịch sử khám</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body p-4">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" />
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : appointments.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Giờ</th>
                                            <th>Bác sĩ</th>
                                            <th>Bệnh viện</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appt) => (
                                            <>
                                                <tr
                                                    key={appt._id}
                                                    onClick={() => handleToggle(appt._id)}
                                                    style={{
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s",
                                                        backgroundColor: expandedId === appt._id ? "#f0f7ff" : "white",
                                                    }}
                                                >
                                                    <td>
                                                        {new Date(appt.date).toLocaleDateString("vi-VN", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </td>
                                                    <td>{appt.time || "-"}</td>
                                                    <td>{appt.doctorId?.userId?.username || "Không xác định"}</td>
                                                    <td>{appt.doctorId?.hospital || "-"}</td>
                                                    <td className="text-end">
                                                        {expandedId === appt._id ? (
                                                            <ChevronUp size={18} color="#2563eb" />
                                                        ) : (
                                                            <ChevronDown size={18} color="#2563eb" />
                                                        )}
                                                    </td>
                                                </tr>

                                                {expandedId === appt._id && (
                                                    <tr>
                                                        <td colSpan="5">
                                                            <div
                                                                className="p-3 rounded bg-light border mt-2"
                                                                style={{
                                                                    borderLeft: "4px solid #2563eb",
                                                                    backgroundColor: "#f9fafb",
                                                                }}
                                                            >
                                                                {loadingMed ? (
                                                                    <div className="text-center py-3">
                                                                        <div className="spinner-border text-primary" />
                                                                    </div>
                                                                ) : medicines[appt._id]?.length > 0 ? (
                                                                    medicines[appt._id].map((med) => (
                                                                        <div
                                                                            key={med._id}
                                                                            className="d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded shadow-sm"
                                                                            style={{
                                                                                border: "1px solid #e5e7eb",
                                                                            }}
                                                                        >
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <Pill size={18} color="#2563eb" />
                                                                                <div>
                                                                                    <div className="fw-semibold text-dark">{med.name}</div>
                                                                                    <small className="text-muted">
                                                                                        Liều lượng: {med.lieu_luong}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                            <small className="text-muted">
                                                                                {new Date(med.time).toLocaleTimeString("vi-VN", {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                })}
                                                                            </small>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-muted fst-italic text-center">
                                                                        Không có thuốc trong ngày khám này.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-muted fst-italic">Không có lịch hẹn nào trong quá khứ.</p>
                        )}
                    </div>
                    <div className="modal-footer border-0 pt-0 pb-4 px-4">
                        <Button variant="secondary" onClick={onHide}>
                            Đóng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PastAppointmentsModal;
