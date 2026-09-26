import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, PenTool, ShieldCheck, Bell, ChevronDown, UserCircle, LogOut, Share2 } from 'lucide-react';

interface NavbarProps {
  activeView: 'home' | 'student-dashboard' | 'admin-dashboard';
  setActiveView: (view: 'home' | 'student-dashboard' | 'admin-dashboard') => void;
  onOpenAuthModal: () => void;
  onOpenEditionModal: () => void;
  onOpenShareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenAuthModal,
  onOpenEditionModal,
  onOpenShareModal,
}) => {
  const { currentUser, allUsers, loginAs, switchRole, notifications, realTimeSession } = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const unreadNotifications = notifications.filter(
    n => n.recipientUserId === currentUser.id && !n.read
  );

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark (Top Bar Contract) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="text-left group cursor-pointer focus-visible:outline-none flex items-baseline gap-2"
          >
            <span className="font-editorial-serif text-2xl md:text-3xl font-medium tracking-tight text-stone-900 group-hover:text-[#9A3412] transition-colors">
              Pratidhwani
            </span>
            <span className="hidden xl:inline text-xs text-stone-400 font-editorial-serif italic">
              प्रतिध्वनि
            </span>
          </button>
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-stone-500 font-sans pl-2 border-l border-stone-300">
            Vol. XXVIII · Campus Review
          </span>

          {/* Real-time auth status badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[10px] text-emerald-800 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Live Auth: {currentUser.role === 'editorial_admin' ? 'Board Chair' : 'Student Contributor'}</span>
          </div>
        </div>

        {/* Zone 2: 4–6 clean text navigation links (No pills, subtle hover underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('edition-spotlight');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-stone-950 transition-colors cursor-pointer py-1"
          >
            Current Edition
          </button>

          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('trending-articles');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-stone-950 transition-colors cursor-pointer py-1"
          >
            Articles & Poems
          </button>

          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('editorial-workflow');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-stone-950 transition-colors cursor-pointer py-1"
          >
            How It Works
          </button>

          <button
            onClick={() => {
              setActiveView('home');
              const el = document.getElementById('about-society');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-stone-950 transition-colors cursor-pointer py-1"
          >
            About Society
          </button>

          {/* Quick view digital broadside */}
          <button
            onClick={onOpenEditionModal}
            className="text-[#9A3412] hover:text-[#78280d] transition-colors cursor-pointer py-1 font-medium"
          >
            Digital Broadside
          </button>
        </nav>

        {/* Zone 3: 1–2 primary actions & User Role Quick Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotificationsDropdown(prev => !prev);
                setShowUserDropdown(false);
              }}
              title="Notifications"
              className="relative p-2 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer focus-visible:outline-stone-400"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#9A3412]" />
              )}
            </button>

            {/* Notification Drawer */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-sans">
                    Reader & Editorial Notifications
                  </span>
                  <span className="text-xs text-stone-500 font-mono tabular-nums">
                    {unreadNotifications.length} unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                  {notifications.filter(n => n.recipientUserId === currentUser.id).length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications
                      .filter(n => n.recipientUserId === currentUser.id)
                      .slice(0, 8)
                      .map(notif => (
                        <div
                          key={notif.id}
                          className={`p-3 text-xs transition-colors hover:bg-stone-50 ${!notif.read ? 'bg-[#9A3412]/5 font-medium' : ''}`}
                        >
                          <div className="flex items-center justify-between text-stone-500 mb-1">
                            <span className="text-[11px] text-[#9A3412] font-semibold">{notif.title}</span>
                            <span className="text-[10px] text-stone-400 font-mono">{notif.timestamp}</span>
                          </div>
                          <p className="text-stone-700 leading-snug">{notif.message}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Direct Role Dashboard Switcher */}
          {currentUser.role === 'student_contributor' ? (
            <button
              onClick={() => setActiveView(activeView === 'student-dashboard' ? 'home' : 'student-dashboard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeView === 'student-dashboard'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-[#9A3412]" />
              <span className="hidden sm:inline">Student Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView(activeView === 'admin-dashboard' ? 'home' : 'admin-dashboard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeView === 'admin-dashboard'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Editorial Console</span>
              <span className="sm:hidden">Console</span>
            </button>
          )}

          {/* Share Website Button */}
          <button
            onClick={onOpenShareModal}
            title="Share Pratidhwani"
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#9A3412]" />
            <span className="hidden sm:inline">Share Site</span>
          </button>

          {/* User Profile / Fast Real-time Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(prev => !prev);
                setShowNotificationsDropdown(false);
              }}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-stone-100 transition-colors cursor-pointer text-stone-700"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-stone-300"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <span className="hidden lg:inline text-xs font-medium text-stone-900 max-w-[110px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-stone-900">{currentUser.name}</p>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-stone-800">
                      {currentUser.role === 'editorial_admin' ? 'Editorial Board Admin' : 'Student Contributor'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {realTimeSession.lastPing}
                    </span>
                  </div>
                </div>

                {/* Instant Real-Time Role Switcher */}
                <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-100">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1.5">
                    Real-Time Persona Switch
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('student_contributor');
                        setShowUserDropdown(false);
                      }}
                      className={`px-2.5 py-1.5 rounded text-xs text-left border cursor-pointer transition-colors ${
                        currentUser.role === 'student_contributor'
                          ? 'bg-white border-[#9A3412] text-[#9A3412] font-semibold'
                          : 'bg-white/80 border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      Student Contributor
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        switchRole('editorial_admin');
                        setShowUserDropdown(false);
                      }}
                      className={`px-2.5 py-1.5 rounded text-xs text-left border cursor-pointer transition-colors ${
                        currentUser.role === 'editorial_admin'
                          ? 'bg-white border-emerald-700 text-emerald-800 font-semibold'
                          : 'bg-white/80 border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      Editorial Admin
                    </button>
                  </div>
                </div>

                {/* Specific campus user account list */}
                <div className="px-4 py-2 max-h-48 overflow-y-auto">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
                    Select Specific Campus User
                  </div>
                  <div className="space-y-1">
                    {allUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          loginAs(user.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          user.id === currentUser.id
                            ? 'bg-stone-100 font-semibold text-stone-900'
                            : 'hover:bg-stone-50 text-stone-600'
                        }`}
                      >
                        <span className="truncate">{user.name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {user.role === 'editorial_admin' ? 'Admin' : 'Student'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-100 px-4 pt-2 mt-1 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onOpenAuthModal();
                      setShowUserDropdown(false);
                    }}
                    className="text-xs text-[#9A3412] hover:underline font-medium cursor-pointer"
                  >
                    Custom Sign In / Register
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

