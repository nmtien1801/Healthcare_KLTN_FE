import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, doc, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

// Lưu lịch hẹn vào Firestore
export const saveAppointment = async (userId, appointment) => {
    try {
        await addDoc(collection(db, "appointments", userId, "userAppointments"), {
            ...appointment,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error("Error saving appointment:", err);
        throw err;
    }
};

// Xóa lịch hẹn khỏi Firestore
export const deleteAppointment = async (userId, appointmentId) => {
    try {
        await deleteDoc(doc(db, "appointments", userId, "userAppointments", appointmentId));
    } catch (err) {
        console.error("Error deleting appointment:", err);
        throw err;
    }
};

// Lắng nghe danh sách lịch hẹn từ Firestore
export const listenAppointments = (userId, callback) => {
    if (!userId) return () => { };

    const q = query(
        collection(db, "appointments", userId, "userAppointments"),
        orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data(),
        }));
        callback(appointments);
    }, (err) => {
        console.error("Firestore appointments listener error:", err);
    });

    return unsub;
};

// Lưu thông báo vào Firestore
export const saveNotification = async (userId, notification) => {
    try {
        await addDoc(collection(db, "notifications", userId, "userNotifications"), {
            ...notification,
            createdAt: serverTimestamp(),
        });
    } catch (err) {
        console.error("Error saving notification:", err);
        throw err;
    }
};

// Lắng nghe thông báo từ Firestore
export const listenNotifications = (userId, callback) => {
    if (!userId) return () => { };

    const q = query(
        collection(db, "notifications", userId, "userNotifications"),
        orderBy("createdAt", "desc"),
        limit(10) // Giới hạn để tránh tải quá nhiều
    );

    const unsub = onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(notifications);
    }, (err) => {
        console.error("Firestore notifications listener error:", err);
    });

    return unsub;
};

// Xóa toàn bộ lịch hẹn của user
export const clearUserAppointments = async (userId) => {
    try {
        const querySnapshot = await getDocs(collection(db, "appointments", userId, "userAppointments"));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log(`Cleared all appointments for user ${userId}`);
    } catch (err) {
        console.error("Error clearing appointments:", err);
        throw err;
    }
};

// Xóa toàn bộ thông báo của user
export const clearUserNotifications = async (userId) => {
    try {
        const querySnapshot = await getDocs(collection(db, "notifications", userId, "userNotifications"));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log(`Cleared all notifications for user ${userId}`);
    } catch (err) {
        console.error("Error clearing notifications:", err);
        throw err;
    }
};