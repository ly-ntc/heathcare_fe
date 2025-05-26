import { Link } from "react-router-dom"
import { LogIn, UserPlus, Users, Calendar, Pill, Stethoscope } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Hệ thống Phòng khám</h1>
            </div>
            <div className="flex space-x-3">
              <Link to="/login">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200">
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </button>
              </Link>
              <Link to="/register">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200">
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Hệ thống Quản lý Phòng khám Hiện đại</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Giải pháp toàn diện cho việc quản lý bệnh nhân, lịch hẹn, đơn thuốc và hồ sơ y tế. Dành cho bệnh nhân, bác
            sĩ và dược sĩ.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <UserPlus className="w-5 h-5" />
                Bắt đầu sử dụng
              </button>
            </Link>
            <Link to="/login">
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
                <LogIn className="w-5 h-5" />
                Đăng nhập
              </button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quản lý Bệnh nhân</h3>
            </div>
            <p className="text-gray-600">
              Hồ sơ bệnh án điện tử, lịch sử khám chữa bệnh và theo dõi sức khỏe toàn diện
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Đặt lịch Khám</h3>
            </div>
            <p className="text-gray-600">Hệ thống đặt lịch hẹn thông minh, quản lý lịch làm việc của bác sĩ hiệu quả</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Pill className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quản lý Thuốc</h3>
            </div>
            <p className="text-gray-600">Kê đơn thuốc điện tử, quản lý kho thuốc và theo dõi việc phát thuốc</p>
          </div>
        </div>

        {/* User Roles */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Dành cho mọi đối tượng</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Bệnh nhân</h4>
              <p className="text-gray-600">Đặt lịch khám, xem hồ sơ bệnh án, theo dõi đơn thuốc</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Bác sĩ</h4>
              <p className="text-gray-600">Quản lý lịch khám, chẩn đoán, kê đơn thuốc</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pill className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900">Dược sĩ</h4>
              <p className="text-gray-600">Quản lý kho thuốc, xử lý đơn thuốc, tư vấn</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2024 Hệ thống Phòng khám. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div> 
  )
}
