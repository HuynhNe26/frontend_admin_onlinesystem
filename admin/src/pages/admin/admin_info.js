import React, {useEffect, useState} from "react";
import Loading from "../../components/loading/loading";
import { useParams } from "react-router-dom";
import "./admin_info.css"

export default function AdminInfo() {
    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})
    const {id} = useParams()

    useEffect(() => {
        setLoading(true)
        const getInfo = async () => {
            if (!id) {
                alert("Lỗi không có id quản trị viên!")
                setLoading(false)
                return
            }
            try {
                const response = await fetch(`https://backend-onlinesystem.onrender.com/api/admin/${id}`)
                const data = await response.json()
                if (data.success) {
                    setAdmin(data.data)
                }
            } catch (e) {
                alert("Lỗi lấy dữ liệu!")
            } finally {
                setLoading(false)
            }
        }

        getInfo()
    }, [id])

    const handleEditClick = () => {
        setEditData(admin)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditData({})
    }

    const handleSave = async () => {
        setLoading(true)
        console.log(editData)
        try {
            const response = await fetch(`https://backend-onlinesystem.onrender.com/api/admin/update/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(editData)
            })
            const data = await response.json()

            if (data.success) {
                setAdmin(editData)
                setIsEditing(false)
                alert("Cập nhật thành công!")
            } else {
                alert("Cập nhật thất bại!")
            }
        } catch (err) {
            alert("Lỗi cập nhật!")
        }
        finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />
    if (!admin) return <div className="admin-info-container"><div className="no-data">Không có dữ liệu</div></div>

    return (
        <div className="admin-info-container">
            <div className="admin-info-header">
                <h1>Thông tin cá nhân</h1>
            </div>

            <div className="admin-info-card">

                {/* Họ và tên */}
                <div className="info-row">
                    <span className="info-label">Họ và tên:</span>
                    {isEditing ? (
                        <input 
                            type="text"
                            value={editData.fullName || ''}
                            onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                            className="info-input"
                        />
                    ) : (
                        <span className="info-value">{admin.fullName || 'N/A'}</span>
                    )}
                </div>

                {/* Email */}
                <div className="info-row">
                    <span className="info-label">Email:</span>
                    {isEditing ? (
                        <input 
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="info-input"
                        />
                    ) : (
                        <span className="info-value">{admin.email || 'N/A'}</span>
                    )}
                </div>

                <div className="info-row">
                    <span className="info-label">Ngày sinh:</span>
                    {isEditing ? (
                        <input 
                            type="date"
                            value={editData.dateOfBirth?.slice(0,10) || ''}
                            onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                            className="info-input"
                        />
                    ) : (
                        <span className="info-value">
                            {admin.dateOfBirth ? new Date(admin.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                    )}
                </div>

                <div className="info-row">
                    <span className="info-label">Giới tính:</span>
                    {isEditing ? (
                        <select 
                            value={editData.gender || 'Nam'}
                            onChange={(e) => setEditData({...editData, gender: e.target.value})}
                            className="info-input"
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    ) : (
                        <span className="info-value">{admin.gender || 'N/A'}</span>
                    )}
                </div>

                <div className="info-row">
                    <span className="info-label">Vai trò:</span>
                    <span className="info-value role">{admin.role || 'N/A'}</span>
                </div>

                <div className="info-row">
                    <span className="info-label">Ngày tạo:</span>
                    <span className="info-value readonly">
                        {admin.create_at ? new Date(admin.create_at).toLocaleString('vi-VN') : 'N/A'}
                    </span>
                </div>

            </div>

            <div className="info-actions">
                {!isEditing ? (
                    <button className="btn-edit-info" onClick={handleEditClick}>
                        Chỉnh sửa thông tin
                    </button>
                ) : (
                    <div className="edit-actions">
                        <button className="btn-save" onClick={handleSave}>
                            Lưu thay đổi
                        </button>
                        <button className="btn-cancel" onClick={handleCancel}>
                            Hủy
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}