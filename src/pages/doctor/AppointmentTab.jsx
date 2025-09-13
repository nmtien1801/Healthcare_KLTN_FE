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

  useEffect(() => {
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
    fetchAppointments();
  }, []);

  const mapAppointment = (item) => ({
    id: item._id,
    patientName: item.patientId?.userId?.username || "N/A",
    patientAge: item.patientId?.age || "N/A",
    patientDisease: item.patientId?.disease || "N/A",
    patientAvatar:
      item.patientId?.userId?.avatar ||
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    date: new Date(item.date).toLocaleDateString("vi-VN"),
    time: item.time,
    type: item.type === "onsite" ? "Tại phòng khám" : "Khám trực tuyến",
    reason: item.reason || "Tạm thời chưa có",
    doctor: item.doctorId?.userId?.username || "Tạm thời chưa có",
    notes: item.notes || "Tạm thời chưa có",
    status: item.status === "pending" ? "Chờ xác nhận" : "Đã xác nhận",
  });

  const getStatusColors = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return { bg: "success", text: "white" };
      case "Chờ xác nhận":
        return { bg: "warning", text: "dark" };
      case "Đã hủy":
        return { bg: "danger", text: "white" };
      case "Hoàn thành":
        return { bg: "primary", text: "white" };
      default:
        return { bg: "secondary", text: "white" };
    }
  };

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

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    setUpcomingAppointments((prev) =>
      prev.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
    setShowEditModal(false);
    setSelectedAppointment(updatedAppointment);
    setShowViewModal(true);
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) {
      setUpcomingAppointments((prev) => prev.filter((app) => app.id !== id));
      setTodayAppointments((prev) => prev.filter((app) => app.id !== id));
      setShowViewModal(false);
      setShowEditModal(false);
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
                      <Clock size={12} /> {appointment.time}
                      <span className="ms-2"><CalendarDays size={12} /> {appointment.date}</span>
                    </div>
                  </td>
                  <td>{appointment.type}</td>
                  <td>
                    <span className={`badge bg-${getStatusColors(appointment.status).bg} text-${getStatusColors(appointment.status).text}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <Button variant="link" className="p-0 me-2" onClick={() => handleViewAppointment(appointment)}>
                      <Eye size={16} />
                    </Button>
                    <Button variant="link" className="p-0 me-2" onClick={() => handleEditAppointment(appointment)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="link" className="p-0 text-danger" onClick={() => handleDeleteAppointment(appointment.id)}>
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
    <div className="container mt-4">
      <h3 className="mb-4">Lịch hẹn khám bệnh</h3>

      {/* Hôm nay */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="mb-3 align-items-center">
            <Col>
              <h5>Lịch hẹn hôm nay</h5>
              <div className="text-primary small">{filteredToday.length} cuộc hẹn</div>
            </Col>
            <Col md="auto">
              <InputGroup>
                <InputGroup.Text><Search size={16} /></InputGroup.Text>
                <Form.Control placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </InputGroup>
            </Col>
            <Col md="auto">
              <DatePicker
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="Chọn ngày"
                locale={vi}
              />
            </Col>
            <Col md="auto">
              <Button onClick={() => setShowAddModal(true)}><Plus size={16} /> Thêm</Button>
            </Col>
          </Row>
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
      <ViewAppointmentModal show={showViewModal} onHide={() => setShowViewModal(false)} appointment={selectedAppointment} onEdit={handleEditAppointment} />
      <EditAppointmentModal show={showEditModal} onHide={() => setShowEditModal(false)} appointment={selectedAppointment} onSave={handleUpdateAppointment} />
    </div>
  );
}
