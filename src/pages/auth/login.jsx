;

import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Login } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../../../firebase';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEmailAndPasswordLogin = async (e) => {
    e.preventDefault();
    try {
      let result = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      let user = result.user;
      if (user) {
        let res = await dispatch(Login({ user }));

        if (res.payload.EC === 0) {
          if (res.payload.DT.role === "doctor") {
            navigate("/overviewTab");

          } else if (res.payload.DT.role === "patient") {
            navigate("/home");
          }
          localStorage.setItem("access_Token", user.accessToken);
          localStorage.setItem("userInfo", JSON.stringify(res.payload.DT));
        }
      }
    } catch (error) {
      console.error(`Đăng nhập thất bại: ${error.code} - ${error.message}`);
      // Xử lý lỗi cụ thể
      switch (error.code) {
        case 'auth/invalid-credential':
          alert('Email hoặc mật khẩu không đúng, hoặc tài khoản này đã bị xoá mật khẩu. Nếu trước đây bạn đăng nhập Google, hãy dùng nút "Đăng nhập Google" hoặc đặt lại mật khẩu.');
          break;
        case 'auth/user-not-found':
          alert('Không tìm thấy tài khoản. Vui lòng đăng ký.');
          break;
        case 'auth/wrong-password':
          alert('Sai mật khẩu.');
          break;
        default:
          alert(`Lỗi không xác định: ${error.message}`);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      let result = await signInWithPopup(auth, provider);

      let user = result.user;
      if (user) {
        let res = await dispatch(Login({ user }));
        if (res.payload.EC === 0) {
          if (res.payload.DT.role === "doctor") {
            navigate("/overviewTab");

          } else if (res.payload.DT.role === "patient") {
            navigate("/home");
          }
          localStorage.setItem("access_Token", user.accessToken);
          localStorage.setItem("userInfo", JSON.stringify(res.payload.DT));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-4">
      <div
        className="card shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body p-4">
          {/* Logo and Title */}
          <div className="text-center mb-4">
            <h1 className="display-6 text-primary fw-bold mb-3">DiaTech</h1>
            <h2 className="fs-5 fw-medium text-dark">Đăng nhập với mật khẩu</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleEmailAndPasswordLogin}>
            {/* Phone Number Input */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3 position-relative">
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mb-3"
              style={{ backgroundColor: "#2962ff" }}
            >
              Đăng nhập
            </button>

            {/* Google Login Button */}
            <div className="text-center mb-3">
              <button
                type="button"
                className="btn btn-outline-danger w-100 py-2"
                onClick={handleGoogleLogin}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
                />
                Đăng nhập với Google
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mb-3">
              <a
                href="/forgot-password"
                className="text-decoration-none"
                style={{ color: "#2962ff" }}
              >
                Quên mật khẩu?
              </a>
            </div>
          </form>

          {/* QR Code Login Link */}
          <div className="text-center mb-3">
            <a
              href="/login-qr"
              className="text-decoration-none"
              style={{ color: "#2962ff" }}
            >
              Đăng nhập qua mã QR
            </a>
          </div>

          <div className="text-center">
            <a
              href="/register"
              className="text-decoration-none"
              style={{ color: "#2962ff" }}
            >
              Đăng ký
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
