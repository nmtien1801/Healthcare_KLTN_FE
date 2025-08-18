import customizeAxios from "../components/customizeAxios";

const suggestFoods = (min, max, trend, stdDev, currentCalo) => {
  return customizeAxios.post("/trendFood", {
    min,
    max,
    trend,
    stdDev,
    currentCalo,
  });
};

const GetCaloFoodService = (userId) => {
  return customizeAxios.post("/GetCaloFood",{userId});
};

export { suggestFoods, GetCaloFoodService };
