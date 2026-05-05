import { Award, TrendingUp, Target, Users, Search, Filter, Download, Star, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { AGENTS_DATA } from '../../constants';
import { Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';

export default function LeaderboardPage({ currency }: { currency: Currency }) {
  const sortedAgents = [...AGENTS_DATA].sort((a, b) => b.salesVolume - a.salesVolume);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Vanguard Agent Leaderboard</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">High-Performance Sales Pool Metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + ["Rank,Name,Sales Volume,Listings,Avg DOM,CSAT"].concat(sortedAgents.map((a, i) => `${i+1},${a.name},${a.salesVolume},${a.listingsTaken},${a.avgDaysOnMarket},${a.csatScore}`)).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "agent_rankings.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-navy/40 border border-white/10 rounded-md text-[11px] font-bold text-slate hover:text-white transition-all shadow-lg"
          >
             <Download className="w-3.5 h-3.5" /> Export Rankings
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10">
         {/* Silver */}
         <RankCard agent={sortedAgents[1]} rank={2} color="slate" currency={currency} />
         {/* Gold - Center & Taller */}
         <RankCard agent={sortedAgents[0]} rank={1} color="gold" featured currency={currency} />
         {/* Bronze */}
         <RankCard agent={sortedAgents[2]} rank={3} color="bronze" currency={currency} />
      </div>

      {/* Full Rankings Table */}
      <div className="bg-navy-mid/60 border border-gold/18 rounded-xl overflow-hidden shadow-2xl">
         <div className="p-5 border-b border-white/5 flex items-center justify-between bg-navy/40">
           <h3 className="text-sm font-bold text-white uppercase tracking-widest">Global Field Rankings</h3>
           <div className="flex items-center gap-3">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate" />
                 <input className="bg-navy border border-white/10 rounded-md pl-9 pr-4 py-1.5 text-xs text-white outline-none focus:border-gold w-48" placeholder="Search Agents..." />
              </div>
           </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="text-left border-b border-white/5 bg-navy/20">
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Rank</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest">Agent Pool Identity</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest text-right">Sales Volume</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest text-right">Lisings Taken</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest text-right">Avg DOM</th>
                     <th className="px-6 py-4 text-[10px] font-bold text-slate uppercase tracking-widest text-right">CSAT</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {sortedAgents.map((agent, i) => (
                    <tr key={agent.id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="px-6 py-4">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                             i === 0 ? 'bg-gold text-navy' : 
                             i === 1 ? 'bg-slate/30 text-white' : 
                             i === 2 ? 'bg-amber-900/40 text-amber-500' : 'text-slate'
                          }`}>
                            {i + 1}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-navy border border-white/10 flex items-center justify-center font-bold text-[10px] text-white">
                                {agent.avatar}
                             </div>
                             <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">{agent.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="text-sm font-bold text-cream">{formatCurrency(agent.salesVolume, currency)}</div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="text-sm font-bold text-slate">{agent.listingsTaken}</div>
                       </td>
                       <td className="px-6 py-4 text-right text-sm font-bold text-slate">
                          {agent.avgDaysOnMarket}d
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-gold">
                             {agent.csatScore} <Star className="w-3 h-3 fill-gold" />
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

function RankCard({ agent, rank, color, featured, currency }: { agent: any, rank: number, color: 'gold' | 'slate' | 'bronze', featured?: boolean, currency: Currency }) {
  const colorMap = {
    gold: 'border-gold shadow-[0_0_30px_rgba(201,168,76,0.2)] bg-gradient-to-b from-gold/10 to-transparent',
    slate: 'border-white/20 bg-white/5',
    bronze: 'border-amber-900/30 bg-amber-900/5'
  };

  const ringColor = {
    gold: 'border-gold',
    slate: 'border-white/40',
    bronze: 'border-amber-700/50'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`p-6 border rounded-2xl relative flex flex-col items-center text-center ${colorMap[color]} ${featured ? 'h-72 justify-center' : 'h-60'}`}
    >
       <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg ${
         color === 'gold' ? 'bg-gold text-navy' : 'bg-navy border border-white/20 text-white'
       }`}>
          {rank}
       </div>
       
       <div className={`w-20 h-20 rounded-full border-4 ${ringColor[color]} p-1 mb-4 relative`}>
          <div className="w-full h-full rounded-full bg-navy flex items-center justify-center text-2xl font-serif font-bold text-white overflow-hidden">
             {agent.avatar}
          </div>
          {color === 'gold' && (
            <div className="absolute -top-6 -right-6 text-gold animate-bounce">
               <Crown className="w-8 h-8 drop-shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
            </div>
          )}
       </div>

       <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
       <div className="text-sm font-bold text-gold mb-4">{formatCurrency(agent.salesVolume, currency)} Total</div>

       <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-white/5">
          <div>
             <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-0.5">Listings</div>
             <div className="text-xs font-bold text-white">{agent.listingsTaken}</div>
          </div>
          <div>
             <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-0.5">CSAT</div>
             <div className="text-xs font-bold text-white">{agent.csatScore}</div>
          </div>
       </div>
    </motion.div>
  );
}
