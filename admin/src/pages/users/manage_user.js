import React, { useEffect, useState } from "react";
import AdminAPI from "../../API/AdminAPI";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    id_user: null,
    fullName: "",
    email: "",
    gender: "",
    status: ""
  });

  const token = localStorage.getItem("adminToken");
  const nav = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // ====== READ USERS ======
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AdminAPI.getUsers(token);
      // Lọc level = 1
      setUsers(data.filter(u => u.level === 1));
    } catch (err) {
      console.error("Lỗi tải danh sách user:", err);
      setError(err.response?.data?.msg || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // ====== EDIT MODAL ======
  const handleEdit = (user) => {
    setFormData({
      id_user: user.id_user,
      fullName: user.fullName || "",
      email: user.username || "",
      gender: user.gender || "",
      status: user.status || ""
    });
    setShowEditModal(true);
    setError("");
    setSuccess("");
  };

  // ====== UPDATE USER ======
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Username không được để trống");
      return;
    }

    try {
      await AdminAPI.updateUser(token, formData.id_user, formData);
      setSuccess("Cập nhật user thành công!");
      setShowEditModal(false);
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Lỗi cập nhật user:", err);
      setError(err.response?.data?.msg || "Cập nhật user thất bại!");
    }
  };

  // ====== DELETE USER ======
  const handleDelete = async (id, username) => {
    if (window.confirm(`Bạn có chắc muốn xóa user "${username}"?`)) {
      try {
        await AdminAPI.deleteUser(token, id);
        setSuccess("Xóa user thành công!");
        setUsers(users.filter(u => u.id_user !== id));
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Lỗi xóa user:", err);
        setError(err.response?.data?.msg || "Xóa user thất bại!");
      }
    }
  };

  // ====== FILTER USERS ======
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>👥 Quản lý Người Dùng</h2>
        </div>
        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo username hoặc tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "14px"
          }}
        />
      </div>

      {/* ALERTS */}
      {error && <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "5px", marginBottom: "15px" }}>{error}</div>}
      {success && <div style={{ padding: "12px", backgroundColor: "#d1fae5", color: "#065f46", borderRadius: "5px", marginBottom: "15px" }}>{success}</div>}

      {/* TABLE */}
      <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Đang tải...</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Họ Tên</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Gender</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>Chưa có người dùng</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id_user} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px" }}>{user.id_user}</td>
                      <td style={{ padding: "12px" }}>{user.username}</td>
                      <td style={{ padding: "12px" }}>{user.fullName || "-"}</td>
                      <td style={{ padding: "12px" }}>{user.gender || "-"}</td>
                      <td style={{ padding: "12px" }}>{user.status || "-"}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button onClick={() => handleEdit(user)} style={{ marginRight: "5px" }}>✏️ Sửa</button>
                        <button onClick={() => handleDelete(user.id_user, user.username)}>🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: "white", borderRadius: "8px", width: "90%", maxWidth: "500px", padding: "20px" }}>
            <h3>✏️ Chỉnh Sửa Người Dùng</h3>
            <div>
              <label>Họ và Tên</label>
              <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div>
              <label>Username *</label>
              <input type="text" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label>Gender</label>
              <input type="text" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} />
            </div>
            <div>
              <label>Status</label>
              <input type="text" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} />
            </div>
            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button onClick={() => setShowEditModal(false)}>Hủy</button>
              <button onClick={handleUpdate}>Cập Nhật</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
