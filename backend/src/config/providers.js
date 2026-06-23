/**
 * Provider configuration registry.
 * Each provider entry defines its base URL, supported models,
 * auth header format, and request/response transformers.
 */

export const PROVIDER_CONFIGS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4',
      'gpt-3.5-turbo', 'o1', 'o1-mini', 'o1-preview',
      'o3', 'o3-mini', 'o4-mini',
    ],
    endpoints: {
      chat: '/chat/completions',
      embeddings: '/embeddings',
      images: '/images/generations',
      audio: '/audio/transcriptions',
      tts: '/audio/speech',
    },
    features: ['chat', 'streaming', 'function_calling', 'vision', 'embeddings', 'images', 'audio', 'tts'],
  },

  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    authHeader: 'x-api-key',
    authPrefix: '',
    extraHeaders: { 'anthropic-version': '2023-06-01' },
    models: [
      'claude-sonnet-4-20250514', 'claude-opus-4-20250514',
      'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229', 'claude-3-haiku-20240307',
    ],
    endpoints: {
      chat: '/messages',
    },
    features: ['chat', 'streaming', 'function_calling', 'vision'],
    requestTransform: 'anthropic',
    responseTransform: 'anthropic',
  },

  google: {
    name: 'Google AI (Gemini)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    authType: 'query',
    authParam: 'key',
    models: [
      'gemini-2.5-pro', 'gemini-2.5-flash',
      'gemini-2.0-flash', 'gemini-2.0-flash-lite',
      'gemini-1.5-pro', 'gemini-1.5-flash',
    ],
    endpoints: {
      chat: '/models/{model}:generateContent',
      streaming: '/models/{model}:streamGenerateContent',
    },
    features: ['chat', 'streaming', 'function_calling', 'vision', 'embeddings'],
    requestTransform: 'google',
    responseTransform: 'google',
  },

  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'mistral-large-latest', 'mistral-medium-latest',
      'mistral-small-latest', 'open-mistral-nemo',
      'codestral-latest', 'mistral-embed',
    ],
    endpoints: {
      chat: '/chat/completions',
      embeddings: '/embeddings',
    },
    features: ['chat', 'streaming', 'function_calling', 'embeddings'],
  },

  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'llama-3.3-70b-versatile', 'llama-3.1-8b-instant',
      'llama-3.2-90b-vision-preview', 'mixtral-8x7b-32768',
      'gemma2-9b-it',
    ],
    endpoints: {
      chat: '/chat/completions',
    },
    features: ['chat', 'streaming', 'function_calling'],
  },

  cohere: {
    name: 'Cohere',
    baseUrl: 'https://api.cohere.ai/v2',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'command-r-plus', 'command-r', 'command-light',
      'embed-english-v3.0', 'embed-multilingual-v3.0',
    ],
    endpoints: {
      chat: '/chat',
      embeddings: '/embed',
    },
    features: ['chat', 'streaming', 'function_calling', 'embeddings'],
    requestTransform: 'cohere',
    responseTransform: 'cohere',
  },

  together: {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'mistralai/Mixtral-8x22B-Instruct-v0.1',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
    ],
    endpoints: {
      chat: '/chat/completions',
      embeddings: '/embeddings',
    },
    features: ['chat', 'streaming', 'function_calling', 'embeddings'],
  },

  fireworks: {
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'accounts/fireworks/models/llama-v3p1-405b-instruct',
      'accounts/fireworks/models/llama-v3p1-70b-instruct',
      'accounts/fireworks/models/mixtral-8x22b-instruct',
    ],
    endpoints: {
      chat: '/chat/completions',
    },
    features: ['chat', 'streaming', 'function_calling'],
  },

  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'deepseek-chat', 'deepseek-coder', 'deepseek-reasoner',
    ],
    endpoints: {
      chat: '/chat/completions',
    },
    features: ['chat', 'streaming', 'function_calling'],
  },

  perplexity: {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [
      'sonar-pro', 'sonar', 'sonar-reasoning-pro', 'sonar-reasoning',
    ],
    endpoints: {
      chat: '/chat/completions',
    },
    features: ['chat', 'streaming'],
  },

  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: ['auto'],
    endpoints: {
      chat: '/chat/completions',
    },
    features: ['chat', 'streaming', 'function_calling'],
    dynamicModels: true,
  },

  custom: {
    name: 'Custom / Self-Hosted',
    baseUrl: '',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: [],
    endpoints: {
      chat: '/chat/completions',
    },
    features: ['chat', 'streaming'],
    allowCustomBaseUrl: true,
  },
};

export const SUPPORTED_PROVIDERS = Object.keys(PROVIDER_CONFIGS);

export function getProviderConfig(providerId) {
  return PROVIDER_CONFIGS[providerId] || null;
}

export function listProviders() {
  return Object.entries(PROVIDER_CONFIGS).map(([id, config]) => ({
    id,
    name: config.name,
    models: config.models,
    features: config.features,
    allowCustomBaseUrl: config.allowCustomBaseUrl || false,
  }));
}
