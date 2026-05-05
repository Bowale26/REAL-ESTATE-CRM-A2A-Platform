import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Download, 
  BrainCircuit,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  MapPin,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AGENTS_DATA, CAPTURE_CHANNELS } from '../../constants';

const ROI_DATA = CAPTURE_CHANNELS.map(c => {
  const revenue = parseInt(c.revenuePerLead.replace('$', '')) * (c.leadsGenerated * parseFloat(c.conversion) / 100);
  const cost = c.leadsGenerated * (c.type === 'Valuation' ? 12 : c.type === 'Social Ad' ? 8 : 15); // Simulated costs
  return {
    name: c.name.split(' — ')[0],
    revenue,
    cost,
    roi: ((revenue - cost) / cost * 100).toFixed(0),
    leads: c.leadsGenerated,
    conversion: parseFloat(c.conversion)
  };
});

const SENTIMENT_RADAR_DATA = [
  { subject: 'Pricing', A: 85, fullMark: 100 },
  { subject: 'Inventory', A: 92, fullMark: 100 },
  { subject: 'Mortgage', A: 45, fullMark: 100 },
  { subject: 'Luxury', A: 88, fullMark: 100 },
  { subject: 'Investment', A: 72, fullMark: 100 },
  { subject: 'Development', A: 65, fullMark: 100 },
];

