"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
    Calendar,
    Clock,
    User,
    Phone,
    ArrowLeft,
    Bell,
    LogOut,
    Stethoscope,
    Search,
    Filter,
    Check,
    X,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Plus,
    Loader,
} from "lucide-react"

export default function DoctorAppointments() {
    const [user] = useState({
        name: "BS. Trần Thị Hoa",
        specialty: "Tim mạch",
        email: "tranthihoa@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
    })

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFilter, setSelectedFilter] = useState("all") // all, pending, confirmed, completed, cancelled
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [patients, setPatients] = useState({}) // Cache thông tin bệnh nhân
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch appointments từ API
    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            if (!token) {
                setError("Vui lòng đăng nhập để xem lịch khám")
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
            setAppointments(data)

            // Fetch thông tin bệnh nhân cho mỗi appointment
            const patientIds = [...new Set(data.map((apt) => apt.patient.id))]
            console.log("Fetching patients info for IDs:", patientIds)
            await fetchPatientsInfo(patientIds)
        } catch (err) {
            setError(err.message)
            console.error("Error fetching appointments:", err)
        } finally {
            setLoading(false)
        }
    }

    // Fetch thông tin bệnh nhân
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
                    email: "N/A",
                    address: "N/A",
                    medical_history: "Chưa có thông tin",
                }
            })

            setPatients(patientsMap)
        } catch (err) {
            console.error("Error fetching patients info:", err)
        }
    }

    // Update appointment status
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                throw new Error("Vui lòng đăng nhập để cập nhật trạng thái")
            }
            const response = await fetch(`http://localhost:8002/api/appointments/${appointmentId}/update-status/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Không thể cập nhật trạng thái lịch hẹn")
            }

            setAppointments(appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt)))
            return true
        } catch (err) {
            console.error("Error updating appointment:", err)
            alert("Có lỗi xảy ra khi cập nhật lịch hẹn: " + err.message)
            return false
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    // Update getStatusColor to include 'refused'
    const getStatusColor = (status) => {
        switch (status) {
            case "scheduled":
                return "bg-yellow-100 text-yellow-800"
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "completed":
                return "bg-blue-100 text-blue-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "refused":
                return "bg-orange-100 text-orange-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "scheduled":
                return "Đã lên lịch"
            case "confirmed":
                return "Đã xác nhận"
            case "completed":
                return "Đã hoàn thành"
            case "cancelled":
                return "Đã hủy"
            case "refused":
                return "Đã từ chối"
            default:
                return status
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "scheduled":
                return <AlertCircle className="w-4 h-4 text-yellow-600" />
            case "confirmed":
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case "completed":
                return <CheckCircle className="w-4 h-4 text-blue-600" />
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-600" />
            case "refused":
                return <XCircle className="w-4 h-4 text-orange-600" />
            default:
                return null
        }
    }

    const filteredAppointments = appointments.filter((appointment) => {
        const patient = patients[appointment.patient_id]
        const patientName = patient?.name || `Bệnh nhân #${appointment.patient_id}`

        const matchesSearch =
            patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter = selectedFilter === "all" || appointment.status === selectedFilter

        const appointmentDate = new Date(appointment.appointment_time).toISOString().split("T")[0]
        const matchesDate = selectedDate === "" || appointmentDate === selectedDate

        return matchesSearch && matchesFilter && matchesDate
    })

    const handleApproveAppointment = async (appointmentId) => {
        const success = await updateAppointmentStatus(appointmentId, "confirmed")
        if (success) {
            alert("Đã xác nhận lịch hẹn!")
        }
    }

    const handleRejectAppointment = async (appointmentId) => {
        if (window.confirm("Bạn có chắc chắn muốn từ chối lịch hẹn này?")) {
            const success = await updateAppointmentStatus(appointmentId, "cancelled")
            if (success) {
                alert("Đã từ chối lịch hẹn!")
            }
        }
    }

    const handleCompleteAppointment = async (appointmentId) => {
        if (window.confirm("Xác nhận hoàn thành cuộc hẹn này?")) {
            const success = await updateAppointmentStatus(appointmentId, "completed")
            if (success) {
                alert("Đã hoàn thành cuộc hẹn!")
            }
        }
    }

    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment)
    }

    const handleCloseAppointment = () => {
        setSelectedAppointment(null)
    }

    const formatDateTime = (appointmentTime) => {
        const dateObj = new Date(appointmentTime)
        return {
            date: dateObj.toLocaleDateString("vi-VN"),
            time: dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            dayOfWeek: dateObj.toLocaleDateString("vi-VN", { weekday: "long" }),
        }
    }


    const getAppointmentStats = () => {
        const today = new Date().toISOString().split("T")[0]
        const todayAppointments = appointments.filter((apt) => {
            const aptDate = new Date(apt.appointment_time).toISOString().split("T")[0]
            return aptDate === today
        })

        return {
            total: appointments.length,
            today: todayAppointments.length,
            scheduled: appointments.filter((apt) => apt.status === "scheduled").length,
            confirmed: appointments.filter((apt) => apt.status === "confirmed").length,
            completed: appointments.filter((apt) => apt.status === "completed").length,
        }
    }
    const stats = getAppointmentStats()

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải danh sách lịch hẹn...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchAppointments}
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
                                <Stethoscope className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Quản lý Lịch hẹn</h1>
                                <p className="text-sm text-gray-600">Xem và quản lý lịch khám bệnh</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={fetchAppointments} className="p-2 text-gray-400 hover:text-gray-600" title="Làm mới">
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
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.scheduled}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên bệnh nhân, lý do khám..."
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
                            <div className="flex items-center space-x-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="scheduled">Đã lên lịch</option>
                                    <option value="confirmed">Đã xác nhận</option>
                                    <option value="completed">Đã hoàn thành</option>
                                    <option value="cancelled">Đã hủy</option>
                                    <option value="refused">Đã từ chối</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Danh sách lịch hẹn ({filteredAppointments.length})
                            </h3>
                            <button
                                onClick={fetchAppointments}
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                            >
                                <Plus className="w-4 h-4" />
                                Làm mới
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn nào</h3>
                                <p className="text-gray-600">Thử thay đổi bộ lọc hoặc ngày để xem lịch hẹn khác.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAppointments.map((appointment) => {
                                    const { date, time, dayOfWeek } = formatDateTime(appointment.appointment_time)
                                    const patient = patients[appointment.patient_id]
                                    const patientName = patient?.name || `Bệnh nhân #${appointment.patient_id}`

                                    return (
                                        <div
                                            key={appointment.id}
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
                                                            <p className="text-sm text-gray-600">
                                                                ID: {appointment.patient_id} - Lịch hẹn #{appointment.id}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {date} ({dayOfWeek})
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            {time}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Phone className="w-4 h-4 mr-2" />
                                                            {patient?.phone || "N/A"}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-medium">Lý do khám:</span> {appointment.reason}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end space-y-3">
                                                    <div className="flex items-center space-x-2">
                                                        {getStatusIcon(appointment.status)}
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                appointment.status,
                                                            )}`}
                                                        >
                                                            {getStatusText(appointment.status)}
                                                        </span>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewAppointment(appointment)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        {appointment.status === "scheduled" && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApproveAppointment(appointment.id)}
                                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200"
                                                                    title="Xác nhận"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectAppointment(appointment.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition duration-200"
                                                                    title="Từ chối"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}

                                                        {appointment.status === "confirmed" && (
                                                            <button
                                                                onClick={() => handleCompleteAppointment(appointment.id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                                                                title="Hoàn thành"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
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

                {/* Appointment Detail Modal */}
                {selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Chi tiết lịch hẹn</h3>
                                    <button onClick={handleCloseAppointment} className="p-2 hover:bg-gray-100 rounded-full">
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
                                                const patient = patients[selectedAppointment.patient.id]
                                                return (
                                                    <>
                                                        <p>
                                                            <span className="font-medium">Họ tên:</span>{" "}
                                                            {patient?.name || `Bệnh nhân #${selectedAppointment.patient.full_name}`}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">ID:</span> {selectedAppointment.patient.id}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Điện thoại:</span> {patient?.phone || "N/A"}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Email:</span> {patient?.email || "N/A"}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Địa chỉ:</span> {patient?.address || "N/A"}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Tiền sử bệnh:</span>{" "}
                                                            {patient?.medical_history || "Chưa có thông tin"}
                                                        </p>
                                                    </>
                                                )
                                            })()}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Thông tin cuộc hẹn</h4>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">ID lịch hẹn:</span> {selectedAppointment.id}
                                            </p>
                                            <p>
                                                <span className="font-medium">Ngày:</span>{" "}
                                                {formatDateTime(selectedAppointment.appointment_time).date}
                                            </p>
                                            <p>
                                                <span className="font-medium">Giờ:</span>{" "}
                                                {formatDateTime(selectedAppointment.appointment_time).time}
                                            </p>
                                            <p>
                                                <span className="font-medium">Bác sĩ ID:</span> {selectedAppointment.doctor_id}
                                            </p>
                                            <p>
                                                <span className="font-medium">Trạng thái:</span>{" "}
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                        selectedAppointment.status,
                                                    )}`}
                                                >
                                                    {getStatusText(selectedAppointment.status)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Lý do khám</h4>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedAppointment.reason}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    {selectedAppointment.status === "scheduled" && (
                                        <>
                                            <button
                                                onClick={() => handleApproveAppointment(selectedAppointment.id)}
                                                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200"
                                                title="Xác nhận"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRejectAppointment(selectedAppointment.id)}
                                                className="p-2 text-orange-600 hover:bg-orange-100 rounded-full transition duration-200"
                                                title="Từ chối"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {selectedAppointment.status === "confirmed" && (
                                        <>
                                            <button
                                                onClick={() => handleCompleteAppointment(selectedAppointment.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition duration-200"
                                                title="Hoàn thành"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRejectAppointment(selectedAppointment.id)}
                                                className="p-2 text-orange-600 hover:bg-orange-100 rounded-full transition duration-200"
                                                title="Từ chối"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {selectedAppointment.status === "refused" && (
                                        <button
                                            onClick={() => handleApproveAppointment(selectedAppointment.id)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition duration-200"
                                            title="Xác nhận"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}


                                    {selectedAppointment.status === "scheduled" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleRejectAppointment(selectedAppointment.id)
                                                    handleCloseAppointment()
                                                }}
                                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200"
                                            >
                                                Từ chối
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleApproveAppointment(selectedAppointment.id)
                                                    handleCloseAppointment()
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                                            >
                                                Xác nhận
                                            </button>
                                        </>
                                    )}
                                    {selectedAppointment.status === "confirmed" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    handleRejectAppointment(selectedAppointment.id)
                                                    handleCloseAppointment()
                                                }}
                                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition duration-200"
                                            >
                                                Từ chối
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleCompleteAppointment(selectedAppointment.id)
                                                    handleCloseAppointment()
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                            >
                                                Hoàn thành
                                            </button>
                                        </>
                                    )}
                                    {selectedAppointment.status === "refused" && (
                                        <button
                                            onClick={() => {
                                                handleApproveAppointment(selectedAppointment.id)
                                                handleCloseAppointment()
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
                                        >
                                            Xác nhận
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
