// src/api/overviewApi.js
import axios from "axios";

// Lấy token từ localStorage
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const token = userInfo?.token || localStorage.getItem("access_Token"); // fallback nếu dùng Firebase token

// Tạo axios instance với Authorization header
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/overview",
    headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
});

// API lấy summary tổng quan
export const getSummary = async () => {
    try {
        const res = await axiosInstance.get("/summary");
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tải summary:", err);
        throw err;
    }
};

// API lấy doanh thu theo tuần/tháng/năm
export const getRevenue = async (period = "week") => {
    try {
        const res = await axiosInstance.get("/revenue", { params: { period } });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tải revenue:", err);
        throw err;
    }
};

// API lấy danh sách bệnh nhân cần chú ý
export const getCriticalPatients = async () => {
    try {
        const res = await axiosInstance.get("/critical-patients");
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tải critical patients:", err);
        throw err;
    }
};

// API lấy chỉ số sức khỏe của bệnh nhân theo patientId
export const getPatientHealth = async (patientId, period = "week") => {
    try {
        const res = await axiosInstance.get(`/patient/${patientId}/health`, { params: { period } });
        return res.data;
    } catch (err) {
        console.error(`Lỗi khi tải health của bệnh nhân ${patientId}:`, err);
        throw err;
    }
};
