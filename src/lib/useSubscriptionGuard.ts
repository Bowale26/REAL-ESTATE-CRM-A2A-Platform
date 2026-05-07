import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Subscription Guard Hook
 * Checks trial status on app load. If expired → redirects to /billing
 */
export function useSubscriptionGuard(userId: string | undefined) {
  const [status, setStatus] = useState<'loading' | 'trial' | 'active' | 'expired' | 'error'>('loading');
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/subscription-status/${userId}`);
        const data = await response.json();

        if (data.access === 'blocked') {
          // Trial expired or payment failed → force to pricing
          setStatus('expired');
          // Use /billing as per current app structure
          if (window.location.pathname !== '/billing') {
            navigate('/billing', { replace: true });
          }
        } else if (data.status === 'trial') {
          setStatus('trial');
          setTrialDaysLeft(data.trialDaysLeft);
        } else if (['trialing', 'active'].includes(data.status)) {
          setStatus('active');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Subscription check failed:', error);
        setStatus('error');
      }
    };

    if (userId) {
      checkSubscription();
    } else if (userId === undefined) {
      setStatus('loading');
    }
  }, [userId, navigate]);

  return { status, trialDaysLeft };
}
