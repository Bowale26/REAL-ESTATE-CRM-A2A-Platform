import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle } from './lib/firebase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Billing } from './components/Billing';
import { Landing } from './components/Landing';
import { Loader2 } from 'lucide-react';

interface UserStatus {
  email: string;
  displayName?: string | null;
  createdAt: any;
  trialStart?: any;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus: 'trialing' | 'active' | 'canceled' | 'past_due' | 'none';
  currentPeriodEnd?: any;
  plan?: 'monthly' | 'yearly' | 'none';
  updatedAt: any;
  status?: 'trial' | 'active' | 'trial_expired' | 'no_account' | string;
  access?: 'full' | 'limited' | 'blocked';
  trialDaysLeft?: number;
}

interface AuthContextType {
  user: User | null;
  status: UserStatus | null;
  loading: boolean;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async (uid: string) => {
    try {
      const response = await fetch(`/api/subscription-status/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        setLoading(true); // Keep loading while we fetch data
        try {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              email: user.email,
              displayName: user.displayName,
              trialStart: serverTimestamp(),
              subscriptionStatus: 'trialing',
              plan: 'none',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
          await fetchStatus(user.uid);
        } catch (err) {
          console.error("Error setting up user profile:", err);
        }
      } else {
        setStatus(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, loading, refreshStatus: () => user ? fetchStatus(user.uid) : Promise.resolve() }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, status } = useAuth();
  const location = useLocation();
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
  
  if (!user) return <Navigate to="/" />;

  // Access-based check: Allow /billing even if blocked
  if (status?.access === 'blocked' && location.pathname !== '/billing') {
    return <Navigate to="/billing" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute>
              <Layout>
                <Billing />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
