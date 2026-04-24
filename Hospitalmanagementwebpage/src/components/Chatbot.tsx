import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I\'m your medical triage assistant. Please describe your symptoms and I\'ll help route you to the right department.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://pythonmodel-model.onrender.com/triage?symptoms=${encodeURIComponent(userMessage)}`,
        { method: 'POST' }
      );

      if (!response.ok) throw new Error('API error');

      const data = await response.json();

      return `**Department:** ${data.department}
**Urgency:** ${data.urgency}
**Reasoning:** ${data.reasoning}
**Next Steps:** ${data.next_steps?.join(', ')}

_${data.disclaimer}_`;

    } catch (error) {
      return 'Sorry, I could not reach the medical system right now. Please try again or seek help directly.';
    }
  };

  const handleSend = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const responseText = await getBotResponse(inputValue);

    const botResponse: Message = {
      id: messages.length + 2,
      text: responseText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'I have chest pain and shortness of breath',
    'I have a fever and sore throat',
    'I broke my arm',
    'I have severe headache'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-black mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">AI Medical Assistant</h2>
        <p className="text-gray-600">Describe your symptoms for instant triage guidance</p>
      </div>

      <div className="card h-[600px] flex flex-col border-2 border-emerald-200 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 -m-6 mb-4 p-6 rounded-t-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-black">Triage Assistant</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-emerald-600">Online</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                  : 'bg-gradient-to-br from-emerald-500 to-green-600'
              }`}>
                {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl shadow-md ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-emerald-50 to-green-50 text-gray-800 border-2 border-emerald-200'
                }`}>
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 rounded-2xl border-2 border-emerald-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="py-4 border-t-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 -m-6 mt-4 mb-0 p-6 rounded-b-xl">
            <p className="text-gray-700 mb-3">Example symptoms:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="px-3 py-2 text-left bg-white text-emerald-700 rounded-lg hover:bg-emerald-100 transition-all border-2 border-emerald-300 hover:border-emerald-500 shadow-sm hover:shadow-md"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t-2 border-emerald-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms..."
            className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={inputValue.trim() === '' || isTyping}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}