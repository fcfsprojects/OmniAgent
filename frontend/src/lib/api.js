const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Health
  health: () => request('/health'),

  // Providers
  getProviders: () => request('/providers'),
  getProvider: (id) => request(`/providers/${id}`),
  getProviderModels: (id) => request(`/providers/${id}/models`),

  // Agents
  getAgents: () => request('/agents'),
  getAgent: (id) => request(`/agents/${id}`),
  createAgent: (data) => request('/agents', { method: 'POST', body: data }),
  updateAgent: (id, data) => request(`/agents/${id}`, { method: 'PUT', body: data }),
  deleteAgent: (id) => request(`/agents/${id}`, { method: 'DELETE' }),

  // Chat
  getConversations: (agentId) => request(`/chat/conversations${agentId ? `?agentId=${agentId}` : ''}`),
  createConversation: (agentId) => request('/chat/conversations', { method: 'POST', body: { agentId } }),
  getConversation: (id) => request(`/chat/conversations/${id}`),
  deleteConversation: (id) => request(`/chat/conversations/${id}`, { method: 'DELETE' }),
  sendMessage: (conversationId, content) =>
    request(`/chat/conversations/${conversationId}/messages`, { method: 'POST', body: { content } }),

  // Quick chat (no agent needed)
  quickChat: (data) => request('/chat/quick', { method: 'POST', body: data }),
};
