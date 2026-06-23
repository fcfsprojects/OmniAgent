import { Router } from 'express';
import { listProviders } from '../providers/index.js';
import { PROVIDER_CONFIGS } from '../config/providers.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ providers: listProviders() });
});

router.get('/:providerId', (req, res) => {
  const config = PROVIDER_CONFIGS[req.params.providerId];
  if (!config) {
    return res.status(404).json({ error: `Provider '${req.params.providerId}' not found` });
  }
  res.json({
    id: req.params.providerId,
    name: config.name,
    models: config.models,
    features: config.features,
    endpoints: Object.keys(config.endpoints),
    allowCustomBaseUrl: config.allowCustomBaseUrl || false,
  });
});

router.get('/:providerId/models', (req, res) => {
  const config = PROVIDER_CONFIGS[req.params.providerId];
  if (!config) {
    return res.status(404).json({ error: `Provider '${req.params.providerId}' not found` });
  }
  res.json({ models: config.models });
});

export default router;
