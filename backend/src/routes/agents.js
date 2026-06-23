import { Router } from 'express';
import {
  createAgent, getAgent, updateAgent, deleteAgent, listAgents,
} from '../agents/agent-store.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ agents: listAgents() });
});

router.post('/', (req, res) => {
  const { name, description, provider, model, apiKey, customBaseUrl, systemPrompt, temperature, maxTokens, topP, tools } = req.body;

  if (!provider || !model || !apiKey) {
    return res.status(400).json({ error: 'provider, model, and apiKey are required' });
  }

  const agent = createAgent({
    name, description, provider, model, apiKey,
    customBaseUrl, systemPrompt, temperature, maxTokens, topP, tools,
  });
  res.status(201).json({ agent });
});

router.get('/:id', (req, res) => {
  const agent = getAgent(req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json({ agent });
});

router.put('/:id', (req, res) => {
  const agent = updateAgent(req.params.id, req.body);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json({ agent });
});

router.delete('/:id', (req, res) => {
  const deleted = deleteAgent(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Agent not found' });
  res.json({ message: 'Agent deleted' });
});

export default router;
