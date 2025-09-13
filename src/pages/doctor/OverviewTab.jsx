import { useEffect, useState, useRef } from "react"
import * as echarts from "echarts"
import { Card, Button, Table, Row, Col, Image, Badge } from "react-bootstrap"
import ApiDoctor from "../../apis/ApiDoctor"
// Mock data
const mockData = {
  revenue: {
    week: {
      xAxisData: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      data: [5.2, 8.9, 7.0, 9.3, 12.5, 4.8, 2.1].map((v) => v * 1000000),
    },
    month: {
      xAxisData: Array.from({ length: 30 }, (_, i) => `${i + 1}/07`),
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10 + 3) * 1000000),
    },
    year: {
      xAxisData: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50 + 20) * 1000000),
    },
  },
  health: {
    patients: [
      {
        name: "Trần Văn Bình",
        age: 68,
        bloodPressure: "160/95",
        heartRate: 92,
        warning: "Huyết áp cao",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        phone: "0123456789",
        week: {
          xAxisData: ["19/06", "20/06", "21/06", "22/06", "23/06", "24/06", "25/06"],
          bloodPressureData: [160, 162, 158, 165, 160, 163, 159],
          heartRateData: [92, 90, 93, 89, 91, 92, 90],
          bloodSugarData: [6.8, 7.0, 6.7, 7.2, 6.9, 7.1, 6.8],
        },
        month: {
          xAxisData: Array.from({ length: 30 }, (_, i) => `${i + 1}/07`),
          bloodPressureData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10 + 155)),
          heartRateData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8 + 85)),
          bloodSugarData: Array.from({ length: 30 }, () => Number.parseFloat((Math.random() * 1.0 + 6.5).toFixed(1))),
        },
        year: {
          xAxisData: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
          bloodPressureData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15 + 150)),
          heartRateData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 85)),
          bloodSugarData: Array.from({ length: 12 }, () => Number.parseFloat((Math.random() * 1.5 + 6.0).toFixed(1))),
        },
      },
      {
        name: "Nguyễn Thị Hoa",
        age: 55,
        bloodPressure: "135/85",
        heartRate: 78,
        warning: "Đường huyết thấp",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        phone: "0987654321",
        week: {
          xAxisData: ["19/06", "20/06", "21/06", "22/06", "23/06", "24/06", "25/06"],
          bloodPressureData: [135, 138, 134, 136, 140, 137, 135],
          heartRateData: [78, 80, 77, 79, 81, 78, 80],
          bloodSugarData: [5.5, 5.7, 5.6, 5.8, 5.9, 5.6, 5.7],
        },
        month: {
          xAxisData: Array.from({ length: 30 }, (_, i) => `${i + 1}/07`),
          bloodPressureData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10 + 130)),
          heartRateData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8 + 75)),
          bloodSugarData: Array.from({ length: 30 }, () => Number.parseFloat((Math.random() * 1.0 + 5.0).toFixed(1))),
        },
        year: {
          xAxisData: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
          bloodPressureData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15 + 125)),
          heartRateData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 70)),
          bloodSugarData: Array.from({ length: 12 }, () => Number.parseFloat((Math.random() * 1.5 + 5.0).toFixed(1))),
        },
      },
      {
        name: "Lê Minh Tuấn",
        age: 72,
        bloodPressure: "145/90",
        heartRate: 85,
        warning: "Huyết áp cao",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        phone: "0912345678",
        week: {
          xAxisData: ["19/06", "20/06", "21/06", "22/06", "23/06", "24/06", "25/06"],
          bloodPressureData: [145, 148, 143, 147, 150, 146, 144],
          heartRateData: [85, 87, 84, 86, 88, 85, 87],
          bloodSugarData: [6.2, 6.4, 6.3, 6.5, 6.6, 6.3, 6.4],
        },
        month: {
          xAxisData: Array.from({ length: 30 }, (_, i) => `${i + 1}/07`),
          bloodPressureData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10 + 140)),
          heartRateData: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8 + 80)),
          bloodSugarData: Array.from({ length: 30 }, () => Number.parseFloat((Math.random() * 1.0 + 6.0).toFixed(1))),
        },
        year: {
          xAxisData: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
          bloodPressureData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15 + 135)),
          heartRateData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 10 + 80)),
          bloodSugarData: Array.from({ length: 12 }, () => Number.parseFloat((Math.random() * 1.5 + 5.5).toFixed(1))),
        },
      },
    ],
  },
  summary: {
    newPatients: 12,
    newPatientsChange: "+15% so với tuần trước",
    appointmentsToday: 8,
    upcomingAppointments: 2,
    monthlyRevenue: "48.500.000 đ",
    monthlyRevenueChange: "+8% so với tháng trước",
  },
}

