"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Stethoscope } from "lucide-react"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    fullName: "",
    phone: "",
    address: "",
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    if (registerData.password !== registerData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!")
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          full_name: registerData.fullName,
          email: registerData.email,
          phone: registerData.phone,
          role: registerData.role,
          address: registerData.address,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Đăng ký thất bại!')
      }

      // On successful registration, redirect to login
      navigate('/login')
    } catch (err) {
      setError(err.message)
      console.error('Registration error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hệ thống Phòng khám</h1>
          <p className="text-gray-600 mt-2">Tạo tài khoản mới để sử dụng hệ thống</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Đăng ký tài khoản</h2>
            <p className="text-gray-600 text-sm mt-1">Điền thông tin để tạo tài khoản mới</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 text-left">
                  Tên đăng nhập
                </label>
                <input
                  id="register-username"
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="register-fullname" className="block text-sm font-medium text-gray-700 text-left">
                  Họ và tên
                </label>
                <input
                  id="register-fullname"
                  type="text"
                  placeholder="Họ và tên"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 text-left">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="email@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 text-left">
                Số điện thoại
              </label>
              <input
                id="register-phone"
                type="tel"
                placeholder="0123456789"
                value={registerData.phone}
                onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="register-address" className="block text-sm font-medium text-gray-700 text-left">
                Địa chỉ
              </label>
              <input
                id="register-address"
                type="text" // Fixed: Changed from type="tel" to type="text" for address
                placeholder="Hà Nội, Việt Nam"
                value={registerData.address}
                onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="register-role" className="block text-sm font-medium text-gray-700 text-left">
                Vai trò
              </label>
              <select
                id="register-role"
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="patient">👤 Bệnh nhân</option>
                <option value="doctor">🩺 Bác sĩ</option>
                <option value="pharmacist">💊 Dược sĩ</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 text-left">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 text-left">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Đăng ký
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2024 Hệ thống Phòng khám. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  )
}