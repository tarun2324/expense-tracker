'use client';
import React, { useEffect } from 'react';
import { addUserIfNotExists } from '@/lib/database';
import { useRouter } from 'next/navigation';
import { useAuthUserContext } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const { user, loginWithGoogle } = useAuthUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    let currentUser = user;
    try {
      const userCred = await loginWithGoogle()
      if (userCred && userCred.user) {
        currentUser = userCred.user;
      }
    } catch (e) {
      // ignore, fallback to context user
    }
    if (currentUser) {
      await addUserIfNotExists(currentUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 px-4 font-inter">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-6 text-center">
          Sign in to continue
        </h1>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 text-base font-semibold bg-black text-white dark:bg-white dark:text-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform duration-200"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44.5 20H24v8.5h11.8C34.1 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 4.8 29.5 3 24 3 11.8 3 2 12.8 2 25s9.8 22 22 22c11.3 0 21-8.2 21-22 0-1.3-.2-2.7-.5-4z"
              fill="#FFC107"
            />
            <path
              d="M3.1 14.7l6.6 4.8C11.7 16.1 17.3 13 24 13c3.1 0 6 1.1 8.2 2.9l6.2-6.2C34.5 4.8 29.5 3 24 3c-8.4 0-15.6 4.3-19.9 11z"
              fill="#FF3D00"
            />
            <path
              d="M24 47c5.3 0 10.1-1.8 13.9-4.9l-6.4-5.2C29.6 39.7 26.9 41 24 41c-6 0-11.1-3.9-12.9-9.3l-6.6 5.1C8.4 43.4 15.6 47 24 47z"
              fill="#4CAF50"
            />
            <path
              d="M44.5 20H24v8.5h11.8C34.9 32.1 30 37 24 37c-6 0-11.1-3.9-12.9-9.3l-6.6 5.1C8.4 43.4 15.6 47 24 47c11.3 0 21-8.2 21-22 0-1.3-.2-2.7-.5-4z"
              fill="#1976D2"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
