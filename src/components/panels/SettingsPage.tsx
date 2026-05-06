import { useState, useEffect } from 'react';
import { 
  Globe, 
  DollarSign, 
  Calendar, 
  Map, 
  Shield, 
  Bell, 
  Smartphone, 
  CheckCircle2, 
  Zap,
  RefreshCcw,
  User,
  Mail,
  Key,
  CreditCard,
  History,
  TrendingUp,
  CreditCard as CardIcon,
  Crown,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Currency, DateFormat } from '../../types';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../lib/AuthContext';

interface SettingsProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  dateFormat: DateFormat;
  setDateFormat: (f: DateFormat) => void;
  onSync: () => void;
}

export default function SettingsPage({ currency, setCurrency, dateFormat, setDateFormat, onSync }: SettingsProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    aiAlerts: true
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for initial state
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'customers', auth.currentUser.uid, 'subscriptions'),
      where('status', 'in', ['trialing', 'active'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (subs.length > 0) {
        setSubscription(subs[0]);
      } else {
        // Fallback mock if no real Firestore data exists yet
        setSubscription({
          status: 'trialing',
          role: 'Explorer',
          expires: '7 Days'
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    onSync();
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleSubscribe = async (plan: typeof PLANS[0], trial: boolean = false) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.id,
          userId: user.uid,
          userEmail: user.email,
          trialEnabled: trial
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Failed to initiate checkout. Please check the network console.');
    }
  };

  const PLANS = [
    { 
      id: 'price_1TTsHhBMbxh6jv0CWt2ow7ZR', 
      name: 'Trial Explorer', 
      price: 'Free Trial', 
      features: ['7-Day Free Access', 'Full A2A Suite', 'Standard Support'], 
      color: 'gold',
      trial: true
    },
    { 
      id: 'price_1TTsHhBMbxh6jv0CWt2ow7ZR', 
      name: 'Monthly Pro', 
      price: '$29.99', 
      features: ['Full A2A Suite', 'Real-time MLS', 'Neural Staging'], 
      color: 'gold',
      trial: false
    },
    { 
      id: 'price_1TTsN3BMbxh6jv0CoYgrJglw', 
      name: 'Enterprise Yearly', 
      price: '$299.99', 
      features: ['Priority Sync', 'Multi-Office Auth', 'Direct VIP Agent'], 
      color: 'gold-light',
      trial: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif tracking-tight">Global System Configuration</h2>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em] mt-1">Cross-Border Operations Hub</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-md text-[11px] font-bold text-gold hover:bg-gold/10 transition-all shadow-lg disabled:opacity-50"
        >
          {isSyncing ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
          {isSyncing ? 'Synchronizing State...' : 'Force Global State Sync'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Billing & Subscription */}
        <div className="lg:col-span-3">
           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-8 relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <CreditCard className="w-48 h-48 text-gold" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8 relative z-10">
                 <div>
                    <h3 className="text-xl font-serif font-bold text-white mb-2">Billing & Agency Subscription</h3>
                    <p className="text-[11px] text-slate-light font-bold uppercase tracking-[0.2em]">Manage your multi-agent network investment</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg">
                       <p className="text-[8px] font-bold text-gold uppercase tracking-widest mb-1">Active Account Tier</p>
                       <p className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
                          {subscription?.role || 'Explorer'} {subscription?.status === 'trialing' ? 'Trial' : ''}
                          <span className="text-[8px] bg-gold text-navy px-1.5 py-0.5 rounded ml-2">Exp: {subscription?.expires || 'N/A'}</span>
                       </p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 {/* Payment Methods */}
                 <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <CardIcon className="w-3.5 h-3.5 text-gold" /> Master Payment Method
                       </h4>
                       <button className="text-[10px] font-bold text-gold hover:underline uppercase tracking-widest">
                          + Add New Card
                       </button>
                    </div>
                    
                    <div className="p-5 bg-navy border border-white/5 rounded-xl flex items-center justify-between group hover:border-gold/20 transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white italic">VISA</div>
                          <div>
                             <p className="text-[11px] font-bold text-white">•••• •••• •••• 4242</p>
                             <p className="text-[9px] text-slate uppercase">Exp: 12/28 • {auth.currentUser?.displayName || 'Card Holder'}</p>
                          </div>
                       </div>
                       <div className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-bold uppercase tracking-widest rounded border border-green-500/20 group-hover:bg-green-500 group-hover:text-navy transition-all">Default</div>
                    </div>

                    <div className="p-4 bg-navy/40 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-3 hover:border-white/20 transition-all cursor-pointer">
                       <TrendingUp className="w-3 h-3 text-slate" />
                       <span className="text-[9px] text-slate font-bold uppercase tracking-widest">Connect Agency Bank Account (ACH/EFT)</span>
                    </div>
                 </div>

                 {/* Subscription Tiers */}
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-2">
                       <Zap className="w-3.5 h-3.5 text-gold" /> Selection Portal
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       {PLANS.map((plan, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border transition-all ${plan.name === (subscription?.role || 'Explorer') ? 'bg-gold/5 border-gold/40 shadow-lg' : 'bg-navy/40 border-white/5 opacity-80 hover:opacity-100'}`}>
                             <div className="text-[8px] font-bold text-gold uppercase tracking-widest mb-1">{plan.name}</div>
                             <div className="text-xs font-serif font-bold text-white mb-1">{plan.price}</div>
                             <div className="text-[7px] text-slate-light leading-tight mb-3">
                                {plan.features[0]}
                             </div>
                             <button 
                                onClick={() => handleSubscribe(plan, plan.trial)}
                                className={`w-full py-2 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${plan.trial ? 'bg-gold text-navy shadow-lg shadow-gold/20' : 'bg-white/10 text-cream hover:bg-gold hover:text-navy'}`}
                             >
                                {plan.trial ? '7-Day Trial' : plan.name.includes('Yearly') ? 'Save Yearly' : 'Get Monthly'}
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Billing History */}
              <div className="mt-12 pt-8 border-t border-white/5">
                 <h4 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                    <History className="w-3.5 h-3.5 text-gold" /> Billing Ledger
                 </h4>
                 <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-navy/20">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-navy/40">
                             <th className="p-3 text-[8px] font-bold text-slate uppercase tracking-widest border-b border-white/5">Date</th>
                             <th className="p-3 text-[8px] font-bold text-slate uppercase tracking-widest border-b border-white/5">ID</th>
                             <th className="p-3 text-[8px] font-bold text-slate uppercase tracking-widest border-b border-white/5">Description</th>
                             <th className="p-3 text-[8px] font-bold text-slate uppercase tracking-widest border-b border-white/5">Amount</th>
                             <th className="p-3 text-[8px] font-bold text-slate uppercase tracking-widest border-b border-white/5">Status</th>
                             <th className="p-3 text-[8px] font-bold text-slate uppercase tracking-widest border-b border-white/5 text-right">Receipt</th>
                          </tr>
                       </thead>
                       <tbody className="text-[10px]">
                          {[
                             { date: 'May 01, 2026', id: 'INV-A2A-8821', desc: 'Explorer Trial Activation', amount: '$0.00', status: 'PAID' },
                             { date: 'Apr 01, 2026', id: 'INV-A2A-7210', desc: 'Agency Network Registration', amount: '$0.00', status: 'PAID' }
                          ].map((inv, i) => (
                             <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="p-3 text-slate font-medium">{inv.date}</td>
                                <td className="p-3 text-slate-light font-mono uppercase">{inv.id}</td>
                                <td className="p-3 text-white font-medium">{inv.desc}</td>
                                <td className="p-3 text-gold font-bold">{inv.amount}</td>
                                <td className="p-3">
                                   <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 font-bold tracking-tighter rounded">● {inv.status}</span>
                                </td>
                                <td className="p-3 text-right">
                                   <button className="p-1 px-2 hover:bg-gold hover:text-navy border border-white/10 rounded transition-all">PDF</button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        </div>

        {/* Localization & Region */}
        <div className="lg:col-span-2 space-y-6">

           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest mb-8">
                 <Globe className="w-4 h-4 text-gold" /> Localization & Multi-Market Prefs
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <DollarSign className="w-4 h-4 text-gold" />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">System Currency</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => setCurrency('CAD')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${currency === 'CAD' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         CAD (Canada)
                       </button>
                       <button 
                         onClick={() => setCurrency('USD')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${currency === 'USD' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         USD (United States)
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-light leading-relaxed">Adjusts all dashboards, appraisals, and ROI reports in real-time based on latest conversion rates.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <Calendar className="w-4 h-4 text-gold" />
                       <span className="text-xs font-bold text-white uppercase tracking-wider">Date Format Localization</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => setDateFormat('YYYY-MM-DD')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${dateFormat === 'YYYY-MM-DD' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         YYYY-MM-DD
                       </button>
                       <button 
                         onClick={() => setDateFormat('MM/DD/YYYY')}
                         className={`px-4 py-3 rounded-lg border text-xs font-bold transition-all ${dateFormat === 'MM/DD/YYYY' ? 'bg-gold text-navy border-gold shadow-lg' : 'bg-navy/40 border-white/10 text-slate hover:border-gold/30'}`}
                       >
                         MM/DD/YYYY
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-light leading-relaxed">Standardizes transaction dates and scheduling across US and Canadian jurisdiction compliance.</p>
                 </div>
              </div>
           </div>

           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest mb-8">
                 <Bell className="w-4 h-4 text-gold" /> AI Notification Matrix
              </h3>
              
              <div className="space-y-5">
                 <ToggleRow 
                   label="High-Score Seller Alerts" 
                   desc="Instant notification when Predictive Sentiment score exceeds 90%" 
                   enabled={notifications.aiAlerts} 
                   onChange={() => setNotifications(n => ({...n, aiAlerts: !n.aiAlerts}))} 
                 />
                 <ToggleRow 
                   label="Email Intelligence Sync" 
                   desc="Morning briefing of all inbox insights and sequence replies" 
                   enabled={notifications.email} 
                   onChange={() => setNotifications(n => ({...n, email: !n.email}))} 
                 />
                 <ToggleRow 
                   label="Transaction Deadline Push" 
                   desc="Real-time mobile alerts for contingency and closing milestones" 
                   enabled={notifications.push} 
                   onChange={() => setNotifications(n => ({...n, push: !n.push}))} 
                 />
              </div>
           </div>
        </div>

        {/* Sidebar Mini Settings */}
        <div className="space-y-6">
           <div className="bg-navy-mid/60 border border-gold/18 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                 {auth.currentUser?.photoURL ? (
                   <img src={auth.currentUser.photoURL} alt="" className="w-12 h-12 rounded-full border border-gold/30" />
                 ) : (
                   <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center font-serif text-xl font-bold text-gold">
                     {auth.currentUser?.displayName?.charAt(0) || auth.currentUser?.email?.charAt(0)}
                   </div>
                 )}
                 <div>
                    <h4 className="text-sm font-bold text-white">{auth.currentUser?.displayName || 'Agent Profile'}</h4>
                    <p className="text-[10px] text-slate-light font-bold uppercase tracking-widest">{subscription?.role === 'Enterprise' ? 'Principal Broker' : 'Sales Representative'}</p>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <User className="w-3.5 h-3.5 text-slate group-hover:text-gold" />
                    <span className="text-[11px] text-slate-light font-medium group-hover:text-cream">Profile Intelligence</span>
                 </div>
                 <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <Mail className="w-3.5 h-3.5 text-slate group-hover:text-gold" />
                    <span className="text-[11px] text-slate-light font-medium group-hover:text-cream">Alias Management</span>
                 </div>
                 <div className="flex items-center gap-3 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                    <Key className="w-3.5 h-3.5 text-slate group-hover:text-gold" />
                    <span className="text-[11px] text-slate-light font-medium group-hover:text-cream">Security & Keys</span>
                 </div>
              </div>
           </div>

           <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap className="w-20 h-20 text-gold" />
              </div>
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap className="w-3 h-3 text-gold" /> A2A Neural Sync
              </h4>
              <p className="text-[11px] text-slate-light leading-relaxed mb-4">
                Your multi-agent network is currently processing <strong className="text-gold">12.4M</strong> data points across US and CA markets. 
                Efficiency is optimized for Q2 objectives.
              </p>
              <div className="flex items-center gap-2 text-[9px] font-bold text-green-400 uppercase tracking-widest">
                 <CheckCircle2 className="w-3 h-3" /> All Agents Synchronized
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, enabled, onChange }: { label: string, desc: string, enabled: boolean, onChange: () => void }) {
  return (
    <div className="flex items-center justify-between gap-8 p-4 bg-navy/40 border border-white/5 rounded-xl hover:border-gold/20 transition-all group">
       <div className="flex-1">
          <div className="text-xs font-bold text-white group-hover:text-gold transition-colors mb-1">{label}</div>
          <div className="text-[10px] text-slate leading-relaxed">{desc}</div>
       </div>
       <button 
         onClick={onChange}
         className={`w-10 h-5 rounded-full relative transition-all duration-300 ${enabled ? 'bg-gold shadow-[0_0_10px_#C9A84C]' : 'bg-navy border border-white/10'}`}
       >
          <div className={`absolute top-1 w-3 h-3 rounded-full transition-all duration-300 ${enabled ? 'right-1 bg-navy' : 'left-1 bg-slate'}`} />
       </button>
    </div>
  );
}
