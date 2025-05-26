
"use client"

import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Bell, LogOut, Heart } from "lucide-react"

export default function PatientHeader({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token") // Remove token from localStorage
    navigate("/login") // Redirect to login page
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Link to="/patient-dashboard" className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="bg-blue-600 p-2 rounded-full">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý Lịch khám</h1>
              <p className="text-sm text-gray-600">Đặt lịch và theo dõi cuộc hẹn</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <img src={user.avatar || "/placeholder.svg"} alt="Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}