const CONVERSATION_INSIGHTS = [
  {
    neighborhood: 'Rosedale',
    sentiment: 'Positive',
    score: 88,
    mainObjection: 'Lack of modern renovations in historical builds',
    trendingInterest: 'EV charging readiness & Home Automation',
    summary: 'High-net-worth buyers are pivoting towards "Turn-Key Tech"—historical exteriors with fully integrated A2A-managed smart systems.'
  },
  {
    neighborhood: 'Yorkville',
    sentiment: 'Negative',
    score: 34,
    mainObjection: 'Proximity to ongoing massive transit construction',
    trendingInterest: 'Soundproof "Bio-Office" spaces',
    summary: 'Sentiment is dampened by urban noise pollution. Conversion cycles are elongating as clients wait for construction milestones.'
  },
  {
    neighborhood: 'Bridle Path',
    sentiment: 'Neutral',
    score: 55,
    mainObjection: 'Oversupply of "Grey-Box" modernism',
    trendingInterest: 'Underground security pavilions',
    summary: 'Buyers are exhibiting "Aesthetic Fatigue". There is a significant move back towards traditional European craftsmanship.'
  }
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeInsightTab, setActiveInsightTab] = useState<'sentiment' | 'intelligence'>('intelligence');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Intelligence & ROI Dashboard</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Sovereign Performance Metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-mid border border-gold/18 rounded-md px-3 py-1.5">
             <Calendar className="w-3.5 h-3.5 text-gold mr-2" />
             <select 
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value)}
               className="bg-transparent text-[10px] font-bold text-slate uppercase tracking-widest outline-none appearance-none cursor-pointer"
             >
               <option value="30d">Past 30 Days</option>
               <option value="90d">Past 90 Days</option>
               <option value="ytd">Year to Date</option>
             </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-md text-[11px] font-bold text-gold hover:bg-gold/10 transition-all shadow-lg active:scale-95">
             <Download className="w-3.5 h-3.5" /> Export Intelligence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Performance */}
        <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                 <Target className="w-4 h-4 text-gold" /> Lead Source ROI
              </h3>
              <div className="text-[10px] text-slate font-bold uppercase">Estimated Conversion Value</div>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={ROI_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      tickFormatter={(val) => `$${val/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A1121', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="revenue" name="Est. Revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="cost" name="Ad Spend" fill="#ffffff20" radius={[4, 4, 0, 0]} barSize={30} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
           
           <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ROI_DATA.map((item, i) => (
                <div key={i} className="p-3 bg-navy/40 border border-white/5 rounded-lg">
                   <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-1">{item.name} ROI</div>
                   <div className="text-sm font-bold text-green-400">+{item.roi}%</div>
                </div>
              ))}
           </div>
        </div>

        {/* AI Market Intelligence Center */}
        <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6 flex flex-col relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl -mr-16 -mt-16 rounded-full" />
           
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                 <BrainCircuit className="w-4 h-4 text-gold" /> Perception Analysis
              </h3>
              <div className="flex gap-2">
                 <button 
                  onClick={() => setActiveInsightTab('intelligence')}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                    activeInsightTab === 'intelligence' ? 'bg-gold text-navy' : 'bg-white/5 text-slate border border-white/10'
                  }`}
                 >
                   NLP Intelligence
                 </button>
                 <button 
                  onClick={() => setActiveInsightTab('sentiment')}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                    activeInsightTab === 'sentiment' ? 'bg-gold text-navy' : 'bg-white/5 text-slate border border-white/10'
                  }`}
                 >
                   Sentiment Vectors
                 </button>
              </div>
           </div>
           
           <div className="flex-1 min-h-[400px]">
              <AnimatePresence mode="wait">
                 {activeInsightTab === 'sentiment' ? (
                   <motion.div 
                     key="radar"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.05 }}
                     className="h-[340px]"
                   >
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SENTIMENT_RADAR_DATA}>
                           <PolarGrid stroke="#ffffff10" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar
                              name="Market Intensity"
                              dataKey="A"
                              stroke="#C9A84C"
                              fill="#C9A84C"
                              fillOpacity={0.5}
                           />
                           <Tooltip 
                            contentStyle={{ backgroundColor: '#0A1121', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px', fontSize: '10px' }}
                           />
                        </RadarChart>
                     </ResponsiveContainer>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="intelligence"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-4"
                   >
                      <div className="space-y-3">
                         {CONVERSATION_INSIGHTS.map((insight, idx) => (
                           <div key={idx} className="bg-navy/40 border border-white/5 p-4 rounded-xl hover:border-gold/30 transition-all group relative overflow-hidden">
                              <div className="flex justify-between items-start mb-3">
                                 <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-gold" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{insight.neighborhood}</span>
                                 </div>
                                 <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                   insight.sentiment === 'Positive' ? 'bg-green-500/10 text-green-400' : 
                                   insight.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400' : 'bg-gold/10 text-gold'
                                 }`}>
                                    {insight.sentiment === 'Positive' ? <ThumbsUp className="w-2.5 h-2.5" /> : insight.sentiment === 'Negative' ? <ThumbsDown className="w-2.5 h-2.5" /> : <TrendingUp className="w-2.5 h-2.5" />}
                                    {insight.score}% Match
                                 </div>
                              </div>
                              
                              <p className="text-[11px] text-slate-light leading-relaxed italic mb-3">
                                "{insight.summary}"
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                                 <div>
                                    <div className="text-[8px] font-bold text-red-400/80 uppercase tracking-widest flex items-center gap-1 mb-1">
                                       <AlertTriangle className="w-2 h-2" /> Key Objection
                                    </div>
                                    <div className="text-[9px] text-white/70 font-medium">{insight.mainObjection}</div>
                                 </div>
                                 <div>
                                    <div className="text-[8px] font-bold text-gold uppercase tracking-widest flex items-center gap-1 mb-1">
                                       <Sparkles className="w-2 h-2" /> Trending Interest
                                    </div>
                                    <div className="text-[9px] text-white/70 font-medium">{insight.trendingInterest}</div>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
           
           <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-xl flex gap-3 relative z-10">
              <Sparkles className="w-5 h-5 text-gold shrink-0 animate-pulse" />
              <div>
                 <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-1">Global AI Consensus</p>
                 <p className="text-[10px] text-slate-light leading-relaxed">
                    A2A neural analysis confirms <span className="text-white font-medium">multi-market divergence</span>. Luxury inventory absorption is accelerating, despite headline-rate volatility. AI recommends targeting <span className="text-white font-medium">Smart Integration</span> as a primary value driver.
                 </p>
              </div>
           </div>
        </div>

        {/* Team Performance */}
        <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6 lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                 <Award className="w-4 h-4 text-gold" /> Agent Performance Leaderboard
              </h3>
              <div className="flex items-center gap-6">
                 <div className="text-[10px] text-slate font-bold uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold" /> Sales Volume
                 </div>
                 <div className="text-[10px] text-slate font-bold uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/20" /> Listings Taken
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-left border-b border-white/5">
                       <th className="pb-4 text-[10px] font-bold text-slate uppercase tracking-widest">Agent Pool</th>
                       <th className="pb-4 text-[10px] font-bold text-slate uppercase tracking-widest">Sales Volume</th>
                       <th className="pb-4 text-[10px] font-bold text-slate uppercase tracking-widest">Listings</th>
                       <th className="pb-4 text-[10px] font-bold text-slate uppercase tracking-widest">Avg DOM</th>
                       <th className="pb-4 text-[10px] font-bold text-slate uppercase tracking-widest">CSAT Score</th>
                       <th className="pb-4 text-[10px] font-bold text-slate uppercase tracking-widest">Rank</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {AGENTS_DATA.sort((a, b) => b.salesVolume - a.salesVolume).map((agent, i) => (
                      <tr key={agent.id} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-bold text-gold text-[10px]">
                                  {agent.avatar}
                               </div>
                               <span className="text-sm font-bold text-white">{agent.name}</span>
                            </div>
                         </td>
                         <td className="py-4">
                            <div className="text-xs font-bold text-cream">${(agent.salesVolume / 1000000).toFixed(1)}M</div>
                         </td>
                         <td className="py-4">
                            <div className="text-xs font-bold text-slate">{agent.listingsTaken}</div>
                         </td>
                         <td className="py-4 text-xs font-bold text-slate">{agent.avgDaysOnMarket} Days</td>
                         <td className="py-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gold">
                               {agent.csatScore} <Target className="w-3 h-3 opacity-50" />
                            </div>
                         </td>
                         <td className="py-4">
                            <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border ${
                              i === 0 ? 'bg-gold text-navy border-gold shadow-[0_0_10px_#C9A84C]' : 
                              i === 1 ? 'bg-white/10 text-white border-white/20' : 
                              'bg-navy-mid text-slate border-white/5'
                            }`}>
                               {i + 1}
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
