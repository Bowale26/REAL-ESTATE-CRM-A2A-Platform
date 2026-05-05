import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, DollarSign, Briefcase, Info, ListFilter } from 'lucide-react';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (deal: { name: string; val: string; meta: string; stage: string }) => void;
}

export default function AddDealModal({ isOpen, onClose, onAdd }: AddDealModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    val: '',
    source: 'Manual',
    stage: 'Lead',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.val) return;
    
    onAdd({
      name: formData.name,
      val: formData.val.startsWith('$') ? formData.val : `$${formData.val}`,
      meta: `${formData.source} · Just now`,
      stage: formData.stage,
    });
    
    setFormData({
      name: '',
      val: '',
      source: 'Manual',
      stage: 'Lead',
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
            className="relative w-full max-w-lg bg-navy-mid border border-gold/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-7">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white mb-1">💼 Add New Deal</h2>
                  <p className="text-sm text-slate leading-relaxed">Place a new opportunity into your sales pipeline to track conversion.</p>
                </div>
                <button onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label className="flex items-center gap-2">
                    <User className="w-3 h-3" /> Deal / Client Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Thompson Purchase"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3" /> Deal Value
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.val}
                      onChange={(e) => setFormData({ ...formData, val: e.target.value })}
                      placeholder="e.g. $1.2M"
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <ListFilter className="w-3 h-3" /> Initial Stage
                    </label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option className="bg-navy">Lead</option>
                      <option className="bg-navy">Qualify</option>
                      <option className="bg-navy">Proposal</option>
                      <option className="bg-navy">Negotiate</option>
                      <option className="bg-navy">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label className="flex items-center gap-2">
                    <Info className="w-3 h-3" /> Source / Context
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g. Referral, kvCORE, MLS"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="mt-7 flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 border border-gold/18 rounded-md text-slate-light hover:text-gold hover:border-gold transition-all text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gold text-navy rounded-md font-bold text-xs hover:bg-gold-light transition-all shadow-lg flex items-center gap-2"
                  >
                    Add to Pipeline
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
