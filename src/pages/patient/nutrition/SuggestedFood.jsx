import React, { useState } from "react";
import "./nutrition.scss";

export default function SuggestedFood() {
    const [confirmedIndex, setConfirmedIndex] = useState(null);

    const kcalGroups = [
        {
            range: "1200–1400 kcal",
            category: "Giảm cân nhanh",
            target: "Người cần giảm cân nhanh, béo phì mức nặng, ít vận động",
            img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        },
        {
            range: "1400–1600 kcal",
            category: "Thừa cân",
            target: "Người thừa cân, vận động nhẹ",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        },
        {
            range: "1600–1800 kcal",
            category: "Cân nặng TB",
            target: "Người cân nặng trung bình, vận động nhẹ–trung bình",
            img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
        },
        {
            range: "1800–2000 kcal",
            category: "Nam hoạt động nhiều",
            target: "Nam giới hoạt động nhiều hoặc người gầy cần giữ cân",
            img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
        },
        {
            range: ">2000 kcal",
            category: "Vận động nặng",
            target: "Trường hợp vận động thể lực nặng, lao động tay chân",
            img: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83",
        },
    ];

    return (
        <div className="bg-light">
            {/* Hero Section */}
           <div className="d-flex justify-content-between align-items-center mb-3 position-relative" style={{ height: "350px", overflow: "hidden" }}>
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

            {/* Content */}
            <div className="container py-4">
                <h3 className="fw-bold text-center mb-4">
                    Các mức kcal/ngày & đối tượng áp dụng
                </h3>

                <div className="row g-4">
                    {kcalGroups.map((item, index) => (
                        <div key={index} className="col-md-6 col-lg-4">
                            <div
                                className={`card border-0 shadow-sm h-100 ${confirmedIndex === index ? "border-success shadow-lg" : ""
                                    }`}
                            >
                                {/* Image */}
                                <img
                                    src={item.img}
                                    alt={item.range}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />

                                {/* Body */}
                                <div className="card-body">
                                    {/* Filter Tags */}
                                    <div className="mb-3">
                                        <span
                                            className="badge rounded-pill bg-secondary px-3 py-2"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {item.category}
                                        </span>
                                    </div>

                                    <h5 className="card-title fw-bold">{item.range}</h5>
                                    <p className="card-text text-muted">{item.target}</p>

                                    {/* Confirm Button */}
                                    <button
                                        className={`btn w-100 ${confirmedIndex === index ? "btn-success" : "btn-outline-primary"
                                            }`}
                                        onClick={() => setConfirmedIndex(index)}
                                    >
                                        {confirmedIndex === index ? "✅ Đã xác nhận" : "Xác nhận"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
