import React, { useState, useEffect, useMemo } from 'react';
import questionsData from '@/app/questions.json';

interface HistoryViewProps {
  onLoadAudit: (audit: any) => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void, confirmLabel?: string, cancelLabel?: string) => void;
  triggerAlert: (title: string, message: string, onConfirm?: () => void) => void;
  onLogout: () => void;
}

// ── VECTOR SVG ICONS SYSTEM ─────────────────────────────────────────

const SearchIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const LogoutIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const EyeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ReportIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const TrashIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const DatabaseIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const BrandLogo = ({ className = 'w-9 h-9' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

export default function HistoryView({
  onLoadAudit,
  triggerConfirm,
  triggerAlert,
  onLogout
}: HistoryViewProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [bandFilter, setBandFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchSubmissions = () => {
    setLoading(true);
    fetch('/api/audit')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSubmissions(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        triggerAlert('Error', 'Failed to retrieve past audits from database.');
      });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = (id: string, name: string) => {
    triggerConfirm(
      'Delete Submission',
      `Are you sure you want to permanently delete the audit submission for ${name || 'this organisation'}? This cannot be undone.`,
      () => {
        fetch(`/api/audit?id=${id}`, { method: 'DELETE' })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setSubmissions(prev => prev.filter(item => item.id !== id));
            } else {
              triggerAlert('Error', 'Failed to delete submission from database.');
            }
          })
          .catch(err => {
            triggerAlert('Error', 'Network error. Failed to delete submission.');
          });
      },
      'Delete',
      'Cancel'
    );
  };

  // Calculate stats values
  const avgGrs = useMemo(() => {
    if (submissions.length === 0) return 0;
    const sum = submissions.reduce((acc, curr) => acc + (curr.grs || 0), 0);
    return Math.round(sum / submissions.length);
  }, [submissions]);

  // Module Category Counts
  const countGig = useMemo(() => submissions.filter(s => s.profile.industry === 'A').length, [submissions]);
  const countWarehouse = useMemo(() => submissions.filter(s => s.profile.industry === 'B').length, [submissions]);
  const countSme = useMemo(() => submissions.filter(s => s.profile.industry === 'C').length, [submissions]);
  const countEv = useMemo(() => submissions.filter(s => s.profile.industry === 'D').length, [submissions]);

  const sectorMapping: Record<string, string> = {
    A: 'Gig Economy & Dark Stores',
    B: 'Warehousing & Fulfilment',
    C: 'SMEs Scale',
    D: 'EV Value Chain'
  };

  const getIndustryCode = (ind: string) => {
    const maps: Record<string, string> = { A: 'GIG', B: 'WHS', C: 'SME', D: 'EV' };
    return maps[ind] || 'GEN';
  };

  // Filter logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      // 1. Search Match
      const name = (sub.profile.name || '').toLowerCase();
      const website = (sub.profile.website || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch = name.includes(query) || website.includes(query);

      // 2. Sector Match
      const matchesSector = sectorFilter === '' || sub.profile.industry === sectorFilter;

      // 3. Band Match
      const matchesBand = bandFilter === '' || sub.band === bandFilter;

      // 4. Score Match
      let matchesScore = true;
      if (scoreFilter !== '') {
        const grs = sub.grs || 0;
        if (scoreFilter === 'high') {
          matchesScore = grs >= 85;
        } else if (scoreFilter === 'mid') {
          matchesScore = grs >= 70 && grs < 85;
        } else if (scoreFilter === 'pass') {
          matchesScore = grs >= 55 && grs < 70;
        } else if (scoreFilter === 'low') {
          matchesScore = grs < 55;
        }
      }

      return matchesSearch && matchesSector && matchesBand && matchesScore;
    });
  }, [submissions, searchQuery, sectorFilter, bandFilter, scoreFilter]);

  const getAvatarInitials = (name: string) => {
    if (!name) return 'CO';
    const clean = name.trim().replace(/[^a-zA-Z0-9 ]/g, '');
    const words = clean.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-650"></div>
        <p className="text-slate-500 font-medium text-xs">Loading admin command center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-[#334155] font-sans flex flex-col antialiased" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      
      {/* ── TOP NAVIGATION HEADER (POLISHED & MODERN) ───────────────── */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="text-indigo-650">
            <BrandLogo className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">SHIFT Administrative Console</h1>
            <p className="hidden sm:block text-[9.5px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Even Cargo Corporate Diagnostics</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE]/40 text-[10.5px] font-semibold text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Database Synced
          </div>
          
          <button
            onClick={onLogout}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-xs bg-white"
          >
            <LogoutIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────── */}
      <main className="flex-grow p-4 sm:p-6 md:p-10 max-w-[1400px] w-full mx-auto space-y-8">
        
        {/* Page Title Intro */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Operational Diagnostics & Submissions
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Track real-time GRS scores, filter organization metrics, and perform administrative audits.
          </p>
        </div>

        {/* ── SIX COMPACT STATS BOXES ROW (UNIFIED THEME) ────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Card 1: Total Audits */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-slate-200/65 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-650 flex items-center justify-center mb-1.5 sm:mb-2.5 transition-colors group-hover:bg-blue-100 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight num-sans leading-none">
                {submissions.length}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-450 uppercase tracking-widest mt-1">
                Total Audits
              </span>
            </div>
          </div>

          {/* Card 2: Average GRS */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-slate-200/65 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 sm:mb-2.5 transition-colors group-hover:bg-amber-100 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight num-sans leading-none">
                {avgGrs}%
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-450 uppercase tracking-widest mt-1">
                Average GRS Score
              </span>
            </div>
          </div>

          {/* Card 3: Gig & Dark Store (Module A) */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-slate-200/65 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-650 flex items-center justify-center mb-1.5 sm:mb-2.5 transition-colors group-hover:bg-emerald-100 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight num-sans leading-none">
                {countGig}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-450 uppercase tracking-widest mt-1">
                Gig / Dark Store
              </span>
            </div>
          </div>

          {/* Card 4: Warehousing (Module B) */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-slate-200/65 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-1.5 sm:mb-2.5 transition-colors group-hover:bg-purple-100 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight num-sans leading-none">
                {countWarehouse}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-455 uppercase tracking-widest mt-1">
                Warehouses
              </span>
            </div>
          </div>

          {/* Card 5: SMEs (Module C) */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-slate-200/65 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5 sm:mb-2.5 transition-colors group-hover:bg-rose-100 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight num-sans leading-none">
                {countSme}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-455 uppercase tracking-widest mt-1">
                SMEs Scale
              </span>
            </div>
          </div>

          {/* Card 6: EV Value Chain (Module D) */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-slate-200/65 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center mb-1.5 sm:mb-2.5 transition-colors group-hover:bg-indigo-100 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-3xl font-bold text-slate-800 tracking-tight num-sans leading-none">
                {countEv}
              </span>
              <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-455 uppercase tracking-widest mt-1">
                EV Value Chain
              </span>
            </div>
          </div>

        </div>

        {/* ── SEARCH & FILTERS BAR ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company name or domain website..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent text-xs font-medium text-slate-700 shadow-xs"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </span>
            </div>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap ${
                showFilters 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>⚙️</span>
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              {(sectorFilter || bandFilter || scoreFilter) && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              )}
            </button>
          </div>

          {/* Collapsible Filters Row */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Sector Module</label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent text-xs font-medium text-slate-700 cursor-pointer shadow-xs"
                >
                  <option value="">All Sectors</option>
                  <option value="A">Gig & Dark Store (GIG)</option>
                  <option value="B">Warehousing (WHS)</option>
                  <option value="C">SMEs (SME)</option>
                  <option value="D">EV Value Chain (EV)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">GRS Band</label>
                <select
                  value={bandFilter}
                  onChange={(e) => setBandFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent text-xs font-medium text-slate-700 cursor-pointer shadow-xs"
                >
                  <option value="">All Bands</option>
                  <option value="SHIFT Leader">SHIFT Leader</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Committed">Committed</option>
                  <option value="Aware">Aware</option>
                  <option value="Gender-Blind">Gender-Blind</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block">Rating Score</label>
                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent text-xs font-medium text-slate-700 cursor-pointer shadow-xs"
                >
                  <option value="">All Scores</option>
                  <option value="high">Leader (85%+)</option>
                  <option value="mid">Advanced (70-84%)</option>
                  <option value="pass">Committed (55-69%)</option>
                  <option value="low">Critical (Below 55%)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── SUBMISSIONS DIRECTORY TABLE (MOCKUP ACCURATE) ──────────── */}
        {filteredSubmissions.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-slate-200 bg-white rounded-2xl shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3.5 border border-slate-100">
              <DatabaseIcon className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No submissions match selected query</h4>
            <p className="text-slate-405 mt-1 max-w-sm mx-auto leading-relaxed text-[11px] font-medium">
              Adjust search query inputs or clear active sector and score filters to show records.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    <th className="py-4 px-3 sm:px-6">User & Contact</th>
                    <th className="py-4 px-3 sm:px-6">Current Company</th>
                    <th className="py-4 px-3 sm:px-6">Branch & Scale</th>
                    <th className="py-4 px-3 sm:px-6">Joined Date</th>
                    <th className="py-4 px-3 sm:px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                  {filteredSubmissions.map((sub: any) => {
                    const submissionDate = new Date(sub.submittedAt);
                    const formattedDate = submissionDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });
                    const formattedTime = submissionDate.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });

                    const scoreColor = sub.grs >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-100/50' :
                                       sub.grs >= 70 ? 'text-teal-700 bg-teal-50 border-teal-100/50' :
                                       sub.grs >= 55 ? 'text-indigo-700 bg-indigo-50 border-indigo-100/50' :
                                       sub.grs >= 40 ? 'text-amber-700 bg-amber-50 border-amber-100/50' :
                                                       'text-rose-700 bg-rose-50 border-rose-100/50';

                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/20 transition duration-150">
                        
                        {/* Column 1: User & Contact */}
                        <td className="py-4 px-3 sm:px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-[12.5px] border border-indigo-100/30 shrink-0">
                              {getAvatarInitials(sub.profile.name)}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-semibold text-[13px] text-slate-855 leading-snug flex items-center gap-1.5">
                                {sub.profile.contactPerson}
                                {sub.grs >= 85 && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold uppercase tracking-wider">
                                    Leader
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-normal leading-none break-all">{sub.profile.email}</p>
                              <p className="text-[10px] text-slate-400 font-medium leading-none num-sans mt-0.5">{sub.profile.mobile}</p>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Current Company */}
                        <td className="py-4 px-3 sm:px-6">
                          <div className="space-y-0.5">
                            <span className="text-[12px] font-semibold text-indigo-650 block leading-tight">
                              {sectorMapping[sub.profile.industry] || 'General Sector'}
                            </span>
                            <span className="text-[10.5px] text-slate-500 font-medium block">
                              {sub.profile.name} — <a href={sub.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{sub.profile.website}</a>
                            </span>
                          </div>
                        </td>

                        {/* Column 3: Branch & Scale */}
                        <td className="py-4 px-3 sm:px-6">
                          <div className="space-y-0.5 text-slate-550 font-medium">
                            <div className="font-semibold text-slate-700">Batch: {getIndustryCode(sub.profile.industry)} Operations</div>
                            <div className="text-[10px]">Locations: {sub.profile.locations}</div>
                            <div className="text-[9.5px] uppercase tracking-wider">Scale: {sub.profile.employees} employees</div>
                          </div>
                        </td>

                        {/* Column 4: Joined Date */}
                        <td className="py-4 px-3 sm:px-6">
                          <div className="space-y-0.5 font-semibold text-slate-700">
                            <span className="block text-[11.5px]">{formattedDate}</span>
                            <span className="text-slate-400 block text-[9.5px] font-medium uppercase tracking-wider mt-0.5">{formattedTime}</span>
                          </div>
                        </td>

                        {/* Column 5: Actions */}
                        <td className="py-4 px-3 sm:px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            
                            {/* Score status badge */}
                            <span className={`px-2.5 py-1.5 rounded-xl text-[9.5px] font-bold border uppercase tracking-wider num-sans shrink-0 text-center ${scoreColor}`}>
                              {sub.grs}% {sub.band.split(' ')[0]}
                            </span>
                            
                            {/* Inspect responses */}
                            <button
                              onClick={() => setSelectedAudit(sub)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 rounded-xl font-semibold transition shadow-xs cursor-pointer text-[10px] flex items-center gap-1.5 shrink-0"
                              title="Inspect 20 responses"
                            >
                              <EyeIcon className="w-3.5 h-3.5 text-blue-500" />
                              <span>View</span>
                            </button>

                            {/* Load Audit wizard report */}
                            <button
                              onClick={() => onLoadAudit(sub)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100/50 rounded-xl font-semibold transition shadow-xs cursor-pointer text-[10px] flex items-center gap-1.5 shrink-0"
                              title="Edit / view full report layout"
                            >
                              <ReportIcon className="w-3.5 h-3.5 text-amber-500" />
                              <span>Report</span>
                            </button>

                            {/* Delete submission */}
                            <button
                              onClick={() => handleDelete(sub.id, sub.profile.name)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 rounded-xl transition duration-150 cursor-pointer shrink-0"
                              title="Delete Submission Record"
                            >
                              <TrashIcon className="w-3.5 h-3.5 text-rose-500" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List View */}
            <div className="lg:hidden bg-white">
              {filteredSubmissions.map((sub: any) => {
                const submissionDate = new Date(sub.submittedAt);
                const formattedDate = submissionDate.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                const formattedTime = submissionDate.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });

                const scoreColor = sub.grs >= 85 ? 'text-emerald-700 bg-emerald-50 border-emerald-100/50' :
                                   sub.grs >= 70 ? 'text-teal-700 bg-teal-50 border-teal-100/50' :
                                   sub.grs >= 55 ? 'text-indigo-700 bg-indigo-50 border-indigo-100/50' :
                                   sub.grs >= 40 ? 'text-amber-700 bg-amber-50 border-amber-100/50' :
                                                   'text-rose-700 bg-rose-50 border-rose-100/50';

                return (
                  <div key={sub.id} className="p-4 sm:p-5 space-y-4 hover:bg-slate-50/20 transition duration-150 border-b border-slate-200 last:border-b-0">
                    
                    {/* Top Row: Contact Name & Score Badge */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100/30 shrink-0">
                          {getAvatarInitials(sub.profile.name)}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs text-slate-800 leading-snug flex items-center gap-1.5 flex-wrap">
                            {sub.profile.contactPerson}
                            {sub.grs >= 85 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[7.5px] bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold uppercase tracking-wider">
                                Leader
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-slate-450 font-normal leading-none break-all">{sub.profile.email}</p>
                          <p className="text-[9.5px] text-slate-400 font-semibold leading-none num-sans mt-0.5">{sub.profile.mobile}</p>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-xl text-[9px] font-bold border uppercase tracking-wider num-sans shrink-0 text-center ${scoreColor}`}>
                        {sub.grs}% {sub.band.split(' ')[0]}
                      </span>
                    </div>

                    {/* Middle section: Sector & Company */}
                    <div className="space-y-2 border-t border-slate-100 pt-3 text-[10.5px]">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-650 tracking-wider uppercase block leading-tight">
                          {sectorMapping[sub.profile.industry] || 'General Sector'}
                        </span>
                        <span className="text-slate-700 font-bold text-[11.5px] mt-0.5 block">
                          {sub.profile.name}
                        </span>
                        <a href={sub.profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all mt-0.5 block">
                          {sub.profile.website}
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-slate-500 font-medium bg-slate-50/50 p-2.5 rounded-xl border border-slate-150">
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider text-[7.5px]">Batch</span>
                          <span className="text-slate-700 font-semibold text-[10px]">{getIndustryCode(sub.profile.industry)} Ops</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider text-[7.5px]">Locations</span>
                          <span className="text-slate-700 font-semibold text-[10px] break-words">{sub.profile.locations}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider text-[7.5px]">Scale</span>
                          <span className="text-slate-700 font-semibold text-[10px]">{sub.profile.employees} staff</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 font-bold uppercase tracking-wider text-[7.5px]">Joined</span>
                          <span className="text-slate-700 font-semibold text-[10px]">{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-200/60 pb-1">
                      <button
                        onClick={() => setSelectedAudit(sub)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/50 rounded-xl font-semibold transition shadow-xs cursor-pointer text-[10px] flex items-center gap-1.5"
                        title="Inspect responses"
                      >
                        <EyeIcon className="w-3.5 h-3.5 text-blue-500" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => onLoadAudit(sub)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100/50 rounded-xl font-semibold transition shadow-xs cursor-pointer text-[10px] flex items-center gap-1.5"
                        title="Edit / view full report layout"
                      >
                        <ReportIcon className="w-3.5 h-3.5 text-amber-500" />
                        <span>Report</span>
                      </button>

                      <button
                        onClick={() => handleDelete(sub.id, sub.profile.name)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 rounded-xl transition duration-150 cursor-pointer"
                        title="Delete Submission"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* ── DETAILED RESPONSE INSPECTOR MODAL ───────────────────────── */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 text-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Audit Inspector: {selectedAudit.profile.name}</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Maturity Band: <span className="font-semibold text-slate-600">{selectedAudit.band}</span> (GRS Score: <span className="font-bold text-indigo-650 num-sans">{selectedAudit.grs}%</span>)</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Scrollable Content */}
            <div className="p-6 flex-grow overflow-y-auto space-y-6">
              
              {/* Profile Card Section */}
              <div className="p-4 sm:p-5 border border-slate-200 rounded-2xl bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-slate-600">
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Website</span>
                  <span className="font-semibold text-slate-700 break-all">{selectedAudit.profile.website}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Locations</span>
                  <span className="font-semibold text-slate-700 break-words">{selectedAudit.profile.locations}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Employees</span>
                  <span className="font-semibold text-slate-700">{selectedAudit.profile.employees} staff</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Contact Name</span>
                  <span className="font-semibold text-slate-700 break-words">{selectedAudit.profile.contactPerson}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Email</span>
                  <span className="font-semibold text-slate-700 break-all">{selectedAudit.profile.email}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Mobile</span>
                  <span className="font-semibold text-slate-700 num-sans">{selectedAudit.profile.mobile}</span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Question responses</h4>
                
                <div className="space-y-3">
                  {(() => {
                    const answersKeys = Object.keys(selectedAudit.answers);
                    
                    if (answersKeys.length === 0) {
                      return <p className="text-slate-400 text-center py-4">No question responses stored for this audit.</p>;
                    }

                    return answersKeys.map((code) => {
                      const ans = selectedAudit.answers[code];
                      const qDetail = (questionsData as any[]).find(q => q.code === code);
                      
                      const scoreDesc = ans.score === 'N/A' ? 'N/A — Not Applicable' :
                                        ans.score === 3 ? '3 — Institutionalised' :
                                        ans.score === 2 ? '2 — Established' :
                                        ans.score === 1 ? '1 — Emerging' : '0 — Absent';

                      const scoreBadgeColor = ans.score === 'N/A' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                              ans.score === 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                              ans.score === 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                              ans.score === 1 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-rose-50 text-rose-700 border-rose-200';

                      return (
                        <div key={code} className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <h5 className="font-semibold text-slate-800 leading-snug flex-1">
                              <span className="text-indigo-650 mr-1.5 num-sans">{code}.</span>
                              {qDetail ? qDetail.title : 'Diagnostic Indicator Scope'}
                            </h5>
                            <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-semibold text-center self-start sm:self-auto uppercase tracking-wide shrink-0 ${scoreBadgeColor}`}>
                              {scoreDesc}
                            </span>
                          </div>
                          {qDetail && (
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                              {qDetail.text}
                            </p>
                          )}
                          {ans.justification && (
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-150 text-[10px] leading-relaxed">
                              <strong className="text-slate-550 block uppercase tracking-wider text-[8px] mb-0.5">Auditor / User Remarks:</strong>
                              <span className="text-slate-600 font-semibold">{ans.justification}</span>
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setSelectedAudit(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition shadow-md cursor-pointer text-xs"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
