import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    responseType: "json",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_Token"); // hoặc AsyncStorage nếu RN
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const ApiManager = {
    get: async (url, { params } = {}) => {
        try {
            const res = await api.get(url, { params });
            return res.data;
        } catch (error) {
            console.error(`GET ${url} failed:`, error.response?.data || error.message);
            throw error;
        }
    },
    post: async (url, data) => {
        try {
            const res = await api.post(url, data);
            return res.data;
        } catch (error) {
            console.error(`POST ${url} failed:`, error.response?.data || error.message);
            throw error;
        }
    },
    put: async (url, data) => {
        try {
            const res = await api.put(url, data);
            return res.data;
        } catch (error) {
            console.error(`PUT ${url} failed:`, error.response?.data || error.message);
            throw error;
        }
    },
    patch: async (url, data) => {
        try {
            const res = await api.patch(url, data);
            return res.data;
        } catch (error) {
            console.error(`PATCH ${url} failed:`, error.response?.data || error.message);
            throw error;
        }
    },
    delete: async (url, data) => {
        try {
            const res = await api.delete(url, { data });
            return res.data;
        } catch (error) {
            console.error(`DELETE ${url} failed:`, error.response?.data || error.message);
            throw error;
        }
    },
};

export default ApiManager;
