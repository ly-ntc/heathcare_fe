"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    TestTube,
    Calendar,
    User,
    ArrowLeft,
    Bell,
    LogOut,
    Heart,
    Download,
    Eye,
    Search,
    Filter,
    CheckCircle,
    Clock,
    X,
    Loader,
} from "lucide-react"

export default function PatientLabTest() {
    const [user] = useState({
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
        id: 1, // Mock patient ID
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("all") // all, completed, pending
    const [selectedTest, setSelectedTest] = useState(null)
    const [labTests, setLabTests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const userId = localStorage.getItem("user_id");

    // Fetch lab tests for patient
    const fetchLabTests = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8002/api/lab-tests/patient/${userId}/`, {
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
            setLabTests(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Error fetching lab tests:", err)
            setError(err.message)
            setLabTests([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLabTests()
    }, [])

    const filteredTests = labTests.filter((test) => {
        const matchesSearch =
            (test.test_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (test.reason || "").toLowerCase().includes(searchTerm.toLowerCase())

        const hasResult = test.result && test.result.trim() !== ""
        const matchesFilter =
            selectedFilter === "all" ||
            (selectedFilter === "completed" && hasResult) ||
            (selectedFilter === "pending" && !hasResult)

        return matchesSearch && matchesFilter
    })

    const handleViewTest = (test) => {
        setSelectedTest(test)
    }

    const handleCloseTest = () => {
        setSelectedTest(null)
    }

    const getStatusColor = (hasResult) => {
        return hasResult ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
    }

    const getStatusText = (hasResult) => {
        return hasResult ? "Có kết quả" : "Chờ kết quả"
    }

    const getStatusIcon = (hasResult) => {
        return hasResult ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
            <Clock className="w-4 h-4 text-yellow-600" />
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải kết quả xét nghiệm...</p>
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
                    <button onClick={fetchLabTests} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
                                <h1 className="text-xl font-bold text-gray-900">Kết quả Xét nghiệm</h1>
                                <p className="text-sm text-gray-600">Xem kết quả xét nghiệm của bạn</p>
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
                                placeholder="Tìm kiếm theo tên xét nghiệm, lý do..."
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
                                <option value="completed">Có kết quả</option>
                                <option value="pending">Chờ kết quả</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lab Tests List */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">Danh sách xét nghiệm ({filteredTests.length})</h3>
                    </div>
                    <div className="p-6">
                        {filteredTests.length === 0 ? (
                            <div className="text-center py-12">
                                <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có xét nghiệm nào</h3>
                                <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTests.map((test) => {
                                    const hasResult = test.result && test.result.trim() !== ""

                                    return (
                                        <div key={test.id} className="border rounded-lg p-6 hover:bg-gray-50 transition duration-200">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="bg-red-100 p-2 rounded-full">
                                                            <TestTube className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{test.test_name}</h4>
                                                            <p className="text-sm text-gray-600">ID: {test.id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Ngày yêu cầu: {new Date(test.requested_at
                                                            ).toLocaleDateString("vi-VN")}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <User className="w-4 h-4 mr-2" />
                                                            Bác sĩ yêu cầu: {test.doctor_id || "N/A"}
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

                                                    {test.result_date && (
                                                        <div className="mb-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                                            <p className="text-sm text-gray-700">
                                                                <span className="font-medium text-blue-800">Ghi chú:</span> {new Date(test.result_date
                                                                ).toLocaleDateString("vi-VN")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-end space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(hasResult)}
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hasResult)}`}>
                                                            {getStatusText(hasResult)}
                                                        </span>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewTest(test)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {hasResult && (
                                                            <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200">
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Test Detail Modal */}
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
                                {/* Test Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Thông tin xét nghiệm</h4>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">Tên xét nghiệm:</span> {selectedTest.test_name}
                                            </p>
                                            <p>
                                                <span className="font-medium">ID:</span> {selectedTest.id}
                                            </p>
                                            <p>
                                                <span className="font-medium">Ngày yêu cầu:</span>{" "}
                                                {new Date(selectedTest.created_at).toLocaleDateString("vi-VN")}
                                            </p>
                                            <p>
                                                <span className="font-medium">Bác sĩ yêu cầu:</span> {selectedTest.doctor_name || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Trạng thái</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(selectedTest.result && selectedTest.result.trim() !== "")}
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        selectedTest.result && selectedTest.result.trim() !== "",
                                                    )}`}
                                                >
                                                    {getStatusText(selectedTest.result && selectedTest.result.trim() !== "")}
                                                </span>
                                            </div>
                                            <p>
                                                <span className="font-medium">Cập nhật:</span>{" "}
                                                {new Date(selectedTest.updated_at).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Lý do xét nghiệm</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedTest.reason}</p>
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

                                {/* Notes */}
                                {selectedTest.notes && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Ghi chú</h4>
                                        <p className="text-gray-700 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                                            {selectedTest.notes}
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
                                <CheckCircle className="w-6 h-6 text-green-600" />
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
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chờ kết quả</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {labTests.filter((test) => !test.result || test.result.trim() === "").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
