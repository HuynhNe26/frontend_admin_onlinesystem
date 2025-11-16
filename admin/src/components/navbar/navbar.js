import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart3,
  Building2,
  FileText,
  UserCog,
  Users,
  DollarSign,
  MessageSquare,
  BookOpen,
  ChevronDown,
  LogOut
} from "lucide-react";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
      icon: BarChart3,
      subMenu: [
        { to: "/statistical/user", label: "Người dùng" },
        { to: "/statistical/revenue", label: "Doanh thu" },
        { to: "/statistical/take_exam", label: "Lượt làm bài" },
      ],
    },
    {
      to: "/departments",
      label: "Phòng ban",
      icon: Building2,
      subMenu: [
        { to: "/departments/manage", label: "Quản lý phòng ban" },
        { to: "/departments/create", label: "Tạo phòng ban" },
        { to: "/departments/edit", label: "Sửa phòng ban" },
      ],
    },
    {
      to: "/exams",
      label: "Đề thi",
      icon: FileText,
      subMenu: [
        { to: "/exams/manage", label: "Quản lý đề thi" },
        { to: "/exams/create", label: "Tạo đề thi" },
        { to: "/exams/edit", label: "Sửa đề thi" },
      ],
    },
    {
      to: "/admins",
      label: "Quản trị viên",
      icon: UserCog,
      subMenu: [
        { to: "/admin/manage_admin", label: "Quản lý quản trị viên" },
        { to: "/admin/create_admin", label: "Thêm quản trị viên" },
      ],
    },
    {
      to: "/users",
      label: "Người dùng",
      icon: Users,
      subMenu: [
        { to: "/admin/manage-users", label: "Quản lý người dùng" },
        { to: "/users/blacklist", label: "Danh sách đen" },
      ],
    },
    { to: "/revenue", label: "Doanh thu", icon: DollarSign },
    { to: "/feedback", label: "Phản hồi", icon: MessageSquare },
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
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-bg-effect"></div>

      {/* Logo */}
      <Link className="navbar-header" to="/">
        <div className="navbar-logo">
          <div className="logo-icon">
            <BookOpen size={24} />
          </div>
          <span className="logo-text">Education Plus</span>
        </div>
      </Link>

      <div className="navbar-main">
        {filteredMenu.map((item) => {
          const isActive = activeLink.startsWith(item.to);
          const IconComponent = item.icon;

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
                    <span className="nav-icon">
                      <IconComponent size={20} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                  <span className={`submenu-arrow ${openMenu === item.to ? "rotate" : ""}`}>
                    <ChevronDown size={16} />
                  </span>
                </div>
              ) : (
                <Link
                  to={item.to}
                  className={`navbar-link ${isActive ? "active" : ""}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="nav-link-content">
                    <span className="nav-icon">
                      <IconComponent size={20} />
                    </span>
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

      <div className="navbar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <Users size={20} />
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || "Admin"}</span>
            <span className="user-role">
              {level === 2 ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        <button className="navbar-link logout-link" onClick={handleLogout}>
          <div className="nav-link-content">
            <span className="nav-icon">
              <LogOut size={20} />
            </span>
            <span className="nav-label">Đăng xuất</span>
          </div>
        </button>
      </div>
    </nav>
  );
}