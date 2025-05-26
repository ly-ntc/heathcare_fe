"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Pill,
  Calendar,
  ArrowLeft,
  Bell,
  LogOut,
  Heart,
  Download,
  Eye,
  Search,
  CheckCircle,
  X,
  Loader,
} from "lucide-react"

export default function PatientPrescriptions() {
  const [user] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    id: 1,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPrescriptions()
  }, [user.id])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching prescriptions for patient:", user.id)

      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8002/api/prescriptions/patient/${user.id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Prescriptions data:", data)
      setPrescriptions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching prescriptions:", err)
      setError(err.message)
      setPrescriptions([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      (prescription.notes || "").toLowerCase().includes(searchLower) ||
      (prescription.items || []).some((item) => (item.medicine_name || "").toLowerCase().includes(searchLower))
    )
  })

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription)
  }

  const handleClosePrescription = () => {
    setSelectedPrescription(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải đơn thuốc...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Pill className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPrescriptions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <h1 className="text-xl font-bold text-gray-900">Đơn thuốc</h1>
                <p className="text-sm text-gray-600">Quản lý và theo dõi đơn thuốc</p>
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
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo ghi chú, tên thuốc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách đơn thuốc ({filteredPrescriptions.length})
            </h3>
          </div>
          <div className="p-6">
            {filteredPrescriptions.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn thuốc nào</h3>
                <p className="text-gray-600">Chưa có đơn thuốc nào được kê cho bạn.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Pill className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Đơn thuốc #{prescription.id}</h4>
                            <p className="text-sm text-gray-600">
                              Ngày kê: {new Date(prescription.created_at).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Cập nhật: {new Date(prescription.created_at).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Pill className="w-4 h-4 mr-2" />
                            Số loại thuốc: {prescription.items?.length || 0}
                          </div>
                        </div>

                        {prescription.notes && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Ghi chú:</span> {prescription.notes}
                            </p>
                          </div>
                        )}

                        {prescription.items && prescription.items.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Thuốc:</span>{" "}
                              {prescription.items
                                .slice(0, 3)
                                .map((item) => item.medicine_name)
                                .join(", ")}
                              {prescription.items.length > 3 && ` và ${prescription.items.length - 3} thuốc khác`}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đã kê
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewPrescription(prescription)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200"
                            title="Tải xuống"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prescription Detail Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Chi tiết đơn thuốc</h3>
                  <button onClick={handleClosePrescription} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin đơn thuốc</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">ID đơn thuốc:</span> {selectedPrescription.id}
                      </p>
                      <p>
                        <span className="font-medium">Ngày kê:</span>{" "}
                        {new Date(selectedPrescription.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Cập nhật:</span>{" "}
                        {new Date(selectedPrescription.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin bệnh nhân</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">ID bệnh nhân:</span> {selectedPrescription.patient_id}
                      </p>
                      <p>
                        <span className="font-medium">Số loại thuốc:</span> {selectedPrescription.items?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Danh sách thuốc</h4>
                  <div className="space-y-4">
                    {selectedPrescription.items && selectedPrescription.items.length > 0 ? (
                      selectedPrescription.items.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 mb-2">{item.medicine_name}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Liều lượng:</span>
                              <p>{item.dosage}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Cách dùng:</span>
                              <p>{item.usage_instruction}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Không có thông tin thuốc</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ghi chú</h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Pill className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đơn thuốc</p>
                <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Có thuốc</p>
                <p className="text-2xl font-bold text-gray-900">
                  {prescriptions.filter((p) => p.items && p.items.length > 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tháng này</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    prescriptions.filter((p) => {
                      const prescriptionDate = new Date(p.created_at)
                      const now = new Date()
                      return (
                        prescriptionDate.getMonth() === now.getMonth() &&
                        prescriptionDate.getFullYear() === now.getFullYear()
                      )
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
