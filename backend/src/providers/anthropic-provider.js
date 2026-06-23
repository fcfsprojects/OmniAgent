import { BaseProvider } from './base-provider.js';

export class AnthropicProvider extends BaseProvider {
  constructor(config) {
    super(config);
  }

  transformRequest(messages, options) {
    const systemMessages = messages.filter(m => m.role === 'system');
    const nonSystemMessages = messages.filter(m => m.role !== 'system');

    const anthropicMessages = nonSystemMessages.map(msg => {
      if (typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }
      const contentBlocks = msg.content.map(block => {
        if (block.type === 'image_url') {
          return {
            type: 'image',
            source: {
              type: 'url',
              url: block.image_url.url,
            },
          };
        }
        return block;
      });
      return { role: msg.role, content: contentBlocks };
    });

    const body = {
      model: options.model,
      messages: anthropicMessages,
      max_tokens: options.maxTokens || 4096,
      stream: options.stream || false,
    };

    if (options.temperature !== undefined) body.temperature = options.temperature;
    if (options.topP !== undefined) body.top_p = options.topP;
    if (systemMessages.length > 0) {
      body.system = systemMessages.map(m => m.content).join('\n');
    }
    if (options.tools) {
      body.tools = options.tools.map(tool => ({
        name: tool.function.name,
        description: tool.function.description,
        input_schema: tool.function.parameters,
      }));
    }

    return body;
  }

  transformResponse(data) {
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    const toolBlocks = (data.content || []).filter(b => b.type === 'tool_use');

    return {
      id: data.id,
      provider: this.name,
      model: data.model,
      content: textBlocks.map(b => b.text).join(''),
      role: 'assistant',
      tool_calls: toolBlocks.length > 0
        ? toolBlocks.map(b => ({
          id: b.id,
          type: 'function',
          function: { name: b.name, arguments: JSON.stringify(b.input) },
        }))
        : null,
      finish_reason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason,
      usage: data.usage
        ? {
          prompt_tokens: data.usage.input_tokens,
          completion_tokens: data.usage.output_tokens,
          total_tokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
        }
        : null,
    };
  }
}
