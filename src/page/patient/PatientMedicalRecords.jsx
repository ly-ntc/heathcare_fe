"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  ArrowLeft,
  Bell,
  LogOut,
  Heart,
  Download,
  Eye,
  Search,
  Filter,
  Activity,
  Thermometer,
  Weight,
  X,
} from "lucide-react"

export default function PatientMedicalRecords() {
  const [user] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    id: 1, // Thêm dòng này
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all") // all, recent, doctor
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [medicalRecords, setMedicalRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userId = localStorage.getItem("user_id") ;

  useEffect(() => {
    fetchMedicalRecords()
  }, [userId])

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8002/api/medical-reports/patient/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setMedicalRecords(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching medical records:", err)
      setError(err.message)
      setMedicalRecords([])
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.doctor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.specialty?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "recent" && new Date(record.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (selectedFilter === "doctor" && record.doctor?.includes("BS. Trần Thị Hoa"))

    return matchesSearch && matchesFilter
  })

  const handleViewRecord = (record) => {
    setSelectedRecord(record)
  }

  const handleCloseRecord = () => {
    setSelectedRecord(null)
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
                <h1 className="text-xl font-bold text-gray-900">Hồ sơ Bệnh án</h1>
                <p className="text-sm text-gray-600">Xem lịch sử khám chữa bệnh</p>
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
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo bác sĩ, chẩn đoán, chuyên khoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="recent">30 ngày gần đây</option>
                <option value="doctor">BS. Trần Thị Hoa</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Danh sách bệnh án ({filteredRecords.length})</h3>
            </div>
            <div className="p-6">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bệnh án</h3>
                  <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
                    <div key={record.id} className="border rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-green-100 p-2 rounded-full">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{record.diagnosis}</h4>
                              <p className="text-sm text-gray-600">
                                {record.doctor_id} - {record.specialty}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(record.created_at).toLocaleDateString("vi-VN")}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              {record.doctor_id}
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Ghi chú:</span> {record.notes}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Cách điều trị:</span> {record.
                                treatment_plan
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewRecord(record)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Chi tiết bệnh án</h3>
                  <button onClick={handleCloseRecord} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Ngày khám:</span>{" "}
                        {new Date(selectedRecord.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Bác sĩ:</span> {selectedRecord.doctor}
                      </p>
                      <p>
                        <span className="font-medium">Chuyên khoa:</span> {selectedRecord.specialty}
                      </p>
                      <p>
                        <span className="font-medium">Chẩn đoán:</span> {selectedRecord.diagnosis}
                      </p>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Chỉ số sinh hiệu</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-red-600" />
                        <div>
                          <p className="text-xs text-gray-500">Huyết áp</p>
                          <p className="font-medium">{selectedRecord.vitals?.bloodPressure}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-pink-600" />
                        <div>
                          <p className="text-xs text-gray-500">Nhịp tim</p>
                          <p className="font-medium">{selectedRecord.vitals?.heartRate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Nhiệt độ</p>
                          <p className="font-medium">{selectedRecord.vitals?.temperature}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Weight className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Cân nặng</p>
                          <p className="font-medium">{selectedRecord.vitals?.weight}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Symptoms and Treatment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Triệu chứng</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedRecord.symptoms}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Điều trị</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedRecord.treatment}</p>
                  </div>
                </div>

                {/* Lab Results */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Kết quả xét nghiệm</h4>
                  <div className="space-y-3">
                    {selectedRecord.labResults?.map((lab, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-900">{lab.test}</h5>
                            <p className="text-gray-700">{lab.result}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(lab.date).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ghi chú của bác sĩ</h4>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                    {selectedRecord.notes}
                  </p>
                </div>

                {/* Attachments */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tài liệu đính kèm</h4>
                  <div className="space-y-2">
                    {selectedRecord.attachments?.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700">{file}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng bệnh án</p>
                <p className="text-2xl font-bold text-gray-900">{medicalRecords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lần khám gần nhất</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Date(medicalRecords[0]?.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Stethoscope className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bác sĩ đã khám</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(medicalRecords.map((r) => r.doctor)).size}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
