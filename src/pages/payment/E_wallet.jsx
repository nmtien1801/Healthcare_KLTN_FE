import React, { useState, useEffect, useCallback } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    ListGroup
} from "react-bootstrap"
import {
    Wallet,
    Download,
    ReceiptText,
    TrendingUp,
    ChevronRight,
    Eye,
    EyeOff,
    History,
} from "lucide-react"
import FlowPayment from "./FlowPayment"
import { useSelector, useDispatch } from "react-redux"
import { getBalance, deposit } from "../../redux/paymentSlice"
import ApiDoctor from "../../apis/ApiDoctor";
// 1. Import RevenueTab
import RevenueTab from "../doctor/Revenue";

const transactionHistory = [
    // { id: 1, description: "Thanh toán hóa đơn Internet", date: "12/05/2025", amount: "- 180.000 đ", type: "expense" },
    // { id: 2, description: "Nạp tiền từ Vietcombank", date: "10/05/2025", amount: "+ 500.000 đ", type: "income" },
    // { id: 3, description: "Rút tiền về MBBank", date: "09/05/2025", amount: "- 1,000.000 đ", type: "expense" },
    // { id: 4, description: "Mua sắm tại Shopee", date: "08/05/2025", amount: "- 250.000 đ", type: "expense" },
    // { id: 5, description: "Hoàn tiền ưu đãi", date: "07/05/2025", amount: "+ 50.000 đ", type: "income" },
    // { id: 6, description: "Chuyển tiền cho bạn A", date: "06/05/2025", amount: "- 120.000 đ", type: "expense" },
    // { id: 7, description: "Nạp tiền từ Techcombank", date: "05/05/2025", amount: "+ 750.000 đ", type: "income" },
    // { id: 8, description: "Thanh toán Google Ads", date: "04/05/2025", amount: "- 400.000 đ", type: "expense" },
    // { id: 9, description: "Nạp tiền điện thoại", date: "03/05/2025", amount: "- 100.000 đ", type: "expense" },
    // { id: 10, description: "Thanh toán tiền nước", date: "02/05/2025", amount: "- 150.000 đ", type: "expense" },
]

