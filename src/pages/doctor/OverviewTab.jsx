import { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { Card, Button, Table, Row, Col, Image, Badge } from "react-bootstrap";
import ApiDoctor from "../../apis/ApiDoctor";

const OverviewTab = () => {
  const [revenuePeriod, setRevenuePeriod] = useState("week");
  const [healthPeriod, setHealthPeriod] = useState("week");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [summary, setSummary] = useState({
    newPatients: 0,
    newPatientsChange: "",
    appointmentsToday: 0,
    upcomingAppointments: 0,
    monthlyRevenue: "0 đ",
    monthlyRevenueChange: "",
  });
  const [revenueData, setRevenueData] = useState({ week: {}, month: {}, year: {} });
  const [healthData, setHealthData] = useState({});
  const revenueChartRef = useRef(null);
  const healthChartRef = useRef(null);

  // Fetch summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await ApiDoctor.getSummary();
        // Xử lý response trực tiếp (không bọc trong data)
        if (
          res &&
          typeof res === "object" &&
          "newPatients" in res &&
          "appointmentsToday" in res &&
          "upcomingAppointments" in res &&
          "monthlyRevenue" in res
        ) {
          setSummary(res);
        } else {
          console.error("Response summary không hợp lệ:", res);
          setSummary({
            newPatients: 0,
            newPatientsChange: "",
            appointmentsToday: 0,
            upcomingAppointments: 0,
            monthlyRevenue: "0 đ",
            monthlyRevenueChange: "",
          });
        }
      } catch (err) {
        console.error("Lỗi fetch summary:", err);
        setSummary({
          newPatients: 0,
          newPatientsChange: "",
          appointmentsToday: 0,
          upcomingAppointments: 0,
          monthlyRevenue: "0 đ",
          monthlyRevenueChange: "",
        });
      }
    };
    fetchSummary();
  }, []);

  // Fetch patients attention
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await ApiDoctor.getPatientsAttention();
        // Xử lý response trực tiếp
        const patientsData = Array.isArray(res) ? res : [];
        setPatients(patientsData);
        setSelectedPatient(patientsData.length > 0 ? patientsData[0] : null);
      } catch (err) {
        console.error("Lỗi fetch patients:", err);
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  // Fetch revenue
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const weekRes = await ApiDoctor.getRevenue("week");
        const monthRes = await ApiDoctor.getRevenue("month");
        const yearRes = await ApiDoctor.getRevenue("year");
        setRevenueData({
          week: weekRes || {},
          month: monthRes || {},
          year: yearRes || {},
        });
      } catch (err) {
        console.error("Lỗi fetch revenue:", err);
      }
    };
    fetchRevenue();
  }, []);

  // Fetch health
  useEffect(() => {
    if (selectedPatient) {
      const fetchHealth = async () => {
        try {
          const res = await ApiDoctor.getPatientHealth(selectedPatient._id, healthPeriod);
          setHealthData(res || {});
        } catch (err) {
          console.error("Lỗi fetch health:", err);
        }
      };
      fetchHealth();
    }
  }, [selectedPatient, healthPeriod]);

  // Chart options for revenue
  const getRevenueChartOptions = (period) => ({
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: revenueData[period]?.xAxisData || [], axisTick: { alignWithLabel: true } },
    yAxis: { type: "value" },
    series: [
      { name: "Doanh thu", type: "bar", barWidth: "60%", data: revenueData[period]?.data || [], itemStyle: { color: "#3b82f6" } },
    ],
  });

  // Chart options for health
  const getHealthChartOptions = () => ({
    tooltip: { trigger: "axis" },
    legend: { data: ["Huyết áp", "Nhịp tim", "Đường huyết"] },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: healthData.xAxisData || [] },
    yAxis: { type: "value" },
    series: [
      { name: "Huyết áp", type: "line", data: healthData.bloodPressureData || [], itemStyle: { color: "#ef4444" } },
      { name: "Nhịp tim", type: "line", data: healthData.heartRateData || [], itemStyle: { color: "#8b5cf6" } },
      { name: "Đường huyết", type: "line", data: healthData.bloodSugarData || [], itemStyle: { color: "#10b981" } },
    ],
  });

  useEffect(() => {
    const revenueDom = document.getElementById("revenue-chart");
    if (revenueDom) {
      if (!revenueChartRef.current) {
        revenueChartRef.current = echarts.init(revenueDom);
        window.addEventListener("resize", () => revenueChartRef.current?.resize());
      }
      revenueChartRef.current.setOption(getRevenueChartOptions(revenuePeriod));
    }

    const healthDom = document.getElementById("health-chart");
    if (healthDom && selectedPatient) {
      if (!healthChartRef.current) {
        healthChartRef.current = echarts.init(healthDom);
        window.addEventListener("resize", () => healthChartRef.current?.resize());
      }
      healthChartRef.current.setOption(getHealthChartOptions());
    }

    return () => {
      if (revenueChartRef.current) {
        window.removeEventListener("resize", revenueChartRef.current.resize);
        revenueChartRef.current.dispose();
        revenueChartRef.current = null;
      }
      if (healthChartRef.current) {
        window.removeEventListener("resize", healthChartRef.current.resize);
        healthChartRef.current.dispose();
        healthChartRef.current = null;
      }
    };
  }, [revenuePeriod, healthData, selectedPatient]);

  // Kiểm tra summary trước khi render
  const isSummaryValid = summary && typeof summary === "object" && "newPatients" in summary;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Tổng quan</h3>
      <Row className="mb-4">
        {isSummaryValid ? (
          [
            { icon: "user-plus", title: "Bệnh nhân mới", value: summary.newPatients, change: summary.newPatientsChange, color: "primary" },
            {
              icon: "calendar-check",
              title: "Cuộc hẹn hôm nay",
              value: summary.appointmentsToday,
              change: `${summary.upcomingAppointments} cuộc hẹn sắp tới`,
              color: "warning",
            },
            {
              icon: "money-bill-wave",
              title: "Doanh thu tháng",
              value: summary.monthlyRevenue,
              change: summary.monthlyRevenueChange,
              color: "success",
            },
          ].map((item, index) => (
            <Col md={4} key={index}>
              <Card className="shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <div className={`bg-${item.color} bg-opacity-10 rounded-circle p-3 me-3`}>
                    <i className={`fas fa-${item.icon} text-${item.color} fs-5`}></i>
                  </div>
                  <div>
                    <div className="text-muted small">{item.title}</div>
                    <div className="fs-4 fw-semibold">{item.value}</div>
                    <div className="text-success small">{item.change}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <div className="text-center text-muted">Đang tải dữ liệu tổng quan...</div>
          </Col>
        )}
      </Row>
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Doanh thu theo ngày</h5>
            <div>
              {["week", "month", "year"].map((period) => (
                <Button
                  key={period}
                  size="sm"
                  variant={revenuePeriod === period ? "primary" : "outline-secondary"}
                  className="me-2"
                  onClick={() => setRevenuePeriod(period)}
                >
                  {period === "week" ? "Tuần này" : period === "month" ? "Tháng này" : "Năm nay"}
                </Button>
              ))}
            </div>
          </div>
          <div id="revenue-chart" style={{ height: "300px" }}></div>
        </Card.Body>
      </Card>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h5>Chỉ số sức khỏe: {selectedPatient?.name || "Chưa chọn"}</h5>
                <div>
                  {["week", "month", "year"].map((period) => (
                    <Button
                      key={period}
                      size="sm"
                      variant={healthPeriod === period ? "primary" : "outline-secondary"}
                      className="me-2"
                      onClick={() => setHealthPeriod(period)}
                    >
                      {period === "week" ? "Tuần này" : period === "month" ? "Tháng này" : "Năm nay"}
                    </Button>
                  ))}
                </div>
              </div>
              <div id="health-chart" style={{ height: "250px" }}></div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h5>Bệnh nhân cần chú ý</h5>
                <Button variant="link" className="p-0">Xem tất cả</Button>
              </div>
              <div className="table-responsive">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Bệnh nhân</th>
                      <th>Chỉ số</th>
                      <th>Cảnh báo</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(patients) && patients.length > 0 ? (
                      patients.map((patient, index) => (
                        <tr
                          key={index}
                          onClick={() => setSelectedPatient(patient)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: patient.name === selectedPatient?.name ? "#f0f4ff" : "transparent",
                          }}
                        >
                          <td>
                            <div className="d-flex align-items-center">
                              <Image roundedCircle width={40} height={40} src={patient.image} alt="Bệnh nhân" />
                              <div className="ms-3">
                                <div>{patient.name}</div>
                                <div className="text-muted small">{patient.age} tuổi</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              Huyết áp: <span className="text-danger fw-bold">{patient.bloodPressure}</span>
                            </div>
                            <div>Nhịp tim: {patient.heartRate} bpm</div>
                          </td>
                          <td>
                            <Badge bg="danger" pill>
                              {patient.warning}
                            </Badge>
                          </td>
                          <td>
                            <a
                              href={`tel:${patient.phone}`}
                              className="btn btn-link text-primary me-2 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-phone-alt"></i>
                            </a>
                            <a
                              href={`sms:${patient.phone}`}
                              className="btn btn-link text-primary p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-comment-medical"></i>
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Không có bệnh nhân cần chú ý
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewTab;