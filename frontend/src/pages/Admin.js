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

    const API_URL = 'https://kainchi-stay-production.up.railway.app';

    const fetchData = async () => {
        try {
            const roomRes = await axios.get(`${API_URL}/api/rooms`);
            // Handling array vs object response
            const roomData = Array.isArray(roomRes.data) ? roomRes.data[0] : roomRes.data;
            setRoom(roomData);
            
            const bookingRes = await axios.get(`${API_URL}/api/bookings/all`);
            setBookings(bookingRes.data);
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Necessary Change: Reliable password fallback
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

    const handleDeleteInquiry = async (id) => {
        if (window.confirm("Are you sure you want to delete this inquiry?")) {
            try {
                await axios.delete(`${API_URL}/api/bookings/${id}`);
                setMessage("✅ Inquiry deleted successfully!");
                fetchData();
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
            <div style={{ height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf9f6', padding: '20px' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
                    <Lock size={40} color="#5d6d5e" style={{ marginBottom: '20px' }} />
                    <form onSubmit={handleLogin}>
                        <input type="password" placeholder="Admin Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#5d6d5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '100px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><LayoutDashboard /> Admin</h1>
                <button onClick={() => setIsAuthenticated(false)} style={{ border: 'none', background: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><LogOut size={18} /> Exit</button>
            </div>

            <div className="glass-card" style={{ marginBottom: '25px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Price & Description</h3>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Nightly Rate (₹)</label>
                <input type="number" value={room?.price || ''} onChange={(e) => setRoom({...room, price: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description</label>
                <textarea rows="4" value={room?.description || ''} onChange={(e) => setRoom({...room, description: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                
                <button onClick={handleUpdate} style={{ width: '100%', padding: '12px', backgroundColor: '#5d6d5e', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer' }}>Save Details</button>
            </div>

            <div className="glass-card" style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Gallery</h3>
                    <button onClick={handleClearGallery} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                        <Trash2 size={16} /> Clear
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '15px', padding: '5px' }}>
                    {room?.images?.map((img, i) => <img key={i} src={img} alt="room" style={{ width: '80px', height: '80px', flexShrink: 0, borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee' }} />)}
                </div>
                <div style={{ padding: '20px', border: '1px dashed #ccc', borderRadius: '12px', textAlign: 'center' }}>
                    <input type="file" multiple onChange={handleImageUpload} style={{ fontSize: '0.85rem', width: '100%' }} />
                    {uploading && <p style={{ marginTop: '10px' }}><Loader2 className="animate-spin" size={16} /> Uploading...</p>}
                </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '25px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><PhoneCall size={20} /> Inquiries</h3>
                {/* Necessary Change: Added Mobile Scroll for Table */}
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                                <th style={{ padding: '12px' }}>Customer</th>
                                <th style={{ padding: '12px' }}>Dates</th>
                                <th style={{ padding: '12px' }}>Stay Info</th>
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
                                        {b.checkInDate} to {b.checkOutDate}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        {b.roomsRequired}R | {b.guests}G
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <button onClick={() => handleDeleteInquiry(b._id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No inquiries.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card">
                <h3><Key size={18} /> Security</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <input type="text" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} style={{ flex: '1 1 200px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <button onClick={() => handleUpdate(null, { adminPassword: newPassword })} style={{ flex: '1 1 100px', padding: '12px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Update</button>
                </div>
            </div>

            {message && <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#27ae60', color: 'white', padding: '12px 30px', borderRadius: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 10000 }}>{message}</div>}
        </div>
    );
};

export default Admin;
