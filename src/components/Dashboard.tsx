import React from 'react';
import { useAuth } from '../App';
import { 
  Users, Activity, TrendingUp, Search, 
  Plus, ExternalLink, Copy, Anchor,
  BarChart2, MousePointer2
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { user, status } = useAuth();

  const stats = [
    { label: 'TOTAL LEADS', value: '514', subValue: '+12% today', icon: Anchor },
    { label: 'AVG. CONVERSION', value: '11.2%', subValue: '+0.4%', icon: Activity },
    { label: 'ACTIVE PAGES', value: '8', subValue: 'Steady', icon: MousePointer2 },
    { label: 'AD SPEND ROI', value: '4.2X', subValue: 'High', icon: BarChart2 },
  ];

  const channels = [
    {
      type: 'LANDING PAGE',
      title: 'Spring Sellers — Toronto',
      status: 'ACTIVE',
      metrics: [
        { label: 'LEADS', value: '124' },
        { label: 'CONV. RATE', value: '12.4%' }
      ],
      url: 'a2a-intel.io/c/spring-toro...'
    },
    {
      type: 'IDX SEARCH',
      title: 'Luxury IDX — Malibu',
      status: 'ACTIVE',
      metrics: [
        { label: 'LEADS', value: '89' },
        { label: 'CONV. RATE', value: '8.2%' }
      ],
      url: 'a2a-intel.io/lux/malibu'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-10 pb-20"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-a2a-slate/20 border border-white/5 p-8 rounded-[2rem] hover:bg-a2a-slate/30 transition-all group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] group-hover:text-slate-300 transition-colors">{stat.label}</span>
              <div className="w-10 h-10 rounded-xl bg-a2a-slate/40 flex items-center justify-center text-slate-400 group-hover:text-a2a-gold transition-colors">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-4xl font-black text-white tracking-tighter mb-1">{stat.value}</span>
              <span className="text-[10px] font-black text-a2a-gold/70 lowercase tracking-widest">{stat.subValue}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Section */}
      <div className="bg-a2a-slate/10 border border-white/5 rounded-[2.5rem] p-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Lead Capture Channels</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Inbound Funnel Management</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-a2a-gold text-a2a-navy rounded-2xl text-xs font-black hover:bg-a2a-gold-light transition-all active:scale-95">
            <Plus size={16} strokeWidth={3} />
            Create New Funnel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {channels.map((channel, i) => (
            <div key={i} className="bg-a2a-navy/60 border border-white/5 p-10 rounded-[2rem] group hover:border-a2a-gold/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-a2a-gold tracking-[0.2em]">{channel.type}</span>
                <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-2 py-1 rounded-md tracking-widest">ACTIVE</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-8 tracking-tight">{channel.title}</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {channel.metrics.map((metric, j) => (
                  <div key={j} className="bg-a2a-slate/20 p-6 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-500 mb-2 tracking-widest uppercase">{metric.label}</p>
                    <p className="text-2xl font-black text-a2a-gold-light tracking-tighter">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-a2a-navy p-3 rounded-xl border border-white/5 text-[10px] font-mono text-slate-400 truncate">
                  {channel.url}
                </div>
                <button className="p-3 bg-a2a-slate/40 text-slate-400 rounded-xl hover:text-white hover:bg-a2a-slate/60 transition-all">
                  <Copy size={16} />
                </button>
                <button className="p-3 bg-a2a-slate/40 text-slate-400 rounded-xl hover:text-white hover:bg-a2a-slate/60 transition-all">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
