import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Điều chỉnh path nếu cần
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Dùng context thay vì localStorage
  const level = user?.level;

  const [openMenu, setOpenMenu] = useState(null);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      to: "/statistical",
      label: "Thống kê",
      icon: "Chart",
      subMenu: [
        { to: "/statistical/user", label: "Người dùng" },
        { to: "/statistical/revenue", label: "Doanh thu" },
        { to: "/statistical/take_exam", label: "Lượt làm bài" },
      ],
    },
    {
      to: "/departments",
      label: "Phòng ban",
      icon: "Building",
      subMenu: [
        { to: "/departments/manage", label: "Quản lý phòng ban" },
        { to: "/departments/create", label: "Tạo phòng ban" },
        { to: "/departments/edit", label: "Sửa phòng ban" },
      ],
    },
    {
      to: "/exams",
      label: "Đề thi",
      icon: "Document",
      subMenu: [
        { to: "/exams/manage", label: "Quản lý đề thi" },
        { to: "/exams/create", label: "Tạo đề thi" },
        { to: "/exams/edit", label: "Sửa đề thi" },
      ],
    },
    {
      to: "/admins",
      label: "Quản trị viên",
      icon: "Admin",
      subMenu: [
        { to: "/admin/manage-admin", label: "Quản lý quản trị viên" },
        { to: "/admin/create-admin", label: "Thêm quản trị viên" },
      ],
    },
    {
      to: "/users",
      label: "Người dùng",
      icon: "Users",
      subMenu: [
        { to: "/admin/manage-users", label: "Quản lý người dùng" },
        { to: "/users/blacklist", label: "Danh sách đen" },
      ],
    },
    { to: "/revenue", label: "Doanh thu", icon: "Money" },
    { to: "/feedback", label: "Phản hồi", icon: "Message" },
  ];

  const filteredMenu =
    level === 3
      ? menuItems.filter(
          (item) => item.label !== "Quản trị viên" && item.label !== "Người dùng"
        )
      : menuItems;

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setOpenMenu(openMenu === item.to ? null : item.to);
    } else {
      setOpenMenu(null);
    }
  };

  const handleLogout = () => {
    logout(); // Dùng hàm logout từ context
    navigate("/admin/login", { replace: true });
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-bg-effect"></div>

      {/* Logo */}
      <Link className="navbar-header" to="/">
        <div className="navbar-logo">
          <div className="logo-icon">Book</div>
          <span className="logo-text">Education Plus</span>
        </div>
      </Link>

      {/* Menu */}
      <div className="navbar-main">
        {filteredMenu.map((item) => {
          const isActive = activeLink.startsWith(item.to);

          return (
            <div key={item.to} className="menu-item-wrapper">
              {/* Menu có submenu */}
              {item.subMenu ? (
                <div
                  className={`navbar-link ${isActive ? "active" : ""} ${
                    openMenu === item.to ? "submenu-open" : ""
                  }`}
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="nav-link-content">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                  <span
                    className={`submenu-arrow ${
                      openMenu === item.to ? "rotate" : ""
                    }`}
                  >
                    Down Arrow
                  </span>
                </div>
              ) : (
                <Link
                  to={item.to}
                  className={`navbar-link ${isActive ? "active" : ""}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="nav-link-content">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                </Link>
              )}

              {/* Submenu */}
              {item.subMenu && openMenu === item.to && (
                <div className="submenu">
                  {item.subMenu.map((sub) => (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      className={`submenu-link ${
                        activeLink === sub.to ? "active" : ""
                      }`}
                    >
                      <span className="submenu-dot">•</span>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="navbar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <span>User</span>
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || "Admin"}</span>
            <span className="user-role">
              {level === 2 ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        {/* Nút Đăng xuất */}
        <button className="navbar-link logout-link" onClick={handleLogout}>
          <div className="nav-link-content">
            <span className="nav-icon">Exit</span>
            <span className="nav-label">Đăng xuất</span>
          </div>
        </button>
      </div>
    </nav>
  );
}