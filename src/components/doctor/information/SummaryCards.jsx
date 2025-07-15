

import { Clock, Stethoscope, FileText } from "lucide-react"

export default function SummaryCards({ doctor }) {
    return (
        <div className="row g-4">
            <div className="col-12 col-md-4">
                <div
                    className="card shadow-sm border-0 p-4 d-flex align-items-center justify-content-center text-center"
                    style={{ borderRadius: "12px", minHeight: "120px" }}
                >
                    <div
                        className="bg-blue-100 text-blue-600 rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{ width: "48px", height: "48px" }}
                    >
                        <Clock size={24} />
                    </div>
                    <p className="text-muted small mb-1">Kinh nghiệm</p>
                    <h6 className="fw-bold text-dark mb-0">{doctor.professionalInfo.experienceYears}</h6>
                </div>
            </div>
            <div className="col-12 col-md-4">
                <div
                    className="card shadow-sm border-0 p-4 d-flex align-items-center justify-content-center text-center"
                    style={{ borderRadius: "12px", minHeight: "120px" }}
                >
                    <div
                        className="bg-green-100 text-green-600 rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{ width: "48px", height: "48px" }}
                    >
                        <Stethoscope size={24} />
                    </div>
                    <p className="text-muted small mb-1">Chuyên khoa</p>
                    <h6 className="fw-bold text-dark mb-0">{doctor.professionalInfo.specialty}</h6>
                </div>
            </div>
            <div className="col-12 col-md-4">
                <div
                    className="card shadow-sm border-0 p-4 d-flex align-items-center justify-content-center text-center"
                    style={{ borderRadius: "12px", minHeight: "120px" }}
                >
                    <div
                        className="bg-purple-100 text-purple-600 rounded-circle d-flex align-items-center justify-content-center mb-3"
                        style={{ width: "48px", height: "48px" }}
                    >
                        <FileText size={24} />
                    </div>
                    <p className="text-muted small mb-1">Giấy phép</p>
                    <h6 className="fw-bold text-dark mb-0">{doctor.professionalInfo.license}</h6>
                </div>
            </div>
        </div>
    )
}
