import React, { useState } from "react";
import AdminAPI from "../../API/AdminAPI";
import { useNavigate } from "react-router-dom";
import "./create_admin.css"

export default function CreateAdmin() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    level: 1,
  });
  const token = localStorage.getItem("adminToken");
  const nav = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminAPI.createAdmin(token, form);
      alert("Tạo admin thành công!");
      nav("/admin/manage-admin");
    } catch (err) {
      console.error("Lỗi tạo admin:", err);
      alert("Tạo admin thất bại!");
    }
  };

  return (
    <div className="create-admin">
      <h2>➕ Tạo Admin Mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Tên đầy đủ"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="level" value={form.level} onChange={handleChange}>
          <option value={2}>Super Admin (Level 2)</option>
          <option value={3}>Admin  (Level 3)</option>
        </select>
        <button type="submit">Tạo</button>
      </form>
    </div>
  );
}
