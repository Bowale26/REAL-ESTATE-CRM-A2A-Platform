import { useState } from 'react';
import { 
  Globe, 
  DollarSign, 
  Calendar, 
  Map, 
  Shield, 
  Bell, 
  Smartphone, 
  CheckCircle2, 
  Zap,
  RefreshCcw,
  User,
  Mail,
  Key
} from 'lucide-react';
import { motion } from 'motion/react';
import { Currency, DateFormat } from '../../types';

interface SettingsProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  dateFormat: DateFormat;
  setDateFormat: (f: DateFormat) => void;
  onSync: () => void;
}

export default function SettingsPage({ currency, setCurrency, dateFormat, setDateFormat, onSync }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    aiAlerts: true
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    onSync();
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Global System Configuration</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Cross-Border Operations Hub</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-md text-[11px] font-bold text-gold hover:bg-gold/10 transition-all shadow-lg disabled:opacity-50"
        >
          {isSyncing ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
          {isSyncing ? 'Synchronizing State...' : 'Force Global State Sync'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Localization & Region */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest mb-8">
                 <Globe className="w-4 h-4 text-gold" /> Localization & Multi-Market Prefs
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <DollarSign className="w-4 h-4 text-gold" />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">System Currency</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => setCurrency('CAD')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${currency === 'CAD' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         CAD (Canada)
                       </button>
                       <button 
                         onClick={() => setCurrency('USD')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${currency === 'USD' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         USD (United States)
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-light leading-relaxed">Adjusts all dashboards, appraisals, and ROI reports in real-time based on latest conversion rates.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <Calendar className="w-4 h-4 text-gold" />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">Date Format Localization</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => setDateFormat('YYYY-MM-DD')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${dateFormat === 'YYYY-MM-DD' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         YYYY-MM-DD
                       </button>
                       <button 
                         onClick={() => setDateFormat('MM/DD/YYYY')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${dateFormat === 'MM/DD/YYYY' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         MM/DD/YYYY
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-light leading-relaxed">Standardizes transaction dates and scheduling across US and Canadian jurisdiction compliance.</p>
                 </div>
              </div>
           </div>

           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest mb-8">
                 <Bell className="w-4 h-4 text-gold" /> AI Notification Matrix
              </h3>
              
              <div className="space-y-5">
                 <ToggleRow 
                   label="High-Score Seller Alerts" 
                   desc="Instant notification when Predictive Sentiment score exceeds 90%" 
                   enabled={notifications.aiAlerts} 
                   onChange={() => setNotifications(n => ({...n, aiAlerts: !n.aiAlerts}))} 
                 />
                 <ToggleRow 
                   label="Email Intelligence Sync" 
                   desc="Morning briefing of all inbox insights and sequence replies" 
                   enabled={notifications.email} 
                   onChange={() => setNotifications(n => ({...n, email: !n.email}))} 
                 />
                 <ToggleRow 
                   label="Transaction Deadline Push" 
                   desc="Real-time mobile alerts for contingency and closing milestones" 
                   enabled={notifications.push} 
                   onChange={() => setNotifications(n => ({...n, push: !n.push}))} 
                 />
              </div>
           </div>
        </div>

        {/* Sidebar Mini Settings */}
        <div className="space-y-6">
           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-serif text-xl font-bold text-gold">AV</div>
                 <div>
                    <h4 className="text-sm font-bold text-white">Alina Vance</h4>
                    <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest">Executive Principal</p>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <User className="w-3.5 h-3.5 text-slate group-hover:text-gold" />
                    <span className="text-[11px] text-slate-light font-medium group-hover:text-cream">Profile Intelligence</span>
                 </div>
                 <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <Mail className="w-3.5 h-3.5 text-slate group-hover:text-gold" />
                    <span className="text-[11px] text-slate-light font-medium group-hover:text-cream">Alias Management</span>
                 </div>
                 <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <Key className="w-3.5 h-3.5 text-slate group-hover:text-gold" />
                    <span className="text-[11px] text-slate-light font-medium group-hover:text-cream">Security & Keys</span>
                 </div>
              </div>
           </div>

           <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap className="w-20 h-20 text-gold" />
              </div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap className="w-3 h-3 text-gold" /> A2A Neural Sync
              </h4>
              <p className="text-[11px] text-slate-light leading-relaxed mb-4">
                Your multi-agent network is currently processing <strong className="text-gold">12.4M</strong> data points across US and CA markets. 
                Efficiency is optimized for Q2 objectives.
              </p>
              <div className="flex items-center gap-2 text-[9px] font-bold text-green-400 uppercase tracking-widest">
                 <CheckCircle2 className="w-3 h-3" /> All Agents Synchronized
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, enabled, onChange }: { label: string, desc: string, enabled: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-8 p-4 bg-navy/40 border border-white/5 rounded-xl hover:border-gold/20 transition-all group">
       <div className="flex-1">
          <div className="text-xs font-bold text-white group-hover:text-gold transition-colors mb-1">{label}</div>
          <div className="text-[10px] text-slate leading-relaxed">{desc}</div>
       </div>
       <button 
         onClick={onChange}
         className={`w-10 h-5 rounded-full relative transition-all duration-300 ${enabled ? 'bg-gold shadow-[0_0_10px_#C9A84C]' : 'bg-navy border border-white/10'}`}
       >
          <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${enabled ? 'right-1 bg-navy' : 'left-1 bg-slate'}`} />
       </button>
    </div>
  );
}
