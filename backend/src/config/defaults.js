export const SERVER_CONFIG = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || '0.0.0.0',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
};

export const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  message: { error: 'Too many requests, please try again later.' },
};

export const AGENT_DEFAULTS = {
  maxTokens: 4096,
  temperature: 0.7,
  topP: 1,
  systemPrompt: 'You are a helpful AI assistant.',
};
