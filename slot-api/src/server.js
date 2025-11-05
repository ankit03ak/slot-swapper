import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import swapRoutes from './routes/swap.routes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));

// TEST
// app.get('/', (req,res) => {
//     res.send("India Jeet Gyi :)");
// })

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes); 

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;


connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
});
