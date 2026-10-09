import React, { useState, useEffect } from 'react';
import { APPROVED_ADHKAR } from '../data/adhkarData';
import { DhikrItem, DhikrCategory } from '../types';
import { storageService } from '../services/storageService';
import {
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  BookOpen,
  Filter,
} from 'lucide-react';

export const DhikrCounter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<DhikrCategory | 'ALL'>('ALL');
  const [activeDhikrId, setActiveDhikrId] = useState<string>(APPROVED_ADHKAR[0].id);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setCounts(storageService.getDhikrCounts());
  }, []);

  const activeDhikr = APPROVED_ADHKAR.find((d) => d.id === activeDhikrId) || APPROVED_ADHKAR[0];
  const currentCount = counts[activeDhikr.id] || 0;
  const isCompleted = currentCount >= activeDhikr.countTarget;

  // Sound chime synthesizer via Web Audio API
  const playClickSound = (isFinish: boolean = false) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isFinish) {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch {
      // AudioContext unavailable
    }
  };

  const handleIncrement = () => {
    const next = currentCount + 1;
    const newCounts = { ...counts, [activeDhikr.id]: next };
    setCounts(newCounts);
    storageService.saveDhikrCount(activeDhikr.id, next);

    // Haptic feedback if available on mobile device
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(next >= activeDhikr.countTarget ? [40, 60, 40] : 25);
      } catch (e) {
        // ignore
      }
    }

    playClickSound(next >= activeDhikr.countTarget);
  };

  const handleReset = () => {
    const newCounts = { ...counts, [activeDhikr.id]: 0 };
    setCounts(newCounts);
    storageService.saveDhikrCount(activeDhikr.id, 0);
  };

  const filteredAdhkar = selectedCategory === 'ALL'
    ? APPROVED_ADHKAR
    : APPROVED_ADHKAR.filter((d) => d.category === selectedCategory);

  const categories: Array<{ id: DhikrCategory | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'الكل' },
    { id: 'MORNING', label: 'الصباح' },
    { id: 'EVENING', label: 'المساء' },
    { id: 'AFTER_PRAYER', label: 'بعد الصلاة' },
    { id: 'SLEEP', label: 'النوم' },
    { id: 'WAKING', label: 'الاستيقاظ' },
    { id: 'GENERAL_DUA', label: 'أدعية جامعة' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">ألا بذكر الله تطمئن القلوب</span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
            الأذكار المأثورة وحاسبة التسبيح
          </h2>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-800 text-amber-300 font-bold shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Dhikr Cards */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {filteredAdhkar.map((d) => {
          const count = counts[d.id] || 0;
          const isDone = count >= d.countTarget;
          const isSelected = activeDhikrId === d.id;

          return (
            <button
              key={d.id}
              onClick={() => setActiveDhikrId(d.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500 shadow-xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-slate-900">{d.title}</span>
                <span className="text-[10px] font-semibold text-slate-500">{d.categoryArabic}</span>
              </div>
              <p className="font-quran text-sm text-slate-800 line-clamp-2 leading-relaxed mb-2">
                {d.arabicText}
              </p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">العدد المطلوب: {d.countTarget}</span>
                <span
                  className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded-md ${
                    isDone ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {count} / {d.countTarget}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Interactive Tasbih Counter */}
      <div className="bg-gradient-to-b from-emerald-950 to-emerald-900 text-white rounded-2xl p-6 shadow-md text-center relative overflow-hidden">
        <span className="text-emerald-300 text-xs font-semibold block mb-1">
          {activeDhikr.categoryArabic} · {activeDhikr.title}
        </span>

        {/* Sacred Arabic Text */}
        <p className="font-quran text-xl sm:text-2xl font-bold text-amber-200 leading-loose my-3 px-2">
          {activeDhikr.arabicText}
        </p>

        {/* Fadl / Meaning in Darija */}
        <div className="bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs text-emerald-100 max-w-lg mx-auto mb-6">
          <p className="font-bold text-white mb-0.5">الفضل والثواب بالدارجة:</p>
          <p>{activeDhikr.fadlDarija}</p>
          <span className="block mt-1 text-[10px] text-emerald-300 opacity-80">
            المصدر: {activeDhikr.source}
          </span>
        </div>

        {/* Giant Circular Click Button */}
        <div className="flex flex-col items-center justify-center my-4">
          <button
            onClick={handleIncrement}
            className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl transition-transform active:scale-95 cursor-pointer ${
              isCompleted
                ? 'bg-amber-400 border-amber-300 text-emerald-950'
                : 'bg-emerald-800 border-emerald-600 text-white hover:bg-emerald-700'
            }`}
            title="اضغط للتسبيح"
          >
            <span className="text-3xl font-mono font-bold tabular-nums">
              {currentCount}
            </span>
            <span className="text-[11px] font-semibold mt-0.5 opacity-90">
              من {activeDhikr.countTarget}
            </span>
            {isCompleted && (
              <span className="text-[10px] font-bold bg-emerald-900 text-amber-300 px-2 py-0.5 rounded-full mt-1">
                اكتمل بفضل الله!
              </span>
            )}
          </button>
        </div>

        {/* Reset Counter Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير العداد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
