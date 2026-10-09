import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3500);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <aside
        aria-label="حالة الاتصال"
        className="bg-amber-600 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm transition-all animate-in fade-in"
      >
        <WifiOff className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <span>وضع عدم الاتصال — يمكنك تصفح القرآن، الدروس المحفوظة، أوقات الصلاة، والأذكار بدون إنترنت.</span>
      </aside>
    );
  }

  if (showReconnected) {
    return (
      <aside
        aria-label="حالة الاتصال"
        className="bg-emerald-700 text-white text-xs font-medium py-1 px-4 text-center flex items-center justify-center gap-2 shadow-sm transition-all"
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
        <span>تم استعادة الاتصال بالإنترنت بنجاح.</span>
      </aside>
    );
  }

  return null;
};
