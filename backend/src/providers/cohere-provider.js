import { BaseProvider } from './base-provider.js';

export class CohereProvider extends BaseProvider {
  constructor(config) {
    super(config);
  }

  transformRequest(messages, options) {
    return {
      model: options.model,
      messages: messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
        content: typeof m.content === 'string' ? m.content : m.content.map(b => b.text || '').join(''),
      })),
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.7,
      p: options.topP ?? 1,
      stream: options.stream || false,
    };
  }

  transformResponse(data) {
    return {
      id: data.id || `cohere-${Date.now()}`,
      provider: this.name,
      model: data.model || 'command-r',
      content: data.message?.content?.[0]?.text || data.text || '',
      role: 'assistant',
      tool_calls: null,
      finish_reason: data.finish_reason || 'stop',
      usage: data.meta?.tokens
        ? {
          prompt_tokens: data.meta.tokens.input_tokens,
          completion_tokens: data.meta.tokens.output_tokens,
          total_tokens: (data.meta.tokens.input_tokens || 0) + (data.meta.tokens.output_tokens || 0),
        }
        : null,
    };
  }
}
