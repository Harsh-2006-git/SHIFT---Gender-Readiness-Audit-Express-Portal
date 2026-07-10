import React from 'react';

interface AdminLoginViewProps {
  adminEmail: string;
  adminPassword: string;
  adminError: string;
  setAdminEmail: (v: string) => void;
  setAdminPassword: (v: string) => void;
  handleAdminLogin: (e: React.FormEvent) => void;
}

export default function AdminLoginView({
  adminEmail,
  adminPassword,
  adminError,
  setAdminEmail,
  setAdminPassword,
  handleAdminLogin
}: AdminLoginViewProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50/40 via-slate-50 to-blue-50/40 flex items-center justify-center p-3 py-8 sm:p-6 md:p-8 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-200/30 blur-[130px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-200/30 blur-[130px]" />

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-lg rounded-[2.5rem] border border-slate-200/70 shadow-2xl overflow-hidden flex flex-col md:flex-row text-xs animate-fadeIn relative z-10">
        
        {/* Left Side: Info Column */}
        <div className="md:w-[45%] bg-gradient-to-br from-slate-50 via-[#F8FAFC] to-[#EEF2FF]/30 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-200/80">
          <div className="relative z-10 space-y-4 md:space-y-6 my-auto">
            <div className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-650 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Secure Admin Console
            </div>
            
            <div className="space-y-2 md:space-y-3 w-full">
              <h3 className="text-center md:text-left text-2xl sm:text-3xl md:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                SHIFT Audit Platform
              </h3>
              <p className="hidden md:block text-slate-500 leading-relaxed font-medium text-xs">
                Authentication required. Enter your corporate credentials to inspect diagnostic submissions, view GRS scores, and manage organization records.
              </p>
            </div>

            <div className="hidden md:flex p-4 rounded-2xl bg-white border border-slate-200 shadow-sm items-start gap-3">
              <span className="text-base text-indigo-600 mt-0.5">🔒</span>
              <div className="space-y-1">
                <h5 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider">Restricted Terminal</h5>
                <p className="text-[9.5px] text-slate-450 leading-normal font-medium">All attempts, successful logins, and data modifications are logged to secure database tables.</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block relative z-10 text-[9.5px] text-slate-400 font-medium pt-8 mt-auto md:pt-0">
            Even Cargo LLP © 2026. All rights reserved.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-[55%] p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Administrator Sign In
            </h2>
            <p className="text-slate-500 text-xs font-medium">Please authenticate to continue to dashboard</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="flex flex-col">
              <label htmlFor="admin-email" className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="admin-email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:border-transparent transition-all text-xs font-medium shadow-xs"
                placeholder="admin@evencargo.in"
                required
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="admin-password" className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[9.5px] text-indigo-600 font-bold cursor-pointer hover:underline">Forgot Password?</span>
              </div>
              <input
                type="password"
                id="admin-password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:border-transparent transition-all text-xs font-medium shadow-xs"
                placeholder="••••••••"
                required
              />
            </div>

            {adminError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-650 font-semibold text-[10.5px] flex items-center gap-2">
                <span>⚠️</span> {adminError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all cursor-pointer text-center"
            >
              Sign In
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
