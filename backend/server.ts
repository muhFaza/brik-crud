import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

import sequelize from './config/database';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

// limit requests based on environment
const limiter = rateLimit({
  windowMs: (process.env.NODE_ENV === 'development' ? 1 : 15) * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
// }));

// CORS configuration - allow multiple origins for development
const allowedOrigins = [
  'http://localhost:8080',     // Docker frontend
  'http://localhost',     // Docker frontend
  'http://localhost:5173',     // Local Vite dev server
  'http://localhost:3000',     // Local backend
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// test check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

// * all routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Unexpected server error!' });
});

// db conn & server startup
const startServer = async () => {
  try {
    await initializeDatabase();

    console.log('Database initialized.');

    await sequelize.authenticate();

    console.log('Database connection established successfully.');

    // sync db
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

async function initializeDatabase() {
  const dbName = process.env.DB_NAME || 'klontong_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'postgres';
  const dbPort = parseInt(process.env.DB_PORT || '5432');

  // Connect to PostgreSQL without specifying database (connects to 'postgres' database)
  const sequelizeInit = new Sequelize('postgres', dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false
  });

  try {
    // Create database if it doesn't exist
    await sequelizeInit.query(`CREATE DATABASE "${dbName}";`).catch((error) => {
      if (error.message.includes('already exists')) {
        console.log(`✅ Database "${dbName}" already exists`);
      } else {
        console.error('❌ Error creating database:', error.message);
        throw error;
      }
    });

    console.log(`✅ Database "${dbName}" is ready`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await sequelizeInit.close();
  }
}


export default app;