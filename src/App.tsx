import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNavigation } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PrayerTimesWidget } from './components/PrayerTimesWidget';
import { QiblaCompass } from './components/QiblaCompass';
import { VisualPrayerTutorial } from './components/VisualPrayerTutorial';
import { WuduTutorial } from './components/WuduTutorial';
import { QuranReader } from './components/QuranReader';
import { DhikrCounter } from './components/DhikrCounter';
import { PrayerTracker } from './components/PrayerTracker';
import { LearningHub } from './components/LearningHub';
import { VideosGallery } from './components/VideosGallery';
import { AIAssistantModal } from './components/AIAssistantModal';
import { AndroidArchitectureModal } from './components/AndroidArchitectureModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { IstighfarSection } from './components/IstighfarSection';
import { FIVE_DAILY_PRAYERS, COMMON_MISTAKES } from './data/prayerEducationData';
import { storageService } from './services/storageService';
import { QuizCategoryId } from './types';
import {
  Compass,
  BookOpen,
  GraduationCap,
  Sparkles,
  Droplets,
  Heart,
  Shield,
  Film,
  AlertTriangle,
  ChevronLeft,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [prayerSubTab, setPrayerSubTab] = useState<'tutorial' | 'wudu' | 'schedule' | 'mistakes'>('tutorial');
  const [learningView, setLearningView] = useState<'curriculum' | 'quizzes'>('curriculum');
  const [learningQuizCategory, setLearningQuizCategory] = useState<QuizCategoryId | undefined>(undefined);
  const [quranSurah, setQuranSurah] = useState<number | undefined>(undefined);
  const [quranReciter, setQuranReciter] = useState<string | undefined>(undefined);
  const [showQiblaModal, setShowQiblaModal] = useState<boolean>(false);
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  const handleNavigate = (tab: string, subRoute?: string, params?: Record<string, any>) => {
    const cleanTab = tab.replace(/^\//, '');
    setCurrentTab(cleanTab);
    if (cleanTab === 'prayer' && subRoute) {
      if (['tutorial', 'wudu', 'schedule', 'mistakes'].includes(subRoute)) {
        setPrayerSubTab(subRoute as any);
      }
    }
    if (cleanTab === 'learning') {
      if (subRoute === 'quizzes') {
        setLearningView('quizzes');
        if (params?.category) {
          setLearningQuizCategory(params.category as QuizCategoryId);
        }
      } else {
        setLearningView('curriculum');
      }
    }
    if (cleanTab === 'quran') {
      if (params?.surahNumber) {
        setQuranSurah(Number(params.surahNumber));
      }
      if (params?.reciterId) {
        setQuranReciter(String(params.reciterId));
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin Console when Admin Mode is toggled
  if (isAdminMode) {
    return <AdminDashboard onExitAdmin={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-20 md:pb-8">
      {/* Real-time Connectivity Indicator */}
      <OfflineIndicator />

      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAI={() => setShowAIModal(true)}
        onOpenAndroidModal={() => setShowAndroidModal(true)}
        onOpenAdmin={() => setIsAdminMode(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ================================================================= */}
        {/* TAB 1: HOME (الرئيسية) */}
        {/* ================================================================= */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Hero Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-l from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 sm:p-10 shadow-sm overflow-hidden">
              {/* Islamic geometric pattern subtle backdrop */}
              <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-96 h-96">
                  <polygon points="100,10 120,70 190,100 120,130 100,190 80,130 10,100 80,70" fill="none" stroke="#fff" strokeWidth="2" />
                  <polygon points="100,20 120,80 180,100 120,120 100,180 80,120 20,100 80,80" fill="none" stroke="#fff" strokeWidth="1" transform="rotate(45 100 100)" />
                </svg>
              </div>

              <div className="relative z-10 max-w-2xl text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3 border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مشروع صدقة جارية لتعليم الصلاة والقرآن</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold font-ui leading-tight text-white mb-3">
                  خُطْوَتِي نحو الصلاة والقرآن
                </h1>

                <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  منصة إسلامية هادئة وموثوقة لمساعدة المبتدئين والأطفال والكبار على تعلم الوضوء والصلاة خطوة بخطوة بالدارجة المغربية، وتلاوة وحفظ كتاب الله.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentTab('prayer');
                      setPrayerSubTab('tutorial');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <span>ابدأ تعلم الصلاة الآن (14 خطوة)</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('quran')}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer border border-white/20 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>تصفح المصحف الشريف</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Prayer Times Live Status Widget */}
            <PrayerTimesWidget
              onOpenQibla={() => setShowQiblaModal(true)}
              onOpenTracker={() => setCurrentTab('more')}
            />

            {/* Quick Access Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setCurrentTab('prayer');
                  setPrayerSubTab('tutorial');
                }}
                className="p-4 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition text-right cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 font-ui mb-1">دليل الصلاة المرئي</h3>
                <p className="text-[11px] text-slate-500">14 خطوة مصورة بالحركات والأدعية</p>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('prayer');
                  setPrayerSubTab('wudu');
                }}
                className="p-4 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition text-right cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 font-ui mb-1">الوضوء والطهارة</h3>
                <p className="text-[11px] text-slate-500">8 خطوات مع الفرائض والسنن</p>
              </button>

              <button
                onClick={() => handleNavigate('quran')}
                className="p-4 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition text-right cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 font-ui mb-1">المصحف الشريف</h3>
                <p className="text-[11px] text-slate-500">114 سورة مع كبار القراء</p>
              </button>

              <button
                onClick={() => handleNavigate('istighfar')}
                className="p-4 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition text-right cursor-pointer group ring-1 ring-emerald-600/20"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-sm text-emerald-950 font-ui mb-1">الاستغفار</h3>
                <p className="text-[11px] text-slate-500">مسبحة تفاعلية بأصح الصيغ النبوية</p>
              </button>

              <button
                onClick={() => handleNavigate('more')}
                className="p-4 rounded-2xl bg-white border border-emerald-900/10 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition text-right cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 font-ui mb-1">الأذكار والتسبيح</h3>
                <p className="text-[11px] text-slate-500">أذكار الصباح والمساء وحاسبة الذكر</p>
              </button>
            </div>

            {/* Two Learning Pathways Showcase */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-900/10 text-right flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full mb-2 inline-block">
                    مسار الكبار والمبتدئين
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-ui mb-1.5">
                    ابدأ الصلاة من الصفر بكل طمأنينة
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    منهج تعليمي يبدأ من أهمية الصلاة، الطهارة، شروط الصحة، إتقان الركوع والسجود، وصولاً إلى الخشوع التام في كل فرض.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('learning')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700 cursor-pointer"
                >
                  <span>استكشاف مسار الكبار</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-white to-amber-50/40 border border-emerald-900/10 text-right flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full mb-2 inline-block">
                    مسار الأطفال والناشئة
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-ui mb-1.5">
                    الصلاة رحلة جميلة محببة لطفلك
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    دروس مبسطة بصور محتشمة وسور قصيرة واختبارات تفاعلية ممتعة تشجع الطفل على حب بيت الله والوضوء دون ملل.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('learning')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-700 cursor-pointer"
                >
                  <span>استكشاف مسار الأطفال</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Videos Teaser */}
            <div className="p-5 bg-white rounded-2xl border border-emerald-900/10 text-right flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">مكتبة المرئيات المعتمدة</h4>
                  <p className="text-xs text-slate-500">
                    10 شروحات مرئية عملية لكبار العلماء لتعلم صفة الصلاة والأخطاء الشائعة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('more')}
                className="bg-emerald-800 text-white hover:bg-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
              >
                عرض الفيديوهات
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PRAYER & WUDU (الصلاة والوضوء) */}
        {/* ================================================================= */}
        {currentTab === 'prayer' && (
          <div className="space-y-6">
            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
              <button
                onClick={() => setPrayerSubTab('tutorial')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                  prayerSubTab === 'tutorial'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                دليل الصلاة المرئي (14 خطوة)
              </button>
              <button
                onClick={() => setPrayerSubTab('wudu')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                  prayerSubTab === 'wudu'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الوضوء والطهارة الكاملة
              </button>
              <button
                onClick={() => setPrayerSubTab('schedule')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                  prayerSubTab === 'schedule'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الصلوات الخمس المفروضة
              </button>
              <button
                onClick={() => setPrayerSubTab('mistakes')}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                  prayerSubTab === 'mistakes'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                أخطاء شائعة وتصحيحها
              </button>
            </div>

            {/* Sub-tab 1: 14-Step Visual Prayer Tutorial */}
            {prayerSubTab === 'tutorial' && <VisualPrayerTutorial />}

            {/* Sub-tab 2: Wudu & Purity */}
            {prayerSubTab === 'wudu' && <WuduTutorial />}

            {/* Sub-tab 3: The Five Daily Prayers Detailed Specifications */}
            {prayerSubTab === 'schedule' && (
              <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 block">الفريضة اليومية</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
                    الصلوات الخمس المفروضة وكيفية أدائها
                  </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {FIVE_DAILY_PRAYERS.map((p) => (
                    <div
                      key={p.key}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-emerald-950">{p.nameArabic}</h3>
                        <span className="bg-emerald-100 text-emerald-900 font-mono font-bold px-2 py-0.5 rounded">
                          {p.rakatsCount} ركعات
                        </span>
                      </div>
                      <p className="text-slate-700">
                        <strong>صفة القراءة:</strong> {p.recitationDescription}
                      </p>
                      <p className="text-slate-600">
                        <strong>وقتها بالدارجة:</strong> {p.timeDescriptionDarija}
                      </p>
                      <p className="text-slate-600">
                        <strong>السور المستحبة:</strong> {p.preferredSurahsInfo}
                      </p>
                      {p.sunnahBefore > 0 && (
                        <span className="inline-block text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          سنة قبلها: {p.sunnahBefore} ركعات
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-tab 4: Common Mistakes */}
            {prayerSubTab === 'mistakes' && (
              <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right space-y-4">
                <div>
                  <span className="text-xs font-semibold text-rose-700 block">لضمان صحة الصلاة وقبولها</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 font-ui">
                    أخطاء شائعة يقع فيها المصلون
                  </h2>
                </div>

                <div className="space-y-3">
                  {COMMON_MISTAKES.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{m.title}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.severity === 'INVALIDATES'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {m.severity === 'INVALIDATES' ? 'تبطل الصلاة وتوجب الإعادة' : 'مكروه وينقص الأجر'}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 mt-2">
                        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                          <strong className="block text-rose-800 mb-0.5">❌ الفعل الخاطئ:</strong>
                          <p>{m.wrongAction}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
                          <strong className="block text-emerald-800 mb-0.5">✅ التصحيح الشرعي:</strong>
                          <p>{m.correctAction}</p>
                        </div>
                      </div>

                      <p className="text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <strong>الدليل النبوي:</strong> {m.evidenceSource}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: QURAN (المصحف الشريف) */}
        {/* ================================================================= */}
        {currentTab === 'quran' && (
          <QuranReader
            initialSurahNumber={quranSurah}
            initialReciterId={quranReciter}
          />
        )}

        {/* ================================================================= */}
        {/* TAB 4: LEARNING (التعلم) */}
        {/* ================================================================= */}
        {currentTab === 'learning' && (
          <LearningHub
            initialView={learningView}
            initialQuizCategory={learningQuizCategory}
          />
        )}

        {/* ================================================================= */}
        {/* DEDICATED TAB: ISTIGHFAR (الاستغفار والتوبة) */}
        {/* ================================================================= */}
        {currentTab === 'istighfar' && (
          <IstighfarSection onBackToMore={() => handleNavigate('more')} />
        )}

        {/* ================================================================= */}
        {/* TAB 5: MORE (المزيد: أذكار، متابعة، فيديوهات، إعدادات) */}
        {/* ================================================================= */}
        {currentTab === 'more' && (
          <div className="space-y-6">
            {/* Dedicated Istighfar Highlight Banner */}
            <div className="bg-gradient-to-l from-emerald-950 via-emerald-900 to-emerald-800 text-white p-5 sm:p-6 rounded-3xl shadow-sm text-right flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-700/30">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full inline-block">
                  مسبحة نبوية معتمدة
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-ui text-white">
                  قسم الاستغفار والتوبة إلى الله
                </h3>
                <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                  مسبحة إلكترونية تفاعلية سهلة الاستخدام بأصح الصيغ الواردة في السنة النبوية، مع عداد فوري وإمكانية تحديد الأهداف (33، 70، 100 استغفار).
                </p>
              </div>
              <button
                onClick={() => handleNavigate('istighfar')}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer self-start sm:self-center shrink-0 flex items-center gap-1.5 shadow-xs"
              >
                <span>فتح قسم الاستغفار</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Private Prayer Tracker */}
            <PrayerTracker />

            {/* Adhkar and Tasbih Counter */}
            <DhikrCounter />

            {/* Videos Library */}
            <VideosGallery />

            {/* Religious Sources & Transparency Statement */}
            <div className="bg-white rounded-2xl border border-emerald-900/10 p-5 sm:p-6 shadow-xs text-right space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-emerald-950 font-ui">
                  حوكمة المحتوى الديني والمصادر المعتمدة
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                تعتمد منصة «خطوتي» على المذهب المالكي السائد في المغرب كمرجعية فقهية أساسية في صفة الصلاة والوضوء، وتعتمد في الأذكار والأحاديث النبوية على صحيحي البخاري ومسلم وموطأ الإمام مالك ورياض الصالحين. لا يتم توليد أي نصوص قرآنية أو أحاديث نبوية عبر الذكاء الاصطناعي، ويخضع المحتوى للتدقيق والمراجعة.
              </p>
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>الإصدار: 1.0 (مشروع صدقة جارية)</span>
                <span>المذهب الفقهي المعتمد: المالكية</span>
                <span>المصحف: رواية حفص عن عاصم / ورش عن نافع</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Qibla Compass Modal */}
      {showQiblaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md">
            <QiblaCompass onClose={() => setShowQiblaModal(false)} />
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onNavigate={handleNavigate}
      />

      {/* Native Android Architecture Modal */}
      <AndroidArchitectureModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation currentTab={currentTab} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
