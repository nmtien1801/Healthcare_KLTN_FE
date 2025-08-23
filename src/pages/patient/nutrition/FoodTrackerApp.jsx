import { useEffect, useState } from 'react';
import { Check, TrendingUp, TrendingDown } from 'lucide-react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './nutrition.scss';
import { setWithExpiry, getWithExpiry } from '../../../components/customizeStorage'

const StatsGrid = (target, foods) => {
    const targetCalo = target; // Mục tiêu calo

    const calculateTotals = () => {
        let totalCalo = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        foods.forEach(food => {
            if (food.checked) {
                const [protein, carbs, fat] = food.macros.map(m => parseFloat(m.replace('g', '')));
                const cal = parseFloat(food.details.split('•')[1].replace('cal', '').trim());

                totalProtein += protein;
                totalCarbs += carbs;
                totalFat += fat;
                totalCalo += cal;
            }
        });

        return {
            totalCalo: totalCalo.toFixed(1),
            totalProtein: totalProtein.toFixed(1),
            totalCarbs: totalCarbs.toFixed(1),
            totalFat: totalFat.toFixed(1),
        };
    };

    const calculateTarget = () => {
        let targetCalo = 0;
        let targetProtein = 0;
        let targetCarbs = 0;
        let targetFat = 0;

        foods.forEach(food => {
            if (food.checked) {
                const [protein, carbs, fat] = food.macros.map(m => parseFloat(m.replace('g', '')));
                const cal = parseFloat(food.details.split('•')[1].replace('cal', '').trim());

                targetProtein += protein;
                targetCarbs += carbs;
                targetFat += fat;
                targetCalo += cal;
            }
        });

        return {
            targetCalo: targetCalo.toFixed(1),
            targetProtein: targetProtein.toFixed(1),
            targetCarbs: targetCarbs.toFixed(1),
            targetFat: targetFat.toFixed(1),
        };
    };

    const { targetProtein, targetCarbs, targetFat } = calculateTarget();
    const { totalCalo, totalProtein, totalCarbs, totalFat } = calculateTotals();

    const stats = [
        {
            title: "Calories hôm nay",
            value: totalCalo,
            target: targetCalo,
            percentage: Math.round((totalCalo / targetCalo) * 100),
            trend: "up",
            color: "primary",
            unit: "kcal", // ✅
        },
        {
            title: "Chất đạm",
            value: totalProtein,
            target: targetProtein,
            percentage: Math.round((totalProtein / targetProtein) * 100),
            trend: "up",
            color: "success",
            unit: "g",
        },
        {
            title: "Đường bột",
            value: totalCarbs,
            target: targetCarbs,
            percentage: Math.round((totalCarbs / targetCarbs) * 100),
            trend: "down",
            color: "warning",
            unit: "g",
        },
        {
            title: "Chất béo",
            value: totalFat,
            target: targetFat,
            percentage: Math.round((totalFat / targetFat) * 100),
            trend: "up",
            color: "danger",
            unit: "g",
        },
    ];

    return (
        <div className="row g-4">
            {stats.map((stat, index) => (
                <div key={index} className="col-12 col-md-6 col-lg-3">
                    <div className="bg-white rounded shadow border p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-muted mb-0">{stat.title}</h6>
                            {stat.trend === "up" ? (
                                <TrendingUp size={16} color="green" />
                            ) : (
                                <TrendingDown size={16} color="red" />
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="d-flex align-items-baseline gap-2">
                                {/* ✅ Calories hiển thị kcal, còn macros hiển thị g */}
                                <span className="fs-4 fw-bold text-dark">
                                    {stat.value}
                                    <span className="fs-6 ms-1 text-muted">{stat.unit}</span>
                                </span>
                                <span className="text-muted small">/ {stat.target}{stat.unit}</span>
                            </div>
                        </div>

                        <div className="progress mb-2" style={{ height: '8px' }}>
                            <div
                                className={`progress-bar bg-${stat.color}`}
                                role="progressbar"
                                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                                aria-valuenow={stat.percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            ></div>
                        </div>
                        <p className="text-muted small mb-0">{stat.percentage}% mục tiêu</p>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default function FoodTrackerApp() {
    const food = JSON.parse(getWithExpiry("food"))
    const [foods, setFoods] = useState([]);

    // Hàm phân bổ thực phẩm vào bữa ăn hợp lý cho bệnh nhân tiểu đường
    const assignMealsToFoods = (foodItems) => {
        const meals = ['sáng', 'trưa', 'tối', 'ăn vặt'];
        const mealPreferences = {
            sáng: { protein: 0.3, carbs: 0.25, fat: 0.2 },
            trưa: { protein: 0.25, carbs: 0.3, fat: 0.25 },
            tối: { protein: 0.2, carbs: 0.2, fat: 0.3 },
            'ăn vặt': { protein: 0.25, carbs: 0.25, fat: 0.25 }
        };

        return foodItems.map((food, index) => {
            const protein = parseFloat(food.chat_dam);
            const carbs = parseFloat(food.duong_bot);
            const fat = parseFloat(food.chat_beo);
            const total = protein + carbs + fat;

            let bestMeal = meals[index % meals.length]; // fallback: chia đều round-robin

            if (total > 0) {
                const proteinRatio = protein / total;
                const carbsRatio = carbs / total;
                const fatRatio = fat / total;

                let bestScore = Infinity;
                meals.forEach(meal => {
                    const pref = mealPreferences[meal];
                    const score = Math.abs(proteinRatio - pref.protein) +
                        Math.abs(carbsRatio - pref.carbs) +
                        Math.abs(fatRatio - pref.fat);
                    if (score < bestScore) {
                        bestScore = score;
                        bestMeal = meal;
                    }
                });
            }

            return { ...food, meal: bestMeal };
        });
    };

    useEffect(() => {
        if (food && food?.chosen?.length > 0) {
            const mappedFoods = food.chosen.map((food) => ({
                image: '🍅',
                name: food.name,
                details: `${food.weight}g • ${food.calo}cal`,
                macros: [
                    `${food.chat_dam}g`,
                    `${food.duong_bot}g`,
                    `${food.chat_beo}g`
                ],
                colors: ['success', 'warning', 'danger'],
                checked: true,
                meal: 'sáng'
            }));

            // Phân bổ thực phẩm vào bữa ăn hợp lý
            const foodsWithMeals = assignMealsToFoods(mappedFoods);

            setFoods(foodsWithMeals);
        }
    }, []);

    const toggleChecked = (index) => {
        const updatedFoods = [...foods];
        updatedFoods[index].checked = !updatedFoods[index].checked;
        setFoods(updatedFoods);
    };

    const caloriesByMeal = (foods) => {
        const result = {
            sáng: 0,
            trưa: 0,
            tối: 0,
            'ăn vặt': 0
        };

        foods.forEach((food) => {
            if (food.checked) {
                const cal = parseFloat(food.details.split('•')[1].replace('cal', '').trim());
                result[food.meal] += cal;
            }
        });

        return result;
    };

    // Hàm tạo thời gian bữa ăn phù hợp cho bệnh nhân tiểu đường
    const getMealTime = (mealLabel) => {
        const mealTimes = {
            sáng: {
                time: '7:00 - 8:00',
                tip: 'Ăn sáng trong vòng 1 giờ sau khi thức dậy',
                advice: 'Bữa sáng giàu protein giúp ổn định đường huyết và no lâu'
            },
            trưa: {
                time: '12:00 - 13:00',
                tip: 'Ăn trưa cách bữa sáng 4-5 giờ',
                advice: 'Bữa trưa cân bằng dinh dưỡng, ưu tiên rau xanh và protein'
            },
            tối: {
                time: '18:00 - 19:00',
                tip: 'Ăn tối cách giờ ngủ ít nhất 3 giờ',
                advice: 'Bữa tối ít carbs, nhiều rau xanh để kiểm soát đường huyết'
            },
            'ăn vặt': {
                time: '15:00 - 16:00',
                tip: 'Ăn vặt giữa bữa trưa và tối',
                advice: 'Bữa phụ nhẹ nhàng, tránh thực phẩm nhiều đường'
            }
        };
        return mealTimes[mealLabel] || { time: '', tip: '', advice: '' };
    };

    const renderMeal = (mealLabel) => {
        const mealTime = getMealTime(mealLabel);
        return (
            <div className="mb-4 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5>Buổi {mealLabel}</h5>
                        <small className="text-muted">{mealTime.time} - {mealTime.tip}</small>
                        <div className="mt-1">
                            <small className="text-info fst-italic">💡 {mealTime.advice}</small>
                        </div>
                    </div>
                    <div className="text-end">
                        <small className="text-primary fw-bold">{caloriesByMeal(foods)[mealLabel] || 0} cal</small>
                        <div className="mt-1">
                            <small className="text-success">
                                {foods.filter(f => f.meal === mealLabel && f.checked).length} món
                            </small>
                        </div>
                    </div>
                </div>

                {foods.filter(f => f.meal === mealLabel).map((item, idx) => (
                    <div className="d-flex gap-3 p-3 mb-3 gradient rounded align-items-center" key={idx}>
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, fontSize: 24 }}>
                            {item.image}
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
    };

    return (
        <div className="min-vh-100 bg-white text-dark p-3">
            {/* Overview */}
            <div className="my-2">
                <div className="d-flex justify-content-between align-items-center ">
                    <div className='mb-4'>
                        <h4>Tổng quan</h4>
                    </div>
                </div>
                {StatsGrid(food?.sum, foods)}

                {renderMeal('sáng')}
                {renderMeal('trưa')}
                {renderMeal('tối')}
                {renderMeal('ăn vặt')}
            </div>
        </div>
    );
}
