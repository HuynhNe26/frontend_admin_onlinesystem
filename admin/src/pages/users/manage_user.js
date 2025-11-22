import React, { useEffect, useState } from "react";
import Loading from "../../components/loading/loading";
import "./manage_user.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const getAllUsers = async () => {
      try {
        const response = await fetch(
          "https://backend-onlinesystem.onrender.com/api/users",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch (e) {
        alert("Lỗi lấy dữ liệu người dùng!");
      } finally {
        setLoading(false);
      }
    };

    getAllUsers(); 
  }, []);

  if (loading) {
    return <Loading />;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="manage-users-container">
      <h1>Quản lý người dùng</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm kiếm theo email hoặc họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button>Tìm kiếm</button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Giới tính</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id_user}>
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.gender}</td>
                <td>{user.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Không tìm thấy người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
