"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Plus, Eye, Edit, Trash2, Users, ChevronDown } from "lucide-react"
import AddPatientModal from "../../components/doctor/AddPatientModal"
import ViewPatientModal from "../../components/doctor/ViewPatientModal"
import EditPatientModal from "../../components/doctor/EditPatientModal"

const initialPatients = [
  {
    id: 1,
    name: "Trần Văn Bình",
    age: 68,
    patientCount: "68 tuổi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    disease: "Tăng huyết áp, Tiểu đường type 2",
    patientId: "BHYT: BH123456789",
    status: "Cần theo dõi",
    statusColor: "bg-danger",
    statusTextColor: "text-white",
    lastVisit: "15/06/2025",
    lastVisitDate: new Date("2025-06-15"),
    phone: "0901234567",
    email: "tranvanbinhh@email.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    bloodType: "A",
    allergies: "Penicillin",
    emergencyContact: "Trần Thị Mai - 0987654321 (Vợ)",
    notes: "Bệnh nhân cần theo dõi đường huyết thường xuyên",
  },
  {
    id: 2,
    name: "Nguyễn Thị Mai",
    age: 52,
    patientCount: "52 tuổi",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    disease: "Tiểu đường type 2",
    patientId: "BHYT: BH987654321",
    status: "Đang điều trị",
    statusColor: "bg-warning",
    statusTextColor: "text-dark",
    lastVisit: "20/06/2025",
    lastVisitDate: new Date("2025-06-20"),
    phone: "0912345678",
    email: "nguyenthimai@email.com",
    address: "456 Đường DEF, Quận 3, TP.HCM",
    bloodType: "B",
    allergies: "",
    emergencyContact: "Nguyễn Văn Nam - 0976543210 (Con trai)",
    notes: "Đang điều trị insulin, cần kiểm tra định kỳ",
  },
  {
    id: 3,
    name: "Lê Minh Tuấn",
    age: 35,
    patientCount: "35 tuổi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    disease: "Viêm phổi",
    patientId: "BHYT: BH456789123",
    status: "Theo dõi",
    statusColor: "bg-info",
    statusTextColor: "text-dark",
    lastVisit: "21/06/2025",
    lastVisitDate: new Date("2025-06-21"),
    phone: "0923456789",
    email: "leminhtuan@email.com",
    address: "789 Đường GHI, Quận 5, TP.HCM",
    bloodType: "O",
    allergies: "Không có",
    emergencyContact: "Lê Thị Lan - 0965432109 (Vợ)",
    notes: "Đã hồi phục tốt, cần theo dõi thêm 1 tuần",
  },
  {
    id: 4,
    name: "Phạm Thị Hương",
    age: 72,
    patientCount: "72 tuổi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    disease: "Suy tim, Tăng huyết áp",
    patientId: "BHYT: BH789123456",
    status: "Ổn định",
    statusColor: "bg-success",
    statusTextColor: "text-white",
    lastVisit: "18/06/2025",
    lastVisitDate: new Date("2025-06-18"),
    phone: "0934567890",
    email: "",
    address: "321 Đường JKL, Quận 7, TP.HCM",
    bloodType: "AB",
    allergies: "Aspirin",
    emergencyContact: "Phạm Văn Minh - 0954321098 (Con trai)",
    notes: "Tình trạng ổn định, tiếp tục dùng thuốc theo đơn",
  },
]

// Custom Components
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

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`form-control border-0 shadow-sm ${className}`}
      style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
      {...props}
    />
  )
}

