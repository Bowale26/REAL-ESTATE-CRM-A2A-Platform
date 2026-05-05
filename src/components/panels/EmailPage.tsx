import { useState } from 'react';
import { Email } from '../../types';
import { Mail, Search, FileText, Send, Sparkles, Filter, ChevronRight } from 'lucide-react';

interface EmailPageProps {
  emails: Email[];
  onCompose: () => void;
}

export default function EmailPage({ emails, onCompose }: EmailPageProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'sequences' | 'templates'>('inbox');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
      <div className="bg-navy-mid/60 border border-gold/18 rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Email Management</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/18 rounded-md text-[11px] font-medium text-slate-light hover:text-gold transition-colors">
              <FileText className="w-3.5 h-3.5" /> Templates
            </button>
            <button 
              onClick={onCompose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Compose
            </button>
          </div>
        </div>

        <div className="flex gap-2 p-2 border-b border-white/5 bg-navy/20">
          <Tab active={activeTab === 'inbox'} label={`Inbox (${emails.filter(e => e.status === 'unread').length})`} onClick={() => setActiveTab('inbox')} />
          <Tab active={activeTab === 'sent'} label="Sent" onClick={() => setActiveTab('sent')} />
          <Tab active={activeTab === 'sequences'} label="Sequences" onClick={() => setActiveTab('sequences')} />
          <Tab active={activeTab === 'templates'} label="Templates" onClick={() => setActiveTab('templates')} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-navy/40">
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">From</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Subject</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Property</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3">Time</th>
                <th className="text-[10px] uppercase tracking-widest text-slate font-semibold text-left px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr key={email.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold bg-navy border border-gold/20 ${
                        email.avatarColor === 'blue' ? 'text-blue-400' :
                        email.avatarColor === 'green' ? 'text-green-400' :
                        email.avatarColor === 'gold' ? 'text-gold' : 'text-slate-light'
                      }`}>
                        {email.initials}
                      </div>
                      <div className={`text-sm font-medium ${email.status === 'unread' ? 'text-white' : 'text-slate-light'}`}>
                        {email.from}
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-xs ${email.status === 'unread' ? 'text-cream font-semibold' : 'text-slate'}`}>
                    {email.subject}
                  </td>
                  <td className="px-5 py-4 text-xs text-gold font-medium">{email.property}</td>
                  <td className="px-5 py-4 text-[11px] text-slate">{email.time}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="px-3 py-1.5 border border-white/10 rounded text-[10px] font-bold text-slate-light hover:text-white hover:border-white/20 transition-colors">
                      Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
          <div className="mb-4 pb-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">AI Email Sequences</h3>
          </div>
          <div className="space-y-4">
            <SequenceCard 
              title="Buyer Nurture — 7 Day" 
              stats="32 active contacts · 68% open rate" 
              progress={68} 
              color="blue" 
            />
            <SequenceCard 
              title="Seller Outreach — SmartZip" 
              stats="18 predicted sellers · 3 responded" 
              progress={17} 
              color="gold" 
            />
            <SequenceCard 
              title="Post-Close Follow-up" 
              stats="12 past clients · 8 referrals generated" 
              progress={67} 
              color="green" 
            />
          </div>
        </div>
        
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
          <div className="mb-4 pb-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">AI Assistant Suggestions</h3>
          </div>
          <div className="space-y-4">
             <div className="p-3 bg-gold/5 border border-gold/10 rounded-lg group hover:border-gold/30 transition-all cursor-pointer">
               <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                 <Sparkles className="w-3 h-3" /> Draft Suggested
               </div>
               <div className="text-xs text-cream mb-1">Reply to James Okafor</div>
               <div className="text-[10px] text-slate italic line-clamp-2">"Hi James, I've confirmed the showing for 52 Maple Ave at 2:30 PM..."</div>
             </div>
             <button className="w-full py-2 border border-white/5 rounded text-[11px] text-slate hover:text-cream hover:bg-white/5 transition-all">View all suggestions (4)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
        active ? 'bg-gold/10 text-gold shadow-sm' : 'text-slate hover:text-cream'
      }`}
    >
      {label}
    </button>
  );
}

function SequenceCard({ title, stats, progress, color }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    gold: 'bg-gold/10 border-gold/20 text-gold',
    green: 'bg-green-500/10 border-green-500/20 text-green-400'
  };
  
  const barColors: any = {
    blue: 'bg-blue-500',
    gold: 'bg-gold',
    green: 'bg-green-500'
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="font-bold text-xs mb-1">{title}</div>
      <div className="text-[10px] opacity-70 mb-3">{stats}</div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${barColors[color]} rounded-full`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
