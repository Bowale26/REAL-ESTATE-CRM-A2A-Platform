import { Database, Link2, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, Shield, Zap, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { CRMConnection } from '../../types';

export default function CRMIntegrationPage() {
  const [connections, setConnections] = useState<CRMConnection[]>([
    { id: '1', name: 'kvCORE', status: 'connected', lastSync: '12 mins ago', leadCount: 1240 },
    { id: '2', name: 'Follow Up Boss', status: 'connected', lastSync: '1 hour ago', leadCount: 3502 },
    { id: '3', name: 'Wise Agent', status: 'syncing', lastSync: 'Syncing now...', leadCount: 840 },
    { id: '4', name: 'LionDesk', status: 'disconnected', lastSync: 'Never', leadCount: 0 }
  ]);

  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => setIsSyncingAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-mid/60 p-6 rounded-2xl border border-gold/18">
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-1 flex items-center gap-2">
            <Database className="w-6 h-6 text-gold" /> CRM Topology & Multi-Node Sync
          </h2>
          <p className="text-xs text-slate-light font-bold uppercase tracking-widest italic">Bi-directional Lead Orchestration for North American Standards</p>
        </div>
        <button 
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="px-6 py-2 bg-gold text-navy rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg"
        >
          {isSyncingAll ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Orchestrate Full Sync
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connection Cards */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((crm) => (
                 <div key={crm.id} className="bg-navy-mid/60 border border-gold/18 rounded-2xl p-6 relative overflow-hidden group">
                    {/* Background Graphic */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-6">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${crm.status === 'connected' ? 'bg-green-500/10 border-green-500/30 text-green-400' : crm.status === 'syncing' ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/10 text-slate'}`}>
                             <Link2 className="w-6 h-6" />
                          </div>
                          <div>
                             <h3 className="font-serif text-lg font-bold text-white">{crm.name}</h3>
                             <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${crm.status === 'connected' ? 'bg-green-400 animate-pulse' : crm.status === 'syncing' ? 'bg-gold animate-bounce' : 'bg-slate-light'}`} />
                                <span className={`text-[9px] font-bold uppercase tracking-widest ${crm.status === 'connected' ? 'text-green-400' : crm.status === 'syncing' ? 'text-gold' : 'text-slate'}`}>{crm.status}</span>
                             </div>
                          </div>
                       </div>
                       {crm.status === 'disconnected' ? (
                          <button className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] border-b border-gold/30 hover:text-gold-light transition-colors">Initialize</button>
                       ) : (
                          <button className="p-2 text-slate hover:text-white transition-colors">
                             <ExternalLink className="w-4 h-4" />
                          </button>
                       )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-3 bg-navy/40 border border-white/5 rounded-xl">
                          <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-1">Total Payload</div>
                          <div className="text-sm font-bold text-white">{crm.leadCount.toLocaleString()} <span className="text-[10px] text-slate-light ml-1 font-medium">leads</span></div>
                       </div>
                       <div className="p-3 bg-navy/40 border border-white/5 rounded-xl">
                          <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-1">Last Neural Sync</div>
                          <div className="text-sm font-bold text-white truncate">{crm.lastSync}</div>
                       </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-light uppercase tracking-widest">
                       <div className="flex items-center gap-1.5">
                          <Shield className="w-3 h-3 text-gold/60" /> Zero-Trust Encryption
                       </div>
                       <button className="hover:text-gold transition-colors">Settings</button>
                    </div>
                 </div>
              ))}
           </div>

           {/* Global Configuration */}
           <div className="bg-navy-mid/60 border border-gold/18 rounded-3xl p-8">
              <h3 className="text-sm font-serif font-bold text-white mb-6 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-gold" /> Intelligent Routing Protocols
              </h3>
              <div className="space-y-4">
                 {[
                    { title: "Smart Lead Distribution", desc: "Round-robin assignment across team nodes based on agent capacity metrics.", icon: <Users /> },
                    { title: "Bi-directional Disposition Sync", desc: "Instantly propagate lead status changes from A2A back to primary CRM.", icon: <RefreshCw /> },
                    { title: "Predictive Conversion Analytics", desc: "Leverage historical CRM data to score A2A leads before initial contact.", icon: <TrendingUp /> }
                 ].map((protocol, i) => (
                    <div key={i} className="flex items-start gap-5 p-5 bg-navy/40 border border-white/5 rounded-2xl hover:border-gold/20 transition-all cursor-pointer group">
                       <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                          {protocol.icon}
                       </div>
                       <div>
                          <div className="text-[11px] font-bold text-white uppercase tracking-widest mb-1">{protocol.title}</div>
                          <p className="text-[10px] text-slate-light leading-relaxed">{protocol.desc}</p>
                       </div>
                       <div className="ml-auto">
                          <div className="w-4 h-4 rounded-full border border-gold flex items-center justify-center">
                             <div className="w-2 h-2 rounded-full bg-gold" />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-navy-mid to-navy border border-gold/18 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4">
                 <Shield className="w-12 h-12 text-gold/5" />
              </div>
              <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-6">Integration Integrity</h3>
              <div className="space-y-6">
                 <div>
                    <div className="text-[10px] font-bold text-white mb-2 uppercase tracking-widest">Active API Uptime</div>
                    <div className="flex items-end gap-2">
                       <div className="text-3xl font-serif font-bold text-white">99.9%</div>
                       <div className="text-[10px] text-green-400 font-bold mb-1 tracking-widest">STABLE</div>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate uppercase tracking-widest">
                       <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> kvCORE Gateway OK
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate uppercase tracking-widest">
                       <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> FUB OAuth Active
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate uppercase tracking-widest">
                       <AlertTriangle className="w-3.5 h-3.5 text-gold" /> LionDesk Expired
                    </div>
                 </div>
              </div>
              <button className="w-full mt-10 py-3 bg-gold/10 border border-gold/30 rounded-xl text-[10px] font-bold text-gold uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-95">
                 Audit System Logs
              </button>
           </div>

           <div className="bg-navy-mid/60 border border-gold/18 rounded-3xl p-8">
              <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-4">North American Compliance</h3>
              <p className="text-[10px] text-slate-light leading-relaxed italic">
                 "Our integration layer strictly adheres to RESO (Real Estate Standards Organization) protocols and ensures full PIPEDA & TCPA compliance during lead synchronization."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
