import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, CheckCircle2, UserCheck, Shield, PenTool, Radio, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, loginAs, signUpUser, currentUser, realTimeSession } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  // Sign up fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student_contributor');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      loginAs(user.id);
      onClose();
    } else {
      setError('No registered account found with that email address. You can create a new account below or choose a demo persona.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !department.trim()) {
      setError('Please fill in your full name, university email, and department/major.');
      return;
    }

    signUpUser({
      name,
      email,
      role,
      department,
      bio: bio || (role === 'student_contributor' ? 'Undergraduate contributor to Pratidhwani review.' : 'Editorial Board Reviewer.'),
      studentId: role === 'student_contributor' ? (studentId || `ST-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FBF9F5] border border-stone-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans">
                Campus Publication Portal
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono border border-emerald-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Auth Gateway</span>
              </span>
            </div>
            <h3 className="font-editorial-serif text-2xl font-medium text-stone-900 mt-0.5">
              {mode === 'signin' ? 'Sign In to Pratidhwani' : 'Register Contributor or Admin'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time session telemetry badge */}
        <div className="bg-stone-900 text-stone-300 px-6 py-2.5 flex items-center justify-between text-[11px] font-mono border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Active Session: <strong className="text-white">{realTimeSession.sessionId}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span>Current: <strong className="text-amber-400 font-sans">{currentUser.name}</strong></span>
            <span>·</span>
            <span>{realTimeSession.lastPing}</span>
          </div>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="bg-stone-100/80 px-6 py-3 border-b border-stone-200">
          <p className="text-[11px] text-stone-600 mb-2 font-medium">
            Instant Test Logins (Click to switch immediately):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAs('user-student-1');
                onClose();
              }}
              className="text-left px-3 py-2 bg-white border border-stone-200 rounded text-xs hover:border-[#9A3412] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-[#9A3412] shrink-0" />
              <div className="truncate">
                <div className="font-medium text-stone-900 leading-tight">Kavya Krishnan</div>
                <div className="text-[10px] text-stone-500 truncate">Student Author</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAs('user-admin-1');
                onClose();
              }}
              className="text-left px-3 py-2 bg-white border border-stone-200 rounded text-xs hover:border-[#9A3412] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <div className="truncate">
                <div className="font-medium text-stone-900 leading-tight">Prof. Gayatri Sengupta</div>
                <div className="text-[10px] text-stone-500 truncate">Editorial Admin</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-3 text-center cursor-pointer transition-colors ${
              mode === 'signin'
                ? 'bg-white text-stone-900 border-b-2 border-[#9A3412] font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-center cursor-pointer transition-colors ${
              mode === 'signup'
                ? 'bg-white text-stone-900 border-b-2 border-[#9A3412] font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Form content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. maya.lin@campus.edu"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] focus:border-[#9A3412] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] focus:border-[#9A3412] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-sm font-medium transition-colors cursor-pointer mt-2"
              >
                Sign In to Review Portal
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              {/* Role selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Institutional Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student_contributor')}
                    className={`p-2.5 rounded text-left border cursor-pointer transition-all ${
                      role === 'student_contributor'
                        ? 'border-[#9A3412] bg-[#9A3412]/5 ring-1 ring-[#9A3412]'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
                      <PenTool className="w-3.5 h-3.5 text-[#9A3412]" />
                      Student Contributor
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      Submit articles, poetry, artwork, track review status & comments.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('editorial_admin')}
                    className={`p-2.5 rounded text-left border cursor-pointer transition-all ${
                      role === 'editorial_admin'
                        ? 'border-stone-900 bg-stone-100 ring-1 ring-stone-900'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900">
                      <Shield className="w-3.5 h-3.5 text-emerald-700" />
                      Editorial Board Admin
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      Approve/edit/reject manuscripts, compile editions, moderate content.
                    </p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Kavya Krishnan"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Campus Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="kavya.krishnan@campus.edu"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Department / Discipline
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Literature"
                    required
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {role === 'student_contributor' ? 'Student ID / Year' : 'Faculty / Staff Title'}
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder={role === 'student_contributor' ? 'ST-2024-001' : 'Faculty Chair'}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Author / Reviewer Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Brief scholarly or literary interest..."
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-sm font-medium transition-colors cursor-pointer"
              >
                Register & Enter Portal
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
