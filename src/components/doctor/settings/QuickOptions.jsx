"use client"

import { ShieldCheck, HelpCircle, ChevronRight } from "lucide-react"
import { Button } from "../common-ui-components" // Reusing Button

export default function QuickOptions() {
    return (
        <div className="card shadow-sm border-0 mb-6" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
                <h5 className="fw-bold text-dark mb-4">Tùy chọn nhanh</h5>
                <p className="text-muted small mb-4">Các tùy chọn và thao tác nhanh</p>

                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <Button
                            variant="light"
                            className="w-100 d-flex align-items-center justify-content-between p-3 text-start"
                            style={{ border: "1px solid #e9ecef" }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="bg-green-100 text-green-600 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-medium text-dark mb-0">Bảo mật</h6>
                                    <p className="text-muted small mb-0">Thay đổi mật khẩu và cài đặt bảo mật</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-muted" />
                        </Button>
                    </div>
                    <div className="col-12 col-md-6">
                        <Button
                            variant="light"
                            className="w-100 d-flex align-items-center justify-content-between p-3 text-start"
                            style={{ border: "1px solid #e9ecef" }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="bg-orange-100 text-orange-600 rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <HelpCircle size={20} />
                                </div>
                                <div>
                                    <h6 className="fw-medium text-dark mb-0">Trợ giúp & Hỗ trợ</h6>
                                    <p className="text-muted small mb-0">Liên hệ với đội ngũ hỗ trợ</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-muted" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
