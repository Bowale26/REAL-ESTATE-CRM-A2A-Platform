import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Anchor, Layout, Search, Calculator, Facebook, Zap } from 'lucide-react';
import { CaptureChannel } from '../../types';

interface CreateCapturePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (channel: Omit<CaptureChannel, 'id' | 'leadsGenerated' | 'conversion' | 'url'>) => void;
}

export default function CreateCapturePageModal({ isOpen, onClose, onAdd }: CreateCapturePageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Landing Page' as CaptureChannel['type'],
    status: 'Active' as const,
    revenuePerLead: '$0',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onAdd(formData);
    setFormData({
      name: '',
      type: 'Landing Page',
      status: 'Active',
      revenuePerLead: '$0',
    });
    onClose();
  };

  const types = [
    { id: 'Landing Page', icon: <Layout />, desc: 'Custom conversion page' },
    { id: 'IDX Search', icon: <Search />, desc: 'Real-time MLS search' },
    { id: 'Valuation', icon: <Calculator />, desc: 'Home value estimator' },
    { id: 'Social Ad', icon: <Facebook />, desc: 'Meta/Social integration' },
  ];

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
            className="relative w-full max-w-xl bg-navy-mid border border-gold/30 rounded-2xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
              <div className="p-7 border-b border-white/5 bg-navy/40 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Anchor className="w-6 h-6 text-gold" /> New Lead Funnel
                  </h2>
                  <p className="text-xs text-slate-light italic">Powered by A2A Cognitive Architecture</p>
                </div>
                <button type="button" onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-7 space-y-6 overflow-y-auto">
                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-gold">
                  <label>Funnel Campaign Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Waterfront Listings 2024"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-gold">
                  <label>Select Funnel Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {types.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t.id as any })}
                        className={`p-4 rounded-xl border text-left transition-all group ${
                          formData.type === t.id 
                            ? 'bg-gold/15 border-gold shadow-[0_0_15px_-5px_rgba(201,168,76,0.5)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                          formData.type === t.id ? 'bg-gold text-navy' : 'bg-white/5 text-slate group-hover:text-gold'
                        }`}>
                          {t.icon}
                        </div>
                        <div className={`text-xs font-bold mb-1 ${formData.type === t.id ? 'text-white' : 'text-slate-light'}`}>{t.id}</div>
                        <div className="text-[10px] opacity-60 line-clamp-1 text-slate">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-start gap-4">
                  <Zap className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[11px] font-bold text-gold uppercase tracking-widest mb-1 font-serif">A2A Predictive Analytics</div>
                    <p className="text-[10px] text-slate-light leading-relaxed">
                      AI will automatically tailor the landing page copy based on the visitor's browsing history and geographics for maximum conversion.
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
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-gold text-navy rounded-md font-bold text-xs hover:bg-gold-light transition-all shadow-lg flex items-center gap-2"
                >
                  Deploy Channel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
