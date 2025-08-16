import React, { useState } from "react";
import { api } from "../../../apis/assistant";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Paper,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Checkbox,
    Divider
} from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// ChatBox đơn giản
const ChatBox = ({ messages }) => (
    <Box sx={{ maxHeight: '100%', overflowY: 'auto', pr: 1 }}>
        {messages.map((msg, index) => (
            <Box
                key={index}
                sx={{
                    mb: 1.5,
                    px: 2,
                    py: 1,
                    maxWidth: "85%",
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 3,
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    boxShadow: 1,
                    fontSize: "0.9rem"
                }}
            >
                <Typography variant="body2">{msg.text}</Typography>
            </Box>
        ))}
    </Box>
);

const FormPatient = () => {
    const [formData, setFormData] = useState({
        year: 2025,
        gender: "female",
        age: 45,
        location: "California",
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
        { sender: "bot", text: "💉 Xin chào! Vui lòng nhập thông tin bệnh nhân để dự đoán hoặc đặt câu hỏi." }
    ]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : (isNaN(value) ? value : Number(value))
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessages(prev => [...prev, { sender: "user", text: "📤 Đã gửi thông tin bệnh nhân" }]);

        try {
            const res = await api.post("/predict", formData);
            const botMsg = `🔍 Kết quả: ${res.data.prediction === 1 ? "Có nguy cơ tiểu đường" : "Không nguy cơ tiểu đường"}\n📊 Xác suất: ${(res.data.probability * 100).toFixed(2)}%`;
            setMessages(prev => [...prev, { sender: "bot", text: botMsg }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: "bot", text: "⚠️ Có lỗi xảy ra. Vui lòng thử lại!" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoadingAsk(true);
        setMessages(prev => [...prev, { sender: "user", text: question }]);
        setQuestion("");

        try {
            const res = await api.post("/ask", { query: question });
            setMessages(prev => [...prev, { sender: "bot", text: res.data.answer }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: "bot", text: "🤖 Xin lỗi, tôi không thể trả lời câu hỏi này." }]);
        } finally {
            setLoadingAsk(false);
        }
    };

    return (
        <Box sx={{ p: 2, maxWidth: '1400px', mx: 'auto', height: '85vh' }}>
            <Grid container spacing={2} sx={{ height: '100%', flexWrap: 'nowrap' }}>
                {/* Form Section */}
                <Grid item xs={6} sx={{ display: 'flex' }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, flex: 1, overflowY: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MedicalInformationIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Thông tin bệnh nhân
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={2}>
                                {/* Personal Info */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Thông tin cá nhân</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField size="small" fullWidth label="Năm" type="number" name="year" value={formData.year} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" fullWidth label="Tuổi" type="number" name="age" value={formData.age} onChange={handleChange} required />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Giới tính</InputLabel>
                                                <Select name="gender" value={formData.gender} onChange={handleChange}>
                                                    <MenuItem value="female">Nữ</MenuItem>
                                                    <MenuItem value="male">Nam</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" fullWidth label="Vị trí" name="location" value={formData.location} onChange={handleChange} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Race */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }}>Chủng tộc</Typography>
                                    <Grid container spacing={1}>
                                        {[
                                            { label: "African American", name: "race_AfricanAmerican" },
                                            { label: "Asian", name: "race_Asian" },
                                            { label: "Caucasian", name: "race_Caucasian" },
                                            { label: "Hispanic", name: "race_Hispanic" },
                                            { label: "Other", name: "race_Other" },
                                        ].map((race) => (
                                            <Grid item xs={6} key={race.name}>
                                                <FormControlLabel
                                                    control={<Checkbox size="small" checked={formData[race.name] === 1} onChange={handleChange} name={race.name} />}
                                                    label={<Typography variant="body2">{race.label}</Typography>}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>

                                {/* Health Metrics */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }}>Chỉ số sức khỏe</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField size="small" fullWidth label="BMI" type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField size="small" fullWidth label="HbA1c (%)" type="number" step="0.1" name="hbA1c_level" value={formData.hbA1c_level} onChange={handleChange} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField size="small" fullWidth label="Đường huyết (mg/dL)" type="number" name="blood_glucose_level" value={formData.blood_glucose_level} onChange={handleChange} />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Medical History */}
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, mt: 1, color: 'text.secondary' }}>Tiền sử bệnh</Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <FormControlLabel control={<Checkbox size="small" checked={formData.hypertension === 1} onChange={handleChange} name="hypertension" />} label={<Typography variant="body2">Huyết áp cao</Typography>} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControlLabel control={<Checkbox size="small" checked={formData.heart_disease === 1} onChange={handleChange} name="heart_disease" />} label={<Typography variant="body2">Bệnh tim</Typography>} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Lịch sử hút thuốc</InputLabel>
                                                <Select name="smoking_history" value={formData.smoking_history} onChange={handleChange}>
                                                    <MenuItem value="never">Không bao giờ</MenuItem>
                                                    <MenuItem value="ever">Từng hút</MenuItem>
                                                    <MenuItem value="current">Hiện tại</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                endIcon={!loading && <SendIcon />}
                                sx={{ mt: 3, py: 1.2, fontSize: "0.9rem", textTransform: "none" }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Dự đoán'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Chat Section */}
                <Grid item xs={6} sx={{ display: 'flex' }}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ChatBubbleOutlineIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                Kết quả & Chat bot
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                            <ChatBox messages={messages} />
                        </Box>

                        <Box sx={{ display: 'flex', mt: 2 }}>
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
                                color="secondary"
                                onClick={handleAsk}
                                disabled={loadingAsk}
                                sx={{ ml: 1, textTransform: "none" }}
                            >
                                {loadingAsk ? <CircularProgress size={20} /> : "Gửi"}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FormPatient;
