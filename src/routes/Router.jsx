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
  Utensils 
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import "./Router.css";

const Router = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  const [isOpen, setIsOpen] = useState(true);
  const [showNutrition, setShowNutrition] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="d-flex parent">
      {/* Toggle button */}
      <button
        onClick={toggleNavbar}
        className={`toggle-btn ${isOpen ? 'hidden' : ''}`}
        style={{
          left: isOpen ? "220px" : "-20px", // di chuyển theo sidebar
          transition: "left 0.3s ease-in-out",
        }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar navbar */}
      <Navbar
        className={`d-flex flex-column navbar-gradient h-100 py-2 transition-sidebar ${isOpen ? 'navbar-show' : 'navbar-hide'}`}
        style={{
          width: isOpen ? "250px" : "0px", // di chuyển theo toggle
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 40,
          height: '100vh',
        }}
      >
        <Container fluid className="d-flex flex-column align-items-center">
          {/* Menu content */}
          <Nav className="d-flex flex-column w-100 gap-2">
            {/* <Nav.Link as={NavLink} to="/overviewTab" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
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
            <Nav.Link as={NavLink} to="/informationTab" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
              <Info size={20} />
              <span>Thông tin</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/settingTabs" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
              <Settings size={20} />
              <span>Cài đặt</span>
            </Nav.Link> */}


            <Nav.Link as={NavLink} to="/home" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item" >
              <Home size={20} />
              <span>Trang chủ</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/healthTabs" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item" >
              <HeartPulse size={20} />
              <span>Sức khỏe</span>
            </Nav.Link>

            <div className="ms-3 ">
              <div
                className="d-flex align-items-center gap-2 nav-link"
                onClick={() => setShowNutrition(!showNutrition)}
                style={{ cursor: "pointer" }}
              >
                <Utensils  size={20} />
                <span>Dinh dưỡng</span>
              </div>

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
            </div>


            <Nav.Link as={NavLink} to="/bookingTabs" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
              <CalendarPlus size={20} />
              <span>Đặt khám</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/personalTabs" className="d-flex align-items-center gap-2 nav-link ms-3 navbar-item">
              <User size={20} />
              <span>Cá nhân</span>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Router;
