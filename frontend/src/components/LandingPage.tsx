import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">Discover Your Next Adventure</h1>
          <p className="hero-subtitle">Explore beautiful destinations and plan your dream vacation with us.</p>
          <Link to="/register" className="cta-button">Get Started</Link>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-container">
          <div className="feature">
            <h3>Top Destinations</h3>
            <p>Browse through our curated list of top travel destinations worldwide.</p>
          </div>
          <div className="feature">
            <h3>Exclusive Deals</h3>
            <p>Access exclusive vacation packages that you won’t find anywhere else.</p>
          </div>
          <div className="feature">
            <h3>Easy Booking</h3>
            <p>Book your vacation effortlessly with our user-friendly platform.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2024 NaorBonomo.com. All rights reserved.</p>
        <p><Link to="/login">Already have an account? Log in here</Link></p>
      </footer>
    </div>
  );
};

export default LandingPage;
