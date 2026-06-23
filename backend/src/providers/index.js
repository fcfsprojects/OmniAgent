import { PROVIDER_CONFIGS, getProviderConfig, listProviders } from '../config/providers.js';
import { BaseProvider, ProviderError } from './base-provider.js';
import { AnthropicProvider } from './anthropic-provider.js';
import { GoogleProvider } from './google-provider.js';
import { CohereProvider } from './cohere-provider.js';

const PROVIDER_CLASSES = {
  anthropic: AnthropicProvider,
  google: GoogleProvider,
  cohere: CohereProvider,
};

export function createProvider(providerId, apiKey, customBaseUrl) {
  const config = getProviderConfig(providerId);
  if (!config) {
    throw new ProviderError(`Unknown provider: ${providerId}`, 400, providerId);
  }

  if (customBaseUrl && config.allowCustomBaseUrl) {
    config.baseUrl = customBaseUrl;
  }

  const ProviderClass = PROVIDER_CLASSES[providerId] || BaseProvider;
  const provider = new ProviderClass(config);
  provider.setApiKey(apiKey);
  return provider;
}

export { listProviders, ProviderError };
