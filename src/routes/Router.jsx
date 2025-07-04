import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Settings,
  Info,
  Home,
  HeartPulse,
  CalendarPlus,
  User
} from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import "./Router.css";

const Router = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userInfo);
  const socketRef = props.socketRef;

  return (
    <Navbar
      className="d-flex flex-column bg-primary h-100 py-2"
      // sticky="top"
      style={{ width: "250px" }}
    >
      <Container fluid className="d-flex flex-column align-items-center">
        {/* Menu content */}
        <Nav className="d-flex flex-column w-100 gap-2">
          <Nav.Link as={NavLink} to="/overviewTab" className="d-flex align-items-center gap-2 text-dark ms-3">
            <LayoutDashboard size={20} />
            <span>Tổng quan</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/patientTab" className="d-flex align-items-center gap-2 text-dark ms-3">
            <Users size={20} />
            <span>Bệnh nhân</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/appointmentTab" className="d-flex align-items-center gap-2 text-dark ms-3">
            <CalendarCheck size={20} />
            <span>Lịch hẹn</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/informationTab" className="d-flex align-items-center gap-2 text-dark ms-3">
            <Info size={20} />
            <span>Thông tin</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/settingTabs" className="d-flex align-items-center gap-2 text-dark ms-3">
            <Settings size={20} />
            <span>Cài đặt</span>
          </Nav.Link>


          {/* <Nav.Link as={NavLink} to="/home" className="d-flex align-items-center gap-2 text-dark ms-3">
            <Home size={20} />
            <span>Trang chủ</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/healthTabs" className="d-flex align-items-center gap-2 text-dark ms-3">
            <HeartPulse size={20} />
            <span>Sức khỏe</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/bookingTabs" className="d-flex align-items-center gap-2 text-dark ms-3">
            <CalendarPlus size={20} />
            <span>Đặt khám</span>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/personalTabs" className="d-flex align-items-center gap-2 text-dark ms-3">
            <User size={20} />
            <span>Cá nhân</span>
          </Nav.Link> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Router;
