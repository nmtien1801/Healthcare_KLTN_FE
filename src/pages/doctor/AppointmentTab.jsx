"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, Search, Clock, CalendarDays, Plus, Trash2, Edit, Eye } from "lucide-react"
import AddAppointmentModal from "../../components/doctor/AddAppointmentModal"
import ViewAppointmentModal from "../../components/doctor/ViewAppointmentModal"
import EditAppointmentModal from "../../components/doctor/EditAppointmentModal"

// Custom Button Component
const Button = ({ children, className = "", variant = "primary", size = "md", onClick, disabled, ...props }) => {
  const baseClasses =
    "btn d-inline-flex align-items-center justify-content-center fw-medium transition-all border-0 shadow-sm"

  const variants = {
    primary: "btn-primary text-white",
    secondary: "btn-light text-dark border",
    success: "btn-success text-white",
    danger: "btn-danger text-white",
    warning: "btn-warning text-dark",
    info: "btn-info text-white",
    light: "btn-light text-dark",
    dark: "btn-dark text-white",
    outline: "btn-outline-primary",
    ghost: "btn-light text-muted border-0 shadow-none",
  }

  const sizes = {
    sm: "btn-sm px-2 py-1",
    md: "btn-md px-3 py-2",
    lg: "btn-lg px-4 py-3",
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ borderRadius: "8px" }}
      {...props}
    >
      {children}
    </button>
  )
}

// Custom Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`form-control border-0 shadow-sm ${className}`}
      style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
      {...props}
    />
  )
}

// Custom Badge Component
const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`badge ${className}`}
      style={{ borderRadius: "6px", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
    >
      {children}
    </span>
  )
}

// Custom Avatar Component
const Avatar = ({ src, alt, fallback, className = "" }) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={`position-relative d-inline-flex align-items-center justify-content-center rounded-circle bg-light ${className}`}
    >
      {!imageError && src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="w-100 h-100 rounded-circle object-fit-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="fw-medium text-muted" style={{ fontSize: "0.875rem" }}>
          {fallback}
        </span>
      )}
    </div>
  )
}

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
]

