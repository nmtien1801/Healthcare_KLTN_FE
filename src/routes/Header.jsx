import React, { useState } from "react";
import { Container, Row, Col, Navbar, Badge, Image } from "react-bootstrap";
import { FaHeartbeat, FaBell } from "react-icons/fa";

const Header = () => {
  const [notifications, setNotifications] = useState(5);

  return (
    <Navbar
      bg="white"
      className="shadow-sm fixed w-full py-3 top-0"
      style={{ zIndex: 1050 }}
    >
     <Container fluid className="p-0" style={{ maxWidth: "100%" }}>
        <Row className="w-100 align-items-center justify-content-between">
          {/* Logo & Title */}
          <Col xs="auto" className="d-flex align-items-center">
            <FaHeartbeat size={24} className="text-primary me-2" />
            <span className="fs-5 fw-semibold text-primary">HealthCare AI</span>
          </Col>

          {/* Notifications & Info */}
          <Col xs="auto" className="d-flex align-items-center">
            {/* Bell Icon with badge */}
            <div className="position-relative me-4">
              <FaBell size={20} className="text-secondary" />
              {notifications > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: "0.6rem", width: "1.2rem", height: "1.2rem" }}
                >
                  {notifications}
                </Badge>
              )}
            </div>

            {/* Doctor Info */}
            <div className="me-4 text-end">
              <div className="fw-medium">BS. Nguyễn Văn An</div>
              <div className="text-muted small">Khoa Tim mạch</div>
            </div>

            {/* Avatar */}
            <div className="position-relative">
              <Image
                src="https://readdy.ai/api/search-image?query=professional%20male%20doctor%20portrait%2C%20asian%20doctor%2C%20wearing%20white%20coat%2C%20stethoscope%2C%20friendly%20smile%2C%20high%20quality%2C%20studio%20lighting%2C%20medical%20professional%2C%20isolated%20on%20light%20blue%20background%2C%20centered%20composition&width=50&height=50&seq=doctor1&orientation=squarish"
                roundedCircle
                width={40}
                height={40}
                className="border border-primary object-fit-cover"
              />
              {/* Online status dot */}
              <span
                className="position-absolute bottom-0 end-0 translate-middle p-1 bg-success border border-white rounded-circle"
                style={{ width: "12px", height: "12px" }}
              ></span>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
