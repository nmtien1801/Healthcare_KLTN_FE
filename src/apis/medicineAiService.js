import customizeAxios from "../components/customizeAxios";

const getTrendMedicine = ({ age, gender, BMI, HbA1c, bloodSugar }) => {
  return customizeAxios.post("/trendMedicine", {
    age,
    gender,
    BMI,
    HbA1c,
    bloodSugar
  });
};

export {
  getTrendMedicine
};