export default function WalletUIDesktop() {
    const dispatch = useDispatch()
    const [balanceVisible, setBalanceVisible] = useState(true)
    const user = useSelector((state) => state.auth.userInfo)
    const balance = useSelector((state) => state.payment.balance);
    const BOOKING_FEE = import.meta.env.VITE_BOOKING_FEE;

    useEffect(() => {
        const fetchBalance = async () => {
            await dispatch(getBalance(user.userId))
        }

        fetchBalance()
    }, [dispatch, balance])

    // ví bác sĩ
    useEffect(() => {
        let timeouts = [];
        if (user.role === 'doctor') {
            const fetchAppointments = async () => {
                try {
                    const resToday = await ApiDoctor.getAppointmentsToday();
                    console.log('aaaa ', resToday);

                    // ✅ Chỉ lấy các lịch hẹn có status = "confirmed"
                    const confirmedAppointments = resToday.filter(
                        (appointment) => appointment.status === "confirmed"
                    );

                    const now = new Date();
                    for (const appointment of confirmedAppointments) {
                        const baseDate = new Date(appointment.date);
                        const [hours, minutes] = appointment.time.split(":").map(Number);

                        // Tạo thời điểm lịch hẹn đầy đủ (theo giờ địa phương)
                        const appointmentTime = new Date(
                            baseDate.getFullYear(),
                            baseDate.getMonth(),
                            baseDate.getDate(),
                            hours,
                            minutes,
                            0
                        );

                        // +30 phút
                        const alertTime = new Date(appointmentTime.getTime() + 30 * 60 * 1000);
                        const msUntilAlert = alertTime - now;

                        console.log(
                            `Lịch hẹn ${appointment._id || ""} (confirmed) sẽ chạy sau ${Math.round(
                                msUntilAlert / 60000
                            )} phút`
                        );

                        if (msUntilAlert > 0) {
                            // Hẹn dispatch đúng thời điểm
                            const timeout = setTimeout(async () => {
                                try {
                                    await dispatch(deposit({ userId: user.userId, amount: BOOKING_FEE }));
                                    await ApiDoctor.updateAppointmentStatus(appointment._id, { status: "completed" });
                                } catch (err) {
                                    console.error("Lỗi dispatch deposit:", err);
                                }
                            }, msUntilAlert);
                            timeouts.push(timeout);
                        } else {
                            // Nếu đã qua 30 phút thì thực hiện ngay
                            try {
                                await dispatch(deposit({ userId: user.userId, amount: BOOKING_FEE }));
                                await ApiDoctor.updateAppointmentStatus(appointment._id, { status: "completed" });
                            } catch (err) {
                                console.error("Lỗi dispatch deposit:", err);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Lỗi lấy appointments:", err);
                }
            };

            fetchAppointments();
        }

        return () => {
            timeouts.forEach(clearTimeout);
            timeouts = [];
        };
    }, [dispatch, user.userId]);

    const handleBalanceToggle = () => {
        setBalanceVisible(!balanceVisible)
    }

    return (
        <div className="bg-light p-2" style={{ minHeight: "100vh" }}>
            <Row className="g-4 h-100">
                {/* Sidebar 3/12 */}
                <Col lg={3} className="d-flex flex-column">
                    {/* 1. Số dư khả dụng */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body className="p-3 bg-primary text-white rounded-3">
                            <div className="d-flex align-items-center mb-2">
                                <Wallet size={20} className="me-2" />
                                <h6 className="mb-0 fw-bold">Số dư khả dụng</h6>
                            </div>

                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="fw-bolder mb-0">
                                    {balanceVisible ? `${balance} đ` : '*******'}
                                </h3>
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={handleBalanceToggle}
                                    className="rounded-circle p-1 shadow"
                                >
                                    {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* 2. Dịch vụ Phổ biến (Nạp & Rút) */}
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body className="p-3">
                            <h6 className="fw-bold text-secondary mb-3">Dịch vụ chính</h6>

                            <Row xs={2} className="g-3 text-center">
                                <Col style={{ cursor: 'pointer' }}>
                                    <div className="p-3 rounded-3 shadow-sm bg-success bg-opacity-10 border border-success hover-shadow-lg">
                                        <Download size={28} className="text-success mb-1" />
                                        <div className="fw-bold text-success small">NẠP TIỀN</div>
                                    </div>
                                </Col>
                                <Col style={{ cursor: 'pointer' }}>
                                    <div className="p-3 rounded-3 shadow-sm bg-danger bg-opacity-10 border border-danger hover-shadow-lg">
                                        <ReceiptText size={28} className="text-danger mb-1" />
                                        <div className="fw-bold text-danger small">RÚT TIỀN</div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* 3. Giao dịch Gần đây */}
                    <Card className="shadow-sm border-0 flex-grow-1 d-flex flex-column">
                        <Card.Body className="p-3 d-flex flex-column">
                            <div className="d-flex align-items-center mb-3">
                                <History size={20} className="me-2 text-secondary" />
                                <h6 className="fw-bold mb-0 text-secondary">Giao dịch Gần đây</h6>
                            </div>
                            <div className="flex-grow-1 overflow-auto pe-2">
                                <ListGroup variant="flush">
                                    {transactionHistory.map((item) => (
                                        <ListGroup.Item
                                            key={item.id}
                                            className="d-flex justify-content-between align-items-center px-0 py-2"
                                        >
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className={`p-1 rounded-circle me-2 ${item.type === "income"
                                                        ? "bg-success bg-opacity-10"
                                                        : "bg-danger bg-opacity-10"
                                                        }`}
                                                >
                                                    <TrendingUp
                                                        size={16}
                                                        className={
                                                            item.type === "income"
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <div className="fw-medium small">{item.description}</div>
                                                    <small
                                                        className="text-muted d-block"
                                                        style={{ fontSize: "0.7rem" }}
                                                    >
                                                        {item.date}
                                                    </small>
                                                </div>
                                            </div>
                                            <span
                                                className={`fw-bold small ${item.type === "income"
                                                    ? "text-success"
                                                    : "text-danger"
                                                    }`}
                                            >
                                                {item.amount}
                                            </span>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Phần nội dung chính 9/12 */}
                <Col lg={9} className="d-flex">
                    <Card className="shadow-sm border-0 flex-grow-1">
                        <Card.Body className="p-3">
                            {user.role === 'doctor' ? (
                                // 2. Thay thế khối div placeholder bằng RevenueTab
                                <RevenueTab />
                            ) : (
                                <FlowPayment />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>

    )
}