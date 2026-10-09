import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { DayPrayerLog, PrayerKey } from '../types';
import {
  Check,
  Shield,
  Trash2,
  Calendar,
  Sparkles,
  Heart,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';

export const PrayerTracker: React.FC = () => {
  const [todayLog, setTodayLog] = useState<DayPrayerLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<DayPrayerLog[]>([]);
  const [todayDateStr, setTodayDateStr] = useState<string>('');

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dStr = `${yyyy}-${mm}-${dd}`;
    setTodayDateStr(dStr);

    loadLogs(dStr);
  }, []);

  const loadLogs = (currentDateStr: string) => {
    const log = storageService.getTodayPrayerLog(currentDateStr);
    setTodayLog(log);

    // Load past 7 days
    const allLogs = storageService.getPrayerLogs();
    const past7: DayPrayerLog[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      past7.push(
        allLogs[key] || {
          date: key,
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
        }
      );
    }
    setWeeklyLogs(past7);
  };

  const handleToggle = (prayerKey: PrayerKey) => {
    if (!todayDateStr) return;
    const updated = storageService.togglePrayerCompleted(todayDateStr, prayerKey);
    setTodayLog({ ...updated });
    loadLogs(todayDateStr);
  };

  const handleResetData = () => {
    if (confirm('هل أنت متأكد من رغبتك في تصفير سجل متابعة الصلاة لهذا اليوم؟')) {
      if (todayDateStr) {
        const resetLog: DayPrayerLog = {
          date: todayDateStr,
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
        };
        const all = storageService.getPrayerLogs();
        all[todayDateStr] = resetLog;
        localStorage.setItem('khatwati_prayer_logs_v1', JSON.stringify(all));
        setTodayLog(resetLog);
        loadLogs(todayDateStr);
      }
    }
  };

  const prayers: Array<{ key: PrayerKey; name: string; icon: React.ReactNode }> = [
    { key: 'fajr', name: 'الصبح (الفجر)', icon: <Moon className="w-4 h-4 text-indigo-400" /> },
    { key: 'dhuhr', name: 'الظهر', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { key: 'asr', name: 'العصر', icon: <Sun className="w-4 h-4 text-orange-400" /> },
    { key: 'maghrib', name: 'المغرب', icon: <CloudSun className="w-4 h-4 text-rose-500" /> },
    { key: 'isha', name: 'العشاء', icon: <Moon className="w-4 h-4 text-indigo-600" /> },
  ];

  const completedCount = todayLog
    ? (todayLog.fajr ? 1 : 0) +
      (todayLog.dhuhr ? 1 : 0) +
      (todayLog.asr ? 1 : 0) +
      (todayLog.maghrib ? 1 : 0) +
      (todayLog.isha ? 1 : 0)
    : 0;

  const percentage = Math.round((completedCount / 5) * 100);

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">خطوتي نحو الصلاة</span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
            متابعة الصلوات الخمس اليومية
          </h2>
          <p className="text-xs text-slate-500">
            متابعة هادئة وخاصة بك لتثبيت صلاتك بدون مقارنة أو إحراج
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
          title="تصفير سجل اليوم"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Today's Progress Bar Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800">إنجاز اليوم:</span>
          <span className="text-xs font-bold font-mono text-emerald-900">
            {completedCount} من 5 صلوات ({percentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-700 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Gentle Encouragement */}
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-950 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
          <Heart className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {completedCount === 5
              ? 'ما شاء الله تبارك الله! أكملت صلواتك الخمس اليوم، ثبتك الله وزادك فضلاً.'
              : completedCount > 0
              ? 'خطوة بخطوة نحو المحافظة على جميع الصلوات في وقتها، استعن بالله ولا تعجز.'
              : 'بداية يوم طيب، توضأ واستعد للصلاة لتنال طمأنينة القلب وبركة الوقت.'}
          </span>
        </div>
      </div>

      {/* 5 Prayers Interactive Checkboxes */}
      <div className="grid sm:grid-cols-5 gap-2.5 mb-6">
        {prayers.map((p) => {
          const isDone = todayLog ? todayLog[p.key] : false;
          return (
            <button
              key={p.key}
              onClick={() => handleToggle(p.key)}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                isDone
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {p.icon}
                <span className="text-xs font-bold">{p.name}</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                  isDone
                    ? 'bg-amber-400 text-emerald-950 border-amber-300'
                    : 'bg-slate-100 text-transparent border-slate-300'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Weekly Consistency Overview */}
      <div className="border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-800" />
          <span>سجل الأيام السبعة الماضية:</span>
        </h4>
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weeklyLogs.map((log) => {
            const count =
              (log.fajr ? 1 : 0) +
              (log.dhuhr ? 1 : 0) +
              (log.asr ? 1 : 0) +
              (log.maghrib ? 1 : 0) +
              (log.isha ? 1 : 0);
            const dateObj = new Date(log.date);
            const dayName = dateObj.toLocaleDateString('ar-MA', { weekday: 'narrow' });

            return (
              <div key={log.date} className="bg-slate-50 border border-slate-200/60 rounded-xl p-2 text-xs">
                <span className="text-[10px] text-slate-500 block mb-1 font-semibold">{dayName}</span>
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    count === 5
                      ? 'bg-emerald-800 text-amber-300'
                      : count > 0
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {count}
                </div>
                <span className="text-[9px] text-slate-400 block mt-1">/5</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Absolute Privacy Statement */}
      <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
        <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p>
          <strong>خصوصية تامة:</strong> بيانات صلاتك تُحفظ حصرياً على جهازك ومحفوظاتك المحلية، ولا تُشارك أو تُرسل لأي خادم أو طرف ثالث. عباداتك بينك وبين الله وحده.
        </p>
      </div>
    </div>
  );
};
