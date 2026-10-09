import React, { useState, useEffect } from 'react';
import {
  CityLocation,
  PrayerTimes,
  PrayerStatusInfo,
  PrayerKey,
} from '../types';
import {
  PRESET_CITIES,
  CALCULATION_METHODS,
  getPrayerTimesForLocation,
  getPrayerStatus,
} from '../services/prayerTimesService';
import { findYabiladiCity } from '../data/yabiladiData';
import { storageService } from '../services/storageService';
import {
  Clock,
  MapPin,
  Compass,
  Bell,
  Settings,
  ChevronDown,
  Check,
  Sun,
  Moon,
  CloudSun,
  ExternalLink,
  WifiOff,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface PrayerTimesWidgetProps {
  onOpenQibla?: () => void;
  onOpenTracker?: () => void;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  onOpenQibla,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(PRESET_CITIES[0]);
  const [methodId, setMethodId] = useState<string>('yabiladi');
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [status, setStatus] = useState<PrayerStatusInfo | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string>('https://ar.yabiladi.com/prieres/');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [notificationOffset, setNotificationOffset] = useState<number>(10);

  // Load initial settings
  useEffect(() => {
    const settings = storageService.getSettings();
    const city = PRESET_CITIES.find((c) => c.id === settings.selectedCityId) || PRESET_CITIES[0];
    setSelectedCity(city);
    setMethodId(settings.calculationMethod || 'yabiladi');

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsAllowed(true);
    }
  }, []);

  // Fetch prayer times for selected city from Yabiladi
  const loadTimes = async (cityToFetch = selectedCity) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await getPrayerTimesForLocation(cityToFetch, methodId, new Date());
      setTimes(result.times);
      setIsOffline(result.isOfflineFallback);
      setSourceUrl(result.sourceUrl);
      if (result.errorMessage) {
        setErrorMessage(result.errorMessage);
      }
      if (result.times) {
        setStatus(getPrayerStatus(result.times, new Date()));
      } else {
        setStatus(null);
      }
    } catch (err: any) {
      console.warn('Error loading prayer times:', err);
      setErrorMessage('تعذر جلب مواقيت الصلاة من المصدر.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTimes(selectedCity);

    // Refresh status countdown every 30 seconds
    const interval = setInterval(() => {
      if (times) {
        setStatus(getPrayerStatus(times, new Date()));
      }
    }, 30000);

    // Listen for online recovery to re-validate and refresh cache
    const handleOnline = () => {
      loadTimes(selectedCity);
    };
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
    };
  }, [selectedCity, methodId]);

  const handleCityChange = (cityId: string) => {
    const city = PRESET_CITIES.find((c) => c.id === cityId);
    if (city) {
      setSelectedCity(city);
      storageService.saveSettings({ selectedCityId: cityId });
    }
  };

  const handleMethodChange = (id: string) => {
    setMethodId(id);
    storageService.saveSettings({ calculationMethod: id });
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('المتصفح الحالي لا يدعم التنبيهات المباشرة.');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsAllowed(true);
        new Notification('منصة خطوتي — تم تفعيل التنبيهات', {
          body: `سيتم تذكيرك قبل أوقات الصلاة المعتمدة بـ ${notificationOffset} دقائق إن شاء الله.`,
          icon: '/icon.svg',
        });
      }
    } catch (e) {
      console.warn('Notification permission error', e);
    }
  };

  const prayerIcons: Record<string, React.ReactNode> = {
    fajr: <Moon className="w-4 h-4 text-indigo-400" />,
    sunrise: <CloudSun className="w-4 h-4 text-amber-500" />,
    dhuhr: <Sun className="w-4 h-4 text-amber-400" />,
    asr: <Sun className="w-4 h-4 text-orange-400" />,
    maghrib: <CloudSun className="w-4 h-4 text-rose-400" />,
    isha: <Moon className="w-4 h-4 text-indigo-500" />,
  };

  const moroccanCities = PRESET_CITIES.filter((c) => c.country === 'المغرب');
  const globalCities = PRESET_CITIES.filter((c) => c.country !== 'المغرب');
  const currentCityConfig = findYabiladiCity(selectedCity.id);
  const canonicalYabiladiUrl = currentCityConfig?.canonicalUrl || sourceUrl;

  return (
    <section className="bg-white rounded-2xl border border-emerald-900/10 p-5 shadow-xs transition-all">
      {/* Top Header: City & Quick Actions */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <div className="relative">
            <select
              aria-label="اختر المدينة"
              value={selectedCity.id}
              onChange={(e) => handleCityChange(e.target.value)}
              className="appearance-none bg-transparent pr-1 pl-6 text-sm font-bold text-slate-800 cursor-pointer focus:outline-none"
            >
              <optgroup label="المملكة المغربية الشريفة (مواقيت Yabiladi)">
                {moroccanCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameArabic} ({c.nameFrench})
                  </option>
                ))}
              </optgroup>
              <optgroup label="عواصم ومدن عالمية معتمدة">
                {globalCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameArabic} — {c.country}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {isOffline && times && (
            <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <WifiOff className="w-2.5 h-2.5 text-amber-600" />
              <span>مخزنة مسبقاً (بدون إنترنت)</span>
            </span>
          )}

          {isLoading && (
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenQibla && (
            <button
              onClick={onOpenQibla}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
              title="بوصلة اتجاه القبلة"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>القبلة</span>
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="إعدادات المصدر والتنبيهات"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel Accordion */}
      {showSettings && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-3 border border-slate-200/60 animate-in fade-in">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">مصدر مواقيت الصلاة المعتمد:</label>
            <div className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">
                شبكة يابلادي — مواقيت وزارة الأوقاف المغربية (Yabiladi)
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                مرجع معتمد
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              يتم جلب مواقيت الصلاة مباشرة ومطابقتها وفق الصفحة المخصصة للمدينة على موقع Yabiladi.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div>
              <span className="font-semibold text-slate-700 block">تنبيهات دخول وقت الصلاة</span>
              <span className="text-[11px] text-slate-500">تذكيرك في المتصفح قبل الأذان</span>
            </div>
            {notificationsAllowed ? (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                <Check className="w-3.5 h-3.5" /> مفعلة
              </span>
            ) : (
              <button
                onClick={handleRequestNotifications}
                className="bg-emerald-800 text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
              >
                تفعيل
              </button>
            )}
          </div>

          {notificationsAllowed && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">وقت التنبيه قبل الأذان:</label>
              <div className="flex gap-2">
                {[5, 10, 15, 30].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setNotificationOffset(mins)}
                    className={`px-2 py-1 rounded text-xs cursor-pointer ${
                      notificationOffset === mins
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mins} دقائق
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error / Offline Alert */}
      {errorMessage && !times && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-[11px] text-amber-700 mt-1">
              تأكد من الاتصال بالشبكة لتحميل أحدث جدول مواقيت معتمد لـ {selectedCity.nameArabic}.
            </p>
          </div>
          <button
            onClick={() => loadTimes(selectedCity)}
            className="px-2 py-1 bg-amber-200/80 hover:bg-amber-300 rounded text-[11px] font-semibold text-amber-900 cursor-pointer transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Current / Next Prayer Highlight Card */}
      {status && times && (
        <div className="mt-4 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="text-emerald-200 text-xs block mb-0.5">الصلاة القادمة</span>
              <h3 className="text-2xl font-bold font-ui text-white">{status.nextPrayerName}</h3>
              <p className="text-amber-300 font-bold text-lg mt-0.5">{status.nextPrayerTime}</p>
            </div>

            <div className="text-left">
              <span className="text-emerald-200 text-xs block mb-0.5">الوقت المتبقي</span>
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="font-mono text-sm font-semibold tabular-nums text-white">
                  {status.timeRemainingFormatted}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-700/50 flex items-center justify-between text-[11px] text-emerald-200">
            <span>{selectedCity.nameArabic} ({selectedCity.nameFrench})</span>
            <span>{times.readableDate || times.date}</span>
          </div>
        </div>
      )}

      {/* The Five Daily Obligatory Prayers Grid (Section 2) */}
      {times && (
        <div className="mt-4 grid grid-cols-5 gap-1.5 text-center">
          {[
            { key: 'fajr', name: 'الفجر', time: times.fajr },
            { key: 'dhuhr', name: 'الظهر', time: times.dhuhr },
            { key: 'asr', name: 'العصر', time: times.asr },
            { key: 'maghrib', name: 'المغرب', time: times.maghrib },
            { key: 'isha', name: 'العشاء', time: times.isha },
          ].map((item) => {
            const isNext = status?.nextPrayer === item.key;
            return (
              <div
                key={item.key}
                className={`p-2 rounded-xl transition-all ${
                  isNext
                    ? 'bg-emerald-100/70 border border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex justify-center mb-1">{prayerIcons[item.key]}</div>
                <span className="block text-[11px] font-medium leading-tight">{item.name}</span>
                <span className="block text-xs font-mono font-semibold tabular-nums mt-0.5">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Sunrise displayed separately if provided (Section 2) */}
      {times?.sunrise && (
        <div className="mt-2.5 flex items-center justify-between px-3 py-1.5 bg-amber-50/60 border border-amber-200/50 rounded-lg text-xs text-amber-900">
          <div className="flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium">وقت الشروق:</span>
          </div>
          <span className="font-mono font-bold">{times.sunrise}</span>
        </div>
      )}

      {/* Discreet Source Attribution (Section 6) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>مصدر مواقيت الصلاة:</span>
          <a
            href={canonicalYabiladiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 transition"
            title={`فتح صفحة مواقيت ${selectedCity.nameArabic} على موقع Yabiladi`}
          >
            <span>Yabiladi</span>
            <ExternalLink className="w-3 h-3 text-emerald-700" />
          </a>
        </div>

        {times?.isCached && (
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
            بيانات محفوظة مؤقتاً
          </span>
        )}
      </div>
    </section>
  );
};
