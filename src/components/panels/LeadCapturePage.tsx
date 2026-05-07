import { useState, ReactNode } from 'react';
import { CaptureChannel } from '../../types';
import { Anchor, Search, Zap, ExternalLink, Plus, Copy, BarChart2, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LeadCapturePageProps {
  channels: CaptureChannel[];
  onCreatePage: () => void;
}

export default function LeadCapturePage({ channels, onCreatePage }: LeadCapturePageProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatsCard label="Total Leads" value="514" trend="+12% today" icon={<MousePointer2 className="w-4 h-4" />} />
         <StatsCard label="Avg. Conversion" value="11.2%" trend="+0.4%" icon={<Zap className="w-4 h-4 text-gold" />} />
         <StatsCard label="Active Pages" value="8" trend="Steady" icon={<Anchor className="w-4 h-4 text-blue-400" />} />
         <StatsCard label="Ad Spend Roi" value="4.2x" trend="High" icon={<BarChart2 className="w-4 h-4 text-green-400" />} />
      </div>

      <div className="bg-navy-mid/60 border border-gold/18 rounded-lg overflow-hidden">
        <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Lead Capture Channels</h3>
            <p className="text-[10px] text-slate mt-1 uppercase tracking-widest font-bold">Inbound funnel performance tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-white/10 rounded text-[10px] font-bold text-slate hover:text-white transition-colors uppercase tracking-widest">
              Performance Audit
            </button>
            <button 
              onClick={onCreatePage}
              className="flex items-center gap-2 px-4 py-2 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> Create New Funnel
            </button>
          </div>
        </div>

        <div className="p-5">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
             {channels.map((channel) => (
               <ChannelCard key={channel.id} channel={channel} />
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-navy-mid/40 border border-gold/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gold/10 rounded border border-gold/20">
                 <Zap className="w-5 h-5 text-gold" />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-white">AI Magic Redirects</h4>
                 <p className="text-xs text-slate">Automatically route leads based on predicted intent score.</p>
               </div>
            </div>
            <button className="text-[10px] font-bold text-gold uppercase hover:underline tracking-widest">Configure Ethics Guard</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <RoutingRule title="High Equity Sellers" route="Dedicated listing agent" status="Active" icon="🏠" />
             <RoutingRule title="First Time Buyers" route="Nurture sequence A" status="Active" icon="🔑" />
             <RoutingRule title="Investors" route="Commercial desk" status="Paused" icon="🏢" />
          </div>
        </div>

        <div className="bg-gold/5 border border-gold/20 rounded-lg p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all" />
           <MousePointer2 className="w-10 h-10 text-gold mb-4 group-hover:scale-110 transition-transform" />
           <h4 className="text-white font-serif font-bold text-lg mb-2">Omnichannel Attribution</h4>
           <p className="text-xs text-slate-light leading-relaxed mb-6">Track lead origin from Instagram, MLS, and Print with 99.4% precision using the A2A Smart Pixel.</p>
           <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-[2px] hover:bg-gold hover:text-navy transition-all">
             View Pixel Stats
           </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: ReactNode }) {
  return (
    <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate uppercase tracking-wider">{label}</span>
        <div className="p-1.5 bg-white/5 rounded-md">{icon}</div>
      </div>
      <div className="text-2xl font-serif text-white font-bold">{value}</div>
      <div className="text-[10px] text-gold mt-1 font-bold">{trend}</div>
    </div>
  );
}

function ChannelCard({ channel }: { channel: CaptureChannel, key?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-navy/40 border border-white/5 rounded-xl p-5 hover:border-gold/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">{channel.type}</div>
          <h4 className="text-sm font-semibold text-white group-hover:text-gold transition-colors">{channel.name}</h4>
        </div>
        <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
          channel.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate/10 text-slate border border-slate/20'
        }`}>
          {channel.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
         <div className="bg-white/5 rounded-lg p-2.5">
           <div className="text-[9px] text-slate uppercase font-bold mb-0.5">Leads</div>
           <div className="text-lg font-serif text-cream">{channel.leadsGenerated}</div>
         </div>
         <div className="bg-white/5 rounded-lg p-2.5">
           <div className="text-[9px] text-slate uppercase font-bold mb-0.5">Conv. Rate</div>
           <div className="text-lg font-serif text-gold">{channel.conversion}</div>
         </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-black/20 border border-white/5 rounded px-3 py-1.5 text-[10px] text-slate font-mono truncate">
          a2a-intel.io{channel.url}
        </div>
        <button 
          type="button"
          onClick={handleCopy}
          className="p-1.5 hover:bg-white/5 rounded transition-colors text-slate hover:text-gold"
          title="Copy Link"
        >
          {copied ? <Zap className="w-4 h-4 text-gold fill-gold" /> : <Copy className="w-4 h-4" />}
        </button>
        <button type="button" className="p-1.5 hover:bg-white/5 rounded transition-colors text-slate hover:text-white" title="Open Link">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function RoutingRule({ title, route, status, icon }: { title: string, route: string, status: string, icon: string }) {
  return (
    <div className="text-left">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold text-white">{title}</span>
      </div>
      <div className="text-[11px] text-slate-light mb-2">Route: <span className="text-gold font-medium">{route}</span></div>
      <div className="flex items-center gap-2">
         <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-slate'}`} />
         <span className="text-[10px] uppercase font-bold text-slate tracking-widest">{status}</span>
      </div>
    </div>
  );
}

