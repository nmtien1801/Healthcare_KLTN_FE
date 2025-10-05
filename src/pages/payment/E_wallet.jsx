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
import { getBalance } from "../../redux/paymentSlice"

const transactionHistory = [
    { id: 1, description: "Thanh toán hóa đơn Internet", date: "12/05/2025", amount: "- 180.000 đ", type: "expense" },
    { id: 2, description: "Nạp tiền từ Vietcombank", date: "10/05/2025", amount: "+ 500.000 đ", type: "income" },
    { id: 3, description: "Rút tiền về MBBank", date: "09/05/2025", amount: "- 1,000.000 đ", type: "expense" },
    { id: 4, description: "Mua sắm tại Shopee", date: "08/05/2025", amount: "- 250.000 đ", type: "expense" },
    { id: 5, description: "Hoàn tiền ưu đãi", date: "07/05/2025", amount: "+ 50.000 đ", type: "income" },
    { id: 6, description: "Chuyển tiền cho bạn A", date: "06/05/2025", amount: "- 120.000 đ", type: "expense" },
    { id: 7, description: "Nạp tiền từ Techcombank", date: "05/05/2025", amount: "+ 750.000 đ", type: "income" },
    { id: 8, description: "Thanh toán Google Ads", date: "04/05/2025", amount: "- 400.000 đ", type: "expense" },
    { id: 9, description: "Nạp tiền điện thoại", date: "03/05/2025", amount: "- 100.000 đ", type: "expense" },
    { id: 10, description: "Thanh toán tiền nước", date: "02/05/2025", amount: "- 150.000 đ", type: "expense" },
    // Thêm nhiều giao dịch hơn để đảm bảo cuộn
]

export default function WalletUIDesktop() {
    const dispatch = useDispatch()
    const [balanceVisible, setBalanceVisible] = useState(true)
    const user = useSelector((state) => state.auth.userInfo)
    const balance = useSelector((state) => state.payment.balance);

    useEffect(() => {
        const fetchBalance = async () => {
            await dispatch(getBalance(user.userId))
        }

        fetchBalance()
    }, [dispatch, balance])

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

                            {/* Cuộn auto */}
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

                {/* FlowPayment chiếm 9/12 */}
                <Col lg={9} className="d-flex">
                    <Card className="shadow-sm border-0 flex-grow-1">
                        <Card.Body className="p-3">
                            {user.role === 'doctor' ? (
                                <div>
                                    <h4>Quản lý Thu nhập & Thanh toán</h4>
                                    <p>Chức năng thanh toán nạp/rút tiền của Bác sĩ sẽ được hiển thị ở đây.</p>
                                </div>
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