import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Zap, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

export default function QuickChat() {
  const messagesEndRef = useRef(null);
  const [providers, setProviders] = useState([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [config, setConfig] = useState({
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: '',
    customBaseUrl: '',
  });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.getProviders().then(res => setProviders(res.providers)).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedProvider = providers.find(p => p.id === config.provider);

  function handleConfigChange(e) {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'provider' ? { model: '' } : {}),
    }));
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending || !config.apiKey) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setSending(true);

    try {
      const res = await api.quickChat({
        provider: config.provider,
        model: config.model,
        apiKey: config.apiKey,
        customBaseUrl: config.customBaseUrl || undefined,
        messages: newMessages,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.message.content }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', content: `Error: ${err.message}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Config bar */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={20} className="text-primary-600" />
          <h2 className="font-semibold">Quick Chat — No Agent Required</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <select name="provider" value={config.provider} onChange={handleConfigChange} className="input text-sm">
            {providers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select name="model" value={config.model} onChange={handleConfigChange} className="input text-sm">
            <option value="">Select model...</option>
            {selectedProvider?.models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <div className="relative">
            <input
              name="apiKey"
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={handleConfigChange}
              className="input text-sm pr-8"
              placeholder="API Key"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-2.5 text-gray-400"
            >
              {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {selectedProvider?.allowCustomBaseUrl && (
            <input
              name="customBaseUrl"
              value={config.customBaseUrl}
              onChange={handleConfigChange}
              className="input text-sm"
              placeholder="Custom Base URL"
            />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <Zap size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">Quick chat with any provider — just add your API key and start</p>
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
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={config.apiKey ? 'Type your message...' : 'Enter an API key first...'}
          className="input flex-1"
          disabled={sending || !config.apiKey}
          autoFocus
        />
        <button type="submit" disabled={sending || !input.trim() || !config.apiKey} className="btn-primary">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
