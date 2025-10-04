import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, MoreVertical } from 'lucide-react';
import { Dropdown, Badge, Button, Modal, ListGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import notificationService from '../../services/notificationService';
import { useSelector } from 'react-redux';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);
    const user = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        if (user?.uid) {
            // Set current user for notification service
            notificationService.setCurrentUser(user);

            // Load initial notifications
            loadNotifications();

            // Listen to real-time notifications
            const unsubscribe = notificationService.listenToNotifications(
                user.uid,
                handleNotificationsUpdate
            );

            // Listen for new notification events
            const handleNewNotification = (event) => {
                const { detail } = event;
                toast.info(detail.content, {
                    position: "top-right",
                    autoClose: 5000,
                });
                loadNotifications(); // Refresh notifications
            };

            window.addEventListener('newNotification', handleNewNotification);

            return () => {
                unsubscribe();
                window.removeEventListener('newNotification', handleNewNotification);
            };
        }
    }, [user]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const [notificationsRes, unreadRes] = await Promise.all([
                notificationService.getNotifications(),
                notificationService.getUnreadCount()
            ]);

            console.log('API Response - notifications:', notificationsRes);
            console.log('API Response - unread count:', unreadRes);

            if (notificationsRes?.data) {
                // Normalize notification objects - handle both id and _id
                const normalizedNotifications = notificationsRes.data.map(notification => ({
                    ...notification,
                    id: notification.id || notification._id
                }));

                console.log('Normalized notifications in load:', normalizedNotifications);
                setNotifications(normalizedNotifications.slice(0, 5)); // Show latest 5
            }

            if (unreadRes?.data) {
                setUnreadCount(unreadRes.data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationsUpdate = (newNotifications) => {
        console.log('Raw notifications from API:', newNotifications);

        // Normalize notification objects - handle both id and _id
        const normalizedNotifications = newNotifications.map(notification => ({
            ...notification,
            id: notification.id || notification._id
        }));

        console.log('Normalized notifications:', normalizedNotifications);

        setNotifications(normalizedNotifications.slice(0, 5)); // Show latest 5
        const unread = normalizedNotifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            console.log('Marking as read:', notificationId);
            console.log('All notifications:', notifications);

            if (!notificationId) {
                console.error('Notification ID is undefined');
                toast.error('ID thông báo không hợp lệ');
                return;
            }

            await notificationService.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Không thể đánh dấu đã đọc');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            console.log('Marking all notifications as read');
            console.log('Current notifications:', notifications);
            
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Không thể đánh dấu tất cả đã đọc');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            console.log('Deleting notification with ID:', notificationId);
            console.log('All notifications before delete:', notifications);
            
            if (!notificationId) {
                console.error('Notification ID is undefined for delete');
                toast.error('ID thông báo không hợp lệ');
                return;
            }
            
            await notificationService.deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setUnreadCount(prev => {
                const deletedNotification = notifications.find(n => n.id === notificationId);
                return deletedNotification && !deletedNotification.isRead ? Math.max(0, prev - 1) : prev;
            });
            toast.success('Đã xóa thông báo');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Không thể xóa thông báo');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'appointment_booking':
                return '📅';
            case 'appointment_cancellation':
                return '❌';
            case 'appointment_update':
                return '✏️';
            case 'payment_success':
                return '💳';
            case 'payment_failed':
                return '❌';
            case 'attendance':
                return '🏥';
            case 'health_update':
                return '💊';
            case 'reminder':
                return '⏰';
            default:
                return '📢';
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        const now = new Date();
        const notificationDate = new Date(date);
        const diffTime = Math.abs(now - notificationDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffDays > 0) {
            return `${diffDays} ngày trước`;
        } else if (diffHours > 0) {
            return `${diffHours} giờ trước`;
        } else {
            return `${diffMinutes} phút trước`;
        }
    };

    return (
        <>
            <Dropdown align="end">
                <Dropdown.Toggle
                    variant="link"
                    id="notification-dropdown"
                    className="p-2 position-relative text-decoration-none"
                    style={{ border: 'none', background: 'none' }}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <Badge
                            bg="danger"
                            pill
                            className="position-absolute top-0 start-100 translate-middle"
                            style={{ fontSize: '0.75rem' }}
                        >
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="notification-dropdown-menu" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
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
                                    className={`notification-item p-3 border-bottom ${!notification.isRead ? 'unread' : ''}`}
                                >
                                    <div className="d-flex">
                                        <div className="me-3">
                                            <span style={{ fontSize: '1.5rem' }}>
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>
                                                        {notification.title}
                                                    </h6>
                                                    <p className="mb-1 text-muted" style={{ fontSize: '0.8rem' }}>
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
                                                        style={{ border: 'none', background: 'none' }}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {!notification.isRead && (
                                                            <Dropdown.Item
                                                                key={`mark-read-${notification.id}`}
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                            >
                                                                <Check size={16} className="me-2" />
                                                                Đánh dấu đã đọc
                                                            </Dropdown.Item>
                                                        )}
                                                        <Dropdown.Item
                                                            key={`delete-${notification.id}`}
                                                            onClick={() => handleDeleteNotification(notification.id)}
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

            {/* Modal hiển thị tất cả thông báo */}
            <NotificationModal
                show={showAllModal}
                onHide={() => setShowAllModal(false)}
                userId={user?.uid}
            />
        </>
    );
};

// Component modal hiển thị tất cả thông báo
const NotificationModal = ({ show, onHide, userId }) => {
    const [allNotifications, setAllNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (show && userId) {
            loadAllNotifications();
        }
    }, [show, userId]);

    const loadAllNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications(page, 20);
            console.log('Modal - API Response for all notifications:', response);
            
            if (response?.data) {
                // Normalize notification objects - handle both id and _id
                const normalizedNotifications = response.data.map(notification => ({
                    ...notification,
                    id: notification.id || notification._id
                }));
                
                console.log('Modal - Normalized notifications:', normalizedNotifications);
                setAllNotifications(normalizedNotifications);
            }
        } catch (error) {
            console.error('Error loading all notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            console.log('Modal - Marking as read:', notificationId);
            
            if (!notificationId) {
                console.error('Modal - Notification ID is undefined');
                toast.error('ID thông báo không hợp lệ');
                return;
            }
            
            await notificationService.markAsRead(notificationId);
            setAllNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                )
            );
            toast.success('Đã đánh dấu đã đọc');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Không thể đánh dấu đã đọc');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            console.log('Modal - Deleting notification with ID:', notificationId);
            
            if (!notificationId) {
                console.error('Modal - Notification ID is undefined for delete');
                toast.error('ID thông báo không hợp lệ');
                return;
            }
            
            await notificationService.deleteNotification(notificationId);
            setAllNotifications(prev => prev.filter(n => n.id !== notificationId));
            toast.success('Đã xóa thông báo');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Không thể xóa thông báo');
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Tất cả thông báo</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
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
                        {allNotifications.map((notification) => (
                            <ListGroup.Item
                                key={notification.id}
                                className={`${!notification.isRead ? 'bg-light' : ''}`}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{notification.title}</h6>
                                        <p className="mb-1 text-muted">{notification.content}</p>
                                        <small className="text-muted">
                                            {new Date(notification.createdAt).toLocaleString('vi-VN')}
                                        </small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {!notification.isRead && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                            >
                                                <Check size={16} />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteNotification(notification.id)}
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