import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./delete_department.css";

export default function DeleteDepartment() {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await fetch(`https://backend-onlinesystem.onrender.com/api/exam/departments/${id}`);
        const data = await res.json();
        if (data.success) setDepartment(data.department);
        else alert("Không tìm thấy khoa");
      } catch (err) {
        console.log(err);
        alert("Lỗi server");
      }
    };
    fetchDepartment();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này?")) return;
    setLoading(true);
    try {
      const res = await fetch(`https://backend-onlinesystem.onrender.com/api/exam/departments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Xóa thành công");
        navigate("/departments/manage");
      } else alert(data.message || "Lỗi xóa");
    } catch (err) {
      console.log(err);
      alert("Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  if (!department) return <p>Đang tải...</p>;

  return (
    <div className="delete-department-container">
      <h2>Xóa Khoa</h2>
      <p>Bạn có chắc muốn xóa: <b>{department.name_department}</b> ?</p>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Đang xóa..." : "Xóa"}
      </button>
    </div>
  );
}
