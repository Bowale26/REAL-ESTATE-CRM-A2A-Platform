import { PanelId, Currency } from '../../types';
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { formatCurrency } from '../../lib/formatters';

export default function Dashboard({ onNavigate, currency }: { onNavigate: (id: PanelId) => void, currency: Currency }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon="💰" label="Pipeline Value" value={formatCurrency(4200000, currency)} change="↑ 18% this month" color="gold" />
        <MetricCard icon="🎯" label="Active Leads" value="134" change="↑ 24 new this week" color="blue" />
        <MetricCard icon="🤝" label="Closings (MTD)" value="7" change="↑ 2 vs last month" color="green" />
        <MetricCard icon="⏰" label="Follow-ups Due" value="28" change="12 overdue" color="red" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
           <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
             <h3 className="text-sm font-semibold text-white">Pipeline Overview</h3>
             <button onClick={() => onNavigate('pipeline')} className="text-[11px] text-gold uppercase tracking-wider font-bold hover:text-gold-light transition-colors">View Board</button>
           </div>
           <div className="h-40 relative px-2 mt-4">
             <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.05"/>
                  </linearGradient>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3498DB" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#3498DB" stopOpacity="0.05"/>
                  </linearGradient>
                </defs>
                <motion.polyline 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  points="0,120 60,95 120,105 180,75 240,80 300,55 360,65 420,40 480,45 540,30 600,25"
                  fill="url(#goldGrad)" stroke="#C9A84C" strokeWidth="2"
                />
                <motion.polyline 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                  points="0,140 60,130 120,125 180,115 240,120 300,100 360,108 420,85 480,90 540,75 600,70"
                  fill="url(#blueGrad)" stroke="#3498DB" strokeWidth="1.5"
                />
                {/* Labels */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m, i) => (
                  <text key={i} x={i * 54.5} y="158" fill="#8A9AB5" fontSize="10" className="opacity-60">
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}
                  </text>
                ))}
             </svg>
             <div className="absolute top-0 right-0 flex gap-4 text-[10px] font-bold">
               <span className="flex items-center gap-1.5 text-gold">● <span className="opacity-60 text-slate uppercase tracking-tighter">Pipeline</span></span>
               <span className="flex items-center gap-1.5 text-blue-500">● <span className="opacity-60 text-slate uppercase tracking-tighter">Closed</span></span>
             </div>
           </div>
        </div>
        
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5 overflow-hidden">
          <div className="mb-4 pb-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            <ActivityItem icon="🤖" text={<span>AI qualified lead: <strong className="text-cream">Sarah Mitchell</strong> — 94% seller probability</span>} time="2 min ago · SmartZip Agent" color="green" />
            <ActivityItem icon="✉️" text={<span>Email sequence triggered for <strong className="text-cream">12 warm leads</strong></span>} time="15 min ago · CINC AI Nurture" color="blue" />
            <ActivityItem icon="🏠" text={<span>New MLS listing matched to <strong className="text-cream">3 buyer leads</strong></span>} time="1 hr ago · MLS Data Agent" color="gold" />
            <ActivityItem icon="⚖️" text={<span>Judge Agent flagged API timeout on <strong className="text-cream">Ylopo sync</strong> — auto-retried</span>} time="2 hr ago · Judge Agent" color="red" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Lead Sources">
          <div className="space-y-4">
            <ProgressBar label="MLS / kvCORE" value={42} />
            <ProgressBar label="Ylopo Social Ads" value={28} />
            <ProgressBar label="SmartZip Predicted" value={18} />
            <ProgressBar label="Referrals" value={12} />
          </div>
        </Card>
        
        <Card title="Tasks Due Today">
          <div className="space-y-4">
            <ActivityItem icon="📞" text={<span>Call back <strong className="text-cream">James Okafor</strong></span>} time="9:00 AM · High Priority" color="red" />
            <ActivityItem icon="🏠" text={<span>Property showing at <strong className="text-cream">142 Elm St</strong></span>} time="2:30 PM · Confirmed" color="gold" />
            <ActivityItem icon="📋" text={<span>Send CMA report to <strong className="text-cream">The Wongs</strong></span>} time="4:00 PM · In Progress" color="blue" />
          </div>
        </Card>

        <Card title="A2A Agent Status">
          <div className="space-y-4">
            <div className="flex gap-3 items-start group">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] mt-1.5" />
              <div>
                <div className="text-xs text-green-400 font-bold mb-0.5">Orchestrator Agent — Active</div>
                <div className="text-[10px] text-slate">Processing 3 tasks</div>
              </div>
            </div>
            <div className="flex gap-3 items-start group">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] mt-1.5" />
              <div>
                <div className="text-xs text-green-400 font-bold mb-0.5">Judge Agent — Monitoring</div>
                <div className="text-[10px] text-slate">47 validations today</div>
              </div>
            </div>
            <div className="flex gap-3 items-start group">
              <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(201,168,76,0.5)] animate-pulse mt-1.5" />
              <div>
                <div className="text-xs text-gold font-bold mb-0.5">MLS Data Agent — Syncing</div>
                <div className="text-[10px] text-slate">1,847 listings refreshed</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, change, color }: any) {
  const borderColors: any = { gold: 'border-gold', blue: 'border-blue-500', green: 'border-green-500', red: 'border-red-500' };
  const shadowColors: any = { gold: 'group-hover:shadow-gold/10', blue: 'group-hover:shadow-blue-500/10', green: 'group-hover:shadow-green-500/10', red: 'group-hover:shadow-red-500/10' };
  
  return (
    <div className={`bg-navy-mid/60 border border-gold/18 rounded-lg p-5 relative overflow-hidden group hover:border-gold/40 transition-all ${shadowColors[color]}`}>
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${color === 'gold' ? 'gold' : color + '-500'} to-transparent opacity-50`} />
      <div className="absolute right-4 top-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0">{icon}</div>
      <div className="text-[11px] text-slate uppercase tracking-wider mb-2 font-semibold">{label}</div>
      <div className="font-serif text-3xl font-bold text-white mb-1">{value}</div>
      <div className={`text-[11px] flex items-center gap-1 ${change.includes('↑') ? 'text-green-400 font-bold' : 'text-slate'}`}>
        {change}
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time, color }: any) {
  const bgColors: any = { green: 'bg-green-500/10', blue: 'bg-blue-500/10', gold: 'bg-gold/10', red: 'bg-red-500/10' };
  return (
    <div className="flex gap-3 items-start group">
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${bgColors[color]}`}>{icon}</div>
      <div>
        <div className="text-xs text-slate-light leading-relaxed group-hover:text-cream transition-colors">{text}</div>
        <div className="text-[10px] text-slate mt-1">{time}</div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
      <div className="mb-4 pb-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ProgressBar({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="text-slate-light font-medium">{label}</span>
        <span className="text-gold font-bold">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
