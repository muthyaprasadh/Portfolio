import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { playDispatchChirp } from '@/lib/sound';

export const ContactDispatchForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Internship / Engineering Opportunity',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    playDispatchChirp();
    setSubmitted(true);

    // Fallback trigger to native mailto for guaranteed delivery
    const subject = encodeURIComponent(`[INQUIRY - ${form.role}] From ${form.name}`);
    const body = encodeURIComponent(
      `Name / Organization: ${form.name}\nEmail: ${form.email}\nInquiry Type: ${form.role}\n\nMessage:\n${form.message}`
    );
    
    // Launch mailto after a tiny delay so the user sees the confirmation stamp
    setTimeout(() => {
      window.location.href = `mailto:muthyakommuru698@gmail.com?subject=${subject}&body=${body}`;
    }, 600);
  };

  return (
    <div className="dispatch-form-card">
      <div className="dispatch-header">
        <span className="dispatch-tag">
          <span className="live-dot" /> SECURE DISPATCH CONSOLE // MIAMI METRO ENCRYPTED
        </span>
        <span className="dispatch-classification">ACCESS: PUBLIC DISPATCH</span>
      </div>

      {submitted ? (
        <div className="dispatch-success-state">
          <div className="dispatch-stamp">
            TRANSMISSION
            <br />
            LOGGED
          </div>
          <CheckCircle2 size={36} className="text-red-500 mb-2" />
          <h3 className="text-xl font-bold uppercase tracking-wider text-white">
            Evidence Dispatch Received
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-4">
            Thank you, {form.name}. Your transmission has been recorded. Direct dispatch opened for verification.
          </p>
          <button
            className="dispatch-reset-btn"
            onClick={() => {
              playDispatchChirp();
              setSubmitted(false);
              setForm({ name: '', email: '', role: 'Internship / Engineering Opportunity', message: '' });
            }}
          >
            DISPATCH ANOTHER TRANSMISSION
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="dispatch-form">
          <div className="form-grid">
            <div className="form-field">
              <label>CODENAME / ORG</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe (Tech Lead)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="dispatch-input"
              />
            </div>

            <div className="form-field">
              <label>RETURN FREQUENCY (EMAIL)</label>
              <input
                type="email"
                required
                placeholder="e.g. recruiter@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="dispatch-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label>MISSION TYPE / INQUIRY CATEGORY</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="dispatch-select"
            >
              <option value="Internship / Engineering Opportunity">Internship / Software Engineering Role</option>
              <option value="Full-Time Engineering Role">Full-Time Engineering Role (2027 Grad)</option>
              <option value="Technical Project Collaboration">Technical Project Collaboration</option>
              <option value="General Engineering Inquiry">General Engineering Inquiry</option>
            </select>
          </div>

          <div className="form-field">
            <label>MISSION BRIEF / TRANSMISSION MESSAGE</label>
            <textarea
              required
              rows={4}
              placeholder="Provide case brief or project requirements..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="dispatch-textarea"
            />
          </div>

          <div className="form-footer">
            <div className="security-notice">
              <ShieldAlert size={13} className="text-red-500" />
              <span>TLS ENCRYPTED DIRECT ROUTING TO MUTHYA PRASADH</span>
            </div>

            <button type="submit" className="dispatch-submit-btn">
              <span>TRANSMIT DISPATCH</span>
              <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
