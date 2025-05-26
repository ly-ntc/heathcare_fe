"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Stethoscope } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })
  const navigate = useNavigate()

const handleLogin = async (e) => {
  e.preventDefault()
  try {
    // Gọi API đăng nhập lấy token
    const res = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
    if (!res.ok) throw new Error("Sai tài khoản hoặc mật khẩu")
    const data = await res.json()
    const token = data.access
    localStorage.setItem("token", token)
    localStorage.setItem("refresh", data.refresh)

    // Gọi API lấy profile
    const profileRes = await fetch("http://127.0.0.1:8000/api/accounts/auth/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!profileRes.ok) throw new Error("Không lấy được thông tin người dùng")
    const profile = await profileRes.json()
    localStorage.setItem("user_id", profile.id)
    localStorage.setItem("user_role", profile.role)

    // Điều hướng theo role
    switch (profile.role) {
      case "patient":
        navigate("/patient-dashboard")
        break
      case "doctor":
        navigate("/doctor-dashboard")
        break
      case "pharmacist":
        navigate("/pharmacist-dashboard")
        break
      default:
        navigate("/")
    }
  } catch (err) {
    alert(err.message)
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
          <p className="text-gray-600 mt-2">Đăng nhập để truy cập hệ thống</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Đăng nhập</h2>
            <p className="text-gray-600 text-sm mt-1">Nhập thông tin để truy cập hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 text-left">
                Tên đăng nhập
              </label>
              <input
                id="login-username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 text-left">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
            <button
              type="submit"
              className="w-full bg-blue-600 "
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Quên mật khẩu?</button>
            <div className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Đăng ký ngay
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
