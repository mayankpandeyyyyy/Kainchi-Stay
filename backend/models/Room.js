const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: { type: String, default: "Standard Room" },
    price: { type: Number, required: true, default: 1500 },
    images: [{ type: String }], 
    description: { type: String, default: "Clean and peaceful room near Kainchi Dham" },
    amenities: { type: [String], default: ["WiFi", "Attached Washroom", "Mountain View"] },
    adminPassword: { type: String, default: "kainchi@2026" } // Added here!
});

module.exports = mongoose.model('Room', RoomSchema);