import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./update_department.css";

export default function UpdateDepartment() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await fetch(`https://backend-onlinesystem.onrender.com/api/exam/departments/${id}`);
        const data = await res.json();
        if (data.success && data.department) setName(data.department.name_department);
        else alert("Không tìm thấy khoa");
      } catch (err) {
        console.log(err);
        alert("Lỗi server");
      }
    };
    fetchDepartment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Tên khoa không được để trống");

    setLoading(true);
    try {
      const res = await fetch(`https://backend-onlinesystem.onrender.com/api/exam/departments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_department: name }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Cập nhật thành công");
        navigate("/departments/manage");
      } else alert(data.message || "Lỗi cập nhật");
    } catch (err) {
      console.log(err);
      alert("Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-department-container">
      <h2>Cập Nhật Khoa</h2>
      <form onSubmit={handleSubmit} className="update-department-form">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
}
