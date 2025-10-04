import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import {
    Bell,
    AlertCircle,
    Info,
    MessageCircle,
    Server,
} from "lucide-react";

const NotificationToast = ({
    show,
    onClose,
    title,
    content,
    type = "message", // mặc định theo schema
    autoHide = true,
    delay = 5000,
}) => {
    const getIcon = () => {
        switch (type) {
            case "system":
                return <Server size={20} className="text-secondary" />;
            case "reminder":
                return <AlertCircle size={20} className="text-warning" />;
            case "message":
                return <MessageCircle size={20} className="text-primary" />;
            case "alert":
                return <AlertCircle size={20} className="text-danger" />;
            default:
                return <Info size={20} className="text-info" />;
        }
    };

    return (
        <Toast
            show={show}
            onClose={onClose}
            autohide={autoHide}
            delay={delay}
            className="mb-2 shadow"
            style={{ minWidth: "300px" }}
        >
            <Toast.Header>
                <div className="d-flex align-items-center">
                    {getIcon()}
                    <strong className="ms-2 me-auto">{title}</strong>
                </div>
            </Toast.Header>
            <Toast.Body>
                <div className="d-flex align-items-start">
                    <Bell size={16} className="me-2 mt-1 text-muted" />
                    <span>{content}</span>
                </div>
            </Toast.Body>
        </Toast>
    );
};

// Container hiển thị nhiều toasts
export const NotificationToastContainer = ({ children, position = "top-end" }) => {
    return (
        <ToastContainer position={position} className="p-3" style={{ zIndex: 9999 }}>
            {children}
        </ToastContainer>
    );
};

export default NotificationToast;
