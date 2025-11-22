import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from "../../components/loading/loading"
import "./manage_admin.css"

export default function ManageAdmin() {
    const [admins, setAdmins] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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

                setAdmins(data.data)
            }
            catch (e) {
                alert("Lỗi lấy dữ liệu. Vui lòng thử lại!")
                console.log("Lỗi lấy dữ liệu: ", e)
            }
            finally {
                setLoading(false)
            }
        }

        getAllAdmin() 
    }, []) 

    if (loading) {
        return <Loading />
    }

    return (
        <div className="manage-admin-container">
            <h1 className="page-title">Quản Lý Admin</h1>
            <button className='btn-create-admin'>Thêm quản trị viên</button>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Email</th>
                            <th>Họ Tên</th>
                            <th>Cấp độ</th>
                            <th></th>
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
                                        <button className="btn-detail"
                                            onClick={() => {navigate(`/admin/manage_admin/${admin.id_user}`)}}
                                        >Xem chi tiết</button>
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