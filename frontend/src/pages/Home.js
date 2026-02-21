/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Bed, Wifi, MapPin, MessageCircle, Info, Navigation, Image as ImageIcon, PhoneCall, X, Calendar} from 'lucide-react';

// Assets
import ashramImg from '../assets/ashram.png';
import babaImg from '../assets/baba.jpg';

const Home = () => {
    const [room, setRoom] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showWaCalendar, setShowWaCalendar] = useState(false); // New state for WA calendar
    const [error, setError] = useState(false);
    const [bookingData, setBookingData] = useState({ 
        customerName: '', 
        countryCode: '+91',
        phoneNumber: '', 
        checkInDate: '', 
        checkOutDate: '', 
        roomsRequired: 1, 
        guests: 1, 
        requirements: '' 
    });
    const whatsappNumber = "917830410814"; 
    const BACKEND_URL = 'https://kainchi-stay-production.up.railway.app';

    // Get today's date in YYYY-MM-DD format for date validation
    const today = new Date().toISOString().split('T')[0];

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/rooms`);
            if (res.data) {
                setRoom(res.data);
            }
        } catch (err) {
            console.error("Connectivity Error:", err);
            setError(true);
        }
    }, [BACKEND_URL]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const validateIndianPhone = (num) => {
        const regex = /^[6-9]\d{9}$/; 
        return regex.test(num);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        
        if (bookingData.countryCode === '+91' && !validateIndianPhone(bookingData.phoneNumber)) {
            alert("Please enter a valid 10-digit Indian mobile number.");
            return;
        }

        const payload = {
            ...bookingData,
            phoneNumber: `${bookingData.countryCode}${bookingData.phoneNumber}`
        };

        try {
            await axios.post(`${BACKEND_URL}/api/bookings/request-call`, payload);
            alert("Jai Maharaj-ji! Your request is sent. We will call you soon.");
            setShowForm(false);
            setBookingData({ customerName: '', countryCode: '+91', phoneNumber: '', checkInDate: '', checkOutDate: '', roomsRequired: 1, guests: 1, requirements: '' });
        } catch (err) {
            alert("Submission failed. Please check your connection or use WhatsApp.");
        }
    };

    // New function to handle the tailored WhatsApp message
    const handleWhatsAppClick = () => {
        if (!bookingData.checkInDate || !bookingData.checkOutDate) {
            alert("Please select dates first to send a tailored inquiry.");
            return;
        }
        const message = `Jai Neem Karoli Baba! \nI am interested in a stay. I need a stay from ${bookingData.checkInDate} to ${bookingData.checkOutDate}.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        setShowWaCalendar(false);
    };

    if (error) return (
        <div style={{textAlign: 'center', marginTop: '150px', fontFamily: 'Playfair Display'}}>
            <h2 style={{color: '#e74c3c'}}>Something went wrong</h2>
            <p>Please refresh the page or check your internet.</p>
            <button onClick={() => window.location.reload()} style={{padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: 'none', backgroundColor: '#5d6d5e', color: 'white'}}>Refresh Now</button>
        </div>
    );

    if (!room) return <div style={{textAlign: 'center', marginTop: '150px', fontFamily: 'Playfair Display', fontSize: '1.5rem', color: '#5d6d5e'}}>Peace is loading...</div>;

    return (
        <div style={{ paddingTop: '75px' }}>
            {/* 1. TASKBAR */}
            <nav className="navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
                    <div className="nav-brand">
                        Kainchi Stay
                    </div>
                    
                    <div className="nav-tagline">
                        सबका प्रेम, सबकी सेवा
                    </div>
                </div>

                <div className="nav-links">
                    <button 
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                        className="nav-btn"
                    >
                        Home
                    </button>
                    <a href="#history">History</a>
                    <a href="#rooms">Rooms</a>
                    <a href="#about">About</a>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <div style={{ 
                height: '60vh', 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${ashramImg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center', padding: '0 20px'
            }}>
                <h1 style={{ 
                    fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
                    margin: 0, 
                    fontWeight: '700', 
                    color: '#FFD700', 
                    textShadow: '2px 4px 15px rgba(0,0,0,0.9)' 
                }}>
                    Kainchi Dham Stay
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, marginTop: '10px', textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>In the Divine Presence of Neem Karoli Baba</p>
            </div>

            <div className="container">
                {/* 3. HISTORY SECTION */}
                <section id="history" className="fade-in" style={{ margin: '100px 0' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ flex: '1', minWidth: '280px', maxWidth: '320px' }}>
                            <img src={babaImg} alt="Baba" style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '160px', border: '10px solid white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }} />
                        </div>
                        <div style={{ flex: '1.5', minWidth: '300px', lineHeight: '1.9', color: '#555', fontSize: '1.1rem' }}>
                            <h2 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>The Legend of the Valley</h2>
                            <p>Established in the 1960s by <strong>Neem Karoli Baba</strong>, Kainchi Dham is a spiritual powerhouse that has drawn seekers like <strong>Steve Jobs and Mark Zuckerberg</strong>.</p>
                            <p style={{ marginTop: '15px' }}>The name 'Kainchi' refers to the two hair-pin bends of the road resembling scissors. Surrounded by mountains and the Kosi river, the Ashram offers a vibration of peace that stays forever.</p>
                            <p style={{ marginTop: '15px', color: '#d4a373', fontWeight: '600' }}>"Love everyone, serve everyone, remember God, and tell the truth."</p>
                        </div>
                    </div>
                    <div style={{ width: '60px', height: '2px', backgroundColor: '#d4a373', margin: '60px auto' }}></div>
                </section>

                {/* 4. THE STAY SECTION (Rooms) */}
                <section id="rooms" className="fade-in" style={{ marginBottom: '80px' }}>
                    <h2 style={{ fontSize: '2.2rem', color: '#2c3e50', marginBottom: '10px' }}>Kainchi Dham Stay</h2>
                    <p style={{ color: '#888', marginBottom: '30px' }}>Discover the perfect blend of comfort and peace at <strong>Kainchi's</strong> most trusted stay.</p>

                    <div className="gallery-scroll">
                        {room.images && room.images.length > 0 ? (
                            room.images.map((img, idx) => (
                                <div key={idx} style={{ flexShrink: 0, width: '320px', height: '420px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.1)', scrollSnapAlign: 'start' }}>
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Room View" />
                                </div>
                            ))
                        ) : (
                            <div style={{ width: '100%', height: '300px', backgroundColor: '#eee', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                                <ImageIcon size={40} /> <span style={{ marginLeft: '10px' }}>Images will be updated by the owner soon</span>
                            </div>
                        )}
                    </div>

                    <div className="glass-card" style={{ marginTop: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ margin: 0, color: '#2c3e50' }}>{room.name}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#d4a373', fontSize: '1rem', gap: '6px', marginTop: '5px', fontWeight: '600' }}>
                                    <MapPin size={18} /> 100 Meters from Kainchi Dham Ashram
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '1.8rem', fontWeight: '700', color: '#5d6d5e' }}>₹{room.price}</span>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#95a5a6' }}>per night</p>
                            </div>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '25px 0' }} />

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#34495e' }}>
                            <Info size={20} /> About this space
                        </h3>
                        <p style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '25px' }}>
                            {room.description}
                            <span style={{ display: 'block', marginTop: '10px', color: '#5d6d5e', fontStyle: 'italic' }}>
                                🏔️ Wake up to breathtaking mountain views and the sound of the nearby stream.
                            </span>
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', margin: '30px 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444' }}><Wifi size={20} color="#5d6d5e"/> Free WiFi</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444' }}><Bed size={20} color="#5d6d5e"/> King Size Bed</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444' }}>♨️ 24/7 Hot Water</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#444' }}>🏔️ Mountain View</div>
                        </div>
                    </div>
                </section>

                {/* 5. ABOUT SECTION */}
                <section id="about" className="fade-in about-section" style={{ textAlign: 'center', padding: '60px 0' }}>
                    <h2 style={{ fontSize: '2.2rem', color: '#2c3e50' }}>Our Story</h2>
                    <p style={{ maxWidth: '750px', margin: '20px auto', lineHeight: '1.9', color: '#555' }}>
                        Founded on the belief that a spiritual journey deserves a peaceful ending to the day. Located just 100 meters from the gates of Kainchi Dham, our space was created to serve as a quiet extension of the Ashram experience. We provide a space where the silence of the mountains meets modern comfort.
                    </p>
                </section>

                {/* 6. LOCATION SECTION */}
                <div id="location" style={{ marginBottom: '100px', textAlign: 'center', padding: '40px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '18px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}><Navigation size={22} color="#5d6d5e" /> Find Us</h3>
                    <p style={{ color: '#666' }}>Bhowali-Almora Road, Near Kainchi Dham Ashram.</p>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: '#5d6d5e', fontWeight: 'bold', textDecoration: 'none', borderBottom: '1px solid #5d6d5e' }}>Open in Google Maps →</a>
                </div>
            </div>

            {/* MODAL FORM */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '20px' }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '480px', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>
                        <button onClick={() => setShowForm(false)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2c3e50' }}><PhoneCall /> Booking Inquiry</h3>
                        <form onSubmit={handleBookingSubmit} style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Full Name</label>
                            <input required type="text" placeholder="Your Name" value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Phone Number</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                                <select 
                                    value={bookingData.countryCode} 
                                    onChange={e => setBookingData({...bookingData, countryCode: e.target.value})}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f9f9f9', fontWeight: '500' }}
                                >
                                    <option value="+91">+91 (IN)</option>
                                    <option value="+1">+1 (US)</option>
                                    <option value="+44">+44 (UK)</option>
                                </select>
                                <input 
                                    required 
                                    type="tel" 
                                    placeholder="Mobile Number" 
                                    maxLength="10"
                                    value={bookingData.phoneNumber} 
                                    onChange={e => setBookingData({...bookingData, phoneNumber: e.target.value.replace(/\D/g, '')})} 
                                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} 
                                />
                            </div>
                            
                            {/* RESPONSIVE FLEX CONTAINER FOR DATES */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 180px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Check-in</label>
                                    <input required type="date" min={today} value={bookingData.checkInDate} onChange={e => setBookingData({...bookingData, checkInDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: '1 1 180px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Check-out</label>
                                    <input required type="date" min={bookingData.checkInDate || today} value={bookingData.checkOutDate} onChange={e => setBookingData({...bookingData, checkOutDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            {/* RESPONSIVE FLEX CONTAINER FOR ROOMS/GUESTS */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 180px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Rooms Required</label>
                                    <input type="number" min="1" value={bookingData.roomsRequired} onChange={e => setBookingData({...bookingData, roomsRequired: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: '1 1 180px' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#666' }}>Total Guests</label>
                                    <input type="number" min="1" value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            <textarea placeholder="Any special requirements?" value={bookingData.requirements} onChange={e => setBookingData({...bookingData, requirements: e.target.value})} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }} rows="2" />
                            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#5d6d5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Submit Request</button>
                        </form>
                    </div>
                </div>
            )}

            <footer style={{ textAlign: 'center', padding: '60px 0', background: 'white', borderTop: '1px solid #eee', color: '#888' }}>
                <p style={{ fontFamily: 'Playfair Display', fontSize: '1.2rem' }}>Kainchi Dham Stay</p>
                <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>© 2026 • Jai Maharaj-ji</p>
            </footer>

            {/* FLOATING ACTION STACK */}
            <div style={{ position: 'fixed', bottom: '30px', right: '30px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 3000, alignItems: 'flex-end' }}>
                
                {/* NEW: WHATSAPP DATE PICKER POPUP */}
                {showWaCalendar && (
                    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '220px', border: '1px solid #eee', marginBottom: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#25D366' }}>Select Dates</span>
                            <X size={14} style={{ cursor: 'pointer' }} onClick={() => setShowWaCalendar(false)} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input type="date" min={today} value={bookingData.checkInDate} onChange={e => setBookingData({...bookingData, checkInDate: e.target.value})} style={{ fontSize: '0.8rem', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }} />
                            <input type="date" min={bookingData.checkInDate || today} value={bookingData.checkOutDate} onChange={e => setBookingData({...bookingData, checkOutDate: e.target.value})} style={{ fontSize: '0.8rem', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }} />
                            <button onClick={handleWhatsAppClick} style={{ backgroundColor: '#25D366', color: 'white', border: 'none', padding: '8px', borderRadius: '5px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Send Message</button>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => setShowForm(true)}
                    style={{ 
                        backgroundColor: '#5d6d5e', 
                        color: 'white', 
                        padding: '12px 20px', 
                        borderRadius: '50px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}>
                    <PhoneCall size={22} />
                    <span>Request Call</span>
                </button>

                <button 
                    onClick={() => setShowWaCalendar(!showWaCalendar)}
                    style={{ 
                       backgroundColor: '#25D366', 
                       color: 'white', 
                       padding: '12px 20px', 
                       borderRadius: '50px', 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: '10px', 
                       boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)', 
                       border: 'none',
                       cursor: 'pointer',
                       fontWeight: '600'
                    }}>
                    <MessageCircle size={22} />
                    <span>WhatsApp</span>
                </button>
            </div>
        </div>
    );
};

export default Home;