"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Bell, LogOut, Search, TestTube, User, Calendar, Eye, Download, Plus, Loader, X } from "lucide-react"

export default function DoctorLabTests() {
  const [user] = useState({
    name: "BS. Trần Thị Hoa",
    specialty: "Tim mạch",
    email: "tranthihoa@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTest, setSelectedTest] = useState(null)
  const [labTests, setLabTests] = useState([])
  const [patients, setPatients] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch lab tests
  const fetchLabTests = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      console.log("Token:", token) // Debug log

      const response = await fetch("http://localhost:8002/api/lab-tests/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      console.log("Response status:", response.status) // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Lab tests data:", data) // Debug log
      setLabTests(Array.isArray(data) ? data : [])

      // Fetch patient info
      const patientIds = [...new Set(data.map((test) => test.patient_id))]
      if (patientIds.length > 0) {
        await fetchPatientsInfo(patientIds)
      }
    } catch (err) {
      console.error("Error fetching lab tests:", err)
      setError(err.message)
      setLabTests([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Fetch patients info
  const fetchPatientsInfo = async (patientIds) => {
    try {
      const token = localStorage.getItem("token")
      const patientPromises = patientIds.map(async (patientId) => {
        try {
          const response = await fetch(`http://localhost:8000/api/accounts/users/${patientId}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          })
          if (response.ok) {
            const patientData = await response.json()
            return { id: patientId, data: patientData }
          }
          return { id: patientId, data: null }
        } catch (err) {
          console.error(`Error fetching patient ${patientId}:`, err)
          return { id: patientId, data: null }
        }
      })

      const patientResults = await Promise.all(patientPromises)
      const patientsMap = {}

      patientResults.forEach(({ id, data }) => {
        patientsMap[id] = data || {
          name: `Bệnh nhân #${id}`,
          age: "N/A",
          phone: "N/A",
        }
      })

      setPatients(patientsMap)
    } catch (err) {
      console.error("Error fetching patients info:", err)
      setPatients({}) // Set empty object on error
    }
  }

  useEffect(() => {
    fetchLabTests()
  }, [])

  const filteredLabTests = (labTests || []).filter((test) => {
    const patient = patients[test.patient_id]
    const patientName = patient?.name || `Bệnh nhân #${test.patient_id}`

    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.test_name || "").toLowerCase().includes(searchTerm.toLowerCase())

    const testDate = test.created_at ? new Date(test.created_at).toISOString().split("T")[0] : ""
    const matchesDate = selectedDate === "" || testDate === selectedDate

    return matchesSearch && matchesDate
  })

  const handleViewTest = (test) => {
    setSelectedTest(test)
  }

  const handleCloseTest = () => {
    setSelectedTest(null)
  }

  const exportReport = () => {
    // Tạo báo cáo CSV
    const csvContent = [
      ["ID", "Bệnh nhân", "Tên xét nghiệm", "Ngày yêu cầu", "Kết quả"],
      ...filteredLabTests.map((test) => [
        test.id,
        patients[test.patient_id]?.name || `Bệnh nhân #${test.patient_id}`,
        test.test_name,
        new Date(test.created_at).toLocaleDateString("vi-VN"),
        test.result || "Chưa có kết quả",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `xet-nghiem-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách xét nghiệm...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TestTube className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchLabTests} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
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
              <Link to="/doctor-dashboard" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="bg-red-600 p-2 rounded-full">
                <TestTube className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kết quả Xét nghiệm</h1>
                <p className="text-sm text-gray-600">Xem kết quả xét nghiệm của bệnh nhân</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={fetchLabTests} className="p-2 text-gray-400 hover:text-gray-600" title="Làm mới">
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
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên bệnh nhân, tên xét nghiệm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={exportReport}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                <Download className="w-4 h-4" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <TestTube className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng xét nghiệm</p>
                <p className="text-2xl font-bold text-gray-900">{labTests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TestTube className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Có kết quả</p>
                <p className="text-2xl font-bold text-gray-900">
                  {labTests.filter((test) => test.result && test.result.trim() !== "").length}
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
                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    labTests.filter((test) => new Date(test.created_at).toDateString() === new Date().toDateString())
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Tests List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Danh sách xét nghiệm ({filteredLabTests.length})</h3>
              <button
                onClick={fetchLabTests}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                <Plus className="w-4 h-4" />
                Làm mới
              </button>
            </div>
          </div>
          <div className="p-6">
            {filteredLabTests.length === 0 ? (
              <div className="text-center py-12">
                <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có xét nghiệm nào</h3>
                <p className="text-gray-600">Thử thay đổi bộ lọc để xem xét nghiệm khác.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLabTests.map((test) => {
                  const patient = patients[test.patient_id]
                  const patientName = patient?.name || `Bệnh nhân #${test.patient_id}`
                  const hasResult = test.result && test.result.trim() !== ""

                  return (
                    <div key={test.id} className="border rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="bg-red-100 p-2 rounded-full">
                              <User className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{patientName}</h4>
                              <p className="text-sm text-gray-600">ID: {test.patient_id}</p>
                            </div>
                            {hasResult && (
                              <div className="bg-green-100 px-2 py-1 rounded-full">
                                <span className="text-xs font-medium text-green-800">Có kết quả</span>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Tên xét nghiệm:</span> {test.test_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Ngày yêu cầu:</span>{" "}
                                {new Date(test.created_at).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Lý do:</span> {test.reason}
                            </p>
                          </div>

                          {hasResult && (
                            <div className="mb-3 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium text-green-800">Kết quả:</span> {test.result}
                              </p>
                            </div>
                          )}

                          {test.notes && (
                            <div className="mb-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium text-blue-800">Ghi chú:</span> {test.notes}
                              </p>
                            </div>
                          )}

                          {!hasResult && (
                            <div className="mb-3 bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                              <p className="text-sm text-yellow-800">
                                <span className="font-medium">Trạng thái:</span> Chưa có kết quả
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewTest(test)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {hasResult && (
                            <button
                              className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200"
                              title="Tải xuống kết quả"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Lab Test Detail Modal */}
        {selectedTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Chi tiết xét nghiệm</h3>
                  <button onClick={handleCloseTest} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin bệnh nhân</h4>
                    <div className="space-y-2">
                      {(() => {
                        const patient = patients[selectedTest.patient_id]
                        return (
                          <>
                            <p>
                              <span className="font-medium">Họ tên:</span>{" "}
                              {patient?.name || `Bệnh nhân #${selectedTest.patient_id}`}
                            </p>
                            <p>
                              <span className="font-medium">ID:</span> {selectedTest.patient_id}
                            </p>
                            <p>
                              <span className="font-medium">Tuổi:</span> {patient?.age || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">Điện thoại:</span> {patient?.phone || "N/A"}
                            </p>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin xét nghiệm</h4>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">ID xét nghiệm:</span> {selectedTest.id}
                      </p>
                      <p>
                        <span className="font-medium">Ngày yêu cầu:</span>{" "}
                        {new Date(selectedTest.created_at).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Cập nhật:</span>{" "}
                        {new Date(selectedTest.updated_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Chi tiết xét nghiệm</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-600">Tên xét nghiệm:</span>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md mt-1">{selectedTest.test_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Lý do:</span>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md mt-1">{selectedTest.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                {selectedTest.result && selectedTest.result.trim() !== "" ? (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Kết quả xét nghiệm</h4>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-md border-l-4 border-green-400">
                      {selectedTest.result}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Kết quả xét nghiệm</h4>
                    <p className="text-gray-500 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                      Chưa có kết quả xét nghiệm
                    </p>
                  </div>
                )}

                {selectedTest.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ghi chú</h4>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                      {selectedTest.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  {selectedTest.result && selectedTest.result.trim() !== "" && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                      Tải xuống kết quả
                    </button>
                  )}
                  <button
                    onClick={handleCloseTest}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
