import { Zap, Bell, Bot, BarChart3, Mail, CheckCircle2, ChevronRight, Phone, Plus, Edit3, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Workflow } from '../../types';

interface WorkflowCanvasProps {
  workflows: Workflow[];
  onAddWorkflow: () => void;
  onEditWorkflow: (workflow: Workflow) => void;
  onDeleteWorkflow: (id: string) => void;
}

export default function WorkflowCanvas({ workflows, onAddWorkflow, onEditWorkflow, onDeleteWorkflow }: WorkflowCanvasProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'Lead Capture': return <Bell />;
      case 'Deal Finished': return <CheckCircle2 />;
      case 'Valuation Completed': return <Zap />;
      case 'Agent Output Ready': return <Bot />;
      case 'Send Email': return <Mail />;
      case 'Create Task': return <CheckCircle2 />;
      case 'Sequence Group': return <BarChart3 />;
      case 'AI Call': return <Phone />;
      default: return <Zap />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6 relative overflow-hidden">
        {/* Visualizer Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#C9A84C 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-white/5 relative z-10">
          <div>
            <h3 className="text-sm font-semibold text-white">Neural Workflow Visualizer</h3>
            <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest mt-1">Real-time Agent Orchestration Topology</p>
          </div>
          <button 
            onClick={onAddWorkflow}
            className="px-5 py-2 bg-gold text-navy font-bold text-xs rounded hover:bg-gold-light transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> New Chain
          </button>
        </div>

        <div className="space-y-16 relative z-10">
          {workflows.map((workflow, index) => (
            <WorkflowItem 
              key={workflow.id}
              title={`CHAIN ${index + 1}: ${workflow.name}`}
              workflow={workflow}
              onEdit={() => onEditWorkflow(workflow)}
              onDelete={() => onDeleteWorkflow(workflow.id)}
              steps={[
                { icon: getIcon(workflow.trigger), label: workflow.trigger, type: "trigger" },
                { icon: <Bot />, label: "A2A Cognitive Judge", type: "ai" },
                { icon: getIcon(workflow.action), label: workflow.action, type: "action" },
                { icon: <CheckCircle2 />, label: "Execution Logged", type: "end" }
              ]}
            />
          ))}

          {workflows.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-slate border-2 border-dashed border-white/5 rounded-3xl bg-navy/20">
              <div className="w-16 h-16 rounded-full bg-gold/5 flex items-center justify-center mb-6 animate-pulse">
                <Zap className="w-8 h-8 opacity-20 text-gold" />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-light">No Automation Topologies Found</p>
              <p className="text-[10px] text-slate mt-2">Initialize your first A2A agent chain to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowItem({ title, steps, workflow, onEdit, onDelete }: { title: string, steps: any[], workflow: Workflow, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.03]" />
        <div className="text-[9px] text-gold font-bold uppercase tracking-[0.3em] bg-navy-mid px-3 py-1 border border-gold/20 rounded-full">{title}</div>
        <div className="flex items-center gap-2 px-2">
           <button 
             onClick={onEdit}
             className="p-1.5 text-slate hover:text-gold hover:bg-gold/10 rounded transition-all"
             title="Edit Topology"
           >
              <Edit3 className="w-3 h-3" />
           </button>
           <button 
             onClick={onDelete}
             className="p-1.5 text-slate hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
             title="Retire Chain"
           >
              <Trash2 className="w-3 h-3" />
           </button>
        </div>
        <div className="h-px flex-1 bg-white/[0.03]" />
      </div>
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4 md:gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center flex-1 max-w-[280px]">
            {/* The Node */}
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative z-10 w-full"
            >
              <div className={`
                p-5 bg-navy-mid border-2 rounded-2xl flex flex-col items-center text-center gap-3 shadow-xl transition-all h-full
                ${step.type === 'trigger' ? 'border-blue-500/30' : 
                  step.type === 'ai' ? 'border-purple-500/30 shadow-[0_0_20px_rgba(155,89,182,0.1)]' : 
                  step.type === 'end' ? 'border-green-500/30' : 'border-gold/30'}
              `}>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mb-1
                  ${step.type === 'trigger' ? 'bg-blue-500/10 text-blue-400' : 
                    step.type === 'ai' ? 'bg-purple-500/10 text-purple-400' : 
                    step.type === 'end' ? 'bg-green-500/10 text-green-400' : 'bg-gold/10 text-gold'}
                `}>
                  <div className="[&>svg]:w-5 [&>svg]:h-5">{step.icon}</div>
                </div>
                <div>
                   <div className="text-[8px] font-bold text-slate uppercase tracking-widest mb-1">{step.type} node</div>
                   <div className="text-[11px] font-bold text-white leading-tight">{step.label}</div>
                </div>
              </div>
              
              {/* Connector dots */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                   <div className="w-1.5 h-1.5 rounded-full bg-gold/50 shadow-[0_0_8px_#C9A84C]" />
                </div>
              )}
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
                   <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                </div>
              )}
            </motion.div>
            
            {/* The Wire */}
            {i < steps.length - 1 && (
              <div className="flex-1 min-w-[20px] md:min-w-[40px] flex items-center justify-center relative py-4 md:py-0">
                 <div className="h-6 md:h-px w-px md:w-full bg-gradient-to-b md:bg-gradient-to-r from-gold/40 to-gold/10 relative">
                    <motion.div 
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 left-0 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_#C9A84C] hidden md:block"
                      style={{ motionPath: 'path("M 0 0 L 100 0")', offsetPath: 'path("M 0 0 L 100 0")' }}
                    />
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            alert(`Initiating Neural Sequence: ${workflow.name}\nVectorizing trigger data...\nAllocating agent resources...\nSequence Deployed.`);
          }}
          className="flex items-center gap-2 px-6 py-2 bg-navy/40 border border-gold/30 rounded-full text-[10px] font-bold text-gold hover:bg-gold hover:text-navy transition-all shadow-lg active:scale-95 group"
        >
          <Zap className="w-3.5 h-3.5 group-hover:animate-pulse" /> Execute Blueprint Sequence
        </button>
      </div>
    </div>
  );
}
