"use client"

import { LogOut } from "lucide-react"
import { Button } from "../common-ui-components"

export default function LogoutButton({ onLogout }) {
    return (
        <Button
            variant="danger"
            className="w-100 d-flex align-items-center justify-content-center gap-3 p-3"
            onClick={onLogout}
        >
            <LogOut size={20} />
            Đăng xuất khỏi tài khoản
        </Button>
    )
}
