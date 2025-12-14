import React, { useState, useEffect, useCallback } from "react";
import {
    Card,
    Button,
    Form,
    Row,
    Col,
    Badge,
    ListGroup,
    Container
} from "react-bootstrap"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CreditCard,
    DollarSign,
    Shield,
    QrCode,
    Wallet,
    Building2,
    Send,
} from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { deposit, createPaymentUrl } from "../../redux/paymentSlice"

const banks = [
    { id: "mbbank", name: "MBBank", fullName: "Ngân hàng TMCP Quân Đội", color: "bg-danger" },
    { id: "vietcombank", name: "Vietcombank", fullName: "Ngân hàng TMCP Ngoại thương Việt Nam", color: "bg-success" },
    { id: "techcombank", name: "Techcombank", fullName: "Ngân hàng TMCP Kỹ thương Việt Nam", color: "bg-danger" },
    { id: "bidv", name: "BIDV", fullName: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", color: "bg-primary" },
    { id: "vietinbank", name: "VietinBank", fullName: "Ngân hàng TMCP Công thương Việt Nam", color: "bg-info" },
    { id: "acb", name: "ACB", fullName: "Ngân hàng TMCP Á Châu", color: "bg-primary" },
]

// Thêm mapping QR cho từng phương thức
const qrImages = {
    bank: "/qrMb.png",
    qr: "/qrMb.png",
}

const paymentMethods = [
    { id: "bank", name: "Quét mã QR ngân hàng", icon: QrCode, recommended: true },
    { id: "qr", name: "Quét mã QR momo", icon: QrCode },
]

const steps = [
    { id: 1, title: "Phương thức thanh toán", description: "Chọn cách thanh toán" },
    { id: 2, title: "Thông tin chuyển tiền", description: "Nhập thông tin giao dịch" },
    { id: 3, title: "Xác nhận", description: "Xem lại và xác nhận" },
]

const ICON_SIZE = 20
const STEP_ICON_SIZE = 16

export default function PaymentFlow() {
    const dispatch = useDispatch()
    const [currentStep, setCurrentStep] = useState(1)
    const user = useSelector((state) => state.auth.userInfo)

    const [paymentData, setPaymentData] = useState({
        amount: "50000", // Số tiền mặc định
        recipient: "NGUYEN MINH TIEN",
        bank: "mbbank", // Ngân hàng mặc định
        accountNumber: "0967273063",
        message: "Chuyển tiền vào ví",
        paymentMethod: "bank", // Phương thức mặc định
    })

    const nextStep = () => {
        if (currentStep === 1 && (paymentData.amount === "" || paymentData.recipient === "" || paymentData.accountNumber === "")) return
        if (currentStep === 2 && !paymentData.paymentMethod) return

        if (currentStep < 3) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    // Hàm định dạng tiền tệ
    const formatCurrency = (amount) => {
        const num = Number.parseInt(amount)
        if (isNaN(num)) return "0đ"
        return new Intl.NumberFormat("vi-VN").format(num) + "đ"
    }

    // Hàm xử lý khi người dùng ấn xác nhận
    const handleConfirm = async () => {
        try {
            const confirm = window.confirm(
                `Bạn đã chuyển ${paymentData.amount} đ vào tài khoản ${paymentData.accountNumber} (${paymentData.recipient}) chưa?`
            )
            if (confirm) {
                await dispatch(deposit({ userId: user.userId, amount: paymentData.amount }))
            }
            // Tạo payment với vn pay
            //     const resCreateUrl = await dispatch(createPaymentUrl({
            //         amount: +paymentData.amount,
            //         orderDescription: paymentData.message || `Chuyển tiền vào ví ${paymentData.amount}đ`,
            //         orderType: 'other',
            //         language: 'vn',
            //         bankCode: ''
            //     }));

            //     if (resCreateUrl?.payload?.data?.paymentUrl) {
            //         window.open(resCreateUrl.payload.data.paymentUrl, "_blank");
            //     } else {
            //         alert('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
            //     }
        } catch (error) {
            console.error('Error creating payment URL:', error);
            alert('Có lỗi xảy ra khi tạo thanh toán: ' + (error.message || 'Vui lòng thử lại'));
        }
    }

    return (
        <div className="bg-light py-5">
            <Container className="py-4">
                <div className="mx-auto" style={{ maxWidth: '1140px' }}>

                    <div className="text-center mb-5">
                        <h1 className="h3 fw-bold mb-2 text-primary">CHUYỂN TIỀN VÀO VÍ NỘI BỘ</h1>
                        <p className="text-muted">
                            Giao dịch nhanh 24/7, an toàn tuyệt đối với công nghệ bảo mật tiên tiến.
                        </p>
                    </div>

                    {/* 1. Progress Steps */}
                    <div className="mb-5">
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            {steps.map((step, index) => (
                                <div key={step.id} className="d-flex align-items-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <div
                                            className={`
                        rounded-circle d-flex align-items-center justify-content-center 
                        ${currentStep === step.id ? "bg-primary text-white" : currentStep > step.id ? "bg-success text-white" : "bg-white border border-secondary text-secondary"}
                      `}
                                            style={{ width: '40px', height: '40px', fontWeight: 'bold' }}
                                        >
                                            {currentStep > step.id ? <Check size={STEP_ICON_SIZE} /> : step.id}
                                        </div>
                                        <div className="text-center mt-2">
                                            <div className="fw-medium small">{step.title}</div>
                                            <div className="text-muted small d-none d-sm-block">{step.description}</div>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="bg-secondary opacity-50 mx-4 mt-n5" style={{ width: '60px', height: '2px' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Main Content & Sidebar */}
                    <Row className="g-4 align-items-stretch">
                        {/* Main Content */}
                        <Col lg={currentStep === 1 ? 12 : 8} className="d-flex">
                            <div className={currentStep === 1 ? "mx-auto w-100 d-flex" : "w-100 d-flex"} style={currentStep === 1 ? { maxWidth: '600px' } : {}}>
                                <Card className="p-4 shadow-sm h-100 w-100">

                                    {/* Step 1: Phương thức thanh toán */}
                                    {currentStep === 1 && (
                                        <div>
                                            <div className="d-flex align-items-center gap-3 mb-4">
                                                <div className="p-2 rounded bg-primary bg-opacity-10">
                                                    <Wallet size={ICON_SIZE} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="h5 fw-semibold mb-0">Bước 1: Phương thức thanh toán</h2>
                                                    <p className="text-muted small mb-0">Chọn nguồn tiền để thực hiện giao dịch</p>
                                                </div>
                                            </div>

                                            <div>
                                                <ListGroup variant="flush">
                                                    {paymentMethods.map((method) => {
                                                        const Icon = method.icon
                                                        return (
                                                            <ListGroup.Item
                                                                key={method.id}
                                                                action
                                                                onClick={() =>
                                                                    setPaymentData({ ...paymentData, paymentMethod: method.id })
                                                                }
                                                                className={`d-flex align-items-center py-3 
            ${paymentData.paymentMethod === method.id
                                                                        ? "bg-primary bg-opacity-10 border-primary"
                                                                        : "bg-white border-0"}`}
                                                            >
                                                                <Form.Check
                                                                    type="radio"
                                                                    id={`method-${method.id}`}
                                                                    name="paymentMethod"
                                                                    value={method.id}
                                                                    checked={paymentData.paymentMethod === method.id}
                                                                    onChange={() =>
                                                                        setPaymentData({ ...paymentData, paymentMethod: method.id })
                                                                    }
                                                                    className="me-3 flex-shrink-0"
                                                                />
                                                                <Icon size={24} className="text-primary me-3 flex-shrink-0" />
                                                                <div className="flex-grow-1 p-3">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        <span className="fw-medium">{method.name}</span>
                                                                        {method.recommended && (
                                                                            <Badge bg="secondary" className="small">
                                                                                Khuyến nghị
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {paymentData.paymentMethod === method.id && (
                                                                    <Check
                                                                        size={STEP_ICON_SIZE}
                                                                        className="text-primary ms-2 flex-shrink-0"
                                                                    />
                                                                )}
                                                            </ListGroup.Item>
                                                        )
                                                    })}
                                                </ListGroup>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Thông tin chuyển tiền */}
                                    {currentStep === 2 && (
                                        <div>
                                            <div className="d-flex align-items-center gap-3 mb-4">
                                                <div className="p-2 rounded bg-primary bg-opacity-10">
                                                    <CreditCard size={ICON_SIZE} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="h5 fw-semibold mb-0">Bước 2: Thông tin chuyển tiền</h2>
                                                    <p className="text-muted small mb-0">Nhập thông tin người nhận và số tiền</p>
                                                </div>
                                            </div>

                                            <Form>
                                                <Row className="mb-3 g-3">
                                                    <Col md={6}>
                                                        <Form.Group controlId="recipient">
                                                            <Form.Label className="small fw-medium">Tên người nhận</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={paymentData.recipient}
                                                                onChange={(e) => setPaymentData({ ...paymentData, recipient: e.target.value })}
                                                                placeholder="NGUYEN MINH TIEN"
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="accountNumber">
                                                            <Form.Label className="small fw-medium">Số tài khoản</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={paymentData.accountNumber}
                                                                onChange={(e) => setPaymentData({ ...paymentData, accountNumber: e.target.value })}
                                                                placeholder="123456789"
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Form.Group controlId="amount" className="mb-3">
                                                    <Form.Label className="small fw-medium">Số tiền nạp ví</Form.Label>
                                                    <div className="input-group">
                                                        <Form.Control
                                                            type="number"
                                                            value={paymentData.amount}
                                                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                                            placeholder="Nhập số tiền"
                                                            required
                                                        />
                                                        <span className="input-group-text text-muted">đ</span>
                                                    </div>
                                                </Form.Group>

                                                <Form.Group controlId="message" className="mb-3">
                                                    <Form.Label className="small fw-medium">Lời nhắn</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={paymentData.message}
                                                        onChange={(e) => setPaymentData({ ...paymentData, message: e.target.value })}
                                                        placeholder="Nhập lời nhắn (tùy chọn)"
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    )}

                                    {/* Step 3: Xác nhận */}
                                    {currentStep === 3 && (
                                        <div>
                                            <div className="d-flex align-items-center gap-3 mb-4">
                                                <div className="p-2 rounded bg-primary bg-opacity-10">
                                                    <Shield size={ICON_SIZE} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h2 className="h5 fw-semibold mb-0">Bước 3: Xác nhận giao dịch</h2>
                                                    <p className="text-muted small mb-0">Kiểm tra thông tin trước khi xác nhận chuyển tiền</p>
                                                </div>
                                            </div>

                                            <div className="bg-light p-4 rounded border">
                                                <h6 className="fw-bold mb-3 text-secondary">Chi tiết người nhận</h6>
                                                <Row className="g-3 small">
                                                    <Col xs={6}>
                                                        <span className="text-muted">Người nhận:</span>
                                                        <div className="fw-medium">{paymentData.recipient}</div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span className="text-muted">Ngân hàng:</span>
                                                        <div className="fw-medium">{banks.find((b) => b.id === paymentData.bank)?.name}</div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span className="text-muted">Số tài khoản:</span>
                                                        <div className="fw-medium">{paymentData.accountNumber}</div>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <span className="text-muted">Phương thức TT:</span>
                                                        <div className="fw-medium">
                                                            {paymentMethods.find((m) => m.id === paymentData.paymentMethod)?.name}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                {paymentData.message && (
                                                    <div className="mt-3 pt-3 border-top">
                                                        <span className="text-muted small">Lời nhắn:</span>
                                                        <div className="small">{paymentData.message}</div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 rounded bg-success bg-opacity-10 border border-success border-opacity-25 mt-3">
                                                <div className="d-flex align-items-center gap-2 text-success small">
                                                    <Shield size={16} />
                                                    <span className="fw-medium">Giao dịch được bảo mật</span>
                                                </div>
                                                <p className="small text-success text-opacity-75 mt-1 mb-0">
                                                    Thông tin của bạn được mã hóa và bảo vệ.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- Navigation --- */}
                                    <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={prevStep}
                                            disabled={currentStep === 1}
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <ArrowLeft size={16} />
                                            Quay lại
                                        </Button>

                                        {currentStep < 3 ? (
                                            <Button onClick={nextStep} className="d-flex align-items-center gap-2">
                                                Tiếp tục
                                                <ArrowRight size={16} />
                                            </Button>
                                        ) : (
                                            <Button variant="primary" onClick={handleConfirm} className="d-flex align-items-center gap-2">
                                                <Send size={16} />
                                                Xác nhận chuyển tiền
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </Col>

                        {/* Sidebar Tóm tắt (4 cột trên màn hình lớn) - Chỉ hiện từ bước 2 */}
                        {currentStep > 1 && (
                            <Col lg={4} className="d-flex">
                                <Card className="p-4 shadow-sm h-100 w-100">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 rounded bg-primary bg-opacity-10">
                                            <DollarSign size={ICON_SIZE} className="text-primary" />
                                        </div>
                                        <h3 className="h6 fw-semibold mb-0">Tóm tắt giao dịch</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="d-flex justify-content-between align-items-center small">
                                            <span className="text-muted">Số tiền chuyển:</span>
                                            <span className="fw-medium">{formatCurrency(paymentData.amount)}</span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center small">
                                            <span className="text-muted">Phí giao dịch:</span>
                                            <span className="fw-medium text-success">Miễn phí</span>
                                        </div>

                                        <hr className="my-2" />

                                        <div className="d-flex justify-content-between align-items-center h5 fw-bold">
                                            <span>Tổng cộng:</span>
                                            <span className="text-primary">{formatCurrency(paymentData.amount)}</span>
                                        </div>

                                        <hr className="my-2" />
                                        <h6 className="fw-bold mb-2 text-secondary">Thông tin người nhận</h6>
                                        <div className="small space-y-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Tên:</span>
                                                <span className="fw-medium">{paymentData.recipient}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Tài khoản:</span>
                                                <span className="fw-medium">{paymentData.accountNumber}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Ngân hàng:</span>
                                                <span className="fw-medium">{banks.find((b) => b.id === paymentData.bank)?.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 rounded bg-info bg-opacity-10">
                                        <div className="d-flex align-items-center gap-2 small">
                                            <Shield size={16} className="text-primary" />
                                            <span className="fw-medium">An toàn giao dịch</span>
                                        </div>
                                        <p className="small text-muted mt-1 mb-0">Đảm bảo tiền được chuyển đến đúng tài khoản đích.</p>
                                    </div>

                                    {/* QR Code Section */}
                                    <div className="mt-4 p-3 rounded bg-light border text-center">
                                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                                            <QrCode size={16} className="text-primary" />
                                            <span className="fw-medium small">Mã QR thanh toán</span>
                                        </div>
                                        <div className="bg-white p-3 rounded border mx-auto d-inline-block">
                                            <div
                                                className="bg-dark mx-auto"
                                                style={{ width: '120px', height: '120px' }}
                                            >
                                                <img
                                                    src={qrImages[paymentData.paymentMethod]}
                                                    alt="QR code"
                                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                />
                                            </div>
                                        </div>
                                        <p className="small text-muted mt-2 mb-0">
                                            Quét mã để thanh toán {formatCurrency(paymentData.amount)}
                                        </p>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>
            </Container>
        </div>
    )
}