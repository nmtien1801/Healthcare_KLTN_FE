import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import notificationService from '../../services/notificationService';

const RealTimeNotifications = () => {
    const user = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        if (!user?.userId) return;

        console.log('RealTimeNotifications: Setting up for user', user.userId);

        // Listen for new notification events từ NotificationService
        const handleNewNotification = (event) => {
            const notification = event.detail;
            console.log('RealTimeNotifications: New notification received', notification);

            // Hiển thị toast notification với icon tương ứng
            const getNotificationIcon = (metadata) => {
                const notificationType = metadata?.notificationType;
                switch (notificationType) {
                    case 'appointment_booking': return '📅';
                    case 'appointment_cancellation': return '❌';
                    case 'appointment_update': return '✏️';
                    case 'payment_success': return '💳';
                    case 'payment_failed': return '❌';
                    case 'attendance': return '🏥';
                    case 'health_update': return '💊';
                    case 'reminder': return '⏰';
                    default: return '📢';
                }
            };

            const icon = getNotificationIcon(notification.metadata);

            // Play notification sound
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAzuB1+/MdiQEL4XS9tiEOAgdaLnw6aJQDBFUqu3wr2UbBDiQ1/LNeSkEJXfG8N+SQwsUXrXq76lXFAlFnt/yuF8ZBDuB1/PPfCMELmvT49p7NwkadKzz5qVXF...');
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Could not play notification sound:', e));
            } catch (error) {
                console.log('Notification sound not available:', error);
            }

            toast.info(
                <div>
                    <strong>{icon} {notification.title}</strong>
                    <br />
                    <small>{notification.content}</small>
                </div>,
                {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    className: 'notification-toast'
                }
            );
        };

        // Listen for custom notification events
        window.addEventListener('newNotification', handleNewNotification);

        // Khởi tạo notification service listener
        const unsubscribe = notificationService.listenToNotifications(
            user.userId,
            (notifications) => {
                console.log('RealTimeNotifications: Notifications updated', notifications.length);
                // NotificationDropdown sẽ handle việc cập nhật UI
            }
        );

        return () => {
            window.removeEventListener('newNotification', handleNewNotification);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user?.userId]);

    // Component không render gì cả, chỉ lắng nghe events
    return null;
};

export default RealTimeNotifications;