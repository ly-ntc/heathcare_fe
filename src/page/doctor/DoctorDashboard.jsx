"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  Users,
  FileText,
  Stethoscope,
  Bell,
  Clock,
  User,
  LogOut,
  Activity,
  Clipboard,
  TrendingUp,
} from "lucide-react"

export default function DoctorDashboard() {
  const [user] = useState({
    name: "BS. Trần Thị Hoa",
    specialty: "Tim mạch",
    email: "tranthihoa@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  const [todayAppointments, setTodayAppointments] = useState([
  ])
  const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
               
                return
            }
            const response = await fetch("http://localhost:8002/api/appointments/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {
                throw new Error("Không thể tải danh sách lịch hẹn")
            }
            const data = await response.json()
            // Lọc lịch hẹn có confirmed status 
            const filteredAppointments = data.filter(appointment => {
                return  appointment.status === "confirmed"
            })
            // Chỉ lấy 5 lịch hẹn đầu tiên
            setTodayAppointments(filteredAppointments.slice(0, 5))
            
        } catch (err) {
         
            console.error("Error fetching appointments:", err)
        } finally {
           console.log("Appointments fetched successfully")
        }
    }
  useEffect(() => {
    fetchAppointments()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "stable":
        return "bg-green-100 text-green-800"
      case "monitoring":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận"
      case "in-progress":
        return "Đang khám"
      case "pending":
        return "Chờ khám"
      case "stable":
        return "Ổn định"
      case "monitoring":
        return "Theo dõi"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-full">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hệ thống Phòng khám</h1>
                <p className="text-sm text-gray-600">Dashboard Bác sĩ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img src={user.avatar || "/placeholder.svg"} alt="Avatar" className="w-8 h-8 rounded-full" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.specialty}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
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
          <p className="text-gray-600">Quản lý lịch khám và bệnh nhân của bạn</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lịch hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bệnh nhân</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đơn thuốc</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tuần này</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Lịch khám hôm nay</h3>
                <Link to="/schedule" className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Xem lịch tuần
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{appointment?.patient?.full_name}</h4>
                        <p className="text-sm text-gray-600">{appointment?.reason}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.appointment_time}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link to={`/doctor/examination/${appointment.patient.id}/${appointment.id}`}>
                        <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                          Bắt đầu khám
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/doctor/medical-reports"
             className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Danh sách bệnh án</span>
            </Link>
            <Link to ="/doctor/appointments"
             className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <Calendar className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Quản lý lịch</span>
            </Link>
            <Link to="/doctor/prescriptions"
             className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <Clipboard className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Danh sách đơn thuốc</span>
            </Link>
            <Link to="/doctor/lab-tests"
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <Activity className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Danh sách xét nghiệm</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
