import { ApiManager } from "./ApiManager";

const ApiNotification = {
    createNotification: (data) => ApiManager.post("/notifications", data),
    getNotificationsByUser: () => ApiManager.get("/notifications"),
    markAsRead: (notificationId) => ApiManager.patch(`/notifications/${notificationId}/read`),
    deleteNotification: (notificationId) => ApiManager.delete(`/notifications/${notificationId}`),
    getUnreadCount: () => ApiManager.get("/notifications/unread-count"),
    markAllAsRead: () => ApiManager.patch("/notifications/mark-all-read"),

};

export default ApiNotification;