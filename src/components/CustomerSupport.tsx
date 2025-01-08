import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AUTOMATED_RESPONSES: Record<string, string> = {
  shipping: "Shipping typically takes 3-5 business days within the US.",
  return: "We offer a 30-day return policy for all products.",
  warranty: "All our smartwatches come with a 1-year limited warranty.",
  default: "Thank you for your message. Our team will get back to you shortly.",
};

export default function CustomerSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const getAutomatedResponse = (msg: string) => {
    const lowercaseMsg = msg.toLowerCase();
    if (lowercaseMsg.includes('shipping')) return AUTOMATED_RESPONSES.shipping;
    if (lowercaseMsg.includes('return')) return AUTOMATED_RESPONSES.return;
    if (lowercaseMsg.includes('warranty')) return AUTOMATED_RESPONSES.warranty;
    return AUTOMATED_RESPONSES.default;
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      // Save user message
      const { error: userError } = await supabase.from('chat_messages').insert({
        message: message.trim(),
        is_automated: false,
      });

      if (userError) throw userError;

      // Generate and save automated response
      const automatedResponse = getAutomatedResponse(message);
      const { error: autoError } = await supabase.from('chat_messages').insert({
        message: automatedResponse,
        is_automated: true,
      });

      if (autoError) throw autoError;

      // Reload messages
      await loadMessages();
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/2348144493361"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Chat Interface */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="p-4 bg-gray-900 text-white rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">Customer Support</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.is_automated ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.is_automated
                        ? 'bg-gray-100'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </>
  );
}