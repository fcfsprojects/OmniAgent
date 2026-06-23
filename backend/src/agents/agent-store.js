import { v4 as uuidv4 } from 'uuid';
import { AGENT_DEFAULTS } from '../config/defaults.js';

const agents = new Map();

export function createAgent(data) {
  const id = uuidv4();
  const agent = {
    id,
    name: data.name || 'Untitled Agent',
    description: data.description || '',
    provider: data.provider,
    model: data.model,
    apiKey: data.apiKey,
    customBaseUrl: data.customBaseUrl || null,
    systemPrompt: data.systemPrompt || AGENT_DEFAULTS.systemPrompt,
    temperature: data.temperature ?? AGENT_DEFAULTS.temperature,
    maxTokens: data.maxTokens ?? AGENT_DEFAULTS.maxTokens,
    topP: data.topP ?? AGENT_DEFAULTS.topP,
    tools: data.tools || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  agents.set(id, agent);
  return sanitizeAgent(agent);
}

export function getAgent(id) {
  const agent = agents.get(id);
  return agent || null;
}

export function getAgentWithKey(id) {
  return agents.get(id) || null;
}

export function updateAgent(id, data) {
  const agent = agents.get(id);
  if (!agent) return null;

  const updatable = [
    'name', 'description', 'provider', 'model', 'apiKey',
    'customBaseUrl', 'systemPrompt', 'temperature', 'maxTokens',
    'topP', 'tools',
  ];

  for (const field of updatable) {
    if (data[field] !== undefined) {
      agent[field] = data[field];
    }
  }
  agent.updatedAt = new Date().toISOString();
  agents.set(id, agent);
  return sanitizeAgent(agent);
}

export function deleteAgent(id) {
  return agents.delete(id);
}

export function listAgents() {
  return Array.from(agents.values()).map(sanitizeAgent);
}

function sanitizeAgent(agent) {
  const { apiKey, ...safe } = agent;
  return {
    ...safe,
    hasApiKey: !!apiKey,
  };
}
