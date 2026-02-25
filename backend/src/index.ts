import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Sécurité ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);

// ─── Parsing ──────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', router);

// ─── Santé ────────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ─── Gestionnaire d'erreurs ───────────────────────────────────────────────────
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`🚀 ScolarPro API démarrée sur le port ${config.PORT}`);
  console.log(`📡 http://localhost:${config.PORT}/api`);
  console.log(`🌍 Environnement : ${config.NODE_ENV}`);
});

export default app;
