import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { donorAPI } from '../services/api';
import DonorCard from '../components/DonorCard';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchDonor = () => {
  const location = useLocation();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ bloodGroup: '', city: '', availableOnly: false });

  // Support ?bloodGroup=O+ from Home page quick links
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bg = params.get('bloodGroup');
    if (bg) {
      setFilters((f) => ({ ...f, bloodGroup: bg }));
      handleSearchWithFilters({ bloodGroup: bg, city: '', availableOnly: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchWithFilters = async (f) => {
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (f.bloodGroup) params.bloodGroup = f.bloodGroup;
      if (f.city) params.city = f.city;
      if (f.availableOnly) params.availableOnly = true;
      const { data } = await donorAPI.search(params);
      setDonors(data);
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleSearchWithFilters(filters);
  };

  const clearFilters = () => {
    setFilters({ bloodGroup: '', city: '', availableOnly: false });
    setDonors([]);
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-slate-800">Find Blood Donors</h1>
          <p className="text-slate-500 text-sm mt-1">Search by blood group and city to find available donors near you</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Blood Group</label>
              <select
                value={filters.bloodGroup}
                onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                className="input-field"
              >
                <option value="">All Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="input-field"
                placeholder="e.g. Delhi, Mumbai"
              />
            </div>

            {/* Available only toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Availability</label>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, availableOnly: !filters.availableOnly })}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  filters.availableOnly
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>Available only</span>
                <div className={`w-9 h-5 rounded-full transition-colors relative ${filters.availableOnly ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.availableOnly ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </div>
              </button>
            </div>

            {/* Search button */}
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                Search
              </button>
              {searched && (
                <button type="button" onClick={clearFilters} className="btn-secondary px-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Active filters */}
          {(filters.bloodGroup || filters.city || filters.availableOnly) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium self-center">Active filters:</span>
              {filters.bloodGroup && (
                <span className="badge bg-red-50 text-red-700 border border-red-200">
                  Blood: {filters.bloodGroup}
                </span>
              )}
              {filters.city && (
                <span className="badge bg-blue-50 text-blue-700 border border-blue-200">
                  City: {filters.city}
                </span>
              )}
              {filters.availableOnly && (
                <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Available only
                </span>
              )}
            </div>
          )}
        </form>

        {/* Quick blood group selector */}
        {!searched && (
          <div className="mb-8">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick search by blood group</p>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => {
                    setFilters({ ...filters, bloodGroup: bg });
                    handleSearchWithFilters({ ...filters, bloodGroup: bg });
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Searching donors...</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-medium text-slate-600">
                {donors.length > 0
                  ? <><span className="text-slate-900 font-bold">{donors.length}</span> donor{donors.length !== 1 ? 's' : ''} found</>
                  : 'No donors found for your search'
                }
              </p>
              {donors.length > 0 && (
                <span className="text-xs text-slate-400">{donors.filter(d => d.available).length} available now</span>
              )}
            </div>

            {donors.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">No donors found</h3>
                <p className="text-slate-400 text-sm">Try a different blood group or city, or remove the availability filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {donors.map((donor) => (
                  <div key={donor.id} className="fade-in-up">
                    <DonorCard donor={donor} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !searched && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">Search for donors</h3>
            <p className="text-slate-400 text-sm">Select a blood group or enter a city to find available donors.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonor;
