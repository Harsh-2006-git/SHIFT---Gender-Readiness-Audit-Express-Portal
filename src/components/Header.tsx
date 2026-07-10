import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  activeTab: 'portal' | 'about';
  setActiveTab: (tab: 'portal' | 'about') => void;
  step: 'profile' | 'audit' | 'report';
  handleReset: () => void;
  onRequestAudit: () => void;
  onLogoClick?: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  step,
  handleReset,
  onRequestAudit,
  onLogoClick,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="no-print w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-50 h-[64px] sm:h-[80px] flex items-center transition-all duration-200 shadow-xs relative">
      <div className="w-full px-3 sm:px-6 md:px-10 flex items-center justify-between gap-3">

        {/* ── LEFT SECTION: Logo + Title ────────────────────────────── */}
        <Link 
          href="/" 
          onClick={(e) => {
            if (onLogoClick) {
              e.preventDefault();
              onLogoClick();
            }
          }}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group cursor-pointer decoration-none"
        >
          {/* logo.png made bigger in mobile header (h-12 w-12 / 48px) */}
          <div className="relative h-[48px] w-[48px] sm:h-[66px] sm:w-[66px] transition-transform duration-300 group-hover:scale-[1.02] shrink-0">
            <Image
              src="/logo.png"
              alt="Even Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Heading and Subtitle (Full Heading visible on all screens) */}
          <div className="flex flex-col justify-center select-none leading-none">
            <h1 
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} 
              className="text-[17px] sm:text-[25px] font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wider leading-none"
            >
              SHIFT
            </h1>
            <span 
              style={{ fontFamily: "'Inter', sans-serif" }} 
              className="block text-[8px] sm:text-[9.5px] font-semibold text-[#475569] tracking-wider uppercase leading-none mt-1 sm:mt-1.5 animate-fadeIn"
            >
              <span className="hidden sm:inline">Gender Readiness Audit <span className="text-[#2563EB]/80 font-bold">•</span> Express Portal</span>
              <span className="sm:hidden">Express Portal</span>
            </span>
          </div>
        </Link>

        {/* ── RIGHT SECTION: Controls & Navigation ───────────────────── */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Mobile CTA Button (visible next to hamburger on mobile < md) */}
          <button
            onClick={onRequestAudit}
            style={{ 
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 6px 15px rgba(37,99,235,.12)'
            }}
            className="md:hidden h-[32px] px-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-[10.5px] rounded-lg flex items-center gap-1 cursor-pointer transition select-none active:scale-[0.98]"
          >
            <span>Request Audit</span>
          </button>

          {/* DESKTOP CONTROLS & NAV (visible >= md) */}
          <div className="hidden md:flex items-center gap-6">
            <nav 
              className="flex items-center bg-[#F8FAFC] border border-[#E2E8F0] h-[38px] rounded-full p-1 gap-0.5 shadow-xs shrink-0"
            >
              <button
                onClick={() => setActiveTab('portal')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className={`h-full px-4 flex items-center text-[12.5px] font-medium rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  activeTab === 'portal'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]/30 font-semibold'
                    : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                }`}
              >
                Audit Portal
              </button>
              
              <button
                onClick={() => setActiveTab('about')}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className={`h-full px-4 flex items-center text-[12.5px] font-medium rounded-full transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'bg-white text-[#0F172A] shadow-xs border border-[#E2E8F0]/30 font-semibold'
                    : 'text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                }`}
              >
                About SHIFT
              </button>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              {step !== 'profile' && activeTab === 'portal' && (
                <button
                  onClick={handleReset}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="px-3 py-1.5 border border-[#CBD5E1] bg-white text-[#334155] text-xs font-semibold rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer shadow-xs"
                >
                  Reset
                </button>
              )}

              <button
                onClick={onRequestAudit}
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 8px 20px rgba(37,99,235,.15)'
                }}
                className="h-[38px] px-[16px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-[13px] rounded-lg flex items-center gap-1.5 hover:-translate-y-[0.5px] transition-all duration-150 cursor-pointer select-none active:scale-[0.98]"
              >
                <span className="whitespace-nowrap">Request Full Audit</span>
                <span className="text-[11px] leading-none shrink-0 ml-0.5">&rarr;</span>
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button (visible < md, sits beside Mobile CTA) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition cursor-pointer shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? (
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

        </div>

      </div>

      {/* ── MOBILE DROPDOWN DRAWER OVERLAY ─────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden absolute top-[64px] left-0 w-full bg-white border-b border-[#E5E7EB] p-4 flex flex-col gap-4 shadow-lg animate-fadeIn z-40">
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                setActiveTab('portal');
                setMenuOpen(false);
              }}
              style={{ fontFamily: "'Inter', sans-serif" }}
              className={`w-full py-2.5 px-4 text-left text-xs font-semibold rounded-xl transition ${
                activeTab === 'portal'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Audit Portal
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                setMenuOpen(false);
              }}
              style={{ fontFamily: "'Inter', sans-serif" }}
              className={`w-full py-2.5 px-4 text-left text-xs font-semibold rounded-xl transition ${
                activeTab === 'about'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              About SHIFT Framework
            </button>
          </nav>

          {step !== 'profile' && activeTab === 'portal' && (
            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  handleReset();
                  setMenuOpen(false);
                }}
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="w-full py-2.5 border border-slate-200 bg-white text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition shadow-xs text-center"
              >
                Reset Diagnostic
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
