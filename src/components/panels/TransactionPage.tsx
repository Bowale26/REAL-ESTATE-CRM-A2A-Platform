import { useState } from 'react';
import { 
  BarChart3, 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  MoreHorizontal, 
  ChevronRight,
  FileText,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  User,
  Zap,
  FolderLock,
  Trash2,
  Edit3,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSACTIONS_DATA, AGENTS_DATA } from '../../constants';
import { Transaction, TransactionDoc, Currency, DateFormat } from '../../types';
import { formatCurrency, formatDate } from '../../lib/formatters';

const STAGES = ['Qualified', 'Showing', 'Offer Submitted', 'Under Contract', 'Closing'];

interface TransactionPageProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
  onEditTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currency: Currency;
  dateFormat: DateFormat;
}

export default function TransactionPage({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction, currency, dateFormat }: TransactionPageProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'docs'>('pipeline');
  const [selectedDeal, setSelectedDeal] = useState<Transaction | null>(null);
  const [isLaunchingDeal, setIsLaunchingDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Transaction | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Transaction>>({
    dealName: '',
    clientName: '',
    value: '',
    stage: 'Qualified',
    expectedClosing: '',
    agentId: AGENTS_DATA[0]?.id,
    documents: []
  });

  const handleOpenLaunch = () => {
    setFormData({
      dealName: '',
      clientName: '',
      value: '',
      stage: 'Qualified',
      expectedClosing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      agentId: AGENTS_DATA[0]?.id,
      documents: []
    });
    setEditingDeal(null);
    setIsLaunchingDeal(true);
  };

  const handleOpenEdit = (deal: Transaction) => {
    setFormData(deal);
    setEditingDeal(deal);
    setIsLaunchingDeal(true);
  };

  const handleSubmit = () => {
    if (!formData.dealName || !formData.value || !formData.clientName) return;

    if (editingDeal) {
      onEditTransaction({ ...editingDeal, ...formData } as Transaction);
    } else {
      onAddTransaction(formData as Omit<Transaction, 'id'>);
    }
    setIsLaunchingDeal(false);
    setEditingDeal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Tactical Transaction Control</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Cross-Border Compliance & Deal Flow</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + ["Deal,Value,Stage,Client,Closing"].concat(transactions.map(t => `${t.dealName},${t.value},${t.stage},${t.clientName},${t.expectedClosing}`)).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "transaction_ledger.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-navy/40 border border-white/10 rounded-md text-[11px] font-bold text-slate hover:text-white transition-all shadow-lg"
          >
             <Zap className="w-3.5 h-3.5" /> Export Ledger
          </button>
          <div className="flex bg-navy-mid border border-gold/18 rounded-md p-1">
             <button 
               onClick={() => setActiveTab('pipeline')}
               className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === 'pipeline' ? 'bg-gold text-navy' : 'text-slate hover:text-white'}`}
             >
               Pipeline View
             </button>
             <button 
               onClick={() => setActiveTab('docs')}
               className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === 'docs' ? 'bg-gold text-navy' : 'text-slate hover:text-white'}`}
             >
               Document Vault
             </button>
          </div>
          <button 
            onClick={handleOpenLaunch}
            className="flex items-center gap-2 px-4 py-2 bg-gold rounded-md text-[11px] font-bold text-navy hover:bg-gold-light transition-all shadow-lg active:scale-95"
          >
             <Plus className="w-3.5 h-3.5" /> Launch Deal
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pipeline' ? (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-[700px]"
          >
            {STAGES.map(stage => (
              <PipelineColumn 
                key={stage} 
                stage={stage} 
                deals={transactions.filter(t => t.stage === stage)} 
                currency={currency}
                dateFormat={dateFormat}
                onSelect={setSelectedDeal}
                onEdit={handleOpenEdit}
                onDelete={onDeleteTransaction}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="vault"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6"
          >
             <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                     <FolderLock className="w-4 h-4 text-gold" /> Sovereign Document Vault
                   </h3>
                   <div className="flex items-center gap-4 text-[10px] text-slate font-bold uppercase">
                      <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" /> Verified: 84%</div>
                      <div className="flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-amber-400" /> Pending: 12</div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   <DocCategory name="Contracts" count={12} status="ready" />
                   <DocCategory name="Disclosures" count={8} status="pending" />
                   <DocCategory name="Inspections" count={5} status="ready" />
                   <DocCategory name="Financing" count={4} status="danger" />
                   <DocCategory name="Title & Taxes" count={6} status="ready" />
                   <DocCategory name="Closing Docs" count={2} status="pending" />
                </div>

                <div className="mt-8">
                   <h4 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4">Recent Multi-Market Uploads</h4>
                   <div className="space-y-2">
                       {transactions[0]?.documents.map(doc => (
                         <DocRow key={doc.id} doc={doc} dateFormat={dateFormat} />
                       ))}
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-5">
                   <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Compliance Ledger
                   </h4>
                   <div className="space-y-4">
                      <ComplianceStep label="ID Verification" status="complete" />
                      <ComplianceStep label="Anti-Money Laundering" status="complete" />
                      <ComplianceStep label="Escrow Clearance" status="pending" />
                      <ComplianceStep label="Zoning Verification" status="pending" />
                   </div>
                </div>

                <div className="bg-gold/5 border border-gold/20 rounded-lg p-5">
                   <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-4 h-4 text-gold" />
                      <h4 className="text-xs font-bold text-white uppercase">Upcoming Deadlines</h4>
                   </div>
                   <div className="space-y-3">
                      <DeadlineItem label="Inspection Contingency" date="May 8" />
                      <DeadlineItem label="Mortgage Commitment" date="May 12" />
                      <DeadlineItem label="Final Walkthrough" date="June 14" />
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Detail Panel */}
      <AnimatePresence>
        {selectedDeal && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md bg-navy-mid border-l border-gold/30 shadow-2xl h-full p-8 overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedDeal(null)}
                className="mb-8 text-slate hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Pipeline
              </button>

              <div className="mb-8 pb-8 border-b border-white/5 flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-serif font-bold text-cream mb-2">{selectedDeal.dealName}</h3>
                    <div className="text-3xl font-bold text-gold mb-4">{formatCurrency(selectedDeal.value, currency)}</div>
                    <div className="flex items-center gap-3">
                       <span className="px-3 py-1 bg-gold/10 border border-gold/30 text-[10px] font-bold text-gold uppercase tracking-widest rounded-full">{selectedDeal.stage}</span>
                       <span className="text-xs text-slate-light font-medium">Closing: {formatDate(selectedDeal.expectedClosing, dateFormat)}</span>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleOpenEdit(selectedDeal)} className="p-2 bg-navy rounded border border-white/10 text-slate hover:text-gold transition-colors">
                       <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        onDeleteTransaction(selectedDeal.id);
                        setSelectedDeal(null);
                      }} 
                      className="p-2 bg-navy rounded border border-white/10 text-slate hover:text-red-400 transition-colors"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4">Core Participants</h4>
                    <div className="flex items-center justify-between p-3 bg-navy/40 border border-white/5 rounded-xl">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-[10px]">C</div>
                          <div>
                             <div className="text-xs text-white font-bold">{selectedDeal.clientName}</div>
                             <div className="text-[9px] text-slate font-medium">Primary Buyer</div>
                          </div>
                       </div>
                       <button className="text-[10px] text-gold font-bold uppercase">Contact</button>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4">Milestone Progress</h4>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                       <div className="h-full bg-gold w-[60%] shadow-[0_0_10px_#C9A84C]" />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-slate uppercase tracking-widest">
                       <span>Activation</span>
                       <span className="text-gold">60% Complete</span>
                       <span>Sold</span>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-bold text-slate uppercase tracking-widest mb-4">AI Insight</h4>
                    <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl text-[11px] text-cream leading-relaxed flex gap-3">
                       <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                       A2A Agent suggests prioritizing the Inspection contingencies. The seller is motivated and responding to inquiries <strong className="text-gold">14% faster</strong> than average.
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deal Launcher Modal */}
      <AnimatePresence>
        {isLaunchingDeal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-navy-mid border border-gold/30 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
             >
                <div className="p-6 border-b border-gold/10 bg-navy/40 flex items-center justify-between">
                   <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">{editingDeal ? 'Modify Asset Intel' : 'Initialize Asset Launch'}</h3>
                   <button onClick={() => setIsLaunchingDeal(false)} className="text-slate hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5 rotate-[45deg]" />
                   </button>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-4">
                   <div className="space-y-1 col-span-2">
                      <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Property Name / Address</label>
                      <input 
                        value={formData.dealName}
                        onChange={e => setFormData({ ...formData, dealName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                        placeholder="e.g. 142 Sovereign Heights" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Client Identity</label>
                      <input 
                        value={formData.clientName}
                        onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                        placeholder="e.g. Alex Mercer" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Asset Value ($)</label>
                      <input 
                        value={formData.value}
                        onChange={e => setFormData({ ...formData, value: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                        placeholder="e.g. 1250000" 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Pipeline Stage</label>
                      <select 
                        value={formData.stage}
                        onChange={e => setFormData({ ...formData, stage: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none appearance-none"
                      >
                         {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gold uppercase tracking-widest">Expected Closing</label>
                      <input 
                        value={formData.expectedClosing}
                        onChange={e => setFormData({ ...formData, expectedClosing: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:border-gold outline-none" 
                        placeholder="e.g. May 20" 
                      />
                   </div>
                </div>

                <div className="p-6 bg-navy/40 border-t border-gold/10 flex justify-end gap-3">
                   <button onClick={() => setIsLaunchingDeal(false)} className="px-5 py-2 text-[11px] font-bold text-slate hover:text-white transition-colors uppercase tracking-widest">Abort</button>
                   <button onClick={handleSubmit} className="px-6 py-2 bg-gold text-navy rounded text-[11px] font-bold uppercase tracking-widest shadow-lg">
                      {editingDeal ? 'Update Asset' : 'Commit Launch'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ColumnProps {
  stage: string;
  deals: Transaction[];
  currency: Currency;
  dateFormat: DateFormat;
  onSelect: (d: Transaction) => void;
  onEdit: (d: Transaction) => void;
  onDelete: (id: string) => void;
}

function PipelineColumn({ stage, deals, currency, dateFormat, onSelect, onEdit, onDelete }: ColumnProps) {
  return (
    <div className="flex flex-col h-full bg-navy/20 border border-white/5 rounded-lg">
       <div className="p-3 border-b border-white/5 flex items-center justify-between bg-navy/40">
          <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest">{stage}</h4>
          <span className="text-[10px] text-slate font-bold bg-white/5 w-5 h-5 flex items-center justify-center rounded-full">{deals.length}</span>
       </div>
       <div className="p-2 space-y-3 flex-1 overflow-y-auto">
          {deals.map(deal => (
            <motion.div 
              key={deal.id}
              whileHover={{ y: -2 }}
              className="group p-4 bg-navy-mid/60 border border-gold/18 rounded-lg shadow-lg cursor-pointer hover:border-gold transition-all relative overflow-hidden"
            >
               <div onClick={() => onSelect(deal)}>
                 <div className="text-[11px] font-bold text-white mb-2 line-clamp-1">{deal.dealName}</div>
                 <div className="text-lg font-bold text-cream mb-3">{formatCurrency(deal.value, currency)}</div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-2">
                       <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-white/10 flex items-center justify-center text-[8px] text-blue-400 font-bold uppercase">C</div>
                       <div className="w-5 h-5 rounded-full bg-gold/20 border border-white/10 flex items-center justify-center text-[8px] text-gold font-bold uppercase">A</div>
                    </div>
                    <div className="text-[9px] text-slate font-bold uppercase tracking-widest">{formatDate(deal.expectedClosing, dateFormat)}</div>
                 </div>
               </div>

               {/* Action Overlay */}
               <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
                    className="p-1.5 bg-navy border border-white/10 rounded hover:text-gold transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }}
                    className="p-1.5 bg-navy border border-white/10 rounded hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
               </div>
            </motion.div>
          ))}
       </div>
    </div>
  );
}

function DocCategory({ name, count, status }: { name: string, count: number, status: 'ready' | 'pending' | 'danger' }) {
  return (
    <div className="p-4 bg-navy/40 border border-white/5 rounded-xl flex items-center justify-between hover:border-gold/30 transition-all cursor-pointer group">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-colors">
            <FolderOpen className="w-4 h-4 text-gold" />
          </div>
          <div>
             <div className="text-xs font-bold text-white">{name}</div>
             <div className="text-[10px] text-slate">{count} Files</div>
          </div>
       </div>
       <CheckCircle2 className={`w-4 h-4 ${status === 'ready' ? 'text-green-400' : status === 'pending' ? 'text-slate' : 'text-red-400'}`} />
    </div>
  );
}

function DocRow({ doc, dateFormat }: { doc: TransactionDoc, dateFormat: DateFormat }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/2 rounded border border-white/5 hover:bg-white/5 transition-colors group">
       <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-slate group-hover:text-gold" />
          <div className="text-[11px] font-medium text-cream">{doc.name}</div>
       </div>
       <div className="flex items-center gap-4">
          <span className="text-[9px] text-slate font-bold uppercase tracking-widest">{formatDate(doc.uploadedAt, dateFormat)}</span>
          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
            doc.status === 'Verified' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
          }`}>{doc.status}</span>
       </div>
    </div>
  );
}

function ComplianceStep({ label, status }: { label: string, status: 'complete' | 'pending' }) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[11px] text-cream font-medium">{label}</span>
       {status === 'complete' ? (
         <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
       ) : (
         <div className="w-3.5 h-3.5 rounded-full border border-slate" />
       )}
    </div>
  );
}

function DeadlineItem({ label, date }: { label: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
       <span className="text-[11px] text-slate-light font-medium">{label}</span>
       <span className="text-[11px] text-gold font-bold">{date}</span>
    </div>
  );
}
