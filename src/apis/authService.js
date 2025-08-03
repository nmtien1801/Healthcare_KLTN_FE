import customizeAxios from "../components/customizeAxios";

const loginService = (user) => {
  return customizeAxios.post("/login", { user });
};

const registerService = (formData) => {
  return customizeAxios.post("/register", {
    formData,
  });
};

const sendCodeService = (email) => {
  return customizeAxios.post("/send-code", {
    email,
  });
};

const resetPasswordService = (email, code, password) => {
  return customizeAxios.post("/reset-password", {
    email,
    code,
    password,
  });
};

const changePasswordService = (phone, currentPassword, newPassword) => {
  return customizeAxios.post("/changePassword", {
    phone,
    currentPassword,
    newPassword,
  });
};

const verifyEmailService = (email) => {
  return customizeAxios.post("/verifyEmail", { email });
};

const logoutUserService = () => {
  return customizeAxios.post("/logout", {
    refresh_Token: localStorage.getItem("refresh_Token"),
  });
};

const generateQRLoginService = () => {
  return customizeAxios.post("/generate-qr-login");
};

const checkQRStatusService = (sessionId) => {
  return customizeAxios.get(`/check-qr-status/${sessionId}`);
};

export {
  loginService,
  registerService,
  logoutUserService,
  sendCodeService,
  resetPasswordService,
  changePasswordService,
  verifyEmailService,
  generateQRLoginService,
  checkQRStatusService,
};
