/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Lock, LayoutDashboard, LogOut, CheckCircle, Upload, Trash2, Loader2, Key, PhoneCall, Users, Bed } from 'lucide-react';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginPass, setLoginPass] = useState('');
    const [room, setRoom] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // Updated backend URL
    const API_URL = 'https://kainchi-stay-production.up.railway.app';

    const fetchData = async () => {
        try {
            const roomRes = await axios.get(`${API_URL}/api/rooms`);
            setRoom(roomRes.data);
            
            const bookingRes = await axios.get(`${API_URL}/api/bookings/all`);
            setBookings(bookingRes.data);
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const correctPass = room?.adminPassword || "kainchi@2026";
        if (loginPass === correctPass) {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect Password.");
        }
    };

    const handleUpdate = async (e, customData = null) => {
        if(e) e.preventDefault();
        try {
            const dataToSend = customData || { 
                price: Number(room.price), 
                description: room.description 
            };
            
            await axios.put(`${API_URL}/api/rooms`, dataToSend);
            setMessage("✅ Updated Successfully!");
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage("❌ Update failed.");
        }
    };

    // NEW: Function to delete a specific inquiry
    const handleDeleteInquiry = async (id) => {
        if (window.confirm("Are you sure you want to delete this inquiry?")) {
            try {
                await axios.delete(`${API_URL}/api/bookings/${id}`);
                setMessage("✅ Inquiry deleted successfully!");
                fetchData(); // Refresh the list
                setTimeout(() => setMessage(''), 3000);
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete inquiry.");
            }
        }
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files.length) return;
        
        setUploading(true);
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            await axios.post(`${API_URL}/api/rooms/upload-image`, formData);
            setMessage("✅ Images added!");
            fetchData();
        } catch (err) {
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleClearGallery = async () => {
        if (window.confirm("Are you sure you want to delete ALL photos?")) {
            try {
                await axios.delete(`${API_URL}/api/rooms/clear-images`);
                setMessage("✅ Gallery cleared!");
                fetchData();
            } catch (err) {
                alert("Failed to clear images.");
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!isAuthenticated) {
        return (
            <div style={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf9f6' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
                    <Lock size={40} color="#5d6d5e" style={{ marginBottom: '20px' }} />
                    <form onSubmit={handleLogin}>
                        <input type="password" placeholder="Admin Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#5d6d5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><LayoutDashboard /> Admin Control</h1>
                <button onClick={() => setIsAuthenticated(false)} style={{ border: 'none', background: 'none', color: '#e74c3c', cursor: 'pointer' }}><LogOut size={20} /> Exit</button>
            </div>

            {/* 1. ROOM MANAGEMENT */}
            <div className="glass-card" style={{ marginBottom: '25px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Price & Description</h3>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nightly Rate (₹)</label>
                <input type="number" value={room?.price || ''} onChange={(e) => setRoom({...room, price: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }} />
                
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                <textarea rows="4" value={room?.description || ''} onChange={(e) => setRoom({...room, description: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }} />
                
                <button onClick={handleUpdate} style={{ padding: '12px 25px', backgroundColor: '#5d6d5e', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer' }}>Save Room Details</button>
            </div>

            {/* 2. GALLERY MANAGEMENT */}
            <div className="glass-card" style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Gallery</h3>
                    <button onClick={handleClearGallery} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                        <Trash2 size={16} /> Clear Gallery
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '15px', padding: '5px' }}>
                    {room?.images?.map((img, i) => <img key={i} src={img} alt="room" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }} />)}
                </div>
                <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '12px', textAlign: 'center' }}>
                    <input type="file" multiple onChange={handleImageUpload} style={{ fontSize: '0.85rem' }} />
                    {uploading && <p style={{ marginTop: '10px' }}><Loader2 className="animate-spin" size={16} /> Uploading...</p>}
                </div>
            </div>

            {/* 3. UPDATED CALLBACK REQUESTS TABLE WITH DELETE OPTION */}
            <div className="glass-card" style={{ marginBottom: '25px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><PhoneCall size={20} /> Customer Inquiries</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '12px' }}>Name & Contact</th>
                                <th style={{ padding: '12px' }}>Stay Dates</th>
                                <th style={{ padding: '12px' }}>Info</th>
                                <th style={{ padding: '12px' }}>Notes</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? bookings.map((b) => (
                                <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>
                                        <strong>{b.customerName}</strong><br/>
                                        <a href={`tel:${b.phoneNumber}`} style={{ color: '#5d6d5e', fontWeight: 'bold' }}>{b.phoneNumber}</a>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {b.checkInDate} <br/> to {b.checkOutDate}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Bed size={14}/> {b.roomsRequired} Rooms</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Users size={14}/> {b.guests} Guests</div>
                                    </td>
                                    <td style={{ padding: '12px', color: '#666' }}>{b.requirements}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button 
                                            onClick={() => handleDeleteInquiry(b._id)} 
                                            title="Delete Inquiry"
                                            style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '5px' }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No inquiries yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. SECURITY */}
            <div className="glass-card">
                <h3><Key size={18} /> Admin Security</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Set New Password" onChange={(e) => setNewPassword(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <button onClick={() => handleUpdate(null, { adminPassword: newPassword })} style={{ padding: '12px 25px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Update Password</button>
                </div>
            </div>

            {message && <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#27ae60', color: 'white', padding: '12px 30px', borderRadius: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 10000 }}>{message}</div>}
        </div>
    );
};

export default Admin;