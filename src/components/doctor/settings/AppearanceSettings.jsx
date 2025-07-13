"use client"

import { Moon } from "lucide-react"
import { Select } from "../common-ui-components" // Reusing Select

// Custom Toggle Switch Component (duplicated for self-containment, ideally shared)
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

export default function AppearanceSettings({ appearance, onToggle, onLanguageChange }) {
    return (
        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                    <Moon size={20} className="text-purple-600" />
                    Giao diện
                </h5>
                <p className="text-muted small mb-4">Tùy chỉnh giao diện ứng dụng</p>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 className="fw-medium text-dark mb-1">Chế độ tối</h6>
                        <p className="text-muted small mb-0">Thay đổi giao diện sang chế độ tối</p>
                    </div>
                    <ToggleSwitch checked={appearance.darkMode} onChange={(val) => onToggle("darkMode", val)} />
                </div>

                <div className="mb-3">
                    <h6 className="fw-medium text-dark mb-1">Ngôn ngữ</h6>
                    <p className="text-muted small mb-2">Thay đổi ngôn ngữ hiển thị</p>
                    <Select value={appearance.language} onChange={onLanguageChange} className="w-100">
                        <option value="Tiếng Việt">Tiếng Việt</option>
                        <option value="English">English</option>
                    </Select>
                </div>
            </div>
        </div>
    )
}
