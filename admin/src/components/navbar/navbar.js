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
        { to: "/statistic/user", label: "Người dùng" },
        { to: "/statistic/revenue", label: "Doanh thu" },
        { to: "/statistic/take_exam", label: "Lượt làm bài" },
      ],
    },
    {
      to: "/departments",
      label: "Phòng ban",
      icon: Building2,
      subMenu: [
        { to: "/departments/manage", label: "Quản lý phòng ban" },
        { to: "/departments/create", label: "Tạo phòng ban" },
      ],
    },
    {
      to: "/exams",
      label: "Đề thi",
      icon: FileText,
      subMenu: [
        { to: "/exams/manage", label: "Quản lý đề thi" },
        { to: "/exams/create", label: "Tạo đề thi" },
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
        { to: "/admin/manage_users", label: "Quản lý người dùng" },
        { to: "/users/blacklist", label: "Danh sách đen" },
      ],
    },
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

  const handleLogout = async () => {
    try {
      await fetch("https://backend-onlinesystem.onrender.com/api/admin/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user?.token}` 
        }
      });
      logout(); // xóa token client-side
      navigate("/admin/login", { replace: true });
    } catch (e) {
      alert("Lỗi đăng xuất!");
    }
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-bg-effect"></div>

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
          <Link style={{textDecoration: 'none', color: 'white', display: 'flex'}} to={`/admin/${user.id}`}>
          <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="user-details" style={{marginLeft: '12px'}}>
            <span className="user-name">{user?.name || "Admin"}</span>
            <span className="user-role">
              {level === 2 ? "Quản trị viên" : "Quản trị viên cấp cao"}
            </span>
          </div>
          </Link>
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