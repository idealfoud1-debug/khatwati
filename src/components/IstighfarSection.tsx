import React, { useState, useEffect } from 'react';
import { VERIFIED_ISTIGHFAR_FORMULAS, ISTIGHFAR_BENEFITS_DARIJA } from '../data/istighfarData';
import { IstighfarFormula } from '../types';
import { storageService } from '../services/storageService';
import {
  RotateCcw,
  Sparkles,
  Heart,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  ChevronDown,
} from 'lucide-react';

interface IstighfarSectionProps {
  onBackToMore?: () => void;
}

export const IstighfarSection: React.FC<IstighfarSectionProps> = ({ onBackToMore }) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('istighfar_1');
  const [count, setCount] = useState<number>(0);
  const [targetGoal, setTargetGoal] = useState<number>(70);
  const [totalLifetime, setTotalLifetime] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isGoalReached, setIsGoalReached] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Initialize from storage
  useEffect(() => {
    const saved = storageService.getIstighfarState();
    setCount(saved.currentCount);
    setSelectedFormulaId(saved.selectedFormulaId || 'istighfar_1');
    setTargetGoal(saved.targetGoal ?? 70);
    setTotalLifetime(saved.totalLifetimeCount || 0);
    setTodayCount(saved.todayCount || 0);
  }, []);

  const activeFormula: IstighfarFormula =
    VERIFIED_ISTIGHFAR_FORMULAS.find((f) => f.id === selectedFormulaId) ||
    VERIFIED_ISTIGHFAR_FORMULAS[0];

  // Increment counter with debouncing to avoid double increments on touch devices
  const handleTap = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(15);
    }

    const nextCount = count + 1;
    const nextToday = todayCount + 1;
    const nextTotal = totalLifetime + 1;

    setCount(nextCount);
    setTodayCount(nextToday);
    setTotalLifetime(nextTotal);

    if (targetGoal > 0 && nextCount === targetGoal) {
      setIsGoalReached(true);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.([40, 60, 40]);
      }
    }

    storageService.saveIstighfarState({
      currentCount: nextCount,
      selectedFormulaId,
      targetGoal,
      todayCount: nextToday,
      totalLifetimeCount: nextTotal,
    });
  };

  const handleSelectFormula = (formulaId: string) => {
    setSelectedFormulaId(formulaId);
    const formula = VERIFIED_ISTIGHFAR_FORMULAS.find((f) => f.id === formulaId);
    if (formula && formula.recommendedTarget) {
      setTargetGoal(formula.recommendedTarget);
    }
    storageService.saveIstighfarState({
      selectedFormulaId: formulaId,
      targetGoal: formula?.recommendedTarget ?? targetGoal,
    });
  };

  const handleSelectTarget = (goal: number) => {
    setTargetGoal(goal);
    setIsGoalReached(false);
    storageService.saveIstighfarState({ targetGoal: goal });
  };

  const handleConfirmReset = () => {
    setCount(0);
    setIsGoalReached(false);
    setShowResetConfirm(false);
    storageService.saveIstighfarState({ currentCount: 0 });
  };

  const playFormulaAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeFormula.arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const progressPercent =
    targetGoal > 0 ? Math.min(Math.round((count / targetGoal) * 100), 100) : 100;

  return (
    <div className="bg-white rounded-3xl border border-emerald-900/10 p-5 sm:p-8 shadow-xs text-right space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 text-emerald-700" />
            <span>مغفرة الذنوب وسعة الرزق</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-ui">
            الاستغفار والتوبة إلى الله
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            مسبحة إلكترونية تفاعلية ميسرة بأصح الصيغ النبوية الواردة عن النبي ﷺ
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[90px]">
            <span className="block text-[10px] text-slate-400 font-bold">استغفار اليوم</span>
            <span className="text-base font-extrabold text-emerald-900 font-mono">
              {todayCount.toLocaleString()}
            </span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center min-w-[90px]">
            <span className="block text-[10px] text-emerald-700 font-bold">المجموع الكلي</span>
            <span className="text-base font-extrabold text-emerald-950 font-mono">
              {totalLifetime.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Formula Selector Tabs */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          اختر صيغة الاستغفار النبوية:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {VERIFIED_ISTIGHFAR_FORMULAS.map((formula) => {
            const isSelected = formula.id === selectedFormulaId;
            return (
              <button
                key={formula.id}
                onClick={() => handleSelectFormula(formula.id)}
                className={`p-3.5 rounded-2xl text-right transition border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30'
                    : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 w-full">
                  <span
                    className={`text-xs font-bold font-ui ${
                      isSelected ? 'text-amber-300' : 'text-emerald-900'
                    }`}
                  >
                    {formula.titleArabic}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />}
                </div>
                <p
                  className={`text-xs sm:text-sm font-arabic line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-emerald-50' : 'text-slate-700'
                  }`}
                >
                  {formula.arabicText}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Formula Spotlight Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white shadow-md relative overflow-hidden text-center">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
            الصيغة المعتمدة المختارة
          </span>
          <button
            onClick={playFormulaAudio}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-100 transition cursor-pointer flex items-center gap-1 text-[11px]"
            title="الاستماع للصيغة"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-amber-300' : ''}`} />
            <span>نطق الصيغة</span>
          </button>
        </div>

        <p className="text-xl sm:text-2xl font-arabic font-bold text-white leading-loose py-2 px-2 max-w-2xl mx-auto drop-shadow-xs">
          {activeFormula.arabicText}
        </p>

        {activeFormula.transliteration && (
          <p className="text-[11px] text-emerald-200/80 font-mono dir-ltr mt-1">
            {activeFormula.transliteration}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-100/90 text-right space-y-1">
          <p>
            <strong className="text-amber-300">المعنى بالدارجة:</strong> {activeFormula.explanationDarija}
          </p>
          <p className="text-[11px] text-emerald-200">
            <strong className="text-amber-300">الفضل والمصدر:</strong> {activeFormula.fadlArabic} ({activeFormula.source})
          </p>
        </div>
      </div>

      {/* Target Goals Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700">الهدف المفضل للجلسة:</span>
        <div className="flex items-center gap-1.5">
          {[33, 70, 100, 1000, 0].map((goal) => (
            <button
              key={goal}
              onClick={() => handleSelectTarget(goal)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetGoal === goal
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {goal === 0 ? 'مفتوح (حر)' : goal}
            </button>
          ))}
        </div>
      </div>

      {/* Goal Reached Celebration Banner */}
      {isGoalReached && targetGoal > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">هنيئاً لك! أتممت هدف الجلسة ({targetGoal} استغفار)</h4>
              <p className="text-xs text-amber-800">
                تقبل الله منك وفتح لك أبواب الرحمة والمغفرة. يمكنك الاستمرار في الاستغفار أو إعادة التصفير.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGoalReached(false)}
            className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            متابعة الذكر
          </button>
        </div>
      )}

      {/* Giant Interactive Tap Area */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative">
          {/* Subtle Outer Ring Indicator */}
          {targetGoal > 0 && (
            <svg className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90 pointer-events-none absolute inset-0 -m-2 sm:-m-3">
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                className="stroke-slate-200"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                className="stroke-emerald-600 transition-all duration-300"
                strokeWidth="6"
                strokeDasharray="290"
                strokeDashoffset={290 - (290 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
          )}

          {/* Main Tap Button */}
          <button
            onClick={handleTap}
            aria-label="اضغط للاستغفار وزيادة العداد"
            className="w-52 h-52 sm:w-58 sm:h-58 rounded-full bg-gradient-to-b from-emerald-800 to-emerald-950 text-white shadow-xl hover:shadow-2xl active:scale-95 active:bg-emerald-900 transition-all duration-150 flex flex-col items-center justify-center p-4 cursor-pointer border-4 border-emerald-700/40 select-none group focus:outline-none focus:ring-4 focus:ring-emerald-400"
          >
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1 group-hover:scale-105 transition">
              انقر للاستغفار
            </span>
            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-sm">
              {count}
            </span>
            {targetGoal > 0 ? (
              <span className="text-[11px] text-emerald-300 font-medium mt-1">
                الهدف: {count} / {targetGoal}
              </span>
            ) : (
              <span className="text-[11px] text-emerald-300 font-medium mt-1">
                عداد مفتوح
              </span>
            )}
          </button>
        </div>

        {/* Action Controls Below Counter */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التصفير</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1">
              تأكيد إعادة تصفير العداد؟
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              سيتم إعادة عداد الجلسة الحالية إلى الصفر. علماً أن مجموع استغفارك اليومي والكلي محفوظ في سجلك.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition cursor-pointer"
              >
                نعم، تصفير العداد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Benefits of Istighfar Accordion / Cards */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-800" />
          <h3 className="font-bold text-sm text-slate-900 font-ui">
            ثمار وفضائل الاستغفار بالدارجة المغربية
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {ISTIGHFAR_BENEFITS_DARIJA.map((benefit, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5"
            >
              <h4 className="font-bold text-emerald-950 font-ui">{benefit.title}</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">{benefit.desc}</p>
              <span className="block text-[10px] text-emerald-800 font-arabic pt-1 border-t border-slate-200/60 font-semibold">
                {benefit.ayah}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
