import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase';
import { toast } from 'react-toastify';

const RealTimeNotifications = () => {
    const user = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        if (!user?.uid) return;

        // Lắng nghe thông báo real-time từ Firestore
        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('receiverId', '==', user.uid),
            where('isRead', '==', false),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const notification = change.doc.data();

                    // Chỉ hiển thị toast cho thông báo mới (được tạo trong vòng 10 giây qua)
                    const notificationTime = notification.createdAt?.toDate();
                    const now = new Date();
                    const timeDiff = now - notificationTime;

                    if (timeDiff < 10000) { // 10 giây
                        // Hiển thị toast notification
                        toast.info(notification.content, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });

                        // Trigger custom event để cập nhật UI
                        window.dispatchEvent(new CustomEvent('newNotification', {
                            detail: {
                                id: change.doc.id,
                                title: notification.title,
                                content: notification.content,
                                type: notification.type,
                                metadata: notification.metadata,
                                createdAt: notificationTime
                            }
                        }));
                    }
                }
            });
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Component không render gì cả, chỉ lắng nghe events
    return null;
};

export default RealTimeNotifications;