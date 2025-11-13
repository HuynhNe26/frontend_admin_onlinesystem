import React, { useEffect, useState } from "react";
import AdminAPI from "../../API/AdminAPI";
import { useNavigate } from "react-router-dom";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    id_user: null,
    fullName: "",
    email: "",
    password: "",
    role: "admin",
    level: 2
  });

  const token = localStorage.getItem("adminToken");
  const nav = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ========== READ - FETCH ADMINS ==========
  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AdminAPI.getAdmins(token);
      setAdmins(data);
    } catch (err) {
      console.error("Lỗi tải danh sách admin:", err);
      setError(err.response?.data?.msg || "Không thể tải danh sách admin");
    } finally {
      setLoading(false);
    }
  };

  // ========== UPDATE - MỞ MODAL CHỈNH SỬA ==========
  const handleEdit = (admin) => {
    setFormData({
      id_user: admin.id_user,
      fullName: admin.fullName || "",
      email: admin.username,
      password: "",
      role: admin.role || "admin",
      level: admin.level
    });
    setShowEditModal(true);
    setError("");
    setSuccess("");
  };

  // ========== UPDATE - SUBMIT ==========
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Username không được để trống");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await AdminAPI.updateAdmin(token, formData.id_user, formData);
      setSuccess("Cập nhật admin thành công!");
      setShowEditModal(false);
      fetchAdmins();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Lỗi cập nhật admin:", err);
      setError(err.response?.data?.msg || "Cập nhật admin thất bại!");
    }
  };

  // ========== DELETE ==========
  const handleDelete = async (id, username) => {
    if (window.confirm(`Bạn có chắc muốn xóa admin "${username}"?`)) {
      try {
        await AdminAPI.deleteAdmin(token, id);
        setSuccess("Xóa admin thành công!");
        setAdmins(admins.filter(a => a.id_user !== id));
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Lỗi xóa admin:", err);
        setError(err.response?.data?.msg || "Xóa admin thất bại!");
      }
    }
  };

  // ========== FILTER ==========
  const filteredAdmins = admins.filter(admin =>
    admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== HELPER FUNCTIONS ==========
  const getLevelLabel = (level) => {
    const labels = { 3: "Admin", 2: "Super Admin", 1: "User" };
    return labels[level] || "Unknown";
  };

  const getLevelColor = (level) => {
    if (level === 3) return { bg: "#dbeafe", text: "#2563eb" };
    if (level === 2) return { bg: "#fee2e2", text: "#dc2626" };
    return { bg: "#e5e7eb", text: "#6b7280" };
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* ========== HEADER ========== */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>👑 Quản lý Admin</h2>
          <button
            onClick={() => nav("/admin/create-admin")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            ➕ Tạo Admin Mới
          </button>
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

      {/* ========== ALERTS ========== */}
      {error && (
        <div style={{
          padding: "12px 15px",
          backgroundColor: "#fee2e2",
          color: "#dc2626",
          borderRadius: "5px",
          marginBottom: "15px",
          border: "1px solid #fecaca"
        }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: "12px 15px",
          backgroundColor: "#d1fae5",
          color: "#065f46",
          borderRadius: "5px",
          marginBottom: "15px",
          border: "1px solid #a7f3d0"
        }}>
          ✅ {success}
        </div>
      )}

      {/* ========== TABLE ========== */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <p style={{ marginTop: "10px", color: "#6b7280" }}>Đang tải...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ backgroundColor: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Username</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Họ Tên</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Role</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Level</th>
                  <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Đăng Nhập</th>
                  <th style={{ padding: "12px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                      {searchTerm ? "Không tìm thấy kết quả" : "Chưa có admin nào"}
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => {
                    const levelColor = getLevelColor(admin.level);
                    return (
                      <tr key={admin.id_user} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "12px", fontSize: "14px", color: "#111827" }}>{admin.id_user}</td>
                        <td style={{ padding: "12px", fontSize: "14px", fontWeight: "600", color: "#111827" }}>{admin.username}</td>
                        <td style={{ padding: "12px", fontSize: "14px", color: "#6b7280" }}>{admin.fullName || "-"}</td>
                        <td style={{ padding: "12px", fontSize: "14px", color: "#6b7280" }}>{admin.role || "admin"}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            backgroundColor: levelColor.bg,
                            color: levelColor.text,
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            {getLevelLabel(admin.level)}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontSize: "13px", color: "#6b7280" }}>
                          {admin.login_time ? new Date(admin.login_time).toLocaleString("vi-VN") : "-"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <button
                            onClick={() => handleEdit(admin)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              marginRight: "5px",
                              fontSize: "13px",
                              fontWeight: "500"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#2563eb"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#3b82f6"}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id_user, admin.username)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "500"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========== EDIT MODAL ========== */}
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
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "90vh",
            overflow: "auto"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "20px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>✏️ Chỉnh Sửa Admin</h3>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#9ca3af"
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px" }}>
              {error && (
                <div style={{
                  padding: "10px",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  fontSize: "14px"
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                  Họ và Tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                  Username *
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                  Mật khẩu mới
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Để trống nếu không đổi"
                    style={{
                      width: "100%",
                      padding: "10px",
                      paddingRight: "40px",
                      border: "1px solid #d1d5db",
                      borderRadius: "5px",
                      fontSize: "14px"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px"
                    }}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                <small style={{ color: "#6b7280", fontSize: "12px" }}>
                  Chỉ nhập khi muốn thay đổi (tối thiểu 6 ký tự)
                </small>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                  Cấp độ (Level)
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "5px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  <option value={2}>Super Admin (Level 2)</option>
                  <option value={3}>Admin (Level 3)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Cập Nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}