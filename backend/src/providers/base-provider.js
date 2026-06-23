/**
 * Base class for all AI provider adapters.
 * Subclasses implement provider-specific request/response transformations.
 */
export class BaseProvider {
  constructor(config) {
    this.config = config;
    this.name = config.name;
    this.baseUrl = config.baseUrl;
  }

  buildHeaders(apiKey) {
    const headers = { 'Content-Type': 'application/json' };

    if (this.config.authType === 'query') {
      return headers;
    }

    const headerName = this.config.authHeader || 'Authorization';
    const prefix = this.config.authPrefix ?? 'Bearer ';
    headers[headerName] = `${prefix}${apiKey}`;

    if (this.config.extraHeaders) {
      Object.assign(headers, this.config.extraHeaders);
    }

    return headers;
  }

  buildUrl(endpoint, model) {
    let url = `${this.baseUrl}${endpoint}`;
    if (url.includes('{model}')) {
      url = url.replace('{model}', model);
    }
    if (this.config.authType === 'query') {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}${this.config.authParam}=${this._apiKey}`;
    }
    return url;
  }

  setApiKey(apiKey) {
    this._apiKey = apiKey;
  }

  transformRequest(messages, options) {
    return {
      model: options.model,
      messages,
      max_tokens: options.maxTokens || 4096,
      temperature: options.temperature ?? 0.7,
      top_p: options.topP ?? 1,
      stream: options.stream || false,
      ...(options.tools && { tools: options.tools }),
      ...(options.tool_choice && { tool_choice: options.tool_choice }),
    };
  }

  transformResponse(data) {
    return {
      id: data.id,
      provider: this.config.name,
      model: data.model,
      content: data.choices?.[0]?.message?.content || '',
      role: data.choices?.[0]?.message?.role || 'assistant',
      tool_calls: data.choices?.[0]?.message?.tool_calls || null,
      finish_reason: data.choices?.[0]?.finish_reason,
      usage: data.usage || null,
    };
  }

  async chat(messages, options) {
    const endpoint = this.config.endpoints.chat;
    const url = this.buildUrl(endpoint, options.model);
    const headers = this.buildHeaders(this._apiKey);
    const body = this.transformRequest(messages, options);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new ProviderError(
        `${this.name} API error (${response.status}): ${errorBody}`,
        response.status,
        this.name,
      );
    }

    if (options.stream) {
      return response;
    }

    const data = await response.json();
    return this.transformResponse(data);
  }

  async streamChat(messages, options) {
    return this.chat(messages, { ...options, stream: true });
  }
}

export class ProviderError extends Error {
  constructor(message, statusCode, provider) {
    super(message);
    this.name = 'ProviderError';
    this.statusCode = statusCode;
    this.provider = provider;
  }
}
