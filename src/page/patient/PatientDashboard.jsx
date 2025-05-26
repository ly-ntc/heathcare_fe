"use client"

import { useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { Calendar, FileText, Pill, Bell, Clock, MapPin, Phone, LogOut, Heart, Activity } from "lucide-react"

export default function PatientDashboard() {
    const navigate = useNavigate()
    const [user] = useState({
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        phone: "0123456789",
        avatar: "/placeholder.svg?height=40&width=40",
    })

    const [appointments] = useState([
        {
            id: 1,
            doctor: "BS. Trần Thị Hoa",
            specialty: "Tim mạch",
            date: "2024-01-15",
            time: "09:00",
            status: "confirmed",
            location: "Phòng 201",
        },
        {
            id: 2,
            doctor: "BS. Lê Văn Nam",
            specialty: "Nội khoa",
            date: "2024-01-20",
            time: "14:30",
            status: "pending",
            location: "Phòng 105",
        },
    ])

    const [prescriptions] = useState([
        {
            id: 1,
            doctor: "BS. Trần Thị Hoa",
            date: "2024-01-10",
            medications: ["Aspirin 100mg", "Metformin 500mg"],
            status: "active",
        },
        {
            id: 2,
            doctor: "BS. Lê Văn Nam",
            date: "2024-01-05",
            medications: ["Paracetamol 500mg"],
            status: "completed",
        },
    ])

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "active":
                return "bg-blue-100 text-blue-800"
            case "completed":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "confirmed":
                return "Đã xác nhận"
            case "pending":
                return "Chờ xác nhận"
            case "active":
                return "Đang dùng"
            case "completed":
                return "Đã hoàn thành"
            default:
                return status
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token") // Remove token from localStorage
        navigate("/login") // Redirect to login page
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-full">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Dashboard Bệnh nhân</h1>
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
                            <button onClick = {handleLogout} className="p-2 text-gray-400 hover:text-gray-600">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng, {user.name}!</h2>
                    <p className="text-gray-600">Quản lý sức khỏe và lịch khám của bạn</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Lịch hẹn sắp tới</p>
                                <p className="text-2xl font-bold text-gray-900">2</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Hồ sơ bệnh án</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Pill className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đơn thuốc</p>
                                <p className="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-full">
                                <Activity className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Xét nghiệm</p>
                                <p className="text-2xl font-bold text-gray-900">5</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h3>
                                <Link to="/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Xem tất cả
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{appointment.doctor}</h4>
                                                <p className="text-sm text-gray-600">{appointment.specialty}</p>
                                                <div className="flex items-center mt-2 space-x-4">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {appointment.date}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {appointment.time}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {appointment.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                                            >
                                                {getStatusText(appointment.status)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                                Đặt lịch khám mới
                            </button>
                        </div>
                    </div>

                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            to="/patient/appointments"
                            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Đặt lịch khám</span>
                        </Link>
                        <Link
                            to="/patient/medical-records"
                            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            <FileText className="w-8 h-8 text-green-600 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Xem hồ sơ</span>
                        </Link>
                        <Link
                            to="/patient/prescriptions"
                            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                            <Pill className="w-8 h-8 text-purple-600 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Đơn thuốc</span>
                        </Link>
                        <Link
                            to="/patient/lab-tests"
                         className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
                            <Phone className="w-8 h-8 text-orange-600 mb-2" />
                            <span className="text-sm font-medium text-gray-700">Kết quả xét nghiệm</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
