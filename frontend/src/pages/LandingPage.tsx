import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Import the CSS file

// Placeholder for icons (in a real project, use react-icons or SVG imports)
const Icon = ({ name }: { name: string }) => <span className="icon">{name}</span>;

const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            {/* Top Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to="/">Nexify</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/societies" className="nav-link">Explore Societies</Link>
                    <Link to="/events" className="nav-link">Upcoming Events</Link>
                    <Link to="/login" className="nav-link btn btn-secondary">Login</Link>
                    <Link to="/signup" className="nav-link btn btn-primary">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Unleash Your Campus Potential.</h1>
                    <p className="tagline">Nexify is the central hub for your institution's students to find, join, and manage clubs, societies, and campus events effortlessly.</p>
                    <div className="hero-ctas">
                        <Link to="/signup" className="btn btn-primary btn-large">Get Started - Sign Up Today</Link>
                        <Link to="/societies" className="btn btn-secondary btn-large">Explore Societies</Link>
                    </div>
                    <p className="trust-text">Trusted by leading educational institutions.</p>
                </div>
            </section>

            {/* What Nexify Offers Section */}
            <section className="offers-section">
                <h2>What Nexify Offers</h2>
                <div className="offers-grid">
                    <div className="offer-card">
                        <Icon name="🔍" /> {/* Magnifying Glass Icon */}
                        <h3>Discover & Connect</h3>
                        <p>Browse a comprehensive directory of all campus clubs and societies. Find your passion, connect with like-minded peers, and become part of a vibrant community.</p>
                    </div>
                    <div className="offer-card">
                        <Icon name="📅" /> {/* Calendar Icon */}
                        <h3>Never Miss an Event</h3>
                        <p>Access a centralized calendar of all upcoming workshops, meetings, fests, and social gatherings. Register with ease and get reminders.</p>
                    </div>
                    <div className="offer-card">
                        <Icon name="⚙️" /> {/* Gear Icon */}
                        <h3>Seamless Management</h3>
                        <p>Streamline member management, post announcements, and organize events effortlessly with intuitive tools designed for society and club leaders.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section (Optional) */}
            <section className="testimonials-section">
                <h2>Hear From Our Community</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <p>"Nexify made it so easy to find my niche on campus. I joined three amazing clubs because of it!"</p>
                        <p className="testimonial-author">- Jane Doe, Arts Student</p>
                    </div>
                    <div className="testimonial-card">
                        <p>"Managing our society's events used to be a headache. Nexify has transformed how we operate – it's a game-changer for leaders!"</p>
                        <p className="testimonial-author">- John Smith, Robotics Club Leader</p>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="final-cta-section">
                <h2>Ready to Enhance Your Campus Experience?</h2>
                <p>Whether you're looking to join a new community or simplify club management, Nexify is here to help.</p>
                <Link to="/signup" className="btn btn-primary btn-large">Sign Up Now - It's Free!</Link>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Nexify. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                    {/* Add social media links if desired */}
                </div>
            </footer>
        </div>

    );
};

export default LandingPage;