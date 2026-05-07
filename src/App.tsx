import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, checkDbConnection } from './lib/firebase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Billing } from './components/Billing';
import { Landing } from './components/Landing';
import { Loader2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from './lib/firebaseUtils';

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
  const [dbError, setDbError] = useState<string | null>(null);

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

  const initializeUserInCRM = async (user: User) => {
    try {
      setLoading(true);
      // Initialize user on the backend to avoid client-side permission issues
      const initResponse = await fetch('/api/init-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          displayName: user.displayName
        })
      });

      if (!initResponse.ok) {
        const errorData = await initResponse.json();
        console.error("Status check error handled:", errorData.error);
      }

      await fetchStatus(user.uid);
    } catch (err: any) {
      console.error("Status check error handled:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const runChecks = async () => {
      const isConnected = await checkDbConnection();
      if (!isConnected) {
        setDbError("CRITICAL: The Firestore API is not yet initialized or is disabled in your project. Please wait a few minutes or enable it at https://console.cloud.google.com/apis/library/firestore.googleapis.com");
      }
    };
    runChecks();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await initializeUserInCRM(user);
      } else {
        setStatus(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, loading, refreshStatus: () => user ? fetchStatus(user.uid) : Promise.resolve() }}>
      {dbError && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white p-4 text-center font-black text-xs uppercase tracking-[0.2em] shadow-2xl animate-bounce">
          {dbError}
        </div>
      )}
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
