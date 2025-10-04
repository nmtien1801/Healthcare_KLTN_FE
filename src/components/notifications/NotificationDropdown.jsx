import React, { useState, useEffect } from "react";
import {
    Bell,
    X,
    Check,
    Trash2,
    MoreVertical,
} from "lucide-react";
import {
    Dropdown,
    Badge,
    Button,
    Modal,
    ListGroup,
    Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import "./NotificationDropdown.css";
import ApiNotification from "../../apis/ApiNotification";
import { formatDate } from "../../utils/formatDate";

const NotificationDropdown = () => {
    // 🔹 Lấy user từ Redux (đảm bảo đúng key)
    const user = useSelector((state) => state.auth.userInfo);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);

    //  Load danh sách thông báo
    const loadNotifications = async () => {
        try {
            setLoading(true);
            const res = await ApiNotification.getNotificationsByUser();
            if (res?.data) {
                const normalized = res.data.map((n) => ({
                    ...n,
                    id: n.id || n._id,
                }));
                setNotifications(normalized);
            }
        } catch (error) {
            console.error("Lỗi khi load thông báo:", error);
            toast.error("Không thể tải thông báo");
        } finally {
            setLoading(false);
        }
    };

    //  Đếm số thông báo chưa đọc
    const loadUnreadCount = async () => {
        try {
            const res = await ApiNotification.getUnreadCount();
            setUnreadCount(res?.data?.unreadCount || 0);
        } catch (error) {
            console.error("Lỗi khi load số lượng chưa đọc:", error);
        }
    };

    //  Đánh dấu 1 thông báo đã đọc
    const handleMarkAsRead = async (id) => {
        try {
            await ApiNotification.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(prev - 1, 0));
            toast.success("Đã đánh dấu đã đọc");
        } catch (error) {
            console.error("Lỗi khi đánh dấu đã đọc:", error);
            toast.error("Không thể đánh dấu đã đọc");
        }
    };

    //  Xóa thông báo
    const handleDeleteNotification = async (id) => {
        try {
            await ApiNotification.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success("Đã xóa thông báo");
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Không thể xóa thông báo");
        }
    };

    //  Đánh dấu tất cả đã đọc
    const handleMarkAllAsRead = async () => {
        try {
            await ApiNotification.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success("Tất cả thông báo đã được đánh dấu là đã đọc");
        } catch (error) {
            toast.error("Không thể đánh dấu tất cả");
        }
    };

    //  Load dữ liệu khi mở trang
    useEffect(() => {
        if (user) {
            loadNotifications();
            loadUnreadCount();
        }
    }, [user]);

    const getNotificationIcon = (notification) => {
        switch (notification.type) {
            case "reminder":
                return "⏰";
            case "warning":
                return "⚠️";
            case "info":
                return "ℹ️";
            default:
                return "🔔";
        }
    };

    return (
        <>
            <Dropdown align="end">
                <Dropdown.Toggle
                    variant="link"
                    id="notification-dropdown"
                    className="p-2 position-relative text-decoration-none"
                    style={{ border: "none", background: "none" }}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <Badge
                            bg="danger"
                            pill
                            className="position-absolute top-0 start-100 translate-middle"
                            style={{ fontSize: "0.75rem" }}
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Dropdown.Toggle>

                <Dropdown.Menu
                    className="notification-dropdown-menu"
                    style={{ width: "350px", maxHeight: "400px", overflowY: "auto" }}
                >
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h6 className="mb-0">Thông báo</h6>
                        {unreadCount > 0 && (
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-primary"
                                onClick={handleMarkAllAsRead}
                            >
                                Đánh dấu tất cả đã đọc
                            </Button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center p-4">
                            <Spinner animation="border" size="sm" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center p-4 text-muted">
                            <Bell size={48} className="mb-2 opacity-50" />
                            <div>Không có thông báo nào</div>
                        </div>
                    ) : (
                        <>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item p-3 border-bottom ${!notification.isRead ? "unread" : ""
                                        }`}
                                >
                                    <div className="d-flex">
                                        <div className="me-3" style={{ fontSize: "1.5rem" }}>
                                            {getNotificationIcon(notification)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1" style={{ fontSize: "0.9rem" }}>
                                                        {notification.title}
                                                    </h6>
                                                    <p
                                                        className="mb-1 text-muted"
                                                        style={{ fontSize: "0.8rem" }}
                                                    >
                                                        {notification.content}
                                                    </p>
                                                    <small className="text-muted">
                                                        {formatDate(notification.createdAt)}
                                                    </small>
                                                </div>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0"
                                                        style={{ border: "none", background: "none" }}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {!notification.isRead && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleMarkAsRead(notification.id)
                                                                }
                                                            >
                                                                <Check size={16} className="me-2" />
                                                                Đánh dấu đã đọc
                                                            </Dropdown.Item>
                                                        )}
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleDeleteNotification(notification.id)
                                                            }
                                                            className="text-danger"
                                                        >
                                                            <Trash2 size={16} className="me-2" />
                                                            Xóa
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="p-3 text-center">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowAllModal(true)}
                                >
                                    Xem tất cả thông báo
                                </Button>
                            </div>
                        </>
                    )}
                </Dropdown.Menu>
            </Dropdown>

            {/* Modal hiển thị tất cả */}
            <NotificationModal
                show={showAllModal}
                onHide={() => setShowAllModal(false)}
            />
        </>
    );
};

// ==================== MODAL ====================
const NotificationModal = ({ show, onHide }) => {
    const [allNotifications, setAllNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) loadAllNotifications();
    }, [show]);

    const loadAllNotifications = async () => {
        try {
            setLoading(true);
            const res = await ApiNotification.getNotificationsByUser();
            if (res?.data) {
                const normalized = res.data.map((n) => ({
                    ...n,
                    id: n.id || n._id,
                }));
                setAllNotifications(normalized);
            }
        } catch (error) {
            console.error("Lỗi khi load all:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        await ApiNotification.markAsRead(id);
        setAllNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const handleDeleteNotification = async (id) => {
        await ApiNotification.deleteNotification(id);
        setAllNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Tất cả thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                    </div>
                ) : allNotifications.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        <Bell size={48} className="mb-2 opacity-50" />
                        <div>Không có thông báo nào</div>
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {allNotifications.map((n) => (
                            <ListGroup.Item
                                key={n.id}
                                className={`${!n.isRead ? "bg-light" : ""}`}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 className="mb-1">{n.title}</h6>
                                        <p className="mb-1 text-muted">{n.content}</p>
                                        <small className="text-muted">
                                            {formatDate(n.createdAt)}
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {!n.isRead && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleMarkAsRead(n.id)}
                                            >
                                                <Check size={16} />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteNotification(n.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default NotificationDropdown;
