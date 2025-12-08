import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from 'react-bootstrap/Dropdown';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Settings,
  Info,
  Home,
  HeartPulse,
  CalendarPlus,
  User,
  Menu,
  ChevronLeft,
  Utensils,
  CalendarDays,
  Banknote,
  ChevronUp,
  ChevronDown,
  Bot,
  Wallet
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import "./Router.css";

const Router = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // detect mobile and close sidebar by default on small screens
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // listen for external toggle event (from Header) to open/close sidebar
  useEffect(() => {
    const onToggle = () => setIsOpen((v) => !v);
    window.addEventListener("toggleSidebar", onToggle);
    return () => window.removeEventListener("toggleSidebar", onToggle);
  }, []);

  // when sidebar is open on mobile, prevent body scroll and keep sidebar above header
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [isMobile, isOpen]);

  return (
    <div className="d-flex parent">
      {/* Nút bật tắt */}
      <button
        onClick={toggleNavbar}
        className={`toggle-btn ${isOpen && !isMobile ? 'hidden' : ''}`}
        style={
          isMobile
            ? {
              position: "fixed",
              left: "16px",
              top: "16px",
              zIndex: 70,
            }
            : {
              left: isOpen ? "220px" : "-20px", // di chuyển theo sidebar
              transition: "left 0.3s ease-in-out",
            }
        }
        aria-label={isOpen ? "Đóng menu" : "Mở menu"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      {/* Thanh điều hướng Sidebar */}
      {isOpen && (
        <>
          {isMobile && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}
          <Navbar
            className={`d-flex flex-column navbar-gradient h-100 py-2 transition-sidebar ${isOpen ? 'navbar-show' : 'navbar-hide'}`}
            style={{
              width: isMobile ? "80vw" : "250px",
              maxWidth: isMobile ? "320px" : "250px",
              transform: isOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s ease-in-out",
              zIndex: 2000, // ensure sidebar appears above header (header z-index ~1050)
              height: isMobile ? 'calc(100vh - 64px)' : '100vh',
              position: isMobile ? 'fixed' : 'relative',
              top: isMobile ? 64 : 0, // push below header height on mobile
              left: 0,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            <Container fluid className="d-flex flex-column align-items-center">
              {/* Nội dung Menu */}
              <Nav className="d-flex flex-column w-100 gap-2">
                {user && user.role === "doctor" ? (
                  <>
                    <Nav.Link as={NavLink} to="/overviewTab" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
                      <LayoutDashboard size={20} />
                      <span>Tổng quan</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/patientTab" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item" >
                      <Users size={20} />
                      <span>Bệnh nhân</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/appointmentTab" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item" >
                      <CalendarCheck size={20} />
                      <span>Lịch hẹn</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/attendanceTab" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
                      <CalendarDays size={20} />
                      <span>Chấm công</span>
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={NavLink} to="/home" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item" >
                      <Home size={20} />
                      <span>Trang chủ</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/healthTabs" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item" >
                      <HeartPulse size={20} />
                      <span>Sức khỏe</span>
                    </Nav.Link>

                    <Nav.Link
                      className="d-flex align-items-center justify-content-between gap-2 nav-link ms-3"
                      onClick={() => setShowNutrition(!showNutrition)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Utensils size={20} />
                        <span>Dinh dưỡng</span>
                      </div>
                      {showNutrition ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Nav.Link>

                    {showNutrition && (
                      <Nav className="flex-column ms-4 mt-1">
                        <Nav.Link
                          as={NavLink}
                          to="/nutrition"
                          className="nav-link navbar-item"
                        >
                          Thực đơn của bạn
                        </Nav.Link>
                        <Nav.Link
                          as={NavLink}
                          to="/suggestedFood"
                          className="nav-link navbar-item"
                        >
                          Khám phá thực đơn
                        </Nav.Link>
                      </Nav>
                    )}

                    <Nav.Link as={NavLink} to="/bookingTabs" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
                      <CalendarPlus size={20} />
                      <span>Đặt khám</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/assitant" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
                      <Bot size={20} />
                      <span>Trợ lý AI</span>
                    </Nav.Link>
                  </>
                )}
                <Nav.Link as={NavLink} to="/payment" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
                  <Wallet size={20} />
                  <span>Ví điện tử</span>
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        </>
      )}

    </div>
  );
};

export default Router;

