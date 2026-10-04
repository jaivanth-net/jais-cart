import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jais_cart';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Attempt MongoDB Mongoose Connection (Non-blocking fallback)
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB database successfully!'))
  .catch((err) => console.log('ℹ️ MongoDB connection notice: Using built-in JSON file DataStore persistence engine.', err.message));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', app: "JAI's Cart MERN Backend", timestamp: new Date() });
});

// Serve static React production build for cloud deployment (Express 5 compatible)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  console.log(`🚀 JAI's Cart server running on port ${PORT}`);
});
