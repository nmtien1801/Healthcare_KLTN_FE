// File: WalletUIDesktop.jsx

"use client"

import { useState } from "react"
// Import các component của React-Bootstrap
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

// --- Dữ liệu tĩnh/mô phỏng ---

const currentBalance = "2,450,000" 

const transactionHistory = [
    { id: 1, description: "Thanh toán hóa đơn Internet", date: "12/05/2025", amount: "- 180.000 đ", type: "expense" },
    { id: 2, description: "Nạp tiền từ Vietcombank", date: "10/05/2025", amount: "+ 500.000 đ", type: "income" },
    { id: 3, description: "Rút tiền về MBBank", date: "09/05/2025", amount: "- 1,000.000 đ", type: "expense" },
] // Giảm bớt lịch sử để hiển thị đẹp hơn trong Sidebar (Col lg=4)

export default function WalletUIDesktop() {
    const [balanceVisible, setBalanceVisible] = useState(true)

    const handleBalanceToggle = () => {
        setBalanceVisible(!balanceVisible)
    }

    return (
        <div style={{  }}>
                <Row className="g-4">
                    {/* Cột 4/12: Giao diện Ví Điện Tử (Sidebar) */}
                    <Col lg={3} className="bg-light">
                        {/* 1. Số dư khả dụng (Sử dụng cỡ chữ nhỏ hơn) */}
                        <Card className="shadow-sm border-0 mb-4">
                            <Card.Body className="p-3 bg-primary text-white rounded-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Wallet size={20} className="me-2" />
                                    <h6 className="mb-0 fw-bold">Số dư khả dụng</h6>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                    {/* Sử dụng cỡ chữ nhỏ hơn (h3 thay vì display-4) */}
                                    <h3 className="fw-bolder mb-0">
                                        {balanceVisible ? `${currentBalance} đ` : '*******'}
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

                                {/* Sử dụng xs=2 để hai nút Nạp/Rút nằm cạnh nhau trong cột 4 */}
                                <Row xs={2} className="g-3 text-center">
                                    
                                    {/* Nạp tiền */}
                                    <Col style={{ cursor: 'pointer' }}>
                                        <div className="p-3 rounded-3 shadow-sm bg-success bg-opacity-10 border border-success hover-shadow-lg">
                                            <Download size={28} className="text-success mb-1" />
                                            <div className="fw-bold text-success small">NẠP TIỀN</div>
                                        </div>
                                    </Col>
                                    
                                    {/* Rút tiền */}
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
                        <Card className="shadow-sm border-0">
                            <Card.Body className="p-3">
                                <div className="d-flex align-items-center mb-3">
                                    <History size={20} className="me-2 text-secondary" />
                                    <h6 className="fw-bold mb-0 text-secondary">Giao dịch Gần đây</h6>
                                </div>
                                
                                <ListGroup variant="flush">
                                    {transactionHistory.map((item) => (
                                        <ListGroup.Item 
                                            key={item.id} 
                                            className="d-flex justify-content-between align-items-center px-0 py-2"
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className={`p-1 rounded-circle me-2 
                                                    ${item.type === 'income' ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}
                                                >
                                                    <TrendingUp size={16} className={item.type === 'income' ? 'text-success' : 'text-danger'} />
                                                </div>
                                                <div>
                                                    <div className="fw-medium small">{item.description}</div>
                                                    <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>{item.date}</small>
                                                </div>
                                            </div>
                                            <span 
                                                className={`fw-bold small ${item.type === 'income' ? 'text-success' : 'text-danger'}`}
                                            >
                                                {item.amount}
                                            </span>
                                        </ListGroup.Item>
                                    ))}
                                    {/* Nút xem thêm */}
                                    <ListGroup.Item 
                                        className="d-flex justify-content-between align-items-center text-primary fw-medium small px-0 pt-3" 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Xem tất cả lịch sử
                                        <ChevronRight size={14} />
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Cột 8/12: Khu vực FlowPayment */}
                    <Col lg={9}>
                        <FlowPayment/>
                    </Col>
                </Row>
            </div>
    )
}