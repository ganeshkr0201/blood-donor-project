import React, { useState, useEffect } from 'react';
import { requestAPI } from '../services/api';
import EmergencyCard from '../components/EmergencyCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = [
  { value: 'LOW',      label: 'Low',      desc: 'Within a few days',   color: 'text-amber-600' },
  { value: 'MEDIUM',   label: 'Medium',   desc: 'Within 24 hours',     color: 'text-orange-600' },
  { value: 'HIGH',     label: 'High',     desc: 'Within a few hours',  color: 'text-red-600' },
  { value: 'CRITICAL', label: 'Critical', desc: 'Immediately needed',  color: 'text-red-700' },
];

const EMPTY_FORM = { patientName: '', bloodGroup: '', hospitalName: '', city: '', urgency: 'HIGH', contactInfo: '' };

const EmergencyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await requestAPI.getActive();
      setRequests(data);
    } catch {
      toast.error('Failed to load emergency requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await requestAPI.create(form);
      setRequests([data, ...requests]);
      setShowForm(false);
      setForm(EMPTY_FORM);
      toast.success('Emergency request posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Mark this request as completed and remove it?')) return;
    try {
      await requestAPI.delete(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success('Request removed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete request');
    }
  };

  const filtered = filterUrgency === 'ALL'
    ? requests
    : requests.filter((r) => r.urgency === filterUrgency);

  const criticalCount = requests.filter((r) => r.urgency === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">Emergency Requests</h1>
                {criticalCount > 0 && (
                  <span className="badge bg-red-600 text-white text-xs animate-pulse">
                    {criticalCount} Critical
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm">Active blood requests needing urgent help</p>
            </div>
            {isAuthenticated() ? (
              <button
                onClick={() => setShowForm(!showForm)}
                className={showForm ? 'btn-secondary' : 'btn-primary'}
              >
                {showForm ? 'Cancel' : '+ New Request'}
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Sign in to post
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Request Form */}
        {showForm && (
          <div className="card p-6 mb-8 fade-in-up border-l-4 border-red-500">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              Post Emergency Request
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Patient Name *</label>
                  <input type="text" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} required className="input-field" placeholder="Full name of patient" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Blood Group Needed *</label>
                  <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} required className="input-field">
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Hospital Name *</label>
                  <input type="text" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} required className="input-field" placeholder="Hospital or clinic name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">City *</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="input-field" placeholder="City name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Contact Info *</label>
                  <input type="text" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} required className="input-field" placeholder="Phone number or email" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Urgency Level *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {URGENCY_LEVELS.map((u) => (
                      <button
                        key={u.value}
                        type="button"
                        onClick={() => setForm({ ...form, urgency: u.value })}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          form.urgency === u.value
                            ? 'border-red-400 bg-red-50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className={`text-xs font-bold ${form.urgency === u.value ? 'text-red-600' : 'text-slate-700'}`}>{u.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{u.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                  {submitting ? (
                    <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Posting...</>
                  ) : 'Post Emergency Request'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Urgency filter tabs */}
        {!loading && requests.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((u) => {
              const count = u === 'ALL' ? requests.length : requests.filter(r => r.urgency === u).length;
              return (
                <button
                  key={u}
                  onClick={() => setFilterUrgency(u)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    filterUrgency === u
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {u === 'ALL' ? 'All' : u.charAt(0) + u.slice(1).toLowerCase()}
                  <span className={`ml-1.5 text-xs ${filterUrgency === u ? 'text-slate-300' : 'text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading requests...</p>
          </div>
        )}

        {/* Requests list */}
        {!loading && filtered.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">
              {requests.length === 0 ? 'No active requests' : 'No requests in this category'}
            </h3>
            <p className="text-slate-400 text-sm">
              {requests.length === 0
                ? 'There are no active emergency requests right now.'
                : 'Try selecting a different urgency level.'}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div key={req.id} className="fade-in-up">
                <EmergencyCard
                  request={req}
                  onDelete={isAuthenticated() ? handleDelete : null}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyRequest;
