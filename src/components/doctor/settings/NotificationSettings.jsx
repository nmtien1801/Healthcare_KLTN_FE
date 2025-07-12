"use client"

import { Bell } from "lucide-react"

// Custom Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }) => {
    return (
        <label className="form-check form-switch mb-0">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: "3rem", height: "1.5rem" }}
            />
        </label>
    )
}

export default function NotificationSettings({ notifications, onToggle }) {
    return (
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                    <Bell size={20} className="text-primary" />
                    Thông báo
                </h5>
                <p className="text-muted small mb-4">Quản lý thông báo từ ứng dụng</p>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 className="fw-medium text-dark mb-1">Thông báo tổng quát</h6>
                        <p className="text-muted small mb-0">Nhận tất cả thông báo từ ứng dụng</p>
                    </div>
                    <ToggleSwitch checked={notifications.general} onChange={(val) => onToggle("general", val)} />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 className="fw-medium text-dark mb-1">Thông báo email</h6>
                        <p className="text-muted small mb-0">Nhận thông báo qua email</p>
                    </div>
                    <ToggleSwitch checked={notifications.email} onChange={(val) => onToggle("email", val)} />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="fw-medium text-dark mb-1">Thông báo SMS</h6>
                        <p className="text-muted small mb-0">Nhận thông báo qua tin nhắn</p>
                    </div>
                    <ToggleSwitch checked={notifications.sms} onChange={(val) => onToggle("sms", val)} />
                </div>
            </div>
        </div>
    )
}
