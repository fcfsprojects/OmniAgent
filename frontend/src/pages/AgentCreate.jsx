import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

export default function AgentCreate() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    provider: '',
    model: '',
    apiKey: '',
    customBaseUrl: '',
    systemPrompt: 'You are a helpful AI assistant.',
    temperature: 0.7,
    maxTokens: 4096,
  });

  useEffect(() => {
    api.getProviders().then(res => setProviders(res.providers)).catch(() => {});
  }, []);

  const selectedProvider = providers.find(p => p.id === form.provider);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'temperature' ? parseFloat(value) : name === 'maxTokens' ? parseInt(value, 10) : value,
      ...(name === 'provider' ? { model: '' } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await api.createAgent(form);
      navigate(`/chat/${result.agent.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center">
          <Bot size={28} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Create New Agent</h1>
          <p className="text-gray-500">Configure your AI agent with any provider and model</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Info</h2>
          <div>
            <label className="label">Agent Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="My AI Assistant" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={2} placeholder="What does this agent do?" />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Provider & Model</h2>
          <div>
            <label className="label">AI Provider</label>
            <select name="provider" value={form.provider} onChange={handleChange} className="input" required>
              <option value="">Select a provider...</option>
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {selectedProvider && (
            <div>
              <label className="label">Model</label>
              <select name="model" value={form.model} onChange={handleChange} className="input" required>
                <option value="">Select a model...</option>
                {selectedProvider.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">API Key</label>
            <div className="relative">
              <input
                name="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={form.apiKey}
                onChange={handleChange}
                className="input pr-10"
                placeholder="Enter your API key"
                required
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Your API key is stored securely and never shared</p>
          </div>

          {selectedProvider?.allowCustomBaseUrl && (
            <div>
              <label className="label">Custom Base URL (optional)</label>
              <input name="customBaseUrl" value={form.customBaseUrl} onChange={handleChange} className="input" placeholder="https://your-endpoint.com/v1" />
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Agent Configuration</h2>
          <div>
            <label className="label">System Prompt</label>
            <textarea name="systemPrompt" value={form.systemPrompt} onChange={handleChange} className="input" rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Temperature ({form.temperature})</label>
              <input name="temperature" type="range" min="0" max="2" step="0.1" value={form.temperature} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="label">Max Tokens</label>
              <input name="maxTokens" type="number" value={form.maxTokens} onChange={handleChange} className="input" min="1" max="128000" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full text-lg py-3">
          {saving ? 'Creating Agent...' : 'Create Agent'}
        </button>
      </form>
    </div>
  );
}
