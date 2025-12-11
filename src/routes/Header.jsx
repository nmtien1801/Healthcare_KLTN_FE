import React, { forwardRef, useState } from "react";
import { Container, Row, Col, Image, Dropdown, Button } from "react-bootstrap";
import { Menu as MenuIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import NotificationDropdown from "../components/notifications/NotificationDropdown";
import ChangePassword from "../components/changePassword";

const CustomToggle = forwardRef(({ onClick, user }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ cursor: "pointer" }}
  >
    <div className="position-relative">
      <Image
        src={
          user?.avatar
            ? user.avatar
            : "https://readdy.ai/api/search-image?query=professional%20male%20doctor%20portrait%2C%20asian%20doctor%2C%20wearing%20white%20coat%2C%20stethoscope%2C%20friendly%20smile%2C%20high%20quality%2C%20studio%20lighting%2C%20medical%20professional%2C%20isolated%20on%20light%20blue%20background%2C%20centered%20composition&width=50&height=50&seq=doctor1&orientation=squarish"
        }
        roundedCircle
        width={40}
        height={40}
        className="border border-primary object-fit-cover"
      />

      <span
        className="position-absolute bottom-0 end-0 translate-middle p-1 bg-success border border-white rounded-circle"
        style={{ width: "12px", height: "12px" }}
      ></span>
    </div>
  </div>
));

const Header = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = useSelector((state) => state.auth.userInfo);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false); // đổi mk

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      dispatch(logout());  // Xóa Redux user
      localStorage.removeItem("access_Token");
      localStorage.removeItem("refresh_Token");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi logout: ", error);
    }

  };

  const handleChangePassword = () => {
    setIsOpenChangePassword(true);
  };

  const handleInfo = () => {
    if (user.role === 'doctor') {
      navigate("/informationTab");
    } else {
      navigate("/personalTabs");
    }
  }

  return (
    <div
      className="shadow-sm py-3 px-4 bg-white w-100"
      style={{ zIndex: 1050 }}
    >
      <Container fluid>
        <Row className="align-items-center justify-content-between">
          {/* Logo & Title */}
          <Col xs="auto" className="d-flex align-items-center">
            {/* hamburger for mobile - toggles sidebar via custom event */}
            <Button
              variant="link"
              className="p-0 me-2"
              onClick={() => window.dispatchEvent(new Event('toggleSidebar'))}
              aria-label="Mở menu"
            >
              <MenuIcon size={20} />
            </Button>
          </Col>

          {/* Notifications & Info */}
          <Col xs="auto" className="d-flex align-items-center">
            {/* Notification Dropdown */}
            <div className="me-2 me-md-4">
              <NotificationDropdown />
            </div>

            <div className="me-4 text-end d-none d-md-block">
              <div className="fw-medium">{user.role === 'doctor' ? "BS. " + user.username : user.username}</div>
              <div className="text-muted small">{user.role === 'doctor' ? 'Bác sĩ tiểu đường' : ''}</div>
            </div>

            {/* Avatar Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle as={CustomToggle} id="dropdown-avatar" user={user} />

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleInfo}>
                  Thông tin cá nhân
                </Dropdown.Item>
                <Dropdown.Item onClick={handleChangePassword}>
                  Đổi mật khẩu
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>

        {isOpenChangePassword && (
          <ChangePassword toggleModalChangePassword={() => setIsOpenChangePassword(false)} />
        )}
      </Container>
    </div>
  );
};

export default Header;