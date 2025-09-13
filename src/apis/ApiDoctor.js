import { ApiManager } from "./ApiManager";

const ApiDoctor = {
    getDoctorInfo: () => ApiManager.get(`/doctor/info`),
    updateDoctor: (data) => ApiManager.put(`/doctor/update`, data),
};

export default ApiDoctor;
