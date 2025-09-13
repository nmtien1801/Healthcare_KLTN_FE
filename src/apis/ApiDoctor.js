import { ApiManager } from "./ApiManager";

const ApiDoctor = {
    getDoctorInfo: () => ApiManager.get(`/doctor/info`),
};

export default ApiDoctor;