const OverviewTab = () => {
  const [revenuePeriod, setRevenuePeriod] = useState("week")
  const [healthPeriod, setHealthPeriod] = useState("week")
  const [selectedPatient, setSelectedPatient] = useState(mockData.health.patients[0])
  const revenueChartRef = useRef(null)
  const healthChartRef = useRef(null)
  const [appointmentToday, setAppointmentToday] = useState(0);
  const [appointmentNext, setAppointmentNext] = useState(0);
  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const res = await ApiDoctor.getAppointmentsToday();
        setAppointmentToday(res.length);
        console.log(
          "Số lượng cuộc hẹn hôm nay:",
          res.length);
      } catch (err) {
        console.error("Lỗi khi lấy số lượng cuộc hẹn hôm nay:", err);
      }
    };

    fetchTodayAppointments();
  }, []);

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const res = await ApiDoctor.getAppointments();
        setAppointmentNext(res.length);
        console.log(
          "Số lượng cuộc hẹn sắp tới:",
          res.length);

      } catch (err) {
        console.error("Lỗi khi lấy số lượng cuộc hẹn sắp tới:", err);
      }
    };

    fetchTodayAppointments();
  }, []);



  // Chart options for revenue
  const getRevenueChartOptions = (period) => ({
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", data: mockData.revenue[period]?.xAxisData || [], axisTick: { alignWithLabel: true } },
    yAxis: { type: "value" },
    series: [{ name: "Doanh thu", type: "bar", barWidth: "60%", data: mockData.revenue[period]?.data || [], itemStyle: { color: "#3b82f6" } }],
  })

  // Chart options for health
  const getHealthChartOptions = (period, patient) => ({
    tooltip: { trigger: "axis" },
    legend: { data: ["Huyết áp", "Nhịp tim", "Đường huyết"] },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: patient[period]?.xAxisData || [] },
    yAxis: { type: "value" },
    series: [
      { name: "Huyết áp", type: "line", data: patient[period]?.bloodPressureData || [], itemStyle: { color: "#ef4444" } },
      { name: "Nhịp tim", type: "line", data: patient[period]?.heartRateData || [], itemStyle: { color: "#8b5cf6" } },
      { name: "Đường huyết", type: "line", data: patient[period]?.bloodSugarData || [], itemStyle: { color: "#10b981" } },
    ],
  })

  useEffect(() => {
    // Initialize revenue chart
    const revenueDom = document.getElementById("revenue-chart")
    if (revenueDom) {
      if (!revenueChartRef.current) {
        revenueChartRef.current = echarts.init(revenueDom)
        window.addEventListener("resize", () => revenueChartRef.current.resize())
      }
      revenueChartRef.current.setOption(getRevenueChartOptions(revenuePeriod))
    }

    // Initialize health chart
    const healthDom = document.getElementById("health-chart")
    if (healthDom) {
      if (!healthChartRef.current) {
        healthChartRef.current = echarts.init(healthDom)
        window.addEventListener("resize", () => healthChartRef.current.resize())
      }
      healthChartRef.current.setOption(getHealthChartOptions(healthPeriod, selectedPatient))
    }

    // Cleanup
    return () => {
      if (revenueChartRef.current) {
        window.removeEventListener("resize", revenueChartRef.current.resize)
        revenueChartRef.current.dispose()
        revenueChartRef.current = null
      }
      if (healthChartRef.current) {
        window.removeEventListener("resize", healthChartRef.current.resize)
        healthChartRef.current.dispose()
        healthChartRef.current = null
      }
    }
  }, [revenuePeriod, healthPeriod, selectedPatient])

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Tổng quan</h3>
      <Row className="mb-4">
        {[
          { icon: "user-plus", title: "Bệnh nhân mới", value: mockData.summary.newPatients, change: mockData.summary.newPatientsChange, color: "primary" },
          { icon: "calendar-check", title: "Cuộc hẹn hôm nay", value: appointmentToday, change: `${appointmentNext} cuộc hẹn sắp tới`, color: "warning" },
          { icon: "money-bill-wave", title: "Doanh thu tháng", value: mockData.summary.monthlyRevenue, change: mockData.summary.monthlyRevenueChange, color: "success" },
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
        ))}
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
                <h5>Chỉ số sức khỏe: {selectedPatient.name}</h5>
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
                    {mockData.health.patients.map((patient, index) => (
                      <tr
                        key={index}
                        onClick={() => setSelectedPatient(patient)}
                        style={{ cursor: "pointer", backgroundColor: patient.name === selectedPatient.name ? "#f0f4ff" : "transparent" }}
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
                          <div>Huyết áp: <span className="text-danger fw-bold">{patient.bloodPressure}</span></div>
                          <div>Nhịp tim: {patient.heartRate} bpm</div>
                        </td>
                        <td><Badge bg="danger" pill>{patient.warning}</Badge></td>
                        <td>
                          <a href={`tel:${patient.phone}`} className="btn btn-link text-primary me-2 p-0" onClick={(e) => e.stopPropagation()}>
                            <i className="fas fa-phone-alt"></i>
                          </a>
                          <a href={`sms:${patient.phone}`} className="btn btn-link text-primary p-0" onClick={(e) => e.stopPropagation()}>
                            <i className="fas fa-comment-medical"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default OverviewTab