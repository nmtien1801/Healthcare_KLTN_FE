import { useState, useMemo } from "react";
import { Card, Button, Row, Col, Table, Pagination, Form, InputGroup, Image } from "react-bootstrap";
import { ChevronLeft, ChevronRight, Search, Clock, CalendarDays, Plus, Trash2, Edit, Eye } from "lucide-react";
import AddAppointmentModal from "../../components/doctor/appointment/AddAppointmentModal";
import ViewAppointmentModal from "../../components/doctor/appointment/ViewAppointmentModal";
import EditAppointmentModal from "../../components/doctor/appointment/EditAppointmentModal";

const initialAppointments = [
  {
    id: 1,
    patientName: "Trần Văn Bình",
    patientAge: 68,
    patientDisease: "Tăng huyết áp, Tiểu đường type 2",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    date: "23/06/2025",
    time: "09:30",
    type: "Tái khám",
    reason: "Kiểm tra định kỳ và điều chỉnh liều thuốc huyết áp",
    doctor: "BS. Nguyễn Văn A",
    notes: "Bệnh nhân có tiền sử dị ứng với Penicillin",
    status: "Đã xác nhận",
  },
  {
    id: 2,
    patientName: "Nguyễn Thị Mai",
    patientAge: 52,
    patientDisease: "Tiểu đường type 2",
    patientAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    date: "23/06/2025",
    time: "10:45",
    type: "Tái khám",
    reason: "Kiểm tra đường huyết và tư vấn chế độ ăn uống",
    doctor: "BS. Lê Thị B",
    notes: "",
    status: "Đã xác nhận",
  },
  {
    id: 3,
    patientName: "Lê Minh Tuấn",
    patientAge: 35,
    patientDisease: "Viêm phổi",
    patientAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    date: "23/06/2025",
    time: "14:00",
    type: "Tái khám",
    reason: "Tái khám sau điều trị viêm phổi",
    doctor: "BS. Trần Văn C",
    notes: "Bệnh nhân đã hoàn thành liệu trình kháng sinh",
    status: "Chờ xác nhận",
  },
  {
    id: 4,
    patientName: "Phạm Thị Hương",
    patientAge: 72,
    patientDisease: "Suy tim, Tăng huyết áp",
    patientAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    date: "24/06/2025",
    time: "08:15",
    type: "Tái khám",
    reason: "Kiểm tra chức năng tim và huyết áp",
    doctor: "BS. Nguyễn Văn A",
    notes: "Cần làm thêm xét nghiệm điện tâm đồ",
    status: "Đã xác nhận",
  },
  {
    id: 5,
    patientName: "Đỗ Thanh Hà",
    patientAge: 45,
    patientDisease: "Viêm khớp dạng thấp",
    patientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    date: "24/06/2025",
    time: "11:30",
    type: "Khám mới",
    reason: "Đau khớp gối kéo dài",
    doctor: "BS. Lê Thị B",
    notes: "Bệnh nhân chưa từng khám tại phòng khám",
    status: "Đã xác nhận",
  },
  {
    id: 6,
    patientName: "Vũ Văn Khang",
    patientAge: 55,
    patientDisease: "Viêm dạ dày",
    patientAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cfd72fee?w=150&h=150&fit=crop&crop=face",
    date: "25/06/2025",
    time: "09:00",
    type: "Tái khám",
    reason: "Kiểm tra sau điều trị dạ dày",
    doctor: "BS. Trần Văn C",
    notes: "",
    status: "Chờ xác nhận",
  },
  {
    id: 7,
    patientName: "Trần Thị Yến",
    patientAge: 30,
    patientDisease: "Cảm cúm",
    patientAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    date: "26/06/2025",
    time: "16:00",
    type: "Khám mới",
    reason: "Sốt, ho, đau họng",
    doctor: "BS. Nguyễn Văn A",
    notes: "",
    status: "Chờ xác nhận",
  },
];

