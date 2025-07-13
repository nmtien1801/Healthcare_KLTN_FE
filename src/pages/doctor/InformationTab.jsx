"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import ProfileHeader from "../../components/doctor/information/ProfileHeader"
import InfoSection from "../../components/doctor/information/InfoSection"
import SummaryCards from "../../components/doctor/information/SummaryCards"
import { Button } from "../../components/doctor/common-ui-components" // Reusing Button from PatientTab

const initialDoctorData = {
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  name: "BS. Nguyễn Văn An",
  specialty: "Bác sĩ chuyên khoa Tim mạch",
  hospital: "Bệnh viện Đa khoa Trung ương",
  basicInfo: {
    fullName: "BS. Nguyễn Văn An",
    email: "nguyenvanan@healthcare.vn",
    phone: "0912345678",
    dob: "15/08/1980",
  },
  professionalInfo: {
    specialty: "Tim mạch",
    hospital: "Bệnh viện Đa khoa Trung ương",
    experienceYears: "15 năm",
    license: "00123456/BYT-CCHN",
  },
}

export default function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(initialDoctorData)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (updatedData) => {
    setDoctorData((prevData) => ({
      ...prevData,
      basicInfo: {
        ...prevData.basicInfo,
        fullName: updatedData.fullName,
        email: updatedData.email,
        phone: updatedData.phone,
        dob: updatedData.dob,
      },
      professionalInfo: {
        ...prevData.professionalInfo,
        specialty: updatedData.specialty,
        hospital: updatedData.hospital,
        experienceYears: updatedData.experienceYears,
        license: updatedData.license,
      },
      name: updatedData.fullName, // Update main name
      specialty: `Bác sĩ chuyên khoa ${updatedData.specialty}`, // Update main specialty
      hospital: updatedData.hospital, // Update main hospital
    }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và chuyên môn của bạn</p>
        </div>

        {/* Profile Header Section */}
        <ProfileHeader doctor={doctorData} />

        {/* Info Section (Basic & Professional) */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 mt-6">
          <InfoSection doctor={doctorData} isEditing={isEditing} onSave={handleSave} onCancel={handleCancel} />
          {!isEditing && (
            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" onClick={() => setIsEditing(true)} className="d-flex align-items-center gap-2">
                <Edit size={16} />
                Chỉnh sửa thông tin
              </Button>
            </div>
          )}
        </div>

        {/* Summary Cards Section */}
        <SummaryCards doctor={doctorData} />
      </div>
    </div>
  )
}
