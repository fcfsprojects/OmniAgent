import { v4 as uuidv4 } from 'uuid';

const conversations = new Map();

export function createConversation(agentId) {
  const id = uuidv4();
  const conversation = {
    id,
    agentId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  conversations.set(id, conversation);
  return conversation;
}

export function getConversation(id) {
  return conversations.get(id) || null;
}

export function addMessage(conversationId, role, content) {
  const conversation = conversations.get(conversationId);
  if (!conversation) return null;

  const message = {
    id: uuidv4(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();
  return message;
}

export function getMessages(conversationId) {
  const conversation = conversations.get(conversationId);
  return conversation?.messages || [];
}

export function listConversations(agentId) {
  return Array.from(conversations.values())
    .filter(c => !agentId || c.agentId === agentId)
    .map(c => ({
      id: c.id,
      agentId: c.agentId,
      messageCount: c.messages.length,
      lastMessage: c.messages[c.messages.length - 1]?.content?.substring(0, 100) || '',
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
}

export function deleteConversation(id) {
  return conversations.delete(id);
}
