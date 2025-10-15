import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Eye, Edit, MessageSquare, Phone, ChevronDown, X, Bot, Send } from "lucide-react";
import ViewPatientModal from "../../components/doctor/patient/ViewPatientModal";
import EditPatientModal from "../../components/doctor/patient/EditPatientModal";
import { collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../../firebase";
import ApiPatient from "../../apis/ApiPatient";
import ApiDoctor from "../../apis/ApiDoctor";
import { listenStatus } from "../../utils/SetupSignFireBase";

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

// Custom Components
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm state isLoading
  const patientsPerPage = 5;

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Chat states
  const [showChatbot, setShowChatbot] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const senderId = user?.uid;
  const receiverId = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";
  const roomChats = [senderId, receiverId].sort().join('_');

  // Lấy dữ liệu bệnh nhân và lịch hẹn gần nhất từ API
  const fetchPatientsAndAppointments = async () => {
    setIsLoading(true); // Bật loading
    setError(null);
    try {
      const response = await ApiPatient.getAllPatients();
      let patients = Array.isArray(response) ? response : response.data || [];

      if (!Array.isArray(patients)) {
        console.warn("Dữ liệu API không đúng định dạng:", response);
        setError("Dữ liệu không hợp lệ từ server.");
        return;
      }

      const patientsWithAppointments = await Promise.all(
        patients.map(async (patient) => {
          try {
            const appointmentsResponse = await ApiDoctor.getPatientPastAppointments(patient._id);
            const appointments = Array.isArray(appointmentsResponse)
              ? appointmentsResponse
              : appointmentsResponse.data || [];
            return mapPatientData(patient, appointments);
          } catch (err) {
            console.error(`Lỗi khi lấy lịch hẹn của ${patient._id}:`, err.message);
            return mapPatientData(patient, []);
          }
        })
      );

      setPatientList(patientsWithAppointments);
    } catch (err) {
      console.error("Lỗi khi gọi API bệnh nhân:", err.message, err.response?.data);
      setError("Không thể tải danh sách bệnh nhân.");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  // Lắng nghe tín hiệu realtime từ Firebase
  useEffect(() => {
    if (!roomChats) {
      console.warn("roomChats không hợp lệ:", roomChats);
      setIsLoading(false);
      return;
    }
    fetchPatientsAndAppointments(); // Gọi lần đầu khi component mount
    const unsub = listenStatus(roomChats, (signal) => {
      console.log("Nhận tín hiệu:", signal);
      if (!signal?.status) return;
      if (
        signal.status === "update_patient_info" ||
        signal.status === "update_patient_list"
      ) {
        console.log("Cập nhật danh sách bệnh nhân...");
        fetchPatientsAndAppointments();
      }
    });
    return () => unsub && unsub();
  }, [roomChats]);

  // Lắng nghe tin nhắn realtime từ Firebase
  useEffect(() => {
    if (!senderId || !roomChats) {
      console.warn("senderId hoặc roomChats không hợp lệ:", senderId, roomChats);
      return;
    }
    const q = query(
      collection(db, 'chats', roomChats, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.message || data.text || '',
            sender: data.senderId === senderId ? "doctor" : "patient",
            timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
            originalData: data
          };
        });
        console.log("Tin nhắn mới:", messages);
        setChatMessages(messages);
      },
      (error) => {
        console.error('Lỗi lắng nghe tin nhắn:', error);
      }
    );
    return () => unsub();
  }, [senderId, roomChats]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (showChatbot && chatMessages.length > 0) {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [chatMessages, showChatbot]);

  // Gửi tin nhắn
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
      console.log("Tin nhắn đã gửi:", docRef.id);

      setChatMessages((prev) => prev.map(msg =>
        msg.isTemp && msg.text === userMessage
          ? { ...msg, id: docRef.id, isTemp: false }
          : msg
      ));
    } catch (err) {
      console.error('Lỗi gửi tin nhắn:', err);
      setChatMessages((prev) => prev.filter(msg => !msg.isTemp || msg.text !== userMessage));
    } finally {
      setIsSending(false);
    }
  };

  // Cập nhật bệnh nhân
  const handleUpdatePatient = async (updatedPatient) => {
    setIsLoading(true); // Bật loading khi cập nhật
    try {
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

      // Cập nhật danh sách bệnh nhân
      setPatientList((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );

      // Làm mới danh sách từ API
      await fetchPatientsAndAppointments();
      setShowEditModal(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật bệnh nhân:", error);
      setError("Cập nhật bệnh nhân thất bại.");
    } finally {
      setIsLoading(false); // Tắt loading
    }
  };

  // Xem chi tiết bệnh nhân
  const handleViewPatient = (patient) => {
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

  // Lọc và sắp xếp bệnh nhân
  const filteredAndSortedPatients = useMemo(() => {
    if (error) return [];
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
  }, [patientList, searchTerm, statusFilter, sortBy, error]);

  // Phân trang
  const totalPages = Math.ceil(filteredAndSortedPatients.length / patientsPerPage);
  const paginatedPatients = filteredAndSortedPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="m-2 d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <div className="mt-2 text-muted">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="m-2">
        <h3 className="mb-4">Quản lý bệnh nhân</h3>
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => {
              setError(null);
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
    <div className="m-2">
      {/* Search and Filters */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <h3 className="mb-0">Quản lý bệnh nhân</h3>
        <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
          <div className="position-relative">
            <Filter
              className="position-absolute top-50 translate-middle-y text-muted"
              size={16}
              style={{ left: "12px", zIndex: 10 }}
            />
            <Select value={statusFilter} onChange={setStatusFilter} style={{ paddingLeft: "2rem" }}>
              <option value="all">Tất cả tình trạng</option>
              <option value="Cần theo dõi">Cần theo dõi</option>
              <option value="Đang điều trị">Đang điều trị</option>
              <option value="Ổn định">Ổn định</option>
            </Select>
          </div>
          <Select value={sortBy} onChange={setSortBy}>
            <option value="name">Sắp xếp theo tên</option>
            <option value="age">Sắp xếp theo tuổi</option>
            <option value="lastVisit">Lần khám gần nhất</option>
            <option value="status">Tình trạng</option>
          </Select>
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
      </div>

      {/* Patient Table */}
      <div className="card shadow-sm m-4" style={{ borderRadius: "12px", border: "none" }}>
        <div className="table-responsive">
          <table className="w-100">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-2 fw-bold py-3 border-0">Bệnh nhân</th>
                <th className="fw-bold py-3 border-0">Thông tin</th>
                <th className="fw-bold py-3 border-0">Tình trạng</th>
                <th className="fw-bold py-3 border-0">Lần khám gần nhất</th>
                <th className="fw-bold small py-3 border-0">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient) => (
                  <tr key={patient.id} style={{ borderTop: "1px solid #f1f3f4" }}>
                    <td className="p-3 border-0">
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
      {filteredAndSortedPatients.length === 0 && !error && (
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