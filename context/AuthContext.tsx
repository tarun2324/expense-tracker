'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthUserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthUserContext = createContext<AuthUserContextType | undefined>(undefined);

function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, isAuthenticated: !!user, loading, loginWithGoogle, logout };
}

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const auth = useAuthUser();
  return (
    <AuthUserContext value={auth}>
      {children}
    </AuthUserContext>
  );
}

export function useAuthUserContext() {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error('useAuthUserContext must be used within an AuthUserProvider');
  }
  return context;
}
