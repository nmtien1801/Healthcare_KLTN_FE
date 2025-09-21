import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Eye, Edit, MessageSquare, Phone, ChevronDown, X, Bot, Send } from "lucide-react";
import ViewPatientModal from "../../components/doctor/patient/ViewPatientModal";
import EditPatientModal from "../../components/doctor/patient/EditPatientModal";
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector, useDispatch } from "react-redux";
import { db, dbCall } from "../../../firebase";
import VideoCallModal from '../../components/call/videoModalCall';
import {
  ref,
  onValue,
  off,
} from "firebase/database";
import {
  acceptCall,
  endCall,
  createCall,
  generateJitsiUrl
} from '../../components/call/functionCall';
import ApiPatient from "../../apis/ApiPatient";
import ApiDoctor from "../../apis/ApiDoctor";

// Hàm ánh xạ dữ liệu từ API sang định dạng phù hợp với component
const mapPatientData = (apiPatient, pastAppointments = []) => {
  const statusColors = {
    "Cần theo dõi": { color: "bg-danger", textColor: "text-white" },
    "Đang điều trị": { color: "bg-warning", textColor: "text-dark" },
    "Ổn định": { color: "bg-success", textColor: "text-white" },
  };

  // Xử lý healthRecords an toàn
  const hasHealthRecords = apiPatient.healthRecords && Array.isArray(apiPatient.healthRecords) && apiPatient.healthRecords.length > 0;
  const healthRecords = hasHealthRecords
    ? apiPatient.healthRecords.map(record => ({
      id: record._id || `temp-${Date.now()}`,
      date: record.date
        ? new Date(record.date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        : "-",
      bloodPressure: record.bloodPressure || "-",
      heartRate: record.heartRate || "-",
      bloodSugar: record.bloodSugar || "-",
      recordedAt: record.recordedAt
        ? new Date(record.recordedAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        : "-",
    }))
    : [];

  // Xử lý thông tin userId
  const userId = apiPatient.userId || {};

  // Lấy lịch hẹn gần nhất từ pastAppointments
  const lastAppointment = pastAppointments.length > 0 ? pastAppointments[0] : null;
  const lastVisitDate = lastAppointment && lastAppointment.date ? new Date(lastAppointment.date) : null;

  return {
    id: apiPatient._id || `temp-${Date.now()}`,
    name: userId.username || apiPatient.name || "Không xác định",
    age: apiPatient.age || 0,
    patientCount: `${apiPatient.age || 0} tuổi`,
    avatar: userId.avatar || apiPatient.avatar || "https://via.placeholder.com/150?text=User",
    disease: apiPatient.disease || "Không xác định",
    patientId: apiPatient.insuranceId || "-",
    status: apiPatient.status || "Ổn định",
    statusColor: statusColors[apiPatient.status]?.color || "bg-secondary",
    statusTextColor: statusColors[apiPatient.status]?.textColor || "text-white",
    lastVisit: lastVisitDate
      ? lastVisitDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "Chưa có",
    lastVisitDate: lastVisitDate || new Date(),
    phone: userId.phone || apiPatient.phone || "",
    email: userId.email || apiPatient.email || "",
    address: userId.address || apiPatient.address || "",
    bloodType: apiPatient.bloodType || "-",
    allergies: apiPatient.allergies || "Không có",
    emergencyContact: apiPatient.emergencyContact || "Không có",
    notes: apiPatient.notes || "",
    gender: userId.gender || "-",
    dob: userId.dob
      ? new Date(userId.dob).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "-",
    role: userId.role || "-",
    healthRecords,
  };
};

// Custom Components (giữ nguyên)
const Button = ({ children, className = "", variant = "primary", size = "md", onClick, disabled, ...props }) => {
  const baseClasses = "btn d-inline-flex align-items-center justify-content-center fw-medium transition-all border-0 shadow-sm";

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
  };

  const sizes = {
    sm: "btn-sm px-2 py-1",
    md: "btn-md px-3 py-2",
    lg: "btn-lg px-4 py-3",
  };

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
  );
};

