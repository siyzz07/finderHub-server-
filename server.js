import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

dotenv.config();

const app = express();

// Request logger with more details
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
    }
    next();
});

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true
}));

// JSON error handling middleware
app.use(express.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('❌ JSON Parsing Error:', err.message);
        console.error('❌ Malformed Body snapshot:', err.body);
        return res.status(400).json({ 
            message: 'Invalid JSON payload received',
            error: err.message,
            suggestion: 'Please verify your request body is valid JSON.'
        });
    }
    next(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = Number(process.env.PORT) || 5000;

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
