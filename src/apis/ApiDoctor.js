import { ApiManager } from "./ApiManager";

const ApiDoctor = {
    getDoctorInfo: () => ApiManager.get(`/doctor/info`),
    updateDoctor: (data) => ApiManager.put(`/doctor/update`, data),
    getAppointments: () => ApiManager.get(`/doctor/appointment/all`),
    getAppointmentsToday: () => ApiManager.get(`/doctor/appointment/today`),
};

export default ApiDoctor;
