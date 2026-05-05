import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Plus, Calendar as CalendarIcon, Clock, MapPin, Users, Zap, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['May 2026', 'June 2026', 'July 2026'];

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'showing' | 'meeting' | 'call' | 'valuation';
  attendees: string[];
  location?: string;
  color: string;
}

const EVENTS_DATA: Record<number, CalendarEvent[]> = {
  4: [
    { id: '1', title: 'Showing: 52 Maple Ave', time: '10:00 AM', type: 'showing', attendees: ['James Okafor'], location: 'Toronto, ON', color: 'blue' },
    { id: '2', title: 'Listing Presentation', time: '2:30 PM', type: 'meeting', attendees: ['Sarah Mitchell'], location: 'Office / Zoom', color: 'gold' }
  ],
  5: [
    { id: '3', title: 'AI Follow-up Review', time: '9:00 AM', type: 'call', attendees: ['System Agent'], color: 'purple' }
  ],
  12: [
    { id: '4', title: 'Appraisal Walkthrough', time: '11:00 AM', type: 'valuation', attendees: ['Bank Inspector'], location: 'Downtown Loft', color: 'green' }
  ],
  15: [
    { id: '5', title: 'Contract Signature', time: '4:00 PM', type: 'meeting', attendees: ['The Wongs'], color: 'blue' }
  ]
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0); // May 2026
  const [selectedDay, setSelectedDay] = useState(4);

  const daysInMonth = 31;
  const startDay = 5; // May 1, 2026 starts on Friday? (Arbitrary for demo)

  const emptyDays = Array.from({ length: startDay }, (_, i) => i);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Executive Strategic Calendar</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">High-Precision Scheduling Engine</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-mid border border-gold/18 rounded-md overflow-hidden">
             <button className="px-3 py-1.5 text-slate hover:text-white transition-colors border-r border-gold/10">Month</button>
             <button className="px-3 py-1.5 text-slate hover:text-white transition-colors border-r border-gold/10 bg-white/5">Week</button>
             <button className="px-3 py-1.5 text-slate hover:text-white transition-colors">Day</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-all shadow-lg active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Book Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 h-[750px]">
        {/* Main Grid */}
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg flex flex-col overflow-hidden">
           {/* Month Nav */}
           <div className="p-4 border-b border-gold/10 flex items-center justify-between bg-navy/40">
              <div className="flex items-center gap-4">
                 <h3 className="text-lg font-serif font-bold text-white tracking-tight">{MONTHS[currentMonth]}</h3>
                 <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-white/5 text-slate-light"><ChevronLeft className="w-5 h-5" /></button>
                    <button className="p-1 rounded hover:bg-white/5 text-slate-light"><ChevronRight className="w-5 h-5" /></button>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
                    <input 
                      placeholder="Search appointments..." 
                      className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-cream focus:outline-none focus:border-gold/30 w-48"
                    />
                 </div>
              </div>
           </div>

           {/* Calendar Grid */}
           <div className="flex-1 grid grid-cols-7">
              {DAYS.map(day => (
                <div key={day} className="py-3 text-center border-b border-gold/10 text-[10px] font-bold text-gold uppercase tracking-widest bg-navy/20">
                  {day}
                </div>
              ))}
              
              {emptyDays.map(i => (
                <div key={`empty-${i}`} className="border-r border-b border-gold/10 bg-black/5" />
              ))}

              {calendarDays.map(day => {
                const events = EVENTS_DATA[day] || [];
                const isSelected = selectedDay === day;
                const isToday = day === 4;

                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-[100px] p-2 border-r border-b border-gold/10 cursor-pointer hover:bg-white/[0.02] transition-colors relative ${isSelected ? 'bg-gold/[0.03]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-xs font-bold ${isToday ? 'w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center' : 'text-slate'}`}>
                         {day}
                       </span>
                       {events.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_#C9A84C]" />}
                    </div>
                    <div className="space-y-1">
                       {events.slice(0, 2).map(event => (
                         <div key={event.id} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-cream truncate font-medium">
                            <span className={`inline-block w-1 h-1 rounded-full mr-1 ${
                              event.color === 'blue' ? 'bg-blue-400' : 
                              event.color === 'gold' ? 'bg-gold' : 
                              event.color === 'purple' ? 'bg-purple-400' : 'bg-green-400'
                            }`} />
                            {event.title}
                         </div>
                       ))}
                       {events.length > 2 && (
                         <div className="text-[8px] text-slate font-bold pl-1">+ {events.length - 2} more</div>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Side Panel: Selected Day Agenda */}
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
           <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{selectedDay === 4 ? 'Today' : `May ${selectedDay}, 2026`}</h3>
                <Zap className="w-4 h-4 text-gold" />
              </div>
              
              <div className="space-y-4">
                 <AnimatePresence mode="wait">
                   {EVENTS_DATA[selectedDay] ? (
                     EVENTS_DATA[selectedDay].map((event) => (
                       <motion.div 
                         key={event.id}
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         className={`p-4 rounded-xl border-l-4 bg-navy/40 border border-white/5 shadow-lg relative group ${
                           event.color === 'blue' ? 'border-l-blue-400' : 
                           event.color === 'gold' ? 'border-l-gold' : 
                           event.color === 'purple' ? 'border-l-purple-400' : 'border-l-green-400'
                         }`}
                       >
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                           <button className="p-1 text-slate hover:text-gold transition-colors">
                             <Edit3 className="w-3.5 h-3.5" />
                           </button>
                           <button className="p-1 text-slate hover:text-red-400 transition-colors">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </div>
                         <div className="text-[10px] uppercase font-bold text-slate tracking-widest mb-1">{event.type}</div>
                         <div className="text-sm font-bold text-cream mb-3">{event.title}</div>
                         
                         <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-slate-light font-medium">
                               <Clock className="w-3 h-3 text-gold/60" /> {event.time}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2 text-[10px] text-slate-light font-medium">
                                 <MapPin className="w-3 h-3 text-gold/60" /> {event.location}
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-slate-light font-medium">
                               <Users className="w-3 h-3 text-gold/60" /> {event.attendees.join(', ')}
                            </div>
                         </div>
                       </motion.div>
                     ))
                   ) : (
                     <div className="py-20 text-center space-y-3 opacity-30">
                        <CalendarIcon className="w-10 h-10 mx-auto text-slate" />
                        <p className="text-xs font-bold uppercase tracking-widest text-slate">No Appointments</p>
                     </div>
                   )}
                 </AnimatePresence>
              </div>
           </div>

           <div className="bg-gold/5 border border-gold/20 rounded-lg p-5">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap className="w-3 h-3 text-gold" /> AI Daily Briefing
              </h4>
              <p className="text-[11px] text-slate-light leading-relaxed">
                You have <strong className="text-gold">2 high-priority</strong> appointments today. 
                Sarah Mitchell's listing presentation is key for Q2 goals. A2A Agent recommends reviewing 
                the neighborhood CMA (compiled 20 mins ago) before departure.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
