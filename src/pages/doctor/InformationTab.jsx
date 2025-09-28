import { useState, useEffect } from "react";
import { Card, Button, Row, Col, Image, Spinner } from "react-bootstrap";
import { Edit } from "lucide-react";
import ApiDoctor from "../../apis/ApiDoctor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { formatDate } from "../../utils/formatDate";
// Simplified ProfileHeader component
const ProfileHeader = ({ doctor }) => (
  <Card className="shadow-sm mb-4">
    <Card.Body className="d-flex flex-column align-items-center text-center">
      <Image roundedCircle width={80} height={80} src={doctor.avatar} alt="Bác sĩ" className="mb-3" />
      <div>
        <h4 className="mb-1">{doctor.name}</h4>
        <div className="text-muted">{doctor.specialty}</div>
        <div className="text-muted">{doctor.hospital}</div>
      </div>
    </Card.Body>
  </Card>
);

// Simplified InfoSection component
const InfoSection = ({ doctor, isEditing, onSave, onCancel }) => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div>
      <h5 className="mb-3">Thông tin cá nhân và chuyên môn</h5>
      {isEditing ? (
        <Row>
          <Col md={6}>
            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Ngày sinh</label>
              <DatePicker
                selected={new Date(formData.dob.split("/").reverse().join("-"))}
                onChange={(date) => setFormData({ ...formData, dob: formatDate(date) })}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                locale={vi}
              />
            </div>

          </Col>
          <Col md={6}>
            <div className="mb-3">
              <label className="form-label">Chuyên khoa</label>
              <input
                type="text"
                className="form-control"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Bệnh viện</label>
              <input
                type="text"
                className="form-control"
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số năm kinh nghiệm</label>
              <input
                type="text"
                className="form-control"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số giấy phép</label>
              <input
                type="text"
                className="form-control"
                name="license"
                value={formData.license}
                onChange={handleChange}
              />
            </div>
          </Col>
          <div className="d-flex justify-content-end mt-4">
            <Button variant="outline-secondary" className="me-2" onClick={onCancel}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Lưu
            </Button>
          </div>
        </Row>
      ) : (
        <Row>
          <Col md={6}>
            <div className="mb-2"><strong>Họ và tên:</strong> {doctor.basicInfo.fullName}</div>
            <div className="mb-2"><strong>Email:</strong> {doctor.basicInfo.email}</div>
            <div className="mb-2"><strong>Số điện thoại:</strong> {doctor.basicInfo.phone}</div>
            <div className="mb-2"><strong>Ngày sinh:</strong> {doctor.basicInfo.dob}</div>
          </Col>
          <Col md={6}>
            <div className="mb-2"><strong>Chuyên khoa:</strong> {doctor.professionalInfo.specialty}</div>
            <div className="mb-2"><strong>Bệnh viện:</strong> {doctor.professionalInfo.hospital}</div>
            <div className="mb-2"><strong>Số năm kinh nghiệm:</strong> {doctor.professionalInfo.experienceYears}</div>
            <div className="mb-2"><strong>Số giấy phép:</strong> {doctor.professionalInfo.license}</div>
          </Col>
        </Row>
      )}
    </div>
  );
};

// Simplified SummaryCards component
const SummaryCards = ({ doctor }) => (
  <Row className="g-4">
    {[
      { icon: "user-md", title: "Chuyên khoa", value: doctor.professionalInfo.specialty, color: "primary" },
      { icon: "hospital", title: "Bệnh viện", value: doctor.professionalInfo.hospital, color: "success" },
      { icon: "briefcase", title: "Kinh nghiệm", value: doctor.professionalInfo.experienceYears, color: "warning" },
    ].map((item, index) => (
      <Col md={4} key={index}>
        <Card className="shadow-sm h-100">
          <Card.Body className="d-flex align-items-center">
            <div className={`bg-${item.color} bg-opacity-10 rounded-circle p-3 me-3`}>
              <i className={`fas fa-${item.icon} text-${item.color} fs-5`}></i>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: "0.85rem" }}>{item.title}</div>
              <div className="fw-semibold" style={{ fontSize: "1.2rem" }}>{item.value}</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default function DoctorProfile() {
  const [doctorData, setDoctorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const res = await ApiDoctor.getDoctorInfo();
        const data = res;

        console.log("Fetched doctor data:", data);
        const mappedData = {
          avatar: data.userId.avatar,
          name: data.userId.username,
          specialty: `Bác sĩ chuyên khoa ${data.specialty || "Nội tiết"}`,
          hospital: data.hospital,
          basicInfo: {
            fullName: data.userId.username,
            email: data.userId.email,
            phone: data.userId.phone,
            dob: formatDate(data.userId.dob),
          },
          professionalInfo: {
            specialty: data.specialty || "Nội tiết",
            hospital: data.hospital,
            experienceYears: `${data.exp} năm`,
            license: data.giay_phep,
          },
        };


        setDoctorData(mappedData);
      } catch (error) {
        console.error("Lỗi khi fetch doctor info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorInfo();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      // Gửi request lên BE
      await ApiDoctor.updateDoctor({
        username: updatedData.fullName,
        email: updatedData.email,
        phone: updatedData.phone,
        dob: updatedData.dob.split("/").reverse().join("-"),

        hospital: updatedData.hospital,
        exp: parseInt(updatedData.experienceYears, 10),
        giay_phep: updatedData.license,
        // specialty: updatedData.specialty, // nếu có trong BE thì map
      });

      // Update lại state FE để hiển thị ngay
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
        name: updatedData.fullName,
        specialty: `Bác sĩ chuyên khoa ${updatedData.specialty}`,
        hospital: updatedData.hospital,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật doctor info:", error);
      alert("Cập nhật thông tin thất bại!");
    }
  };


  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!doctorData) {
    return <div className="text-center mt-5">Không có dữ liệu bác sĩ.</div>;
  }

  return (
    <div className="m-2">
      <h3 className="mb-4">Thông tin cá nhân</h3>
      <ProfileHeader doctor={doctorData} />
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <InfoSection
            doctor={doctorData}
            isEditing={isEditing}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          {!isEditing && (
            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} />
                Chỉnh sửa thông tin
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      <SummaryCards doctor={doctorData} />
    </div>
  );
}