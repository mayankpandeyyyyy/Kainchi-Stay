require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORT ROUTES
// Note: Ensure these paths match your folder structure inside the 'api' folder
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); 

const app = express();

// 2. MIDDLEWARE
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({ 
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
})); 

app.use(express.json());

// 3. DATABASE CONNECTION (Optimized for Serverless)
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    }
};

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// 4. REGISTER ROUTES
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes); 

// 5. HEALTH ROUTES
app.get('/api', (req, res) => res.status(200).send("Kainchi Dham Stay API is Live!"));
app.get('/api/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date() }));


module.exports = app;