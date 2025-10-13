import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2, MoreVertical } from "lucide-react";
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
import { listenStatus, sendStatus } from "../../utils/SetupSignFireBase";

const NotificationDropdown = () => {
    const user = useSelector((state) => state.auth.userInfo);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);

    // Tạm thời hardcode uid bác sĩ & bệnh nhân
    const doctorHardcodeUid = "1HwseYsBwxby5YnsLUWYzvRtCw53";
    const patientHardcodeUid = "cq6SC0A1RZXdLwFE1TKGRJG8fgl2";
    const isDoctor = user.uid === doctorHardcodeUid;
    const doctorUid = isDoctor ? user.uid : doctorHardcodeUid;
    const patientUid = isDoctor ? patientHardcodeUid : user.uid;
    const roomChats = [doctorUid, patientUid].sort().join("_");

    // Load danh sách thông báo
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
        } finally {
            setLoading(false);
        }
    };

    // Load số lượng thông báo chưa đọc
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
            sendStatus(doctorUid, patientUid, "notification_update");
        } catch (error) {
            console.error("Không thể đánh dấu đã đọc", error);
        }
    };

    // Xóa 1 thông báo
    const handleDeleteNotification = async (id) => {
        try {
            await ApiNotification.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            sendStatus(doctorUid, patientUid, "notification_delete");
        } catch (error) {
            console.error("Không thể xóa thông báo", error);
        }
    };

    // Đánh dấu tất cả đã đọc
    const handleMarkAllAsRead = async () => {
        try {
            await ApiNotification.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
            sendStatus(doctorUid, patientUid, "notification_read_all");
        } catch (error) {
            console.error("Không thể đánh dấu tất cả đã đọc", error);
        }
    };

    // Map icon
    const getNotificationIcon = (notification) => {
        switch (notification.type) {
            case "system":
                return "🔔";
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

    // 🔥 Lắng nghe tín hiệu Firestore
    useEffect(() => {
        if (!user?.uid) return;

        // Load ban đầu
        loadNotifications();
        loadUnreadCount();

        const unsub = listenStatus(roomChats, async (signal) => {
            if (!signal) return;

            try {
                // Nếu chỉ là cập nhật, xóa hoặc đánh dấu đọc → reload mà không hiện toast
                if (
                    typeof signal === "string" &&
                    ["notification_update", "notification_delete", "notification_read_all"].includes(signal)
                ) {
                    await Promise.all([loadNotifications(), loadUnreadCount()]);
                    return;
                }

                // Ngược lại, nếu là tín hiệu mới thực sự → load và hiện toast
                const res = await ApiNotification.getNotificationsByUser();
                if (res?.data?.length > 0) {
                    const normalized = res.data.map((n) => ({
                        ...n,
                        id: n.id || n._id,
                    }));
                    setNotifications(normalized);
                    setUnreadCount(normalized.filter((n) => !n.isRead).length);

                    const latest = res.data[0];
                    if (!latest.isRead) {
                        toast.success(
                            <div className="d-flex align-items-center">
                                {latest.avatar ? (
                                    <img
                                        src={latest.avatar}
                                        alt="Avatar"
                                        className="rounded-circle me-2"
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-2"
                                        style={{ width: "30px", height: "30px" }}
                                    >
                                        <span style={{ color: "white" }}>🔔</span>
                                    </div>
                                )}
                                <div>
                                    <strong>{latest.title}</strong>
                                    <p style={{ margin: 0 }}>{latest.content}</p>
                                </div>
                            </div>
                        );
                    }
                }
            } catch (err) {
                console.error("Lỗi khi load thông báo realtime:", err);
            }
        });

        return () => unsub();
    }, [user?.uid]);

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
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`notification-item p-3 border-bottom ${!n.isRead ? "unread" : ""}`}
                                >
                                    <div className="d-flex align-items-center">
                                        {n.avatar ? (
                                            <img
                                                src={n.avatar}
                                                alt="Avatar"
                                                className="rounded-circle me-3"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="me-3 rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                                                style={{ width: "40px", height: "40px" }}
                                            >
                                                <span style={{ color: "white" }}>
                                                    {getNotificationIcon(n)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1" style={{ fontSize: "0.9rem" }}>
                                                        {n.title}
                                                    </h6>
                                                    <p
                                                        className="mb-1 text-muted"
                                                        style={{ fontSize: "0.8rem" }}
                                                    >
                                                        {n.content}
                                                    </p>
                                                    <small className="text-muted">
                                                        {formatDate(n.createdAt)}
                                                    </small>
                                                </div>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="link" size="sm" className="p-0">
                                                        <MoreVertical size={16} />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {!n.isRead && (
                                                            <Dropdown.Item
                                                                onClick={() => handleMarkAsRead(n.id)}
                                                            >
                                                                <Check size={16} className="me-2" />
                                                                Đánh dấu đã đọc
                                                            </Dropdown.Item>
                                                        )}
                                                        <Dropdown.Item
                                                            onClick={() => handleDeleteNotification(n.id)}
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
                getNotificationIcon={getNotificationIcon}
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
    getNotificationIcon,
}) => (
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
                        <ListGroup.Item key={n.id} className={`${!n.isRead ? "bg-light" : ""}`}>
                            <div className="d-flex align-items-center">
                                {n.avatar ? (
                                    <img
                                        src={n.avatar}
                                        alt="Avatar"
                                        className="rounded-circle me-3"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="me-3 rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <span style={{ color: "white" }}>
                                            {getNotificationIcon(n)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-grow-1">
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
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Modal.Body>
    </Modal>
);

export default NotificationDropdown;
