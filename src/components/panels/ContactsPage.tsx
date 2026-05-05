import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  ChevronRight, 
  RefreshCcw,
  CheckCircle2,
  Tag,
  Star,
  Download,
  Upload,
  Loader2,
  Clock,
  Edit3,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Contact, PanelId } from '../../types';
import ContactDetailsModal from '../modals/ContactDetailsModal';

interface ContactsPageProps {
  contacts: Contact[];
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onNavigate?: (id: PanelId) => void;
}

export default function ContactsPage({ contacts, onAddContact, onEditContact, onDeleteContact, onNavigate }: ContactsPageProps) {
  const [isEnrichingAll, setIsEnrichingAll] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleEnrichAll = () => {
    setIsEnrichingAll(true);
    setEnrichmentProgress(0);
    const interval = setInterval(() => {
      setEnrichmentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsEnrichingAll(false), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    // Simulated export
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Name,Email,Phone,Score"].concat(contacts.map(c => `${c.name},${c.email},${c.phone},${c.score}`)).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sovereign_contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Sovereign Contact Network</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">High-Equity Relationship Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate?.('import')}
            className="flex items-center gap-2 px-3 py-1.5 bg-navy/40 border border-white/10 rounded-md text-[11px] font-bold text-slate hover:text-white transition-all"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 bg-navy/40 border border-white/10 rounded-md text-[11px] font-bold text-slate hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Intelligence
          </button>
          <button 
            onClick={handleEnrichAll}
            disabled={isEnrichingAll}
            className="flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/30 rounded-md text-[11px] font-bold text-gold hover:bg-gold/20 transition-all disabled:opacity-50"
          >
            {isEnrichingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 shadow-[0_0_8px_#C9A84C]" />}
            {isEnrichingAll ? `Enriching (${enrichmentProgress}%)` : 'AI Enrich All'}
          </button>
          <button 
            onClick={onAddContact}
            className="flex items-center gap-2 px-4 py-1.5 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Add Sovereign
          </button>
        </div>
      </div>

      {/* Advanced Filtering */}
      <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input 
              className="w-full bg-navy border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-gold transition-all" 
              placeholder="Query specialized contact pool..." 
            />
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate uppercase tracking-widest hover:text-white transition-all">
               <Filter className="w-3.5 h-3.5" /> Filter Matrix
            </button>
            <div className="h-8 w-px bg-white/10 mx-1 hidden md:block" />
            <div className="flex -space-x-2">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-8 h-8 rounded-full border-2 border-navy-mid bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold">U{i}</div>
               ))}
               <div className="w-8 h-8 rounded-full border-2 border-navy-mid bg-navy-light flex items-center justify-center text-[8px] font-bold text-slate">+12</div>
            </div>
         </div>
      </div>

      {/* Contacts Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {contacts.map((contact) => (
           <ContactCard 
             key={contact.id} 
             contact={contact} 
             onViewDetails={handleViewDetails} 
             onEdit={() => onEditContact(contact)}
             onDelete={() => onDeleteContact(contact.id)}
           />
         ))}
      </div>

      <ContactDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        contact={selectedContact}
      />
    </div>
  );
}

function ContactCard({ contact, onViewDetails, onEdit, onDelete }: { contact: Contact, onViewDetails: (c: Contact) => void, onEdit: () => void, onDelete: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-navy-mid/60 border border-gold/18 rounded-2xl overflow-hidden shadow-xl hover:border-gold/40 transition-all flex flex-col group"
    >
       <div className="p-6 pb-4 relative">
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={(e) => { e.stopPropagation(); onEdit(); }}
               className="p-1.5 bg-navy/80 border border-gold/20 rounded hover:text-gold transition-colors"
               title="Edit Contact"
             >
                <Edit3 className="w-3.5 h-3.5" />
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); onDelete(); }}
               className="p-1.5 bg-navy/80 border border-red-400/20 rounded hover:text-red-400 transition-colors"
               title="Delete Contact"
             >
                <Trash2 className="w-3.5 h-3.5" />
             </button>
          </div>
          <div className="flex justify-between items-start mb-4">
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-xl font-serif font-bold text-gold shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.1)_0%,transparent_70%)]" />
                {contact.name[0]}
             </div>
             <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gold/10 border border-gold/30 rounded text-[9px] font-bold text-gold uppercase tracking-widest">
                   <Star className="w-3 h-3 fill-gold" /> VIP
                </div>
                <div className="text-[10px] font-bold text-slate-light uppercase tracking-[0.1em]">{contact.score} SCORE</div>
             </div>
          </div>
          
          <h3 className="text-base font-bold text-white mb-1 group-hover:text-gold transition-colors">{contact.name}</h3>
          <div className="flex items-center gap-2 mb-4">
             <MapPin className="w-3 h-3 text-gold" />
             <span className="text-[10px] text-slate-light font-medium uppercase tracking-widest">{contact.location || 'NYC / Toronto Area'}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
             {contact.tags?.map(t => (
               <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-slate-light uppercase tracking-widest group-hover:border-gold/20 transition-all">{t}</span>
             ))}
             {(!contact.tags || contact.tags.length === 0) && (
               <>
                 <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-slate-light uppercase tracking-widest">Investor</span>
                 <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-bold text-slate-light uppercase tracking-widest">High Net Worth</span>
               </>
             )}
          </div>
       </div>

       <div className="px-6 py-4 bg-navy/40 border-t border-white/5 space-y-3 mt-auto">
          <div className="flex items-center justify-between text-[10px] text-slate font-bold uppercase tracking-widest">
             <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Last Interaction</span>
             <span className="text-white">{contact.lastContact}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate font-bold uppercase tracking-widest">
             <span className="flex items-center gap-1.5"><RefreshCcw className="w-3 h-3" /> Pipeline Stage</span>
             <span className="text-gold">Nurturing Ops</span>
          </div>
       </div>

       <div className="p-4 bg-navy-mid border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2">
             <button className="p-2.5 bg-navy border border-white/10 rounded-xl hover:border-gold transition-colors">
                <Mail className="w-4 h-4 text-slate-light hover:text-gold" />
             </button>
             <button className="p-2.5 bg-navy border border-white/10 rounded-xl hover:border-gold transition-colors">
                <Phone className="w-4 h-4 text-slate-light hover:text-gold" />
             </button>
          </div>
          <button 
            onClick={() => onViewDetails(contact)}
            className="flex items-center gap-1.5 text-[10px] font-bold text-gold uppercase tracking-widest hover:text-white transition-all"
          >
             View Intelligence <ChevronRight className="w-3.5 h-3.5" />
          </button>
       </div>
    </motion.div>
  );
}
