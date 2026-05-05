import { Lead } from '../../types';
import { 
  Target, 
  Plus, 
  MapPin, 
  DollarSign, 
  Bot, 
  TrendingUp, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Building2,
  Clock,
  Zap,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LeadsPageProps {
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onFindSellers: () => void;
}

export default function LeadsPage({ leads, onAddLead, onEditLead, onDeleteLead, onFindSellers }: LeadsPageProps) {
  const handleExportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Phone,Budget,Status,Probability"].concat(leads.map(l => `${l.name},${l.email},${l.phone},${l.budget},${l.status},${l.probability}`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "active_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Active Opportunity Intelligence</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Real-Time Lead Scoring & Qualification</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportLeads}
            className="flex items-center gap-2 px-3 py-1.5 bg-navy/40 border border-white/10 rounded-md text-[11px] font-bold text-slate hover:text-white transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Export Data
          </button>
          <button 
            onClick={onFindSellers}
            className="flex items-center gap-2 px-4 py-1.5 bg-navy/40 border border-gold/30 rounded-md text-[11px] font-bold text-gold hover:bg-gold/10 transition-all active:scale-95 shadow-lg"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Predict Sellers
          </button>
          <button 
            onClick={onAddLead}
            className="flex items-center gap-2 px-4 py-1.5 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Capture Lead
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard label="Total Ops" value={leads.length.toString()} sub="Internal & MLS" color="gold" />
         <StatCard label="Hot Pipeline" value={leads.filter(l => l.status === 'hot').length.toString()} sub="90%+ Probability" color="green" />
         <StatCard label="A2A Qualified" value="18" sub="Neural Screening" color="blue" />
         <StatCard label="Active Nurture" value="42" sub="Auto-Engagement" color="slate" />
      </div>

      <div className="bg-navy-mid/60 border border-gold/18 rounded-xl overflow-hidden shadow-2xl">
         <div className="p-5 border-b border-white/5 flex items-center justify-between bg-navy/40">
           <div className="flex items-center gap-6">
              <button className="text-xs font-bold text-gold uppercase tracking-widest border-b-2 border-gold pb-1">All Markets</button>
              <button className="text-xs font-bold text-slate uppercase tracking-widest hover:text-white transition-colors pb-1">Hot Only</button>
              <button className="text-xs font-bold text-slate uppercase tracking-widest hover:text-white transition-colors pb-1">Recently Qualified</button>
           </div>
           <div className="flex items-center gap-3">
              <div className="relative">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate" />
                 <input className="bg-navy border border-white/10 rounded-md pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-gold w-48" placeholder="Filter Intel..." />
              </div>
           </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left border-b border-white/5 bg-navy/20">
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Lead Identity</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Market Context</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Budget | Type</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Lead Score</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">AI Status</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
                               lead.status === 'hot' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                               lead.status === 'warm' ? 'bg-gold/10 text-gold border-gold/20' :
                               'bg-slate/10 text-slate border-slate/20'
                             }`}>
                                {lead.name[0]}
                             </div>
                             <div>
                                <div className="text-[13px] font-bold text-white group-hover:text-gold transition-colors">{lead.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className="text-[9px] font-bold text-slate-light uppercase tracking-widest">via {lead.source}</span>
                                   <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'hot' ? 'bg-red-500 animate-pulse' : lead.status === 'warm' ? 'bg-gold' : 'bg-slate'}`} />
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-cream font-medium">
                             <MapPin className="w-3.5 h-3.5 text-gold" /> {lead.location || 'Not Specified'}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                             <DollarSign className="w-3.5 h-3.5 text-green-400" /> {lead.budget}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate font-bold uppercase tracking-widest">
                             <Building2 className="w-3 h-3 text-gold/60" /> {lead.propertyType || 'N/A'}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center justify-between gap-4">
                                <div className="text-[10px] font-bold text-white uppercase tracking-widest">{lead.probability}</div>
                                <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full ${lead.status === 'hot' ? 'bg-red-400' : lead.status === 'warm' ? 'bg-gold' : 'bg-slate'}`} 
                                      style={{ width: lead.probability }}
                                   />
                                </div>
                             </div>
                             <div className="text-[8px] font-bold text-gold uppercase tracking-widest">A2A Probability Index</div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="space-y-1.5">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-widest">
                                <Bot className="w-3.5 h-3.5" /> AI: {lead.chatbotStatus}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Financing: {lead.financingStatus || 'Pending'}
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <button className="p-2 bg-navy rounded border border-white/10 hover:border-gold/50 transition-colors">
                                <Mail className="w-3.5 h-3.5 text-slate-light" />
                             </button>
                             <button className="p-2 bg-navy rounded border border-white/10 hover:border-gold/50 transition-colors">
                                <Phone className="w-3.5 h-3.5 text-slate-light" />
                             </button>
                             <button 
                               onClick={() => onEditLead(lead)}
                               className="p-2 bg-navy rounded border border-white/10 hover:text-gold transition-colors"
                             >
                                <Edit3 className="w-3.5 h-3.5" />
                             </button>
                             <button 
                               onClick={() => onDeleteLead(lead.id)}
                               className="p-2 bg-navy rounded border border-white/10 hover:text-red-400 transition-colors"
                             >
                                <Trash2 className="w-3.5 h-3.5" />
                             </button>
                             <button className="p-2 bg-navy rounded border border-gold/30 hover:bg-gold/10 transition-colors ml-2">
                                <ChevronRight className="w-3.5 h-3.5 text-gold" />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
  const colorMap = {
    gold: 'border-gold/20 text-gold shadow-[0_0_15px_rgba(201,168,76,0.1)]',
    green: 'border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    blue: 'border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    slate: 'border-slate-500/20 text-slate shadow-[0_0_15px_rgba(148,163,184,0.1)]'
  }[color];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`p-5 bg-navy-mid/60 border rounded-xl transition-all ${colorMap}`}
    >
       <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">{label}</div>
       <div className="text-2xl font-serif font-bold text-white mb-1.5">{value}</div>
       <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{sub}</div>
    </motion.div>
  );
}
