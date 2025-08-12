'use client';
import dynamic from "next/dynamic";
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), { ssr: false });
const PWAInstallPrompt = dynamic(() => import("@/components/PWAInstallPrompt"), { ssr: false });
import { useAuthUserContext } from "@/context/AuthContext";
import React, { useState } from "react";
import { useGroupContext } from "@/context/GroupContext";
import Link from "next/link";

const Settings: React.FC = () => {
  const { loginWithGoogle, logout, user, loading } = useAuthUserContext();
  const { groups, selectedGroup, setSelectedGroupId, loading: groupLoading } = useGroupContext();
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("settings-dropdown");
      const button = document.getElementById("settings-button");

      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="z-20 text-right p-2">
      <button
        id="settings-button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Settings"
      >
        {/* Settings Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-zinc-700 dark:text-zinc-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      </button>

      {showDropdown && (
        <div
          id="settings-dropdown"
          className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl py-2 z-30 transition-all"
        >
          {loading || groupLoading ? (
            <div className="px-4 py-2 text-zinc-600 dark:text-zinc-300 text-sm">Loading...</div>
          ) : user ? (
            <>
              <div className="px-4 py-2 text-sm truncate text-zinc-700 dark:text-zinc-300">
                <span className="font-mono text-black dark:text-white break-all">{user.displayName}</span>
              </div>

              {groups.length > 0 && (
                <div className="px-4 py-2">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wide">Groups</div>
                  <ul className="space-y-1">
                    {groups.map(group => (
                      <li key={group.id}>
                        <button
                          className={`w-full text-left px-3 py-1.5 rounded-xl transition-all duration-150
                        ${selectedGroup?.id === group.id
                              ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                            }`}
                          onClick={() => {
                            setSelectedGroupId(group.id);
                            setShowDropdown(false);
                          }}
                        >
                          {group.name}
                        </button>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/group"
                        className="block w-full text-left px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        onClick={() => setShowDropdown(false)}
                      >
                        Add Group
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              <div className="px-4 py-2 flex flex-col gap-2">
                <PushNotificationManager />
                <PWAInstallPrompt />
              </div>
              <button
                onClick={() => {
                  logout?.();
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                loginWithGoogle?.();
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Login (Anonymous)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;