import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface TrialBannerProps {
  daysLeft: number;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ daysLeft }) => {
  const navigate = useNavigate();

  if (daysLeft <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-yellow-400 font-semibold text-sm">
              {daysLeft === 1 ? 'Last day' : `${daysLeft} days left`} in your free trial
            </p>
            <p className="text-yellow-400/70 text-xs">
              Subscribe now to keep full access to all CRM features
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/billing')}
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 text-sm font-bold px-5 py-2 rounded-lg transition-colors shadow-lg shadow-yellow-500/20"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};
