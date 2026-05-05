import { useState } from 'react';
import { Home, Search, Target, Mail, ArrowRight, Zap, TrendingUp, MapPin, Info, ClipboardCheck, RefreshCcw, CheckCircle2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ValuationResult {
  address: string;
  price: string;
  confidence: string;
  source: string;
  range: string;
  timestamp: string;
  insights: string[];
}

export default function ValuationPage() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Toronto');
  const [province, setProvince] = useState('Ontario, CA');
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentValuations, setRecentValuations] = useState<ValuationResult[]>([
    { 
      address: '52 Maple Ave, Toronto ON', 
      price: '$1.24M', 
      range: '$1.18M – $1.31M CAD', 
      confidence: '94%', 
      source: 'Royal LePage QuickQuote', 
      timestamp: '2 min ago',
      insights: ['High equity score', 'Strong neighborhood appreciation']
    },
    { 
      address: '88 Brookfield Dr, Vancouver BC', 
      price: '$2.07M', 
      range: '$1.95M – $2.19M CAD', 
      confidence: '91%', 
      source: 'HouseCanary AVM', 
      timestamp: '1 hr ago',
      insights: ['Investor potential', 'New transit node nearby']
    },
  ]);

  const runValuation = () => {
    if (!address) return;
    setIsLoading(true);
    
    // Simulate complex AI processing
    setTimeout(() => {
      const newResult: ValuationResult = {
        address: `${address}, ${city} ${province.split(',')[0]}`,
        price: '$' + (Math.floor(Math.random() * 1500 + 600) / 100 * 100).toFixed(0) + 'K',
        confidence: (Math.floor(Math.random() * 10 + 85)) + '%',
        source: 'A2A Cognitive AVM Engine',
        range: `$${(Math.random() * 0.5 + 0.8).toFixed(2)}M – $${(Math.random() * 0.5 + 1.2).toFixed(2)}M CAD`,
        timestamp: 'Just now',
        insights: [
          'High probability of listing within 90 days',
          'Market inventory at 5-year low in this zip',
          'A2A predicted price velocity: +4.2% annually'
        ]
      };
      setResult(newResult);
      setRecentValuations(prev => [newResult, ...prev].slice(0, 5));
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6 flex flex-col">
          <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Neuro-Valuation Engine</h3>
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-1">HouseCanary + Royal LePage Real-time Intel</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold text-slate-light uppercase">Engine: Active</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5 text-[10px] font-bold text-gold uppercase tracking-wider">
              <label className="flex items-center gap-2 font-serif"><MapPin className="w-3 h-3" /> Street Address</label>
              <input 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Main Street" 
                className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:border-gold transition-colors" 
              />
            </div>
            <div className="space-y-1.5 text-[10px] font-bold text-gold uppercase tracking-wider">
              <label className="flex items-center gap-2 font-serif">City</label>
              <input 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Toronto / New York" 
                className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:border-gold transition-colors" 
              />
            </div>
            <div className="space-y-1.5 text-[10px] font-bold text-gold uppercase tracking-wider">
              <label className="flex items-center gap-2 font-serif">State / Province</label>
              <select 
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="Ontario, CA">Ontario, CA</option>
                <option value="British Columbia, CA">British Columbia, CA</option>
                <option value="New York, US">New York, US</option>
                <option value="California, US">California, US</option>
              </select>
            </div>
            <div className="space-y-1.5 text-[10px] font-bold text-gold uppercase tracking-wider">
              <label className="flex items-center gap-2 font-serif">Currency</label>
              <select className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors appearance-none">
                <option>CAD (Canadian Dollar)</option>
                <option>USD (US Dollar)</option>
              </select>
            </div>
          </div>

          <button 
            onClick={runValuation}
            disabled={isLoading || !address}
            className="w-full py-4 bg-gold text-navy font-bold rounded-lg hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
          >
            {isLoading ? (
              <Zap className="w-4 h-4 animate-spin text-navy" />
            ) : (
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            {isLoading ? 'Decrypting Property DNA...' : 'Execute Neural Valuation'}
          </button>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-7 bg-navy border border-gold/30 rounded-xl shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Target className="w-32 h-32 text-gold" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-1">{result.address}</div>
                      <div className="font-serif text-5xl font-bold text-cream mb-2 tracking-tight">{result.price}</div>
                      <div className="flex items-center gap-3">
                         <div className="text-[11px] text-slate font-bold uppercase tracking-widest">{result.range}</div>
                         <div className="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[10px] font-bold text-gold uppercase">{result.confidence} CONFIDENCE</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
                    <div className="space-y-3">
                       <h4 className="text-[10px] font-bold text-slate uppercase tracking-widest flex items-center gap-2">
                         <Bot className="w-3 h-3 text-gold" /> Cognitive Insights
                       </h4>
                       <ul className="space-y-2">
                          {result.insights.map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[11px] text-cream">
                               <CheckCircle2 className="w-3 h-3 text-gold mt-0.5 shrink-0" />
                               {insight}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                       <div className="text-[9px] text-slate uppercase font-bold mb-2">Market Sentiment Index</div>
                       <div className="flex items-end gap-1 h-12 mb-2">
                          {[40, 60, 45, 80, 70, 95].map((h, i) => (
                            <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${i === 5 ? 'bg-gold animate-pulse' : 'bg-white/10'}`} style={{ height: `${h}%` }} />
                          ))}
                       </div>
                       <div className="flex justify-between text-[9px] text-slate font-bold">
                          <span>BEARISH</span>
                          <span className="text-gold">HOT / BULLISH</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                    <button className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy text-xs font-bold rounded-md hover:bg-gold-light transition-all shadow-lg active:scale-95">
                      <Mail className="w-3.5 h-3.5" /> Deploy Appraisal to Lead
                    </button>
                    <button className="px-4 py-2.5 border border-gold/18 text-gold text-xs font-bold rounded-md hover:bg-gold/5 transition-colors">
                      Download PDF Report
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6 flex flex-col">
            <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Appraisal History</h3>
              <RefreshCcw className="w-3.5 h-3.5 text-slate cursor-pointer hover:text-gold transition-colors" />
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {recentValuations.map((val, idx) => (
                <div key={idx} className="group p-5 bg-navy/40 border border-white/5 rounded-xl hover:border-gold/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] text-slate group-hover:text-gold uppercase tracking-widest transition-colors">{val.address}</div>
                    <div className="text-[9px] text-slate font-medium">{val.timestamp}</div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-cream group-hover:scale-105 origin-left transition-transform mb-1">{val.price}</div>
                  <div className="text-[11px] text-slate-light">{val.range}</div>
                  
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-[9px] text-slate uppercase italic font-bold tracking-wider">{val.source}</span>
                     <div className="flex items-center gap-1 text-[9px] font-bold text-green-400 uppercase">
                        <TrendingUp className="w-3 h-3" /> Growth Zone
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gold/5 border border-gold/20 rounded-lg p-5">
             <div className="flex items-start gap-4">
                <div className="p-2 bg-gold/10 rounded-lg">
                  <Info className="w-5 h-5 text-gold" />
                </div>
                <div>
                   <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Lead Magnet Strategy</h4>
                   <p className="text-[11px] text-slate leading-relaxed">
                     Sending a cognitive valuation report to 'Cold' leads increases re-engagement by <strong className="text-gold">3.4x</strong> compared to standard newsletters.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
