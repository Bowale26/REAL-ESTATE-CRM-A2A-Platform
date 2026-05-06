import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  Target, 
  Briefcase, 
  Mail, 
  Anchor, 
  CheckSquare, 
  Settings, 
  TrendingUp, 
  RefreshCcw, 
  Bot, 
  Home, 
  Zap,
  Building2,
  ChevronDown,
  X,
  Calendar,
  Briefcase as BriefcaseIcon,
  FolderLock,
  Globe,
  Award,
  Video,
  Database,
  LogIn,
  LogOut,
  Lock
} from 'lucide-react';
import { PanelId, Contact, Lead, Deal, Email, CaptureChannel, Task, Workflow, Currency, DateFormat, Listing, Transaction } from './types';
import { 
  PANEL_LABELS, 
  SELLER_LEADS, 
  CONTACTS_DATA, 
  LEADS_DATA, 
  DEALS_DATA, 
  EMAILS_DATA, 
  CAPTURE_CHANNELS, 
  TASKS_DATA, 
  WORKFLOWS_DATA,
  AGENTS_DATA,
  LISTINGS_DATA,
  TRANSACTIONS_DATA
} from './constants';
import Dashboard from './components/panels/Dashboard';
import ContactsPage from './components/panels/ContactsPage';
import LeadsPage from './components/panels/LeadsPage';
import AiAssistant from './components/panels/AiAssistant';
import ValuationPage from './components/panels/ValuationPage';
import WorkflowCanvas from './components/panels/WorkflowCanvas';
import PipelineBoard from './components/panels/PipelineBoard';
import EnrichmentPage from './components/panels/EnrichmentPage';
import AddContactModal from './components/modals/AddContactModal';
import AddLeadModal from './components/modals/AddLeadModal';
import AddDealModal from './components/modals/AddDealModal';
import EmailPage from './components/panels/EmailPage';
import ComposeEmailModal from './components/modals/ComposeEmailModal';
import LeadCapturePage from './components/panels/LeadCapturePage';
import CreateCapturePageModal from './components/modals/CreateCapturePageModal';
import TasksPage from './components/panels/TasksPage';
import AddTaskModal from './components/modals/AddTaskModal';
import CreateWorkflowModal from './components/modals/CreateWorkflowModal';
import AnalyticsPage from './components/panels/AnalyticsPage';
import LeaderboardPage from './components/panels/LeaderboardPage';
import DataImportExportPage from './components/panels/DataImportExportPage';
import CalendarPage from './components/panels/CalendarPage';
import PropertiesPage from './components/panels/PropertiesPage';
import TransactionPage from './components/panels/TransactionPage';
import SettingsPage from './components/panels/SettingsPage';
import MediaProductionPage from './components/panels/MediaProductionPage';
import CRMIntegrationPage from './components/panels/CRMIntegrationPage';
import ChatbotWidget from './components/ChatbotWidget';
import { auth, googleProvider, db } from './lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { useAuth } from './lib/AuthContext';

