"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  LogIn,
  UserPlus,
  Users,
  Calendar,
  Pill,
  Stethoscope,
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Maximize2,
} from "lucide-react"

export default function Home() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [userData, setUserData] = useState({})
  const [isComplete, setIsComplete] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const questions = [
    {
      key: "age",
      question:
        "Xin chào! Tôi là trợ lý sức khỏe AI. Để có thể tư vấn tốt nhất, bạn có thể cho tôi biết tuổi của bạn không?",
      type: "number",
      validation: (value) => value > 0 && value < 120,
      errorMessage: "Vui lòng nhập tuổi hợp lệ (1-120)",
    },
    {
      key: "pregnancies",
      question: "Bạn đã từng mang thai bao nhiêu lần? (Nhập 0 nếu chưa từng hoặc là nam giới)",
      type: "number",
      validation: (value) => value >= 0 && value < 20,
      errorMessage: "Vui lòng nhập số lần mang thai hợp lệ (0-20)",
    },
    {
      key: "gluscozu",
      question: "Chỉ số đường huyết của bạn là bao nhiêu? (mg/dL)",
      type: "number",
      validation: (value) => value > 0 && value < 500,
      errorMessage: "Vui lòng nhập chỉ số đường huyết hợp lệ (1-500 mg/dL)",
    },
    {
      key: "bloodpressure",
      question: "Huyết áp tâm trương của bạn là bao nhiêu? (mmHg)",
      type: "number",
      validation: (value) => value > 0 && value < 200,
      errorMessage: "Vui lòng nhập huyết áp hợp lệ (1-200 mmHg)",
    },
    {
      key: "skinthickness",
      question: "Độ dày nếp gấp da ở cánh tay là bao nhiêu? (mm)",
      type: "number",
      validation: (value) => value >= 0 && value < 100,
      errorMessage: "Vui lòng nhập độ dày da hợp lệ (0-100 mm)",
    },
    {
      key: "insulin",
      question: "Mức insulin trong máu của bạn là bao nhiêu? (μU/mL)",
      type: "number",
      validation: (value) => value >= 0 && value < 1000,
      errorMessage: "Vui lòng nhập mức insulin hợp lệ (0-1000 μU/mL)",
    },
    {
      key: "bmi",
      question: "Chỉ số BMI của bạn là bao nhiêu? (kg/m²)",
      type: "number",
      validation: (value) => value > 0 && value < 70,
      errorMessage: "Vui lòng nhập BMI hợp lệ (1-70 kg/m²)",
    },
    {
      key: "diabetespedigreefunction",
      question:
        "Có tiền sử gia đình mắc tiểu đường không? (Nhập từ 0.0 đến 2.0, với 0 là không có, 2.0 là có nhiều người trong gia đình)",
      type: "number",
      validation: (value) => value >= 0 && value <= 2,
      errorMessage: "Vui lòng nhập giá trị từ 0.0 đến 2.0",
    },
  ]

  const initializeChatbot = () => {
    setShowChatbot(true)
    setIsMinimized(false)
    setMessages([
      {
        type: "bot",
        content: questions[0].question,
        timestamp: new Date(),
      },
    ])
    setCurrentQuestion(0)
    setUserData({})
    setIsComplete(false)
    setPrediction(null)
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const currentQ = questions[currentQuestion]
    const value = Number.parseFloat(userInput)

    // Add user message
    const newMessages = [
      ...messages,
      {
        type: "user",
        content: userInput,
        timestamp: new Date(),
      },
    ]

    // Validate input
    if (isNaN(value) || !currentQ.validation(value)) {
      setMessages([
        ...newMessages,
        {
          type: "bot",
          content: currentQ.errorMessage + " Vui lòng thử lại.",
          timestamp: new Date(),
        },
      ])
      setUserInput("")
      return
    }

    // Save user data
    const newUserData = { ...userData, [currentQ.key]: value }
    setUserData(newUserData)

    // Check if this is the last question
    if (currentQuestion === questions.length - 1) {
      setMessages([
        ...newMessages,
        {
          type: "bot",
          content: "Cảm ơn bạn! Tôi đang phân tích thông tin và đưa ra kết quả...",
          timestamp: new Date(),
        },
      ])
      setIsComplete(true)
      setLoading(true)

      // Call prediction API
      try {
        console.log("Sending data to API:", newUserData)

        const response = await fetch("http://localhost:8003/chatbot/predict/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify(newUserData),
        })

        console.log("Response status:", response.status)

        if (response.ok) {
          const result = await response.json()
          console.log("API Result:", result)
          setPrediction(result)

          let resultMessage = ""
          if (result.diagnosis === 1) {
            resultMessage =
              "⚠️ Kết quả phân tích cho thấy bạn có nguy cơ mắc tiểu đường. Bạn nên đi khám bác sĩ để được tư vấn và kiểm tra cụ thể hơn."
          } else {
            resultMessage =
              "✅ Chỉ số của bạn trong mức bình thường. Tuy nhiên, hãy duy trì lối sống lành mạnh và kiểm tra sức khỏe định kỳ."
          }

          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: resultMessage,
              timestamp: new Date(),
            },
          ])
        } else {
          const errorText = await response.text()
          console.error("API Error Response:", errorText)
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
      } catch (error) {
        console.error("API Call Error:", error)

        let errorMessage = "Xin lỗi, có lỗi xảy ra khi kết nối với hệ thống phân tích. "

        if (error.name === "TypeError" && error.message.includes("fetch")) {
          errorMessage +=
            "Không thể kết nối đến server. Vui lòng kiểm tra:\n" +
            "• Server có đang chạy tại http://localhost:8000 không?\n" +
            "• Có vấn đề về CORS không?\n" +
            "• Kết nối mạng có ổn định không?"
        } else if (error.message.includes("HTTP")) {
          errorMessage += `Lỗi từ server: ${error.message}`
        } else {
          errorMessage += "Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật."
        }

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: errorMessage,
            timestamp: new Date(),
          },
        ])
      } finally {
        setLoading(false)
      }
    } else {
      // Move to next question
      const nextQuestion = currentQuestion + 1
      setMessages([
        ...newMessages,
        {
          type: "bot",
          content: questions[nextQuestion].question,
          timestamp: new Date(),
        },
      ])
      setCurrentQuestion(nextQuestion)
    }

    setUserInput("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

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
              <button className="flex items-center gap-2 px-6 py-3 !bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
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
            <button
              onClick={initializeChatbot}
              className="flex items-center gap-2 px-6 py-3 !bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              Dự đoán các chỉ số bệnh tiểu đường
            </button>

            <Link
              to="/chat"
              className="flex items-center gap-2 px-6 py-3 !bg-green-600 !text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              Tư vấn sức khỏe AI
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

      {/* Floating Chatbot Widget */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
              isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between !bg-green-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="!bg-white bg-opacity-20 p-1 rounded-full">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">Trợ lý sức khỏe AI</h3>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4 !bg-green-600" /> : <Minimize2 className="w-4 h-4 !bg-green-600" />}
                </button>
                <button
                  onClick={() => setShowChatbot(false)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 !bg-green-600" />
                </button>
              </div>
            </div>

            {/* Messages - Only show when not minimized */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 h-[360px]">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start space-x-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <div
                          className={`p-1.5 rounded-full ${message.type === "user" ? "bg-blue-100" : "bg-green-100"}`}
                        >
                          {message.type === "user" ? (
                            <User className="w-3 h-3 text-blue-600" />
                          ) : (
                            <Bot className="w-3 h-3 text-green-600" />
                          )}
                        </div>
                        <div
                          className={`p-2.5 rounded-lg text-xs ${
                            message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-[85%]">
                        <div className="p-1.5 rounded-full bg-green-100">
                          <Bot className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="p-2.5 rounded-lg bg-gray-100 text-gray-900">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                {!isComplete && (
                  <div className="p-3 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập câu trả lời..."
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!userInput.trim()}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action buttons when complete */}
                {isComplete && (
                  <div className="p-3 border-t space-y-2">
                    <button
                      onClick={initializeChatbot}
                      className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Bắt đầu lại
                    </button>
                    {!prediction && (
                      <button
                        onClick={async () => {
                          setLoading(true)
                          try {
                            const response = await fetch("http://localhost:8000/chatbot/predict/", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                              },
                              mode: "cors",
                              body: JSON.stringify(userData),
                            })

                            if (response.ok) {
                              const result = await response.json()
                              setPrediction(result)

                              let resultMessage = ""
                              if (result.prediction === 1) {
                                resultMessage =
                                  "⚠️ Kết quả phân tích cho thấy bạn có nguy cơ mắc tiểu đường. Bạn nên đi khám bác sĩ để được tư vấn và kiểm tra cụ thể hơn."
                              } else {
                                resultMessage =
                                  "✅ Chỉ số của bạn trong mức bình thường. Tuy nhiên, hãy duy trì lối sống lành mạnh và kiểm tra sức khỏe định kỳ."
                              }

                              setMessages((prev) => [
                                ...prev,
                                {
                                  type: "bot",
                                  content: resultMessage,
                                  timestamp: new Date(),
                                },
                              ])
                            } else {
                              throw new Error(`HTTP ${response.status}`)
                            }
                          } catch (error) {
                            setMessages((prev) => [
                              ...prev,
                              {
                                type: "bot",
                                content: "Vẫn không thể kết nối. Vui lòng kiểm tra server và thử lại sau.",
                                timestamp: new Date(),
                              },
                            ])
                          } finally {
                            setLoading(false)
                          }
                        }}
                        className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={loading}
                      >
                        {loading ? "Đang thử lại..." : "Thử lại kết nối"}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
