"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Bell,
  LogOut,
  Stethoscope,
  User,
  FileText,
  Pill,
  TestTube,
  Plus,
  Trash2,
  Save,
  CheckCircle,
} from "lucide-react"

export default function PatientExamination() {
  const { patientId, appointmentId } = useParams()
  const navigate = useNavigate()

  const [user] = useState({
    name: "BS. Trần Thị Hoa",
    specialty: "Tim mạch",
    email: "tranthihoa@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  const [patient, setPatient] = useState(null)
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Medical Report Form
  const [medicalReport, setMedicalReport] = useState({
    patient_id: patientId ,
    diagnosis: "",
    treatment_plan: "",
    notes: "",
  })

  // Prescription Form
  const [prescription, setPrescription] = useState({
    notes: "",
    items: [
      {
        medicine_name: "",
        dosage: "",
        usage_instruction: "",
      },
    ],
  })

  // Lab Test Form
  const [labTests, setLabTests] = useState([
    {
      test_name: "",
      reason: "",
    },
  ])

  const [activeTab, setActiveTab] = useState("medical-report") // medical-report, prescription, lab-test

  // Fetch patient and appointment data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch patient info
        const patientResponse = await fetch(`http://localhost:8002/api/patients/${patientId}/`)
        if (patientResponse.ok) {
          const patientData = await patientResponse.json()
          setPatient(patientData)
        }

        // Fetch appointment info
        const appointmentResponse = await fetch(`http://localhost:8002/api/appointments/${appointmentId}/`)
        if (appointmentResponse.ok) {
          const appointmentData = await appointmentResponse.json()
          setAppointment(appointmentData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (patientId && appointmentId) {
      fetchData()
    }
  }, [patientId, appointmentId])

  // Add new prescription item
  const addPrescriptionItem = () => {
    setPrescription({
      ...prescription,
      items: [
        ...prescription.items,
        {
          medicine_name: "",
          dosage: "",
          usage_instruction: "",
        },
      ],
    })
  }

  // Remove prescription item
  const removePrescriptionItem = (index) => {
    const newItems = prescription.items.filter((_, i) => i !== index)
    setPrescription({
      ...prescription,
      items: newItems,
    })
  }

  // Update prescription item
  const updatePrescriptionItem = (index, field, value) => {
    const newItems = prescription.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setPrescription({
      ...prescription,
      items: newItems,
    })
  }

  // Add new lab test
  const addLabTest = () => {
    setLabTests([
      ...labTests,
      {
        test_name: "",
        reason: "",
      },
    ])
  }

  // Remove lab test
  const removeLabTest = (index) => {
    const newTests = labTests.filter((_, i) => i !== index)
    setLabTests(newTests)
  }

  // Update lab test
  const updateLabTest = (index, field, value) => {
    const newTests = labTests.map((test, i) => (i === index ? { ...test, [field]: value } : test))
    setLabTests(newTests)
  }

  // Save Medical Report
  const saveMedicalReport = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8002/api/medical-reports/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: patientId,
          diagnosis: medicalReport.diagnosis,
          treatment_plan: medicalReport.treatment_plan,
          notes: medicalReport.notes,
        }),
      })

      if (response.ok) {
        alert("Đã lưu bệnh án thành công!")
        return true
      } else {
        throw new Error("Không thể lưu bệnh án")
      }
    } catch (error) {
      console.error("Error saving medical report:", error)
      alert("Có lỗi xảy ra khi lưu bệnh án: " + error.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Save Prescription
  const savePrescription = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      const validItems = prescription.items.filter(
        (item) => item.medicine_name && item.dosage && item.usage_instruction,
      )

      if (validItems.length === 0) {
        alert("Vui lòng thêm ít nhất một loại thuốc!")
        return false
      }

      const response = await fetch("http://localhost:8002/api/prescriptions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: Number.parseInt(patientId),
          notes: prescription.notes,
          items: validItems,
        }),
      })

      if (response.ok) {
        alert("Đã lưu đơn thuốc thành công!")
        return true
      } else {
        throw new Error("Không thể lưu đơn thuốc")
      }
    } catch (error) {
      console.error("Error saving prescription:", error)
      alert("Có lỗi xảy ra khi lưu đơn thuốc: " + error.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Save Lab Tests
  const saveLabTests = async () => {
    try {
      setSaving(true)
      const validTests = labTests.filter((test) => test.test_name && test.reason)

      if (validTests.length === 0) {
        alert("Vui lòng thêm ít nhất một xét nghiệm!")
        return false
      }
      const token = localStorage.getItem("token")
      const promises = validTests.map((test) =>
        fetch("http://localhost:8002/api/lab-tests/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient_id: Number.parseInt(patientId),
            test_name: test.test_name,
            reason: test.reason,
          }),
        }),
      )

      const responses = await Promise.all(promises)
      const allSuccessful = responses.every((response) => response.ok)

      if (allSuccessful) {
        alert("Đã tạo xét nghiệm thành công!")
        return true
      } else {
        throw new Error("Không thể tạo một số xét nghiệm")
      }
    } catch (error) {
      console.error("Error saving lab tests:", error)
      alert("Có lỗi xảy ra khi tạo xét nghiệm: " + error.message)
      return false
    } finally {
      setSaving(false)
    }
  }

  // Complete Examination
  const completeExamination = async () => {
    if (window.confirm("Hoàn thành khám bệnh? Bạn sẽ được chuyển về trang quản lý lịch hẹn.")) {
      // Update appointment status to completed
      try {
        await fetch(`http://localhost:8002/api/appointments/${appointmentId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        })
      } catch (error) {
        console.error("Error updating appointment status:", error)
      }

      navigate("/doctor/appointments")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="w-8 h-8 animate-pulse text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin bệnh nhân...</p>
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
              <Link to="/doctor/appointments" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="bg-green-600 p-2 rounded-full">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Khám bệnh</h1>
                <p className="text-sm text-gray-600">
                  {patient?.name || `Bệnh nhân #${patientId}`} - Lịch hẹn #{appointmentId}
                </p>
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
        {/* Patient Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{patient?.name || `Bệnh nhân #${patientId}`}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Tuổi:</span> {patient?.age || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Điện thoại:</span> {patient?.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {patient?.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Lý do khám:</span> {appointment?.reason || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "medical-report", label: "Bệnh án", icon: FileText },
                { key: "prescription", label: "Đơn thuốc", icon: Pill },
                { key: "lab-test", label: "Xét nghiệm", icon: TestTube },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                    activeTab === tab.key
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Medical Report Tab */}
            {activeTab === "medical-report" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chẩn đoán</label>
                  <textarea
                    value={medicalReport.diagnosis}
                    onChange={(e) => setMedicalReport({ ...medicalReport, diagnosis: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập chẩn đoán..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương án điều trị</label>
                  <textarea
                    value={medicalReport.treatment_plan}
                    onChange={(e) => setMedicalReport({ ...medicalReport, treatment_plan: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập phương án điều trị..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                  <textarea
                    value={medicalReport.notes}
                    onChange={(e) => setMedicalReport({ ...medicalReport, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập ghi chú..."
                  />
                </div>
                <button
                  onClick={saveMedicalReport}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Đang lưu..." : "Lưu bệnh án"}</span>
                </button>
              </div>
            )}

            {/* Prescription Tab */}
            {activeTab === "prescription" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn thuốc</label>
                  <textarea
                    value={prescription.notes}
                    onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập ghi chú cho đơn thuốc..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Danh sách thuốc</h4>
                    <button
                      onClick={addPrescriptionItem}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm thuốc</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {prescription.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900">Thuốc #{index + 1}</h5>
                          {prescription.items.length > 1 && (
                            <button
                              onClick={() => removePrescriptionItem(index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc</label>
                            <input
                              type="text"
                              value={item.medicine_name}
                              onChange={(e) => updatePrescriptionItem(index, "medicine_name", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Tên thuốc"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Liều lượng</label>
                            <input
                              type="text"
                              value={item.dosage}
                              onChange={(e) => updatePrescriptionItem(index, "dosage", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="500mg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cách dùng</label>
                            <input
                              type="text"
                              value={item.usage_instruction}
                              onChange={(e) => updatePrescriptionItem(index, "usage_instruction", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              placeholder="Uống 2 lần mỗi ngày"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={savePrescription}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Đang lưu..." : "Lưu đơn thuốc"}</span>
                </button>
              </div>
            )}

            {/* Lab Test Tab */}
            {activeTab === "lab-test" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Danh sách xét nghiệm</h4>
                  <button
                    onClick={addLabTest}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm xét nghiệm</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {labTests.map((test, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Xét nghiệm #{index + 1}</h5>
                        {labTests.length > 1 && (
                          <button
                            onClick={() => removeLabTest(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tên xét nghiệm</label>
                          <input
                            type="text"
                            value={test.test_name}
                            onChange={(e) => updateLabTest(index, "test_name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Xét nghiệm máu tổng quát"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
                          <input
                            type="text"
                            value={test.reason}
                            onChange={(e) => updateLabTest(index, "reason", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Kiểm tra sau điều trị"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={saveLabTests}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Đang tạo..." : "Tạo xét nghiệm"}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Complete Examination */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Hoàn thành khám bệnh</h3>
              <p className="text-sm text-gray-600">Kết thúc cuộc khám và cập nhật trạng thái lịch hẹn</p>
            </div>
            <button
              onClick={completeExamination}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Hoàn thành khám</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
