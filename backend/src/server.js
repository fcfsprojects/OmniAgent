import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SERVER_CONFIG, RATE_LIMIT_CONFIG } from './config/defaults.js';
import { errorHandler } from './middleware/error-handler.js';
import { logger } from './utils/logger.js';
import providersRouter from './routes/providers.js';
import agentsRouter from './routes/agents.js';
import chatRouter from './routes/chat.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: SERVER_CONFIG.corsOrigins }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit(RATE_LIMIT_CONFIG));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    name: 'OmniAgent',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/providers', providersRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/chat', chatRouter);

app.use(errorHandler);

app.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, () => {
  logger.info(`OmniAgent server running on ${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
});
