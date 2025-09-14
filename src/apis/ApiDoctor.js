import { ApiManager } from "./ApiManager";

const ApiDoctor = {
    getDoctorInfo: () => ApiManager.get(`/doctor/info`),
    updateDoctor: (data) => ApiManager.put(`/doctor/update`, data),
    getAppointments: () => ApiManager.get(`/doctor/appointment/upcoming`),
    getAppointmentsToday: () => ApiManager.get(`/doctor/appointment/today`),
    updateAppointment: (id, data) => ApiManager.put(`/doctor/appointment/${id}`, data),
    getAppointmentById: (id) => ApiManager.get(`/doctor/appointment/${id}`),
    deleteAppointment: (id) => ApiManager.delete(`/doctor/appointment/${id}`),

};

export default ApiDoctor;
