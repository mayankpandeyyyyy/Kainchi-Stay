const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST: Save a new callback request from the website
router.post('/request-call', async (req, res) => {
    try {
        console.log("Incoming Booking:", req.body); 
        const newInquiry = new Booking(req.body);
        await newInquiry.save();
        res.status(201).json({ message: "Request saved successfully" });
    } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch all requests for the Admin Panel
router.get('/all', async (req, res) => {
    try {
        const inquiries = await Booking.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW: DELETE a specific inquiry by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedInquiry = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedInquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }
        res.json({ message: "Inquiry deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;