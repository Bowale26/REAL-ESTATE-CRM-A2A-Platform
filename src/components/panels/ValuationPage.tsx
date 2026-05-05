import { useState } from 'react';
import { Home, Search, Target, Mail, ArrowRight, Zap, TrendingUp, MapPin, Info, ClipboardCheck, RefreshCcw, CheckCircle2, Bot, Globe, Shield, Users, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Currency } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { NORTH_AMERICAN_LOCATIONS } from '../../constants';

interface ValuationResult {
  address: string;
  price: string;
  priceValue: number;
  confidence: string;
  source: string;
  range: string;
  rangeValues: [number, number];
  timestamp: string;
  insights: string[];
}

export default function ValuationPage({ currency }: { currency: Currency }) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState<'CANADA' | 'USA'>('CANADA');
  const [region, setRegion] = useState('Ontario');
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCRMTools, setShowCRMTools] = useState(false);
  const [routingStatus, setRoutingStatus] = useState<string | null>(null);

  const [recentValuations, setRecentValuations] = useState<ValuationResult[]>([
    { 
      address: '52 Maple Ave, Toronto ON', 
      price: '$1.24M', 
      priceValue: 1240000,
      range: '$1.18M – $1.31M CAD', 
      rangeValues: [1180000, 1310000],
      confidence: '94%', 
      source: 'Royal LePage QuickQuote', 
      timestamp: '2 min ago',
      insights: ['High equity score', 'Strong neighborhood appreciation']
    },
    { 
      address: '88 Brookfield Dr, Vancouver BC', 
      price: '$2.07M', 
      priceValue: 2070000,
      range: '$1.95M – $2.19M CAD', 
      rangeValues: [1950000, 2190000],
      confidence: '91%', 
      source: 'HouseCanary AVM', 
      timestamp: '1 hr ago',
      insights: ['Investor potential', 'New transit node nearby']
    },
  ]);

  const runValuation = () => {
    if (!address) return;
    setIsLoading(true);
    
    setTimeout(() => {
      const basePrice = Math.floor(Math.random() * 800 + 400) * 1000;
      const confidence = Math.floor(Math.random() * 10 + 88);
      
      const newResult: ValuationResult = {
        address: `${address}, ${city} ${region}`,
        price: formatCurrency(basePrice, currency),
        priceValue: basePrice,
        confidence: confidence + '%',
        source: 'A2A Cognitive AVM Engine',
        range: `${formatCurrency(basePrice * 0.94, currency)} – ${formatCurrency(basePrice * 1.06, currency)}`,
        rangeValues: [basePrice * 0.94, basePrice * 1.06],
        timestamp: 'Just now',
        insights: [
          `Location Signal: Evaluated against ${region} provincial compliance and market volatility indices.`,
          'Neural Pattern: High probability (82%) of listing within next 120 days based on neighborhood turnover velocity.',
          'Market Insight: Property sits in a "Hot Zone" with inventory levels 40% below the 5-year seasonal average.',
          'Equity Signal: Tax records suggest significant equity position; ideal candidate for bridge financing.',
          'AI Note: Recent comparable sales within 400m show a premium for renovated master suites.'
        ]
      };
      setResult(newResult);
      setRecentValuations(prev => [newResult, ...prev].slice(0, 5));
      setIsLoading(false);
      setShowCRMTools(true);
    }, 2500);
  };

  const handleRouteLead = () => {
    setRoutingStatus('routing');
    setTimeout(() => {
      setRoutingStatus('completed');
      setTimeout(() => setRoutingStatus(null), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6 flex flex-col">
          <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Neuro-Valuation Engine</h3>
              <p className="text-[10px] text-gold font-bold uppercase tracking-widest mt-1">North American Coverage • Canada & USA</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <Shield className="w-3 h-3 text-blue-400" />
               <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">A2A Lead Compliance Active</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex bg-navy p-1 rounded-md border border-white/10">
                  <button 
                    onClick={() => setCountry('CANADA')}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all rounded ${country === 'CANADA' ? 'bg-gold text-navy' : 'text-slate hover:text-white'}`}
                  >
                    Canada
                  </button>
                  <button 
                    onClick={() => setCountry('USA')}
                    className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest transition-all rounded ${country === 'USA' ? 'bg-gold text-navy' : 'text-slate hover:text-white'}`}
                  >
                    USA
                  </button>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-light uppercase">Active</span>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5 text-[10px] font-bold text-gold uppercase tracking-wider md:col-span-2">
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
                placeholder="e.g. Toronto / New York" 
                className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream placeholder:text-slate focus:outline-none focus:border-gold transition-colors" 
              />
            </div>
            <div className="space-y-1.5 text-[10px] font-bold text-gold uppercase tracking-wider">
              <label className="flex items-center gap-2 font-serif">{country === 'CANADA' ? 'Province' : 'State'}</label>
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                {NORTH_AMERICAN_LOCATIONS[country].map(loc => (
                  <option key={loc} value={loc} className="bg-navy-mid text-white">{loc}</option>
                ))}
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
                className="mt-8 space-y-6"
              >
                <div className="p-7 bg-navy border border-gold/30 rounded-xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Target className="w-32 h-32 text-gold" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-1">{result.address}</div>
                        <div className="font-serif text-5xl font-bold text-cream mb-2 tracking-tight">{result.price}</div>
                        <div className="flex items-center gap-4">
                           <div className="text-[11px] text-slate font-bold uppercase tracking-widest">{result.range}</div>
                           <div className="h-4 w-px bg-white/10" />
                           <div className="flex items-center gap-2 text-gold">
                              <Shield className="w-3 h-3" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Compliance: {region} Verified</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-7">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gold/10 pb-2">
                           <Bot className="w-4 h-4" /> AI Neural Market Insights
                         </h4>
                         <div className="space-y-2">
                            {result.insights.map((insight, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-2 bg-white/[0.02] rounded-lg">
                                 <CheckCircle2 className="w-3 h-3 text-gold mt-0.5" />
                                 <p className="text-[10px] text-cream/80 leading-relaxed">{insight}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] flex items-center gap-2 border-b border-gold/10 pb-2">
                           <Globe className="w-4 h-4" /> Regional Market Density
                         </h4>
                         <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <div className="text-[9px] text-slate uppercase font-bold mb-2">{region} Inventory Velocity</div>
                            <div className="flex items-end gap-1 h-12 mb-2">
                               {[40, 60, 45, 80, 70, 95, 85].map((h, i) => (
                                 <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${i === 6 ? 'bg-gold animate-bounce' : 'bg-white/10'}`} style={{ height: `${h}%` }} />
                               ))}
                            </div>
                            <div className="flex justify-between text-[9px] text-slate font-bold pt-2">
                               <span>QUARTERLY LOW</span>
                               <span className="text-gold">ATH PREDICTED</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI CRM Integration Panel */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-navy-mid border border-gold/20 rounded-xl p-6 shadow-2xl"
                >
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gold/10 rounded-lg">
                         <Zap className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-white tracking-tight">AI CRM Intelligent Hub</h4>
                         <p className="text-[10px] text-slate uppercase tracking-widest font-bold">Lead Routing & Targeted Marketing</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-navy/40 border border-white/5 rounded-xl space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                               <ArrowRight className="w-3 h-3 text-gold" /> Targeted Marketing
                            </div>
                            <span className="text-[9px] bg-gold/10 text-gold px-2 py-0.5 rounded font-bold">READY</span>
                         </div>
                         <p className="text-[11px] text-slate-light leading-relaxed">
                            AI has generated a personalized 3-step marketing sequence for <span className="text-white font-bold">{region}</span> using local market stressors.
                         </p>
                         <button className="w-full py-2.5 bg-navy border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2">
                            <Send className="w-3.5 h-3.5" /> Deploy Campaign
                         </button>
                      </div>

                      <div className="p-4 bg-navy/40 border border-white/5 rounded-xl space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                               <Users className="w-3 h-3 text-gold" /> Intelligent Routing
                            </div>
                            <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">GEO-MATCHED</span>
                         </div>
                         <p className="text-[11px] text-slate-light leading-relaxed">
                            Detected High-Value Prospect. Route to <span className="text-white font-bold">{region} Priority Desk</span> for immediate callback.
                         </p>
                         <button 
                           onClick={handleRouteLead}
                           disabled={routingStatus === 'routing'}
                           className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
                             routingStatus === 'completed' ? 'bg-green-500 text-white' : 
                             routingStatus === 'routing' ? 'bg-navy border border-gold animate-pulse text-gold' :
                             'bg-gold text-navy shadow-lg shadow-gold/10'
                           }`}
                         >
                            {routingStatus === 'completed' ? (
                               <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : routingStatus === 'routing' ? (
                               <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                               <ClipboardCheck className="w-3.5 h-3.5" />
                            )}
                            {routingStatus === 'completed' ? 'Lead Routed' : routingStatus === 'routing' ? 'Routing to Specialist...' : 'Route to Specialist'}
                         </button>
                      </div>
                   </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          {/* History & History specific logic stays relatively same but updated with loc data */}
          <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6 flex flex-col">
            <div className="mb-6 pb-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Appraisal History</h3>
              <RefreshCcw className="w-3.5 h-3.5 text-slate cursor-pointer hover:text-gold transition-colors" />
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {recentValuations.map((val, idx) => (
                <div key={idx} className="group p-5 bg-navy/40 border border-white/5 rounded-xl hover:border-gold/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] text-slate group-hover:text-gold uppercase tracking-widest transition-colors truncate max-w-[150px]">{val.address}</div>
                    <div className="text-[9px] text-slate font-medium">{val.timestamp}</div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-cream group-hover:scale-105 origin-left transition-transform mb-1">
                    {formatCurrency(val.priceValue, currency)}
                  </div>
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
                   <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">North American Intel</h4>
                   <p className="text-[11px] text-slate leading-relaxed">
                     Currently tracking <strong className="text-gold">63 jurisdictions</strong> across Canada and the US for real-time compliance and tax-based enrichment patterns.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
