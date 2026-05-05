import { X, Mail, Phone, MapPin, Star, Clock, Calendar, CheckSquare, MessageSquare, Zap, Target, DollarSign, TrendingUp, AlertTriangle, Users, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Contact } from '../../types';

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

export default function ContactDetailsModal({ isOpen, onClose, contact }: ContactDetailsModalProps) {
  if (!contact) return null;

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
            className="relative w-full max-w-4xl bg-navy-mid border border-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh]"
          >
            {/* Sidebar / Profile Summary */}
            <div className="w-full md:w-80 bg-navy/98 border-r border-gold/18 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/30 flex items-center justify-center text-3xl font-serif font-bold text-gold shadow-lg">
                  {contact.name[0]}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/30 rounded-full text-[10px] font-bold text-gold uppercase tracking-widest">
                    <Star className="w-3.5 h-3.5 fill-gold" /> VIP
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-bold text-slate uppercase tracking-widest leading-none">Score</div>
                    <div className="text-xl font-bold text-cream mt-1">{contact.score}</div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-serif font-bold text-white mb-1">{contact.name}</h2>
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span className="text-xs text-slate-light font-medium">{contact.location || 'NYC / Toronto Area'}</span>
              </div>

              <div className="space-y-4 mb-8">
                <ContactInfoItem icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={contact.email} />
                <ContactInfoItem icon={<Phone className="w-3.5 h-3.5" />} label="Phone" value={contact.phone} />
                <ContactInfoItem icon={<Zap className="w-3.5 h-3.5" />} label="Identity" value="Sovereign Verified" />
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate font-bold uppercase tracking-widest mb-3">AI Context Analysis</p>
                <div className="p-3 bg-gold/5 border border-gold/20 rounded-lg">
                   <p className="text-[11px] text-gold-light/90 italic leading-relaxed">
                     "High potential for Q3 conversion. Client exhibits strong equity signals and has engaged with all luxury IDX retargeting campaigns."
                   </p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-navy-light p-8">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-4">
                     <TabButton active label="Interaction History" />
                     <TabButton label="AI Preferences" />
                     <TabButton label="Neural Insights" />
                  </div>
                  <button onClick={onClose} className="p-2 text-slate hover:text-white transition-colors">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="space-y-8">
                  {/* Lead Scoring Section */}
                  <div>
                     <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gold" /> Scoring Matrix Intelligence
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <ScoreMetric label="Engagement" value="94" color="green" />
                        <ScoreMetric label="Equity Match" value="88" color="gold" />
                        <ScoreMetric label="Market Readiness" value="72" color="blue" />
                     </div>
                  </div>

                  {/* Enhanced History */}
                  <div>
                     <h3 className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gold" /> Enhanced Relationship Timeline
                     </h3>
                     <div className="space-y-4 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[17px] top-4 bottom-4 w-px bg-white/5" />
                        
                        {(contact.history && contact.history.length > 0) ? (
                          contact.history.map((event, i) => (
                            <TimelineItem key={event.id} event={event} isLast={i === contact.history.length - 1} />
                          ))
                        ) : (
                          <>
                            <TimelineItem 
                              event={{ id: '1', type: 'email', content: 'AI auto-reply sent via Luxury Nurture sequence.', timestamp: '2 hours ago', author: 'Lindy AI' }} 
                            />
                            <TimelineItem 
                              event={{ id: '2', type: 'call', content: 'Discussed portfolio expansion in Rosedale area.', timestamp: '2 days ago', author: 'Alina Vance' }} 
                            />
                            <TimelineItem 
                              event={{ id: '3', type: 'note', content: 'Client requested info on school zones for Yorkville area.', timestamp: '1 week ago', author: 'Marcus Chen' }} 
                            />
                            <TimelineItem 
                              event={{ id: '4', type: 'meeting', content: 'Direct strategy session at Sovereign Club Lounge.', timestamp: '2 weeks ago', author: 'James Wilson' }} 
                            />
                          </>
                        )}
                     </div>
                  </div>

                  {/* Common Objections / Focus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-4 bg-navy/40 border border-white/5 rounded-xl">
                        <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <AlertTriangle className="w-3.5 h-3.5" /> Barrier Intel
                        </h4>
                        <ul className="space-y-2">
                           <li className="text-[11px] text-slate-light flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-red-400" />
                              Wary of current mortgage rate volatility
                           </li>
                           <li className="text-[11px] text-slate-light flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-red-400" />
                              Needs bridge financing for existing luxury asset
                           </li>
                        </ul>
                     </div>
                     <div className="p-4 bg-navy/40 border border-white/5 rounded-xl">
                        <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <Target className="w-3.5 h-3.5" /> Growth Vectors
                        </h4>
                        <ul className="space-y-2">
                           <li className="text-[11px] text-slate-light flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-green-400" />
                              Interest in smart-home integration levels
                           </li>
                           <li className="text-[11px] text-slate-light flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-green-400" />
                              Focussed on historical property tax advantages
                           </li>
                        </ul>
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

function ContactInfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold text-slate uppercase tracking-widest mb-1">{label}</div>
      <div className="flex items-center gap-2 text-[11px] text-cream font-medium">
        <span className="text-gold opacity-60">{icon}</span>
        {value}
      </div>
    </div>
  );
}

function TabButton({ active, label, onClick }: { active?: boolean, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-[10px] font-bold uppercase tracking-[0.2em] pb-1 transition-all ${
        active ? 'text-gold border-b-2 border-gold font-bold' : 'text-slate border-b-2 border-transparent hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function ScoreMetric({ label, value, color }: { label: string, value: string, color: 'green' | 'gold' | 'blue' }) {
  const colorMap = {
    green: 'text-green-400 bg-green-500/5 border-green-500/20',
    gold: 'text-gold bg-gold/5 border-gold/20',
    blue: 'text-blue-400 bg-blue-500/5 border-blue-500/20'
  };

  return (
    <div className={`p-4 border rounded-xl ${colorMap[color]}`}>
       <div className="text-[9px] font-bold uppercase tracking-widest opacity-80 mb-2">{label}</div>
       <div className="flex items-end gap-1">
          <span className="text-2xl font-serif font-bold text-white">{value}</span>
          <span className="text-[10px] font-bold mb-1 opacity-60">/ 100</span>
       </div>
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: any, isLast?: boolean }) {
  const iconMap = {
    email: <Mail className="w-3 h-3" />,
    call: <Phone className="w-3 h-3" />,
    meeting: <Users className="w-3 h-3" />,
    note: <MessageSquare className="w-3 h-3" />,
    text: <MessageSquare className="w-3 h-3" />,
    task: <CheckSquare className="w-3 h-3" />,
    valuation: <Zap className="w-3 h-3" />,
    file: <FileText className="w-3 h-3" />
  };

  return (
    <div className="flex gap-4 group">
       <div className="relative z-10">
          <div className="w-9 h-9 rounded-xl bg-navy border border-white/10 flex items-center justify-center text-gold group-hover:border-gold/50 transition-colors shadow-lg">
             {iconMap[event.type as keyof typeof iconMap] || <Clock className="w-3 h-3" />}
          </div>
       </div>
       <div className="bg-white/2 border border-white/5 rounded-2xl p-4 flex-1 hover:bg-white/5 transition-all">
          <div className="flex items-center justify-between mb-2">
             <div className="text-[10px] font-bold text-gold uppercase tracking-widest">{event.author}</div>
             <div className="text-[9px] text-slate font-medium uppercase tracking-widest">{event.timestamp}</div>
          </div>
          <p className="text-[11px] text-slate-light leading-relaxed">{event.content}</p>
       </div>
    </div>
  );
}
