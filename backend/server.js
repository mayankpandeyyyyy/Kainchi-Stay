require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORT ROUTES
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 

const app = express();

// 2. MIDDLEWARE
// In production, it's best to specify your frontend URL in .env as FRONTEND_URL
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ 
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
})); 

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} to ${req.url}`);
    next();
});

// 3. REGISTER ROUTES
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes); 

// 4. HEARTBEAT & HEALTH ROUTES
app.get('/', (req, res) => res.status(200).send("Kainchi Dham Stay API is Live!"));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date() }));

// 5. DATABASE CONNECTION
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
        });
        console.log("✅ Successfully connected to MongoDB Cluster!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        // Don't exit the process; let Koyeb retry the health check
    }
};

connectDB();

// 6. START SERVER
// Koyeb requires binding to 0.0.0.0 and using the PORT env variable
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
    console.log(`📡 Accepting requests from: ${allowedOrigin}`);
});

// Handle Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    });
});