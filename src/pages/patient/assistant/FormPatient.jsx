import React, { useState } from "react";
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

const FormPatient = () => {
    const currentYear = new Date().getFullYear();

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

    const [loading, setLoading] = useState(false);
    const [loadingAsk, setLoadingAsk] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "💉 Xin chào! Vui lòng nhập thông tin bệnh nhân để dự đoán hoặc đặt câu hỏi.",
        },
    ]);

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
        setMessages((prev) => [
            ...prev,
            { sender: "user", text: "📤 Đã gửi thông tin bệnh nhân" },
        ]);

        try {
            const res = await api.post("/predict", formData);
            const botMsg = `🔍 Kết quả: ${res.data.prediction === 1 ? "Có nguy cơ tiểu đường" : "Không nguy cơ tiểu đường"
                }\n📊 Xác suất: ${(res.data.probability * 100).toFixed(2)}%`;
            setMessages((prev) => [...prev, { sender: "bot", text: botMsg }]);
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

    return (
        <Box className="container" sx={{ maxWidth: "1400px", height: "85vh" }}>
            <div className="row g-3 h-100">
                {/* Form Section */}
                <div className="col-12 col-md-6 d-flex">
                    <Paper
                        elevation={2}
                        className="flex-grow-1 d-flex flex-column"
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: 3,
                            height: "100%",
                            overflow: "hidden",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <MedicalInformationIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                Thông tin bệnh nhân
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

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
                                    background: "linear-gradient(135deg, #8fddeeff, #d87dbaff)",
                                    borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background: "linear-gradient(135deg, #64b5f6, #2196f3)",
                                },
                            }}
                        >
                            <div className="row g-2">
                                {/* Tuổi + Giới tính */}
                                <div className="col-6">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Tuổi"
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Giới tính</InputLabel>
                                        <Select name="gender" value={formData.gender} onChange={handleChange}>
                                            <MenuItem value="female">Nữ</MenuItem>
                                            <MenuItem value="male">Nam</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                {/* BMI + HbA1c */}
                                <div className="col-6">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="BMI"
                                        type="number"
                                        step="0.1"
                                        name="bmi"
                                        value={formData.bmi}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-6">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="HbA1c (%)"
                                        type="number"
                                        step="0.1"
                                        name="hbA1c_level"
                                        value={formData.hbA1c_level}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Đường huyết (mg/dL)"
                                        type="number"
                                        name="blood_glucose_level"
                                        value={formData.blood_glucose_level}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Tiền sử bệnh */}
                                <div className="col-6">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={formData.hypertension === 1}
                                                onChange={handleChange}
                                                name="hypertension"
                                            />
                                        }
                                        label={<Typography variant="body2">Huyết áp cao</Typography>}
                                    />
                                </div>
                                <div className="col-6">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={formData.heart_disease === 1}
                                                onChange={handleChange}
                                                name="heart_disease"
                                            />
                                        }
                                        label={<Typography variant="body2">Bệnh tim</Typography>}
                                    />
                                </div>
                                <div className="col-12">
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Lịch sử hút thuốc</InputLabel>
                                        <Select
                                            name="smoking_history"
                                            value={formData.smoking_history}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="never">Không bao giờ</MenuItem>
                                            <MenuItem value="ever">Từng hút</MenuItem>
                                            <MenuItem value="current">Hiện tại</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                endIcon={!loading && <SendIcon />}
                                sx={{ mt: 3, py: 1.2, fontSize: "0.9rem", textTransform: "none" }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : "Dự đoán"}
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
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <ChatBubbleOutlineIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                                Kết quả & Chat bot
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                pr: 1,
                                display: "flex",
                                flexDirection: "column",
                                "&::-webkit-scrollbar": { width: "8px" },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "linear-gradient(135deg, #8fddeeff, #d87dbaff)",
                                    borderRadius: "10px",
                                },
                                "&::-webkit-scrollbar-thumb:hover": {
                                    background: "linear-gradient(135deg, #64b5f6, #2196f3)",
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
