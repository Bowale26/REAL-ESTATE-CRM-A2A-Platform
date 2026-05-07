import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { 
  LayoutDashboard, CreditCard, LogOut, Zap, ShieldCheck, 
  Users, Home, Briefcase, 
  Table2, Mail, Anchor, CheckSquare, Calendar, 
  BarChart3, Medal, Search, Map, Bot
} from 'lucide-react';
import { TrialBanner } from './TrialBanner';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'motion/react';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navGroups = [
    {
      label: 'CORE CRM',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Contact Management', icon: Users, path: '/contacts', badge: 5 },
        { name: 'Lead Management', icon: Bot, path: '/leads', badge: 34 },
        { name: 'Property Management', icon: Home, path: '/properties', badge: 4 },
        { name: 'Classic Pipeline', icon: Briefcase, path: '/pipeline', badge: 3 },
        { name: 'Transaction Desk', icon: Table2, path: '/transactions', badge: 1 },
        { name: 'Email Management', icon: Mail, path: '/emails', badge: 2 },
        { name: 'Lead Capture', icon: Anchor, path: '/capture', badge: 3 },
        { name: 'Task Management', icon: CheckSquare, path: '/tasks', badge: 2 },
        { name: 'Calendar', icon: Calendar, path: '/calendar' },
      ]
    },
    {
      label: 'SYSTEMS',
      items: [
        { name: 'Workflow Management', icon: Zap, path: '/workflows' },
        { name: 'Reporting / Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Agent Leaderboard', icon: Medal, path: '/leaderboard' },
        { name: 'Settings', icon: CreditCard, path: '/billing' },
      ]
    }
  ];

  const trialDaysLeft = status?.trialDaysLeft || 0;

  return (
    <div className="flex h-screen bg-a2a-navy font-sans selection:bg-a2a-gold/30">
      {/* Sidebar */}
      <aside className="w-80 bg-a2a-navy border-r border-slate-800/50 hidden md:flex flex-col">
        <div className="p-8 pb-4">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-black text-white tracking-widest leading-none">REAL ESTATE CRM</h1>
            <p className="text-[10px] font-black text-a2a-gold tracking-[0.2em] uppercase opacity-70">A2A Intelligence Platform</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-8">
              <p className="px-4 mb-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{group.label}</p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive 
                          ? 'bg-gradient-to-r from-a2a-gold/20 to-transparent text-a2a-gold shadow-[inset_2px_0_0_0_#d4af37]' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-a2a-gold' : 'text-slate-500 group-hover:text-slate-300'} />
                        <span className={isActive ? 'font-bold' : ''}>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ${
                          isActive ? 'bg-a2a-gold text-a2a-navy' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-800/50">
          {status?.status === 'trial' && (
            <div className="bg-a2a-slate/50 border border-a2a-gold/20 rounded-2xl p-4 mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-a2a-gold/5 rounded-bl-full pointer-events-none group-hover:bg-a2a-gold/10 transition-colors" />
              <p className="text-[10px] font-black text-a2a-gold uppercase tracking-[0.2em] mb-2">Neural Tier Active</p>
              <p className="text-sm text-white font-bold leading-tight">
                System expiry in <span className="text-a2a-gold underline underline-offset-4 font-black">{trialDaysLeft} days</span>
              </p>
              <Link to="/billing" className="mt-4 block text-center py-2 bg-a2a-gold text-a2a-navy text-[10px] font-black rounded-lg hover:bg-a2a-gold-light transition-colors uppercase tracking-widest">
                Upgrade Access
              </Link>
            </div>
          )}
          
          <div className="flex items-center gap-3 bg-a2a-slate/30 p-3 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-a2a-gold flex items-center justify-center text-a2a-navy font-black text-sm shadow-lg shadow-a2a-gold/10">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate tracking-tight">{user?.email}</p>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold text-slate-500 hover:text-a2a-gold transition-colors flex items-center gap-1 uppercase tracking-widest mt-0.5"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {status?.status === 'trial' && <TrialBanner daysLeft={status?.trialDaysLeft || 0} />}
        
        {/* Top Header */}
        <header className="h-24 bg-a2a-navy/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-white tracking-tight">Inbound Capture</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none border-r border-white/10 pr-4">Forms, Chatbots & Social Ads</p>
              <div className="flex items-center gap-4 pl-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Orchestrator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Judge Agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MLS Data</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-a2a-gold transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search contacts, leads..." 
                className="bg-a2a-slate/50 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-a2a-gold w-96 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-a2a-gold text-a2a-navy rounded-xl text-xs font-black shadow-lg shadow-a2a-gold/10 hover:bg-a2a-gold-light transition-all active:scale-95 group">
              Ask AI
              <div className="w-4 h-4 rounded bg-a2a-navy text-a2a-gold flex items-center justify-center">
                <Zap size={10} fill="currentColor" />
              </div>
            </button>
          </div>
          
          <button onClick={handleLogout} className="md:hidden text-slate-400 p-2">
            <LogOut size={20} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#080c14]">
          <div className="p-10 max-w-[1600px] mx-auto min-h-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Floating AI Agent */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI READY
          </div>
          <button className="w-16 h-16 bg-a2a-gold rounded-[1.5rem] flex items-center justify-center text-a2a-navy shadow-2xl shadow-a2a-gold/20 hover:scale-110 transition-all active:scale-95 border-b-4 border-a2a-gold-light/30">
            <Bot size={32} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
