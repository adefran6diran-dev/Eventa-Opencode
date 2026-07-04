import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import { authRouter } from './routes/auth.js';
import { vendorsRouter } from './routes/vendors.js';
import { bookingsRouter } from './routes/bookings.js';
import { reviewsRouter } from './routes/reviews.js';
import { applicationsRouter } from './routes/applications.js';
import { profileRouter } from './routes/profile.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors({ origin: isProd ? false : 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/profile', profileRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In production, serve the built frontend if available
if (isProd) {
  const distPath = join(__dirname, '..', '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    if (existsSync(join(distPath, 'index.html'))) {
      res.sendFile(join(distPath, 'index.html'));
    } else {
      res.status(200).json({ message: 'Eventa API is running' });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Eventa ${isProd ? 'production' : 'dev'} server on http://localhost:${PORT}`);
});