export default function App() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setSubscriptionStatus(data.subscriptionStatus || 'trialing');
        setTrialEnd(data.trialEnd || null);
      } else {
        setSubscriptionStatus('trialing');
        setTrialEnd(null);
      }
    });
    return unsubscribe;
  }, [user]);

  const [activePanel, setActivePanel] = useState<PanelId>('dashboard');
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isCreateCaptureModalOpen, setIsCreateCaptureModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isCreateWorkflowModalOpen, setIsCreateWorkflowModalOpen] = useState(false);
  
  // Global Context State
  const [currency, setCurrency] = useState<Currency>('CAD');
  const [dateFormat, setDateFormat] = useState<DateFormat>('YYYY-MM-DD');

  const [contacts, setContacts] = useState<Contact[]>(CONTACTS_DATA);
  const [leads, setLeads] = useState<Lead[]>(LEADS_DATA);
  const [deals, setDeals] = useState<Deal[]>(DEALS_DATA);
  const [emails, setEmails] = useState<Email[]>(EMAILS_DATA);
  const [channels, setChannels] = useState<CaptureChannel[]>(CAPTURE_CHANNELS);
  const [tasks, setTasks] = useState<Task[]>(TASKS_DATA);
  const [workflows, setWorkflows] = useState<Workflow[]>(WORKFLOWS_DATA);
  const [sellerLeads, setSellerLeads] = useState(SELLER_LEADS);
  const [listings, setListings] = useState<Listing[]>(LISTINGS_DATA);
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS_DATA);
  const [isEngagingAll, setIsEngagingAll] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const handleGlobalSync = () => {
    setSyncStatus('Synchronizing global market preferences...');
    setTimeout(() => {
      setSyncStatus('Global state synchronized across all agents.');
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1500);
  };
  
  const handleAddListing = (newListing: Omit<Listing, 'id'>) => {
    const listing: Listing = {
      ...newListing,
      id: Math.random().toString(36).substr(2, 9),
    };
    setListings(prev => [listing, ...prev]);
  };

  const handleEditListing = (updatedListing: Listing) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
  };

  const handleDeleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };
  
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const handleAddContact = (newContact: Omit<Contact, 'id' | 'score' | 'lastContact'>) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === editingContact.id ? { ...editingContact, ...newContact } : c));
      setEditingContact(null);
    } else {
      const contact: Contact = {
        ...newContact,
        id: Math.random().toString(36).substr(2, 9),
        score: Math.floor(Math.random() * 60 + 40) + '%',
        lastContact: 'Just now',
        tags: [],
        history: []
      };
      setContacts(prev => [contact, ...prev]);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsAddContactModalOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'probability' | 'chatbotStatus'>) => {
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...editingLead, ...newLead } : l));
      setEditingLead(null);
    } else {
      const lead: Lead = {
        ...newLead,
        id: Math.random().toString(36).substr(2, 9),
        probability: Math.floor(Math.random() * 50 + 50) + '%',
        chatbotStatus: 'Ready',
        financingStatus: 'Need Help'
      };
      setLeads(prev => [lead, ...prev]);
    }
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsAddLeadModalOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleAddDeal = (newDeal: Omit<Deal, 'id'>) => {
    const deal: Deal = {
      ...newDeal,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDeals(prev => [deal, ...prev]);
  };

  const handleSendEmail = (newEmail: any) => {
    const email: Email = {
      id: Math.random().toString(36).substr(2, 9),
      from: 'Me',
      initials: 'ME',
      subject: newEmail.subject,
      property: '—',
      time: 'Just now',
      status: 'replied',
      avatarColor: 'blue'
    };
    setEmails(prev => [email, ...prev]);
  };

  const handleCreateChannel = (newChannel: Omit<CaptureChannel, 'id' | 'leadsGenerated' | 'conversion' | 'url'>) => {
    const channel: CaptureChannel = {
      ...newChannel,
      id: Math.random().toString(36).substr(2, 9),
      leadsGenerated: 0,
      conversion: '0.0%',
      url: `/c/${newChannel.name.toLowerCase().replace(/\s+/g, '-')}`
    };
    setChannels(prev => [channel, ...prev]);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'status'>) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending'
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t
    ));
  };

  const handleCreateWorkflow = (newWorkflow: Omit<Workflow, 'id'>) => {
    if (editingWorkflow) {
      setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? { ...editingWorkflow, ...newWorkflow } : w));
      setEditingWorkflow(null);
    } else {
      const workflow: Workflow = {
        ...newWorkflow,
        id: Math.random().toString(36).substr(2, 9),
      };
      setWorkflows(prev => [workflow, ...prev]);
    }
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setIsCreateWorkflowModalOpen(true);
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  const handleEngageLead = (index: number) => {
    setSellerLeads(prev => prev.map((lead, i) => 
      i === index ? { ...lead, ai: 'Crescendo.ai engagement active' } : lead
    ));
    
    // Also add to leads if not already there
    const leadToEngage = sellerLeads[index];
    if (!leads.find(l => l.name === leadToEngage.name)) {
      handleAddLead({
        name: leadToEngage.name,
        email: 'placeholder@example.com',
        phone: '555-0199',
        location: leadToEngage.addr,
        propertyType: 'Single Family',
        source: 'SmartZip',
        urgency: '3-6 Months',
        interest: 'Sell',
        budget: 'TBD',
        status: 'hot',
        financingStatus: 'Pre-Approved'
      });
    }
  };

  const handleEngageAllSellerLeads = () => {
    setIsEngagingAll(true);
    setTimeout(() => {
      setSellerLeads(prev => prev.map(lead => ({ ...lead, ai: 'Crescendo.ai engagement active' })));
      
      // Add all to leads
      sellerLeads.forEach(leadToEngage => {
        if (!leads.find(l => l.name === leadToEngage.name)) {
          handleAddLead({
            name: leadToEngage.name,
            email: 'placeholder@example.com',
            phone: '555-0199',
            location: leadToEngage.addr,
            propertyType: 'Single Family',
            source: 'SmartZip',
            urgency: '3-6 Months',
            interest: 'Sell',
            budget: 'TBD',
            status: 'hot',
            financingStatus: 'Pre-Approved'
          });
        }
      });
      
      setIsEngagingAll(false);
      setTimeout(() => {
        setIsSellerModalOpen(false);
      }, 1000);
    }, 2000);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-navy flex items-center justify-center p-4">
        {/* Background Layers */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_20%,rgba(201,168,76,0.07)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_90%_80%,rgba(52,152,219,0.06)_0%,transparent_60%),linear-gradient(160deg,#0B1628_0%,#0F2040_50%,#0B1628_100%)]" />
        <div className="fixed inset-0 z-0 opacity-[0.025] bg-grid-pattern" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md bg-navy-mid/80 backdrop-blur-xl border border-gold/20 rounded-2xl p-10 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(201,168,76,0.3)]">
            <Building2 className="text-navy w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-2 uppercase tracking-tight">REAL ESTATE CRM</h1>
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-10">A2A Intelligence Platform</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gold text-navy font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gold-light transition-all shadow-[0_4px_20px_rgba(201,168,76,0.25)]"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Agency Account
            </button>
            <p className="text-[11px] text-slate-light italic font-medium leading-relaxed">
              Secure authentication via Enterprise Sync Agent.<br/>
              By signing in, you agree to the Multi-Market Policy.
            </p>
          </div>

          <div className="mt-12 pt-10 border-t border-white/5 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-white font-bold text-sm">12.4M</div>
              <div className="text-[8px] text-slate font-bold uppercase tracking-widest mt-1">Data Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">99.8%</div>
              <div className="text-[8px] text-slate font-bold uppercase tracking-widest mt-1">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">Real-time</div>
              <div className="text-[8px] text-slate font-bold uppercase tracking-widest mt-1">MLS Sync</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isTrialExpired = subscriptionStatus === 'trialing' && trialEnd && (trialEnd * 1000 < Date.now());
  const isSubscriptionInvalid = subscriptionStatus === 'canceled' || 
                                subscriptionStatus === 'incomplete_expired' || 
                                subscriptionStatus === 'past_due' ||
                                isTrialExpired;

  if (isSubscriptionInvalid) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-navy flex items-center justify-center p-4">
        {/* Background Layers */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_20%,rgba(201,168,76,0.07)_0%,transparent_60%)]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-lg bg-navy-mid/80 backdrop-blur-xl border border-gold/40 rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="text-red-400 w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-4 uppercase tracking-tight">Subscription Required</h2>
          <p className="text-slate-light text-sm mb-10 leading-relaxed italic font-medium">
            Your access to the A2A Intelligence Platform has expired.<br/>
            Please reactivate your agency profile to continue managing property tours.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-navy border border-white/5 rounded-xl">
               <div className="text-[8px] text-gold font-bold uppercase tracking-widest mb-1">Monthly Plan</div>
               <div className="text-xl font-serif font-bold text-white mb-2">$29.99</div>
               <button 
                 onClick={() => {
                   setSubscriptionStatus('trialing'); // Simple bypass for demo/navigation
                   setActivePanel('settings');
                 }}
                 className="w-full py-2 bg-gold text-navy text-[8px] font-bold uppercase rounded-lg"
               >
                 Go to Billing
               </button>
            </div>
            <div className="p-4 bg-navy border border-white/5 rounded-xl opacity-60">
               <div className="text-[8px] text-gold font-bold uppercase tracking-widest mb-1">Yearly Savings</div>
               <div className="text-xl font-serif font-bold text-white mb-2">$299.99</div>
               <button className="w-full py-2 bg-white/5 text-slate text-[8px] font-bold uppercase rounded-lg">
                 Lock In Rate
               </button>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] text-slate-light hover:text-gold uppercase tracking-[0.2em] font-bold"
          >
            Sign Out of Agency Account
          </button>
        </motion.div>
      </div>
    );
  }

  // Theme colors and background layers
  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-gold/30">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_20%,rgba(201,168,76,0.07)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_90%_80%,rgba(52,152,219,0.06)_0%,transparent_60%),linear-gradient(160deg,#0B1628_0%,#0F2040_50%,#0B1628_100%)]" />
      <div className="fixed inset-0 z-0 opacity-[0.025] bg-grid-pattern" />

      {/* Global Notifications */}
      <AnimatePresence>
        {syncStatus && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-navy-mid border border-gold/50 rounded-full shadow-[0_0_20px_rgba(201,168,76,0.3)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-bold text-cream uppercase tracking-widest">{syncStatus}</span>
            <button onClick={() => setSyncStatus(null)} className="ml-2 text-slate hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[260px] flex-shrink-0 bg-gradient-to-b from-navy/98 to-navy-mid/98 border-r border-gold/18 flex flex-col overflow-y-auto scrollbar-hide">
          <div className="p-6 pb-5 border-b border-gold/18">
            <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold-light rounded-lg flex items-center justify-center text-lg mb-2 shadow-[0_4px_16px_rgba(201,168,76,0.3)]">
              <Building2 className="text-navy w-5 h-5" />
            </div>
            <div className="font-serif text-base font-bold text-white tracking-wide">REAL ESTATE CRM</div>
            <div className="text-[10px] text-gold tracking-[1.5px] uppercase mt-0.5">A2A Intelligence Platform</div>
          </div>

          <div className="p-3 space-y-1">
            <div className="px-2 mb-1.5 text-[9px] font-semibold tracking-[2px] uppercase text-slate">Core CRM</div>
            <NavButton active={activePanel === 'dashboard'} onClick={() => setActivePanel('dashboard')} icon={<BarChart3 />} label="Dashboard" />
            <NavButton active={activePanel === 'contacts'} onClick={() => setActivePanel('contacts')} icon={<Users />} label="Contact Management" badge={contacts.length.toString()} />
            <NavButton active={activePanel === 'leads'} onClick={() => setActivePanel('leads')} icon={<Target />} label="Lead Management" badge="34" badgeColor="red" />
            <NavButton active={activePanel === 'properties'} onClick={() => setActivePanel('properties')} icon={<Building2 />} label="Property Management" badge={LISTINGS_DATA.length.toString()} />
            <NavButton active={activePanel === 'pipeline'} onClick={() => setActivePanel('pipeline')} icon={<BriefcaseIcon />} label="Classic Pipeline" badge={deals.length.toString()} />
            <NavButton active={activePanel === 'transactions'} onClick={() => setActivePanel('transactions')} icon={<FolderLock />} label="Transaction Desk" badge={TRANSACTIONS_DATA.length.toString()} badgeColor="green" />
            <NavButton active={activePanel === 'email'} onClick={() => setActivePanel('email')} icon={<Mail />} label="Email Management" badge={emails.filter(e => e.status === 'unread').length.toString()} />
            <NavButton active={activePanel === 'capture'} onClick={() => setActivePanel('capture')} icon={<Anchor />} label="Lead Capture" badge={channels.length.toString()} />
            <NavButton active={activePanel === 'tasks'} onClick={() => setActivePanel('tasks')} icon={<CheckSquare />} label="Task Management" badge={tasks.filter(t => t.status === 'Pending').length.toString()} badgeColor="green" />
            <NavButton active={activePanel === 'calendar'} onClick={() => setActivePanel('calendar')} icon={<Calendar />} label="Calendar" />
            <NavButton active={activePanel === 'workflow'} onClick={() => setActivePanel('workflow')} icon={<Settings />} label="Workflow Management" />
            <NavButton active={activePanel === 'analytics'} onClick={() => setActivePanel('analytics')} icon={<TrendingUp />} label="Reporting / Analytics" />
            <NavButton active={activePanel === 'leaderboard'} onClick={() => setActivePanel('leaderboard')} icon={<Award />} label="Agent Leaderboard" />
            <NavButton active={activePanel === 'media'} onClick={() => setActivePanel('media')} icon={<Video />} label="AI Videographer" badge="New" badgeColor="gold" />
            <NavButton active={activePanel === 'crm'} onClick={() => setActivePanel('crm')} icon={<Database />} label="CRM Integrations" />
            <NavButton active={activePanel === 'import'} onClick={() => setActivePanel('import')} icon={<RefreshCcw />} label="Data Import / Export" />
            <NavButton active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} icon={<Globe />} label="System Settings" />
          </div>

          <div className="p-3 space-y-1">
            <div className="px-2 mb-1.5 text-[9px] font-semibold tracking-[2px] uppercase text-slate">AI Features</div>
            <NavButton active={activePanel === 'ai_assistant'} onClick={() => setActivePanel('ai_assistant')} icon={<Bot />} label="AI Assistant" badge="Live" badgeColor="green" />
            <NavButton active={activePanel === 'valuation'} onClick={() => setActivePanel('valuation')} icon={<Home />} label="AI Valuation" />
            <NavButton active={activePanel === 'enrichment'} onClick={() => setActivePanel('enrichment')} icon={<Zap />} label="Lead Enrichment" />
          </div>

          <div className="p-3">
            <button 
              onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
              className="w-full p-2.5 bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/18 rounded-md text-gold-light font-medium text-xs flex items-center gap-2 hover:border-gold transition-colors"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>🌐 AI CRM Platforms</span>
              <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${isAiDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isAiDropdownOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-1.5 bg-navy/98 border border-gold/18 rounded-md overflow-hidden"
                >
                  <AiGroup title="All-in-One CRMs" items={['kvCORE', 'Lofty', 'AgentLocator', 'Top Producer']} />
                  <AiGroup title="Lead Generation AI" items={['CINC', 'Ylopo', 'SmartZip', 'Revaluate']} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsSellerModalOpen(true)}
            className="mx-3 mt-2 mb-2 p-3 bg-gradient-to-br from-gold to-gold-mid border-none rounded-md text-navy font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(201,168,76,0.25)] hover:-translate-y-px transition-all"
          >
            <Target className="w-4 h-4" />
            <span>🎯 Find Seller Leads</span>
          </button>

          <button 
            onClick={() => setActivePanel('settings')}
            className="mx-3 mb-4 p-3 bg-navy-mid border border-gold/30 rounded-md text-gold-light font-bold text-[10px] flex items-center justify-center gap-2 uppercase tracking-widest hover:bg-gold hover:text-navy transition-all shadow-lg animate-pulse hover:animate-none"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>7-Day Free Trial</span>
          </button>
          <div className="mt-auto p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-gold/20 transition-all">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-gold/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs border border-gold/30">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{user.displayName || 'Agent'}</p>
                <p className="text-[9px] text-slate truncate">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-slate hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-navy-light">
          {/* Top Bar */}
          <div className="sticky top-0 z-20 px-7 py-4 bg-navy/60 backdrop-blur-xl border-b border-white/8 flex items-center gap-4">
            <div>
              <h1 className="font-serif text-xl font-semibold text-white">{PANEL_LABELS[activePanel][0]}</h1>
              <p className="text-xs text-slate mt-0.5">{PANEL_LABELS[activePanel][1]}</p>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <AgentPill status="active" label="Orchestrator" />
              <AgentPill status="working" label="Judge Agent" />
              <AgentPill status="active" label="MLS Data" />
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="🔍 Search contacts, leads..." 
                  className="bg-white/6 border border-gold/18 rounded-md text-cream text-xs px-3.5 py-2 w-72 focus:outline-none focus:border-gold transition-colors placeholder:text-slate"
                />
              </div>
              
              <button 
                onClick={() => setActivePanel('ai_assistant')}
                className="px-3.5 py-1.5 bg-gold text-navy font-bold text-[12px] rounded-md hover:bg-gold-light transition-colors"
              >
                Ask AI ✨
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-7 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activePanel === 'dashboard' && <Dashboard onNavigate={setActivePanel} currency={currency} />}
                {activePanel === 'contacts' && (
                  <ContactsPage 
                    contacts={contacts} 
                    onAddContact={() => { setEditingContact(null); setIsAddContactModalOpen(true); }} 
                    onEditContact={handleEditContact}
                    onDeleteContact={handleDeleteContact}
                    onNavigate={setActivePanel}
                  />
                )}
                {activePanel === 'leads' && (
                  <LeadsPage 
                    leads={leads}
                    onAddLead={() => { setEditingLead(null); setIsAddLeadModalOpen(true); }}
                    onEditLead={handleEditLead}
                    onDeleteLead={handleDeleteLead}
                    onFindSellers={() => setIsSellerModalOpen(true)} 
                  />
                )}
                {activePanel === 'ai_assistant' && <AiAssistant />}
                {activePanel === 'valuation' && <ValuationPage currency={currency} />}
                {activePanel === 'workflow' && (
                  <WorkflowCanvas 
                    workflows={workflows} 
                    onAddWorkflow={() => { setEditingWorkflow(null); setIsCreateWorkflowModalOpen(true); }} 
                    onEditWorkflow={handleEditWorkflow}
                    onDeleteWorkflow={handleDeleteWorkflow}
                  />
                )}
                {activePanel === 'pipeline' && <PipelineBoard deals={deals} onAddDeal={() => setIsAddDealModalOpen(true)} currency={currency} />}
                {activePanel === 'enrichment' && <EnrichmentPage />}
                {activePanel === 'email' && (
                  <EmailPage 
                    emails={emails} 
                    onCompose={() => setIsComposeModalOpen(true)} 
                  />
                )}
                {activePanel === 'capture' && (
                  <LeadCapturePage 
                    channels={channels} 
                    onCreatePage={() => setIsCreateCaptureModalOpen(true)} 
                  />
                )}
                {activePanel === 'tasks' && (
                  <TasksPage 
                    tasks={tasks} 
                    onAddTask={() => setIsAddTaskModalOpen(true)} 
                    onToggleTask={handleToggleTask}
                    onNavigate={setActivePanel}
                  />
                )}
                {activePanel === 'analytics' && <AnalyticsPage currency={currency} />}
                {activePanel === 'leaderboard' && <LeaderboardPage currency={currency} />}
                {activePanel === 'media' && <MediaProductionPage />}
                {activePanel === 'crm' && <CRMIntegrationPage />}
                {activePanel === 'import' && <DataImportExportPage />}
                {activePanel === 'calendar' && <CalendarPage />}
                {activePanel === 'properties' && (
                  <PropertiesPage 
                    listings={listings}
                    onAddListing={handleAddListing}
                    onEditListing={handleEditListing}
                    onDeleteListing={handleDeleteListing}
                    currency={currency}
                  />
                )}
                {activePanel === 'transactions' && (
                  <TransactionPage 
                    transactions={transactions}
                    onAddTransaction={handleAddTransaction}
                    onEditTransaction={handleEditTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    currency={currency}
                    dateFormat={dateFormat}
                  />
                )}
                {activePanel === 'settings' && (
                  <SettingsPage 
                    currency={currency} 
                    setCurrency={setCurrency} 
                    dateFormat={dateFormat} 
                    setDateFormat={setDateFormat} 
                    onSync={handleGlobalSync}
                  />
                )}
                
                {/* Fallback for other panels */}
                {!['dashboard', 'contacts', 'leads', 'ai_assistant', 'valuation', 'workflow', 'pipeline', 'enrichment', 'email', 'capture', 'tasks', 'analytics', 'import', 'calendar', 'properties', 'transactions', 'settings', 'media', 'crm', 'leaderboard'].includes(activePanel) && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate">
                    <Zap className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium uppercase tracking-widest">{activePanel.replace('_', ' ')} - Module in development</p>
                    <p className="text-xs mt-2 opacity-60">A2A Integration Agent is building this view...</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Seller Leads Modal */}
      <AnimatePresence>
        {isSellerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSellerModalOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-navy-mid border border-gold/30 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-7">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-white mb-1">🎯 Predictive Seller Intelligence</h2>
                    <p className="text-sm text-slate leading-relaxed">SmartZip AI has identified top predicted sellers in your farm area — confidence scores based on life events, equity, and behavioral signals.</p>
                  </div>
                  <button onClick={() => setIsSellerModalOpen(false)} className="text-slate hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-navy-light">
                  {sellerLeads.map((lead, i) => (
                    <div key={i} className="p-4 bg-navy-light/40 border border-gold/18 rounded-lg flex items-center gap-4 hover:border-gold transition-all group cursor-pointer">
                      <div className="font-mono text-lg font-bold text-gold w-14 text-center">{lead.score}%</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white group-hover:text-gold transition-colors">{lead.name}</div>
                        <div className="text-xs text-slate mt-0.5">📍 {lead.addr}</div>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gold to-gold-light" style={{ width: `${lead.score}%` }} />
                        </div>
                        <div className="text-[11px] text-slate mt-1.5 line-clamp-1 italic">{lead.reason}</div>
                        <div className="text-[10px] text-green-400 mt-1 font-medium flex items-center gap-1">
                          <CheckSquare className={`w-3 h-3 ${lead.ai.includes('active') ? 'text-gold' : 'text-green-400'}`} /> 
                          <span className={lead.ai.includes('active') ? 'text-gold' : ''}>{lead.ai}</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEngageLead(i); }}
                        disabled={lead.ai.includes('active')}
                        className="px-3 py-1.5 bg-gold text-navy font-bold text-[11px] rounded hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {lead.ai.includes('active') ? 'Active' : 'Engage'}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex justify-end gap-3">
                  <button onClick={() => setIsSellerModalOpen(false)} className="px-5 py-2 border border-gold/18 rounded-md text-slate-light hover:text-gold hover:border-gold transition-all text-xs font-bold">Close</button>
                  <button 
                    onClick={handleEngageAllSellerLeads}
                    disabled={isEngagingAll}
                    className="px-5 py-2 bg-gold text-navy rounded-md font-bold text-xs hover:bg-gold-light transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isEngagingAll && <RefreshCcw className="w-3 h-3 animate-spin" />}
                    {isEngagingAll ? 'Engaging Agents...' : 'Engage All via Crescendo.ai'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddContactModal 
        isOpen={isAddContactModalOpen} 
        onClose={() => { setIsAddContactModalOpen(false); setEditingContact(null); }} 
        onAdd={handleAddContact} 
        editingContact={editingContact}
      />

      <AddLeadModal 
        isOpen={isAddLeadModalOpen} 
        onClose={() => { setIsAddLeadModalOpen(false); setEditingLead(null); }} 
        onAdd={handleAddLead} 
        editingLead={editingLead}
      />

      <AddDealModal 
        isOpen={isAddDealModalOpen} 
        onClose={() => setIsAddDealModalOpen(false)} 
        onAdd={handleAddDeal} 
      />

      <ComposeEmailModal 
        isOpen={isComposeModalOpen}
        onClose={() => setIsComposeModalOpen(false)}
        onSend={handleSendEmail}
      />

      <CreateCapturePageModal 
        isOpen={isCreateCaptureModalOpen}
        onClose={() => setIsCreateCaptureModalOpen(false)}
        onAdd={handleCreateChannel}
      />

      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAdd={handleAddTask}
      />

      <CreateWorkflowModal 
        isOpen={isCreateWorkflowModalOpen}
        onClose={() => { setIsCreateWorkflowModalOpen(false); setEditingWorkflow(null); }}
        onAdd={handleCreateWorkflow}
        editingWorkflow={editingWorkflow}
      />

      <ChatbotWidget />
    </div>
  );
}

function NavButton({ active, onClick, icon, label, badge, badgeColor }: { active: boolean, onClick: () => void, icon: ReactNode, label: string, badge?: string, badgeColor?: 'red' | 'green' | 'gold' }) {
  const badgeClasses = {
    red: 'bg-red-500/20 text-red-400',
    green: 'bg-green-500/20 text-green-400',
    gold: 'bg-gold/20 text-gold'
  }[badgeColor || 'gold'];

  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md font-sans text-sm transition-all relative ${
        active 
          ? 'bg-gradient-to-r from-gold/15 to-gold/5 text-gold-light border-l-2 border-gold pl-2' 
          : 'bg-transparent text-slate-light hover:bg-gold/8 hover:text-cream'
      }`}
    >
      <span className="w-5 text-center flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badgeClasses}`}>{badge}</span>}
    </button>
  );
}

function AiGroup({ title, items }: { title: string, items: string[] }) {
  return (
    <div className="px-3 py-2.5 pb-1.5">
      <div className="text-[9px] font-semibold text-gold tracking-[1.5px] uppercase mb-1.5">{title}</div>
      <div className="space-y-0.5">
        {items.map(item => (
          <button key={item} className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-transparent text-slate-light text-[12px] hover:bg-gold/8 hover:text-cream transition-all text-left">
            <div className="w-1.5 h-1.5 rounded-full bg-gold" />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgentPill({ status, label }: { status: 'active' | 'working' | 'idle', label: string }) {
  const statusColors = {
    active: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]',
    working: 'bg-gold shadow-[0_0_8px_rgba(201,168,76,0.5)] animate-pulse',
    idle: 'bg-slate'
  };

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-slate-light">
      <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
      <span>{label}</span>
    </div>
  );
}

