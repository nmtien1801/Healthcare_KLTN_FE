import React, { useState, useEffect } from "react";
import { api } from "../../../apis/assistant";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Paper,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Checkbox,
    Divider,
} from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBox from "./ChatBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendMedicine, selectMedicineLoading, selectTrendMedicine, selectMedicineError, applyMedicines, fetchMedicines } from "../../../redux/medicineAiSlice";

const FormPatient = () => {
    const currentYear = new Date().getFullYear();
    const dispatch = useDispatch();
    let user = useSelector((state) => state.auth.userInfo);
    const medicineLoading = useSelector(selectMedicineLoading);
    const trendMedicine = useSelector(selectTrendMedicine);
    const medicineError = useSelector(selectMedicineError);

    const [formData, setFormData] = useState({
        year: currentYear,
        gender: "female",
        age: 45,
        location: "Việt Nam",
        race_AfricanAmerican: 0,
        race_Asian: 0,
        race_Caucasian: 1,
        race_Hispanic: 0,
        race_Other: 0,
        hypertension: 0,
        heart_disease: 0,
        smoking_history: "current",
        bmi: 28.4,
        hbA1c_level: 6.2,
        blood_glucose_level: 125,
    });

    const [medicines, setMedicines] = useState({
        sang: [],
        trua: [],
        toi: [],
    });

    // Đơn thuốc: not_created | created | applied
    const [prescriptionStatus, setPrescriptionStatus] = useState("not_created");

    const [loading, setLoading] = useState(false);
    const [loadingAsk, setLoadingAsk] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "💉 Xin chào! Vui lòng nhập thông tin bệnh nhân để dự đoán hoặc đặt câu hỏi.",
        },
    ]);

    // Monitor medicine data changes
    useEffect(() => {
        if (trendMedicine && prescriptionStatus === "created") {
            let medicineText = "💊 Đã nhận được khuyến nghị thuốc từ AI:\n";
            if (trendMedicine.data) {
                medicineText += `📋 ${trendMedicine.data}`;
            } else {
                medicineText += `📋 ${JSON.stringify(trendMedicine)}`;
            }
            setMessages((prev) => [...prev, {
                sender: "bot",
                text: medicineText
            }]);
        }
    }, [trendMedicine, prescriptionStatus]);

    // Monitor medicine errors
    useEffect(() => {
        if (medicineError) {
            setMessages((prev) => [...prev, {
                sender: "bot",
                text: `❌ Lỗi khi lấy dữ liệu thuốc: ${medicineError}`
            }]);
        }
    }, [medicineError]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (checked ? 1 : 0) : isNaN(value) ? value : Number(value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const infoText = `
Hồ sơ bệnh nhân:    
▸ Tuổi: ${formData.age}
▸ Giới tính: ${formData.gender === "female" ? "Nữ" : "Nam"}
▸ Khu vực: ${formData.location}
▸ Huyết áp cao: ${formData.hypertension ? "Có" : "Không"}
▸ Bệnh tim: ${formData.heart_disease ? "Có" : "Không"}
▸ Hút thuốc: ${formData.smoking_history === "never" ? "Không" : "Có"}
▸ BMI: ${formData.bmi}
▸ HbA1c: ${formData.hbA1c_level}%
▸ Đường huyết: ${formData.blood_glucose_level} mg/dL
`;


        setMessages((prev) => [
            ...prev,
            { sender: "user", text: infoText.trim() },
        ]);
        try {
            const res = await api.post("/predict", formData);

            const botMsg = `
🔍 Kết quả: ${res.data.prediction === 1 ? "Có nguy cơ tiểu đường" : "Không có nguy cơ tiểu đường"}
📊 Xác suất: ${(res.data.probability).toFixed(2)}%
🩺 Chẩn đoán: ${res.data.diagnosis || "Không có thông tin"}
────────────────────────────
👉 Lưu ý: Kết quả chỉ mang tính hỗ trợ tham khảo. Vui lòng trao đổi thêm với bác sĩ để được tư vấn và chẩn đoán chính xác.
`;

            setMessages((prev) => [...prev, { sender: "bot", text: botMsg.trim() }]);

        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Có lỗi xảy ra. Vui lòng thử lại!" },
            ]);
        } finally {
            setLoading(false);
        }

    };

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoadingAsk(true);
        setMessages((prev) => [...prev, { sender: "user", text: question }]);
        setQuestion("");

        try {
            const res = await api.post("/ask", { query: question });
            setMessages((prev) => [...prev, { sender: "bot", text: res.data.answer }]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "🤖 Xin lỗi, tôi không thể trả lời câu hỏi này." },
            ]);
        } finally {
            setLoadingAsk(false);
        }
    };

    // Cập nhật trạng thái đơn thuốc theo dữ liệu hiện có
    React.useEffect(() => {
        const hasAny = (arr) => Array.isArray(arr) && arr.length > 0;
        const anyMedicines = hasAny(medicines.sang) || hasAny(medicines.trua) || hasAny(medicines.toi);
        if (prescriptionStatus !== "applied") {
            if (anyMedicines) {
                setPrescriptionStatus("created");
            } else {
                setPrescriptionStatus("not_created");
            }
        }
    }, [medicines, prescriptionStatus]);


    // lấy thuốc 
    const categorizeMedicines = (list) => {
        const sang = [];
        const trua = [];
        const toi = [];

        const instructions = {
            sang: "uống sau ăn",
            trua: "uống trước ăn",
            toi: "tiêm trước khi đi ngủ",
        };

        list.forEach((m) => {
            const hour = m.time.split("T")[1].split(":")[0];
            const hourNum = parseInt(hour, 10);

            if (hourNum >= 5 && hourNum < 11) {
                sang.push(`${m.name} ${m.lieu_luong} - ${instructions.sang}`);
            } else if (hourNum >= 11 && hourNum < 17) {
                trua.push(`${m.name} ${m.lieu_luong} - ${instructions.trua}`);
            } else if (hourNum >= 17 && hourNum <= 22) {
                toi.push(`${m.name} ${m.lieu_luong} - ${instructions.toi}`);
            }
        });

        return { sang, trua, toi };
    };

    useEffect(() => {
        const fetchMedicine = async () => {
            const today = new Date();
            const res = await dispatch(fetchMedicines({ userId: user.userId, date: today }));

            if (res?.payload?.DT) {
                const data = res.payload.DT;

                // ✅ Nếu DB đã có thuốc, coi như đơn đã được áp dụng
                if (data.length > 0) {
                    setPrescriptionStatus("applied");
                }

                const categorized = categorizeMedicines(data);
                setMedicines(categorized);

                // Nếu chưa có thuốc, giữ logic cũ
                if (data.length === 0) {
                    const hasAny = (arr) => Array.isArray(arr) && arr.length > 0;
                    if (hasAny(categorized.sang) || hasAny(categorized.trua) || hasAny(categorized.toi)) {
                        setPrescriptionStatus("created");
                    } else {
                        setPrescriptionStatus("not_created");
                    }
                }
            }
        };

        fetchMedicine();
    }, [dispatch, user.userId]);

    const createPrescription = async () => {
        try {
            const medicineData = {
                age: formData.age,
                gender: formData.gender === "female" ? "female" : "male",
                BMI: formData.bmi,
                HbA1c: formData.hbA1c_level,
                bloodSugar: formData.blood_glucose_level
            };

            let res = await dispatch(fetchTrendMedicine(medicineData)).unwrap();

            // 🚀 cập nhật medicines
            setMedicines(res);

            setPrescriptionStatus("created");
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "📝 Đã tạo đơn thuốc dựa trên thông tin bệnh nhân và AI phân tích." }
            ]);
        } catch (error) {
            console.error("Lỗi khi tạo đơn thuốc:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Có lỗi xảy ra khi tạo đơn thuốc. Vui lòng thử lại!" }
            ]);
        }
    };

    function parseMedicine(item, time, userId) {
        const [thuocLieu, cachDung] = item.split(" - ");
        const parts = thuocLieu?.trim().split(" ") || [];
        const idx = parts.findIndex(p => /\d/.test(p));

        let thuoc = thuocLieu || "";
        let lieuluong = "";

        if (idx !== -1) {
            thuoc = parts.slice(0, idx).join(" ");
            lieuluong = parts.slice(idx).join(" ");
        }

        return {
            userId,
            name: thuoc.trim(),
            lieu_luong: lieuluong.trim(),
            Cachdung: cachDung?.trim(),
            time: time,
            status: false
        };
    }

    const applyPrescriptionOneWeek = async () => {
        if (prescriptionStatus !== "created") return;

        let data = {
            email: user.email,
            medicinePlan: medicines,
        }

        Object.entries(medicines).forEach(([time, arr]) => {
            arr.forEach(item => {
                const parsed = parseMedicine(item, time, user?.userId);
                console.log("=> parse:", parsed);
                dispatch(applyMedicines(parsed));
            });
        });

        setPrescriptionStatus("applied");
        setMessages((prev) => [...prev, { sender: "bot", text: "✅ Đã áp dụng đơn thuốc trong 1 tuần. Hãy theo dõi chỉ số thường xuyên." }]);
    };

    return (
        <Box className="container" sx={{ maxWidth: "1400px", height: "85vh" }}>
            <div className="row g-3 h-100">
                {/* Form Section */}
                <div className="col-12 col-md-6 d-flex">
                    <Paper
                        elevation={3}
                        className="flex-grow-1 d-flex flex-column"
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            height: "100%",
                            overflow: "hidden",
                            minHeight: 0,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <MedicalInformationIcon
                                color="primary"
                                sx={{ fontSize: 28, mr: 1 }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(135deg, #60a5fa, #7c3aed)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent", // Giúp chữ hiển thị gradient
                                }}
                            >
                                Thông tin bệnh nhân
                            </Typography>

                        </Box>
                        <Divider sx={{ mb: 3 }} />

                        {/* Scrollable form */}
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                pr: 1,
                                "&::-webkit-scrollbar": { width: "8px" },
                                "&::-webkit-scrollbar-thumb": {
                                    background:
                                        "linear-gradient(135deg, #8fddeeff, #d87dbaff)",
                                    borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background:
                                        "linear-gradient(135deg, #64b5f6, #2196f3)",
                                },
                            }}
                        >
                            <div className="row g-3">
                                {/* Tuổi + Giới tính */}
                                <div className="col-6 mt-4">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Tuổi"
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ style: { fontSize: "0.95rem" } }}
                                        inputProps={{
                                            style: { fontSize: "0.95rem", padding: "10px" },
                                        }}
                                    />
                                </div>
                                <div className="col-6 mt-4">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel sx={{ fontSize: "0.95rem" }} shrink>
                                            Giới tính
                                        </InputLabel>
                                        <Select
                                            labelId="gender-label"
                                            label="Giới tính"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            sx={{ fontSize: "0.95rem" }}
                                        >
                                            <MenuItem value="female">Nữ</MenuItem>
                                            <MenuItem value="male">Nam</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* BMI + HbA1c */}
                                <div className="col-4">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="BMI"
                                        type="number"
                                        step="0.1"
                                        name="bmi"
                                        value={formData.bmi}
                                        onChange={handleChange}
                                        InputLabelProps={{ style: { fontSize: "0.95rem" } }}
                                        inputProps={{
                                            style: { fontSize: "0.95rem", padding: "10px" },
                                        }}
                                    />
                                </div>
                                <div className="col-4">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="HbA1c (%)"
                                        type="number"
                                        step="0.1"
                                        name="hbA1c_level"
                                        value={formData.hbA1c_level}
                                        onChange={handleChange}
                                        InputLabelProps={{ style: { fontSize: "0.95rem" } }}
                                        inputProps={{
                                            style: { fontSize: "0.95rem", padding: "10px" },
                                        }}
                                    />
                                </div>

                                {/* Đường huyết */}
                                <div className="col-4">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Đường huyết (mg/dL)"
                                        type="number"
                                        name="blood_glucose_level"
                                        value={formData.blood_glucose_level}
                                        onChange={handleChange}
                                        InputLabelProps={{ style: { fontSize: "0.95rem" } }}
                                        inputProps={{
                                            style: { fontSize: "0.95rem", padding: "10px" },
                                        }}
                                    />
                                </div>

                                {/* Tiền sử bệnh */}
                                <div className="col-6">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.hypertension === 1}
                                                onChange={handleChange}
                                                name="hypertension"
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                Huyết áp cao
                                            </Typography>
                                        }
                                    />
                                </div>
                                <div className="col-6">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.heart_disease === 1}
                                                onChange={handleChange}
                                                name="heart_disease"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="body2">Bệnh tim</Typography>}
                                    />
                                </div>

                                {/* Lịch sử hút thuốc */}
                                <div className="col-12">
                                    <FormControl size="small" fullWidth>
                                        <InputLabel
                                            id="smoking-label"
                                            sx={{ fontSize: "0.95rem" }}
                                        >
                                            Lịch sử hút thuốc
                                        </InputLabel>
                                        <Select
                                            labelId="smoking-label"
                                            label="Lịch sử hút thuốc"
                                            name="smoking_history"
                                            value={formData.smoking_history}
                                            onChange={handleChange}
                                            sx={{ fontSize: "0.95rem" }}
                                        >
                                            <MenuItem value="never">Không bao giờ</MenuItem>
                                            <MenuItem value="ever">Từng hút</MenuItem>
                                            <MenuItem value="current">Hiện tại</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            {/* Medicine Plan */}
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    mt: 3,
                                    borderRadius: 3,
                                    bgcolor: prescriptionStatus === "not_created" ? "rgba(245, 158, 11, 0.08)" : "rgba(46, 125, 50, 0.05)",
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "bold", color: prescriptionStatus === "not_created" ? "warning.main" : "success.main" }}
                                >
                                    📋 Kế hoạch dùng thuốc
                                </Typography>
                                {prescriptionStatus === "not_created" && (
                                    <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
                                        Chưa có đơn thuốc. Vui lòng khởi tạo để có thể áp dụng theo dõi.
                                    </Typography>
                                )}
                                <ul
                                    style={{
                                        paddingLeft: "1rem",
                                        marginBottom: "0.3rem",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    <li>
                                        <strong>Sáng:</strong>{" "}
                                        {medicines?.sang?.length > 0
                                            ? medicines.sang.join(", ")
                                            : "Không dùng"}
                                    </li>
                                    <li>
                                        <strong>Trưa:</strong>{" "}
                                        {medicines?.trua?.length > 0
                                            ? medicines.trua.join(", ")
                                            : "Không dùng"}
                                    </li>
                                    <li>
                                        <strong>Tối:</strong>{" "}
                                        {medicines?.toi?.length > 0
                                            ? medicines.toi.join(", ")
                                            : "Không dùng"}
                                    </li>
                                </ul>
                                <Box display="flex" justifyContent="flex-end" gap={1.5}>
                                    {prescriptionStatus === "not_created" && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            onClick={createPrescription}
                                            disabled={medicineLoading}
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                        >
                                            {medicineLoading ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                "Tạo đơn thuốc"
                                            )}
                                        </Button>
                                    )}
                                    {prescriptionStatus === "created" && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={applyPrescriptionOneWeek}
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                        >
                                            Áp dụng 1 tuần
                                        </Button>
                                    )}
                                    {prescriptionStatus === "applied" && (
                                        <Button
                                            variant="contained"
                                            color="inherit"
                                            size="small"
                                            disabled
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                        >
                                            Đã áp dụng
                                        </Button>
                                    )}
                                </Box>
                            </Paper>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                endIcon={!loading && <SendIcon />}
                                className="gradient-color-parent"
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    fontSize: "0.95rem",
                                    textTransform: "none",
                                    borderRadius: 2,
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Dự đoán nguy cơ"
                                )}
                            </Button>
                        </Box>
                    </Paper>
                </div>

                {/* Chat Section */}
                <div className="col-12 col-md-6 d-flex">
                    <Paper
                        elevation={2}
                        className="flex-grow-1 d-flex flex-column"
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: 3,
                            height: "100%",
                            minHeight: 0,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <ChatBubbleOutlineIcon
                                color="primary"
                                sx={{ fontSize: 26, mr: 1 }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    background: "linear-gradient(135deg, #60a5fa, #7c3aed)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent", // Giúp chữ hiển thị gradient
                                }}
                            >
                                Kết quả & Chat bot
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box
                            sx={{
                                flex: '1 1 0%',
                                height: 0,
                                minHeight: 0,
                                overflowY: "auto",
                                pr: 1,
                                display: "flex",
                                flexDirection: "column",
                                "&::-webkit-scrollbar": { width: "8px" },
                                "&::-webkit-scrollbar-thumb": {
                                    background:
                                        "linear-gradient(135deg, #8fddeeff, #d87dbaff)",
                                    borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background:
                                        "linear-gradient(135deg, #64b5f6, #2196f3)",
                                },
                            }}
                        >
                            <ChatBox messages={messages} />
                        </Box>

                        <Box sx={{ display: "flex", mt: 2 }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Nhập câu hỏi về bệnh tiểu đường..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAsk}
                                disabled={loadingAsk}
                                sx={{ ml: 1, textTransform: "none" }}
                            >
                                {loadingAsk ? <CircularProgress size={20} /> : "Gửi"}
                            </Button>
                        </Box>
                    </Paper>
                </div>
            </div>
        </Box>
    );
};

export default FormPatient;
