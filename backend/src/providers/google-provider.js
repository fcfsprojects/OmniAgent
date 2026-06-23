import { BaseProvider } from './base-provider.js';

export class GoogleProvider extends BaseProvider {
  constructor(config) {
    super(config);
  }

  transformRequest(messages, options) {
    const contents = [];
    let systemInstruction = null;

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = { parts: [{ text: msg.content }] };
        continue;
      }

      const role = msg.role === 'assistant' ? 'model' : 'user';
      if (typeof msg.content === 'string') {
        contents.push({ role, parts: [{ text: msg.content }] });
      } else {
        const parts = msg.content.map(block => {
          if (block.type === 'image_url') {
            return { inlineData: { mimeType: 'image/jpeg', data: block.image_url.url } };
          }
          return { text: block.text || '' };
        });
        contents.push({ role, parts });
      }
    }

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: options.maxTokens || 4096,
        temperature: options.temperature ?? 0.7,
        topP: options.topP ?? 1,
      },
    };

    if (systemInstruction) {
      body.systemInstruction = systemInstruction;
    }

    if (options.tools) {
      body.tools = [{
        functionDeclarations: options.tools.map(t => ({
          name: t.function.name,
          description: t.function.description,
          parameters: t.function.parameters,
        })),
      }];
    }

    return body;
  }

  transformResponse(data) {
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const textParts = parts.filter(p => p.text);
    const funcParts = parts.filter(p => p.functionCall);

    return {
      id: `google-${Date.now()}`,
      provider: this.name,
      model: 'gemini',
      content: textParts.map(p => p.text).join(''),
      role: 'assistant',
      tool_calls: funcParts.length > 0
        ? funcParts.map((p, i) => ({
          id: `call_${i}`,
          type: 'function',
          function: { name: p.functionCall.name, arguments: JSON.stringify(p.functionCall.args) },
        }))
        : null,
      finish_reason: candidate?.finishReason === 'STOP' ? 'stop' : candidate?.finishReason,
      usage: data.usageMetadata
        ? {
          prompt_tokens: data.usageMetadata.promptTokenCount,
          completion_tokens: data.usageMetadata.candidatesTokenCount,
          total_tokens: data.usageMetadata.totalTokenCount,
        }
        : null,
    };
  }
}
