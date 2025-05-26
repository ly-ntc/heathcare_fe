"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Pill,
  Package,
  FileText,
  TrendingDown,
  Bell,
  LogOut,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
} from "lucide-react"

export default function PharmacistDashboard() {
  const [user] = useState({
    name: "DS. Nguyễn Thị Mai",
    pharmacy: "Nhà thuốc Trung tâm",
    email: "nguyenthimai@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  const [pendingPrescriptions] = useState([
    {
      id: 1,
      patient: "Nguyễn Văn An",
      doctor: "BS. Trần Thị Hoa",
      date: "2024-01-15",
      medications: ["Aspirin 100mg x30", "Metformin 500mg x60"],
      status: "pending",
      priority: "normal",
    },
    {
      id: 2,
      patient: "Lê Thị Bình",
      doctor: "BS. Lê Văn Nam",
      date: "2024-01-15",
      medications: ["Insulin x5", "Glucose test strips x50"],
      status: "processing",
      priority: "urgent",
    },
  ])

  const [lowStockItems] = useState([
    {
      id: 1,
      name: "Paracetamol 500mg",
      currentStock: 15,
      minStock: 50,
      supplier: "Công ty ABC",
      lastOrder: "2024-01-10",
    },
    {
      id: 2,
      name: "Amoxicillin 250mg",
      currentStock: 8,
      minStock: 30,
      supplier: "Công ty XYZ",
      lastOrder: "2024-01-08",
    },
  ])

  const [recentTransactions] = useState([
    {
      id: 1,
      patient: "Nguyễn Văn An",
      amount: 250000,
      items: 3,
      time: "09:30",
      status: "completed",
    },
    {
      id: 2,
      patient: "Lê Thị Bình",
      amount: 180000,
      items: 2,
      time: "10:15",
      status: "completed",
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý"
      case "processing":
        return "Đang xử lý"
      case "completed":
        return "Hoàn thành"
      case "urgent":
        return "Khẩn cấp"
      default:
        return status
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "normal":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 p-2 rounded-full">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hệ thống Phòng khám</h1>
                <p className="text-sm text-gray-600">Dashboard Dược sĩ</p>
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
                  <p className="text-xs text-gray-500">{user.pharmacy}</p>
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
          <p className="text-gray-600">Quản lý kho thuốc và đơn thuốc</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đơn chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng thuốc</p>
                <p className="text-2xl font-bold text-gray-900">1,245</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">2.5M</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Prescriptions */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Đơn thuốc chờ xử lý</h3>
                <Link to="/prescriptions" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Xem tất cả
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{prescription.patient}</h4>
                          {prescription.priority === "urgent" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                        <p className="text-sm text-gray-600">Bác sĩ: {prescription.doctor}</p>
                        <p className="text-sm text-gray-600">Ngày: {prescription.date}</p>
                        <div className="mt-2 space-y-1">
                          {prescription.medications.map((med, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-700">
                              <Pill className="w-3 h-3 mr-2 text-purple-600" />
                              {med}
                            </div>
                          ))}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}
                      >
                        {getStatusText(prescription.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">
                        Xử lý đơn
                      </button>
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                        Kiểm tra kho
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Cảnh báo tồn kho</h3>
                <Link to="/inventory" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Quản lý kho
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 border-red-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <p className="text-sm text-gray-600">Nhà cung cấp: {item.supplier}</p>
                        <p className="text-sm text-gray-600">Đặt hàng cuối: {item.lastOrder}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-sm text-red-600 font-medium">Còn: {item.currentStock}</span>
                          <span className="text-sm text-gray-500">Tối thiểu: {item.minStock}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                        Đặt hàng ngay
                      </button>
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Giao dịch gần đây</h3>
              <Link to="/transactions" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Xem tất cả
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.patient}</h4>
                      <p className="text-sm text-gray-600">
                        {transaction.items} sản phẩm - {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{transaction.amount.toLocaleString()}đ</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                    >
                      {getStatusText(transaction.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <FileText className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Xử lý đơn thuốc</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Quản lý kho</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <TrendingDown className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Báo cáo tồn kho</span>
            </button>
            <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition duration-200">
              <ShoppingCart className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Đặt hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
