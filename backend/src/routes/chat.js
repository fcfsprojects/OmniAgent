import { Router } from 'express';
import { getAgentWithKey } from '../agents/agent-store.js';
import { createProvider } from '../providers/index.js';
import {
  createConversation, getConversation, addMessage,
  getMessages, listConversations, deleteConversation,
} from '../agents/chat-manager.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/conversations', (req, res) => {
  const { agentId } = req.body;
  if (!agentId) return res.status(400).json({ error: 'agentId is required' });

  const conversation = createConversation(agentId);
  res.status(201).json({ conversation });
});

router.get('/conversations', (req, res) => {
  const { agentId } = req.query;
  res.json({ conversations: listConversations(agentId) });
});

router.get('/conversations/:id', (req, res) => {
  const conversation = getConversation(req.params.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
  res.json({ conversation });
});

router.delete('/conversations/:id', (req, res) => {
  const deleted = deleteConversation(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Conversation not found' });
  res.json({ message: 'Conversation deleted' });
});

router.post('/conversations/:id/messages', async (req, res, next) => {
  try {
    const conversation = getConversation(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const agent = getAgentWithKey(conversation.agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    addMessage(req.params.id, 'user', content);

    const provider = createProvider(agent.provider, agent.apiKey, agent.customBaseUrl);

    const messages = [
      { role: 'system', content: agent.systemPrompt },
      ...getMessages(req.params.id).map(m => ({ role: m.role, content: m.content })),
    ];

    const response = await provider.chat(messages, {
      model: agent.model,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      topP: agent.topP,
      tools: agent.tools.length > 0 ? agent.tools : undefined,
    });

    addMessage(req.params.id, 'assistant', response.content);

    logger.info('Chat completion', {
      agent: agent.name,
      provider: agent.provider,
      model: agent.model,
      usage: response.usage,
    });

    res.json({ message: response });
  } catch (err) {
    next(err);
  }
});

router.post('/conversations/:id/stream', async (req, res, next) => {
  try {
    const conversation = getConversation(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

    const agent = getAgentWithKey(conversation.agentId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });

    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content is required' });

    addMessage(req.params.id, 'user', content);

    const provider = createProvider(agent.provider, agent.apiKey, agent.customBaseUrl);

    const messages = [
      { role: 'system', content: agent.systemPrompt },
      ...getMessages(req.params.id).map(m => ({ role: m.role, content: m.content })),
    ];

    const streamResponse = await provider.streamChat(messages, {
      model: agent.model,
      temperature: agent.temperature,
      maxTokens: agent.maxTokens,
      topP: agent.topP,
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let lineBuffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);

        lineBuffer += chunk;
        const parts = lineBuffer.split('\n');
        lineBuffer = parts.pop();

        const lines = parts.filter(l => l.startsWith('data: ') || l.startsWith('{'));
        for (const line of lines) {
          const data = line.startsWith('data: ') ? line.slice(6) : line;
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const openaiDelta = parsed.choices?.[0]?.delta?.content || '';
            const anthropicDelta = parsed.delta?.text || '';
            const googleDelta = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            fullContent += openaiDelta || anthropicDelta || googleDelta;
          } catch {
            // skip unparseable chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (fullContent) {
      addMessage(req.params.id, 'assistant', fullContent);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    } else {
      logger.error('Stream error after headers sent:', { message: err.message, stack: err.stack });
      res.end();
    }
  }
});

router.post('/quick', async (req, res, next) => {
  try {
    const { provider: providerId, model, apiKey, messages, customBaseUrl, temperature, maxTokens } = req.body;

    if (!providerId || !model || !apiKey || !messages) {
      return res.status(400).json({ error: 'provider, model, apiKey, and messages are required' });
    }

    const provider = createProvider(providerId, apiKey, customBaseUrl);
    const response = await provider.chat(messages, { model, temperature, maxTokens });

    res.json({ message: response });
  } catch (err) {
    next(err);
  }
});

export default router;
