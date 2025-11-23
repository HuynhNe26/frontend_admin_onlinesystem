import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./create_admin.css"
import Loading from '../../components/loading/loading'

export default function CreateAdmin() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        dateOfBirth: '',
        password: '',
        level: '2',
        gender: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Họ tên không được để trống'
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh không được để trống'
        } 

        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống'
        }

        if (!formData.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const { confirmPassword, ...submitData } = formData
            
            const response = await fetch('https://backend-onlinesystem.onrender.com/api/admin/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            })

            const data = await response.json()

            if (data.success) {
                alert('Tạo quản trị viên thành công!')
                navigate('/admin/manage_admin')
            } else {
                alert(data.message || 'Có lỗi xảy ra khi tạo quản trị viên')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Lỗi kết nối! Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setFormData({
            email: '',
            fullName: '',
            dateOfBirth: '',
            password: '',
            level: '2',
            gender: ''
        })
        setErrors({})
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="create-admin-container">
            <div className="create-admin-wrapper">
                <div className="form-header">
                    <button onClick={() => navigate('/admin/manage_admin')} className="btn-back">
                        <span>←</span> Quay lại
                    </button>
                    <h1 className="form-title">Tạo Quản Trị Viên Mới</h1>
                    <p className="form-subtitle">Vui lòng điền đầy đủ thông tin bên dưới</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    {/* Email */}
                    <div className="form-group" style={{width: '1110px'}}>
                        <label htmlFor="email" className="form-label">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="example@email.com"
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* Full Name */}
                    <div className="form-group" style={{width: '1110px'}}>
                        <label htmlFor="fullName" className="form-label">
                            Họ và Tên <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`form-input ${errors.fullName ? 'error' : ''}`}
                            placeholder="Nguyễn Văn A"
                        />
                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                    </div>

                    {/* Date of Birth and Gender */}
                    <div className="form-row">
                        <div className="form-group" style={{width: '500px'}}>
                            <label htmlFor="dateOfBirth" className="form-label">
                                Ngày Sinh <span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                            />
                            {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                        </div>
                    
                        <div className="form-group" style={{marginLeft: '100px'}}>
                            <label htmlFor="gender" className="form-label">
                                Giới Tính <span className="required">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`form-input ${errors.gender ? 'error' : ''}`}
                            >
                                <option value="">-- Chọn giới tính --</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                            {errors.gender && <span className="error-message">{errors.gender}</span>}
                        </div>
                    </div>

                    {/* Level */}
                    <div className="form-group" style={{width: '1150px'}}>
                        <label htmlFor="level" className="form-label">
                            Cấp Độ <span className="required">*</span>
                        </label>
                        <select
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="2">Quản trị viên</option>
                            <option value="3">Quản trị viên cấp cao</option>
                        </select>
                    </div>

                    {/* Password */}
                    <div className="form-group" style={{width: '1080px'}}>
                        <label htmlFor="password" className="form-label">
                            Mật Khẩu <span className="required">*</span>
                        </label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={handleReset}
                            className="btn-reset"
                            disabled={loading}
                        >
                            <span>🔄</span> Đặt lại
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            onClick={handleSubmit}
                        >
                            Tạo quản trị viên
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}