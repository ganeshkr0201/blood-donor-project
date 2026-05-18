import React, { useState, useEffect } from 'react';
import { donorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value}</p>
    </div>
  </div>
);

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ bloodGroup: '', city: '', phone: '', available: true, lastDonationDate: '' });

  useEffect(() => { fetchDonorProfile(); }, []);

  const fetchDonorProfile = async () => {
    try {
      const { data } = await donorAPI.getAll();
      const myDonor = data.find((d) => d.email === user?.email);
      if (myDonor) {
        setDonor(myDonor);
        setForm({
          bloodGroup: myDonor.bloodGroup,
          city: myDonor.city,
          phone: myDonor.phone,
          available: myDonor.available,
          lastDonationDate: myDonor.lastDonationDate || '',
        });
      }
    } catch {
      toast.error('Failed to load donor profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = donor
        ? await donorAPI.update(donor.id, form)
        : await donorAPI.register(form);
      setDonor(data);
      setEditing(false);
      toast.success(donor ? 'Profile updated!' : 'Registered as donor!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async () => {
    if (!donor) return;
    try {
      const { data } = await donorAPI.update(donor.id, { ...form, available: !donor.available });
      setDonor(data);
      setForm((f) => ({ ...f, available: data.available }));
      toast.success(data.available ? 'You are now available to donate' : 'Availability set to unavailable');
    } catch {
      toast.error('Failed to update availability');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{user?.name}</h1>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
            {donor && (
              <div className="ml-auto">
                <span className={`badge text-sm px-3 py-1.5 ${
                  donor.available
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${donor.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {donor.available ? 'Available to donate' : 'Not available'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Donor Profile Card */}
          <div className="lg:col-span-1 space-y-4">
            {donor ? (
              <>
                {/* Blood group hero */}
                <div className="card p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    <span className="text-white font-extrabold text-2xl">{donor.bloodGroup}</span>
                  </div>
                  <h3 className="font-bold text-slate-800">Blood Group</h3>
                  <p className="text-slate-400 text-xs mt-1">Your registered blood type</p>
                </div>

                {/* Quick availability toggle */}
                <div className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Availability</p>
                      <p className="text-xs text-slate-400 mt-0.5">Toggle your donation status</p>
                    </div>
                    <button
                      onClick={toggleAvailability}
                      className={`relative w-12 h-6 rounded-full transition-colors ${donor.available ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${donor.available ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="card p-6 text-center border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Not registered</h3>
                <p className="text-slate-400 text-xs">Fill in the form to register as a donor</p>
              </div>
            )}
          </div>

          {/* Right — Details / Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between p-6 border-b border-slate-50">
                <h2 className="font-bold text-slate-800">
                  {editing || !donor ? 'Donor Profile' : 'Your Details'}
                </h2>
                {donor && !editing && (
                  <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2 px-4">
                    Edit Profile
                  </button>
                )}
              </div>

              {/* View mode */}
              {donor && !editing ? (
                <div className="p-6">
                  <InfoRow
                    label="Blood Group"
                    value={donor.bloodGroup}
                    icon={<svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>}
                  />
                  <InfoRow
                    label="City"
                    value={donor.city}
                    icon={<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  />
                  <InfoRow
                    label="Phone"
                    value={donor.phone}
                    icon={<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                  />
                  <InfoRow
                    label="Last Donation"
                    value={donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not specified'}
                    icon={<svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                  />
                </div>
              ) : (
                /* Edit / Register form */
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  {!donor && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      You're not registered as a donor yet. Fill in the details below to get started.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Blood Group *</label>
                      <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} required className="input-field">
                        <option value="">Select blood group</option>
                        {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">City *</label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="input-field" placeholder="Your city" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="input-field" placeholder="+91 98765 43210" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Last Donation Date</label>
                      <input type="date" value={form.lastDonationDate} onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })} className="input-field" max={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>

                  {/* Availability toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Available to donate</p>
                      <p className="text-xs text-slate-400 mt-0.5">Donors can contact you when this is on</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, available: !form.available })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${form.available ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.available ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                      {submitting ? (
                        <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                      ) : donor ? 'Save Changes' : 'Register as Donor'}
                    </button>
                    {editing && (
                      <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
