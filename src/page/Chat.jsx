import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🤖 Bạn hãy nhập các triệu chứng nhé.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectedSymptoms, setCollectedSymptoms] = useState([]);
  const bottomRef = useRef(null);

  const isPredictCommand = (text) => {
    const keywords = ['dự đoán', 'chẩn đoán', 'đoán bệnh', 'xác định bệnh'];
    const normalized = text.toLowerCase();
    return keywords.some((kw) => normalized.includes(kw));
  };

  const formatTreatments = (treatments) => {
    if (!treatments || typeof treatments !== 'object') return '';
    let result = '\n\n🩺 Hướng dẫn điều trị:\n';
    for (const [category, items] of Object.entries(treatments)) {
      result += `\n👉 ${category.toUpperCase()}:\n- ${items.join('\n- ')}\n`;
    }
    return result;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      if (isPredictCommand(input)) {
        if (collectedSymptoms.length < 1) {
          setMessages([
            ...newMessages,
            { sender: 'bot', text: '❗ Bạn cần nhập ít nhất một triệu chứng trước khi dự đoán.' },
          ]);
        } else {
          const response = await axios.post('http://localhost:8003/chatbot/api/predict/', {
            symptoms: collectedSymptoms,
          });

          const result = response.data.result;
          let botMessage = result
            ? `🤖 Dự đoán: ${result.ten_benh}\n📋 Mô tả: ${result.mo_ta || 'Không có mô tả'}`
            : '⚠️ Không tìm thấy bệnh phù hợp.';

          if (result?.dieu_tri) {
            botMessage += formatTreatments(result.dieu_tri);
          }

          setMessages([...newMessages, { sender: 'bot', text: botMessage }]);
          setCollectedSymptoms([]); // reset sau dự đoán
        }
      } else {
        const newSymptoms = input
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
        setCollectedSymptoms((prev) => [...prev, ...newSymptoms]);

        setMessages([
          ...newMessages,
          { sender: 'bot', text: `✅ Đã ghi nhận triệu chứng: ${newSymptoms.join(', ')}` },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { sender: 'bot', text: '❌ Đã xảy ra lỗi. Vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-4xl mx-auto mt-10 border rounded-xl p-4 shadow-lg h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%]`}>
              {msg.sender === 'bot' && (
                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="bot" className="w-8 h-8" />
              )}
              <div
                className={`p-3 rounded-xl whitespace-pre-line ${
                  msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <img src="https://cdn-icons-png.flaticon.com/512/4712/4712050.png" alt="user" className="w-8 h-8" />
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">⏳ Đang xử lý...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-4 py-2 rounded-xl"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập triệu chứng hoặc gõ 'dự đoán'..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
