import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { signInWithGoogle } from '../lib/firebase';
import { Zap, CheckCircle2, ArrowRight, Shield, BarChart3, Globe, Bot } from 'lucide-react';
import { motion } from 'motion/react';

export const Landing: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-a2a-navy text-white selection:bg-a2a-gold/30">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-black text-white tracking-widest leading-none">REAL ESTATE CRM</h1>
          <p className="text-[10px] font-black text-a2a-gold tracking-[0.2em] uppercase opacity-70 italic">A2A Intelligence Platform</p>
        </div>
        <button 
          onClick={handleStart}
          className="text-[10px] font-black tracking-[0.2em] py-3 px-8 rounded-xl border border-white/10 hover:border-a2a-gold/50 transition-all hover:bg-white/5 uppercase"
        >
          {user ? 'ACCESS COMMAND CENTER' : 'INITIALIZE SYSTEM'}
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-48 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-a2a-gold/20 rounded-full blur-[120px] pointer-events-none opacity-20" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-block px-6 py-2 bg-a2a-slate border border-white/5 rounded-full text-[10px] font-black tracking-[0.3em] text-a2a-gold uppercase mb-12">
            Intelligence Engine v4.0 Active
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-10 max-w-5xl mx-auto">
            DOMINATE THE <span className="text-a2a-gold">MARKET.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
            Deploy advanced neural agents to automate lead capture, property matching, and transaction workflows. 
            The only OS built for high-performance real estate teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={handleStart}
              className="bg-a2a-gold text-a2a-navy px-12 py-6 rounded-2xl font-black text-xl hover:bg-a2a-gold-light transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] active:scale-95 group flex items-center gap-3"
            >
              START 7-DAY TRIAL
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase py-4">
              <CheckCircle2 size={16} className="text-a2a-gold" />
              Full Neural Access
            </div>
          </div>
        </motion.div>
      </section>

      {/* Grid Display */}
      <section className="py-32 bg-[#080c14] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Bot, title: 'NEURAL LEADS', desc: 'Auto-score and distribute leads using proprietary behavioral analysis.' },
              { icon: Globe, title: 'GEO-CONTEXT', desc: 'Hyper-local market data integration for instant property valuations.' },
              { icon: Zap, title: 'WORKFLOW SYNC', desc: 'Automated contract execution paths with multi-agent verification.' },
            ].map((f, i) => (
              <div key={i} className="group transition-all">
                <div className="w-16 h-16 bg-a2a-slate flex items-center justify-center rounded-2xl text-a2a-gold mb-8 group-hover:scale-110 transition-transform shadow-xl">
                  <f.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-black tracking-widest mb-4 group-hover:text-a2a-gold transition-colors uppercase">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 text-center opacity-40">
        <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase">
          &copy; 2026 A2A INTELLIGENCE PLATFORM. SECURED BY NEURAL AUTH.
        </p>
      </footer>
    </div>
  );
};
