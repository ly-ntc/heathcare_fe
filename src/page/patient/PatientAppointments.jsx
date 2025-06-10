"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    Calendar,
    Clock,
    MapPin,
    Stethoscope,
    Plus,
    X,
    Edit,
    Trash2,
    ArrowLeft,
    Bell,
    LogOut,
    Heart,
    CheckCircle,
    AlertCircle,
    XCircle,
} from "lucide-react"
import PatientHeader from "../../component/PatientHeader"

export default function PatientAppointments() {
    const [user] = useState({
        name: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        avatar: "/placeholder.svg?height=40&width=40",
    })

    const [showBookingForm, setShowBookingForm] = useState(false)
    const [selectedTab, setSelectedTab] = useState("upcoming") // upcoming, past, all
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [error, setError] = useState(null)

    const fetchAppointments = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setError("Vui lòng đăng nhập để xem lịch khám")
            return
        }
        try {
            const res = await fetch("http://127.0.0.1:8001/api/appointments/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) throw new Error("Không lấy được danh sách lịch khám")
            const data = await res.json()
            setAppointments(data)
            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await fetch("http://127.0.0.1:8001/api/doctors", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            if (!res.ok) throw new Error("Không lấy được danh sách bác sĩ")
            const data = await res.json()
            setDoctors(data)
            setError(null)
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchDoctors()
        fetchAppointments()
    }, [])

    const [bookingForm, setBookingForm] = useState({
        doctorId: "",
        datetime: "",
        reason: "",
    })

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800"
            case "scheduled":
                return "bg-yellow-100 text-yellow-800"
            case "completed":
                return "bg-blue-100 text-blue-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            case "refused":
                return "bg-gray-200 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "confirmed":
                return "Đã xác nhận"
            case "scheduled":
                return "Chờ xác nhận"
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
            case "confirmed":
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case "scheduled":
                return <AlertCircle className="w-4 h-4 text-yellow-600" />
            case "completed":
                return <CheckCircle className="w-4 h-4 text-blue-600" />
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-600" />
            case "refused":
                return <XCircle className="w-4 h-4 text-gray-600" />
            default:
                return null
        }
    }

    const formatDateTime = (datetime) => {
        const date = new Date(datetime)
        const dateStr = date.toLocaleDateString("vi-VN")
        const timeStr = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
        return { date: dateStr, time: timeStr }
    }

    const filterAppointments = () => {
        const now = new Date()
        switch (selectedTab) {
            case "upcoming":
                return appointments.filter((apt) => new Date(apt.appointment_time) >= now && apt.status !== "cancelled")
            case "past":
                return appointments.filter((apt) => new Date(apt.appointment_time) < now || apt.status === "completed")
            case "all":
                return appointments
            default:
                return appointments
        }
    }

    const handleBookAppointment = async (e) => {
        e.preventDefault()
        setError(null)
        const token = localStorage.getItem("token")
        if (!token) {
            setError("Vui lòng đăng nhập để đặt lịch")
            return
        }

        try {
            const response = await fetch("http://127.0.0.1:8001/api/appointments/create/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctor_id: Number.parseInt(bookingForm.doctorId),
                    appointment_time: bookingForm.datetime,
                    reason: bookingForm.reason,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Đặt lịch thất bại!")
            }

            // Clear form and close modal
            setBookingForm({
                doctorId: "",
                datetime: "",
                reason: "",
            })
            setShowBookingForm(false)
            alert("Đặt lịch thành công! Chúng tôi sẽ xác nhận trong vòng 24h.")

            // Refresh appointments list
            await fetchAppointments()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
            const token = localStorage.getItem("token")
            if (!token) {
                setError("Vui lòng đăng nhập để hủy lịch")
                return
            }
            try {
                const response = await fetch(`http://127.0.0.1:8001/api/appointments/${appointmentId}/cancel/`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Hủy lịch thất bại!")
                }
                await fetchAppointments() // Refresh appointments list
                alert("Đã hủy lịch hẹn thành công!")
            } catch (err) {
                setError(err.message)
            }
        }
    }

    const getMinDateTime = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(8, 0, 0, 0) // Start from 8:00 AM
        return tomorrow.toISOString().slice(0, 16)
    }

    const getMaxDateTime = () => {
        const maxDate = new Date()
        maxDate.setDate(maxDate.getDate() + 30)
        maxDate.setHours(17, 0, 0, 0) // End at 5:00 PM
        return maxDate.toISOString().slice(0, 16)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
             <PatientHeader user={user} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Lịch khám của bạn</h2>
                        <p className="text-gray-600">Quản lý và theo dõi các cuộc hẹn khám bệnh</p>
                    </div>
                    <button
                        onClick={() => setShowBookingForm(true)}
                        className="flex items-center gap-2 !bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Đặt lịch khám mới
                    </button>
                </div>

                {/* Booking Form Modal */}
                {showBookingForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                            <div className="p-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">Đặt lịch khám mới</h3>
                                    <button onClick={() => setShowBookingForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
                                {/* Doctor Selection */}
                                <div className="space-y-2">
                                    <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                                        Chọn bác sĩ
                                    </label>
                                    <select
                                        id="doctor"
                                        value={bookingForm.doctorId}
                                        onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Chọn bác sĩ</option>
                                        {doctors.map((doctor) => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor?.username} - {doctor?.profile?.specialty || "Chuyên khoa chưa cập nhật"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* DateTime Selection */}
                                <div className="space-y-2">
                                    <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
                                        Chọn thời gian
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="datetime"
                                        value={bookingForm.datetime}
                                        onChange={(e) => setBookingForm({ ...bookingForm, datetime: e.target.value })}
                                        min={getMinDateTime()}
                                        max={getMaxDateTime()}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)</p>
                                </div>

                                {/* Reason */}
                                <div className="space-y-2">
                                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                                        Lý do khám
                                    </label>
                                    <input
                                        id="reason"
                                        type="text"
                                        placeholder="Nhập lý do khám"
                                        value={bookingForm.reason}
                                        onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Đặt lịch
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border mb-6">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { key: "upcoming", label: "Sắp tới", count: filterAppointments().length },
                                {
                                    key: "past",
                                    label: "Đã qua",
                                    count: appointments.filter((apt) => apt.status === "completed").length,
                                },
                                { key: "all", label: "Tất cả", count: appointments.length },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setSelectedTab(tab.key)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${selectedTab === tab.key
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Appointments List */}
                    <div className="p-6">
                        {filterAppointments().length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
                                <p className="text-gray-600 mb-4">Bạn chưa có lịch hẹn nào trong danh mục này.</p>
                                <button
                                    onClick={() => setShowBookingForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                >
                                    Đặt lịch khám đầu tiên
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filterAppointments().map((appointment) => {
                                    const doctor = doctors.find((d) => d.id === appointment.doctor_id)
                                    const { date, time } = formatDateTime(appointment.appointment_time)
                                    return (
                                        <div
                                            key={appointment.id}
                                            className="border rounded-lg p-6 hover:bg-gray-50 transition duration-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="bg-blue-100 p-2 rounded-full">
                                                            <Stethoscope className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">
                                                                {doctor ? doctor.username : `Bác sĩ #${appointment.doctor_id}`}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {doctor ? doctor.profile?.specialty : "Chuyên khoa chưa cập nhật"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {date}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            {time}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {appointment.location || "Sẽ thông báo sau"}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="text-sm font-medium text-gray-700">
                                                            Lý do: {appointment.reason}
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
                                                    {appointment.status === "scheduled" && (
                                                        <button
                                                            onClick={() => handleCancelAppointment(appointment.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
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

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Lịch sắp tới</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter((apt) => apt.status === "confirmed" || apt.status === "scheduled").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter((apt) => apt.status === "completed").length}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter((apt) => apt.status === "scheduled").length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-full">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã hủy</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter((apt) => apt.status === "cancelled").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}