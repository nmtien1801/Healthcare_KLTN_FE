import customizeAxios from "../components/customizeAxios";

const fetchBloodSugarService = (userId, type, days) => {
  return customizeAxios.post("/fetchBloodSugar", { userId, type, days });
};

export {
  fetchBloodSugarService
};
