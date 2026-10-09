import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode, do not show button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        title="تثبيت تطبيق خطوتي على جهازك"
      >
        <Download className="w-3.5 h-3.5 text-amber-300" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-700/30 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
          <span>تثبيت في الآيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-emerald-100 text-right">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-bold text-emerald-950">تثبيت خطوتي على iOS / آيفون</h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">1</span>
                  <p>اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari السفلي.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">2</span>
                  <p>مرر للأسفل واضغط على <strong>إضافة إلى الصفحة الرئيسية (Add to Home Screen)</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">3</span>
                  <p>سيظهر تطبيق «خطوتي» على شاشتك ليعمل بسلاسة وبدون إنترنت في أي وقت!</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
