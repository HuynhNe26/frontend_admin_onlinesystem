import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState(null);
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const level = user?.level;
  const menuItems = [
    { to: "/statistical",
      label: "Thống kê",
      icon: "📊",
      subMenu: [
        { to: "/statistical/user", label: "Người dùng" },
        { to: "/statistical/revenue", label: "Doanh thu" },
        { to: "/statistical/take_exam", label: "Lượt làm bài" },
      ]
    },
    { to: "/departments",
      label: "Phòng ban",
      icon: "🏢",
      subMenu: [
        { to: "/departments/manage", label: "Quản lý phòng ban" },
        { to: "/departments/create", label: "Tạo phòng ban" },
        { to: "/departments/edit", label: "Sửa phòng ban" },
      ]
    },
    {
      to: "/exams",
      label: "Đề thi",
      icon: "📝",
      subMenu: [
        { to: "/exams/manage", label: "Quản lý đề thi" },
        { to: "/exams/create", label: "Tạo đề thi" },
        { to: "/exams/edit", label: "Sửa đề thi" },
      ]
    },
    { to: "/admins",
      label: "Quản trị viên",
      icon: "🧑‍💼",
      subMenu: [
        { to: "/admin/manage-admin", label: "Quản lý quản trị viên" },
        { to: "/admin/create-admin", label: "Thêm quản trị viên" },
      ]
    },
    { to: "/users",
      label: "Người dùng",
      icon: "👥",
      subMenu: [
        { to: "/admin/manage-users", label: "Quản lý người dùng" },
        { to: "/users/blacklist", label: "Danh sách đen" },
      ]
    },
    { to: "/revenue", label: "Doanh thu", icon: "💰" },
    { to: "/feedback", label: "Phản hồi", icon: "💬" },
  ];

  const handleMenuClick = (item) => {
    if (item.subMenu) {
      setOpenMenu(openMenu === item.to ? null : item.to);
    } else {
      setActiveLink(item.to.slice(1));
      setOpenMenu(null);
    }
  };
    let filteredMenu = menuItems;

    if (level === 3) {
      filteredMenu = menuItems.filter(item =>
        item.label !== "Quản trị viên" && item.label !== "Người dùng"
      );
    }
  return (
    <nav className="navbar-container">
      <div className="navbar-bg-effect"></div>
      
      <Link className="navbar-header" to="/">
        <div className="navbar-logo">
          <div className="logo-icon">📘</div>
          <span className="logo-text">Education Plus</span>
        </div>
      </Link>

      <div className="navbar-main">
        {filteredMenu.map((item) => (
          <div key={item.to} className="menu-item-wrapper">
            {item.subMenu ? (
              <div
                className={`navbar-link ${
                  activeLink === item.to.slice(1) ? "active" : ""
                } ${openMenu === item.to ? "submenu-open" : ""}`}
                onClick={() => handleMenuClick(item)}
              >
                <div className="nav-link-content">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </div>
                <span className={`submenu-arrow ${openMenu === item.to ? "rotate" : ""}`}>
                  ▼
                </span>
              </div>
            ) : (
              <Link
                to={item.to}
                className={`navbar-link ${
                  activeLink === item.to.slice(1) ? "active" : ""
                }`}
                onClick={() => handleMenuClick(item)}
              >
                <div className="nav-link-content">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </div>
              </Link>
            )}

            {item.subMenu && openMenu === item.to && (
              <div className="submenu">
                {item.subMenu.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className={`submenu-link ${
                      activeLink === sub.to.slice(1) ? "active" : ""
                    }`}
                    onClick={() => setActiveLink(sub.to.slice(1))}
                  >
                    <span className="submenu-dot">•</span>
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="navbar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
              <span className="user-role">{level === 2 ? "Super Admin" : "Admin"}</span>
          </div>
        </div>

        <Link to="/logout" className="navbar-link logout-link">
          <div className="nav-link-content">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Đăng xuất</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}