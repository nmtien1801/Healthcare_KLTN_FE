"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import UserProfileCard from "../../components/doctor/settings/UserProfileCard"
import NotificationSettings from "../../components/doctor/settings/NotificationSettings"
import AppearanceSettings from "../../components/doctor/settings/AppearanceSettings"
import QuickOptions from "../../components/doctor/settings/QuickOptions"
import LogoutButton from "../../components/doctor/settings/LogoutButton"

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState({
    name: "Nguyễn Văn A",
    status: "Premium User",
    email: "user@example.com",
    phone: "+84 123 456 789",
    location: "Hà Nội, Việt Nam",
    notifications: {
      general: true,
      email: true,
      sms: false,
    },
    appearance: {
      darkMode: false,
      language: "Tiếng Việt",
    },
  })

  const handleNotificationChange = (type, value) => {
    setUserSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }))
  }

  const handleAppearanceChange = (type, value) => {
    setUserSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [type]: value,
      },
    }))
  }

  const handleLogout = () => {
    alert("Đăng xuất khỏi tài khoản!")
    // Implement actual logout logic here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-6 d-flex align-items-center gap-3">
          <Settings size={32} className="text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Cài đặt</h1>
            <p className="text-gray-600">Quản lý tùy chọn và cài đặt tài khoản của bạn</p>
          </div>
        </div>

        {/* User Profile Card */}
        <UserProfileCard user={userSettings} />

        {/* Settings Sections */}
        <div className="row g-4 mb-6">
          <div className="col-12 col-md-6">
            <NotificationSettings notifications={userSettings.notifications} onToggle={handleNotificationChange} />
          </div>
          <div className="col-12 col-md-6">
            <AppearanceSettings
              appearance={userSettings.appearance}
              onToggle={handleAppearanceChange}
              onLanguageChange={(value) => handleAppearanceChange("language", value)}
            />
          </div>
        </div>

        {/* Quick Options */}
        <QuickOptions />

        {/* Logout Button */}
        <LogoutButton onLogout={handleLogout} />
      </div>
    </div>
  )
}
