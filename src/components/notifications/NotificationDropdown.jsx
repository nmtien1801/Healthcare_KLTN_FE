import React, { useState, useEffect } from "react";
import {
    Bell,
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
import { listenStatus } from "../../utils/SetupSignFireBase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const NotificationDropdown = () => {
    const user = useSelector((state) => state.auth.userInfo);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);

    // Load danh sách thông báo từ API (MongoDB)
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

    // Đếm số thông báo chưa đọc
    const loadUnreadCount = async () => {
        try {
            const res = await ApiNotification.getUnreadCount();
            setUnreadCount(res?.data?.unreadCount || 0);
        } catch (error) {
            console.error("Lỗi khi load số lượng chưa đọc:", error);
        }
    };

    // Đánh dấu 1 thông báo đã đọc
    const handleMarkAsRead = async (id) => {
        try {
            await ApiNotification.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(prev - 1, 0));
            toast.success("Đã đánh dấu đã đọc");
        } catch (error) {
            toast.error("Không thể đánh dấu đã đọc");
        }
    };

    // Xóa 1 thông báo
    const handleDeleteNotification = async (id) => {
        try {
            await ApiNotification.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            toast.success("Đã xóa thông báo");
        } catch (error) {
            toast.error("Không thể xóa thông báo");
        }
    };

    // Đánh dấu tất cả đã đọc
    const handleMarkAllAsRead = async () => {
        try {
            await ApiNotification.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success("Tất cả thông báo đã được đánh dấu đã đọc");
        } catch (error) {
            toast.error("Không thể đánh dấu tất cả");
        }
    };

    // Lắng nghe realtime Firestore
    useEffect(() => {
        if (!user?.userId) return;
        loadNotifications();
        loadUnreadCount();

        const doctorUid = user.userId;
        const patientUid = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";
        const roomChats = [doctorUid, patientUid].sort().join("_");

        const unsub = listenStatus(roomChats, doctorUid, async (signal) => {
            if (!signal) return;

            let senderName = "Người dùng";
            let senderAvatar = null;

            if (signal.senderId) {
                try {
                    const docRef = doc(db, "users", signal.senderId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        senderName = docSnap.data().username || senderName;
                        senderAvatar = docSnap.data().avatar || senderAvatar;
                    }
                } catch (error) {
                    console.error("Lỗi lấy thông tin user:", error);
                }
            }

            // 🔹 Thay vì tạo default notification, ta dùng dữ liệu gốc từ signal
            if (signal.id && signal.title && signal.content) {
                setNotifications((prev) => [
                    {
                        ...signal,
                        id: signal.id.toString(),
                        avatar: senderAvatar,
                        createdAt: signal.createdAt || new Date().toISOString(),
                        isRead: signal.isRead ?? false,
                    },
                    ...prev,
                ]);
                setUnreadCount((prev) => prev + 1);
                toast.info(signal.content);
            }
        });

        return () => unsub();
    }, [user?.userId]);

    // Map icon theo schema type
    const getNotificationIcon = (notification) => {
        switch (notification.type) {
            case "system":
                return "💻";
            case "reminder":
                return "⏰";
            case "message":
                return "💬";
            case "alert":
                return "⚠️";
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
                                                    <p className="mb-1 text-muted" style={{ fontSize: "0.8rem" }}>
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

            <NotificationModal
                show={showAllModal}
                onHide={() => setShowAllModal(false)}
                allNotifications={notifications}
                handleMarkAsRead={handleMarkAsRead}
                handleDeleteNotification={handleDeleteNotification}
            />
        </>
    );
};

// Modal hiển thị tất cả thông báo
const NotificationModal = ({
    show,
    onHide,
    allNotifications,
    handleMarkAsRead,
    handleDeleteNotification,
}) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Tất cả thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {allNotifications.length === 0 ? (
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
