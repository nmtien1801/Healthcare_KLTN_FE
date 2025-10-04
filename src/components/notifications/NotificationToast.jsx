import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Bell, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const NotificationToast = ({
    show,
    onClose,
    title,
    content,
    type = 'info',
    autoHide = true,
    delay = 5000
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} className="text-success" />;
            case 'error':
                return <XCircle size={20} className="text-danger" />;
            case 'warning':
                return <AlertCircle size={20} className="text-warning" />;
            case 'info':
            default:
                return <Info size={20} className="text-info" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-success';
            case 'error':
                return 'bg-danger';
            case 'warning':
                return 'bg-warning';
            case 'info':
            default:
                return 'bg-info';
        }
    };

    return (
        <Toast
            show={show}
            onClose={onClose}
            autohide={autoHide}
            delay={delay}
            className="mb-2"
            style={{ minWidth: '300px' }}
        >
            <Toast.Header className={`${getBgColor()} text-white`}>
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

// Container for multiple toasts
export const NotificationToastContainer = ({ children, position = 'top-end' }) => {
    return (
        <ToastContainer
            position={position}
            className="p-3"
            style={{ zIndex: 9999 }}
        >
            {children}
        </ToastContainer>
    );
};

export default NotificationToast;