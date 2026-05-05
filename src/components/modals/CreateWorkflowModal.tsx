import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Bell, Bot, BarChart3, Mail, CheckCircle2, ChevronRight, Phone, Send, Plus, Trash2 } from 'lucide-react';
import { Workflow } from '../../types';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (workflow: Omit<Workflow, 'id'>) => void;
  editingWorkflow?: Workflow | null;
}

export default function CreateWorkflowModal({ isOpen, onClose, onAdd, editingWorkflow }: CreateWorkflowModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    trigger: 'Lead Capture',
    action: 'Send Email',
    status: 'active' as 'active' | 'draft',
  });

  // Effect to load editing data
  const [lastEditingId, setLastEditingId] = useState<string | null>(null);
  
  if (editingWorkflow && editingWorkflow.id !== lastEditingId) {
    setFormData({
      name: editingWorkflow.name,
      trigger: editingWorkflow.trigger,
      action: editingWorkflow.action,
      status: editingWorkflow.status
    });
    setLastEditingId(editingWorkflow.id);
  } else if (!editingWorkflow && lastEditingId !== null) {
    setFormData({
      name: '',
      trigger: 'Lead Capture',
      action: 'Send Email',
      status: 'active',
    });
    setLastEditingId(null);
  }

  const triggers = [
    { id: 'Lead Capture', icon: <Bell className="w-4 h-4" /> },
    { id: 'Deal Finished', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'Valuation Completed', icon: <Zap className="w-4 h-4" /> },
    { id: 'Agent Output Ready', icon: <Bot className="w-4 h-4" /> },
  ];

  const actions = [
    { id: 'Send Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'Create Task', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'Sequence Group', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'AI Call', icon: <Phone className="w-4 h-4" /> },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onAdd({
      ...formData,
      nodes: 3 + Math.floor(Math.random() * 5),
    });
    setFormData({
      name: '',
      trigger: 'Lead Capture',
      action: 'Send Email',
      status: 'active',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-navy-mid border border-gold/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              <div className="p-7 border-b border-white/5 bg-navy/40 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-gold" /> {editingWorkflow ? 'Refine Topology' : 'Construct New Workflow'}
                  </h2>
                  <p className="text-xs text-slate-light italic tracking-widest uppercase">Autonomous Agent Sequence Builder</p>
                </div>
                <button type="button" onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-7 space-y-8 overflow-y-auto">
                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-gold">
                  <label>Sequence Identity / Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Luxury Buyer Engagement Loop"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="uppercase tracking-wider text-[10px] font-bold text-gold block">1. Entry Trigger</label>
                    <div className="space-y-2">
                      {triggers.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, trigger: t.id })}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                            formData.trigger === t.id 
                              ? 'bg-blue-400/10 border-blue-400 text-blue-400' 
                              : 'bg-white/5 border-white/5 text-slate-light hover:border-white/20'
                          }`}
                        >
                          <span className="opacity-70">{t.icon}</span>
                          <span className="text-xs font-bold">{t.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="uppercase tracking-wider text-[10px] font-bold text-gold block">2. Automated Response</label>
                    <div className="space-y-2">
                      {actions.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, action: a.id })}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                            formData.action === a.id 
                              ? 'bg-purple-400/10 border-purple-400 text-purple-400' 
                              : 'bg-white/5 border-white/5 text-slate-light hover:border-white/20'
                          }`}
                        >
                          <span className="opacity-70">{a.icon}</span>
                          <span className="text-xs font-bold">{a.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gold uppercase tracking-wider mb-1 font-serif">A2A Intelligent Intercept</div>
                    <p className="text-[11px] text-slate-light leading-relaxed">
                      Our cognitive engine will insert a validation node between the trigger and action to ensure data integrity and lead scoring accuracy before execution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-7 border-t border-white/5 bg-navy/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gold/18 rounded-md text-slate-light hover:text-gold transition-all text-xs font-bold"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-10 py-2.5 bg-gold text-navy rounded-md font-bold text-xs hover:bg-gold-light transition-all shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> {editingWorkflow ? 'Commit Changes' : 'Deploy Workflow'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
