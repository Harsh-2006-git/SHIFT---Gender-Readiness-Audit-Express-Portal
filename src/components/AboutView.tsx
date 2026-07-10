import React from 'react';

// ── MODULE SPECIFIC VECTOR ICONS ─────────────────────────────────────

const GigIcon = () => (
  <svg className="w-5.5 h-5.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const WarehouseIcon = () => (
  <svg className="w-5.5 h-5.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SmeIcon = () => (
  <svg className="w-5.5 h-5.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const EvIcon = () => (
  <svg className="w-5.5 h-5.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CheckCircleIcon = ({ className = 'w-4 h-4 text-emerald-500' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function AboutView() {
  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 p-4.5 sm:p-10 border border-slate-200/80 space-y-10 sm:space-y-12 animate-fadeIn text-[13px] sm:text-xs antialiased" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      
      {/* ── HERO BANNER SECTION (BIGGER & FULLY RESPONSIVE) ──────────── */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-12 border border-indigo-950 shadow-md">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4 max-w-3xl">
          <span className="px-3.5 py-1 text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block">
            The SHIFT Framework
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
            Gender Readiness Audit — Express
          </h2>
          <p className="text-indigo-200 text-[12.5px] sm:text-[14.5px] leading-relaxed font-medium">
            A rapid screening instrument distilled from the full SHIFT Gender Readiness Audit suite (SGRA-01 to 04). 
            Twenty questions per sector, generating an immediate Express Gender Readiness Snapshot report.
          </p>
        </div>
      </div>

      {/* ── FOUR TARGETED MODULES (BIGGER TEXT & ALIGNMENT) ──────────── */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            Four Targeted Sector Modules
          </h3>
          <p className="text-slate-400 text-[11.5px] sm:text-[11px] font-medium">Select a module below to view the evaluation indicators.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Module A */}
          <div className="p-5 sm:p-5.5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-blue-50/20 to-white hover:border-blue-200 hover:shadow-xs transition duration-200 group flex gap-4">
            <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-100 transition-colors">
              <GigIcon />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[9.5px] font-bold text-blue-500 uppercase tracking-widest block leading-none">Module A</span>
              <h4 className="font-semibold text-sm sm:text-base text-slate-850">Gig Economy & Dark Stores</h4>
              <p className="text-[12.5px] sm:text-[11px] text-slate-500 leading-relaxed font-medium">
                For on-demand riders, pickers, and localized delivery hubs. Addresses late-shift commute safeguards, in-app SOS, gig partner contracts, and pay-per-task parity.
              </p>
            </div>
          </div>

          {/* Module B */}
          <div className="p-5 sm:p-5.5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-purple-50/20 to-white hover:border-purple-200 hover:shadow-xs transition duration-200 group flex gap-4">
            <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-purple-100 transition-colors">
              <WarehouseIcon />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[9.5px] font-bold text-purple-500 uppercase tracking-widest block leading-none">Module B</span>
              <h4 className="font-semibold text-sm sm:text-base text-slate-855">Warehousing & Fulfilment</h4>
              <p className="text-[12.5px] sm:text-[11px] text-slate-500 leading-relaxed font-medium">
                For fulfillment centers and industrial hubs. Explores physical facility size margins, crèche/lactation room operation, machinery training access, and subcontractor wage parity.
              </p>
            </div>
          </div>

          {/* Module C */}
          <div className="p-5 sm:p-5.5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-rose-50/20 to-white hover:border-rose-200 hover:shadow-xs transition duration-200 group flex gap-4">
            <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-rose-100 transition-colors">
              <SmeIcon />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[9.5px] font-bold text-rose-500 uppercase tracking-widest block leading-none">Module C</span>
              <h4 className="font-semibold text-sm sm:text-base text-slate-855">Small & Medium Enterprises (SMEs)</h4>
              <p className="text-[12.5px] sm:text-[11px] text-slate-500 leading-relaxed font-medium">
                For business operations with under 250 employees. Focuses on essential physical sanitation, cash payment elimination, predictable scheduling, and simple buyer compliance readiness.
              </p>
            </div>
          </div>

          {/* Module D */}
          <div className="p-5 sm:p-5.5 rounded-xl sm:rounded-2xl border border-slate-200/70 bg-gradient-to-b from-indigo-50/20 to-white hover:border-indigo-200 hover:shadow-xs transition duration-200 group flex gap-4">
            <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-100 transition-colors">
              <EvIcon />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[9.5px] font-bold text-indigo-600 uppercase tracking-widest block leading-none">Module D</span>
              <h4 className="font-semibold text-sm sm:text-base text-slate-855">EV Value Chain</h4>
              <p className="text-[12.5px] sm:text-[11px] text-slate-500 leading-relaxed font-medium">
                Cross-segment review covering cell plants, assembly lines, dealership sales, and field technicians. Explores physical charger site safety, thin-file credit access, and engineering inclusion.
              </p>
            </div>
          </div>

        </div>
      </div>

      <hr className="border-slate-100" />

      {/* ── HOW TO ADMINISTER & DOMAINS (RESPONSIVE STACKING) ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        
        {/* How to Administer Card */}
        <div className="space-y-5 bg-[#F8FAFC] border border-slate-200/60 p-5 sm:p-6 rounded-xl sm:rounded-2xl">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            How to Administer
          </h3>
          <ul className="space-y-3.5 text-[12.5px] sm:text-[11.5px] text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 font-semibold">Respondent:</strong> One senior operations head and one HR/compliance lead, answering jointly (60 to 90 minutes).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 font-semibold">Evidence Based:</strong> Answers must come from actual records (payroll, policies, schedules), not impressions. If the answer is "we don't know," score 0 — the Data Visibility Gap.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 font-semibold">Scope:</strong> Answer for the whole operation including gig partners, contract labor, agency staff, franchisees and third-party sites.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircleIcon className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800 font-semibold">N/A Exclusions:</strong> If a question truly does not apply, mark N/A. N/A must be justified with a one-sentence remark.
              </span>
            </li>
          </ul>
        </div>

        {/* SHIFT Domains Card */}
        <div className="space-y-5 flex flex-col justify-between p-1">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight mb-2">
              The SHIFT Domains
            </h3>
            <p className="text-[12.5px] sm:text-[11.5px] text-slate-450 font-medium leading-relaxed">
              Questions are weighted and mapped across the core organizational pillars:
            </p>
          </div>
          
          <div className="space-y-3.5 font-semibold text-slate-700 text-[12.5px] sm:text-[12px] mt-4 sm:mt-0">
            <div className="flex items-center gap-3">
              <span className="w-6.5 h-6.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 num-sans font-bold shadow-xs shrink-0">S</span>
              <span>Strategy & Governance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6.5 h-6.5 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 num-sans font-bold shadow-xs shrink-0">H</span>
              <span>Hiring & Sourcing</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6.5 h-6.5 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 num-sans font-bold shadow-xs shrink-0">I</span>
              <span>Infrastructure & Safety</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6.5 h-6.5 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 num-sans font-bold shadow-xs shrink-0">F</span>
              <span>Fair Pay & Welfare</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6.5 h-6.5 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 num-sans font-bold shadow-xs shrink-0">T</span>
              <span>Transformation & Culture</span>
            </div>
          </div>
        </div>

      </div>

      <hr className="border-slate-100" />

      {/* ── SCORING & MATURITY (PREMIUM VISUAL GRIDS) ────────────────── */}
      <div className="space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          Scoring & Maturity Classification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Maturity Level Grid */}
          <div className="space-y-3">
            <span className="block text-[10.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Maturity Level Scaling</span>
            <div className="space-y-3">
              
              <div className="p-3.5 border border-rose-100 bg-rose-50/20 rounded-xl flex items-start gap-4">
                <span className="w-5.5 h-5.5 rounded bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[11.5px] shrink-0 mt-0.5">0</span>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-850 text-[13px] sm:text-[12.5px]">Absent</div>
                  <p className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">No policy, no practice, or no visible data is present.</p>
                </div>
              </div>

              <div className="p-3.5 border border-amber-100 bg-amber-50/20 rounded-xl flex items-start gap-4">
                <span className="w-5.5 h-5.5 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[11.5px] shrink-0 mt-0.5">1</span>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-855 text-[13px] sm:text-[12.5px]">Emerging</div>
                  <p className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Intent exists but is undocumented, unfunded, or dependent on individuals.</p>
                </div>
              </div>

              <div className="p-3.5 border border-indigo-100 bg-indigo-50/20 rounded-xl flex items-start gap-4">
                <span className="w-5.5 h-5.5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11.5px] shrink-0 mt-0.5">2</span>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-855 text-[13px] sm:text-[12.5px]">Established</div>
                  <p className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Documented, funded practices exist, but worker coverage is incomplete.</p>
                </div>
              </div>

              <div className="p-3.5 border border-emerald-100 bg-emerald-50/20 rounded-xl flex items-start gap-4">
                <span className="w-5.5 h-5.5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11.5px] shrink-0 mt-0.5">3</span>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-855 text-[13px] sm:text-[12.5px]">Institutionalised</div>
                  <p className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Embedded in enterprise budgets, policies, and measured across all worker classes.</p>
                </div>
              </div>

            </div>
          </div>

          {/* GRS Scoring Bands */}
          <div className="space-y-3">
            <span className="block text-[10.5px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Maturity Readiness Bands</span>
            <div className="space-y-3">
              
              <div className="p-3.5 border border-emerald-100 bg-emerald-50/30 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[12.5px] sm:text-[11.5px] font-semibold text-emerald-800 block">SHIFT Leader (85% – 100% GRS)</span>
                  <span className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Strong candidate for full Even Cargo certification status.</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-bold shrink-0 uppercase tracking-wider">Top Tier</span>
              </div>

              <div className="p-3.5 border border-teal-100 bg-teal-50/30 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[12.5px] sm:text-[11.5px] font-semibold text-teal-800 block">Advanced (70% – 84% GRS)</span>
                  <span className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Sound foundation with minor targeted policy refinements.</span>
                </div>
              </div>

              <div className="p-3.5 border border-indigo-100 bg-indigo-50/30 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[12.5px] sm:text-[11.5px] font-semibold text-indigo-800 block">Committed (55% – 69% GRS)</span>
                  <span className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Real management commitment with visible gap closures.</span>
                </div>
              </div>

              <div className="p-3.5 border border-amber-100 bg-amber-50/30 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[12.5px] sm:text-[11.5px] font-semibold text-amber-800 block">Aware (40% – 54% GRS)</span>
                  <span className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Intent exceeds current operational systems; setup required.</span>
                </div>
              </div>

              <div className="p-3.5 border border-rose-100 bg-rose-50/30 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-[12.5px] sm:text-[11.5px] font-semibold text-rose-800 block">Gender-Blind (0% – 39% GRS)</span>
                  <span className="text-[11.5px] sm:text-[10.5px] text-slate-500 font-medium">Unable to manage gender realities; urgent baseline policies needed.</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <hr className="border-slate-100" />

      {/* ── THE ONWARD PATHWAY (STEPS TIMELINE) ──────────────────────── */}
      <div className="space-y-6 pb-2">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            The Onward Pathway
          </h3>
          <p className="text-slate-400 text-[11.5px] sm:text-[11px] font-medium">Follow diagnostic completion milestones to certification.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          
          <div className="p-5 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-xs relative text-center">
            <span className="w-7.5 h-7.5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto text-xs sm:text-[11.5px] font-bold num-sans mb-2.5 shadow-xs">0</span>
            <h5 className="font-semibold text-xs sm:text-[11.5px] text-slate-850">Express Snapshot</h5>
            <p className="text-[11px] sm:text-[9.5px] text-slate-450 mt-1 leading-normal font-medium">Triage assessment & pathway recommendation.</p>
          </div>

          <div className="p-5 sm:p-4 rounded-xl border border-teal-100 bg-teal-50/20 shadow-xs relative text-center">
            <span className="w-7.5 h-7.5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-xs sm:text-[11.5px] font-bold num-sans mb-2.5 shadow-xs">1</span>
            <h5 className="font-semibold text-xs sm:text-[11.5px] text-slate-855">Onsite Audit</h5>
            <p className="text-[11px] sm:text-[9.5px] text-slate-450 mt-1 leading-normal font-medium">3-5 days full verification by auditors.</p>
          </div>

          <div className="p-5 sm:p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 shadow-xs relative text-center">
            <span className="w-7.5 h-7.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto text-xs sm:text-[11.5px] font-bold num-sans mb-2.5 shadow-xs">2</span>
            <h5 className="font-semibold text-xs sm:text-[11.5px] text-slate-855">Action Plan</h5>
            <p className="text-[11px] sm:text-[9.5px] text-slate-450 mt-1 leading-normal font-medium">Detailed costed interventions & schedules.</p>
          </div>

          <div className="p-5 sm:p-4 rounded-xl border border-purple-100 bg-purple-50/20 shadow-xs relative text-center">
            <span className="w-7.5 h-7.5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-xs sm:text-[11.5px] font-bold num-sans mb-2.5 shadow-xs">3</span>
            <h5 className="font-semibold text-xs sm:text-[11.5px] text-slate-855">12m Sprint</h5>
            <p className="text-[11px] sm:text-[9.5px] text-slate-450 mt-1 leading-normal font-medium">Facilitated implementation of milestones.</p>
          </div>

          <div className="p-5 sm:p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-xs relative text-center">
            <span className="w-7.5 h-7.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xs sm:text-[11.5px] font-bold num-sans mb-2.5 shadow-xs">4</span>
            <h5 className="font-semibold text-xs sm:text-[11.5px] text-slate-855">Certification</h5>
            <p className="text-[11px] sm:text-[9.5px] text-slate-450 mt-1 leading-normal font-medium">"Even Verified" Gender Ready validation status.</p>
          </div>

        </div>
      </div>
      
      {/* ── FOOTER COPYRIGHT ────────────────────────────────────────── */}
      <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-6">
        <p>© 2026 Even Innovation LLP. Confidential — for use under licence only.</p>
      </div>

    </div>
  );
}
