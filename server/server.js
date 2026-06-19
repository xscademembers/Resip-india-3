const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const couponRoutes = require('./routes/couponRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ─── Security Middleware ────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for React
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Mongo sanitize — prevent NoSQL injection
app.use(mongoSanitize());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting for API routes
app.use('/api', apiLimiter);

// ─── API Routes ─────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

// Newsletter endpoint
const Newsletter = require('./models/Newsletter');
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    
    await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase() },
      { email: email.toLowerCase(), isActive: true, subscribedAt: new Date() },
      { upsert: true }
    );
    
    res.status(200).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ success: true, message: 'Already subscribed!' });
    }
    res.status(500).json({ success: false, message: 'Subscription failed' });
  }
});

// Banner public endpoint
const Banner = require('./models/Banner');
app.get('/api/banners', async (req, res) => {
  try {
    const position = req.query.position || 'hero';
    const banners = await Banner.find({
      position,
      isActive: true,
      $or: [
        { endDate: null },
        { endDate: { $gte: new Date() } },
      ],
    }).sort('sortOrder');
    res.status(200).json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
});

// Settings public endpoint
const Settings = require('./models/Settings');
app.get('/api/settings/public', async (req, res) => {
  try {
    const publicGroups = ['general', 'footer', 'header', 'social', 'seo'];
    const settings = await Settings.find({ group: { $in: publicGroups } });
    const result = settings.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.status(200).json({ success: true, settings: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
});

// ─── Serve Frontend (single server for both dev & production) ───
// In production we serve the pre-built `dist` folder as static files.
// In development we mount Vite in middleware mode so the SAME server
// serves the React app (with HMR) alongside the API — one process, one port.
const isProduction = process.env.NODE_ENV === 'production';

const setupFrontend = async () => {
  const rootPath = path.join(__dirname, '..');

  if (isProduction) {
    const distPath = path.join(rootPath, 'dist');
    app.use(express.static(distPath));
    // SPA fallback: any non-API route returns index.html so client routing works.
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    return;
  }

  // Development: run Vite as Express middleware (provides HMR + serves the SPA).
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    root: rootPath,
    appType: 'spa',
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
};

// ─── Start Server ───────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Mount the frontend (Vite in dev / static dist in prod) BEFORE the error handler.
  await setupFrontend();

  // Error handler must be registered last, after all routes & middleware.
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`   App:  http://localhost:${PORT}`);
    console.log(`   API:  http://localhost:${PORT}/api\n`);
  });

  // Connect to MongoDB after the server is listening so the site still loads
  // even if the database is unreachable (e.g. IP not yet whitelisted in dev).
  await connectDB();

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
      console.error('❌ Forced shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
