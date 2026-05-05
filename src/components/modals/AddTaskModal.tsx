import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckSquare, Calendar, Flag, Link, Zap } from 'lucide-react';
import { Task } from '../../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'status'>) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: 'Today',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    category: 'Call',
    linkedTo: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onAdd(formData);
    setFormData({
      title: '',
      dueDate: 'Today',
      priority: 'Medium',
      category: 'Call',
      linkedTo: '',
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
                  <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-gold" /> Create Task
                  </h2>
                  <p className="text-sm text-slate leading-relaxed">Schedule a new action item in the A2A Intelligence engine.</p>
                </div>
                <button onClick={onClose} className="text-slate hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                  <label>Task Description</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Follow up on listing agreement"
                    className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <select
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option className="bg-navy">Today</option>
                      <option className="bg-navy">Tomorrow</option>
                      <option className="bg-navy">Next Week</option>
                      <option className="bg-navy">Custom...</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Flag className="w-3 h-3" /> Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="High" className="bg-navy">High</option>
                      <option value="Medium" className="bg-navy">Medium</option>
                      <option value="Low" className="bg-navy">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px) font-bold text-slate">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    >
                      <option className="bg-navy">Call</option>
                      <option className="bg-navy">Meeting</option>
                      <option className="bg-navy">Review</option>
                      <option className="bg-navy">Admin</option>
                      <option className="bg-navy">Marketing</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 uppercase tracking-wider text-[10px] font-bold text-slate">
                    <label className="flex items-center gap-2">
                      <Link className="w-3 h-3" /> Linked Record
                    </label>
                    <input
                      type="text"
                      value={formData.linkedTo}
                      onChange={(e) => setFormData({ ...formData, linkedTo: e.target.value })}
                      placeholder="e.g. Robert Smith"
                      className="w-full bg-white/5 border border-gold/18 rounded-md px-4 py-2.5 text-sm text-cream focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gold/5 border border-gold/10 rounded-lg flex items-start gap-3">
                   <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                   <p className="text-[10px] text-slate-light leading-relaxed">
                     <span className="font-bold text-gold">AI Suggestion:</span> Based on your recent DNC registry check, calling after 5:00 PM will yield higher connection rates for this contact.
                   </p>
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
                    Create Task
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
