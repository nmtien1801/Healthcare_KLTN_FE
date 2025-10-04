import { ApiManager } from "./ApiManager";

const ApiNotification = {
    createNotification: (data) => ApiManager.post("/notifications", data),
    getNotificationsByUser: () => ApiManager.get("/notifications"),
    markAsRead: (notificationId) => ApiManager.patch(`/notifications/${notificationId}/read`),
    deleteNotification: (notificationId) => ApiManager.delete(`/notifications/${notificationId}`),
};

export default ApiNotification;