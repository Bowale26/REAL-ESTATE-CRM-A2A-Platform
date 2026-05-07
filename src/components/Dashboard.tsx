import React from 'react';
import { useAuth } from '../App';
import { 
  Users, Activity, TrendingUp, Search, 
  Plus, ExternalLink, Copy, Anchor,
  BarChart2, MousePointer2
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { status } = useAuth();

  const stats = [
    { label: 'TOTAL LEADS', value: '514', change: '+12% today', icon: Anchor },
    { label: 'AVG. CONVERSION', value: '11.2%', change: '+0.4%', icon: Activity },
    { label: 'ACTIVE PAGES', value: '8', change: 'Steady', icon: MousePointer2 },
    { label: 'AD SPEND ROI', value: '4.2X', change: 'High', icon: BarChart2 },
  ];

  const channels = [
    {
      title: 'Spring Sellers — Toronto',
      type: 'LANDING PAGE',
      leads: '124',
      convRate: '12.4%',
      url: 'a2a-intel.io/c/spring-toro...',
      active: true
    },
    {
      title: 'Luxury IDX — Malibu',
      type: 'IDX SEARCH',
      leads: '89',
      convRate: '8.2%',
      url: 'a2a-intel.io/lux/malibu',
      active: true
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-a2a-card border border-white/5 p-8 rounded-[2rem] hover:bg-a2a-slate/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
              <div className="w-10 h-10 rounded-xl bg-a2a-slate flex items-center justify-center text-slate-400 group-hover:text-a2a-gold transition-colors">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-1">{stat.value}</h2>
              <p className="text-[10px] font-black text-a2a-gold/70 lowercase tracking-[0.2em]">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Funnel Management Area */}
      <div className="bg-a2a-card/50 border border-white/5 rounded-[3rem] p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Lead Capture Channels</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Inbound Funnel Management</p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-a2a-gold text-a2a-navy rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-a2a-gold-light transition-all active:scale-95 shadow-xl shadow-a2a-gold/10">
            <Plus size={16} strokeWidth={3} />
            Create New Funnel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {channels.map((channel, i) => (
            <div key={i} className="bg-a2a-navy border border-white/5 p-10 rounded-[2.5rem] hover:border-a2a-gold/20 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-a2a-gold tracking-[0.2em]">{channel.type}</span>
                <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-3 py-1 rounded-lg tracking-widest uppercase">Active</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-10 tracking-tight leading-tight">{channel.title}</h4>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-a2a-slate/30 p-8 rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Leads</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{channel.leads}</p>
                </div>
                <div className="bg-a2a-slate/30 p-8 rounded-3xl border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Conv. Rate</p>
                  <p className="text-3xl font-black text-a2a-gold-light tracking-tighter">{channel.convRate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-black/40 px-5 py-4 rounded-xl border border-white/5 text-[10px] font-mono text-slate-400 truncate">
                  {channel.url}
                </div>
                <button className="p-4 bg-a2a-slate/50 text-slate-400 rounded-xl hover:text-white hover:bg-a2a-slate transition-all">
                  <Copy size={18} />
                </button>
                <button className="p-4 bg-a2a-slate/50 text-slate-400 rounded-xl hover:text-white hover:bg-a2a-slate transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
