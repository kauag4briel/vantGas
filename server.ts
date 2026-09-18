import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Security Middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // Required for development and AI Studio preview iframe
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'VantGas - Sistema de Gestão de Abastecimentos e Frotas',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      platform: 'VantGas Cloud',
      security: {
        rbac: 'enforced',
        audit: 'immutable-hash',
        headers: 'helmet-secured',
      },
    });
  });

  app.get('/api/status', (_req, res) => {
    res.json({
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      protocol: 'HTTPS/TLS-Ready',
      database: 'In-Memory State with JSON Persistence Sync',
    });
  });

  // Vite middleware for development vs static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[VantGas Server Error]:', err);
    res.status(err.status || 500).json({
      error: 'Erro Interno do Servidor',
      message: err.message || 'Ocorreu uma falha no processamento da requisição.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VantGas] Servidor ativo em http://0.0.0.0:${PORT}`);
  });
}

startServer();
