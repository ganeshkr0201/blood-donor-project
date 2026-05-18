import React from 'react';

const BLOOD_GROUP_CONFIG = {
  'A+':  { bg: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-200' },
  'A-':  { bg: 'bg-rose-50',    text: 'text-rose-700',   border: 'border-rose-200' },
  'B+':  { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200' },
  'B-':  { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200' },
  'AB+': { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200' },
  'AB-': { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200' },
  'O+':  { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200' },
  'O-':  { bg: 'bg-emerald-50', text: 'text-emerald-700',border: 'border-emerald-200' },
};

const DonorCard = ({ donor }) => {
  const config = BLOOD_GROUP_CONFIG[donor.bloodGroup] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <div className="card-hover p-5 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {donor.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">{donor.name}</h3>
            <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {donor.city}
            </p>
          </div>
        </div>
        {/* Blood Group Badge */}
        <div className={`${config.bg} ${config.border} border rounded-xl px-3 py-1.5 text-center min-w-[52px]`}>
          <span className={`${config.text} font-extrabold text-base leading-none`}>{donor.bloodGroup}</span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <span className="font-medium">{donor.phone}</span>
        </div>
        {donor.lastDonationDate && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span>Last donated {new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <span className={`badge text-xs ${
          donor.available
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-slate-100 text-slate-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${donor.available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {donor.available ? 'Available' : 'Unavailable'}
        </span>
        {donor.available && (
          <a
            href={`tel:${donor.phone}`}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact
          </a>
        )}
      </div>
    </div>
  );
};

export default DonorCard;
