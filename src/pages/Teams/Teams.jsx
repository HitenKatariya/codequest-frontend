import React, { useState } from 'react';
import './Teams.css';
import axios from 'axios';

const Teams = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess(''); setError(''); setLoading(true);
    try {
      await axios.post('/api/teams-contact', form);
      setSuccess('Your request has been sent! We will contact you soon.');
      setForm({ name: '', email: '', company: '', message: '' });
    } catch (err) {
      setError('Failed to send request. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="teams-container">
      <div className="teams-hero">
        <h1>For Teams</h1>
        <p className="teams-subtitle">Empower your organization with secure, collaborative Q&A and knowledge sharing.</p>
        <a href="#contact" className="teams-cta">Contact Sales</a>
      </div>
      <div className="teams-features">
        <div className="feature-card">
          <h2>Private Spaces</h2>
          <p>Create secure, private Q&A spaces for your team to share knowledge, solve problems, and collaborate efficiently.</p>
        </div>
        <div className="feature-card">
          <h2>Advanced Permissions</h2>
          <p>Control access and roles for every member. Assign admins, moderators, and contributors with ease.</p>
        </div>
        <div className="feature-card">
          <h2>Analytics & Insights</h2>
          <p>Track engagement, top contributors, and trending topics with powerful analytics dashboards.</p>
        </div>
        <div className="feature-card">
          <h2>Integrations</h2>
          <p>Connect with Slack, Microsoft Teams, GitHub, and more to streamline your team's workflow.</p>
        </div>
      </div>
      <div className="teams-contact" id="contact">
        <h2>Ready to get started?</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
          <input type="text" name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required />
          <textarea name="message" placeholder="How can we help your team?" rows={4} value={form.message} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Request Demo'}</button>
          {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Teams;
