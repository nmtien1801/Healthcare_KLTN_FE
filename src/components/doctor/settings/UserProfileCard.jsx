"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { Avatar } from "../common-ui-components" // Reusing Avatar

export default function UserProfileCard({ user }) {
    return (
        <div className="card shadow-sm border-0 mb-6" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
                <div className="d-flex align-items-center gap-4 mb-4">
                    <Avatar
                        src="/placeholder.svg?height=80&width=80" // Placeholder image
                        alt={user.name}
                        fallback={user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        className="flex-shrink-0"
                        style={{ width: "80px", height: "80px" }}
                    />
                    <div>
                        <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                            {user.name}
                            <span
                                className="badge bg-primary text-white fw-normal"
                                style={{ fontSize: "0.75rem", padding: "0.3em 0.6em", borderRadius: "4px" }}
                            >
                                Pro
                            </span>
                        </h4>
                        <p className="text-muted mb-0">{user.status}</p>
                    </div>
                </div>
                <div className="row g-3 text-muted small">
                    <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                        <Mail size={16} />
                        {user.email}
                    </div>
                    <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                        <Phone size={16} />
                        {user.phone}
                    </div>
                    <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                        <MapPin size={16} />
                        {user.location}
                    </div>
                </div>
            </div>
        </div>
    )
}
