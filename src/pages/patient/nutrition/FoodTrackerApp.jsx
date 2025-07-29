import { useState } from 'react';
import { Check, TrendingUp, TrendingDown } from 'lucide-react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './nutrition.scss';

const StatsGrid = (foods) => {
    const targetCalo = 2117; // Mục tiêu calo
    const macroRatios = {
        protein: 0.2, // 20%
        carbs: 0.5,   // 50%
        fat: 0.3      // 30%
    };

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
            totalCalo,
            totalProtein,
            totalCarbs,
            totalFat,
        };
    };

    const targetProtein = Math.round((targetCalo * macroRatios.protein) / 4);
    const targetCarbs = Math.round((targetCalo * macroRatios.carbs) / 4);
    const targetFat = Math.round((targetCalo * macroRatios.fat) / 9);
    const { totalCalo, totalProtein, totalCarbs, totalFat } = calculateTotals();

    const stats = [
        {
            title: "Calories hôm nay",
            value: totalCalo,
            target: targetCalo,
            percentage: Math.round((totalCalo / targetCalo) * 100),
            trend: "up",
            color: "primary",
        },
        {
            title: "Chất đạm",
            value: totalProtein,
            target: targetProtein,
            percentage: Math.round((totalProtein / targetProtein) * 100),
            trend: "up",
            color: "success",
        },
        {
            title: "Đường bột",
            value: totalCarbs,
            target: targetCarbs,
            percentage: Math.round((totalCarbs / targetCarbs) * 100),
            trend: "down",
            color: "warning",
        },
        {
            title: "Chất béo",
            value: totalFat,
            target: targetFat,
            percentage: Math.round((totalFat / targetFat) * 100),
            trend: "up",
            color: "danger",
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
                                <span className="fs-4 fw-bold text-dark">{stat.value}</span>
                                <span className="text-muted small">/ {stat.target}</span>
                            </div>
                        </div>

                        <div className="progress mb-2" style={{ height: '8px' }}>
                            <div
                                className={`progress-bar bg-${stat.color}`}
                                role="progressbar"
                                style={{ width: `${stat.percentage}%` }}
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
    const [foods, setFoods] = useState([
        {
            icon: '🍳',
            name: 'Trứng gà chiên',
            details: '94g • 90 cal',
            macros: ['6.5g', '1g', '7.1g'],
            colors: ['success', 'warning', 'danger'],
            checked: true,
            meal: 'sáng'
        },
        {
            icon: '🍅',
            name: 'Quả cà chua',
            details: '90g • 16 cal',
            macros: ['0.7g', '3.5g', '0g'],
            colors: ['success', 'warning', 'danger'],
            checked: true,
            meal: 'trưa'
        },
        {
            icon: '🍞',
            name: 'Bánh mì Sandwich lát',
            details: '30g • 144 cal',
            macros: ['5g', '25.9g', '2.5g'],
            colors: ['success', 'warning', 'danger'],
            checked: false,
            meal: 'ăn vặt'
        },
        {
            icon: '🥬',
            name: 'Rau xà lách',
            details: '80g • 12 cal',
            macros: ['1.4g', '2.9g', '0.2g'],
            colors: ['success', 'warning', 'danger'],
            checked: false,
            meal: 'tối'
        }
    ]);

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

    const renderMeal = (mealLabel) => (
        <div className="mb-4 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Buổi {mealLabel}</h5>
                <small>{caloriesByMeal(foods)[mealLabel] || 0} cal</small>
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

    return (
        <div className="min-vh-100 bg-white text-dark p-3">
            {/* Overview */}
            <div className="my-2">
                <div className="d-flex justify-content-between align-items-center ">
                    <div className='mb-4'>
                        <h4>Tổng quan</h4>
                    </div>
                </div>
                {StatsGrid(foods)}

                {renderMeal('sáng')}
                {renderMeal('trưa')}
                {renderMeal('tối')}
                {renderMeal('ăn vặt')}
            </div>
        </div>
    );
}
