require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 1. IMPORT ROUTES
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // New route for callbacks

const app = express();

// 2. MIDDLEWARE
// Allow all origins for the deployment phase
app.use(cors()); 
app.use(express.json());

// Logging middleware to track requests in the terminal
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

// 3. REGISTER ROUTES
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes); // Register the callback inquiries route

// 4. HEARTBEAT ROUTE
app.get('/', (req, res) => res.send("Kainchi Dham Stay API is Live!"));

// 5. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Successfully connected to KaichiDham Cluster!"))
    .catch(err => console.error("❌ Connection Error:", err.message));

// 6. START SERVER
// Binding to 0.0.0.0 is essential for Render deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});