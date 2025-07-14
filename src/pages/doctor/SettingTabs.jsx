import { useState } from "react";
import { Card, Button, Row, Col, Form, Image, Modal, Table } from "react-bootstrap";
import { Settings, Lock, History, User } from "lucide-react";

// Inline CSS for light and dark modes
const styles = `
  .light-mode {
    background-color: #f8f9fa;
    color: #212529;
  }
  .light-mode .card {
    background-color: #ffffff;
    color: #212529;
  }
  .light-mode .text-muted {
    color: #6c757d !important;
  }
  .light-mode .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  .light-mode .btn-outline-secondary {
    color: #6c757d;
    border-color: #6c757d;
  }
  .light-mode .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  .dark-mode {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
  .dark-mode .card {
    background-color: #2c2c2c;
    color: #e0e0e0;
    border-color: #444;
  }
  .dark-mode .text-muted {
    color: #a0a0a0 !important;
  }
  .dark-mode .form-control {
    background-color: #333;
    color: #e0e0e0;
    border-color: #444;
  }
  .dark-mode .form-select {
    background-color: #333;
    color: #e0e0e0;
    border-color: #444;
  }
  .dark-mode .btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
  }
  .dark-mode .btn-outline-secondary {
    color: #e0e0e0;
    border-color: #e0e0e0;
  }
  .dark-mode .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  .dark-mode .modal-content {
    background-color: #2c2c2c;
    color: #e0e0e0;
    border-color: #444;
  }
  .dark-mode .modal-header, .dark-mode .modal-footer {
    border-color: #444;
  }
`;

// Mock initial user settings
const initialUserSettings = {
  name: "Nguyễn Văn A",
  status: "Premium User",
  email: "user@example.com",
  phone: "+84 123 456 789",
  location: "Hà Nội, Việt Nam",
  notifications: {
    general: true,
    email: true,
    sms: false,
  },
  appearance: {
    darkMode: false,
    language: "Tiếng Việt",
  },
};

// Mock activity log data
const mockActivityLog = [
  { id: 1, action: "Đăng nhập", timestamp: "14/07/2025 09:30", ip: "192.168.1.1" },
  { id: 2, action: "Cập nhật hồ sơ", timestamp: "13/07/2025 15:45", ip: "192.168.1.2" },
  { id: 3, action: "Đổi mật khẩu", timestamp: "12/07/2025 10:20", ip: "192.168.1.3" },
];

