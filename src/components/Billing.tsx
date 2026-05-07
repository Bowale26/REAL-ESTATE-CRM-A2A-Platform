import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Check, Zap, CreditCard, Clock, AlertCircle, Loader2, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const Billing: React.FC = () => {
  const { user, status } = useAuth();
  const [loading, setLoading] = useState(false);
  const PRICING_PLANS = [
    {
      id: 'explorer',
      name: 'EXPLORER',
      price: '7-Day Free Trial',
      period: '',
      description: 'Experience full neural agent capability with zero commitment.',
      features: ['Full CRM Access', 'AI Lead Scoring', 'Property Listing Tools', 'Basic Analytics'],
      cta: 'SIGN UP NOW',
      priceId: null,
      highlighted: false,
    },
    {
      id: 'professional',
      name: 'PROFESSIONAL',
      price: '$29.99',
      period: '/MONTH',
      description: 'Unlimited lead capture and advanced cinematic AI production.',
      features: ['Everything in Explorer', 'Unlimited Listings', 'Team Collaboration', 'Advanced BI Dashboard', 'Priority Support'],
      cta: 'SUBSCRIBE MONTHLY',
      priceId: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID,
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE',
      price: '$299.99',
      period: '/YEAR',
      description: 'Full network access with 2 months free and priority agent processing.',
      features: ['Everything in Professional', 'White-label Options', 'API Access', 'Dedicated Account Manager', 'Custom Integrations'],
      cta: 'SAVE WITH ANNUAL',
      priceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID,
      highlighted: false,
    },
  ];

  const handleSubscribe = async (selectedPriceId: string | null, planId: string) => {
    if (!user) return;
    
    if (!selectedPriceId) {
      // It's the trial plan, which users already get on signup in this app
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, email: user.email, priceId: selectedPriceId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleManage = async () => {
    const stripeCustomerId = (status as any)?.stripeCustomerId;
    if (!stripeCustomerId) return;
    setLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeCustomerId }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const trialDaysLeft = status?.trialDaysLeft || 0;
  const isTrialExpired = status?.access === 'blocked' && status?.status === 'trial_expired';

  return (
    <div className="min-h-screen bg-slate-900 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-yellow-400 text-sm font-bold tracking-[0.3em] mb-4 uppercase">⚡ PREMIUM A2A SUBSCRIPTION PLANS</h2>
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter">Choose Your Plan</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Unlock the full power of AI-driven real estate management with our neural agent network.</p>
        </div>

        {isTrialExpired && status?.subscriptionStatus !== 'active' && (
          <div className="mb-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-start gap-4 text-yellow-500">
            <AlertCircle className="mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold tracking-tight uppercase">Intelligence Access Suspended</h3>
              <p className="text-sm opacity-80 mt-1 font-medium">Your 7-day neural trial has expired. Subscribe to a professional plan below to restore full system capabilities.</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2rem] p-8 border transition-all duration-500 ${
                plan.highlighted
                  ? 'border-yellow-500/50 bg-slate-800/80 scale-105 shadow-[0_0_50px_rgba(234,179,8,0.1)]'
                  : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-slate-900 text-[10px] font-black px-5 py-1.5 rounded-full tracking-[0.2em] uppercase shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-yellow-400 text-xs font-black tracking-[0.2em] uppercase mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-slate-400 text-sm font-bold uppercase ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate-400 font-medium h-12">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 min-h-[220px]">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 text-yellow-500 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="font-medium leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId, plan.id)}
                disabled={loading || (status?.subscriptionStatus === 'active' && plan.priceId !== null)}
                className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all active:scale-[0.98] ${
                  plan.highlighted
                    ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : status?.subscriptionStatus === 'active' && plan.priceId !== null ? (
                  'ACTIVE PLAN'
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase">Built with Neural A2A Core v4.0</p>
          <div className="flex gap-8 text-[10px] font-black tracking-[0.3em] uppercase">
            <span>Enterprise Security</span>
            <span>PCI Compliance</span>
            <span>256-bit Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};
