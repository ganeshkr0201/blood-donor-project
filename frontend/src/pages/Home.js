import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donorAPI, requestAPI } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const StatCard = ({ value, label, icon, color }) => (
  <div className="card p-6 text-center">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
      {icon}
    </div>
    <div className="text-3xl font-extrabold text-slate-800">{value}</div>
    <div className="text-slate-500 text-sm mt-1">{label}</div>
  </div>
);

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ donors: 0, requests: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [donorsRes, reqRes] = await Promise.all([
          donorAPI.getAll(),
          requestAPI.getActive(),
        ]);
        setStats({ donors: donorsRes.data.length, requests: reqRes.data.length });
      } catch {
        // silently fail — stats are decorative
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Live donor network — find help instantly
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Every Drop of Blood
              <br />
              <span className="text-red-200">Saves a Life</span>
            </h1>
            <p className="text-lg sm:text-xl text-red-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified blood donors in your city within minutes.
              Post emergency requests and get responses fast.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-base hover:bg-red-50 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find a Donor
              </Link>
              <Link
                to="/emergency"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Emergency Request
              </Link>
            </div>
          </div>
        </div>

        {/* Blood group pills */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-white/60 text-sm font-medium mr-2">All blood groups:</span>
            {BLOOD_GROUPS.map((bg) => (
              <Link
                key={bg}
                to={`/search?bloodGroup=${encodeURIComponent(bg)}`}
                className="bg-white/15 hover:bg-white/25 border border-white/20 text-white text-sm font-bold px-3 py-1 rounded-lg transition-colors"
              >
                {bg}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            value={stats.donors > 0 ? `${stats.donors}+` : '—'}
            label="Registered Donors"
            color="bg-red-50"
            icon={<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <StatCard
            value={stats.requests > 0 ? stats.requests : '—'}
            label="Active Requests"
            color="bg-orange-50"
            icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard
            value="8"
            label="Blood Groups"
            color="bg-purple-50"
            icon={<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/></svg>}
          />
          <StatCard
            value="24/7"
            label="Always Available"
            color="bg-emerald-50"
            icon={<svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">How It Works</h2>
            <p className="text-slate-500 mt-2">Three simple steps to save a life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register as Donor',
                desc: 'Create an account and add your blood group, city, and availability. Takes less than 2 minutes.',
                color: 'from-red-500 to-rose-600',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Search Donors',
                desc: 'Filter by blood group and city to find available donors near you instantly.',
                color: 'from-orange-500 to-amber-600',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Post Emergency',
                desc: 'Create an urgent blood request visible to all donors. Get connected within minutes.',
                color: 'from-purple-500 to-violet-600',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="card p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-slate-300 mb-1 tracking-widest">STEP {item.step}</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blood Group Info ───────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Find by Blood Group</h2>
            <p className="text-slate-500 mt-2">Click any blood group to search available donors</p>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {BLOOD_GROUPS.map((bg) => (
              <Link
                key={bg}
                to={`/search?bloodGroup=${encodeURIComponent(bg)}`}
                className="card-hover p-4 text-center group"
              >
                <div className="text-2xl font-extrabold text-red-600 group-hover:text-red-700">{bg}</div>
                <div className="text-xs text-slate-400 mt-1">Search</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {!isAuthenticated() && (
        <section className="py-20 px-4 bg-gradient-to-br from-red-600 to-rose-700 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Make a Difference?</h2>
            <p className="text-red-100 mb-8 text-lg">
              Join our community of donors. Your blood can save up to 3 lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-base hover:bg-red-50 transition-all shadow-lg"
              >
                Register as Donor
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-all"
              >
                Find Donors Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/>
              </svg>
            </div>
            <span className="text-white font-bold">BloodFinder</span>
          </div>
          <p className="text-sm">© 2024 BloodFinder. Saving lives, one donation at a time.</p>
          <div className="flex gap-5 text-sm">
            <Link to="/search" className="hover:text-white transition-colors">Find Donors</Link>
            <Link to="/emergency" className="hover:text-white transition-colors">Emergency</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
