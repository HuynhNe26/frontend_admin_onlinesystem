import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/loading/loading";
import "./admin_detail.css";

export default function AdminDetail() {
    const [info, setInfo] = useState(null)
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!id) {
            alert("Id quản trị không tồn tại!")
            navigate('/admin/manage_admin')
            return
        }

        const getInfoAdmin = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`https://backend-onlinesystem.onrender.com/api/admin/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                })

                const data = await response.json()
                console.log(data)
                if (data.success) {
                    setInfo(data.data)
                }
                else {
                    setError("Dữ liệu chưa được cập nhật")
                }
            }
            catch (e) {
                console.error("Lỗi lấy dữ liệu:", e)
                setError("Lỗi lấy dữ liệu chi tiết quản trị viên!")
            }
            finally {
                setLoading(false)
            }
        }

        getInfoAdmin()
    }, [id, navigate])

    if (loading) {
        return <Loading />
    }

    if (error) {
        return (
            <div className="admin-detail-container">
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button onClick={() => navigate('/admin/manage_admin')} className="btn-back-error">
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        )
    }

    if (!info) {
        return (
            <div className="admin-detail-container">
                <div className="no-data">
                    <span className="no-data-icon">📭</span>
                    <p>Không tìm thấy thông tin quản trị viên</p>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-detail-container">
            <div className="detail-header">
                <button onClick={() => navigate('/admin/manage_admin')} className="btn-back">
                    <span>←</span> Quay lại
                </button>
                <h1 className="page-title">Chi Tiết Quản Trị Viên</h1>

                <div className="card-footer">
                    <button className="btn-edit">
                        <span>✏️</span> Chỉnh sửa
                    </button>
                    <button className="btn-delete">
                        <span>🗑️</span> Xóa
                    </button>
                </div>
            </div>

            <div className="detail-card">
                <div className="card-header">
                    <div className="avatar-section">
                        <div className="avatar">
                            {info.fullName ? info.fullName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="header-info">
                            <h2 className="admin-name">{info.fullName || 'Chưa cập nhật'}</h2>
                            <span className={`status-badge ${info.status || 'active'}`}>
                                {info.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="info-section">
                        <h3 className="section-title">Thông Tin Cá Nhân</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Email</span>
                                <span className="info-value">{info.email || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Họ Tên</span>
                                <span className="info-value">{info.fullName || 'Chưa cập nhật'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ngày sinh</span>
                                <span className="info-value">
                                    {info.dateOfBirth ? new Date(info.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3 className="section-title">Thông Tin Quản Trị</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Cấp độ</span>
                                <span className="info-value level-badge">
                                    Level {info.level}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">ID User</span>
                                <span className="info-value">{info.id_user || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Ngày tạo</span>
                                <span className="info-value">
                                    {info.create_at ? new Date(info.create_at).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">🔄 Cập nhật lần cuối</span>
                                <span className="info-value">
                                    {info.updatedAt ? new Date(info.updatedAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}