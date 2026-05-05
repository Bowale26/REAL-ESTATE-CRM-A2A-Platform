import { X, MapPin, Bed, Bath, Square, Calendar, DollarSign, TrendingUp, Shield, Trees, Car, Ruler, FileText, Zap, Image as ImageIcon, BarChart3, Waves, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, Currency } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { AGENTS_DATA } from '../../constants';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Listing | null;
  currency: Currency;
}

export default function PropertyDetailsModal({ isOpen, onClose, property, currency }: PropertyDetailsModalProps) {
  if (!property) return null;

  const agent = AGENTS_DATA.find(a => a.id === property.agentId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-navy-mid border border-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]"
          >
            {/* Visual Header / Gallery Section */}
            <div className="w-full md:w-2/5 bg-navy border-r border-gold/18 relative overflow-hidden flex flex-col">
              <div className="h-64 md:h-2/3 bg-navy-mid relative group">
                 <div className="absolute inset-0 flex items-center justify-center text-gold/10">
                    <ImageIcon className="w-20 h-20" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-gold text-navy text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">Premium Listing</span>
                    <span className="px-3 py-1 bg-navy/80 border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest rounded-full backdrop-blur-md">{property.status}</span>
                 </div>
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mb-2">Market Price Portfolio</div>
                    <div className="text-3xl font-serif font-bold text-white">{formatCurrency(property.price, currency)}</div>
                 </div>
              </div>
              
              <div className="flex-1 p-6 space-y-6">
                 <div>
                   <h3 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Neighborhood Intelligence</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <ScoreMetric label="Walkability" value="92" />
                      <ScoreMetric label="Luxury Index" value="88" />
                      <ScoreMetric label="Safety Score" value="95" />
                      <ScoreMetric label="Appreciation" value="12%" />
                   </div>
                 </div>
                 <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl">
                    <p className="text-[11px] text-gold-light/90 italic leading-relaxed">
                      "This property is located in a high-demand retention zone. AI analysis suggests a 4.2% higher closing price compared to adjacent nodes."
                    </p>
                 </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-navy-light bg-navy-mid/60 p-8">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">{property.address}</h2>
                    <div className="flex items-center gap-2 text-slate-light">
                       <MapPin className="w-4 h-4 text-gold" />
                       <span className="text-sm font-medium">{property.city}, {property.state} {property.zip}</span>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 text-slate hover:text-white transition-colors">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <QuickStat icon={<Bed className="w-4 h-4" />} label="Beds" value={property.beds} />
                  <QuickStat icon={<Bath className="w-4 h-4" />} label="Baths" value={property.baths} />
                  <QuickStat icon={<Square className="w-4 h-4" />} label="Sqft" value={property.sqft.toLocaleString()} />
                  <QuickStat icon={<Ruler className="w-4 h-4" />} label="Lot Size" value="0.45 ac" />
               </div>

               <div className="space-y-10">
                  {/* Market Summary */}
                  <div>
                     <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold" /> Comprehensive Intelligence
                     </h3>
                     <div className="p-5 bg-navy/40 border border-white/5 rounded-2xl">
                        <p className="text-sm text-slate-light leading-relaxed">
                           {property.description}
                        </p>
                     </div>
                  </div>

                  {/* Feature Intelligence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="text-[10px] font-bold text-cream uppercase tracking-widest mb-4">Interior Specifications</h4>
                        <div className="space-y-3">
                           <FeatureRow icon={<Wind className="w-3.5 h-3.5" />} label="HVAC Unit" value="Carrier Infinity 2024" />
                           <FeatureRow icon={<Zap className="w-3.5 h-3.5" />} label="Smart Home" value="Control4 Integrated" />
                           <FeatureRow icon={<DollarSign className="w-3.5 h-3.5" />} label="Taxes" value="$12,450 / yr" />
                        </div>
                     </div>
                     <div>
                        <h4 className="text-[10px] font-bold text-cream uppercase tracking-widest mb-4">Exterior & Structural</h4>
                        <div className="space-y-3">
                           <FeatureRow icon={<Car className="w-3.5 h-3.5" />} label="Parking" value="3 Car Heated Garage" />
                           <FeatureRow icon={<Trees className="w-3.5 h-3.5" />} label="Siding" value="Natural Indiana Limestone" />
                           <FeatureRow icon={<Shield className="w-3.5 h-3.5" />} label="Security" value="Sovereign Shield Grade A" />
                        </div>
                     </div>
                  </div>

                  {/* Pricing Analytics */}
                  <div>
                     <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gold" /> Asset Performance Analytics
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 bg-navy/40 border border-white/5 rounded-2xl">
                           <div className="text-[9px] font-bold text-slate uppercase tracking-widest mb-2">Days on Market</div>
                           <div className="text-2xl font-bold text-white">12 <span className="text-xs text-green-400 font-bold ml-2">Fast!</span></div>
                        </div>
                        <div className="p-6 bg-navy/40 border border-white/5 rounded-2xl">
                           <div className="text-[9px] font-bold text-slate uppercase tracking-widest mb-2">Price PSF</div>
                           <div className="text-2xl font-bold text-white">$1,240</div>
                        </div>
                        <div className="p-6 bg-navy/40 border border-white/5 rounded-2xl">
                           <div className="text-[9px] font-bold text-slate uppercase tracking-widest mb-2">Interest Rank</div>
                           <div className="text-2xl font-bold text-gold">Top 5%</div>
                        </div>
                     </div>
                  </div>

                  {/* Agent Context */}
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-bold text-gold">
                           {agent?.avatar}
                        </div>
                        <div>
                           <div className="text-[10px] text-slate font-bold uppercase tracking-widest leading-tight">Master Agent</div>
                           <div className="text-lg font-bold text-white">{agent?.name}</div>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button className="px-6 py-2 bg-gold/10 border border-gold/30 rounded-lg text-[11px] font-bold text-gold hover:bg-gold/20 transition-all uppercase tracking-widest">
                           Contact Portfolio Manager
                        </button>
                        <button className="px-6 py-2 bg-gold text-navy rounded-lg text-[11px] font-bold hover:bg-gold-light transition-all uppercase tracking-widest shadow-lg">
                           Schedule Private Tour
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ScoreMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-navy/40 border border-white/10 rounded-lg">
       <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-1">{label}</div>
       <div className="text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: any, label: string, value: any }) {
  return (
    <div className="p-4 bg-navy/40 border border-white/5 rounded-xl flex flex-col items-center text-center group hover:border-gold/30 transition-all">
       <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div className="text-lg font-bold text-white leading-tight">{value}</div>
       <div className="text-[9px] font-bold text-slate uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function FeatureRow({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/2 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
       <div className="flex items-center gap-3">
          <div className="text-gold/60">{icon}</div>
          <span className="text-[11px] text-slate-light font-medium">{label}</span>
       </div>
       <span className="text-[11px] text-white font-bold">{value}</span>
    </div>
  );
}
