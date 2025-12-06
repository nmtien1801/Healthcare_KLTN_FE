import React, { useState } from "react";
import { changePassword } from "../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";

const ChangePassword = ({ toggleModalChangePassword }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.auth.userInfo);

    // Toggle hiển thị mật khẩu
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi khi người dùng bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
        // Xóa lỗi server khi người dùng bắt đầu nhập lại
        if (serverError) {
            setServerError("");
        }
    };

    // Validate form
    const validateForm = () => {
        let tempErrors = {};
        if (!formData.currentPassword) {
            tempErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        }
        if (!formData.newPassword) {
            tempErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (formData.newPassword.length < 6) {
            tempErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
        }
        if (formData.newPassword !== formData.confirmPassword) {
            tempErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
        if (formData.newPassword === formData.currentPassword && formData.currentPassword) {
            tempErrors.newPassword = "Mật khẩu mới không được trùng với mật khẩu cũ";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                let res = await dispatch(changePassword({
                    email: user.email,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }));
                if (res.payload.EC !== 0) {
                    setServerError(res.payload.EM);
                } else {
                    alert('đổi mật khẩu thành công')
                    toggleModalChangePassword();
                }
            } catch (error) {
                console.error("Error changing password:", error);
                setServerError("Đã xảy ra lỗi khi đổi mật khẩu");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            `}</style>

            <div
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
                style={{
                    width: "450px",
                    zIndex: 1060,
                    animation: "slideInRight 0.3s ease-out"
                }}
            >
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between p-4 border-bottom bg-light">
                    <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <FaLock className="text-primary" size={20} />
                        </div>
                        <h5 className="mb-0 fw-bold">Đổi mật khẩu</h5>
                    </div>
                    <button
                        className="btn btn-light rounded-circle p-2"
                        onClick={toggleModalChangePassword}
                        style={{ width: "36px", height: "36px" }}
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4" style={{ height: "calc(100% - 80px)", overflowY: "auto" }}>
                    <div className="alert alert-info border-0 mb-4" style={{ backgroundColor: "#e7f3ff" }}>
                        <small>
                            <FaCheck className="me-2" />
                            Mật khẩu mới phải có ít nhất 6 ký tự và khác với mật khẩu hiện tại
                        </small>
                    </div>

                    {serverError && (
                        <div className="alert alert-danger border-0 mb-4" style={{ backgroundColor: "#f8d7da" }}>
                            <small className="text-danger">
                                <FaTimes className="me-2" />
                                {serverError}
                            </small>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Mật khẩu hiện tại */}
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="form-label fw-semibold">
                                Mật khẩu hiện tại <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    className={`form-control ps-4 pe-5 ${errors.currentPassword ? 'is-invalid' : ''}`}
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    style={{ height: "45px" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                                    onClick={() => togglePasswordVisibility('current')}
                                    tabIndex={-1}
                                >
                                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.currentPassword && (
                                    <div className="invalid-feedback">{errors.currentPassword}</div>
                                )}
                            </div>
                        </div>

                        {/* Mật khẩu mới */}
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="form-label fw-semibold">
                                Mật khẩu mới <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    className={`form-control ps-4 pe-5 ${errors.newPassword ? 'is-invalid' : ''}`}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu mới"
                                    style={{ height: "45px" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                                    onClick={() => togglePasswordVisibility('new')}
                                    tabIndex={-1}
                                >
                                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.newPassword && (
                                    <div className="invalid-feedback">{errors.newPassword}</div>
                                )}
                            </div>
                            {formData.newPassword && !errors.newPassword && (
                                <small className="text-success">
                                    <FaCheck className="me-1" />
                                    Mật khẩu hợp lệ
                                </small>
                            )}
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                Xác nhận mật khẩu mới <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    className={`form-control ps-4 pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu mới"
                                    style={{ height: "45px" }}
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    tabIndex={-1}
                                >
                                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.confirmPassword && (
                                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                                )}
                            </div>
                            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                                <small className="text-success">
                                    <FaCheck className="me-1" />
                                    Mật khẩu khớp
                                </small>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="d-flex gap-2 mt-5">
                            <button
                                type="button"
                                className="btn btn-outline-secondary flex-fill"
                                onClick={toggleModalChangePassword}
                                disabled={isLoading}
                                style={{ height: "45px" }}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-fill"
                                disabled={isLoading}
                                style={{ height: "45px" }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="me-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;