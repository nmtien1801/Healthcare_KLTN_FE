import { useState } from 'react';
import { Check } from 'lucide-react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './nutrition.scss';

export default function SuggestedFood() {
    const [foods, setFoods] = useState([
        {
            icon: '🍳',
            name: 'Trứng gà chiên',
            details: '94g • 90 cal',
            macros: ['6.5g', '1g', '7.1g'],
            colors: ['danger', 'info', 'warning'],
            checked: true,
            meal: 'sáng'
        },
        {
            icon: '🍅',
            name: 'Quả cà chua',
            details: '90g • 16 cal',
            macros: ['0.7g', '3.5g', '0g'],
            colors: ['danger', 'info', 'warning'],
            checked: true,
            meal: 'trưa'
        },
        {
            icon: '🍞',
            name: 'Bánh mì Sandwich lát',
            details: '30g • 144 cal',
            macros: ['5g', '25.9g', '2.5g'],
            colors: ['danger', 'info', 'warning'],
            checked: false,
            meal: 'ăn vặt'
        },
        {
            icon: '🥬',
            name: 'Rau xà lách',
            details: '80g • 12 cal',
            macros: ['1.4g', '2.9g', '0.2g'],
            colors: ['danger', 'info', 'warning'],
            checked: false,
            meal: 'tối'
        }
    ]);


    const toggleChecked = (index) => {
        const updatedFoods = [...foods];
        updatedFoods[index].checked = !updatedFoods[index].checked;
        setFoods(updatedFoods);
    };

    const calculateTotals = () => {
        let totalCalo = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        const caloriesByMeal = {
            sáng: 0,
            trưa: 0,
            tối: 0,
            'ăn vặt': 0
        };

        foods.forEach(food => {
            if (food.checked) {
                const [protein, carbs, fat] = food.macros.map(m => parseFloat(m.replace('g', '')));
                const cal = parseFloat(food.details.split('•')[1].replace('cal', '').trim());

                totalProtein += protein;
                totalCarbs += carbs;
                totalFat += fat;
                totalCalo += cal;

                if (food.meal in caloriesByMeal) {
                    caloriesByMeal[food.meal] += cal;
                }
            }
        });

        return {
            totalCalo,
            totalProtein,
            totalCarbs,
            totalFat,
            caloriesByMeal
        };
    };


    const targetCalo = 2117; // Mục tiêu calo
    const macroRatios = {
        protein: 0.2, // 20%
        carbs: 0.5,   // 50%
        fat: 0.3      // 30%
    };

    const targetProtein = Math.round((targetCalo * macroRatios.protein) / 4);
    const targetCarbs = Math.round((targetCalo * macroRatios.carbs) / 4);
    const targetFat = Math.round((targetCalo * macroRatios.fat) / 9);
    const { caloriesByMeal } = calculateTotals();

    const renderMeal = (mealLabel) => (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Buổi {mealLabel}</h5>
                <small className="text-white">{caloriesByMeal[mealLabel] || 0} cal</small>
            </div>

            {foods.filter(f => f.meal === mealLabel).map((item, idx) => (
                <div className="d-flex gap-3 p-3 mb-3 gradient rounded align-items-center" key={idx}>
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: 24 }}>
                        {item.icon}
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-white">{item.details}</small>
                        <div className="d-flex gap-3 mt-1 text-white">
                            {item.macros.map((macro, i) => (
                                <span key={i} className="d-flex align-items-center gap-1">
                                    <span
                                        className={`d-inline-block rounded-circle bg-${item.colors[i]}`}
                                        style={{ width: 8, height: 8 }}
                                    ></span>
                                    {macro}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div
                        className={`d-flex align-items-center justify-content-center rounded-circle ${item.checked ? 'bg-success' : 'bg-dark'}`}
                        style={{ width: 24, height: 24, cursor: 'pointer' }}
                        onClick={() => toggleChecked(foods.indexOf(item))}
                    >
                        {item.checked ? <Check size={16} color="white" /> : <span className="bg-light rounded-circle" style={{ width: 8, height: 8 }}></span>}
                    </div>
                </div>
            ))}
        </div>
    );

    // Tính tổng
    const totalMacros = targetProtein + targetCarbs + targetFat;

    const proteinPercent = (targetProtein / totalMacros) * 100;
    const carbsPercent = (targetCarbs / totalMacros) * 100;
    const fatPercent = (targetFat / totalMacros) * 100;

    // Tính độ dài cung tròn tương ứng (tổng chu vi ~ 283)
    const proteinArc = (proteinPercent / 100) * 283;
    const carbsArc = (carbsPercent / 100) * 283;
    const fatArc = (fatPercent / 100) * 283;

    // Góc bắt đầu mỗi cung (dùng stroke-dashoffset)
    const carbsOffset = proteinArc;
    const fatOffset = proteinArc + carbsArc;

    return (
        <div className="min-vh-100 bg-white text-dark p-3">
            <div className="d-flex justify-content-between align-items-center mb-3 position-relative" style={{ height: "400px", overflow: "hidden" }}>
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
                    alt="Food background"
                    className="position-absolute top-0 start-0 w-100 h-100 object-cover"
                    style={{ objectFit: "cover", zIndex: 1 }}
                />
                {/* Overlay Gradient */}
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4), rgba(0,0,0,0.9))",
                        zIndex: 2,
                    }}
                />

                {/* Content */}
                <div className="position-relative text-white px-4 pb-4" style={{ zIndex: 3, maxWidth: "700px" }}>
                    {/* Filter Tags */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-2 bg-white bg-opacity-25 backdrop-blur rounded-pill text-sm">
                            Ít tinh bột - Tăng cơ
                        </span>
                        <span className="px-3 py-2 bg-white bg-opacity-25 backdrop-blur rounded-pill text-sm">4 bữa/ngày</span>
                    </div>

                    {/* Title */}
                    <h1 className="fs-4 fw-bold mb-3">
                        Meal plan chuẩn gym: Tăng cơ, Giảm mỡ, Sống khỏe
                    </h1>

                    {/* Description */}
                    <p className="text-white fw-semibold small" style={{ lineHeight: 1.6 }}>
                        Meal plan chuẩn gym: Tăng cơ, Giảm mỡ, Sống khỏe là chế độ ăn uống được thiết kế khoa học, giúp người tập
                        luyện cải thiện vóc dáng hiệu quả và duy trì sức khỏe lâu dài. Thực đơn cân bằng giữa ba nhóm chất chính:
                        đạm (protein) giúp xây dựng cơ bắp, tinh bột tốt (carb phức) cung cấp năng lượng bền vững, và chất béo lành
                        mạnh hỗ trợ hormone và hấp thu dinh dưỡng. Meal plan này còn chú trọng đến thực phẩm giàu chất xơ, vitamin
                        và khoáng chất để tăng cường trao đổi chất và hỗ trợ giảm mỡ. Các bữa ăn được chia nhỏ, ăn đúng giờ để kiểm
                        soát insulin và duy trì năng lượng ổn định suốt ngày dài. Đây là lựa chọn lý tưởng cho người muốn tăng cơ,
                        giảm mỡ mà vẫn đảm bảo lối sống lành mạnh và bền vững.
                    </p>
                </div>
            </div>


            <div className="d-flex flex-wrap align-items-center justify-content-between my-3">
                <div className="d-flex flex-wrap align-items-center gap-4">
                    {/* Biểu đồ tròn */}
                    <div className="position-relative" style={{ width: "50px", height: "50px" }}>
                        <svg className="w-120 h-100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />

                            {/* Protein */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#dc2626"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${proteinArc} 283`}
                                strokeDashoffset="0"
                                strokeLinecap="round"
                            />

                            {/* Carbs */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#0ea5e9"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${carbsArc} 283`}
                                strokeDashoffset={`-${carbsOffset}`}
                                strokeLinecap="round"
                            />

                            {/* Fat */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#facc15"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${fatArc} 283`}
                                strokeDashoffset={`-${fatOffset}`}
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Thông tin dinh dưỡng */}
                    <div className="text-center">
                        {/* Tổng calo ở trên */}
                        <div className="mb-1 d-flex align-items-center gap-2">
                            <div className="fw-semibold fs-5">{targetCalo}</div>
                            <small className="text-white">CALO</small>
                        </div>

                        {/* 3 chất dinh dưỡng ở dưới */}
                        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <span className="d-inline-block rounded-circle bg-danger" style={{ width: 10, height: 10 }}></span>
                                <span>Chất đạm: {targetProtein}g</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="d-inline-block rounded-circle bg-info" style={{ width: 10, height: 10 }}></span>
                                <span>Đường bột: {targetCarbs}g</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="d-inline-block rounded-circle bg-warning" style={{ width: 10, height: 10 }}></span>
                                <span>Chất béo: {targetFat}g</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons: Chỉnh sửa và Áp dụng */}
                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-3 ms-5">
                    <button type="button" className="btn btn-outline-info d-flex align-items-center gap-2 px-3">
                        Chỉnh sửa
                    </button>

                    <button type="button" className="btn btn-info text-white d-flex align-items-center gap-2 px-3">
                        Áp dụng
                    </button>
                </div>
            </div>

            {renderMeal('sáng')}
            {renderMeal('trưa')}
            {renderMeal('tối')}
            {renderMeal('ăn vặt')}
        </div>
    );
}
