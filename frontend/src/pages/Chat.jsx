import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export default function Chat() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [agent, setAgent] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getAgent(agentId).then(res => setAgent(res.agent)).catch(() => navigate('/'));
  }, [agentId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function initConversation() {
    if (conversationId) return conversationId;
    const res = await api.createConversation(agentId);
    setConversationId(res.conversation.id);
    return res.conversation.id;
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);
    setError(null);

    try {
      const convId = await initConversation();
      const res = await api.sendMessage(convId, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: res.message.content }]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { role: 'error', content: `Error: ${err.message}` }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Bot size={20} className="text-primary-600" />
        </div>
        <div>
          <h2 className="font-semibold">{agent?.name || 'Loading...'}</h2>
          <p className="text-xs text-gray-400">
            {agent?.provider} / {agent?.model}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20">
            <Bot size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">Send a message to start the conversation</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role !== 'user' && (
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'error' ? 'bg-red-100' : 'bg-primary-100'
              }`}>
                <Bot size={16} className={msg.role === 'error' ? 'text-red-600' : 'text-primary-600'} />
              </div>
            )}
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-primary-600 text-white'
                : msg.role === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Loader2 size={16} className="text-primary-600 animate-spin" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <p className="text-sm text-gray-400">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-3 pt-4 border-t border-gray-200">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="input flex-1"
          disabled={sending}
          autoFocus
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary flex items-center gap-2">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
