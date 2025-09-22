import { useEffect } from "react";
import { Image } from "react-bootstrap";

// CSS cho thông báo  
const notificationStyles = `
  .notification {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    margin-bottom: 10px;
    animation: slideIn 0.3s ease-in-out;
    border-left: 4px solid;
  }
  .notification.success {
    border-left-color: #28a745;
  }
  .notification.danger {
    border-left-color: #dc3545;
  }
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = notificationStyles;
    document.head.appendChild(style);
}

const Notification = ({ message, type, avatar, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <Image
                roundedCircle
                width={40}
                height={40}
                src={avatar || "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"}
                alt="Avatar"
                className="me-3"
            />
            <div>
                <div className="fw-semibold">{message}</div>
                <small className="text-muted">{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</small>
            </div>
        </div>
    );
};

export default Notification;