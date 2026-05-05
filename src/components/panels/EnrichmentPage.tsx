import { useState } from 'react';
import { Zap, CheckCircle2, Search, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ENRICHMENT_DATA } from '../../constants';
import { EnrichmentResult } from '../../types';

export default function EnrichmentPage() {
  const [data, setData] = useState<EnrichmentResult[]>(ENRICHMENT_DATA);
  const [isEnriching, setIsEnriching] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleEnrichAll = () => {
    setIsEnriching(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsEnriching(false);
          // Set all to enriched
          setData(prevData => prevData.map(item => ({
            ...item,
            isEnriched: true,
            linkedin: item.linkedin === 'Not Found' ? 'Verified' : item.linkedin,
            move: item.move === 'TBD' ? '6–12 months' : item.move,
            equity: item.equity === 'TBD' ? '$250K+' : item.equity,
            score: item.score === '32%' ? '88%' : (item.score === '45%' ? '92%' : item.score)
          })));
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy-mid/60 border border-gold/18 rounded-lg overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Lead Enrichment — Lindy AI</h3>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-1">Deep Web & Social Identity Resolution</p>
          </div>
          <button 
            onClick={handleEnrichAll}
            disabled={isEnriching}
            className="flex items-center gap-1.5 px-4 py-2 bg-gold/10 border border-gold/30 rounded-md text-[11px] font-bold text-gold hover:bg-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(201,168,76,0.1)]"
          >
            {isEnriching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            Enrich All Contacts
          </button>
        </div>

        {isEnriching && (
          <div className="h-1 bg-white/5 w-full relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 bg-gold shadow-[0_0_10px_#C9A84C]"
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-navy/40">
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Contact</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">LinkedIn</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Est. Move Date</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Life Events</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Equity Est.</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Enrichment Score</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <EnrichRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-navy-mid/40 border border-white/5 rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <RefreshCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate uppercase font-bold tracking-widest">Active Sources</div>
            <div className="text-sm font-bold text-white">12 API Integrations</div>
          </div>
        </div>
        <div className="bg-navy-mid/40 border border-white/5 rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate uppercase font-bold tracking-widest">Match Rate</div>
            <div className="text-sm font-bold text-white">92.4% Identity Clarity</div>
          </div>
        </div>
        <div className="bg-navy-mid/40 border border-white/5 rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate uppercase font-bold tracking-widest">Verified Tags</div>
            <div className="text-sm font-bold text-white">8,450 Insight Nodes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnrichRow({ item }: { item: EnrichmentResult, key?: string }) {
  const { name, linkedin, move, events, equity, score, isEnriched } = item;
  
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-5 py-4">
        <div className="flex flex-col">
          <strong className="text-white text-sm">{name}</strong>
          {!isEnriched && <span className="text-[9px] text-slate-light font-bold uppercase tracking-wider mt-0.5">Stale Record</span>}
        </div>
      </td>
      <td className="px-5 py-4">
        <span className={`flex items-center gap-1.5 text-[11px] font-bold ${linkedin === 'Verified' ? 'text-blue-400' : 'text-slate'}`}>
          {linkedin === 'Verified' && <CheckCircle2 className="w-3 h-3" />} {linkedin}
        </span>
      </td>
      <td className="px-5 py-4 text-xs font-bold text-gold">{move}</td>
      <td className="px-5 py-4 text-xs text-slate-light">{events}</td>
      <td className="px-5 py-4 text-xs font-mono text-cream">{equity}</td>
      <td className="px-5 py-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${parseInt(score) > 80 ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
          {score}
        </span>
      </td>
      <td className="px-5 py-4">
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 rounded text-[10px] text-slate-light hover:border-gold/30 hover:text-white transition-all active:scale-95 group-hover:bg-white/5">
          View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </td>
    </tr>
  );
}
