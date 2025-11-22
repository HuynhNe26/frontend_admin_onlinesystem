// Error404.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './error_404.css';

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className="error-404-container">
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
            
            <div className="error-content">
                <div className="glitch-wrapper">
                    <div className="glitch" data-text="404">404</div>
                </div>
                
                <h2 className="error-title">Oops! Trang Không Tồn Tại</h2>
                <div className="button-group">
                    <button className="btn-home" onClick={() => navigate('/')}>
                        <span className="btn-icon">🏠</span>
                        Về Trang Chủ
                    </button>
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <span className="btn-icon">←</span>
                        Quay Lại
                    </button>
                </div>
            </div>
        </div>
    );
}