import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!email || !password) {
      setErr("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (loading) return;
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("https://backend-onlinesystem.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Đăng nhập thất bại");
      if (!data.accessToken) throw new Error("Không nhận được token từ server");

      localStorage.setItem("adminToken", data.accessToken);
      if (data.user) localStorage.setItem("adminUser", JSON.stringify(data.user));

      window.dispatchEvent(new Event("tokenChange"));

      navigate("/admin/home", { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <h2>Đăng nhập quản trị</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {err && <p className="err">{err}</p>}

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </div>
    </div>
  );
}