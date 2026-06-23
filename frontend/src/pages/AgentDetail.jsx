import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, MessageSquare, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    Promise.all([
      api.getAgent(id),
      api.getProviders(),
    ]).then(([agentRes, provRes]) => {
      setAgent(agentRes.agent);
      setForm(agentRes.agent);
      setProviders(provRes.providers);
    }).catch(err => {
      setError(err.message);
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  const selectedProvider = providers.find(p => p.id === form.provider);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'temperature' ? parseFloat(value) : name === 'maxTokens' ? parseInt(value, 10) : value,
      ...(name === 'provider' ? { model: '' } : {}),
    }));
    setSuccess(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await api.updateAgent(id, form);
      setAgent(result.agent);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this agent permanently?')) return;
    await api.deleteAgent(id);
    navigate('/');
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!agent) return <div className="text-center py-20 text-red-500">Agent not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Edit Agent</h1>
        <div className="flex gap-2">
          <Link to={`/chat/${id}`} className="btn-primary flex items-center gap-2">
            <MessageSquare size={16} /> Chat
          </Link>
          <button onClick={handleDelete} className="btn-danger flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">Agent updated successfully</div>}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Info</h2>
          <div>
            <label className="label">Name</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description || ''} onChange={handleChange} className="input" rows={2} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Provider & Model</h2>
          <div>
            <label className="label">Provider</label>
            <select name="provider" value={form.provider || ''} onChange={handleChange} className="input">
              {providers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {selectedProvider && (
            <div>
              <label className="label">Model</label>
              <select name="model" value={form.model || ''} onChange={handleChange} className="input">
                {selectedProvider.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label">New API Key (leave empty to keep current)</label>
            <input name="apiKey" type="password" onChange={handleChange} className="input" placeholder="Enter new API key..." />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Configuration</h2>
          <div>
            <label className="label">System Prompt</label>
            <textarea name="systemPrompt" value={form.systemPrompt || ''} onChange={handleChange} className="input" rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Temperature ({form.temperature})</label>
              <input name="temperature" type="range" min="0" max="2" step="0.1" value={form.temperature ?? 0.7} onChange={handleChange} className="w-full" />
            </div>
            <div>
              <label className="label">Max Tokens</label>
              <input name="maxTokens" type="number" value={form.maxTokens ?? 4096} onChange={handleChange} className="input" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
