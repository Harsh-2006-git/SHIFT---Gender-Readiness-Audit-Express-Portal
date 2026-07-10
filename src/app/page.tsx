'use client';

import React, { useState, useEffect, useMemo } from 'react';
import questionsData from './questions.json';
import Header from '../components/Header';
import AboutView from '../components/AboutView';

interface Question {
  module_id: string;
  module_name: string;
  code: string;
  domain_code: string;
  domain_name: string;
  title: string;
  text: string;
}

interface Answer {
  score: number | 'N/A';
  justification: string;
}

type Step = 'profile' | 'audit' | 'report';

interface Profile {
  name: string;
  website: string;
  employees: string;
  locations: string;
  contactPerson: string;
  email: string;
  mobile: string;
  industry: 'A' | 'B' | 'C' | 'D';
}

const INDUSTRIES = [
  { id: 'A', name: 'Gig Economy & Dark Store Operations', code: 'GIG' },
  { id: 'B', name: 'Warehousing & Fulfilment', code: 'WHS' },
  { id: 'C', name: 'Small & Medium Enterprises', code: 'SME' },
  { id: 'D', name: 'Women in the EV Value Chain', code: 'EV' },
];

const DOMAINS = [
  { code: 'S', name: 'Strategy, Governance & Leadership' },
  { code: 'H', name: 'Hiring & Advancement' },
  { code: 'I', name: 'Infrastructure, Safety & Facility Design' },
  { code: 'F', name: 'Fair Work, Pay & Social Protection' },
  { code: 'T', name: 'Transformation, Culture & Ecosystem' },
  { code: 'V', name: 'Value Chain' }
];

const LEGAL_RED_FLAGS: Record<string, { code: string; type: string; desc: string }[]> = {
  A: [
    { code: 'G11', type: 'Night-Shift Safeguards', desc: 'Opt-in policies, safe zone allocations, and door-drop transportation are not secured.' },
    { code: 'G12', type: 'POSH Act Compliance', desc: 'ICC and POSH protections do not explicitly cover gig partners and dark store staff.' },
    { code: 'G13', type: 'Minimum Wage Floor', desc: 'Minimum effective hourly earnings are not guaranteed or tracked for logged-in time.' },
    { code: 'G14', type: 'Equal Pay / Pay Parity', desc: 'No pay parity audit or gap investigation conducted in the last 12 months.' }
  ],
  B: [
    { code: 'W11', type: 'Night-Shift Conditions', desc: 'State night-work permission or required transit and security parameters are missing.' },
    { code: 'W12', type: 'POSH Act Compliance', desc: 'ICC is not properly constituted, or annual filings and agency worker coverage are absent.' },
    { code: 'W13', type: 'Equal Pay / Pay Parity', desc: 'Equal remuneration for identical tasks is not verified annually across employment types.' },
    { code: 'W14', type: 'Wage Integrity', desc: 'Contract women workers’ wages are not paid directly into their own bank accounts.' },
    { code: 'W15', type: 'Maternity Benefit Act', desc: 'Maternity leave (26 weeks) or job security is not verified for fixed-term or contract staff.' },
    { code: 'W16', type: 'ESI/PF Social Security', desc: 'Social security (ESI, PF) pass-through is not verified for agency and contract workers.' }
  ],
  C: [
    { code: 'S3', type: 'POSH Act Compliance', desc: 'Internal Committee (ICC) is not formed or local redress routes are not communicated.' },
    { code: 'S12', type: 'POSH Act / Grievance Route', desc: 'No trusted grievance route or management commitment to act against abusers exists.' },
    { code: 'S13', type: 'Equal Pay / Pay Parity', desc: 'Different wage rates exist for men and women performing the same operation.' },
    { code: 'S14', type: 'Direct Wage Transfer', desc: 'Wages are paid in cash or to male relatives instead of the woman’s own bank account.' },
    { code: 'S16', type: 'ESI/PF Social Security', desc: 'Workers are not enrolled in ESI/PF, or helped onto e-Shram or state welfare schemes.' }
  ],
  D: [
    { code: 'E7', type: 'Safety Design Standards', desc: 'No street-visible lighting, CCTV, or safety designs implemented for swap or charge sites.' },
    { code: 'E8', type: 'POSH Act Compliance', desc: 'ICC coverage is not extended to field, swap station, dealership, and fleet networks.' },
    { code: 'E9', type: 'Equal Pay / Pay Parity', desc: 'Equal pay audits and results are not verified and disclosed internally.' },
    { code: 'E10', type: 'Maternity Benefit Act', desc: 'No risk-modified roles around chemical/battery areas, or return programs are missing.' }
  ]
};

const OPTION_DESCRIPTIONS: { val: number | 'N/A'; title: string; desc: string }[] = [
  { val: 0, title: '0 — Absent', desc: 'Nothing exists, or nobody can say. No policy, no practice, no data.' },
  { val: 1, title: '1 — Emerging', desc: 'Intent or informal practice exists but is undocumented, unfunded, or dependent on individuals.' },
  { val: 2, title: '2 — Established', desc: 'A documented, funded, working practice exists and can be evidenced — but coverage or consistency is incomplete.' },
  { val: 3, title: '3 — Institutionalised', desc: 'Embedded in systems, budgets and accountability; measured, reviewed, and holding up across sites, shifts and worker categories.' },
  { val: 'N/A', title: 'N/A — Not Applicable', desc: 'This diagnostic question is genuinely not applicable to this operation (requires remarks).' }
];


