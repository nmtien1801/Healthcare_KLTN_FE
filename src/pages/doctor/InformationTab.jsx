import { useState } from "react";
import { Edit } from "lucide-react";

// Mock initial doctor data
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
};

const ProfileHeader = ({ doctor }) => (
  <div className="bg-white rounded shadow-sm border p-3 text-center mb-3">
    <img
      src={doctor.avatar}
      alt="Bác sĩ"
      className="rounded-circle mb-2"
      width={80}
      height={80}
      // Added onerror to handle broken image links gracefully
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/80x80/cccccc/ffffff?text=DR`;
      }}
    />
    <h5 className="mb-1">{doctor.name}</h5>
    <div className="text-muted small">{doctor.specialty}</div>
    <div className="text-muted small">{doctor.hospital}</div>
  </div>
);


const InfoSection = ({ doctor, isEditing, onSave, onCancel }) => {
  // Local state for the form data when editing
  const [formData, setFormData] = useState({
    fullName: doctor.basicInfo.fullName,
    email: doctor.basicInfo.email,
    phone: doctor.basicInfo.phone,
    dob: doctor.basicInfo.dob,
    specialty: doctor.professionalInfo.specialty,
    hospital: doctor.professionalInfo.hospital,
    experienceYears: doctor.professionalInfo.experienceYears,
    license: doctor.professionalInfo.license,
  });

  // Handles input changes and updates the local form data state.
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  // Calls the onSave prop with the current form data.
  const handleSubmit = () => onSave(formData);

  return (
    <div className="bg-white rounded shadow-sm border p-3 mb-3">
      <h5 className="mb-3">Thông tin cá nhân & chuyên môn</h5>
      {isEditing ? (
        // Render editable form fields when in editing mode
        <div className="row">
          <div className="col-md-6">
            {["fullName", "email", "phone", "dob"].map((field, idx) => (
              <div className="mb-2" key={idx}>
                <label className="form-label small">
                  {field === "fullName"
                    ? "Họ và tên"
                    : field === "email"
                      ? "Email"
                      : field === "phone"
                        ? "Số điện thoại"
                        : "Ngày sinh"}
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <div className="col-md-6">
            {["specialty", "hospital", "experienceYears", "license"].map(
              (field, idx) => (
                <div className="mb-2" key={idx}>
                  <label className="form-label small">
                    {field === "specialty"
                      ? "Chuyên khoa"
                      : field === "hospital"
                        ? "Bệnh viện"
                        : field === "experienceYears"
                          ? "Số năm kinh nghiệm"
                          : "Số giấy phép"}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={onCancel}
            >
              Hủy
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
              Lưu
            </button>
          </div>
        </div>
      ) : (
        // Render static display of information when not editing
        <div className="row small">
          <div className="col-md-6">
            <p>
              <strong>Họ và tên:</strong> {doctor.basicInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {doctor.basicInfo.email}
            </p>
            <p>
              <strong>SĐT:</strong> {doctor.basicInfo.phone}
            </p>
            <p>
              <strong>Ngày sinh:</strong> {doctor.basicInfo.dob}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Chuyên khoa:</strong> {doctor.professionalInfo.specialty}
            </p>
            <p>
              <strong>Bệnh viện:</strong> {doctor.professionalInfo.hospital}
            </p>
            <p>
              <strong>Kinh nghiệm:</strong>{" "}
              {doctor.professionalInfo.experienceYears}
            </p>
            <p>
              <strong>Giấy phép:</strong> {doctor.professionalInfo.license}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


const SummaryCards = ({ doctor }) => (
  <div className="row g-2">
    {[
      {
        icon: "user-md",
        title: "Chuyên khoa",
        value: doctor.professionalInfo.specialty,
        color: "primary",
      },
      {
        icon: "hospital",
        title: "Bệnh viện",
        value: doctor.professionalInfo.hospital,
        color: "success",
      },
      {
        icon: "briefcase",
        title: "Kinh nghiệm",
        value: doctor.professionalInfo.experienceYears,
        color: "warning",
      },
    ].map((item, idx) => (
      <div className="col-md-4" key={idx}>
        <div className="bg-white rounded shadow-sm border p-2 d-flex align-items-center">
          <div
            className={`bg-${item.color} bg-opacity-10 rounded-circle p-2 me-2`}
          >
            {/* Font Awesome icon for visual representation */}
            <i className={`fas fa-${item.icon} text-${item.color} fs-6`}></i>
          </div>
          <div>
            <div className="text-muted small">{item.title}</div>
            <div className="fw-semibold small">{item.value}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);


export default function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(initialDoctorData);
  const [isEditing, setIsEditing] = useState(false);


  const handleSave = (updatedData) => {
    setDoctorData((prev) => ({
      ...prev,
      basicInfo: {
        fullName: updatedData.fullName,
        email: updatedData.email,
        phone: updatedData.phone,
        dob: updatedData.dob,
      },
      professionalInfo: {
        specialty: updatedData.specialty,
        hospital: updatedData.hospital,
        experienceYears: updatedData.experienceYears,
        license: updatedData.license,
      },
      // Update top-level derived fields based on the new data
      name: updatedData.fullName,
      specialty: `Bác sĩ chuyên khoa ${updatedData.specialty}`,
      hospital: updatedData.hospital,
    }));
    setIsEditing(false);
  };

  return (

    <div className="w-full h-screen bg-light flex flex-col items-center overflow-hidden">

      <div className="container py-3 flex-grow-1 flex flex-col justify-start">
        <h3 className="mb-3">Thông tin cá nhân</h3>

        <ProfileHeader doctor={doctorData} />

        <InfoSection
          doctor={doctorData}
          isEditing={isEditing}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />

        {/* Display the Edit button only when not in editing mode */}
        {!isEditing && (
          <div className="flex justify-end mb-3">
            <button
              className="btn btn-primary btn-sm flex items-center gap-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={14} /> Chỉnh sửa
            </button>
          </div>
        )}

        <SummaryCards doctor={doctorData} />
      </div>
    </div>
  );
}
