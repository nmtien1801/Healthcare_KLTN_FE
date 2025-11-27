import { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { Card, Button, Table, Row, Col, Image, Badge } from "react-bootstrap";
import ApiDoctor from "../../apis/ApiDoctor";
import { formatVND } from "../../utils/format";

const RevenueTab = () => {
  const [revenuePeriod, setRevenuePeriod] = useState("week");
  const [healthPeriod, setHealthPeriod] = useState("week");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [showAllPatients, setShowAllPatients] = useState(false);

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
  const revenueChartRef = useRef(null);
  const healthChartRef = useRef(null);

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

  useEffect(() => {
    const chartDom = document.getElementById("revenue-chart");
    if (!chartDom) return;

    if (!revenueChartRef.current) {
      revenueChartRef.current = echarts.init(chartDom);
      window.addEventListener("resize", () => revenueChartRef.current?.resize());
    }

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const p = params[0];
          return `${p.name}<br/>${p.seriesName}: ${formatVND(p.value)}`;
        },
      },
      grid: { left: "3%", right: "4%", bottom: "3%", top: "60", containLabel: true },
      xAxis: {
        type: "category",
        data: revenueData.xAxisData,
        axisLabel: {
          rotate: revenuePeriod === "week" ? 0 : 45,
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: (value) => formatVND(value),
        },
      },
      series: [
        {
          name: "Doanh thu",
          type: "bar",
          barWidth: "60%",
          data: revenueData.seriesData,
          itemStyle: { color: "#3b82f6" },
          label: {
            show: true,
            position: "top",
            formatter: (p) => (p.value > 0 ? formatVND(p.value) : ""),
            fontSize: 11,
          },
        },
      ],
    };

    revenueChartRef.current.setOption(option, true);

    return () => {
      if (revenueChartRef.current) {
        window.removeEventListener("resize", revenueChartRef.current.resize);
        revenueChartRef.current.dispose();
        revenueChartRef.current = null;
      }
    };
  }, [revenueData, revenuePeriod]);

  useEffect(() => {
    const chartDom = document.getElementById("health-chart");
    if (!chartDom || !selectedPatient) return;

    if (!healthChartRef.current) {
      healthChartRef.current = echarts.init(chartDom);
      window.addEventListener("resize", () => healthChartRef.current?.resize());
    }

    const option = {
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
    };

    healthChartRef.current.setOption(option, true);

    return () => {
      if (healthChartRef.current) {
        window.removeEventListener("resize", healthChartRef.current.resize);
        healthChartRef.current.dispose();
        healthChartRef.current = null;
      }
    };
  }, [healthData, selectedPatient]);

  const DEFAULT_PATIENT_LIMIT = 5;

  return (
    <div className="m-2">
      <h4 className="mb-4">Thống kê doanh thu</h4>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0">Doanh thu {revenuePeriod === "week" ? "tuần" : revenuePeriod === "month" ? "tháng" : "năm"} này</h5>
              <p className="text-success fw-bold mb-0 fs-4">{formatVND(revenueData.totalRevenue)}</p>
            </div>
            <div>
              {["week", "month", "year"].map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={revenuePeriod === p ? "primary" : "outline-secondary"}
                  className="me-2"
                  onClick={() => setRevenuePeriod(p)}
                >
                  {p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
                </Button>
              ))}
            </div>
          </div>
          <div id="revenue-chart" style={{ height: "350px" }}></div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RevenueTab;