// UserProfileCard component (display-only)
const UserProfileCard = ({ user }) => (
  <Card className="shadow-sm mb-4">
    <Card.Body className="d-flex flex-column align-items-center text-center">
      <Image
        roundedCircle
        width={80}
        height={80}
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=150&background=random`}
        alt={user.name}
        className="mb-3"
      />
      <h4 className="mb-1">{user.name}</h4>
      <div className="text-muted small">{user.status}</div>
      <div className="text-muted small">{user.email}</div>
      <div className="text-muted small">{user.phone}</div>
      <div className="text-muted small">{user.location}</div>
    </Card.Body>
  </Card>
);

// EditProfileModal component
const EditProfileModal = ({ show, onHide, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      setError("Họ và tên và email không được để trống.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email không hợp lệ.");
      return;
    }
    onSave(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật thông tin cá nhân</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-start">Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-start">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-start">Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-start">Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                />
              </Form.Group>
            </Col>
          </Row>
          {error && <div className="text-danger small">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// NotificationSettings component
const NotificationSettings = ({ notifications, onToggle }) => (
  <Card className="shadow-sm h-100">
    <Card.Body>
      <h5 className="mb-3">Cài đặt thông báo</h5>
      <Form>
        <Form.Check
          type="switch"
          id="general-notifications"
          label="Thông báo chung"
          checked={notifications.general}
          onChange={(e) => onToggle("general", e.target.checked)}
          className="mb-2"
        />
        <Form.Check
          type="switch"
          id="email-notifications"
          label="Thông báo qua email"
          checked={notifications.email}
          onChange={(e) => onToggle("email", e.target.checked)}
          className="mb-2"
        />
        <Form.Check
          type="switch"
          id="sms-notifications"
          label="Thông báo qua SMS"
          checked={notifications.sms}
          onChange={(e) => onToggle("sms", e.target.checked)}
        />
        <div className="text-muted small mt-2">
          Quản lý cách bạn nhận thông báo về lịch hẹn và cập nhật hệ thống.
        </div>
      </Form>
    </Card.Body>
  </Card>
);

// AppearanceSettings component
const AppearanceSettings = ({ appearance, onToggle, onLanguageChange }) => {
  const languageOptions = [
    { value: "Tiếng Việt", label: "Tiếng Việt" },
    { value: "English", label: "English" },
  ];

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <h5 className="mb-3">Cài đặt giao diện</h5>
        <Form>
          <Form.Check
            type="switch"
            id="dark-mode"
            label="Chế độ tối"
            checked={appearance.darkMode}
            onChange={(e) => onToggle("darkMode", e.target.checked)}
            className="mb-3"
          />
          <Form.Group>
            <Form.Label>Ngôn ngữ</Form.Label>
            <Form.Select
              value={appearance.language}
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            <div className="text-muted small mt-1">Chọn ngôn ngữ hiển thị cho giao diện.</div>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

// ChangePasswordModal component
const ChangePasswordModal = ({ show, onHide, onSave }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    onSave(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đổi mật khẩu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu hiện tại</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Group>
          {error && <div className="text-danger small">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// ActivityLogModal component
const ActivityLogModal = ({ show, onHide }) => (
  <Modal show={show} onHide={onHide} centered size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Lịch sử hoạt động</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Hành động</th>
              <th>Thời gian</th>
              <th>Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody>
            {mockActivityLog.length > 0 ? (
              mockActivityLog.map((log) => (
                <tr key={log.id}>
                  <td>{log.action}</td>
                  <td>{log.timestamp}</td>
                  <td>{log.ip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  Không có lịch sử hoạt động.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onHide}>
        Đóng
      </Button>
    </Modal.Footer>
  </Modal>
);

// QuickOptions component
const QuickOptions = ({ user, onEditProfile }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handlePasswordSave = (formData) => {
    console.log("Password updated:", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
    // Replace with actual password update logic
    setShowChangePassword(false);
  };

  const handleProfileSave = (formData) => {
    onEditProfile(formData);
    setShowEditProfile(false);
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-3">Tùy chọn nhanh</h5>
        <Row className="g-4">
          {[
            {
              title: "Cập nhật hồ sơ",
              action: "Cập nhật thông tin cá nhân",
              color: "primary",
              onClick: () => setShowEditProfile(true),
              icon: "user",
            },
            {
              title: "Quản lý mật khẩu",
              action: "Đổi mật khẩu tài khoản",
              color: "warning",
              onClick: () => setShowChangePassword(true),
              icon: "lock",
            },
            {
              title: "Lịch sử hoạt động",
              action: "Xem nhật ký hoạt động",
              color: "success",
              onClick: () => setShowActivityLog(true),
              icon: "history",
            },
          ].map((item, index) => (
            <Col md={4} key={index}>
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={item.onClick}
                role="button"
              >
                <div className={`bg-${item.color} bg-opacity-10 rounded-circle p-3 me-3`}>
                  <i className={`fas fa-${item.icon} text-${item.color} fs-5`}></i>
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {item.title}
                  </div>
                  <div className="fw-semibold" style={{ fontSize: "1.2rem" }}>
                    {item.action}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
      <EditProfileModal
        show={showEditProfile}
        onHide={() => setShowEditProfile(false)}
        user={user}
        onSave={handleProfileSave}
      />
      <ChangePasswordModal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
        onSave={handlePasswordSave}
      />
      <ActivityLogModal
        show={showActivityLog}
        onHide={() => setShowActivityLog(false)}
      />
    </Card>
  );
};

// LogoutButton component with confirmation modal
const LogoutButton = ({ onLogout }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowModal(false);
    onLogout();
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          variant="danger"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Settings size={16} />
          Đăng xuất
        </Button>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đăng xuất</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Đăng xuất
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState(initialUserSettings);

  const handleProfileSave = (updatedData) => {
    setUserSettings((prev) => ({
      ...prev,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      location: updatedData.location,
    }));
  };

  const handleNotificationChange = (type, value) => {
    setUserSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const handleAppearanceChange = (type, value) => {
    setUserSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [type]: value,
      },
    }));
    if (type === "darkMode") {
      document.body.classList.toggle("dark-mode", value);
      document.body.classList.toggle("light-mode", !value);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/login"; // Replace with actual logout logic
  };

  return (
    <>
      <style>{styles}</style>
      <div className={userSettings.appearance.darkMode ? "dark-mode" : "light-mode"}>
        <div className="container mt-4">
          <h2 className="mb-4">Cài đặt</h2>
          <UserProfileCard user={userSettings} />
          <Row className="g-4 mb-4">
            <Col md={6}>
              <NotificationSettings
                notifications={userSettings.notifications}
                onToggle={handleNotificationChange}
              />
            </Col>
            <Col md={6}>
              <AppearanceSettings
                appearance={userSettings.appearance}
                onToggle={handleAppearanceChange}
                onLanguageChange={(value) => handleAppearanceChange("language", value)}
              />
            </Col>
          </Row>
          <QuickOptions user={userSettings} onEditProfile={handleProfileSave} />
          <LogoutButton onLogout={handleLogout} />
        </div>
      </div>
    </>
  );
}