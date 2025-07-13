import { useState } from 'react';
import { Check } from 'lucide-react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './nutrition.scss';

export default function FoodTrackerApp() {
    const [activeTab, setActiveTab] = useState('menu');
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
    const { totalCalo, totalProtein, totalCarbs, totalFat, caloriesByMeal } = calculateTotals();

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

    return (
        <div className="min-vh-100 bg-white text-dark p-3">
            {/* Overview */}
            <div className="my-2">
                <div className='gradient rounded shadow-sm border p-3 mb-4'>
                    <div className="d-flex justify-content-between align-items-center ">
                        <div>
                            <h5>Tổng quan</h5>
                            <small className="text-white">Mục tiêu cao</small>
                        </div>
                    </div>

                    {/* Calorie Circle (static SVG) */}
                    <div className="d-flex justify-content-center my-3">
                        <div className="position-relative" style={{ width: '200px', height: '200px' }}>
                            <svg className="w-100 h-100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="50" cy="50" r="45" stroke="#374151" strokeWidth="8" fill="none" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="#9333ea"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(totalCalo / targetCalo) * 283} 283`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="position-absolute top-50 start-50 translate-middle text-center">
                                <h2 className="fw-bold">{targetCalo - totalCalo}</h2>
                                <small className="text-white">Calo còn lại</small>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row text-center mb-4">
                        <div className="col">
                            <div className="fs-4 fw-bold">{targetCalo}</div>
                            <small className="text-white">
                                <span className="d-inline-block rounded-circle bg-secondary me-1" style={{ width: 8, height: 8 }}></span>
                                Mục tiêu
                            </small>
                        </div>
                        <div className="col">
                            <div className="fs-4 fw-bold">{totalCalo}</div>
                            <small className="text-white">
                                <span className="d-inline-block rounded-circle bg-primary me-1" style={{ width: 8, height: 8 }}></span>
                                Đã nạp
                            </small>
                        </div>
                    </div>

                    {/* Macros */}
                    <div className="row text-center mb-4">
                        <div className="col">
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                <span className="d-inline-block rounded-circle bg-danger" style={{ width: 10, height: 10 }}></span>
                                <span>Chất đạm</span>
                            </div>
                            <ProgressBar
                                now={(totalProtein / targetProtein) * 100}
                                variant="danger"
                                className="mb-1"
                                label={`${Math.round((totalProtein / targetProtein) * 100)}%`}
                            />
                            <small>
                                {totalProtein.toFixed(1)} <span className="text-white">/ {targetProtein}g</span>
                            </small>
                        </div>

                        <div className="col">
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                <span className="d-inline-block rounded-circle bg-info" style={{ width: 10, height: 10 }}></span>
                                <span>Đường bột</span>
                            </div>
                            <ProgressBar
                                now={(totalCarbs / targetCarbs) * 100}
                                variant="info"
                                className="mb-1"
                                label={`${Math.round((totalCarbs / targetCarbs) * 100)}%`}
                            />
                            <small>
                                {totalCarbs.toFixed(1)} <span className="text-white">/ {targetCarbs}g</span>
                            </small>
                        </div>

                        <div className="col">
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                <span className="d-inline-block rounded-circle bg-warning" style={{ width: 10, height: 10 }}></span>
                                <span>Chất béo</span>
                            </div>
                            <ProgressBar
                                now={(totalFat / targetFat) * 100}
                                variant="warning"
                                className="mb-1"
                                label={`${Math.round((totalFat / targetFat) * 100)}%`}
                            />
                            <small>
                                {totalFat.toFixed(1)} <span className="text-white">/ {targetFat}g</span>
                            </small>
                        </div>
                    </div>
                </div>



                {renderMeal('sáng')}
                {renderMeal('trưa')}
                {renderMeal('tối')}
                {renderMeal('ăn vặt')}
            </div>
        </div>
    );
}
