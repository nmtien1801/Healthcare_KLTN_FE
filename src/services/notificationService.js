import ApiNotification from "../apis/ApiNotification";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

class NotificationService {
    constructor() {
        this.currentUser = null;
        this.unsubscribeListeners = [];
    }

    // Set current user for personalized notifications
    setCurrentUser(user) {
        this.currentUser = user;
    }

    // Create notification via API
    async createNotification(data) {
        try {
            const response = await ApiNotification.createNotification(data);

            // Temporarily disable Firestore sync to avoid index issues
            // await this.createFirestoreNotification({
            //     ...data,
            //     createdAt: new Date(),
            //     isRead: false
            // });

            return response;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    }

    // Create notification in Firestore for real-time updates
    async createFirestoreNotification(data) {
        try {
            const notificationsRef = collection(db, 'notifications');
            await addDoc(notificationsRef, {
                ...data,
                createdAt: new Date(),
                isRead: false
            });
        } catch (error) {
            console.error("Error creating Firestore notification:", error);
        }
    }

    // Get notifications from API
    async getNotifications(page = 1, limit = 10) {
        try {
            const response = await ApiNotification.getNotificationsByUser();
            console.log('Service - Raw API response:', response);
            
            // Normalize notification IDs in the response
            if (response?.data) {
                const normalizedData = response.data.map(notification => ({
                    ...notification,
                    id: notification.id || notification._id
                }));
                
                console.log('Service - Normalized response:', { ...response, data: normalizedData });
                return { ...response, data: normalizedData };
            }
            
            return response;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    }

    // Listen to real-time notifications from Firestore
    listenToNotifications(userId, callback) {
        try {
            // Temporarily disable Firestore real-time to avoid index issues
            // Use polling instead for now
            const pollInterval = setInterval(async () => {
                try {
                    const response = await this.getNotifications();
                    if (response?.data) {
                        callback(response.data);
                    }
                } catch (error) {
                    console.error("Error polling notifications:", error);
                }
            }, 5000); // Poll every 5 seconds

            const unsubscribe = () => {
                clearInterval(pollInterval);
            };

            this.unsubscribeListeners.push(unsubscribe);
            return unsubscribe;
        } catch (error) {
            console.error("Error setting up notification polling:", error);
            return () => { };
        }
    }

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            console.log('Service - Marking as read:', notificationId);
            
            if (!notificationId || notificationId === 'undefined') {
                throw new Error('Invalid notification ID provided');
            }
            
            const response = await ApiNotification.markAsRead(notificationId);
            console.log('Service - Marked as read response:', response);

            // Temporarily disable Firestore sync to avoid index issues
            // const notificationRef = doc(db, 'notifications', notificationId);
            // await updateDoc(notificationRef, {
            //     isRead: true,
            //     readAt: new Date()
            // });

            return response;
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    }

    // Mark all notifications as read
    async markAllAsRead() {
        try {
            console.log('Service - Marking all notifications as read');
            
            const response = await ApiNotification.markAllAsRead();
            console.log('Service - Mark all as read response:', response);

            // Temporarily disable Firestore sync to avoid index issues
            // if (this.currentUser?.uid) {
            //     const notificationsRef = collection(db, 'notifications');
            //     const q = query(
            //         notificationsRef,
            //         where('receiverId', '==', this.currentUser.uid)
            //     );

            //     const snapshot = await getDocs(q);
            //     const batch = writeBatch(db);

            //     // Filter unread notifications client-side
            //     snapshot.docs.forEach((docSnapshot) => {
            //         const data = docSnapshot.data();
            //         if (!data.isRead) {
            //             batch.update(docSnapshot.ref, {
            //                 isRead: true,
            //                 readAt: new Date()
            //             });
            //         }
            //     });

            //     await batch.commit();
            // }

            return response;
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw error;
        }
    }

    // Delete notification
    async deleteNotification(notificationId) {
        try {
            console.log('Service - Deleting notification:', notificationId);
            
            if (!notificationId || notificationId === 'undefined') {
                throw new Error('Invalid notification ID provided for deletion');
            }
            
            const response = await ApiNotification.deleteNotification(notificationId);
            console.log('Service - Delete response:', response);

            // Temporarily disable Firestore sync to avoid index issues
            // const notificationRef = doc(db, 'notifications', notificationId);
            // await deleteDoc(notificationRef);

            return response;
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }

    // Get unread count
    async getUnreadCount() {
        try {
            const response = await ApiNotification.getUnreadCount();
            return response;
        } catch (error) {
            console.error("Error getting unread count:", error);
            throw error;
        }
    }

    // Send notification for appointment booking
    async sendBookingNotification(doctorId, patientInfo, appointmentData) {
        const data = {
            receiverId: doctorId,
            type: "appointment_booking",
            title: "Lịch hẹn mới",
            content: `Bệnh nhân ${patientInfo.name} đã đặt lịch khám vào ${appointmentData.date} lúc ${appointmentData.time}`,
            metadata: {
                appointmentId: appointmentData.id,
                patientId: patientInfo.id,
                date: appointmentData.date,
                time: appointmentData.time,
                type: appointmentData.type,
                reason: appointmentData.reason
            }
        };

        return await this.createNotification(data);
    }

    // Send notification for appointment cancellation
    async sendCancellationNotification(receiverId, cancelledBy, appointmentData) {
        const isPatientCancelling = cancelledBy.role === 'patient';
        const data = {
            receiverId,
            type: "appointment_cancellation",
            title: "Lịch hẹn đã bị hủy",
            content: `${isPatientCancelling ? 'Bệnh nhân' : 'Bác sĩ'} ${cancelledBy.name} đã hủy lịch hẹn vào ${appointmentData.date} lúc ${appointmentData.time}`,
            metadata: {
                appointmentId: appointmentData.id,
                cancelledBy: cancelledBy.id,
                date: appointmentData.date,
                time: appointmentData.time,
                reason: appointmentData.reason
            }
        };

        return await this.createNotification(data);
    }

    // Send notification for appointment update
    async sendAppointmentUpdateNotification(receiverId, updatedBy, oldData, newData) {
        const data = {
            receiverId,
            type: "appointment_update",
            title: "Lịch hẹn đã được cập nhật",
            content: `${updatedBy.role === 'patient' ? 'Bệnh nhân' : 'Bác sĩ'} ${updatedBy.name} đã cập nhật lịch hẹn từ ${oldData.date} ${oldData.time} thành ${newData.date} ${newData.time}`,
            metadata: {
                appointmentId: newData.id,
                updatedBy: updatedBy.id,
                oldDate: oldData.date,
                oldTime: oldData.time,
                newDate: newData.date,
                newTime: newData.time
            }
        };

        return await this.createNotification(data);
    }

    // Send notification for payment
    async sendPaymentNotification(receiverId, paymentData, isSuccess = true) {
        const data = {
            receiverId,
            type: isSuccess ? "payment_success" : "payment_failed",
            title: isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại",
            content: isSuccess
                ? `Thanh toán ${paymentData.amount}đ cho lịch hẹn đã được xử lý thành công`
                : `Thanh toán ${paymentData.amount}đ cho lịch hẹn đã thất bại. Vui lòng thử lại.`,
            metadata: {
                paymentId: paymentData.id,
                amount: paymentData.amount,
                appointmentId: paymentData.appointmentId,
                method: paymentData.method
            }
        };

        return await this.createNotification(data);
    }

    // Send notification for attendance check-in/out
    async sendAttendanceNotification(receiverId, doctorInfo, type, time) {
        const data = {
            receiverId,
            type: "attendance",
            title: type === 'checkin' ? "Bác sĩ đã check-in" : "Bác sĩ đã check-out",
            content: `Bác sĩ ${doctorInfo.name} đã ${type === 'checkin' ? 'bắt đầu' : 'kết thúc'} ca làm việc lúc ${time}`,
            metadata: {
                doctorId: doctorInfo.id,
                type,
                time,
                hospital: doctorInfo.hospital
            }
        };

        return await this.createNotification(data);
    }

    // Send notification for patient health updates
    async sendHealthUpdateNotification(receiverId, patientInfo, healthData) {
        const data = {
            receiverId,
            type: "health_update",
            title: "Cập nhật sức khỏe bệnh nhân",
            content: `Bệnh nhân ${patientInfo.name} đã cập nhật thông tin sức khỏe`,
            metadata: {
                patientId: patientInfo.id,
                updateType: healthData.type,
                value: healthData.value,
                date: healthData.date
            }
        };

        return await this.createNotification(data);
    }

    // Send reminder notification
    async sendReminderNotification(receiverId, reminderData) {
        const data = {
            receiverId,
            type: "reminder",
            title: "Nhắc nhở",
            content: reminderData.message,
            metadata: {
                reminderType: reminderData.type,
                relatedId: reminderData.relatedId,
                scheduledTime: reminderData.scheduledTime
            }
        };

        return await this.createNotification(data);
    }

    // Clean up listeners
    cleanup() {
        this.unsubscribeListeners.forEach(unsubscribe => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.unsubscribeListeners = [];
    }
}

// Export singleton instance
export default new NotificationService();