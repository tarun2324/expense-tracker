'use client';
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut, GoogleAuthProvider, UserCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type AuthUserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<UserCredential | undefined>;
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

  const loginWithGoogle: () => Promise<UserCredential | undefined> = async () => {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, isAuthenticated: !!user, loading, loginWithGoogle, logout };
}

export function AuthUserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading, loginWithGoogle, logout } = useAuthUser();
  if (loading) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-10">
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-8 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
      </div>
      </div>
    );
  }
  return (
    <AuthUserContext value={{ loading, user, isAuthenticated, loginWithGoogle, logout }}>
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
