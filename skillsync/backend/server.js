const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow all in dev/test, restrict in prod via env var
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
// Serve uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/institute', require('./routes/instituteRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '🚀 SkillSync API is running', timestamp: new Date().toISOString() });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 SkillSync server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
