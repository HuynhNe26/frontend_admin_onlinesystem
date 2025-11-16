import React from "react";
import "./loading.css";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        <div className="spinner">
          <div className="spinner-inner"></div>
        </div>
        <p className="loading-text">Đang tải...</p>
      </div>
    </div>
  );
}