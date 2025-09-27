import customizeAxios from "../components/customizeAxios";

const getBalanceService = (userId) => {
    return customizeAxios.get(`/wallet/balance/${userId}`,{userId: userId});
};

const depositService = (userId, amount) => {
    return customizeAxios.post(`/wallet/deposit`,{ userId, amount});
};

export {
    getBalanceService,
    depositService,
};
