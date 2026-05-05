import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Home, Shield, Zap } from 'lucide-react';
import { Contact } from '../../types';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: Omit<Contact, 'id' | 'score' | 'lastContact'>) => void;
  editingContact?: Contact | null;
}

export default function AddContactModal({ isOpen, onClose, onAdd, editingContact }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Buyer',
    phone: '',
    property: '',
    status: 'warm' as 'hot' | 'warm' | 'cold',
  });

  // Load editing data
  const [lastEditingId, setLastEditingId] = useState<string | null>(null);
  
  if (editingContact && editingContact.id !== lastEditingId) {
    setFormData({
      name: editingContact.name,
      email: editingContact.email || '',
      type: editingContact.type,
      phone: editingContact.phone,
      property: editingContact.property || '',
      status: editingContact.status as any
    });
    setLastEditingId(editingContact.id);
  } else if (!editingContact && lastEditingId !== null) {
    setFormData({
      name: '',
      email: '',
      type: 'Buyer',
      phone: '',
      property: '',
      status: 'warm',
    });
    setLastEditingId(null);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    onAdd({
      ...formData,
      tags: [],
      history: []
    });
    setFormData({
      name: '',
      email: '',
      type: 'Buyer',
      phone: '',
      property: '',
      status: 'warm',
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
                  <h2 className="font-serif text-2xl font-bold text-white mb-1">{editingContact ? '✒️ Refine Contact' : '➕ Add New Contact'}</h2>
                  <p className="text-sm text-slate leading-relaxed">Enter the details of your new lead or client to sync with the A2A Intelligence network.</p>
                </div>
                <button onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label className="flex items-center gap-2">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Robert Smith"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Shield className="w-3 h-3" /> Contact Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option className="bg-navy">Buyer</option>
                      <option className="bg-navy">Seller</option>
                      <option className="bg-navy">Investor</option>
                      <option className="bg-navy">Past Client</option>
                    </select>
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

                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label className="flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. (416) 555-0123"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label className="flex items-center gap-2">
                    <Home className="w-3 h-3" /> Property Interest / Address
                  </label>
                  <input
                    type="text"
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    placeholder="e.g. 52 Maple Ave, Toronto"
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
                    {editingContact ? 'Commit Changes' : 'Add to CRM'}
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
