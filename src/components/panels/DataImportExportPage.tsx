import { useState, useRef, ChangeEvent } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCcw, 
  FileText, 
  Database, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DataImportExportPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'mapping' | 'success'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      setUploadStep('uploading');
      
      // Simulate mapping process
      setTimeout(() => {
        setUploadStep('mapping');
      }, 2000);
    }
  };

  const completeImport = () => {
    setUploadStep('success');
    setTimeout(() => {
      setUploadStep('idle');
      setIsUploading(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Data Intelligence Ingest</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Cross-Platform Sync & Bulk Operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Section */}
        <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6 flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                <Upload className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Bulk Import Data</h3>
           </div>

           <div className="flex-1 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-navy/20">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".csv,.xlsx"
              />
              
              <AnimatePresence mode="wait">
                {uploadStep === 'idle' && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-navy border border-gold/20 flex items-center justify-center text-gold">
                      <Cloud className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Drag and drop your contact or lead list</p>
                      <p className="text-[11px] text-slate mt-1">Supports .CSV, .XLSX (Max 250MB)</p>
                    </div>
                    <button 
                      onClick={handleUploadClick}
                      className="px-6 py-2 bg-gold text-navy font-bold text-xs rounded hover:bg-gold-light transition-all shadow-lg active:scale-95"
                    >
                      Browse Files
                    </button>
                  </motion.div>
                )}

                {uploadStep === 'uploading' && (
                  <motion.div 
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 w-full max-w-[200px]"
                  >
                    <RefreshCcw className="w-8 h-8 text-gold animate-spin mx-auto" />
                    <p className="text-xs font-bold text-cream uppercase tracking-widest">Parsing Data...</p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-gold"
                      />
                    </div>
                  </motion.div>
                )}

                {uploadStep === 'mapping' && (
                  <motion.div 
                    key="mapping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-4 text-left"
                  >
                    <div className="flex items-center gap-2 mb-4 bg-gold/5 border border-gold/10 p-2 rounded text-[10px] font-bold text-gold uppercase tracking-widest">
                       <ShieldCheck className="w-3.5 h-3.5" /> AI Automapping Enabled
                    </div>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                       <MappingRow source="first_name" target="First Name" matched />
                       <MappingRow source="last_nm" target="Last Name" matched />
                       <MappingRow source="client_email" target="Email Address" matched />
                       <MappingRow source="prop_address" target="Property Link" matched />
                    </div>
                    <button 
                      onClick={completeImport}
                      className="w-full py-2.5 bg-gold text-navy font-bold text-xs rounded mt-4"
                    >
                      Confirm Import (124 Records)
                    </button>
                  </motion.div>
                )}

                {uploadStep === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-widest">Import Complete</p>
                      <p className="text-xs text-slate mt-1">124 records successfully migrated to Pipeline.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Integration / Cloud Sync */}
        <div className="space-y-6">
           <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-gold" /> Active Integration Sync
              </h3>
              <div className="space-y-3">
                 <IntegrationCard name="Ylopo CRM" status="Synced" lastSync="2 mins ago" icon="Y" color="blue" />
                 <IntegrationCard name="CINC" status="Active" lastSync="1 hour ago" icon="C" color="red" />
                 <IntegrationCard name="Lofty (Chime)" status="Connected" lastSync="Daily" icon="L" color="green" />
              </div>
              <button className="w-full py-2.5 border border-white/5 rounded mt-6 text-xs text-slate hover:text-white hover:bg-white/5 transition-all uppercase font-bold tracking-widest">
                Explore Connections
              </button>
           </div>

           <div className="bg-navy-mid/60 border border-gold/18 rounded-lg p-6">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                 <Download className="w-4 h-4 text-gold" /> System Export
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <ExportButton label="Pipeline (Active)" format="CSV" />
                 <ExportButton label="Full Contact DB" format="XLSX" />
                 <ExportButton label="Task Logs" format="JSON" />
                 <ExportButton label="AI Analytics" format="PDF" />
              </div>
           </div>
        </div>
      </div>

      <div className="bg-navy-mid/40 border border-gold/10 rounded-lg p-5">
         <h4 className="text-xs font-bold text-white uppercase tracking-[2px] mb-4">Historical Activity</h4>
         <div className="space-y-4">
            <HistoryItem action="Import" file="ny_leads_may.csv" user="Me" date="Today, 2:14 PM" status="Success" />
            <HistoryItem action="Export" file="full_pipeline_q1.csv" user="System" date="Yesterday" status="Success" />
            <HistoryItem action="Sync" file="Ylopo Connect" user="Auto" date="2 days ago" status="Success" />
         </div>
      </div>
    </div>
  );
}

function MappingRow({ source, target, matched }: { source: string, target: string, matched: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px] p-2 bg-black/20 rounded border border-white/5">
      <div className="flex items-center gap-2 font-mono text-slate">
        {source}
      </div>
      <ArrowRight className="w-3 h-3 text-gold/50" />
      <div className="flex items-center gap-2 text-cream font-bold">
        {target}
        {matched && <CheckCircle2 className="w-3 h-3 text-green-400" />}
      </div>
    </div>
  );
}

function IntegrationCard({ name, status, lastSync, icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400'
  };
  
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between ${colors[color]}`}>
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-black/30 flex items-center justify-center font-bold text-white border border-white/10 uppercase">
             {icon}
          </div>
          <div>
             <div className="text-xs font-bold text-white">{name}</div>
             <div className="text-[10px] text-slate-light mt-0.5">Last Sync: {lastSync}</div>
          </div>
       </div>
       <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{status}</span>
       </div>
    </div>
  );
}

function ExportButton({ label, format }: { label: string, format: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-navy/40 border border-white/5 rounded-xl hover:border-gold/30 transition-all group">
       <FileText className="w-5 h-5 text-slate group-hover:text-gold transition-colors mb-2" />
       <div className="text-[11px] font-bold text-white group-hover:text-gold transition-colors">{label}</div>
       <div className="text-[9px] text-slate mt-1">{format} Format</div>
    </button>
  );
}

function HistoryItem({ action, file, user, date, status }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
       <div className="flex items-center gap-4 flex-1">
          <div className="text-[10px] font-bold text-gold uppercase tracking-widest w-16">{action}</div>
          <div className="text-xs text-cream truncate max-w-xs">{file}</div>
       </div>
       <div className="flex items-center gap-8">
          <div className="text-[10px] text-slate font-medium">By {user}</div>
          <div className="text-[10px] text-slate font-medium">{date}</div>
          <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{status}</div>
       </div>
    </div>
  );
}
