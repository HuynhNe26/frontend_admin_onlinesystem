import React, { useState, useEffect } from 'react'
import Loading from "../../components/loading/loading"
import "./manage_admin.css"

export default function ManageAdmin() {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getAllAdmin = async () => {
            setLoading(true)
            try {
                const response = await fetch("https://backend-onlinesystem.onrender.com/api/admin/admin", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                console.log(data)

                if (data.success) {
                    setAdmins(data.data)
                } else {
                    alert("Không thể lấy dữ liệu quản trị viên")
                }
            }
            catch (e) {
                alert("Lỗi lấy dữ liệu. Vui lòng thử lại!")
                console.log("Lỗi lấy dữ liệu: ", e)
            }
            finally {
                setLoading(false)
            }
        }

        getAllAdmin() // Gọi hàm
    }, []) // Thêm dependency array rỗng

    if (loading) {
        return <Loading />
    }

    return (
        <div className="manage-admin-container">
            <h1 className="page-title">Quản Lý Admin</h1>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Email</th>
                            <th>Họ Tên</th>
                            <th>Level</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.length > 0 ? (
                            admins.map((admin, index) => (
                                <tr key={admin.id_user}>
                                    <td>{index + 1}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.fullName}</td>
                                    <td>{admin.level}</td>
                                    <td>
                                        <button className="btn-detail">Xem chi tiết</button>
                                        <button className="btn-delete">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    Không có dữ liệu quản trị viên
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}