// SVG Icon Helpers
const PhoneCallIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const SlidersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function Portal() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('profile');
  const [activeTab, setActiveTab] = useState<'portal' | 'about'>('portal');
  
  const [profile, setProfile] = useState<Profile>({
    name: '',
    website: '',
    employees: '',
    locations: '',
    contactPerson: '',
    email: '',
    mobile: '',
    industry: 'A',
  });

  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [showMobileDrawer, setShowMobileDrawer] = useState<boolean>(false);
  const [showAuditRequestModal, setShowAuditRequestModal] = useState<boolean>(false);

  const [customModal, setCustomModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    type: 'confirm' | 'alert';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'alert',
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void, confirmLabel = 'Confirm', cancelLabel = 'Cancel') => {
    setCustomModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      onConfirm: () => {
        onConfirm();
        setCustomModal(prev => ({ ...prev, isOpen: false }));
      },
      type: 'confirm'
    });
  };

  const triggerAlert = (title: string, message: string, onConfirm?: () => void) => {
    setCustomModal({
      isOpen: true,
      title,
      message,
      confirmLabel: 'OK',
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setCustomModal(prev => ({ ...prev, isOpen: false }));
      },
      type: 'alert'
    });
  };


  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedProfile = localStorage.getItem('shift_profile');
    const savedAnswers = localStorage.getItem('shift_answers');
    const savedStep = localStorage.getItem('shift_step');
    const savedIndex = localStorage.getItem('shift_q_index');

    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); } catch (e) {}
    }
    if (savedAnswers) {
      try { setAnswers(JSON.parse(savedAnswers)); } catch (e) {}
    }
    if (savedStep) {
      setStep(savedStep as Step);
    }
    if (savedIndex) {
      setActiveQuestionIndex(parseInt(savedIndex, 10) || 0);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('shift_profile', JSON.stringify(profile));
    localStorage.setItem('shift_step', step);
    localStorage.setItem('shift_q_index', activeQuestionIndex.toString());
  }, [profile, step, activeQuestionIndex, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('shift_answers', JSON.stringify(answers));
  }, [answers, mounted]);

  // Filter questions for the selected module
  const currentQuestions = useMemo(() => {
    const data = questionsData as Question[];
    return data.filter((q) => q.module_id === profile.industry);
  }, [profile.industry]);

  // Get active domains inside the current question set
  const availableDomains = useMemo(() => {
    const codes = new Set(currentQuestions.map(q => q.domain_code));
    return DOMAINS.filter(d => codes.has(d.code));
  }, [currentQuestions]);

  // Active question details
  const activeQuestion = currentQuestions[activeQuestionIndex] || null;

  // Track progress
  const answeredCount = useMemo(() => {
    return currentQuestions.filter(q => {
      const ans = answers[q.code];
      if (!ans) return false;
      if (ans.score === 'N/A') return ans.justification.trim().length > 0;
      return ans.score >= 0 && ans.score <= 3;
    }).length;
  }, [currentQuestions, answers]);

  const isAuditComplete = answeredCount === currentQuestions.length;

  // Domain progress bar mapping
  const domainProgress = useMemo(() => {
    return availableDomains.map((dom) => {
      const qs = currentQuestions.filter(q => q.domain_code === dom.code);
      const answered = qs.filter(q => {
        const ans = answers[q.code];
        if (!ans) return false;
        if (ans.score === 'N/A') return ans.justification.trim().length > 0;
        return true;
      }).length;
      
      return {
        code: dom.code,
        name: dom.name,
        total: qs.length,
        answered,
        isCompleted: answered === qs.length,
        isActive: activeQuestion?.domain_code === dom.code
      };
    });
  }, [currentQuestions, answers, activeQuestion, availableDomains]);

  // Validate profile form
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!profile.name.trim()) newErrors.name = 'Organisation name is required';
    if (!profile.website.trim()) newErrors.website = 'Website is required';
    if (!profile.employees.trim()) newErrors.employees = 'Number of employees is required';
    if (!profile.locations.trim()) newErrors.locations = 'Locations are required';
    if (!profile.contactPerson.trim()) newErrors.contactPerson = 'Contact person name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(profile.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!profile.mobile.trim()) newErrors.mobile = 'Mobile number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      // Clear answers if industry changed (different set of questions)
      const lastIndustry = localStorage.getItem('shift_last_industry');
      if (lastIndustry && lastIndustry !== profile.industry) {
        setAnswers({});
        setActiveQuestionIndex(0);
      }
      localStorage.setItem('shift_last_industry', profile.industry);
      setStep('audit');
    }
  };

  const handleScoreChange = (qCode: string, score: number | 'N/A') => {
    setAnswers((prev) => ({
      ...prev,
      [qCode]: {
        score,
        justification: prev[qCode]?.justification || '',
      },
    }));
  };

  const handleJustificationChange = (qCode: string, justification: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qCode]: {
        score: prev[qCode]?.score ?? 'N/A',
        justification,
      },
    }));
  };

  // Compute final GRS and band
  const GRS = useMemo(() => {
    let sum = 0;
    let applicableCount = 0;
    currentQuestions.forEach((q) => {
      const ans = answers[q.code];
      if (ans && ans.score !== 'N/A') {
        sum += ans.score;
        applicableCount++;
      }
    });
    if (applicableCount === 0) return 0;
    return Math.round((sum / (3 * applicableCount)) * 100);
  }, [currentQuestions, answers]);

  const bandInfo = useMemo(() => {
    if (GRS >= 85) return { band: 'SHIFT Leader', color: 'text-emerald-500 border-emerald-500 bg-emerald-50', badgeColor: 'bg-emerald-500/10 text-emerald-500', desc: 'Strong candidate for full audit and certification; likely already ahead of sector peers.' };
    if (GRS >= 70) return { band: 'Advanced', color: 'text-teal-500 border-teal-500 bg-teal-50', badgeColor: 'bg-teal-500/10 text-teal-500', desc: 'Sound foundations; full audit will surface targeted, high-return refinements.' };
    if (GRS >= 55) return { band: 'Committed', color: 'text-indigo-600 border-indigo-600 bg-indigo-50', badgeColor: 'bg-indigo-600/10 text-indigo-600', desc: 'Real commitment with visible gaps; a structured action plan will move the score materially.' };
    if (GRS >= 40) return { band: 'Aware', color: 'text-amber-500 border-amber-500 bg-amber-50', badgeColor: 'bg-amber-500/10 text-amber-500', desc: 'Intent exceeds systems; foundational work needed on infrastructure, policy coverage and data.' };
    return { band: 'Gender-Blind', color: 'text-rose-500 border-rose-500 bg-rose-50', badgeColor: 'bg-rose-500/10 text-rose-500', desc: 'The organisation cannot currently see or manage its gender reality; begin with the basics.' };
  }, [GRS]);

  // Compute domain average scores
  const domainAverages = useMemo(() => {
    const results: Record<string, { sum: number; count: number; average: number }> = {};
    currentQuestions.forEach((q) => {
      const ans = answers[q.code];
      if (ans && ans.score !== 'N/A') {
        if (!results[q.domain_code]) {
          results[q.domain_code] = { sum: 0, count: 0, average: 0 };
        }
        results[q.domain_code].sum += ans.score;
        results[q.domain_code].count++;
      }
    });

    Object.keys(results).forEach((key) => {
      const d = results[key];
      d.average = d.count > 0 ? Math.round((d.sum / (3 * d.count)) * 100) : 0;
    });

    return results;
  }, [currentQuestions, answers]);

  // Red-Flags (Questions scored 0 that map to legal exposure)
  const triggeredRedFlags = useMemo(() => {
    const segmentFlags = LEGAL_RED_FLAGS[profile.industry] || [];
    return segmentFlags.filter((flag) => {
      const ans = answers[flag.code];
      return ans && ans.score === 0;
    });
  }, [profile.industry, answers]);

  // Data Visibility Gaps (Questions scored 0)
  const dataVisibilityGaps = useMemo(() => {
    return currentQuestions.filter((q) => {
      const ans = answers[q.code];
      return ans && ans.score === 0;
    });
  }, [currentQuestions, answers]);

  // Reset Audit
  const handleReset = () => {
    triggerConfirm(
      'Reset Assessment',
      'Are you sure you want to reset all answers and company profile details? This cannot be undone.',
      () => {
        setAnswers({});
        setProfile({
          name: '',
          website: '',
          employees: '',
          locations: '',
          contactPerson: '',
          email: '',
          mobile: '',
          industry: 'A',
        });
        setStep('profile');
        setActiveQuestionIndex(0);
        localStorage.removeItem('shift_profile');
        localStorage.removeItem('shift_answers');
        localStorage.removeItem('shift_step');
        localStorage.removeItem('shift_q_index');
      },
      'Reset All',
      'Keep Assessment'
    );
  };

  const selectedIndustryName = INDUSTRIES.find(ind => ind.id === profile.industry)?.name || '';

  // Options Renderer helper
  const renderedOptions = useMemo(() => {
    if (!activeQuestion) return [];
    const ans = answers[activeQuestion.code];
    const score = ans ? ans.score : null;

    return OPTION_DESCRIPTIONS.map((opt) => {
      const isSelected = score === opt.val;
      return (
        <button
          key={opt.val}
          type="button"
          onClick={() => handleScoreChange(activeQuestion.code, opt.val)}
          className={`w-full px-4 py-3 sm:px-5 sm:py-3.5 text-left rounded-xl sm:rounded-2xl border-2 transition duration-200 cursor-pointer flex items-center space-x-3.5 ${
            isSelected
              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
            isSelected ? 'border-indigo-500 bg-white' : 'border-slate-300 bg-white'
          }`}>
            {isSelected && <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-500 rounded-full" />}
          </span>
          <div className="flex-1">
            <span className="block text-xs sm:text-sm font-extrabold text-slate-800 leading-tight">
              {opt.title}
            </span>
            <span className="block text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium leading-normal">
              {opt.desc}
            </span>
          </div>
        </button>
      );
    });
  }, [activeQuestion, answers]);

  if (!mounted) return null;

  // Sub-component: Sidebar Content (reused in desktop and mobile drawer)
  const renderSidebarContent = () => {
    const totalCount = currentQuestions.length;
    const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
    
    return (
      <div className="space-y-4 flex flex-col h-full justify-between text-xs">
        <div className="space-y-4">
          
          {/* OUTCOME Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex-1 min-w-0">
              <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Outcome</p>
              <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wide border ${
                GRS >= 55 ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : GRS >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {bandInfo.band}
              </span>
            </div>
            
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="#E2E8F0" strokeWidth="5" fill="transparent" />
                <circle
                  cx="28" cy="28" r="22"
                  stroke={GRS >= 70 ? '#10B981' : GRS >= 55 ? '#4F46E5' : GRS >= 40 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray="138.2"
                  strokeDashoffset={138.2 - (138.2 * GRS) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-[11px] font-black text-slate-800 num-sans">{GRS}%</span>
            </div>
          </div>

          {/* Navigator (1-20) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 shadow-xs">
            <h5 className="font-extrabold text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider">
              Navigator (<span className="num-sans">1</span>–<span className="num-sans">{totalCount}</span>)
            </h5>
            <div className="grid grid-cols-7 gap-1">
              {currentQuestions.map((q, idx) => {
                const ans = answers[q.code];
                const isAnswered = ans && (
                  ans.score !== 'N/A' || ans.justification.trim().length > 0
                );
                const isActive = idx === activeQuestionIndex;
                
                return (
                  <button
                    key={q.code}
                    type="button"
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      setShowMobileDrawer(false);
                    }}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-[9px] sm:text-[10px] transition cursor-pointer select-none ${
                      isActive 
                        ? 'bg-[#4f46e5] text-white shadow-sm ring-2 ring-[#4f46e5]/20 border border-[#4f46e5]'
                        : isAnswered 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                    title={`Q${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks / N/A Justification */}
          {activeQuestion && (
            <div>
              <label className="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {answers[activeQuestion.code]?.score === 'N/A' 
                  ? 'Remarks (Justification Required *)' 
                  : 'Remarks (Optional)'}
              </label>
              <textarea
                rows={3}
                value={answers[activeQuestion.code]?.justification || ''}
                onChange={(e) => handleJustificationChange(activeQuestion.code, e.target.value)}
                placeholder={
                  answers[activeQuestion.code]?.score === 'N/A'
                    ? 'Enter N/A justification statement here...'
                    : 'Enter notes or comments...'
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] sm:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition resize-none shadow-xs"
              />
            </div>
          )}

        </div>

        {/* Footer actions inside the sidebar */}
        <div className="pt-4 border-t border-slate-200/60 flex flex-col space-y-2 shrink-0 bg-white">
          <button
            type="button"
            onClick={() => {
              if (isAuditComplete) {
                fetch('/api/audit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    profile,
                    answers,
                    grs: GRS,
                    band: bandInfo.band
                  })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    setStep('report');
                    setShowMobileDrawer(false);
                  } else {
                    triggerAlert('Error', 'Failed to save audit responses to the database.');
                  }
                })
                .catch(err => {
                  triggerAlert('Error', 'Network error. Failed to save audit responses.');
                });
              } else {
                triggerAlert('Audit Incomplete', 'Please complete all 20 diagnostic questions before generating the snapshot report.');
              }
            }}
            disabled={!isAuditComplete}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-bold rounded-xl transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <CheckIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Save & Complete</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              triggerConfirm(
                'Exit Assessment',
                'Exit assessment? Current progress is auto-saved.',
                () => {
                  setStep('profile');
                  setShowMobileDrawer(false);
                },
                'Exit',
                'Cancel'
              );
            }}
            className="w-full py-2 border border-slate-200 bg-white text-[11px] sm:text-xs font-bold hover:bg-slate-50 text-slate-700 rounded-xl transition cursor-pointer text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 selection:bg-brand-indigo/10 selection:text-brand-indigo">
      
      {/* HEADER BAR (Hidden in print) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        step={step}
        handleReset={handleReset}
        onRequestAudit={() => setShowAuditRequestModal(true)}
        onLogoClick={() => {
          setActiveTab('portal');
          setStep('profile');
        }}
      />

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-grow flex flex-col py-6 px-3 sm:px-6 md:px-8 max-w-6xl w-full mx-auto justify-center items-center">
        
        {/* Render About Page if selected */}
        {activeTab === 'about' && <AboutView />}


        {/* Render Audit Steps if portal selected */}
        {activeTab === 'portal' && (
          <>
        
        {/* STEP 1: Profile Form */}
        {step === 'profile' && (
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-300/10 border-2 border-slate-300/90 transition-all duration-500 overflow-hidden flex flex-col md:flex-row animate-fadeIn h-[calc(100vh-105px)] md:h-auto max-h-[660px] md:max-h-none">
            
            {/* Left Column: Program Intro Banner */}
            <div className="md:w-[42%] bg-gradient-to-br from-[#EFF6FF] via-[#EEF2FF] to-[#E0E7FF] p-4 md:p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-slate-300/60 shrink-0">
              
              <div className="relative z-10 space-y-3.5 md:space-y-8 my-auto">
                {/* Branding Badge / Icon */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/15 text-[11px] font-bold text-[#2563EB]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  SHIFT DIAGNOSTIC
                </div>

                {/* Main Hero Header */}
                <div className="space-y-2 md:space-y-3.5">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Empowering Teams.<br className="hidden md:inline" />
                    Driving Operational Excellence.
                  </h3>
                  <p className="hidden md:block text-slate-600 text-xs sm:text-[13px] leading-relaxed font-medium">
                    Assess, benchmark, and scale gender-smart policies, physical facilities, and safety safeguards across all employee categories and subcontractor systems.
                  </p>
                </div>

                {/* Key Benefits List (Hidden on mobile) */}
                <div className="hidden md:block space-y-4">
                  
                  {/* Item 1 */}
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight">20 Program Scopes</h4>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Rapid screening targeted on Strategy, Hiring, Infrastructure, and Fair Pay.</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Regulatory Red-Flags</h4>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Instantly maps gaps across Indian POSH, Wage, and Maternity rules.</p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Action Roadmap</h4>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Download a detailed Interpretative Snapshot Report immediately on completion.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* LLP Copyright footer (Hidden on mobile) */}
              <div className="relative z-10 text-[10px] text-slate-400 font-medium pt-8 mt-auto md:pt-0 hidden md:block">
                Powered by SHIFT Framework • Even Innovation LLP
              </div>
            </div>

            {/* Right Column: Profile Setup Form */}
            <div className="md:w-[58%] p-4 md:p-8 sm:p-10 flex flex-col justify-between flex-grow overflow-hidden">
              
              {/* Form Heading */}
              <div className="mb-3.5 md:mb-6 shrink-0">
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full bg-brand-indigo/10 text-brand-indigo">
                  Step 1 of 3
                </span>
                <h2 className="text-lg sm:text-2xl font-bold mt-1 text-slate-800 tracking-tight">
                  Establish Corporate Profile
                </h2>
                <p className="text-slate-550 mt-1 text-[11.5px] sm:text-[13px] font-medium leading-relaxed">
                  Define your organizational context to tailor the diagnostic questions.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="flex-grow flex flex-col justify-between overflow-hidden space-y-4">
                {/* Scrollable Fields Wrapper on Mobile View (Adaptive Height) */}
                <div className="overflow-y-auto pr-1 md:overflow-visible flex-grow">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                    
                    {/* Org Name */}
                    <div className="flex flex-col">
                      <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Organisation Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. Acme Logistics Ltd"
                      />
                      {errors.name && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.name}</span>}
                    </div>

                    {/* Website */}
                    <div className="flex flex-col">
                      <label htmlFor="website" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Website URL
                      </label>
                      <input
                        type="text"
                        id="website"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. www.acmelogistics.com"
                      />
                      {errors.website && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.website}</span>}
                    </div>

                    {/* Employees */}
                    <div className="flex flex-col">
                      <label htmlFor="employees" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        No. of Employees
                      </label>
                      <input
                        type="number"
                        id="employees"
                        min="1"
                        value={profile.employees}
                        onChange={(e) => setProfile({ ...profile, employees: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. 250"
                      />
                      {errors.employees && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.employees}</span>}
                    </div>

                    {/* Locations */}
                    <div className="flex flex-col">
                      <label htmlFor="locations" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Operating Locations
                      </label>
                      <input
                        type="text"
                        id="locations"
                        value={profile.locations}
                        onChange={(e) => setProfile({ ...profile, locations: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. Delhi NCR, Pune, Bengaluru"
                      />
                      {errors.locations && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.locations}</span>}
                    </div>

                    {/* Contact Person */}
                    <div className="flex flex-col">
                      <label htmlFor="contactPerson" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        value={profile.contactPerson}
                        onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. Priya Sharma"
                      />
                      {errors.contactPerson && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.contactPerson}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. contact@acme.com"
                      />
                      {errors.email && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.email}</span>}
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col">
                      <label htmlFor="mobile" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Mobile No.
                      </label>
                      <input
                        type="text"
                        id="mobile"
                        value={profile.mobile}
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:bg-white focus:border-transparent transition-all text-xs font-semibold"
                        placeholder="e.g. +91 98765 43210"
                      />
                      {errors.mobile && <span className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.mobile}</span>}
                    </div>

                    {/* Industry Dropdown */}
                    <div className="flex flex-col">
                      <label htmlFor="industry" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Industry Segment Sector
                      </label>
                      <select
                        id="industry"
                        value={profile.industry}
                        onChange={(e) => setProfile({ ...profile, industry: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-all cursor-pointer font-semibold text-xs"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind.id} value={ind.id}>
                            {ind.name}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex justify-stretch sm:justify-end shrink-0">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-blue-700 rounded-xl text-white font-bold text-xs tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Configure & Start Audit →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 2: Dedicated Assessment Window (Matches temporary file UI template) */}
        {step === 'audit' && activeQuestion && (() => {
          const domainsList = availableDomains.map(d => d.code);
          const domainNumberMap = availableDomains.reduce<Record<string, number>>((acc, d, index) => {
            acc[d.code] = index + 1;
            return acc;
          }, {});
          const currentDomainNum = domainNumberMap[activeQuestion.domain_code] || 1;
          const totalCount = currentQuestions.length;
          const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

          return (
            <div className="w-full bg-white border border-slate-200 rounded-3xl h-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden text-xs animate-fadeIn relative">
              
              {/* Modal Header */}
              <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-10 gap-3">
                
                {/* Left: Title */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-xs sm:text-sm flex items-center truncate">
                    <PhoneCallIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 mr-1.5 sm:mr-2 shrink-0" />
                    <span className="truncate">Live Assessment: {profile.name}</span>
                  </h3>
                  <p className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5">Complete 20 questions on a live call.</p>
                </div>

                {/* Center: Compact Progress Panel */}
                <div className="hidden sm:flex flex-1 max-w-[120px] sm:max-w-sm bg-slate-50 border border-slate-200 rounded-lg p-1.5 sm:p-2 flex-col justify-center space-y-1 sm:space-y-1.5 shadow-sm shrink-0">
                  <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                      <span className="text-indigo-700 bg-indigo-100 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[7px] sm:text-[8px] uppercase tracking-wider num-sans">Sec {currentDomainNum}/{domainsList.length}</span>
                      <span className="hidden xs:inline num-sans">{progressPercent}% ({answeredCount}/{totalCount})</span>
                    </span>
                    <span className="uppercase tracking-wider hidden sm:inline">Domains</span>
                  </div>
                  <div className="flex items-center gap-0.5 w-full">
                    {domainsList.map((domainKey) => {
                      const isCompleted = domainProgress.find(d => d.code === domainKey)?.isCompleted;
                      const isActive = activeQuestion.domain_code === domainKey;
                      return (
                        <div
                          key={domainKey}
                          className={`h-0.5 sm:h-1 flex-1 rounded-full transition-all duration-300 ${isActive ? 'bg-indigo-600' : isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}
                          title={`Domain ${domainKey}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Right: Toggle sidebar on mobile & Close button */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowMobileDrawer(prev => !prev)}
                    className="lg:hidden p-1.5 sm:p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition cursor-pointer flex items-center gap-1 text-[10px] sm:text-xs font-bold"
                    title="Toggle Summary Sidebar"
                  >
                    <SlidersIcon className="w-4 h-4" />
                    <span className="hidden xs:inline">Summary</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerConfirm(
                        'Exit Assessment',
                        'Exit assessment? Progress is auto-saved.',
                        () => setStep('profile'),
                        'Exit',
                        'Cancel'
                      );
                    }}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
                  >
                    <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Two-Column Form */}
              <div
                className="p-3 sm:p-5 flex-grow min-h-0 relative overflow-hidden flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-5 bg-white"
              >
                {/* Backdrop overlay for mobile drawer */}
                {showMobileDrawer && (
                  <div
                    onClick={() => setShowMobileDrawer(false)}
                    className="lg:hidden absolute inset-0 bg-slate-900/30 backdrop-blur-xs z-35 transition-opacity duration-300"
                  />
                )}

                {/* Left Column: Quiz Question Container */}
                <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col h-full min-h-0 overflow-hidden">
                  
                  {/* Scrollable Question Area */}
                  <div
                    id="interview-question-scroll-container"
                    className="p-4 sm:p-6 flex-grow overflow-y-auto flex flex-col space-y-4 sm:space-y-5"
                  >
                    {/* Domain Badge */}
                    <div>
                      <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 bg-indigo-50 border border-indigo-105 rounded-full text-[9px] sm:text-[10px] font-bold text-indigo-700">
                        Section {activeQuestion.domain_code}: {activeQuestion.domain_name}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm md:text-base leading-snug">
                      <span className="text-indigo-650 mr-1.5 num-sans">{activeQuestion.code}.</span>
                      {activeQuestion.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed mt-1">
                      {activeQuestion.text}
                    </p>

                    {/* Question score selections */}
                    <div className="space-y-2 pt-2">
                      {renderedOptions}
                    </div>
                  </div>

                  {/* Sticky Navigation Footer (Left) */}
                  <div className="bg-white border-t border-slate-200 px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between shrink-0">
                    <button
                      type="button"
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                      className="px-4 py-2 sm:px-5 sm:py-2.5 border border-slate-200 bg-white rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs text-[11px] sm:text-xs"
                    >
                      ← Back
                    </button>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold num-sans">
                      Q{activeQuestionIndex + 1} of {totalCount}
                    </span>
                    {activeQuestionIndex < totalCount - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const ans = answers[activeQuestion.code];
                          if (ans && ans.score === 'N/A' && !ans.justification.trim()) {
                            triggerAlert('Justification Required', 'Remarks justification is required for N/A questions.');
                            return;
                          }
                          setActiveQuestionIndex(prev => prev + 1);
                        }}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 text-[11px] sm:text-xs"
                      >
                        Next →
                      </button>
                    ) : (
                      <>
                        {/* Desktop Only Banner */}
                        <div className="hidden lg:block text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl animate-pulse">
                          ✓ Complete on right
                        </div>
                        {/* Mobile Only Submit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const ans = answers[activeQuestion.code];
                            if (ans && ans.score === 'N/A' && !ans.justification.trim()) {
                              triggerAlert('Justification Required', 'Remarks justification is required for N/A questions.');
                              return;
                            }
                            
                            if (isAuditComplete) {
                              fetch('/api/audit', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  profile,
                                  answers,
                                  grs: GRS,
                                  band: bandInfo.band
                                })
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  setStep('report');
                                  setShowMobileDrawer(false);
                                } else {
                                  triggerAlert('Error', 'Failed to save audit responses to the database.');
                                }
                              })
                              .catch(err => {
                                triggerAlert('Error', 'Network error. Failed to save audit responses.');
                              });
                            } else {
                              triggerAlert('Audit Incomplete', 'Please complete all 20 diagnostic questions before generating the snapshot report.');
                            }
                          }}
                          className="lg:hidden px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 text-[11px] sm:text-xs"
                        >
                          <CheckIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>Submit Audit</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column: Summary & Remarks Panel (Drawer on mobile, inline on desktop) */}
                <div className={`
                  bg-slate-50 border-l border-slate-200 rounded-l-2xl lg:border lg:rounded-3xl flex flex-col justify-between overflow-hidden shadow-2xl lg:shadow-xs shrink-0
                  lg:min-h-0 lg:overflow-hidden lg:col-span-1 lg:static lg:translate-x-0 lg:w-auto lg:h-full lg:z-auto
                  absolute right-0 top-0 bottom-0 z-40 w-[280px] sm:w-[320px] max-w-[85vw] h-full
                  transition-transform duration-300 ease-in-out
                  ${showMobileDrawer ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                `}>
                  
                  {/* Mobile Drawer Header */}
                  <div className="lg:hidden p-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                    <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Assessment Summary</h4>
                    <button
                      type="button"
                      onClick={() => setShowMobileDrawer(false)}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition cursor-pointer"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sidebar Inner Content */}
                  <div className="p-3 sm:p-4 flex-grow flex flex-col overflow-y-auto lg:overflow-visible">
                    {renderSidebarContent()}
                  </div>

                </div>

              </div>

            </div>
          );
        })()}

        {/* STEP 3: Report Dashboard */}
        {step === 'report' && (
          <div className="w-full space-y-8 animate-fadeIn">
            
            {/* Action Bar (Hidden in Print) */}
            <div className="no-print flex flex-row justify-between items-center bg-white rounded-2xl p-3 sm:p-4 sm:px-6 border border-slate-200 shadow-sm gap-2 sm:gap-4">
              <button
                onClick={() => setStep('audit')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Edit Answers</span>
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-3 sm:px-6 py-2 sm:py-2.5 bg-brand-indigo hover:bg-brand-primary text-white font-bold text-[11px] sm:text-xs tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                <span>Print Snapshot Report</span>
              </button>
            </div>

            {/* Corporate Header Section */}
            <div className="print-card bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden bg-gradient-to-br from-white to-slate-50/20">
              <div className="space-y-4">
                <span className="px-3 py-1 text-[9.5px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-block w-fit">
                  Express Diagnostic Verified
                </span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                    {profile.name}
                  </h2>
                  <p className="text-slate-500 font-semibold text-xs mt-1">
                    {selectedIndustryName} Sector Module • Code: <span className="num-sans">SGRA-X-05</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs border-t border-slate-150 pt-4">
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Website</span>
                    <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-indigo hover:underline break-all block max-w-full">{profile.website}</a>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Locations</span>
                    <span className="font-semibold text-slate-700 block break-words">{profile.locations}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Staff Headcount</span>
                    <span className="font-semibold text-slate-700 block"><span className="num-sans">{profile.employees}</span> employees</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Contact Partner</span>
                    <span className="font-semibold text-slate-700 block break-words">{profile.contactPerson}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Email</span>
                    <span className="font-semibold text-slate-700 break-all block max-w-full">{profile.email}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold uppercase tracking-wider text-[8px] mb-0.5">Phone Contact</span>
                    <span className="font-semibold text-slate-700 num-sans block">{profile.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Headline GRS Circle Score */}
              <div className="flex flex-col items-center text-center self-center shrink-0">
                <div className="relative flex justify-center items-center">
                  <svg className="w-32 h-32">
                    <circle cx="64" cy="64" r="54" className="stroke-slate-100 fill-none" strokeWidth="8" />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className={`stroke-current fill-none transition-all duration-1000 ${
                        bandInfo.band === 'SHIFT Leader' ? 'text-emerald-500' :
                        bandInfo.band === 'Advanced' ? 'text-teal-400' :
                        bandInfo.band === 'Committed' ? 'text-indigo-600' :
                        bandInfo.band === 'Aware' ? 'text-amber-500' : 'text-rose-500'
                      }`}
                      strokeWidth="8"
                      strokeDasharray={339}
                      strokeDashoffset={339 - (339 * GRS) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800 leading-none num-sans">
                      {GRS}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">GRS Score</span>
                  </div>
                </div>
                
                {/* Readiness Band Label */}
                <div className={`mt-3 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wide uppercase ${bandInfo.color}`}>
                  {bandInfo.band}
                </div>
              </div>
            </div>

            {/* Grid 2 Column: Band Description + Domain Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Band Reading */}
              <div className="print-card md:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Readiness Interpretation</span>
                  <h4 className="text-base font-bold text-slate-800">
                    Maturity Band Assessment
                  </h4>
                  <p className="text-slate-600 text-xs mt-3 leading-relaxed font-medium">
                    {bandInfo.desc}
                  </p>
                </div>
                <p className="text-slate-450 text-[10.5px] mt-4 leading-relaxed italic border-t border-slate-100 pt-3 font-medium">
                  Note: The Express score is a screening result based on self-reported answers with light evidence checking. It typically reads <span className="num-sans">3</span> to <span className="num-sans">8</span> points higher than a full evidence-verified onsite audit.
                </p>
              </div>

              {/* Domain Heatmap */}
              <div className="print-card md:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Domain Breakdown</span>
                <h4 className="text-base font-bold text-slate-800 mb-5">
                  Domain Heat Map
                </h4>
                <div className="space-y-3.5">
                  {availableDomains.map((dom) => {
                    const rating = domainAverages[dom.code];
                    const avg = rating ? rating.average : 0;
                    return (
                      <div key={dom.code} className="space-y-1">
                        <div className="flex justify-between items-start gap-2 text-[10.5px] font-semibold">
                          <span className="text-slate-700 break-words flex-grow pr-2">
                            {dom.code} • {dom.name}
                          </span>
                          <span className="text-indigo-650 num-sans font-bold shrink-0">{avg}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                          <div 
                            className={`h-full transition-all duration-1000 rounded-full ${
                              avg >= 85 ? 'bg-emerald-500' :
                              avg >= 70 ? 'bg-teal-400' :
                              avg >= 55 ? 'bg-indigo-600' :
                              avg >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Red-Flag Register (Legal Compliance Exposures) */}
            <div className="print-card bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-rose-500 uppercase tracking-widest block">Legal Red Flags</span>
                  <h4 className="text-base font-bold text-slate-800">
                    Red-Flag Register
                  </h4>
                </div>
              </div>

              {triggeredRedFlags.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-500/[0.03] text-rose-700 text-xs font-semibold leading-relaxed border border-rose-100">
                    ⚠️ The following compliance and legal exposures are triggered because they scored <strong>0 (Absent)</strong> in the diagnostic. These present severe regulatory risks under Indian labor regulations (including POSH, Code on Wages, and Maternity Benefit Acts) and must be addressed with priority.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {triggeredRedFlags.map((flag) => {
                      const originalQ = currentQuestions.find(q => q.code === flag.code);
                      return (
                        <div key={flag.code} className="p-5 rounded-xl border border-rose-100 bg-rose-50/[0.01] flex flex-col justify-between hover:shadow-xs transition duration-150">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 text-[9px] font-bold uppercase tracking-wide">
                                {flag.code} • {flag.type}
                              </span>
                            </div>
                            <h5 className="font-semibold text-[13px] text-slate-800 leading-snug">
                              {originalQ?.title}
                            </h5>
                            <p className="text-[11.5px] text-slate-500 mt-2 leading-relaxed font-medium">
                              {flag.desc}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-rose-600 font-bold uppercase tracking-wider">
                            Action Code: Red-Flag Alert
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-emerald-100 bg-emerald-50/[0.01] text-center">
                  <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h5 className="font-bold text-sm text-slate-800">
                    No Legal Red Flags Detected
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                    Excellent. The basic legal compliance indicators (such as POSH structures, statutory wage policies, social security pass-throughs, and safety conditions) are at least partially emerging or established.
                  </p>
                </div>
              )}
            </div>

            {/* Data Visibility Gap Analysis */}
            <div className="print-card bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Data Integrity Review</span>
              <h4 className="text-base font-bold text-slate-800 mb-1">
                Data Visibility Gap Note
              </h4>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed font-medium">
                A score of <strong>0</strong> indicates absence of tracked records or policies. The data visibility gaps represent structural blindspots where the organization has no metrics or formal monitoring channels.
              </p>

              {dataVisibilityGaps.length > 0 ? (
                <div className="space-y-3.5">
                  <span className="text-xs font-bold text-slate-700">
                    Blindspots Identified (<span className="num-sans">{dataVisibilityGaps.length}</span> Items):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dataVisibilityGaps.map((q) => (
                      <div key={q.code} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs hover:border-slate-300 transition duration-150">
                        <div className="flex items-center mb-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[8.5px] font-bold text-slate-600 mr-2 num-sans">
                            {q.code}
                          </span>
                          <strong className="text-slate-800 text-[12px] font-semibold">{q.title}</strong>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium line-clamp-3">{q.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center text-xs font-semibold text-emerald-700">
                  Outstanding. Zero high-visibility data gaps detected. Information on all diagnostic scopes is documented or tracked.
                </div>
              )}
            </div>

            {/* Top 5 Recommended Moves (Segment Specific) */}
            <div className="print-card bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs">
              <span className="text-[9.5px] font-bold text-brand-indigo uppercase tracking-widest block mb-1.5">Audit-to-Impact Pathway</span>
              <h4 className="text-base font-bold text-slate-800 mb-5">
                Recommended Top 5 Moves
              </h4>
              
              <div className="space-y-3.5">
                {(() => {
                  const moves: Record<string, { tag: 'Quick Win' | 'Structural' | 'Strategic'; text: string; details: string }[]> = {
                    A: [
                      { tag: 'Quick Win', text: 'Implement safe night-zone allocations and drop-home verification algorithms.', details: 'Mitigates commute safety exposure for late-shift delivery gig riders (G11).' },
                      { tag: 'Quick Win', text: 'Constitute the Internal Committee (ICC) and formally extend POSH coverage to gig partners.', details: 'Enforces harassment recourse avenues explicitly for non-employees and gig partners (G12).' },
                      { tag: 'Structural', text: 'Formulate vehicle-leasing or phone-subsidizing plans during onboarding.', details: 'Lowers high capital entry barriers that disproportionately block female applicants (G5).' },
                      { tag: 'Structural', text: 'Introduce a minimum net hourly earnings floor and care-emergency exception rules.', details: 'Secures contract worker pay integrity and protects riders from priority penalties during care breaks (G13, G16).' },
                      { tag: 'Strategic', text: 'Set Board-reviewed workforce target percentages and progress tracks to manager roles.', details: 'Establishes clear pathways from pickers/riders to supervisory operations roles (G1, G7).' }
                    ],
                    B: [
                      { tag: 'Quick Win', text: 'Formally audit subcontractor pay reports to verify equal pay directly in women’s bank accounts.', details: 'Guarantees wage parity compliance and shuts down contractor deduction practices (W14).' },
                      { tag: 'Quick Win', text: 'Audit toilet cleanup schedules and implement menstrual waste disposal mechanisms.', details: 'Ensures functional, secure, and sanitary restroom standards during peak warehouse headcount (W8).' },
                      { tag: 'Structural', text: 'Integrate agency/contract women workers into crèche facilities and grievance loops.', details: 'Delivers standardized care facilities across both permanent and contract labor (W3, W9).' },
                      { tag: 'Structural', text: 'Incentivize license programs for women operators on reach trucks and forklifts.', details: 'Breaks pink-collar sorting line ghettos by moving women to material-handling equipment (W6).' },
                      { tag: 'Strategic', text: 'Incorporate site-level female retention scorecards into operations heads’ performance reviews.', details: 'Ensures site heads, rather than just HR, own the hiring and progression of women associates (W2).' }
                    ],
                    C: [
                      { tag: 'Quick Win', text: 'Install a dedicated lockable women’s toilet with water and hygiene amenities.', details: 'Fixes the single most cited structural bottleneck for retaining women in smaller units (S8, S9).' },
                      { tag: 'Quick Win', text: 'Enforce wage disbursement exclusively via bank transfer to the woman’s own account.', details: 'Eliminates cash payouts to male relatives and protects female workers’ financial control (S14).' },
                      { tag: 'Structural', text: 'Set up license training for women workers on core machinery operations.', details: 'Transitions female workers from helper and finishing jobs to higher-value machine operators (S6).' },
                      { tag: 'Structural', text: 'Identify and promote female operators to supervisors or shift leads.', details: 'Establishes visible female role models on the factory floor (S7).' },
                      { tag: 'Strategic', text: 'Draft and display simple guidelines mapping POSH redress paths and local committee links.', details: 'Secures basic protection avenues for workplaces with under 10 direct employees (S3, S12).' }
                    ],
                    D: [
                      { tag: 'Quick Win', text: 'Perform safety audits for swap/charge sites for night-shift lighting, CCTV, and layout visibility.', details: 'Improves physical safety designs to protect technicians and female customer bases (E7).' },
                      { tag: 'Quick Win', text: 'Instate a pregnancy safety modification policy to reallocate shopfloor staff away from battery chemicals.', details: 'Ensures compliance with Maternity Benefit guidelines on battery production floors (E10).' },
                      { tag: 'Structural', text: 'Mandate a minimum 30% female participation target across technical EV skilling courses.', details: 'Secures technical pipelines in battery assembly, BMS, and electronic repair (E3).' },
                      { tag: 'Structural', text: 'Forge financier partnerships to enable low-deposit EV lease-to-own agreements for women.', details: 'Mitigates the thin-file financing barrier to facilitate commercial vehicle ownership (E11).' },
                      { tag: 'Strategic', text: 'Roll out majority-women assembly lines at core cell and component manufacturing factories.', details: 'Leverages successful industry precedents to scale shopfloor operational metrics (E15, E16).' }
                    ]
                  };

                  const currentMoves = moves[profile.industry] || [];
                  return currentMoves.map((m, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/20 hover:border-slate-350 transition duration-150">
                      <div className="shrink-0 sm:mt-0.5 self-start">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wide border ${
                          m.tag === 'Quick Win' 
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                            : m.tag === 'Structural' 
                              ? 'bg-indigo-500/10 text-indigo-650 border-indigo-500/20' 
                              : 'bg-purple-500/10 text-purple-650 border-purple-500/20'
                        }`}>
                          {m.tag}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h5 className="font-semibold text-sm text-slate-800">
                          {m.text}
                        </h5>
                        <p className="text-xs text-slate-500 font-medium">
                          {m.details}
                        </p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Recommended Pathway */}
            <div className="print-card bg-slate-900 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-md">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Strategic Recommendation</span>
              <h4 className="text-xl font-bold text-white mb-3">
                Recommended Pathway
              </h4>
              
              <div className="space-y-3.5 text-slate-300 text-[12.5px] leading-relaxed font-medium">
                {GRS >= 55 ? (
                  <>
                    <p>
                      With a Gender Readiness Score of <strong className="text-white">{GRS}%</strong> ({bandInfo.band} Band), the organization exhibits sound baseline configurations. You are a strong candidate to proceed directly to the formal <strong>SHIFT Gender Readiness Audit (SGRA-01 to 04)</strong>.
                    </p>
                    <p>
                      The formal audit features a comprehensive 3-class evidence protocol with detailed site reviews, certifying compliance and baselining your 12-month progress tracking. Address current red-flag indicators immediately prior to the auditor’s visit.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      With a GRS of <strong className="text-white">{GRS}%</strong> ({bandInfo.band} Band), intent currently outstrips operational execution. We recommend a focused <strong>90-day sprint sprint</strong> targeted specifically at resolving the gaps listed in the Red-Flag Register and Data Visibility gap note.
                    </p>
                    <p>
                      Baseling a certification audit on a system with key operational data gaps is counterproductive. Establish basic sanitations, POSH committees, and payroll tracking first to set up a valid framework before commissioning the full onsite audit.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-center text-[10px] text-slate-500 py-6 border-t border-slate-200 space-y-1 font-medium leading-normal">
              <p>CONFIDENTIAL — FOR USE UNDER LICENCE AND FACILITATED ENGAGEMENT ONLY</p>
              <p>© 2026 Even Innovation LLP. The SHIFT Framework, Gender Readiness Audit and Express Diagnostic are proprietary instruments.</p>
            </div>
          </div>
        )}
        </>
        )}
      </main>
      {/* Onsite Audit Request Confirmation Modal */}
      {showAuditRequestModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-start space-x-3.5">
              <span className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl border border-indigo-100 shrink-0">
                <CheckIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Request Full Onsite Audit</h3>
                {isAuditComplete ? (
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-medium">
                    We have recorded your **Gender Readiness Score of <span className="num-sans">{GRS}%</span>** for **{profile.name || 'your organisation'}**. 
                    <br /><br />
                    Our facilitation team at Even Innovation will contact **{profile.contactPerson || 'the contact person'}** at **{profile.email || 'your email'}** (or **{profile.mobile || 'your phone number'}**) within 24 hours to schedule the 3-to-5 day onsite audit.
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-medium">
                    To request a full onsite verification and "Even Verified" certification, we recommend completing the 20-question diagnostic first. 
                    <br /><br />
                    Currently, you have answered **<span className="num-sans">{answeredCount}</span> of 20** questions. 
                    <br /><br />
                    Would you like us to contact you anyway? We can reach out to **{profile.email || 'your email'}** to discuss a custom engagement.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowAuditRequestModal(false)}
                className="px-4 py-2 border border-slate-200 bg-white rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerAlert('Request Sent', 'Audit Request Sent! Our representative will call you shortly.', () => {
                    setShowAuditRequestModal(false);
                  });
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-md cursor-pointer"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation / Alert Modal */}
      {customModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100] flex items-center justify-center p-4 text-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-start space-x-3">
              {customModal.type === 'confirm' ? (
                <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
              ) : (
                <span className="p-2.5 bg-indigo-50 text-indigo-650 rounded-xl border border-indigo-100 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                </span>
              )}
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-sm">{customModal.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {customModal.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 border-t border-slate-100 pt-3.5">
              {customModal.type === 'confirm' && (
                <button
                  type="button"
                  onClick={() => setCustomModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 border border-slate-200 bg-white rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer text-[11px]"
                >
                  {customModal.cancelLabel || 'Cancel'}
                </button>
              )}
              <button
                type="button"
                onClick={customModal.onConfirm}
                className={`px-5 py-2 text-white font-bold rounded-xl transition shadow-md cursor-pointer text-[11px] ${
                  customModal.type === 'confirm' 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
                }`}
              >
                {customModal.confirmLabel || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
