import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./create_department.css";
import Loading from "../../components/loading/loading";

export default function CreateDepartment() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true); // ban đầu true
  const navigate = useNavigate();

  // Chạy khi component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // sau 1s thì hiện form
    }, 1000); // 1 giây, bạn chỉnh tùy ý

    return () => clearTimeout(timer); // cleanup
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Tên khoa không được để trống");

    setLoading(true);
    try {
      const res = await fetch("https://backend-onlinesystem.onrender.com/api/exam/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_department: name }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Tạo khoa thành công");
        navigate("/departments/manage");
      } else {
        alert(data.message || "Lỗi tạo khoa");
      }
    } catch (err) {
      console.log(err);
      alert("Lỗi server. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />; // hiển thị loading ban đầu

  return (
    <div className="department-container">
      <h2>Tạo Khoa Mới</h2>
      <form onSubmit={handleSubmit} className="department-form">
        <input
          type="text"
          placeholder="Tên khoa"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">
          Tạo
        </button>
      </form>
    </div>
  );
}
