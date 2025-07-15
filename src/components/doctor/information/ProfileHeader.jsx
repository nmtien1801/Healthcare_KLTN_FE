

import { Camera, Stethoscope, Hospital } from "lucide-react"
import { Avatar } from "../common-ui-components" // Reusing Avatar from PatientTab

export default function ProfileHeader({ doctor }) {
    return (
        <div
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-md p-6 text-center position-relative overflow-hidden"
            style={{ minHeight: "200px" }}
        >
            <div
                className="position-absolute top-0 start-0 w-100 h-100 opacity-25"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm10-10v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm10-10v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 54v-4h-2v4H0v2h2v4h2v-4h4v-2H6zm0-10v-4h-2v4H0v2h2v4h2v-4h4v-2H6zM6 34v-4h-2v4H0v2h2v4h2v-4h4v-2H6zM6 14v-4h-2v4H0v2h2v4h2v-4h4v-2H6zM46 6v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM16 6v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px",
                }}
            ></div>
            <div className="position-relative z-10">
                <div className="d-inline-block position-relative mb-4">
                    <Avatar
                        src={doctor.avatar}
                        alt={doctor.name}
                        fallback={doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        className="shadow-lg"
                        style={{ width: "120px", height: "120px", border: "4px solid rgba(255,255,255,0.3)" }}
                    />
                    <div
                        className="position-absolute bottom-0 end-0 bg-white text-blue-600 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: "32px", height: "32px", transform: "translate(25%, 25%)" }}
                    >
                        <Camera size={16} />
                    </div>
                </div>
                <h2 className="h4 fw-bold mb-1">{doctor.name}</h2>
                <p className="text-white-75 mb-1 d-flex align-items-center justify-content-center gap-2">
                    <Stethoscope size={16} />
                    {doctor.specialty}
                </p>
                <p className="text-white-75 mb-0 d-flex align-items-center justify-content-center gap-2">
                    <Hospital size={16} />
                    {doctor.hospital}
                </p>
            </div>
        </div>
    )
}
