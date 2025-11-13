const API_URL = "http://127.0.0.1:5000";

const AdminAPI = {
  // Đăng nhập
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  // Đăng xuất
  logout: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        await fetch(`${API_URL}/api/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.log("Logout API error:", err);
    }
  },

  // Dashboard
  getDashboard: async (token) => {
    const res = await fetch(`${API_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Get dashboard failed");
    return res.json();
  },

  // ========== ADMIN USERS MANAGEMENT ==========

  // READ - Lấy danh sách admin
  getAdmins: async (token) => {
    const res = await fetch(`${API_URL}/api/admin/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Get admins failed");
    const data = await res.json();
    return data.data;
  },

  // CREATE - Tạo admin mới
  createAdmin: async (token, newAdmin) => {
    const body = {
      username: newAdmin.email || newAdmin.username,
      password: newAdmin.password,
      fullName: newAdmin.fullName || "",
      role: newAdmin.role || "admin",
      level: parseInt(newAdmin.level) || 2
    };
    const res = await fetch(`${API_URL}/api/admin/users/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Create admin failed");
    return res.json();
  },

  // UPDATE - Cập nhật admin
  updateAdmin: async (token, id, updatedData) => {
    const body = {
      username: updatedData.email || updatedData.username,
      fullName: updatedData.fullName || "",
      role: updatedData.role || "admin",
      level: parseInt(updatedData.level) || 2
    };
    if (updatedData.password && updatedData.password.trim() !== "") {
      body.password = updatedData.password;
    }
    const res = await fetch(`${API_URL}/api/admin/users/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Update admin failed");
    return res.json();
  },

  // DELETE - Xóa admin
  deleteAdmin: async (token, id) => {
    const res = await fetch(`${API_URL}/api/admin/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Delete admin failed");
    return res.json();
  },

  // USER MANAGEMENT
  getUsers: async (token) => {
    const res = await fetch(`${API_URL}/api/manage/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Get users failed");
    const data = await res.json();
    return data.data;
  },

  updateUser: async (token, userId, updatedData) => {
    const res = await fetch(`${API_URL}/api/manage/update/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) throw new Error("Update user failed");
    return res.json();
  },

  deleteUser: async (token, userId) => {
    const res = await fetch(`${API_URL}/api/manage/delete/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Delete user failed");
    return res.json();
  }
};

export default AdminAPI;
