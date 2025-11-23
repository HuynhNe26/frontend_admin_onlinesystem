import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./statistic_users.css";
import Loading from "../../components/loading/loading";

export default function StatisticUser() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [filterType, setFilterType] = useState("month"); // month, week, year
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [chartType, setChartType] = useState("line"); // line, bar

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            processChartData();
        }
    }, [users, filterType, startDate, endDate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://backend-onlinesystem.onrender.com/api/users", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
                setTotalUsers(data.data.length);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const processChartData = () => {
        let filteredUsers = users;

        if (startDate && endDate) {
            filteredUsers = users.filter(user => {
                const createdDate = new Date(user.create_at);
                return createdDate >= new Date(startDate) && createdDate <= new Date(endDate);
            });
        }

        const grouped = {};
        
        filteredUsers.forEach(user => {
            const date = new Date(user.create_at);
            let key;

            if (filterType === "month") {
                key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            } else if (filterType === "week") {
                const weekNum = Math.ceil((date.getDate()) / 7);
                key = `Tuần ${weekNum} - ${date.getMonth() + 1}/${date.getFullYear()}`;
            } else if (filterType === "year") {
                key = `${date.getFullYear()}`;
            } else if (filterType === "day") {
                key = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            }

            grouped[key] = (grouped[key] || 0) + 1;
        });

        const chartArray = Object.entries(grouped).map(([name, count]) => ({
            name,
            users: count
        }));

        setChartData(chartArray);
        setTotalUsers(filteredUsers.length);
    };

    const resetFilter = () => {
        setStartDate("");
        setEndDate("");
        setFilterType("month");
    };

    const roleStats = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {});

    const roleChartData = Object.entries(roleStats).map(([role, count]) => ({
        name: role,
        value: count
    }));

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

    if (loading) {
        return <Loading />
    }

    return (
        <div className="statistic-container">
            <div className="statistic-header">
                <h1>Thống kê người dùng</h1>
                <div className="total-badge">
                    Tổng số: <strong>{totalUsers}</strong> người dùng
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-group">
                    <label>Loại lọc:</label>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="day">Theo ngày</option>
                        <option value="week">Theo tuần</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Từ ngày:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Đến ngày:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Loại biểu đồ:</label>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                        <option value="line">Đường</option>
                        <option value="bar">Cột</option>
                    </select>
                </div>

                <button className="btn-reset" onClick={resetFilter}>
                    🔄 Đặt lại
                </button>
            </div>

            <div className="chart-section">
                <h2>Người dùng đăng ký theo thời gian</h2>
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === "line" ? (
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="users" 
                                stroke="#667eea" 
                                strokeWidth={3}
                                name="Số người dùng"
                                dot={{ fill: '#667eea', r: 5 }}
                            />
                        </LineChart>
                    ) : (
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="users" fill="#667eea" name="Số người dùng" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Biểu đồ tròn theo role */}
            <div className="chart-section">
                <h2>Phân bố theo vai trò</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={roleChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {roleChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bảng thống kê */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Tổng người dùng</h3>
                        <p className="stat-number">{totalUsers}</p>
                    </div>
                </div>
                
                {Object.entries(roleStats).map(([role, count]) => (
                    <div className="stat-card" key={role}>
                        <div className="stat-icon">
                            {role === 'admin' ? '👑' : role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                        </div>
                        <div className="stat-info">
                            <h3>{role}</h3>
                            <p className="stat-number">{count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}