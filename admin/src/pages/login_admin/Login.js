import React, { useState, useEffect } from "react";
import "./login.css";
import AdminAPI from "../../API/AdminAPI";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra nếu đã login thì redirect luôn
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      console.log("Already logged in, redirecting...");
      nav("/admin/home", { replace: true });
    }
  }, [nav]);

  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      setErr("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      console.log("Starting login...");
      const res = await AdminAPI.login(email, password);

      console.log("Login response:", res);

      // Backend trả về: { token, user, msg }
      if (!res.token) {
        throw new Error("Không nhận được token từ server");
      }

      // Lưu token
      localStorage.setItem("adminToken", res.token);
      console.log("Token saved:", res.token);

      // Lưu user info
      if (res.user) {
        localStorage.setItem("adminUser", JSON.stringify(res.user));
        localStorage.setItem("adminLevel", res.user.level);
        console.log("User saved:", res.user);
      }

      // ===== QUAN TRỌNG: Trigger event để Router biết token đã thay đổi =====
      window.dispatchEvent(new Event("tokenChange"));

      console.log("Navigating to /admin/home...");

      // Chuyển trang - giờ Router sẽ re-render với token mới
      nav("/admin/home", { replace: true });

    } catch (e) {
      console.error("Login error:", e);

      // Xử lý lỗi cụ thể
      if (e.response?.status === 401) {
        setErr("Sai tài khoản hoặc mật khẩu!");
      } else if (e.response?.data?.msg) {
        setErr(e.response.data.msg);
      } else {
        setErr("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cho phép nhấn Enter để login
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <img src="/assets/logo.png" alt="logo" className="login-logo" />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />

        {err && <p className="err">{err}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>
    </div>
  );
}