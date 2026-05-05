import { motion } from 'motion/react';
import { Deal } from '../../types';

interface PipelineBoardProps {
  deals: Deal[];
  onAddDeal: () => void;
}

export default function PipelineBoard({ deals, onAddDeal }: PipelineBoardProps) {
  const colColors: any = {
    'Lead': 'text-blue-400',
    'Qualify': 'text-orange-400',
    'Proposal': 'text-gold',
    'Negotiate': 'text-purple-400',
    'Closed': 'text-green-400'
  };

  const stages = ['Lead', 'Qualify', 'Proposal', 'Negotiate', 'Closed'];

  return (
    <div className="space-y-6">
      <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Sales Pipeline — Kanban Board</h3>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 border border-gold/18 rounded text-[11px] font-medium text-slate-light hover:text-gold transition-colors">📊 Analytics View</button>
           <button 
             onClick={onAddDeal}
             className="px-3 py-1.5 bg-gold text-navy font-bold text-[11px] rounded hover:bg-gold-light transition-all"
           >
             + Add Deal
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((col) => {
          const stageDeals = deals.filter(d => d.stage === col);
          return (
            <div key={col} className="bg-navy-mid/30 border border-gold/18 rounded-xl p-4 flex flex-col min-h-[400px]">
              <div className={`text-[10px] font-bold uppercase tracking-[2px] mb-5 pb-3 border-b border-white/5 flex items-center justify-between ${colColors[col]}`}>
                {col}
                <span className="bg-white/5 px-1.5 py-0.5 rounded text-white/40">{stageDeals.length}</span>
              </div>
              <div className="space-y-3 flex-1">
                 {stageDeals.map((card) => (
                   <motion.div 
                     key={card.id}
                     whileHover={{ y: -2, border: '1px solid #C9A84C' }}
                     className="bg-navy-mid/80 border border-gold/18 rounded-lg p-3.5 shadow-lg cursor-grab active:cursor-grabbing group transition-all"
                   >
                     <div className="text-[13px] font-bold text-white group-hover:text-gold mb-1 transition-colors">{card.name}</div>
                     <div className="text-[12px] font-bold text-gold/80 mb-2">{card.val}</div>
                     <div className="text-[10px] text-slate font-medium flex items-center gap-1.5">
                       <span className="w-1 h-1 rounded-full bg-slate/40" />
                       {card.meta}
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
