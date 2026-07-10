'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginView from '@/components/AdminLoginView';
import HistoryView from '@/components/HistoryView';

export default function AdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

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

  useEffect(() => {
    setMounted(true);
    // Check if session exists in localStorage
    const savedLogin = localStorage.getItem('shift_admin_logged_in');
    if (savedLogin === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@evencargo.in' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      setAdminError('');
      localStorage.setItem('shift_admin_logged_in', 'true');
    } else {
      setAdminError('Invalid email/username or password.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminEmail('');
    setAdminPassword('');
    localStorage.removeItem('shift_admin_logged_in');
  };

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

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-[#0F172A] flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        <p className="text-slate-400 font-bold text-xs">Booting administration module...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      
      {!isAdminLoggedIn ? (
        <AdminLoginView 
          adminEmail={adminEmail}
          adminPassword={adminPassword}
          adminError={adminError}
          setAdminEmail={setAdminEmail}
          setAdminPassword={setAdminPassword}
          handleAdminLogin={handleAdminLogin}
        />
      ) : (
        <HistoryView 
          onLoadAudit={(sub) => {
            // Write to localStorage so that root `/` loads it automatically
            localStorage.setItem('shift_profile', JSON.stringify(sub.profile));
            localStorage.setItem('shift_answers', JSON.stringify(sub.answers));
            localStorage.setItem('shift_step', 'report');
            // Redirect to root portal
            router.push('/');
          }}
          triggerConfirm={triggerConfirm}
          triggerAlert={triggerAlert}
          onLogout={handleAdminLogout}
        />
      )}

      {/* ── CUSTOM DIALOG OVERLAYS ────────────────────────────── */}
      {customModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4 text-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2.5">
                {customModal.type === 'confirm' ? (
                  <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                )}
                <span>{customModal.title}</span>
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                {customModal.message}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2.5 border-t border-slate-100 p-4 bg-slate-50/50">
              {customModal.type === 'confirm' && (
                <button
                  type="button"
                  onClick={() => setCustomModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 border border-slate-250 bg-white rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer text-[11px]"
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
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-650/10'
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
