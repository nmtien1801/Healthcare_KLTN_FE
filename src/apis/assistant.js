import axios from "axios";

export const api = axios.create({
    baseURL: "https://ai.diatech.id.vn", //local
    // baseURL: "https://3b9b19c0e64d.ngrok-free.app", // colab
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

export const book_appointment = axios.create({
    baseURL: "https://n8n.diatech.id.vn/webhook", //local
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

export const get_advice = axios.create({
    baseURL: "https://n8n.diatech.id.vn/webhook", //local
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