const Select = ({ children, value, onChange, className = "" }) => {
  return (
    <div className={`position-relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select border-0 shadow-sm"
        style={{ borderRadius: "8px", backgroundColor: "#f8f9fa", paddingRight: "2.5rem" }}
      >
        {children}
      </select>
      <ChevronDown
        className="position-absolute top-50 translate-middle-y text-muted"
        size={16}
        style={{ right: "12px", pointerEvents: "none" }}
      />
    </div>
  )
}

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

export default function PatientTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [patientList, setPatientList] = useState(initialPatients)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)

  // Lọc và sắp xếp bệnh nhân
  const filteredAndSortedPatients = useMemo(() => {
    const filtered = patientList.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || patient.status === statusFilter

      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "age":
          return a.age - b.age
        case "lastVisit":
          return b.lastVisitDate - a.lastVisitDate
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }, [patientList, searchTerm, statusFilter, sortBy])

  // Thêm bệnh nhân mới
  const handleAddPatient = (newPatient) => {
    const statusColors = {
      "Cần theo dõi": { color: "bg-danger", textColor: "text-white" },
      "Đang điều trị": { color: "bg-warning", textColor: "text-dark" },
      "Theo dõi": { color: "bg-info", textColor: "text-dark" },
      "Ổn định": { color: "bg-success", textColor: "text-white" },
    }

    const patient = {
      id: Date.now(),
      name: newPatient.name,
      age: Number.parseInt(newPatient.age),
      patientCount: `${newPatient.age} tuổi`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newPatient.name)}&size=150&background=random`,
      disease: newPatient.disease,
      patientId: newPatient.patientId,
      status: newPatient.status,
      statusColor: statusColors[newPatient.status].color,
      statusTextColor: statusColors[newPatient.status].textColor,
      lastVisit: new Date().toLocaleDateString("vi-VN"),
      lastVisitDate: new Date(),
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      bloodType: newPatient.bloodType,
      allergies: newPatient.allergies,
      emergencyContact: newPatient.emergencyContact,
      notes: newPatient.notes,
    }

    setPatientList([...patientList, patient])
  }

  // Cập nhật bệnh nhân
  const handleUpdatePatient = (updatedPatient) => {
    const statusColors = {
      "Cần theo dõi": { color: "bg-danger", textColor: "text-white" },
      "Đang điều trị": { color: "bg-warning", textColor: "text-dark" },
      "Theo dõi": { color: "bg-info", textColor: "text-dark" },
      "Ổn định": { color: "bg-success", textColor: "text-white" },
    }

    const updated = {
      ...updatedPatient,
      patientCount: `${updatedPatient.age} tuổi`,
      statusColor: statusColors[updatedPatient.status].color,
      statusTextColor: statusColors[updatedPatient.status].textColor,
    }

    setPatientList(patientList.map((p) => (p.id === updated.id ? updated : p)))
    setShowViewModal(false)
  }

  // Xóa bệnh nhân
  const handleDeletePatient = (patientId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bệnh nhân này?")) {
      setPatientList(patientList.filter((p) => p.id !== patientId))
    }
  }

  // Xem chi tiết bệnh nhân
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  // Chỉnh sửa bệnh nhân
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient)
    setShowViewModal(false)
    setShowEditModal(true)
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="h2 fw-bold text-dark mb-2">Quản lý bệnh nhân</h1>
          <p className="text-muted mb-0">Theo dõi và quản lý thông tin bệnh nhân</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Thêm bệnh nhân
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "none" }}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="position-relative">
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
            <div className="col-12 col-md-3">
              <div className="position-relative">
                <Filter
                  className="position-absolute top-50 translate-middle-y text-muted"
                  size={16}
                  style={{ left: "12px", zIndex: 10 }}
                />
                <Select value={statusFilter} onChange={setStatusFilter} style={{ paddingLeft: "2.5rem" }}>
                  <option value="all">Tất cả tình trạng</option>
                  <option value="Cần theo dõi">Cần theo dõi</option>
                  <option value="Đang điều trị">Đang điều trị</option>
                  <option value="Theo dõi">Theo dõi</option>
                  <option value="Ổn định">Ổn định</option>
                </Select>
              </div>
            </div>
            <div className="col-12 col-md-3">
              <Select value={sortBy} onChange={setSortBy}>
                <option value="name">Sắp xếp theo tên</option>
                <option value="age">Sắp xếp theo tuổi</option>
                <option value="lastVisit">Lần khám gần nhất</option>
                <option value="status">Tình trạng</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="card shadow-sm" style={{ borderRadius: "12px", border: "none" }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th className="fw-semibold text-uppercase text-muted small py-3 border-0">BỆNH NHÂN</th>
                <th className="fw-semibold text-uppercase text-muted small py-3 border-0">THÔNG TIN</th>
                <th className="fw-semibold text-uppercase text-muted small py-3 border-0">TÌNH TRẠNG</th>
                <th className="fw-semibold text-uppercase text-muted small py-3 border-0">LẦN KHÁM GẦN NHẤT</th>
                <th className="fw-semibold text-uppercase text-muted small py-3 border-0">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPatients.map((patient) => (
                <tr key={patient.id} style={{ borderTop: "1px solid #f1f3f4" }}>
                  <td className="py-3 border-0">
                    <div className="d-flex align-items-center gap-3">
                      <Avatar
                        src={patient.avatar}
                        alt={patient.name}
                        fallback={patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div>
                        <div className="fw-semibold text-dark">{patient.name}</div>
                        <div className="small text-muted d-flex align-items-center gap-1">
                          <Users size={12} />
                          {patient.patientCount}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                    <div>
                      <div className="text-dark mb-1">{patient.disease}</div>
                      <div className="small text-muted">{patient.patientId}</div>
                    </div>
                  </td>
                  <td className="py-3 border-0">
                    <Badge className={`${patient.statusColor} ${patient.statusTextColor}`}>{patient.status}</Badge>
                  </td>
                  <td className="py-3 border-0">
                    <div className="text-dark">{patient.lastVisit}</div>
                  </td>
                  <td className="py-3 border-0">
                    <div className="d-flex align-items-center gap-1">
                      <Button
                        variant="info"
                        size="sm"
                        className="p-2"
                        onClick={() => handleViewPatient(patient)}
                        title="Xem chi tiết"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="p-2"
                        onClick={() => handleEditPatient(patient)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="p-2"
                        onClick={() => handleDeletePatient(patient.id)}
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSortedPatients.length === 0 && (
        <div className="card shadow-sm mt-4" style={{ borderRadius: "12px", border: "none" }}>
          <div className="card-body text-center py-5">
            <div className="text-muted mb-2">Không tìm thấy bệnh nhân nào</div>
            <div className="small text-muted">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</div>
          </div>
        </div>
      )}

      {/* Thống kê */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm" style={{ borderRadius: "12px", border: "none" }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3">Thống kê tình trạng bệnh nhân</h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="text-center">
                    <div className="h4 fw-bold text-danger mb-1">
                      {patientList.filter((p) => p.status === "Cần theo dõi").length}
                    </div>
                    <div className="small text-muted">Cần theo dõi</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-center">
                    <div className="h4 fw-bold text-warning mb-1">
                      {patientList.filter((p) => p.status === "Đang điều trị").length}
                    </div>
                    <div className="small text-muted">Đang điều trị</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-center">
                    <div className="h4 fw-bold text-info mb-1">
                      {patientList.filter((p) => p.status === "Theo dõi").length}
                    </div>
                    <div className="small text-muted">Theo dõi</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="text-center">
                    <div className="h4 fw-bold text-success mb-1">
                      {patientList.filter((p) => p.status === "Ổn định").length}
                    </div>
                    <div className="small text-muted">Ổn định</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPatientModal show={showAddModal} onHide={() => setShowAddModal(false)} onSave={handleAddPatient} />

      <ViewPatientModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        patient={selectedPatient}
        onEdit={handleEditPatient}
      />

      <EditPatientModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        patient={selectedPatient}
        onSave={handleUpdatePatient}
      />
    </div>
  )
}
