import React, { useState } from 'react';

const URGENCY_CONFIG = {
  LOW:      { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500',  label: 'Low Priority' },
  MEDIUM:   { bg: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700',dot: 'bg-orange-500', label: 'Medium Priority' },
  HIGH:     { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    badge: 'bg-red-100 text-red-700',      dot: 'bg-red-500',    label: 'High Priority' },
  CRITICAL: { bg: 'bg-red-600',   border: 'border-red-700',   text: 'text-white',      badge: 'bg-red-700 text-white',        dot: 'bg-white',      label: 'CRITICAL' },
};

const EmergencyCard = ({ request, onDelete }) => {
  const cfg = URGENCY_CONFIG[request.urgency] || URGENCY_CONFIG.MEDIUM;
  const isCritical = request.urgency === 'CRITICAL';
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (confirming) {
      onDelete(request.id);
      setConfirming(false);
    } else {
      setConfirming(true);
      // Auto-cancel confirm state after 4 seconds
      setTimeout(() => setConfirming(false), 4000);
    }
  };

  return (
    <div className={`rounded-2xl border-2 ${cfg.bg} ${cfg.border} p-5 ${isCritical ? 'pulse-critical' : ''} transition-all`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge ${cfg.badge} text-xs`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5 ${isCritical ? 'animate-pulse' : ''}`} />
              {cfg.label}
            </span>
          </div>
          <h3 className={`font-bold text-base ${cfg.text} truncate`}>{request.patientName}</h3>
          <p className={`text-sm mt-0.5 ${isCritical ? 'text-red-200' : 'text-slate-500'} flex items-center gap-1`}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {request.hospitalName} · {request.city}
          </p>
        </div>

        {/* Blood Group */}
        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${
          isCritical ? 'bg-red-700' : 'bg-white border border-slate-200'
        } shadow-sm`}>
          <span className={`font-extrabold text-xl leading-none ${isCritical ? 'text-white' : 'text-red-600'}`}>
            {request.bloodGroup}
          </span>
          <span className={`text-xs mt-0.5 ${isCritical ? 'text-red-200' : 'text-slate-400'}`}>needed</span>
        </div>
      </div>

      {/* Contact + actions row */}
      <div className={`mt-4 pt-4 border-t ${isCritical ? 'border-red-500' : 'border-slate-200'} flex items-center justify-between gap-3`}>
        <div className={`flex items-center gap-2 text-sm ${isCritical ? 'text-red-100' : 'text-slate-600'} min-w-0`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="font-semibold truncate">{request.contactInfo}</span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs ${isCritical ? 'text-red-300' : 'text-slate-400'}`}>
            {request.createdAt ? new Date(request.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            }) : ''}
          </span>

          {/* Delete / Mark complete button — only shown to authenticated users */}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              title={confirming ? 'Click again to confirm deletion' : 'Mark as completed & remove'}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                confirming
                  ? 'bg-red-600 text-white shadow-sm scale-105'
                  : isCritical
                    ? 'bg-red-700 text-red-100 hover:bg-red-800'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {confirming ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Done
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;
