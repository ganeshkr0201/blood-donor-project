import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donorAPI, requestAPI } from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const StatCard = ({ value, label, icon, color }) => (
  <div className="p-6 text-center card">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
      {icon}
    </div>
    <div className="text-3xl font-extrabold text-slate-800">{value}</div>
    <div className="mt-1 text-sm text-slate-500">{label}</div>
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
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-red-600 via-red-700 to-rose-800">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute rounded-full -top-40 -right-40 w-96 h-96 bg-white/5" />
          <div className="absolute rounded-full -bottom-20 -left-20 w-72 h-72 bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full" />
        </div>

        <div className="relative max-w-6xl px-4 py-24 mx-auto sm:px-6 lg:px-8 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live donor network — find help instantly
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Each Drop of Blood
              <br />
              <span className="text-red-200">Saves a Life</span>
            </h1>
            <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-red-100 sm:text-xl">
              Connect with verified blood donors in your city within minutes.
              Post emergency requests and get responses fast.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-red-600 transition-all bg-white shadow-lg rounded-xl hover:bg-red-50 hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find a Donor
              </Link>
              <Link
                to="/emergency"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all border-2 bg-white/10 backdrop-blur-sm border-white/30 rounded-xl hover:bg-white/20"
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
          <div className="flex flex-wrap items-center justify-center max-w-6xl gap-3 px-4 py-4 mx-auto">
            <span className="mr-2 text-sm font-medium text-white/60">All blood groups:</span>
            {BLOOD_GROUPS.map((bg) => (
              <Link
                key={bg}
                to={`/search?bloodGroup=${encodeURIComponent(bg)}`}
                className="px-3 py-1 text-sm font-bold text-white transition-colors border rounded-lg bg-white/15 hover:bg-white/25 border-white/20"
              >
                {bg}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="grid max-w-5xl grid-cols-2 gap-4 mx-auto md:grid-cols-4">
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
      <section className="px-4 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-800">How It Works</h2>
            <p className="mt-2 text-slate-500">Three simple steps to save a life</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                <div className="p-6 card">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm`}>
                    {item.icon}
                  </div>
                  <div className="mb-1 text-xs font-bold tracking-widest text-slate-300">STEP {item.step}</div>
                  <h3 className="mb-2 text-lg font-bold text-slate-800">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blood Group Info ───────────────────────────────────────────────── */}
      <section className="px-4 py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-800">Find by Blood Group</h2>
            <p className="mt-2 text-slate-500">Click any blood group to search available donors</p>
          </div>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
            {BLOOD_GROUPS.map((bg) => (
              <Link
                key={bg}
                to={`/search?bloodGroup=${encodeURIComponent(bg)}`}
                className="p-4 text-center card-hover group"
              >
                <div className="text-2xl font-extrabold text-red-600 group-hover:text-red-700">{bg}</div>
                <div className="mt-1 text-xs text-slate-400">Search</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      {!isAuthenticated() && (
        <section className="px-4 py-20 text-white bg-gradient-to-br from-red-600 to-rose-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">Ready to Make a Difference?</h2>
            <p className="mb-8 text-lg text-red-100">
              Join our community of donors. Your blood can save up to 3 lives.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-red-600 transition-all bg-white shadow-lg rounded-xl hover:bg-red-50"
              >
                Register as Donor
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all border-2 bg-white/10 border-white/30 rounded-xl hover:bg-white/20"
              >
                Find Donors Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="px-4 py-10 bg-slate-900 text-slate-400">
        <div className="flex flex-col items-center justify-between max-w-6xl gap-4 mx-auto md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-red-600 rounded-lg w-7 h-7">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0C20 10 12 2 12 2z"/>
              </svg>
            </div>
            <span className="font-bold text-white">BloodFinder</span>
          </div>
          <p className="text-sm">© 2024 BloodFinder. Saving lives, one donation at a time.</p>
          <div className="flex gap-5 text-sm">
            <Link to="/search" className="transition-colors hover:text-white">Find Donors</Link>
            <Link to="/emergency" className="transition-colors hover:text-white">Emergency</Link>
            <Link to="/register" className="transition-colors hover:text-white">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
