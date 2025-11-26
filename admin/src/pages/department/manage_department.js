import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from "../../components/loading/loading"
import "./manage_department.css"

export default function ManageDepartment() {
    const [departments, setDepartments] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const API ="https://backend-onlinesystem.onrender.com/api/exam"
    const getAllDepartments = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API}/departments`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.json()
            setDepartments(data.departments || [])
        } catch (e) {
            alert("Lỗi lấy dữ liệu. Vui lòng thử lại!")
            console.log("Lỗi lấy dữ liệu: ", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllDepartments()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này?")) return;

        try {
            const response = await fetch(`${API}departments/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await response.json()
            if (data.success) {
                alert("Xóa khoa thành công")
                getAllDepartments()
            } else {
                alert("Xóa thất bại: " + data.message)
            }
        } catch (e) {
            console.log(e)
            alert("Lỗi xóa khoa")
        }
    }

    if (loading) return <Loading />

    return (
        <div className="manage-department-container">
            <h1 className="page-title">Quản Lý Khoa</h1>
            <button className='btn-create-department' onClick={() => navigate("/departments/create")}>
                Thêm khoa
            </button>

            <div className="department-table-wrapper">
                <table className="department-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên khoa</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length > 0 ? (
                            departments.map((dep, index) => (
                                <tr key={dep.id_department}>
                                    <td>{index + 1}</td>
                                    <td>{dep.name_department}</td>
                                    <td className="actions">
                                        <button className="btn-update" onClick={() => navigate(`/departments/update/${dep.id_department}`)}>
                                            Sửa
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDelete(dep.id_department)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    Không có dữ liệu khoa
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
