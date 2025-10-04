# Hệ Thống Thông Báo Healthcare KLTN

## Tổng Quan

Hệ thống thông báo được tích hợp toàn diện cho ứng dụng Healthcare KLTN, hỗ trợ thông báo real-time giữa bác sĩ và bệnh nhân thông qua Firebase và RESTful API.

## Các Tính Năng Chính

### 1. Thông Báo Real-time
- Sử dụng Firebase Firestore để đồng bộ thông báo thời gian thực
- Toast notifications hiển thị ngay khi có thông báo mới
- Auto-refresh notification dropdown

### 2. Toast Notifications
- Hiển thị thông báo ngay lập tức khi có sự kiện mới
- Tự động ẩn sau 5 giây
- Click để đóng hoặc tương tác

### 3. Quản Lý Thông Báo
- Dropdown hiển thị 5 thông báo gần nhất
- Modal xem tất cả thông báo với phân trang
- Đánh dấu đã đọc/chưa đọc
- Xóa thông báo không cần thiết

## Các Loại Thông Báo

### Bệnh Nhân → Bác Sĩ
1. **Đặt lịch hẹn mới** (`appointment_booking`)
2. **Hủy lịch hẹn** (`appointment_cancellation`)
3. **Cập nhật thông tin sức khỏe** (`health_update`)

### Bác Sĩ → Bệnh Nhân
1. **Xác nhận/Hủy lịch hẹn** (`appointment_cancellation`)
2. **Thay đổi lịch hẹn** (`appointment_update`)
3. **Check-in/Check-out** (`attendance`)

### Hệ Thống
1. **Thanh toán thành công** (`payment_success`)
2. **Thanh toán thất bại** (`payment_failed`)
3. **Nhắc nhở** (`reminder`)

## Cấu Trúc File

```
src/
├── services/
│   └── notificationService.js          # Service chính quản lý thông báo
├── components/
│   └── notifications/
│       ├── NotificationDropdown.jsx    # Dropdown thông báo trên header
│       ├── NotificationDropdown.css    # Styles cho dropdown
│       ├── NotificationToast.jsx       # Toast component
│       └── RealTimeNotifications.jsx   # Real-time listener
├── apis/
│   └── ApiNotification.js              # API calls đến backend
└── firebase.js                         # Cấu hình Firebase (đã cập nhật FCM)
```

## Cách Sử Dụng

### 1. Gửi Thông Báo

```javascript
import notificationService from '../services/notificationService';

// Gửi thông báo đặt lịch
await notificationService.sendBookingNotification(
  doctorId,
  {
    id: patientId,
    name: patientName
  },
  {
    id: appointmentId,
    date: appointmentDate,
    time: appointmentTime,
    type: appointmentType,
    reason: reason
  }
);

// Gửi thông báo thanh toán
await notificationService.sendPaymentNotification(
  userId,
  {
    id: paymentId,
    amount: amount,
    method: paymentMethod
  },
  true // isSuccess
);
```

### 2. Lắng Nghe Thông Báo Real-time

Component `RealTimeNotifications` tự động lắng nghe và hiển thị thông báo mới:

```jsx
import RealTimeNotifications from './components/notifications/RealTimeNotifications';

function App() {
  return (
    <div>
      {/* Các component khác */}
      <RealTimeNotifications />
    </div>
  );
}
```

### 3. Hiển Thị Notification Dropdown

```jsx
import NotificationDropdown from './components/notifications/NotificationDropdown';

function Header() {
  return (
    <div>
      {/* Các element khác */}
      <NotificationDropdown />
    </div>
  );
}
```

## Cấu Hình Firebase

### Firestore Rules (cần thiết):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notifications/{document} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.receiverId || 
         request.auth.uid == resource.data.senderId);
    }
  }
}
```

## Backend Integration

### API Endpoints Cần Thiết:

1. `POST /api/notifications` - Tạo thông báo mới
2. `GET /api/notifications` - Lấy danh sách thông báo
3. `PATCH /api/notifications/:id/read` - Đánh dấu đã đọc
4. `DELETE /api/notifications/:id` - Xóa thông báo
5. `GET /api/notifications/unread-count` - Đếm thông báo chưa đọc
6. `PATCH /api/notifications/mark-all-read` - Đánh dấu tất cả đã đọc

### Firestore Collections:

```javascript
// notifications collection
{
  senderId: string,
  receiverId: string,
  type: string,
  title: string,
  content: string,
  metadata: object,
  isRead: boolean,
  createdAt: timestamp
}
```

## Tích Hợp Trong Các Tính Năng

### 1. Booking System
- **File**: `src/pages/patient/BookingTabs.jsx`
- **Thông báo**: Khi đặt lịch và hủy lịch thành công

### 2. Doctor Appointment Management
- **File**: `src/pages/doctor/AppointmentTab.jsx`
- **Thông báo**: Khi cập nhật hoặc xóa lịch hẹn

### 3. Doctor Attendance
- **File**: `src/pages/doctor/AttendanceTab.jsx`
- **Thông báo**: Khi check-in/check-out

### 4. Payment System
- **File**: `src/pages/payment/FlowPayment.jsx`
- **Thông báo**: Khi thanh toán thành công/thất bại

## Troubleshooting

### 1. Thông báo không hiển thị:
- Kiểm tra Firebase config
- Verify user đã đăng nhập
- Check console errors

### 2. Real-time không hoạt động:
- Kiểm tra Firestore rules
- Verify collection structure
- Check network connection

### 3. FCM không hoạt động:
- Kiểm tra VAPID key
- Verify service worker registration
- Check notification permissions

## Performance Tips

1. **Limit notifications**: Chỉ lắng nghe 10 thông báo gần nhất
2. **Debounce updates**: Tránh spam thông báo
3. **Cleanup listeners**: Unsubscribe khi component unmount
4. **Cache strategy**: Sử dụng localStorage cho notifications đã đọc

## Security Considerations

1. **Validate receiverId**: Đảm bảo chỉ gửi thông báo cho đúng người
2. **Sanitize content**: Validate nội dung thông báo
3. **Rate limiting**: Giới hạn số lượng thông báo gửi
4. **Authentication**: Verify user permissions trước khi gửi

## Mở Rộng Tương Lai

1. **Email notifications**: Tích hợp email cho thông báo quan trọng
2. **SMS integration**: Thông báo SMS cho lịch hẹn
3. **Notification templates**: Tạo template cho các loại thông báo
4. **Analytics**: Tracking thống kê thông báo
5. **A/B testing**: Test hiệu quả các format thông báo khác nhau

## Dependencies Mới

```json
{
  "react-toastify": "^11.0.5",
  "firebase": "^12.0.0" (đã có)
}
```

## Kết Luận

Hệ thống thông báo đã được tích hợp hoàn chỉnh với tất cả các chức năng chính của ứng dụng Healthcare KLTN. Hệ thống sử dụng Firestore real-time và toast notifications, đảm bảo người dùng luôn được thông báo kịp thời về các hoạt động quan trọng mà không cần phức tạp hóa với FCM push notifications.