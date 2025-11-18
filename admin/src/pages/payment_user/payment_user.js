import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./payment_user.css";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");

    fetch(`https://backend-onlinesystem.onrender.com/api/payment/momo/check-status/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setInfo(data.transaction || null);
        setLoading(false);
      })
      .catch(() => {
        setInfo(null);
        setLoading(false);
      });
  }, [orderId]);

  if (!orderId) return <h2>Không có mã giao dịch.</h2>;

  return (
    <div className="payment-container">
      <div className="payment-success-icon">✔️</div>
      <h1 className="payment-title">Thanh toán thành công!</h1>

      {loading ? (
        <p>Đang kiểm tra trạng thái...</p>
      ) : info ? (
        <div className="payment-info">
          <p><b>Mã giao dịch:</b> {info.orderId}</p>
          <p><b>Số tiền:</b> {info.amount} VNĐ</p>
          <p><b>Gói:</b> {info.packageName}</p>
        </div>
      ) : (
        <p>Không tìm thấy thông tin giao dịch.</p>
      )}

      <a className="payment-back-btn" href="/admin/home">
        Quay lại trang chủ
      </a>
    </div>
  );
}