export default function AppointmentTab() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-06-23"));
  const [searchTerm, setSearchTerm] = useState("");
  const [allAppointments, setAllAppointments] = useState(initialAppointments);
  const [viewMode, setViewMode] = useState("day");
  const [todayPage, setTodayPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const formattedDate = useMemo(() => {
    if (viewMode === "day") {
      const options = { weekday: "long", day: "numeric", month: "numeric", year: "numeric" };
      return currentDate.toLocaleDateString("vi-VN", options);
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const startOptions = { day: "numeric", month: "numeric" };
      const endOptions = { day: "numeric", month: "numeric", year: "numeric" };
      return `Tuần từ ${startOfWeek.toLocaleDateString("vi-VN", startOptions)} đến ${endOfWeek.toLocaleDateString("vi-VN", endOptions)}`;
    }
  }, [currentDate, viewMode]);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
    setTodayPage(1); // Reset pagination
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
    setTodayPage(1); // Reset pagination
  };

  const handleToday = () => {
    setCurrentDate(new Date("2025-06-23"));
    setViewMode("day");
    setTodayPage(1); // Reset pagination
  };

  const handleThisWeek = () => {
    const today = new Date("2025-06-23");
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    setCurrentDate(startOfWeek);
    setViewMode("week");
    setTodayPage(1); // Reset pagination
  };

  const filteredAppointments = useMemo(() => {
    const filteredBySearch = allAppointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patientDisease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (viewMode === "day") {
      const currentDayString = currentDate.toLocaleDateString("vi-VN");
      const today = filteredBySearch.filter((appointment) => appointment.date === currentDayString);
      const upcoming = filteredBySearch.filter((appointment) => {
        const apptDate = new Date(appointment.date.split("/").reverse().join("-"));
        return apptDate > currentDate && appointment.date !== currentDayString;
      });
      return { today, upcoming };
    } else {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const currentWeekAppointments = filteredBySearch
        .filter((appointment) => {
          const apptDate = new Date(appointment.date.split("/").reverse().join("-"));
          return apptDate >= startOfWeek && apptDate <= endOfWeek;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.date.split("/").reverse().join("-")}T${a.time}`);
          const dateB = new Date(`${b.date.split("/").reverse().join("-")}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });

      const upcomingAppointmentsBeyondWeek = filteredBySearch
        .filter((appointment) => {
          const apptDate = new Date(appointment.date.split("/").reverse().join("-"));
          return apptDate > endOfWeek;
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.date.split("/").reverse().join("-")}T${a.time}`);
          const dateB = new Date(`${b.date.split("/").reverse().join("-")}T${b.time}`);
          return dateA.getTime() - dateB.getTime();
        });

      return { today: currentWeekAppointments, upcoming: upcomingAppointmentsBeyondWeek };
    }
  }, [allAppointments, currentDate, searchTerm, viewMode]);

  const handleAddAppointment = (newAppointmentData) => {
    const { bg, text } = getStatusColors(newAppointmentData.status);
    const newAppointment = {
      id: Date.now(),
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newAppointmentData.patientName)}&size=150&background=random`,
      ...newAppointmentData,
    };
    setAllAppointments((prev) => [...prev, newAppointment]);
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
    const { bg, text } = getStatusColors(updatedAppointment.status);
    const updated = { ...updatedAppointment };
    setAllAppointments((prev) => prev.map((app) => (app.id === updated.id ? updated : app)));
    setShowEditModal(false);
    setSelectedAppointment(updated);
    setShowViewModal(true);
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) {
      setAllAppointments((prev) => prev.filter((app) => app.id !== id));
      setShowViewModal(false);
      setShowEditModal(false);
    }
  };

  // Pagination logic
  const paginatedTodayAppointments = filteredAppointments.today.slice(
    (todayPage - 1) * itemsPerPage,
    todayPage * itemsPerPage
  );
  const todayTotalPages = Math.ceil(filteredAppointments.today.length / itemsPerPage);

  const paginatedUpcomingAppointments = filteredAppointments.upcoming.slice(
    (upcomingPage - 1) * itemsPerPage,
    upcomingPage * itemsPerPage
  );
  const upcomingTotalPages = Math.ceil(filteredAppointments.upcoming.length / itemsPerPage);

  const renderPagination = (currentPage, totalPages, setPage) => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Lịch hẹn khám bệnh</h3>
      <Row className="mb-4">
        <Col className="d-flex justify-content-end">
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Tạo lịch hẹn mới
          </Button>
        </Col>
      </Row>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
              <Button variant="outline-secondary" size="sm" onClick={handlePrevDay}>
                <ChevronLeft size={20} />
              </Button>
              <span className="fw-semibold fs-5">{formattedDate}</span>
              <Button variant="outline-secondary" size="sm" onClick={handleNextDay}>
                <ChevronRight size={20} />
              </Button>
            </div>
            <div className="btn-group">
              <Button
                variant={viewMode === "day" ? "primary" : "outline-secondary"}
                onClick={handleToday}
              >
                Hôm nay
              </Button>
              <Button
                variant={viewMode === "week" ? "primary" : "outline-secondary"}
                onClick={handleThisWeek}
              >
                Tuần này
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5>{viewMode === "day" ? "Lịch hẹn hôm nay" : "Lịch hẹn tuần này"}</h5>
              <div className="text-primary small">{filteredAppointments.today.length} cuộc hẹn</div>
            </div>
            <InputGroup style={{ maxWidth: "300px" }}>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
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
                {paginatedTodayAppointments.length > 0 ? (
                  paginatedTodayAppointments.map((appointment) => (
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
                          <Clock size={12} />
                          {appointment.time}
                          {viewMode === "week" && (
                            <span className="ms-2"><CalendarDays size={12} /> {appointment.date}</span>
                          )}
                        </div>
                      </td>
                      <td>{appointment.type}</td>
                      <td>
                        <span className={`badge bg-${getStatusColors(appointment.status).bg} text-${getStatusColors(appointment.status).text}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="p-0 me-2"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 me-2"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 text-danger"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      {viewMode === "day" ? "Không có lịch hẹn nào hôm nay." : "Không có lịch hẹn nào trong tuần này."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {todayTotalPages > 1 && renderPagination(todayPage, todayTotalPages, setTodayPage)}
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Lịch hẹn sắp tới</h5>
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
                {paginatedUpcomingAppointments.length > 0 ? (
                  paginatedUpcomingAppointments.map((appointment) => (
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
                          <Clock size={12} />
                          {appointment.time}
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
                        <Button
                          variant="link"
                          className="p-0 me-2"
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 me-2"
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="link"
                          className="p-0 text-danger"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      Không có lịch hẹn sắp tới.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {upcomingTotalPages > 1 && renderPagination(upcomingPage, upcomingTotalPages, setUpcomingPage)}
        </Card.Body>
      </Card>
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
    </div>
  );
}