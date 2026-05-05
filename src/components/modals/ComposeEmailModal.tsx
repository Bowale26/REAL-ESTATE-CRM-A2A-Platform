import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, FileText, Send, Sparkles } from 'lucide-react';

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: any) => void;
  initialTo?: string;
  initialSubject?: string;
}

export default function ComposeEmailModal({ isOpen, onClose, onSend, initialTo = '', initialSubject = '' }: ComposeEmailModalProps) {
  const [formData, setFormData] = useState({
    to: initialTo,
    subject: initialSubject,
    body: '',
  });
  const [isDrafting, setIsDrafting] = useState(false);

  const handleAiDraft = () => {
    setIsDrafting(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        body: `Hello ${prev.to.split('@')[0] || 'there'},\n\nI hope you're having a great day. I wanted to follow up regarding the property interest we discussed. Our latest market analysis for that area shows some very promising trends.\n\nWould you be available for a brief call tomorrow afternoon to go over the details?\n\nBest regards,\nYour Real Estate Agent`
      }));
      setIsDrafting(false);
    }, 1500);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.to || !formData.subject) return;
    onSend(formData);
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
            <form onSubmit={handleSubmit} className="flex flex-col h-[600px]">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-navy/40">
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gold" /> Compose Message
                </h2>
                <button type="button" onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-widest">To</label>
                  <input
                    required
                    type="text"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Recipient address or name"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Message subject"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Message Body</label>
                    <button 
                      type="button"
                      onClick={handleAiDraft}
                      disabled={isDrafting}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-gold bg-gold/10 px-2 py-1 rounded border border-gold/20 hover:bg-gold/20 transition-all"
                    >
                      {isDrafting ? 'Writing...' : <><Sparkles className="w-3 h-3" /> AI Autodraft</>}
                    </button>
                  </div>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Write your professional message here..."
                    className="flex-1 w-full bg-white/5 border border-gold/18 rounded-md px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold transition-colors resize-none min-h-[250px]"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-navy/40">
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
                  <Send className="w-4 h-4" /> Send Email
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
