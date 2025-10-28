

import { useState } from "react"
import { Phone, Video, Calendar, Clock, MapPin, Star, CheckCircle, Shield, Award, ClockIcon as Clock24, MessageSquare, X, Bot, Send, Trash2, CheckCircle2 } from 'lucide-react';
import { ChevronDown } from "lucide-react"

// Custom Button Component
const Button = ({ children, className = "", variant = "primary", size = "md", onClick, disabled, type, ...props }) => {
    const baseClasses =
        "btn d-inline-flex align-items-center justify-content-center fw-medium transition-all border-0 shadow-sm"

    const variants = {
        primary: "btn-primary text-white",
        secondary: "btn-light text-dark border",
        success: "btn-success text-white",
        danger: "btn-danger text-white",
        warning: "btn-warning text-dark",
        info: "btn-info text-white",
        light: "btn-light text-dark",
        dark: "btn-dark text-white",
        outline: "btn-outline-primary",
        ghost: "btn-light text-muted border-0 shadow-none",
    }

    const sizes = {
        sm: "btn-sm px-2 py-1",
        md: "btn-md px-3 py-2",
        lg: "btn-lg px-4 py-3",
    }

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            style={{ borderRadius: "8px" }}
            {...props}
        >
            {children}
        </button>
    )
}

// Custom Input Component
const Input = ({ className = "", ...props }) => {
    return (
        <input
            className={`form-control border-0 shadow-sm ${className}`}
            style={{ borderRadius: "8px", backgroundColor: "#f8f9fa" }}
            {...props}
        />
    )
}

// Custom Select Component
const Select = ({ children, value, onChange, className = "" }) => {
    return (
        <div className={`position-relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="form-select border-0 shadow-sm"
                style={{ borderRadius: "8px", backgroundColor: "#f8f9fa", paddingRight: "2.5rem" }}
            >
                {children}
            </select>
            <ChevronDown
                className="position-absolute top-50 translate-middle-y text-muted"
                size={16}
                style={{ right: "12px", pointerEvents: "none" }}
            />
        </div>
    )
}

// Custom Badge Component
const Badge = ({ children, className = "" }) => {
    return (
        <span
            className={`badge ${className}`}
            style={{ borderRadius: "6px", fontSize: "0.75rem", padding: "0.375rem 0.75rem" }}
        >
            {children}
        </span>
    )
}

// Custom Avatar Component
const Avatar = ({ src, alt, fallback, className = "" }) => {
    const [imageError, setImageError] = useState(false)

    return (
        <div
            className={`position-relative d-inline-flex align-items-center justify-content-center rounded-circle bg-light ${className}`}
        >
            {!imageError && src ? (
                <img
                    src={src || "/placeholder.svg"}
                    alt={alt}
                    className="w-100 h-100 rounded-circle object-fit-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="fw-medium text-muted" style={{ fontSize: "0.875rem" }}>
                    {fallback}
                </span>
            )}
        </div>
    )
}

// Modal Component
const Modal = ({ show, onClose, title, children, type = "info" }) => {
    if (!show) return null;

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle2 size={48} className="text-success mb-3" />;
            case "danger":
                return <Clock size={48} className="text-danger mb-3" />;
            case "warning":
                return <Clock size={48} className="text-warning mb-3" />;
            default:
                return <Calendar size={48} className="text-primary mb-3" />;
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body text-center py-4">
                        {getIcon()}
                        <h4 className="modal-title mb-3">{title}</h4>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Button, Input, Select, Badge, Avatar, Modal };
