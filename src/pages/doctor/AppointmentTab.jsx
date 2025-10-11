import { useState, useMemo, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Pagination,
  Form,
  InputGroup,
  Image,
  Row,
  Col,
} from "react-bootstrap";
import { Search, Clock, CalendarDays, Plus, Trash2, Edit, Eye } from "lucide-react";
import AddAppointmentModal from "../../components/doctor/appointment/AddAppointmentModal";
import ViewAppointmentModal from "../../components/doctor/appointment/ViewAppointmentModal";
import EditAppointmentModal from "../../components/doctor/appointment/EditAppointmentModal";
import ApiDoctor from "../../apis/ApiDoctor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { getLabelFromOptions } from "../../utils/apppointmentHelper";
import { STATUS_COLORS, STATUS_OPTIONS, TYPE_OPTIONS } from "../../utils/appointmentConstants";
import { listenStatus, sendStatus } from "../../utils/SetupSignFireBase";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import ApiNotification from "../../apis/ApiNotification";


export default function AppointmentTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [todayPage, setTodayPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const itemsPerPage = 5;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const user = useSelector((state) => state.auth.userInfo);

  const fetchAppointments = async () => {
    try {
      const resToday = await ApiDoctor.getAppointmentsToday();
      setTodayAppointments(resToday.map(mapAppointment));
      const resUpcoming = await ApiDoctor.getAppointments();
      setUpcomingAppointments(resUpcoming.map(mapAppointment));
    } catch (err) {
      console.error("Lỗi lấy appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Lắng nghe tín hiệu hủy lịch qua Firestore (status message) trong chats
  let doctorUid = "1HwseYsBwxby5YnsLUWYzvRtCw53";
  let patientUid = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";
  useEffect(() => {
    const roomChats = [doctorUid, patientUid].sort().join("_");

    const unsub = listenStatus(roomChats, async (signal) => {
      if (signal?.status === "Đặt lịch" || signal?.status === "Hủy lịch" || signal?.status === "Xác nhận" || signal?.status === "Hủy bởi bác sĩ" || signal?.status === "Hoàn thành" || signal?.status === "Đang chờ") {
        fetchAppointments();
        let patientName = "";
        let patientAvatar = signal?.patientUid?.userId?.avatar || null;

        if (signal?.senderId) {
          try {
            const docRef = doc(db, "users", signal.senderId);
            const docSnap = await getDoc(docRef);
            console.log("DocSnap:", docSnap);
            if (docSnap.exists()) {
              patientName = docSnap.data().username;
              patientAvatar = docSnap.data().avatar;
            }
          } catch (error) {
            console.error("Lỗi lấy thông tin bệnh nhân:", error);
          }
        }
      }
    });

    return () => unsub();
  }, [doctorUid, patientUid]);

  const mapAppointment = (item) => ({
    id: item._id,
    patientName: item.patientId?.userId?.username || "",
    patientEmail: item.patientId?.userId?.email || "",
    patientAge: item.patientId?.age || "",
    patientDisease: item.patientId?.disease || "",
    patientAvatar:
      item.patientId?.userId?.avatar ||
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    date: new Date(item.date).toLocaleDateString("vi-VN"),
    time: item.time,
    type: item.type,
    reason: item.reason || "Tạm thời chưa có",
    doctor: item.doctorId?.userId?.username || "Tạm thời chưa có",
    notes: item.notes || "Tạm thời chưa có",
    status: item.status,
  });

  // Filter + Search
  const filteredToday = useMemo(() => {
    return todayAppointments.filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientDisease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDate = filterDate ? a.date === new Date(filterDate).toLocaleDateString("vi-VN") : true;

      return matchSearch && matchDate;
    });
  }, [todayAppointments, searchTerm, filterDate]);

  const filteredUpcoming = useMemo(() => {
    return upcomingAppointments.filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientDisease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDate = filterDate ? a.date === new Date(filterDate).toLocaleDateString("vi-VN") : true;

      return matchSearch && matchDate;
    });
  }, [upcomingAppointments, searchTerm, filterDate]);

  const handleAddAppointment = (newAppointmentData) => {
    const newAppointment = {
      id: Date.now(),
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newAppointmentData.patientName
      )}&size=150&background=random`,
      ...newAppointmentData,
    };
    setUpcomingAppointments((prev) => [...prev, newAppointment]);
    setShowAddModal(false);
  };

  const handleViewAppointment = async (appointment) => {
    try {
      const data = await ApiDoctor.getAppointmentById(appointment.id);
      const mapped = mapAppointment(data);
      setSelectedAppointment(mapped);
      setShowViewModal(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết lịch hẹn:", err);
      alert("Không thể tải chi tiết lịch hẹn.");
    }
  };

  const handleEditAppointment = async (appointment) => {
    try {
      const data = await ApiDoctor.getAppointmentById(appointment.id);
      const mapped = mapAppointment(data);
      setSelectedAppointment(mapped);
      setShowViewModal(false);
      setShowEditModal(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết lịch hẹn để chỉnh sửa:", err);
      alert("Không thể tải chi tiết lịch hẹn.");
    }
  };


  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const payload = {
        ...updatedAppointment,
        date: new Date(updatedAppointment.date).toISOString().split("T")[0], // Gửi YYYY-MM-DD cho API
      };

      await ApiDoctor.updateAppointment(updatedAppointment.id, payload);

      const doctorUid = "1HwseYsBwxby5YnsLUWYzvRtCw53";
      const patientUid = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2"; // Hardcode như code gốc
      if (payload.status === "confirmed") {
        await sendStatus(doctorUid, patientUid, "Xác nhận");
      } else if (payload.status === "canceled") {
        await sendStatus(doctorUid, patientUid, "Hủy bởi bác sĩ");
      }
      else if (payload.status === "completed") {
        await sendStatus(doctorUid, patientUid, "Hoàn thành");
      }
      else if (payload.status === "pending") {
        await sendStatus(doctorUid, patientUid, "Đang chờ");
      }
      await ApiNotification.createNotification({
        receiverId: patientUid,
        title: "Cập nhật lịch hẹn",
        content: `Lịch hẹn của bạn vào ngày ${new Date(updatedAppointment.date).toLocaleDateString("vi-VN")} lúc ${updatedAppointment.time} đã được cập nhật.`,
        metadata: {
          link: `/patient/appointments/${updatedAppointment.id}`
        },
        avatar: user?.avatar || null,
      });
      // Chuyển đổi lại date sang DD/MM/YYYY khi cập nhật state
      const updatedAppointmentWithFormattedDate = {
        ...updatedAppointment,
        date: new Date(updatedAppointment.date).toLocaleDateString("vi-VN"),
      };

      setUpcomingAppointments((prev) =>
        prev.map((app) =>
          app.id === updatedAppointment.id ? updatedAppointmentWithFormattedDate : app
        )
      );
      setTodayAppointments((prev) =>
        prev.map((app) =>
          app.id === updatedAppointment.id ? updatedAppointmentWithFormattedDate : app
        )
      );

      setShowEditModal(false);
      setSelectedAppointment(updatedAppointmentWithFormattedDate);
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch hẹn:", error);
      alert("Cập nhật lịch hẹn thất bại. Vui lòng thử lại.");
    }
  };
  const handleDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const confirmDeleteAppointment = async () => {
    try {
      if (!appointmentToDelete) return;

      await ApiDoctor.deleteAppointment(appointmentToDelete.id);

      const doctorUid = "1HwseYsBwxby5YnsLUWYzvRtCw53";
      const patientUid = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2"; // Hardcode
      await sendStatus(doctorUid, patientUid, "Hủy bởi bác sĩ");

      setUpcomingAppointments((prev) =>
        prev.filter((app) => app.id !== appointmentToDelete.id)
      );
      setTodayAppointments((prev) =>
        prev.filter((app) => app.id !== appointmentToDelete.id)
      );

      setShowDeleteModal(false);
      setAppointmentToDelete(null);
      await ApiNotification.createNotification({
        receiverId: patientUid,
        avatar: user?.avatar || null,
        title: "Lịch hẹn bị hủy",
        content: `Lịch hẹn của bạn vào ngày ${appointmentToDelete.date} lúc ${appointmentToDelete.time} đã bị hủy.`,
        metadata: {
          link: `/patient/appointments/${appointmentToDelete.id}`
        },
      });
    } catch (error) {
      console.error("Lỗi khi xóa lịch hẹn:", error);
      alert("Xóa lịch hẹn thất bại. Vui lòng thử lại.");
    }
  };

  // Pagination
  const paginate = (appointments, page) =>
    appointments.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const renderPagination = (currentPage, totalPages, setPage) => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Pagination.Item key={page} active={page === currentPage} onClick={() => setPage(page)}>
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
    </Pagination>
  );

  const renderTable = (appointments, paginated, totalPages, page, setPage) => (
    <>
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Chẩn đoán</th>
              <th>Thời gian</th>
              <th>Loại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image
                        roundedCircle
                        width={40}
                        height={40}
                        src={appointment.patientAvatar}
                        alt={appointment.patientName}
                        className="me-2"
                      />
                      <div>
                        <div className="fw-semibold">{appointment.patientName}</div>
                        <div className="text-muted small">{appointment.patientAge} tuổi</div>
                      </div>
                    </div>
                  </td>
                  <td>{appointment.patientDisease}</td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <Clock size={12} /> <span className="ms-2">{appointment.date} - </span>
                      <span className="fs-6 ms-1">{appointment.time}</span>
                    </div>
                  </td>
                  <td>{getLabelFromOptions(TYPE_OPTIONS, appointment.type)}</td>
                  <td>
                    <span
                      className={`badge bg-${STATUS_COLORS[appointment.status]?.bg} text-${STATUS_COLORS[appointment.status]?.text}`}
                    >
                      {getLabelFromOptions(STATUS_OPTIONS, appointment.status)}
                    </span>
                  </td>
                  <td>
                    <Button variant="link" className="p-0 me-2" onClick={() => handleViewAppointment(appointment)}>
                      <Eye size={16} />
                    </Button>
                    <Button variant="link" className="p-0 me-2" onClick={() => handleEditAppointment(appointment)}>
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={() => handleDeleteAppointment(appointment)}
                    >
                      <Trash2 size={16} />
                    </Button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">Không có lịch hẹn.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {totalPages > 1 && renderPagination(page, totalPages, setPage)}
    </>
  );
  return (
    <div className="m-2">
      <h3 className="mb-4">Lịch hẹn khám bệnh</h3>

      {/* Hôm nay */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="row mb-3 justify-content-between align-items-center">
            <div className="col-12 col-lg-6">
              <h5>Lịch hẹn hôm nay</h5>
              <div className="text-primary small">{filteredToday.length} cuộc hẹn</div>
            </div>
            <div className="row col-12 col-lg-6">
              <div className="col-4 col-lg-4">
                <InputGroup>
                  <Form.Control placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <InputGroup.Text><Search size={16} /></InputGroup.Text>
                </InputGroup>
              </div>
              <div className="col-4 col-lg-4">
                <div className="d-flex">
                  <DatePicker
                    selected={filterDate}
                    onChange={(date) => setFilterDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    placeholderText="Chọn ngày"
                    locale={vi}
                  />
                </div>
              </div>
              <div className="col-4 col-lg-4">
                <Button onClick={() => setShowAddModal(true)}><Plus size={16} /> Thêm</Button>
              </div>
            </div>
          </div>
          {renderTable(todayAppointments, paginate(filteredToday, todayPage), Math.ceil(filteredToday.length / itemsPerPage), todayPage, setTodayPage)}
        </Card.Body>
      </Card>

      {/* Sắp tới */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Lịch hẹn sắp tới</h5>
          {renderTable(upcomingAppointments, paginate(filteredUpcoming, upcomingPage), Math.ceil(filteredUpcoming.length / itemsPerPage), upcomingPage, setUpcomingPage)}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddAppointmentModal show={showAddModal} onHide={() => setShowAddModal(false)} onSave={handleAddAppointment} />
      <ViewAppointmentModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        appointment={selectedAppointment}
        onEdit={handleEditAppointment}
      />

      <EditAppointmentModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        appointment={selectedAppointment}
        onSave={handleUpdateAppointment}
      />
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc chắn muốn xóa lịch hẹn của{" "}
                  <strong>{appointmentToDelete?.patientName}</strong> vào ngày{" "}
                  <strong>{appointmentToDelete?.date}</strong> lúc{" "}
                  <strong>{appointmentToDelete?.time}</strong> không?
                </p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Hủy
                </Button>
                <Button variant="danger" onClick={confirmDeleteAppointment}>
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
