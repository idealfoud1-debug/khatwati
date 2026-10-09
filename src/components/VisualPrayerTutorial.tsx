import React, { useState, useEffect } from 'react';
import { PRAYER_14_STEPS } from '../data/prayerEducationData';
import { PrayerStep } from '../types';
import {
  ChevronRight,
  ChevronLeft,
  Volume2,
  AlertTriangle,
  Heart,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Maximize2,
  Upload,
  X,
  ImageIcon,
  ZoomIn,
  Camera,
  Check,
} from 'lucide-react';

export const VisualPrayerTutorial: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [visualMode, setVisualMode] = useState<'PHOTO' | 'ILLUSTRATION'>('PHOTO');
  const [imageError, setImageError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('khatwati_custom_prayer_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const step: PrayerStep = PRAYER_14_STEPS[currentStepIndex];

  // Reset image error on step change
  React.useEffect(() => {
    setImageError(false);
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < PRAYER_14_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const playRecitationAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(step.audioRecitationText || step.recitationArabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // deliberate, calm pace
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(step.recitationArabic);
    }
  };

  // Respectful, modest, faceless posture SVG diagrams
  const renderPostureIllustration = (type: PrayerStep['postureType']) => {
    return (
      <div className="w-full h-48 bg-emerald-950/5 rounded-2xl flex items-center justify-center p-4 border border-emerald-900/10 relative overflow-hidden">
        {/* Subtle decorative Islamic arch background watermark */}
        <div className="absolute inset-x-8 bottom-0 top-4 border-t-2 border-x-2 border-emerald-900/10 rounded-t-full pointer-events-none" />

        <svg viewBox="0 0 200 160" className="w-40 h-40 drop-shadow-xs" aria-label={step.titleArabic}>
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="whiteGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FAF8F5" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
          </defs>

          {/* Prayer Rug base */}
          <rect x="25" y="142" width="150" height="6" rx="2" fill="#C5A059" opacity="0.6" />
          <line x1="20" y1="145" x2="180" y2="145" stroke="#064E3B" strokeWidth="1.5" />

          {/* Faceless Modest Worship Postures */}
          {type === 'TAKBEER' && (
            <g transform="translate(100, 20)">
              {/* Head (faceless modest white kufi/turban) */}
              <circle cx="0" cy="20" r="12" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              {/* Torso */}
              <path d="M -16,36 L 16,36 L 20,105 L -20,105 Z" fill="url(#bodyGrad)" />
              {/* Raised Hands for Takbeer */}
              <path d="M -16,45 L -28,32 L -26,18" fill="none" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 16,45 L 28,32 L 26,18" fill="none" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
              {/* Lower garment */}
              <rect x="-18" y="105" width="36" height="38" fill="url(#whiteGrad)" rx="2" stroke="#CBD5E1" />
            </g>
          )}

          {(type === 'QIYAM' || type === 'QIYAM_2' || type === 'QIYAM_3') && (
            <g transform="translate(100, 20)">
              <circle cx="0" cy="20" r="12" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              <path d="M -16,36 L 16,36 L 20,105 L -20,105 Z" fill="url(#bodyGrad)" />
              {/* Hands rested (Sadl in Maliki fiqh or folded on chest) */}
              <path d="M -16,42 L -18,80" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              <path d="M 16,42 L 18,80" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              <rect x="-18" y="105" width="36" height="38" fill="url(#whiteGrad)" rx="2" stroke="#CBD5E1" />
            </g>
          )}

          {(type === 'RUKU' || type === 'RUKU_3') && (
            <g transform="translate(70, 45)">
              {/* Back horizontal in Ruku */}
              <circle cx="68" cy="40" r="11" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              <path d="M 10,40 L 60,40 L 55,60 L 5,60 Z" fill="url(#bodyGrad)" />
              {/* Arms reaching knees */}
              <path d="M 50,45 L 35,78" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              {/* Legs vertical */}
              <rect x="5" y="58" width="16" height="60" fill="url(#whiteGrad)" rx="2" stroke="#CBD5E1" />
            </g>
          )}

          {type === 'ITIDAL' && (
            <g transform="translate(100, 20)">
              <circle cx="0" cy="20" r="12" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              <path d="M -16,36 L 16,36 L 20,105 L -20,105 Z" fill="url(#bodyGrad)" />
              {/* Arms relaxed at sides praising Allah */}
              <path d="M -16,42 L -18,80" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              <path d="M 16,42 L 18,80" fill="none" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              <rect x="-18" y="105" width="36" height="38" fill="url(#whiteGrad)" rx="2" stroke="#CBD5E1" />
            </g>
          )}

          {(type === 'SUJOOD_1' || type === 'SUJOOD_2') && (
            <g transform="translate(60, 75)">
              {/* Head touching ground */}
              <circle cx="95" cy="55" r="10" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              {/* Curved back prostrating */}
              <path d="M 15,45 Q 50,15 85,50 L 75,65 Q 45,35 15,60 Z" fill="url(#bodyGrad)" />
              {/* Hands beside head */}
              <path d="M 75,40 L 85,62" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
              {/* Knees and feet grounded */}
              <ellipse cx="20" cy="62" rx="14" ry="7" fill="url(#whiteGrad)" />
            </g>
          )}

          {(type === 'JULUS' || type === 'TASHAHHUD_1' || type === 'TASHAHHUD_2' || type === 'IBRAHIMIYYA') && (
            <g transform="translate(90, 50)">
              <circle cx="15" cy="20" r="11" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              <path d="M 0,34 L 30,34 L 26,75 L -4,75 Z" fill="url(#bodyGrad)" />
              {/* Hands on knees */}
              <path d="M 22,42 L 32,70" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
              {/* Sitting base (iftirash / tawarruk) */}
              <rect x="-14" y="75" width="55" height="18" fill="url(#whiteGrad)" rx="4" stroke="#CBD5E1" />
            </g>
          )}

          {type === 'TASLEEM' && (
            <g transform="translate(90, 50)">
              {/* Head turned gently to the right */}
              <circle cx="22" cy="20" r="11" fill="url(#whiteGrad)" stroke="#064E3B" strokeWidth="1.5" />
              <path d="M 0,34 L 30,34 L 26,75 L -4,75 Z" fill="url(#bodyGrad)" />
              <path d="M 22,42 L 32,70" fill="none" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
              <rect x="-14" y="75" width="55" height="18" fill="url(#whiteGrad)" rx="4" stroke="#CBD5E1" />
            </g>
          )}
        </svg>

        {/* Step Badge */}
        <div className="absolute top-3 right-3 bg-emerald-800 text-amber-300 font-bold text-xs px-2.5 py-1 rounded-full shadow-2xs">
          الخطوة {step.stepNumber} من 14
        </div>
      </div>
    );
  };

  const activeImageSrc = uploadedImages[step.id] || step.imageUrl;

  const VERIFIED_7_STEPS = [
    { stepIndex: 0, stepNumber: 1, circleBadge: 1, title: 'تكبيرة الإحرام' },
    { stepIndex: 2, stepNumber: 3, circleBadge: 3, title: 'الركوع' },
    { stepIndex: 3, stepNumber: 4, circleBadge: 4, title: 'الرفع والاعتدال' },
    { stepIndex: 4, stepNumber: 5, circleBadge: 5, title: 'السجود الأول' },
    { stepIndex: 5, stepNumber: 6, circleBadge: 6, title: 'صفة القدمين' },
    { stepIndex: 6, stepNumber: 7, circleBadge: 7, title: 'الجلوس المطمئن' },
    { stepIndex: 8, stepNumber: 9, circleBadge: 9, title: 'جلسة التشهد' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpload = async () => {
    if (!uploadPreview) return;
    setIsUploading(true);
    try {
      const updated = {
        ...uploadedImages,
        [step.id]: uploadPreview,
      };
      setUploadedImages(updated);
      localStorage.setItem('khatwati_custom_prayer_images', JSON.stringify(updated));

      // Also persist to server endpoint if possible
      try {
        await fetch('/api/prayer-images/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: `${step.id}_custom.jpg`,
            base64Data: uploadPreview,
          }),
        });
      } catch {
        // LocalStorage fallback already succeeded
      }

      setUploadSuccessMsg('تم حفظ الصورة بنجاح وتطبيقها على هذه الخطوة');
      setTimeout(() => {
        setUploadSuccessMsg('');
        setIsUploadModalOpen(false);
        setUploadPreview(null);
      }, 1500);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right">
      {/* 7 Verified Posture Photos Quick Access Strip */}
      <div className="mb-4 bg-emerald-950/5 border border-emerald-800/15 rounded-xl p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>الصور السبع المعتمدة لوضعيات الصلاة (انقر للانتقال المباشر):</span>
          </div>
          <span className="text-[10px] bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
            7 صور فقهية
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-1.5">
          {VERIFIED_7_STEPS.map((v) => {
            const isSelected = currentStepIndex === v.stepIndex;
            return (
              <button
                key={v.stepNumber}
                type="button"
                onClick={() => {
                  setCurrentStepIndex(v.stepIndex);
                  setVisualMode('PHOTO');
                }}
                className={`flex items-center gap-1.5 p-1.5 rounded-lg text-xs font-bold transition text-right cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-amber-300 ring-2 ring-emerald-600 shadow-2xs'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-900/10'
                }`}
                title={`الخطوة ${v.stepNumber}: ${v.title}`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {v.circleBadge}
                </span>
                <span className="truncate text-[11px]">{v.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title & Step Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-emerald-800 block">
            دليل الصلاة المرئي المعتمد (الخطوة {step.stepNumber} من 14)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui mt-0.5">
            {step.titleArabic}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{step.titleDarija}</p>
        </div>

        {/* Audio Recitation Button */}
        <button
          onClick={playRecitationAudio}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            isPlayingAudio
              ? 'bg-amber-400 text-emerald-950 animate-pulse'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
          title="الاستماع لنطق الذكر الصحيح"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span>{isPlayingAudio ? 'جارٍ الاستماع...' : 'استمع للذكر'}</span>
        </button>
      </div>

      {/* Visual Display Switcher & Container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="text-[11px] font-bold text-slate-500">
            طريقة العرض المرئي:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => {
                if (activeImageSrc) {
                  setVisualMode('PHOTO');
                }
              }}
              disabled={!activeImageSrc}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                visualMode === 'PHOTO' && activeImageSrc
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : !activeImageSrc
                  ? 'text-slate-400 opacity-60 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={activeImageSrc ? 'عرض الصورة المعتمدة' : 'لم تُرفق صورة لهذه الخطوة بعد (معروض بالرسم التخطيطي)'}
            >
              {activeImageSrc
                ? `الصورة المعتمدة ${step.imageCircleBadge ? `(حركة ${step.imageCircleBadge})` : ''}`
                : 'الصورة (غير متوفرة)'}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('ILLUSTRATION')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                visualMode === 'ILLUSTRATION' || !activeImageSrc
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الرسم التخطيطي الساتر
            </button>
          </div>
        </div>

        {/* Visual Content: Photo or SVG */}
        {activeImageSrc && visualMode === 'PHOTO' && !imageError ? (
          <div className="w-full bg-slate-950/5 rounded-2xl border border-emerald-900/15 relative overflow-hidden flex flex-col items-center justify-center p-3 group">
            {/* Main Image Container */}
            <div
              className="relative w-full h-72 sm:h-80 flex items-center justify-center cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
              title="انقر لتكبير الصورة وفحص تفاصيل الوضعية"
            >
              <img
                src={activeImageSrc}
                alt={step.imageAlt || step.titleArabic}
                className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md transition-transform duration-200 group-hover:scale-[1.01]"
                onError={() => setImageError(true)}
              />

              {/* Step & Photo Number Badges */}
              <div className="absolute top-2 right-2 bg-emerald-900/90 backdrop-blur-xs text-amber-300 font-bold text-xs px-3 py-1 rounded-full shadow-2xs">
                الخطوة {step.stepNumber} من 14
              </div>

              {step.imageCircleBadge && (
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-emerald-950 border border-emerald-900/20 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-[10px] text-slate-500">رقم الحركة:</span>
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-amber-300 font-mono text-[11px] flex items-center justify-center font-bold">
                    {step.imageCircleBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Floating Control Bar */}
            <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200/60 mt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold px-2 py-1 rounded hover:bg-emerald-50 transition cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>تكبير وفحص تفاصيل الوضعية</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1 text-slate-600 hover:text-emerald-800 font-medium px-2 py-1 rounded hover:bg-slate-100 transition cursor-pointer text-[11px]"
                title="استبدال أو رفع صورة خاصة لهذه الخطوة"
              >
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                <span>استبدال / رفع صورة</span>
              </button>
            </div>
          </div>
        ) : (
          renderPostureIllustration(step.postureType)
        )}
      </div>

      {/* Recitation Highlight Card */}
      <div className="mt-4 bg-emerald-900/5 border border-emerald-800/15 rounded-xl p-4">
        <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-1">
          ما يقال في هذه الخطوة (الذكر المشروع):
        </span>
        <p className="font-quran text-lg sm:text-xl font-bold text-emerald-950 leading-loose">
          {step.recitationArabic}
        </p>
        <p className="text-xs text-slate-500 font-sans mt-1">
          {step.recitationTransliteration}
        </p>
        <p className="text-xs text-emerald-900 bg-white/80 p-2 rounded-lg mt-2 border border-emerald-900/10">
          <strong>المعنى بالدارجة:</strong> {step.recitationDarijaMeaning}
        </p>
      </div>

      {/* Practical Moroccan Darija Step Guide */}
      <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>كيفاش تطبق هاد الخطوة بشكل صحيح:</span>
        </h4>
        <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-slate-800">
          {step.detailedInstruction}
        </p>
      </div>

      {/* Tips for Khushu (حضور القلب) */}
      <div className="mt-3 flex items-start gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 text-xs text-amber-950">
        <Heart className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-900">نصيحة لحضور القلب والخشوع:</span>
          <span>{step.tipsForKhushu}</span>
        </div>
      </div>

      {/* Common Mistakes Warning */}
      {step.commonMistakes && step.commonMistakes.length > 0 && (
        <div className="mt-3 bg-rose-50/70 p-3 rounded-xl border border-rose-200/60 text-xs text-rose-950">
          <div className="flex items-center gap-1.5 font-bold text-rose-900 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>أخطاء شائعة رد بالك منها في هاد الخطوة:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 pr-1">
            {step.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Religious Source & Governance Metadata */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>المصدر الفقهي: {step.source}</span>
        </span>
        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
          مُعتمد ومُدقّق (المذهب المالكي)
        </span>
      </div>

      {/* Step Navigation Controls (Prev / Next & Quick Dots) */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            currentStepIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>الخطوة السابقة</span>
        </button>

        {/* 14 Step Number Quick Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 px-2">
          {PRAYER_14_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`w-6 h-6 rounded-full text-[11px] font-bold transition cursor-pointer ${
                currentStepIndex === idx
                  ? 'bg-emerald-800 text-amber-300 ring-2 ring-emerald-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentStepIndex === PRAYER_14_STEPS.length - 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            currentStepIndex === PRAYER_14_STEPS.length - 1
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
              : 'bg-emerald-800 text-white hover:bg-emerald-700'
          }`}
        >
          <span>الخطوة التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* LIGHTBOX MODAL: FULLSCREEN DETAILED PHOTO VIEW */}
      {isLightboxOpen && activeImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto flex flex-col border border-emerald-900/20 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-emerald-950 text-white rounded-t-3xl">
              <div className="flex items-center gap-2">
                {step.imageCircleBadge && (
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-bold font-mono text-sm flex items-center justify-center">
                    {step.imageCircleBadge}
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {step.titleArabic} (الخطوة {step.stepNumber} من 14)
                  </h3>
                  <p className="text-xs text-emerald-200">{step.titleDarija}</p>
                </div>
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Large Image */}
            <div className="p-4 bg-slate-900 flex items-center justify-center min-h-[350px]">
              <img
                src={activeImageSrc}
                alt={step.titleArabic}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Modal Footer: Instructions & Navigation */}
            <div className="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 rounded-b-3xl">
              <div className="text-right text-xs text-slate-700">
                <p className="font-bold text-emerald-900 mb-0.5">كيفية التطبيق الصحيح:</p>
                <p>{step.shortInstruction}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  السابق
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === PRAYER_14_STEPS.length - 1}
                  className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  التالي
                </button>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL: CUSTOM IMAGE UPLOADER */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-emerald-900/20 shadow-2xl text-right">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-emerald-950 text-base">
                استبدال / رفع صورة الخطوة {step.stepNumber}
              </h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadPreview(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              يمكنك رفع صورة من جهازك لهذه الوضعية ({step.titleArabic}). سيتم حفظها محلياً وعرضها مباشرة في الدليل المرئي.
            </p>

            {/* File Dropzone */}
            <label className="border-2 border-dashed border-emerald-700/30 hover:border-emerald-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-emerald-50/40 hover:bg-emerald-50/70 transition block mb-4">
              <Upload className="w-8 h-8 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">
                اختر صورة من هاتفك أو حاسوبك
              </span>
              <span className="text-[10px] text-slate-500">
                يدعم صيغ JPG, PNG, WebP
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Live Preview */}
            {uploadPreview && (
              <div className="mb-4 bg-slate-100 p-2 rounded-xl text-center">
                <span className="text-[11px] font-bold text-slate-600 block mb-1">
                  معاينة الصورة المحددة:
                </span>
                <img
                  src={uploadPreview}
                  alt="معاينة"
                  className="max-h-48 mx-auto rounded-lg object-contain shadow-xs"
                />
              </div>
            )}

            {uploadSuccessMsg && (
              <div className="mb-4 bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadPreview(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleSaveUpload}
                disabled={!uploadPreview || isUploading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-700 disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
              >
                {isUploading ? 'جارٍ الحفظ...' : 'حفظ وتطبيق الصورة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
