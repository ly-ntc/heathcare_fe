"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Bell, LogOut, Stethoscope, Search, Filter, FileText, User, Calendar, Eye, Download, Plus, Loader, X } from 'lucide-react'

export default function DoctorMedicalReports() {
    const [user] = useState({
        name: "BS. Trần Thị Hoa",
        specialty: "Tim mạch",
        email: "tranthihoa@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedReport, setSelectedReport] = useState(null)
    const [medicalReports, setMedicalReports] = useState([])
    const [patients, setPatients] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch medical reports
    const fetchMedicalReports = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8002/api/medical-reports/", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            if (!response.ok) {
                throw new Error("Không thể tải danh sách bệnh án")
            }
            const data = await response.json()
            setMedicalReports(data)

            // Fetch patient info
            const patientIds = [...new Set(data.map((report) => report.patient_id))]
            await fetchPatientsInfo(patientIds)
        } catch (err) {
            setError(err.message)
            console.error("Error fetching medical reports:", err)
        } finally {
            setLoading(false)
        }
    }

    // Fetch patients info
    const fetchPatientsInfo = async (patientIds) => {
        try {
            const patientPromises = patientIds.map(async (patientId) => {
                try {
                    const response = await fetch(`http://localhost:8000/api/accounts/users/${patientId}/`)
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
        }
    }

    useEffect(() => {
        fetchMedicalReports()
    }, [])

    const filteredReports = medicalReports.filter((report) => {
        const patient = patients[report.patient_id]
        const patientName = patient?.name || `Bệnh nhân #${report.patient_id}`

        const matchesSearch =
            patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())

        const reportDate = new Date(report.created_at).toISOString().split("T")[0]
        const matchesDate = selectedDate === "" || reportDate === selectedDate

        return matchesSearch && matchesDate
    })

    const handleViewReport = (report) => {
        setSelectedReport(report)
    }

    const handleCloseReport = () => {
        setSelectedReport(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải danh sách bệnh án...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FileText className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchMedicalReports}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
                            <Link to="/doctor-dashboard" className="p-2 hover:bg-gray-100 rounded-full">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div className="bg-green-600 p-2 rounded-full">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Danh sách Bệnh án</h1>
                                <p className="text-sm text-gray-600">Quản lý và xem bệnh án đã tạo</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={fetchMedicalReports} className="p-2 text-gray-400 hover:text-gray-600">
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
                                placeholder="Tìm kiếm theo tên bệnh nhân, chẩn đoán..."
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
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng bệnh án</p>
                                <p className="text-2xl font-bold text-gray-900">{medicalReports.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Bệnh nhân</p>
                                <p className="text-2xl font-bold text-gray-900">{Object.keys(patients).length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {
                                        medicalReports.filter(
                                            (report) =>
                                                new Date(report.created_at).toDateString() === new Date().toDateString()
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medical Reports List */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Danh sách bệnh án ({filteredReports.length})
                            </h3>
                            <button
                                onClick={fetchMedicalReports}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Làm mới
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        {filteredReports.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bệnh án nào</h3>
                                <p className="text-gray-600">Thử thay đổi bộ lọc để xem bệnh án khác.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredReports.map((report) => {
                                    const patient = patients[report.patient_id]
                                    const patientName = patient?.name || `Bệnh nhân #${report.patient_id}`

                                    return (
                                        <div
                                            key={report.id}
                                            className="border rounded-lg p-6 hover:bg-gray-50 transition duration-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="bg-green-100 p-2 rounded-full">
                                                            <User className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{patientName}</h4>
                                                            <p className="text-sm text-gray-600">ID: {report.patient_id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Chẩn đoán:</span> {report.diagnosis}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Ngày tạo:</span>{" "}
                                                                {new Date(report.created_at).toLocaleDateString("vi-VN")}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-medium">Phương án điều trị:</span>{" "}
                                                            {report.treatment_plan.substring(0, 100)}
                                                            {report.treatment_plan.length > 100 && "..."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewReport(report)}
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
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Medical Report Detail Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Chi tiết bệnh án</h3>
                                    <button onClick={handleCloseReport} className="p-2 hover:bg-gray-100 rounded-full">
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
                                                const patient = patients[selectedReport.patient_id]
                                                return (
                                                    <>
                                                        <p>
                                                            <span className="font-medium">Họ tên:</span>{" "}
                                                            {patient?.name || `Bệnh nhân #${patient?.full_name}`}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">ID:</span> {selectedReport.patient_id}
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
                                        <h4 className="font-semibold text-gray-900 mb-3">Thông tin bệnh án</h4>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">ID bệnh án:</span> {selectedReport.id}
                                            </p>
                                            <p>
                                                <span className="font-medium">Ngày tạo:</span>{" "}
                                                {new Date(selectedReport.created_at).toLocaleDateString("vi-VN")}
                                            </p>
                                            <p>
                                                <span className="font-medium">Cập nhật:</span>{" "}
                                                {new Date(selectedReport.updated_at).toLocaleDateString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Diagnosis */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Chẩn đoán</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedReport.diagnosis}</p>
                                </div>

                                {/* Treatment Plan */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Phương án điều trị</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedReport.treatment_plan}</p>
                                </div>

                                {/* Notes */}
                                {selectedReport.notes && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Ghi chú</h4>
                                        <p className="text-gray-700 bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                                            {selectedReport.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
