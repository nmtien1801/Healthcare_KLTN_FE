import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { Card, Button, Table, Row, Col, Badge } from "react-bootstrap";
import ApiDoctor from "../../apis/ApiDoctor";
const classifyBloodSugar = (value, type) => {
  if (value == null) return "Không có dữ liệu";

  if (type === "before") {
    if (value < 3.9) return "<3,9";
    if (value >= 3.9 && value <= 5.6) return "3,9 – 5,6";
    if (value > 5.6 && value <= 6.9) return "5,7 – 6,9";
    if (value >= 7) return ">=7";
  }

  if (type === "after") {
    if (value < 3.9) return "<3,9";
    if (value >= 3.9 && value <= 7.7) return "3,9 – 7,7";
    if (value > 7.7 && value <= 11) return "7,8 – 11";
    if (value > 11) return ">11";
  }

  return "Giá trị không hợp lệ";
};

const OverviewTab = () => {
  const [revenuePeriod, setRevenuePeriod] = useState("week");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [healthPeriod, setHealthPeriod] = useState("week");
  const [summary, setSummary] = useState({
    newPatients: 0,
    newPatientsChange: "",
    appointmentsToday: 0,
    upcomingAppointments: 0,
    monthlyRevenue: "0 đ",
    monthlyRevenueChange: "",
  });
  const [revenueData, setRevenueData] = useState({
    xAxisData: [],
    seriesData: [],
    totalRevenue: 0,
    currency: "VND",
  });
  const [healthData, setHealthData] = useState({});
  const [bloodSugarRaw, setBloodSugarRaw] = useState([]);

  const healthChartRef = useRef(null);
  const bloodSugarChartRef = useRef(null);

  const defaultFont = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: "#212529",
    fontSize: 13,
  };


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await ApiDoctor.getSummary();
        setSummary(res || summary);
      } catch (err) {
        console.error("Lỗi fetch summary:", err);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await ApiDoctor.getPatientsAttention();
        const patientsData = Array.isArray(res) ? res : [];
        setPatients(patientsData);
        if (patientsData.length > 0) {
          setSelectedPatient(patientsData[0]);
        }
      } catch (err) {
        console.error("Lỗi fetch patients:", err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await ApiDoctor.getRevenueWallet(revenuePeriod); // API mới
        setRevenueData(res || { xAxisData: [], seriesData: [], totalRevenue: 0 });
      } catch (err) {
        console.error("Lỗi fetch revenue:", err);
        setRevenueData({ xAxisData: [], seriesData: [], totalRevenue: 0 });
      }
    };
    fetchRevenue();
  }, [revenuePeriod]);

  useEffect(() => {
    if (!selectedPatient?._id) return;
    const fetchHealth = async () => {
      try {
        const res = await ApiDoctor.getPatientHealth(selectedPatient._id, healthPeriod);
        setHealthData(res || {});
      } catch (err) {
        console.error("Lỗi fetch health:", err);
      }
    };
    fetchHealth();
  }, [selectedPatient, healthPeriod]);

  useEffect(() => {
    if (!selectedPatient?.userId) {
      setBloodSugarRaw([]);
      return;
    }

    const fetchBloodSugar = async () => {
      try {
        const [fastingRes, postMealRes] = await Promise.all([
          ApiDoctor.fetchPatientBloodSugar(selectedPatient.userId, "fasting", 7),
          ApiDoctor.fetchPatientBloodSugar(selectedPatient.userId, "postMeal", 7),
        ]);

        const fastingData = fastingRes?.DT?.bloodSugarData || [];
        const postMealData = postMealRes?.DT?.bloodSugarData || [];

        setBloodSugarRaw([...fastingData, ...postMealData]);
      } catch (err) {
        console.error("Lỗi lấy đường huyết:", err);
        setBloodSugarRaw([]);
      }
    };

    fetchBloodSugar();
  }, [selectedPatient]);

  const processBloodSugarForChart = (data = []) => {
    const daily = {};

    data.forEach(({ value, type, time }) => {
      if (!time || typeof value !== "number") return;
      const dateKey = new Date(time).toISOString().split("T")[0];
      if (!daily[dateKey]) daily[dateKey] = { fasting: [], postMeal: [] };
      if (type === "fasting") daily[dateKey].fasting.push(value);
      if (type === "postMeal") daily[dateKey].postMeal.push(value);
    });

    const sortedKeys = Object.keys(daily).sort().slice(-7);

    const dates = sortedKeys.map((k) => {
      const d = new Date(k);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    });

    const avg = (arr) =>
      arr.length
        ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1))
        : null;

    return {
      dates,
      fastingData: sortedKeys.map((k) => avg(daily[k].fasting)),
      postMealData: sortedKeys.map((k) => avg(daily[k].postMeal)),
    };
  };

  useEffect(() => {
    if (!healthChartRef.current) return;

    const myChart = echarts.init(healthChartRef.current);
    const option = {
      title: {
        text: `Biểu đồ sức khỏe - ${selectedPatient?.name || ""}`,
        left: "center",
        textStyle: { ...defaultFont, fontWeight: 500, fontSize: 14 },
      },
      tooltip: { trigger: "axis", textStyle: defaultFont },
      legend: { top: "10%", data: ["Huyết áp", "Nhịp tim", "Đường huyết"], textStyle: defaultFont },
      xAxis: { type: "category", data: healthData?.xAxisData || [], axisLabel: defaultFont },
      yAxis: { type: "value", axisLabel: defaultFont },
      series: [
        { name: "Huyết áp", type: "line", smooth: true, data: healthData?.bloodPressureData || [] },
        { name: "Nhịp tim", type: "line", smooth: true, data: healthData?.heartRateData || [] },
        { name: "Đường huyết", type: "line", smooth: true, data: healthData?.bloodSugarData || [] },
      ],
      grid: { left: "10%", right: "10%", bottom: "15%" },
    };

    myChart.setOption(option);
    return () => myChart.dispose();
  }, [healthData, selectedPatient]);

  useEffect(() => {
    if (!bloodSugarChartRef.current || !bloodSugarRaw.length) return;

    const myChart = echarts.init(bloodSugarChartRef.current);
    const { dates, fastingData, postMealData } = processBloodSugarForChart(bloodSugarRaw);

    const option = {
      title: {
        text: "Đường huyết 7 ngày gần nhất (mmol/L)",
        left: "center",
        textStyle: { ...defaultFont, fontWeight: 500, fontSize: 14 },
      },
      tooltip: {
        trigger: "axis",
        textStyle: defaultFont,
        formatter: (params) => {
          let result = params[0].axisValue + "<br/>";
          params.forEach((p) => {
            if (p.value !== null) {
              const type = p.seriesName === "Lúc đói" ? "before" : "after";
              const level = classifyBloodSugar(p.value, type);
              result += `${p.marker} ${p.seriesName}: <b>${p.value} mmol/L</b> → <span style="color:#ef4444">${level}</span><br/>`;
            }
          });
          return result;
        },
      },
      legend: { top: "10%", data: ["Lúc đói", "Sau ăn"], textStyle: defaultFont },
      xAxis: { type: "category", data: dates, axisLabel: defaultFont },
      yAxis: { type: "value", min: 3, max: 13, axisLabel: { formatter: "{value} mmol/L", ...defaultFont } },
      series: [
        {
          name: "Lúc đói",
          data: fastingData,
          type: "line",
          smooth: true,
          lineStyle: { color: "#3b82f6" },
          itemStyle: { color: "#3b82f6" },
          connectNulls: false,
          markLine: {
            data: [
              { yAxis: 5.6, lineStyle: { color: "#10b981" }, label: { formatter: "Trước ăn", ...defaultFont } },
              { yAxis: 7.0, lineStyle: { color: "#ef4444" }, label: { formatter: "Ngưỡng cao (đói)", ...defaultFont } },
            ],
          },
        },
        {
          name: "Sau ăn",
          data: postMealData,
          type: "line",
          smooth: true,
          lineStyle: { color: "#f59e0b" },
          itemStyle: { color: "#f59e0b" },
          connectNulls: false,
          markLine: {
            data: [
              { yAxis: 7.8, lineStyle: { color: "#10b981" }, label: { formatter: "Sau ăn", ...defaultFont } },
              { yAxis: 10, lineStyle: { color: "#ef4444" }, label: { formatter: "Ngưỡng cao (sau ăn)", ...defaultFont } },
            ],
          },
        },
      ],
      grid: { left: "10%", right: "10%", bottom: "15%" },
    };

    myChart.setOption(option);
    return () => myChart.dispose();
  }, [bloodSugarRaw]);

  // ================= UI =================
  return (
    <div className="m-2">
      <h3 className="mb-4">Tổng quan</h3>


      <Row className="mb-4">
        {[
          { icon: "user-plus", title: "Bệnh nhân mới", value: summary.newPatients, change: summary.newPatientsChange, color: "primary" },
          { icon: "calendar-check", title: "Cuộc hẹn hôm nay", value: summary.appointmentsToday, change: `${summary.upcomingAppointments} sắp tới`, color: "warning" },
          { icon: "money-bill-wave", title: "Doanh thu tháng", value: summary.monthlyRevenue, change: summary.monthlyRevenueChange, color: "success" },
        ].map((item, i) => (
          <Col md={4} key={i}>
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
          <div className="d-flex justify-content-between mb-2">
            <h5>Bệnh nhân cần chú ý</h5>
            <Button size="sm" variant="link" onClick={() => setShowAllPatients(!showAllPatients)}>
              {showAllPatients ? "Thu gọn" : "Xem tất cả"}
            </Button>
          </div>
          <Table hover responsive className="table-borderless" style={{ borderCollapse: "separate", borderSpacing: "0 0.5rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "16px", color: "#555" }}>Bệnh nhân</th>
                <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "16px", color: "#555" }}>Chỉ số sức khỏe</th>
                <th style={{ textAlign: "center", padding: "12px 20px", fontSize: "16px", color: "#555" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {(showAllPatients ? patients : patients.slice(0, 5)).map((p, i) => (
                <tr
                  key={p._id || i}
                  onClick={() => setSelectedPatient(p)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: selectedPatient?._id === p._id ? "#e8f0fe" : "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    display: "table-row",
                  }}
                >
                  <td style={{ padding: "12px 20px", fontWeight: 600, color: "#333" }}>{p.name}</td>
                  <td style={{ padding: "12px 20px", color: "#555" }}>
                    Nhịp tim: <strong>{p.heartRate || "-"}</strong> | Huyết áp: <strong>{p.bloodPressure || "-"}</strong>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 20px" }}>
                    <Badge
                      bg={p.warning ? "danger" : "success"}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}
                    >
                      {p.warning || "Bình thường"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>


        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <h5>Chỉ số sức khỏe</h5>
                <div>
                  {["week", "month", "year"].map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={healthPeriod === p ? "primary" : "outline-secondary"}
                      className="me-1"
                      onClick={() => setHealthPeriod(p)}
                    >
                      {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
                    </Button>
                  ))}
                </div>
              </div>
              <div ref={healthChartRef} style={{ height: 300 }} />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5>Đường huyết 7 ngày</h5>
              <div ref={bloodSugarChartRef} style={{ height: 300 }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewTab;
