import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Plus, MessageSquare, Trash2, Settings } from 'lucide-react';
import { api } from '../lib/api';

export default function Dashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const result = await api.getAgents();
      setAgents(result.agents);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this agent?')) return;
    try {
      await api.deleteAgent(id);
      setAgents(agents.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Agents</h1>
          <p className="text-gray-500 mt-1">Manage and deploy your AI agents</p>
        </div>
        <Link to="/agents/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Agent
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading agents...</div>
      ) : agents.length === 0 ? (
        <div className="card text-center py-16">
          <Bot size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No agents yet</h2>
          <p className="text-gray-400 mb-6">Create your first AI agent to get started</p>
          <Link to="/agents/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Create Your First Agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div key={agent.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Bot size={24} className="text-primary-600" />
                </div>
                <div className="flex gap-1">
                  <Link
                    to={`/agents/${agent.id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <Settings size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(agent.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{agent.description || 'No description'}</p>
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-medium">{agent.provider}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{agent.model}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/chat/${agent.id}`}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  <MessageSquare size={16} />
                  Start Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
