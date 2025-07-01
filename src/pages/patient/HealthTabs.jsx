import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { Info, LineChart } from "lucide-react";

const HealthTabs = () => {
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    age: 45,
    gender: "Nam",
    condition: "Tiểu đường type 2",
    doctor: "Bác sĩ Trần Thị B",
    nextAppointment: "2025-06-30",
    bloodSugar: [5.6, 6.2, 5.8, 6.5, 6.0, 5.9, 6.3],
  });


  useEffect(() => {
    const chartDom = document.getElementById("health-chart");
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const dates = [
        "17/06",
        "18/06",
        "19/06",
        "20/06",
        "21/06",
        "22/06",
        "23/06",
      ];

      const option = {
        title: {
          text: "Chỉ số đường huyết (mmol/L)",
          left: "center",
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: dates,
        },
        yAxis: {
          type: "value",
          min: 4,
          max: 8,
          axisLabel: {
            formatter: "{value} mmol/L",
          },
        },
        series: [
          {
            data: userData.bloodSugar,
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#4f46e5",
            },
            itemStyle: {
              color: "#4f46e5",
            },
            markLine: {
              data: [
                {
                  yAxis: 5.6,
                  lineStyle: { color: "#10b981" },
                  label: { formatter: "Mức bình thường" },
                },
                {
                  yAxis: 7.0,
                  lineStyle: { color: "#ef4444" },
                  label: { formatter: "Ngưỡng cao" },
                },
              ],
            },
          },
        ],
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
        },
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [userData.bloodSugar]);



  return (
   <div className="d-flex flex-column gap-4">
      {/* Tiêu đề */}
      <div className="d-flex align-items-center mb-2">
        <h2 className="fw-semibold fs-5">Theo dõi sức khỏe</h2>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white rounded shadow-sm p-4">
        <div id="health-chart" className="w-100" style={{ height: "16rem" }}></div>
      </div>

      {/* Nhập chỉ số mới */}
      <div className="bg-white rounded shadow-sm p-4">
        <h3 className="fw-semibold mb-3 fs-6">Nhập chỉ số mới</h3>
        <div className="d-flex gap-3">
          <div className="flex-grow-1">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nhập chỉ số đường huyết"
            />
          </div>
          <button className="btn btn-sm btn-primary fw-medium">
            Lưu
          </button>
        </div>
        <div className="mt-3 text-secondary small d-flex align-items-center">
          <Info size={14} className="me-1" />
          Nhập chỉ số đường huyết theo đơn vị mmol/L
        </div>
      </div>

      {/* Thông tin thêm */}
      <div className="bg-white rounded shadow-sm p-4">
        <h3 className="fw-semibold mb-3 fs-6">Thông tin thêm</h3>
        <div className="d-flex flex-column gap-3 small">
          <div className="bg-success bg-opacity-10 p-3 rounded">
            <div className="fw-medium text-success mb-1">Chỉ số bình thường</div>
            <p className="text-success mb-1">Đường huyết lúc đói: 3.9 - 5.5 mmol/L</p>
            <p className="text-success">Đường huyết sau ăn 2h: &lt; 7.8 mmol/L</p>
          </div>

          <div className="bg-warning bg-opacity-10 p-3 rounded">
            <div className="fw-medium text-warning mb-1">Chỉ số tiền tiểu đường</div>
            <p className="text-warning mb-1">Đường huyết lúc đói: 5.6 - 6.9 mmol/L</p>
            <p className="text-warning">Đường huyết sau ăn 2h: 7.8 - 11.0 mmol/L</p>
          </div>

          <div className="bg-danger bg-opacity-10 p-3 rounded">
            <div className="fw-medium text-danger mb-1">Chỉ số tiểu đường</div>
            <p className="text-danger mb-1">Đường huyết lúc đói: ≥ 7.0 mmol/L</p>
            <p className="text-danger">Đường huyết sau ăn 2h: ≥ 11.1 mmol/L</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTabs;
