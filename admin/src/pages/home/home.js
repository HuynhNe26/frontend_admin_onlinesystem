import React, { useState, useEffect } from "react";
import "./home.css";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth(); // Chỉ cần user từ context

  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  // Mock stats (có thể thay bằng API sau)
  const [stats] = useState({
    totalUsers: 123,
    totalExams: 45,
    totalDepartments: 6,
    revenue: 9876543,
  });

  // Update giờ và greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Chào buổi sáng");
    else if (hour >= 12 && hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");

    return () => clearInterval(timer);
  }, []);

  const quickStats = [
    { label: "Tổng người dùng", value: stats.totalUsers, icon: "👥", color: "blue" },
    { label: "Đề thi", value: stats.totalExams, icon: "📝", color: "purple" },
    { label: "Phòng ban", value: stats.totalDepartments, icon: "🏢", color: "green" },
    { label: "Doanh thu", value: `${(stats.revenue / 1_000_000).toFixed(0)}M`, icon: "💰", color: "orange" },
  ];

  const recentActivities = [
    { action: "Người dùng mới đăng ký", user: "Nguyễn Văn A", time: "5 phút trước", icon: "✅" },
    { action: "Hoàn thành đề thi", user: "Trần Thị B", time: "12 phút trước", icon: "📊" },
    { action: "Phản hồi mới", user: "Lê Văn C", time: "23 phút trước", icon: "💬" },
    { action: "Thanh toán thành công", user: "Phạm Thị D", time: "1 giờ trước", icon: "💳" },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="greeting-section">
            <h1 className="greeting">{greeting}, {user?.name || "Admin"}</h1>
            <p className="subtitle">Chào mừng bạn quay trở lại với Education Plus</p>
          </div>
          <div className="time-card">
            <div className="time-display">
              {currentTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="date-display">
              {currentTime.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floating-icon" style={{ animationDelay: '0s' }}>🎓</div>
          <div className="floating-icon" style={{ animationDelay: '1s' }}>📚</div>
          <div className="floating-icon" style={{ animationDelay: '2s' }}>✨</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-icon"><span className="icon-emoji">{stat.icon}</span></div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
            <div className="stat-gradient"></div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="activities-section">
        <div className="section-header">
          <h2 className="section-title">🔔 Hoạt động gần đây</h2>
          <button className="view-all-btn">Xem tất cả →</button>
        </div>
        <div className="activities-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-user">{activity.user}</div>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">⚡ Thao tác nhanh</h2>
        <div className="actions-grid">
          <button className="action-btn purple"><span className="action-icon">➕</span><span>Tạo đề thi mới</span></button>
          <button className="action-btn green"><span className="action-icon">👤</span><span>Thêm người dùng</span></button>
          <button className="action-btn orange"><span className="action-icon">📊</span><span>Xem báo cáo</span></button>
          <button className="action-btn pink"><span className="action-icon">⚙️</span><span>Cài đặt</span></button>
        </div>
      </div>
    </div>
  );
}
