const { upload } = require('../cloudinaryConfig');
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// 1. PUBLIC: Get room details
router.get('/', async (req, res) => {
    try {
        const room = await Room.findOne(); 
        res.json(room || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. ADMIN: Update Price, Description, OR Password
router.put('/', async (req, res) => {
    try {
        const { price, description, adminPassword } = req.body;
        console.log("Update received for:", { price, description });

        const updateData = {};
        if (price !== undefined) updateData.price = Number(price);
        if (description !== undefined) updateData.description = description;
        if (adminPassword) updateData.adminPassword = adminPassword;

        const updatedRoom = await Room.findOneAndUpdate(
            {}, 
            { $set: updateData },
            { new: true, upsert: true } 
        );
        
        res.json({ message: "Update successful!", updatedRoom });
    } catch (err) {
        console.error("PUT Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// 3. ADMIN: Upload Image
router.post('/upload-image', upload.array('images', 5), async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        const updatedRoom = await Room.findOneAndUpdate(
            {},
            { $push: { images: { $each: imageUrls } } }, 
            { new: true, upsert: true }
        );
        res.json({ message: "Success!", updatedRoom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. ADMIN: Clear images
router.delete('/clear-images', async (req, res) => {
    try {
        const updatedRoom = await Room.findOneAndUpdate(
            {},
            { $set: { images: [] } },
            { new: true }
        );
        res.json({ message: "Gallery cleared!", updatedRoom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;