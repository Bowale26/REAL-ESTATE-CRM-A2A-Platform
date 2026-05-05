import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, DollarSign, Target, MessageSquare, Shield, Zap } from 'lucide-react';
import { Lead } from '../../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lead: Omit<Lead, 'id' | 'probability' | 'chatbotStatus'>) => void;
  editingLead?: Lead | null;
}

export default function AddLeadModal({ isOpen, onClose, onAdd, editingLead }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    propertyType: 'Single Family' as const,
    source: 'SmartZip',
    urgency: '3-6 Months' as const,
    interest: 'Buy' as 'Buy' | 'Sell' | 'Invest',
    budget: '',
    status: 'warm' as 'hot' | 'warm' | 'cold',
    financingStatus: 'Need Help' as const
  });

  // Load editing data
  const [lastEditingId, setLastEditingId] = useState<string | null>(null);
  
  if (editingLead && editingLead.id !== lastEditingId) {
    setFormData({
      name: editingLead.name,
      email: editingLead.email || '',
      phone: editingLead.phone || '',
      location: editingLead.location || '',
      propertyType: editingLead.propertyType as any || 'Single Family',
      source: editingLead.source as any || 'SmartZip',
      urgency: editingLead.urgency as any || '3-6 Months',
      interest: editingLead.interest as any || 'Buy',
      budget: editingLead.budget,
      status: editingLead.status as any,
      financingStatus: editingLead.financingStatus as any || 'Need Help'
    });
    setLastEditingId(editingLead.id);
  } else if (!editingLead && lastEditingId !== null) {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      propertyType: 'Single Family',
      source: 'SmartZip',
      urgency: '3-6 Months',
      interest: 'Buy',
      budget: '',
      status: 'warm',
      financingStatus: 'Need Help'
    });
    setLastEditingId(null);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.budget) return;
    onAdd(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      propertyType: 'Single Family',
      source: 'SmartZip',
      urgency: '3-6 Months',
      interest: 'Buy',
      budget: '',
      status: 'warm',
      financingStatus: 'Need Help'
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
                  <h2 className="font-serif text-2xl font-bold text-white mb-1">{editingLead ? '✒️ Refine Lead' : '🎯 Add New Lead'}</h2>
                  <p className="text-sm text-slate leading-relaxed">Capture a new lead to trigger AI qualification and nurture workflows.</p>
                </div>
                <button onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label className="flex items-center gap-2">
                    <User className="w-3 h-3" /> Lead Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Michael Chen"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Target className="w-3 h-3" /> Lead Source
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option className="bg-navy">SmartZip</option>
                      <option className="bg-navy">Ylopo</option>
                      <option className="bg-navy">kvCORE</option>
                      <option className="bg-navy">AgentLocator</option>
                      <option className="bg-navy">CINC</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Shield className="w-3 h-3" /> Interest
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value as any })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="Buy" className="bg-navy">Buy</option>
                      <option value="Sell" className="bg-navy">Sell</option>
                      <option value="Invest" className="bg-navy">Invest</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3" /> Budget / Value
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. $1.2M"
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="hot" className="bg-navy">Hot</option>
                      <option value="warm" className="bg-navy">Warm</option>
                      <option value="cold" className="bg-navy">Cold</option>
                    </select>
                  </div>
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
                    {editingLead ? 'Commit Changes' : 'Capture Lead'}
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
