import { ApiManager } from "./ApiManager";

const ApiBooking = {
    getUpcomingAppointments: () => ApiManager.get("/booking/upcoming"),
    cancelBooking: (appointmentId) =>
        ApiManager.put(`/booking/cancel/${appointmentId}`),
    getDoctorsByDate: (date) =>
        ApiManager.get("/booking/doctorByDate", { params: { date } }),
    getDoctorShifts: (doctorId, date) =>
        ApiManager.get("/booking/doctorShifts", { params: { doctorId, date } }),
    getDoctorWorkHours: (doctorId) =>
        ApiManager.get(`/booking/workhours/${doctorId}`),
    bookAppointment: (payload) => ApiManager.post("/booking/book", payload),
};

export default ApiBooking;
