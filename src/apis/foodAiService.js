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
  return customizeAxios.post("/GetCaloFood", { userId });
};

const updateMenuFoodService = (menuFoodId, userId) => {
  return customizeAxios.post("/updateMenuFood", { menuFoodId, userId });
};

const getMenuFoodService = () => {
  return customizeAxios.get("/getMenuFood");
};

export {
  suggestFoods,
  GetCaloFoodService,
  updateMenuFoodService,
  getMenuFoodService,
};