export default function AppointmentTab() {
  const [currentDate, setCurrentDate] = useState(new Date("2025-06-23")) // Example date
  const [searchTerm, setSearchTerm] = useState("")
  const [allAppointments, setAllAppointments] = useState(initialAppointments)
  const [viewMode, setViewMode] = useState("day") // 'day' or 'week'

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const getStatusColors = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return { color: "bg-success", textColor: "text-white" }
      case "Chờ xác nhận":
        return { color: "bg-warning", textColor: "text-dark" }
      case "Đã hủy":
        return { color: "bg-danger", textColor: "text-white" }
      case "Hoàn thành":
        return { color: "bg-primary", textColor: "text-white" }
      default:
        return { color: "bg-secondary", textColor: "text-white" }
    }
  }

  const formattedDate = useMemo(() => {
    if (viewMode === "day") {
      const options = { weekday: "long", day: "numeric", month: "numeric", year: "numeric" }
      return currentDate.toLocaleDateString("vi-VN", options)
    } else {
      // Calculate start and end of the week
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)) // Monday
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday

      const startOptions = { day: "numeric", month: "numeric" }
      const endOptions = { day: "numeric", month: "numeric", year: "numeric" }

      return `Tuần từ ${startOfWeek.toLocaleDateString("vi-VN", startOptions)} đến ${endOfWeek.toLocaleDateString("vi-VN", endOptions)}`
    }
  }, [currentDate, viewMode])

  const handlePrevDay = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date("2025-06-23")) // Reset to the example "today"
    setViewMode("day")
  }

  const handleThisWeek = () => {
    const today = new Date("2025-06-23") // Use the example "today" for consistency
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)) // Monday
    setCurrentDate(startOfWeek)
    setViewMode("week")
  }

  const filteredAppointments = useMemo(() => {
    const filteredBySearch = allAppointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patientDisease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (viewMode === "day") {
      const currentDayString = currentDate.toLocaleDateString("vi-VN")
      const today = filteredBySearch.filter((appointment) => appointment.date === currentDayString)
      const upcoming = filteredBySearch.filter((appointment) => {
        const apptDate = new Date(appointment.date.split("/").reverse().join("-"))
        return apptDate > currentDate && appointment.date !== currentDayString
      })
      return { today, upcoming }
    } else {
      // Week view logic
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)) // Monday
      startOfWeek.setHours(0, 0, 0, 0)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday
      endOfWeek.setHours(23, 59, 59, 999)

      const currentWeekAppointments = filteredBySearch
        .filter((appointment) => {
          const apptDate = new Date(appointment.date.split("/").reverse().join("-"))
          return apptDate >= startOfWeek && apptDate <= endOfWeek
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.date.split("/").reverse().join("-")}T${a.time}`)
          const dateB = new Date(`${b.date.split("/").reverse().join("-")}T${b.time}`)
          return dateA.getTime() - dateB.getTime()
        })

      const upcomingAppointmentsBeyondWeek = filteredBySearch
        .filter((appointment) => {
          const apptDate = new Date(appointment.date.split("/").reverse().join("-"))
          return apptDate > endOfWeek
        })
        .sort((a, b) => {
          const dateA = new Date(`${a.date.split("/").reverse().join("-")}T${a.time}`)
          const dateB = new Date(`${b.date.split("/").reverse().join("-")}T${b.time}`)
          return dateA.getTime() - dateB.getTime()
        })

      return { today: currentWeekAppointments, upcoming: upcomingAppointmentsBeyondWeek }
    }
  }, [allAppointments, currentDate, searchTerm, viewMode])

  const handleAddAppointment = (newAppointmentData) => {
    const { color, textColor } = getStatusColors(newAppointmentData.status)
    const newAppointment = {
      id: Date.now(),
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newAppointmentData.patientName,
      )}&size=150&background=random`,
      statusColor: color,
      statusTextColor: textColor,
      ...newAppointmentData,
    }
    setAllAppointments((prev) => [...prev, newAppointment])
    setShowAddModal(false)
  }

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowViewModal(true)
  }

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setShowViewModal(false) // Close view modal if open
    setShowEditModal(true)
  }

  const handleUpdateAppointment = (updatedAppointment) => {
    const { color, textColor } = getStatusColors(updatedAppointment.status)
    const updated = {
      ...updatedAppointment,
      statusColor: color,
      statusTextColor: textColor,
    }
    setAllAppointments((prev) => prev.map((app) => (app.id === updated.id ? updated : app)))
    setShowEditModal(false)
    setSelectedAppointment(updated) // Update selected patient in case view modal is reopened
    setShowViewModal(true) // Reopen view modal after edit
  }

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) {
      setAllAppointments((prev) => prev.filter((app) => app.id !== id))
      setShowViewModal(false) // Close view modal if open
      setShowEditModal(false) // Close edit modal if open
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="h2 fw-bold text-dark mb-2">Lịch hẹn khám bệnh</h1>
            <p className="text-muted mb-0">Quản lý lịch hẹn và tương tác với bệnh nhân</p>
          </div>
          <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Tạo lịch hẹn mới
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "none" }}>
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
              <Button variant="ghost" size="sm" onClick={handlePrevDay}>
                <ChevronLeft size={20} />
              </Button>
              <span className="fw-semibold text-dark fs-5">{formattedDate}</span>
              <Button variant="ghost" size="sm" onClick={handleNextDay}>
                <ChevronRight size={20} />
              </Button>
            </div>
            <div className="btn-group" role="group">
              <Button
                variant={viewMode === "day" ? "primary" : "secondary"}
                onClick={handleToday}
                className="rounded-start-pill"
              >
                Hôm nay
              </Button>
              <Button
                variant={viewMode === "week" ? "primary" : "secondary"}
                onClick={handleThisWeek}
                className="rounded-end-pill"
              >
                Tuần này
              </Button>
            </div>
          </div>
        </div>

        {/* Today's / This Week's Appointments */}
        <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "none" }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold text-dark mb-1">
                  {viewMode === "day" ? "Lịch hẹn hôm nay" : "Lịch hẹn tuần này"}
                </h5>
                <p className="text-primary small mb-0">{filteredAppointments.today.length} cuộc hẹn</p>
              </div>
              <div className="position-relative flex-grow-1 ms-md-4" style={{ maxWidth: "300px" }}>
                <Search
                  className="position-absolute top-50 translate-middle-y text-muted"
                  size={16}
                  style={{ left: "12px", zIndex: 10 }}
                />
                <Input
                  placeholder="Tìm kiếm bệnh nhân..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>
            </div>

            <div className="list-group list-group-flush">
              {filteredAppointments.today.length > 0 ? (
                filteredAppointments.today.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="list-group-item d-flex align-items-center justify-content-between py-3 px-0"
                    style={{ borderBottom: "1px solid #f1f3f4" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Avatar
                        src={appointment.patientAvatar}
                        alt={appointment.patientName}
                        fallback={appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                        className="flex-shrink-0"
                        style={{ width: "48px", height: "48px" }}
                      />
                      <div>
                        <div className="fw-semibold text-dark d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle"
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor:
                                appointment.status === "Đã xác nhận"
                                  ? "#28a745"
                                  : appointment.status === "Chờ xác nhận"
                                    ? "#ffc107"
                                    : "#dc3545", // Fallback for other statuses
                            }}
                          ></span>
                          {appointment.patientName}
                        </div>
                        <div className="small text-muted mb-1">
                          {appointment.patientAge} tuổi • {appointment.patientDisease}
                        </div>
                        <div className="d-flex align-items-center gap-3 small text-muted">
                          <div className="d-flex align-items-center gap-1">
                            <Clock size={12} />
                            {appointment.time}
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <CalendarDays size={12} />
                            {viewMode === "day" ? appointment.type : `${appointment.date} • ${appointment.type}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge
                        className={
                          getStatusColors(appointment.status).color +
                          " " +
                          getStatusColors(appointment.status).textColor
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">
                  {viewMode === "day" ? "Không có lịch hẹn nào hôm nay." : "Không có lịch hẹn nào trong tuần này."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="card shadow-sm" style={{ borderRadius: "12px", border: "none" }}>
          <div className="card-body">
            <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <CalendarDays size={20} />
              Lịch hẹn sắp tới
            </h5>
            <div className="list-group list-group-flush">
              {filteredAppointments.upcoming.length > 0 ? (
                filteredAppointments.upcoming.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="list-group-item d-flex align-items-center justify-content-between py-3 px-0"
                    style={{ borderBottom: "1px solid #f1f3f4" }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <Avatar
                        src={appointment.patientAvatar}
                        alt={appointment.patientName}
                        fallback={appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                        className="flex-shrink-0"
                        style={{ width: "48px", height: "48px" }}
                      />
                      <div>
                        <div className="fw-semibold text-dark d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle"
                            style={{
                              width: "8px",
                              height: "8px",
                              backgroundColor:
                                appointment.status === "Đã xác nhận"
                                  ? "#28a745"
                                  : appointment.status === "Chờ xác nhận"
                                    ? "#ffc107"
                                    : "#dc3545",
                            }}
                          ></span>
                          {appointment.patientName}
                        </div>
                        <div className="small text-muted mb-1">
                          {appointment.patientAge} tuổi • {appointment.patientDisease}
                        </div>
                        <div className="d-flex align-items-center gap-3 small text-muted">
                          <div className="d-flex align-items-center gap-1">
                            <Clock size={12} />
                            {appointment.time}
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <CalendarDays size={12} />
                            {appointment.date}
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <CalendarDays size={12} />
                            {appointment.type}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Badge
                        className={
                          getStatusColors(appointment.status).color +
                          " " +
                          getStatusColors(appointment.status).textColor
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted">Không có lịch hẹn sắp tới.</div>
              )}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  )
}
