import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./page/Home"
import Login from "./page/Login"
import Register from "./page/Register"
import PatientDashboard from "./page/patient/PatientDashboard"
import DoctorDashboard from "./page/doctor/DoctorDashboard"
import PharmacistDashboard from "./page/pharmacist/PharmacistDashboard"
import PatientAppointments from "./page/patient/PatientAppointments"
import PatientMedicalRecords from "./page/patient/PatientMedicalRecords"
import PatientPrescriptions from "./page/patient/PatientPrescriptions"
import DoctorAppointments from "./page/doctor/DoctorAppointments"
import PatientExamination from "./page/doctor/PatientExamination"
import "./App.css"
import DoctorMedicalReports from "./page/doctor/DoctorMedicalReports"
import DoctorPrescriptions from "./page/doctor/DoctorPrescriptions"
import DoctorLabTests from "./page/doctor/DoctorLabTests"
import PatientLabTest from "./page/patient/PatientLabTest"
import Chat from "./page/Chat"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<Home />} />

          {/* Trang đăng nhập */}
          <Route path="/login" element={<Login />} />

          {/* Trang đăng ký */}
          <Route path="/register" element={<Register />} />

          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
          {/* Patient specific pages */}
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/medical-records" element={<PatientMedicalRecords />} />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/patient/lab-tests" element={<PatientLabTest />} />

          {/* Doctor specific pages */}
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
           <Route path="/doctor/examination/:patientId/:appointmentId" element={<PatientExamination />} />
           <Route path="/doctor/medical-reports" element={<DoctorMedicalReports />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
          <Route path="/doctor/lab-tests" element={<DoctorLabTests />} />

          {/* Redirect các route không tồn tại về trang chủ */}

          <Route path="*" element={<Navigate to="/" replace />} />
          {/* Chatbot */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
