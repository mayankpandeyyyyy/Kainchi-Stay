const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },
    roomsRequired: { type: Number, default: 1 },
    guests: { type: Number, default: 1 },
    requirements: { type: String },
    status: { type: String, default: "New" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);