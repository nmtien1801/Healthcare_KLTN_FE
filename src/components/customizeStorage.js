const EXPIRE_FOOD = import.meta.env.VITE_EXPIRE_FOOD

// Lưu vào localStorage với thời gian hết hạn (ms)
export const setWithExpiry = (key, value) => {
  const now = new Date();

  const item = {
    value: value,
    expiry: now.getTime() + Number(EXPIRE_FOOD), // thời gian hết hạn (ms)
  };
  
  localStorage.setItem(key, JSON.stringify(item));
};

// Lấy ra từ localStorage, nếu hết hạn thì xoá và trả null
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    // Hết hạn -> xoá
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
};
