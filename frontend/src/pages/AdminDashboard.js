import React, { useState, useEffect } from 'react';
import { adminAPI, requestAPI } from '../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, color, subtext }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-extrabold text-slate-800 mt-1">{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

const URGENCY_COLORS = {
  CRITICAL: 'bg-red-600 text-white',
  HIGH:     'bg-red-100 text-red-700',
  MEDIUM:   'bg-orange-100 text-orange-700',
  LOW:      'bg-amber-100 text-amber-700',
};

const STATUS_COLORS = {
  ACTIVE:    'bg-emerald-100 text-emerald-700',
  FULFILLED: 'bg-blue-100 text-blue-700',
  CLOSED:    'bg-slate-100 text-slate-500',
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAllRequests(),
      ]);
      setUsers(usersRes.data);
      setRequests(requestsRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const { data } = await adminAPI.toggleBlock(id);
      setUsers(users.map((u) => (u.id === id ? data : u)));
      toast.success(`User ${data.blocked ? 'blocked' : 'unblocked'}`);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      const { data } = await requestAPI.update(id, { status });
      setRequests(requests.map((r) => (r.id === id ? data : r)));
      toast.success(`Request marked as ${status.toLowerCase()}`);
    } catch {
      toast.error('Failed to update request');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests = requests.filter((r) =>
    r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase()) ||
    r.bloodGroup?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm">Manage users and emergency requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={users.length}
            subtext={`${users.filter(u => u.role === 'ADMIN').length} admins`}
            color="bg-blue-50"
            icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <StatCard
            label="Blocked Users"
            value={users.filter(u => u.blocked).length}
            color="bg-red-50"
            icon={<svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
          />
          <StatCard
            label="Total Requests"
            value={requests.length}
            color="bg-orange-50"
            icon={<svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          />
          <StatCard
            label="Active Requests"
            value={requests.filter(r => r.status === 'ACTIVE').length}
            subtext={`${requests.filter(r => r.urgency === 'CRITICAL').length} critical`}
            color="bg-emerald-50"
            icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {[
              { key: 'users', label: 'Users', count: users.length },
              { key: 'requests', label: 'Requests', count: requests.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSearch(''); }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-slate-400' : 'text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === 'users' ? 'Search users...' : 'Search requests...'}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">No users found</td></tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${user.blocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.blocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleBlock(user.id)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                              user.blocked
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            }`}
                          >
                            {user.blocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Table */}
        {activeTab === 'requests' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Patient', 'Blood', 'Hospital / City', 'Urgency', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredRequests.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">No requests found</td></tr>
                  ) : filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-800">{req.patientName}</td>
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-red-600 text-base">{req.bloodGroup}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-700 font-medium">{req.hospitalName}</div>
                        <div className="text-slate-400 text-xs">{req.city}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${URGENCY_COLORS[req.urgency] || 'bg-slate-100 text-slate-600'}`}>
                          {req.urgency}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge text-xs ${STATUS_COLORS[req.status] || 'bg-slate-100 text-slate-600'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        {req.status === 'ACTIVE' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleUpdateRequestStatus(req.id, 'FULFILLED')}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
                            >
                              Fulfilled
                            </button>
                            <button
                              onClick={() => handleUpdateRequestStatus(req.id, 'CLOSED')}
                              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors"
                            >
                              Close
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