const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`form-control border-0 shadow-sm ${className}`}
      style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
      {...props}
    />
  );
};

const Select = ({ children, value, onChange, className = "" }) => {
  return (
    <div className={`position-relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select border-0 shadow-sm"
        style={{ borderRadius: "8px", backgroundColor: "#f8f9fa", paddingRight: "2.5rem", paddingLeft: "2.5rem" }}
      >
        {children}
      </select>
      <ChevronDown
        className="position-absolute top-50 translate-middle-y text-muted"
        size={16}
        style={{ right: "12px", pointerEvents: "none" }}
      />
    </div>
  );
};

const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`badge ${className}`}
      style={{ borderRadius: "6px", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
    >
      {children}
    </span>
  );
};

const Avatar = ({ src, alt, fallback, className = "", size = 50 }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`position-relative d-inline-flex align-items-center justify-content-center rounded-circle bg-light overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {!imageError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-100 h-100 rounded-circle object-fit-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span
          className="fw-medium text-muted text-uppercase"
          style={{ fontSize: size / 2.5 }}
        >
          {fallback}
        </span>
      )}
    </div>
  );
};

export default function PatientTab({ handleStartCall }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [patientList, setPatientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const patientsPerPage = 5;

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Lấy dữ liệu bệnh nhân và lịch hẹn gần nhất từ API
  useEffect(() => {
    const fetchPatientsAndAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy danh sách bệnh nhân
        const response = await ApiPatient.getAllPatients();
        console.log("Dữ liệu API thô (bệnh nhân):", response); // Debug
        let patients;
        if (Array.isArray(response)) {
          patients = response;
        } else {
          patients = response.data || [];
        }
        console.log("patients extracted:", patients); // Debug

        if (!Array.isArray(patients)) {
          console.warn("Dữ liệu API không đúng định dạng:", response);
          setError("Dữ liệu không hợp lệ từ server. Vui lòng kiểm tra định dạng dữ liệu API.");
          setLoading(false);
          return;
        }

        // Lấy lịch hẹn gần nhất cho từng bệnh nhân
        const patientsWithAppointments = await Promise.all(
          patients.map(async (patient) => {
            try {
              const appointmentsResponse = await ApiDoctor.getPatientPastAppointments(patient._id);
              const appointments = Array.isArray(appointmentsResponse)
                ? appointmentsResponse
                : appointmentsResponse.data || [];
              console.log(`Lịch hẹn của bệnh nhân ${patient._id}:`, appointments); // Debug
              return mapPatientData(patient, appointments);
            } catch (err) {
              console.error(`Lỗi khi lấy lịch hẹn cho bệnh nhân ${patient._id}:`, err.message);
              return mapPatientData(patient, []); // Nếu lỗi, trả về bệnh nhân với lịch hẹn rỗng
            }
          })
        );

        setPatientList(patientsWithAppointments);
      } catch (err) {
        console.error("Lỗi khi gọi API bệnh nhân:", err.message, err.response?.data);
        setError(err.response?.data?.message || "Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsAndAppointments();
  }, []);

  // Lọc và sắp xếp bệnh nhân
  const filteredAndSortedPatients = useMemo(() => {
    if (loading || error) return [];
    const filtered = patientList.filter((patient) => {
      const matchesSearch =
        (patient.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (patient.disease?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (patient.patientId?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "age":
          return (a.age || 0) - (b.age || 0);
        case "lastVisit":
          return (b.lastVisitDate || new Date()) - (a.lastVisitDate || new Date());
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [patientList, searchTerm, statusFilter, sortBy, loading, error]);

  // Phân trang
  const totalPages = Math.ceil(filteredAndSortedPatients.length / patientsPerPage);
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  // Cập nhật bệnh nhân
  const handleUpdatePatient = (updatedPatient) => {
    const statusColors = {
      "Cần theo dõi": { color: "bg-danger", textColor: "text-white" },
      "Đang điều trị": { color: "bg-warning", textColor: "text-dark" },
      "Ổn định": { color: "bg-success", textColor: "text-white" },
    };

    const updated = {
      ...updatedPatient,
      patientCount: `${updatedPatient.age || 0} tuổi`,
      statusColor: statusColors[updatedPatient.status]?.color || "bg-secondary",
      statusTextColor: statusColors[updatedPatient.status]?.textColor || "text-white",
    };

    setPatientList(patientList.map((p) => (p.id === updated.id ? updated : p)));
    setShowEditModal(false);
  };

  // Xem chi tiết bệnh nhân
  const handleViewPatient = (patient) => {
    console.log("Selected Patient:", patient); // Debug
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // Chỉnh sửa bệnh nhân
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(false);
    setShowEditModal(true);
  };

  // Điều hướng trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Nhắn tin cho bệnh nhân
  const [showChatbot, setShowChatbot] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const senderId = user?.uid;
  const receiverId = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";

  const roomChats = [senderId, receiverId].sort().join('_');

  useEffect(() => {
    if (!senderId) return;

    const q = query(
      collection(db, 'chats', roomChats, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.message || data.text || '',
          sender: data.senderId === senderId ? "doctor" : "patient",
          timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
          originalData: data
        };
      });
      setChatMessages(messages);
    }, (error) => {
      console.error('Firebase listener error:', error);
    });

    return () => unsub();
  }, [senderId, roomChats]);

  useEffect(() => {
    if (showChatbot && chatMessages.length > 0) {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [chatMessages, showChatbot]);

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    setIsSending(true);
    const userMessage = messageInput.trim();
    setMessageInput("");

    const tempMessage = {
      id: Date.now().toString(),
      text: userMessage,
      sender: "doctor",
      timestamp: new Date(),
      isTemp: true
    };

    setChatMessages((prev) => [...prev, tempMessage]);

    try {
      const docRef = await addDoc(collection(db, "chats", roomChats, "messages"), {
        senderId,
        receiverId,
        message: userMessage,
        timestamp: serverTimestamp()
      });

      setChatMessages((prev) => prev.map(msg =>
        msg.isTemp && msg.text === userMessage
          ? { ...msg, id: docRef.id, isTemp: false }
          : msg
      ));
    } catch (err) {
      console.error('Error sending message:', err);
      setChatMessages((prev) => prev.filter(msg => !msg.isTemp || msg.text !== userMessage));
    } finally {
      setIsSending(false);
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div className="container mt-4">
        <h3 className="mb-4">Quản lý bệnh nhân</h3>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải danh sách bệnh nhân...</span>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="container mt-4">
        <h3 className="mb-4">Quản lý bệnh nhân</h3>
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => {
              setLoading(true);
              setError(null);
              // Gọi lại hàm fetch
              fetchPatientsAndAppointments();
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Quản lý bệnh nhân</h3>

      {/* Thống kê */}
      <div className="row mb-4">
        {[
          { icon: "exclamation-circle", title: "Cần theo dõi", value: patientList.filter((p) => p.status === "Cần theo dõi").length, color: "danger" },
          { icon: "hospital-user", title: "Đang điều trị", value: patientList.filter((p) => p.status === "Đang điều trị").length, color: "warning" },
          { icon: "check-circle", title: "Ổn định", value: patientList.filter((p) => p.status === "Ổn định").length, color: "success" },
        ].map((item, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm">
              <div className="card-body d-flex align-items-center">
                <div className={`bg-${item.color} bg-opacity-10 rounded-circle p-3 me-3`}>
                  <i className={`fas fa-${item.icon} text-${item.color} fs-5`}></i>
                </div>
                <div>
                  <div className="text-muted small">{item.title}</div>
                  <div className="fs-4 fw-semibold">{item.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "none" }}>
        <div className="card-body p-4">
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
                <Select value={statusFilter} onChange={setStatusFilter}>
                  <option value="all">Tất cả tình trạng</option>
                  <option value="Cần theo dõi">Cần theo dõi</option>
                  <option value="Đang điều trị">Đang điều trị</option>
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
      <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "none" }}>
        <div className="table-responsive">
          <table className="table hover responsive">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th className="fw-bold text-muted small py-3 border-0">Bệnh nhân</th>
                <th className="fw-bold text-muted small py-3 border-0">Thông tin</th>
                <th className="fw-bold text-muted small py-3 border-0">Tình trạng</th>
                <th className="fw-bold text-muted small py-3 border-0">Lần khám gần nhất</th>
                <th className="fw-bold text-muted small py-3 border-0">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient) => (
                  <tr key={patient.id} style={{ borderTop: "1px solid #f1f3f4" }}>
                    <td className="py-3 border-0">
                      <div className="d-flex align-items-center gap-3">
                        <Avatar
                          src={patient.avatar}
                          alt={patient.name}
                          fallback={patient.name?.split(" ").map((n) => n[0]).join("") || "-"}
                          style={{ width: "40px", height: "40px" }}
                        />
                        <div>
                          <div className="fw-semibold text-dark">{patient.name}</div>
                          <div className="small text-muted">{patient.patientCount}</div>
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
                      <Badge className={`${patient.statusColor} ${patient.statusTextColor}`}>
                        {patient.status}
                      </Badge>
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
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          className="p-2"
                          onClick={() => handleEditPatient(patient)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="p-2"
                          onClick={() => setShowChatbot(true)}
                          title="Nhắn tin"
                        >
                          <MessageSquare size={16} />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          className="p-2"
                          onClick={() => handleStartCall(user, { uid: receiverId }, "doctor")}
                          title="Gọi điện"
                        >
                          <Phone size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    Không có bệnh nhân nào phù hợp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chatbot Popup */}
      {showChatbot && (
        <div className="position-fixed bottom-0 end-0 m-3 shadow-lg rounded-4 bg-white" style={{ width: 320, height: 450, zIndex: 9999 }}>
          <div className="bg-primary text-white d-flex justify-content-between align-items-center p-2 rounded-top-4">
            <div><Bot size={18} className="me-1" /> Chat với bệnh nhân</div>
            <button onClick={() => setShowChatbot(false)} className="btn btn-sm btn-light text-dark rounded-circle">
              <X size={16} />
            </button>
          </div>

          <div className="p-2 chat-messages" style={{ height: 340, overflowY: "auto" }}>
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted mt-4">
                <Bot size={24} className="mb-2" />
                <div>Chưa có tin nhắn nào</div>
                <small>Bắt đầu cuộc trò chuyện với bệnh nhân</small>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className={`mb-2 ${msg.sender === "doctor" ? "text-end" : "text-start"}`}>
                  <div className={`d-inline-block px-3 py-2 rounded-3 ${msg.sender === "doctor" ? "bg-primary text-white" : "bg-light text-dark"}`}>
                    {msg.text}
                  </div>
                  <div className={`small text-muted mt-1 ${msg.sender === "doctor" ? "text-end" : "text-start"}`}>
                    {msg.timestamp instanceof Date
                      ? msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                      : new Date(msg.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                    }
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-top d-flex p-3 align-items-center">
            <input
              type="text"
              className="form-control form-control-sm rounded-pill me-2"
              placeholder="Nhập tin nhắn..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSending && sendMessage()}
              disabled={isSending}
            />
            <button
              onClick={sendMessage}
              className="btn btn-sm btn-primary rounded-pill"
              disabled={isSending || !messageInput.trim()}
            >
              {isSending ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Đang gửi...</span>
                </div>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredAndSortedPatients.length > 0 && totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          {[...Array(totalPages).keys()].map((page) => (
            <Button
              key={page + 1}
              variant={currentPage === page + 1 ? "primary" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedPatients.length === 0 && !loading && !error && (
        <div className="card shadow-sm mb-4" style={{ borderRadius: "12px", border: "none" }}>
          <div className="card-body text-center py-5">
            <div className="text-muted mb-2">Không tìm thấy bệnh nhân nào</div>
            <div className="small text-muted">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</div>
          </div>
        </div>
      )}

      {/* Modals */}
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
  );
}