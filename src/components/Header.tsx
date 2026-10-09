import React from 'react';
import { Sparkles, Smartphone, Shield } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenAI: () => void;
  onOpenAndroidModal: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenAI,
  onOpenAndroidModal,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-emerald-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Clean Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-right group cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-emerald-700 transition">
              خ
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-950 font-ui">
              خطوتي
            </span>
          </button>
        </div>

        {/* Zone 2: Primary Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'home'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onNavigate('prayer')}
            className={`transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'prayer'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            الصلاة والوضوء
          </button>
          <button
            onClick={() => onNavigate('quran')}
            className={`transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'quran'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            المصحف الشريف
          </button>
          <button
            onClick={() => onNavigate('learning')}
            className={`transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'learning'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            مسارات التعلم
          </button>
          <button
            onClick={() => onNavigate('istighfar')}
            className={`transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'istighfar'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            الاستغفار
          </button>
          <button
            onClick={() => onNavigate('more')}
            className={`transition-colors cursor-pointer pb-0.5 ${
              currentTab === 'more'
                ? 'text-emerald-800 font-bold border-b-2 border-emerald-700'
                : 'hover:text-emerald-800'
            }`}
          >
            الأذكار والمرئيات
          </button>
        </nav>

        {/* Zone 3: Actions (PWA install, Native Android Architecture, AI Assistant) */}
        <div className="flex items-center gap-2">
          {/* Native Android architecture viewer modal button */}
          <button
            onClick={onOpenAndroidModal}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-emerald-800/20 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-900 px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer"
            title="استعراض بنية تطبيق أندرويد الأصلي (Android Native Kotlin)"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
            <span>نظام Android</span>
          </button>

          {/* Admin Dashboard / Religious Governance Console */}
          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-900/20 bg-amber-50/60 hover:bg-amber-100/80 text-amber-950 px-2.5 py-1.5 text-xs font-bold transition cursor-pointer"
            title="لوحة التحكم الإدارية والحوكمة الشرعية"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-800" />
            <span className="hidden sm:inline">لوحة الإدارة</span>
          </button>

          <PWAInstallButton />

          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer"
            title="المساعد التعليمي الذكي لمنصة خطوتي"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>المساعد التعليمي</span>
          </button>
        </div>
      </div>
    </header>
  );
};
