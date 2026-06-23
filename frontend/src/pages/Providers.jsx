import { useState, useEffect } from 'react';
import { Plug, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';

const PROVIDER_DOCS = {
  openai: 'https://platform.openai.com/api-keys',
  anthropic: 'https://console.anthropic.com/settings/keys',
  google: 'https://aistudio.google.com/app/apikey',
  mistral: 'https://console.mistral.ai/api-keys',
  groq: 'https://console.groq.com/keys',
  cohere: 'https://dashboard.cohere.com/api-keys',
  together: 'https://api.together.xyz/settings/api-keys',
  fireworks: 'https://fireworks.ai/api-keys',
  deepseek: 'https://platform.deepseek.com/api_keys',
  perplexity: 'https://www.perplexity.ai/settings/api',
  openrouter: 'https://openrouter.ai/keys',
};

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProviders().then(res => {
      setProviders(res.providers);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading providers...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supported Providers</h1>
        <p className="text-gray-500 mt-1">{providers.length} AI providers available — bring your own API key</p>
      </div>

      <div className="space-y-3">
        {providers.map(provider => (
          <div key={provider.id} className="card">
            <button
              onClick={() => setExpanded(expanded === provider.id ? null : provider.id)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Plug size={22} className="text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-400">{provider.models.length} models available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {provider.features.slice(0, 4).map(f => (
                    <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
                {expanded === provider.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </button>

            {expanded === provider.id && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Models</h4>
                    <div className="space-y-1">
                      {provider.models.map(m => (
                        <div key={m} className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded">{m}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {provider.features.map(f => (
                        <span key={f} className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full">{f}</span>
                      ))}
                    </div>
                    {PROVIDER_DOCS[provider.id] && (
                      <a
                        href={PROVIDER_DOCS[provider.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink size={14} />
                        Get API Key
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
