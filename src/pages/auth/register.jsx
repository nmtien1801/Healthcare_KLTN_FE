;

import { useState, useEffect } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, verifyEmail } from "../../redux/authSlice";
import { auth, provider } from '../../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0); // đếm ngược 60s 
  const [code, setCode] = useState({}) // mã xác thực trong 60s
  const [startTime, setStartTime] = useState(null); // thời điểm bắt đầu đếm ngược
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    captcha: "",
    gender: "",
    dob: '',
    avatar: '',
    code: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    let timer;
    if (startTime && countdown > 0) {
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, 60 - elapsed);
        setCountdown(remaining);

        if (remaining === 0) {
          setStartTime(null);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // kiểm tra tài khoản 10 ký tự bất kì
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      setErrorMessage("Số điện thoại phải bao gồm đúng 10 ký tự!");
      return;
    }

    // Kiểm tra mật khẩu > 6 ký tự
    if (formData.password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra mật khẩu và mật khẩu nhập lại có khớp không
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu và mật khẩu nhập lại không khớp!");
      return;
    }

    // kiểm tra code verify email
    let currentTime = Date.now();

    if (currentTime - code.timestamp > 60000) {
      setErrorMessage("❌ Mã đã hết hạn sau 60s");
    } else if (+formData.captcha !== +code.code) {
      setErrorMessage("❌ Mã không đúng");
    } else {
      // Gửi thông tin đăng ký đi firebase
      let result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (result.user) {
        // Gửi thông tin đăng ký đi mongo
        // Chuyển đổi dob thành string trước khi gửi
        const formDataToSend = {
          ...formData,
          uid: result.user.uid
        };
        let res = await dispatch(register(formDataToSend));
        if (res.payload.EC === 0) {
          navigation.navigate("Login");
        } else {
          setErrorMessage(res.payload.EM);
        }
      }
    }
  };

  const handleVerifyEmail = async () => {
    // Gửi mã xác minh qua email
    let res = await dispatch(verifyEmail(formData.email))
    if (res.payload.EC === 0) {
      setCode(res.payload.DT)
    }

    // Bắt đầu đếm ngược
    setCountdown(60);
    setStartTime(Date.now());
  }

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
            <h2 className="fs-5 fw-medium text-dark">Đăng ký với mật khẩu</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tên người dùng"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number Input */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số điện thoại"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* address Input */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
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
                  required
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

            {/* Confirm Password Input */}
            <div className="mb-3 position-relative">
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Captcha Input */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mã xác thực email"
                  name="captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleVerifyEmail}
                  disabled={countdown > 0}
                >
                  {countdown > 0 ? `${countdown}s` : <RefreshCw size={20} />}
                </button>
              </div>
            </div>

            {/* gender Input */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* dob Input */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Ngày sinh"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-danger text-center mb-3" style={{ fontSize: "14px" }}>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mb-3"
              style={{ backgroundColor: "#2962ff" }}
            >
              Đăng ký
            </button>

            {/* Forgot Password Link */}
            <div className="text-center mb-3">
              <a
                href="/login"
                className="text-decoration-none"
                style={{ color: "#2962ff" }}
              >
                Đăng nhập
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
