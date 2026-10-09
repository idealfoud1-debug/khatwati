import { CityLocation, PrayerTimes, PrayerStatusInfo, PrayerKey } from '../types';
import { YABILADI_CITIES, findYabiladiCity, YabiladiCachedSchedule } from '../data/yabiladiData';

// =========================================================================
// MOROCCAN & GLOBAL APPROVED CITIES (VERIFIED YABILADI MAPPING)
// =========================================================================
export const PRESET_CITIES: CityLocation[] = YABILADI_CITIES;

// Reference default source URL for Yabiladi
export const YABILADI_SOURCE_HOMEPAGE = 'https://ar.yabiladi.com/prieres/';

export const CALCULATION_METHODS = [
  { id: 'yabiladi', nameArabic: 'مواقيت يابلادي الرسمية (Yabiladi — المملكة المغربية)', params: { fajrAngle: 19, ishaAngle: 17 } },
];

// =========================================================================
// MATHEMATICAL QIBLA BEARING CALCULATION
// Great-circle bearing from user coordinates to Kaaba (21.4225° N, 39.8262° E)
// =========================================================================
const KAABA_COORDS = { lat: 21.4225, lon: 39.8262 };

export function calculateQiblaBearing(userLat: number, userLon: number): number {
  const phi1 = (userLat * Math.PI) / 180;
  const phi2 = (KAABA_COORDS.lat * Math.PI) / 180;
  const deltaLambda = ((KAABA_COORDS.lon - userLon) * Math.PI) / 180;

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  const qiblaRad = Math.atan2(y, x);
  const qiblaDeg = (qiblaRad * 180) / Math.PI;
  return (qiblaDeg + 360) % 360;
}

// =========================================================================
// VALIDATION HELPERS (STRICT COMPLIANCE WITH USER SECTION 5)
// =========================================================================
export function validateTimesFormat(times: { fajr?: string; dhuhr?: string; asr?: string; maghrib?: string; isha?: string }): boolean {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  return !!(
    times.fajr && timeRegex.test(times.fajr) &&
    times.dhuhr && timeRegex.test(times.dhuhr) &&
    times.asr && timeRegex.test(times.asr) &&
    times.maghrib && timeRegex.test(times.maghrib) &&
    times.isha && timeRegex.test(times.isha)
  );
}

export function validateChronology(times: { fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string }): boolean {
  const toM = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const f = toM(times.fajr);
  const d = toM(times.dhuhr);
  const a = toM(times.asr);
  const m = toM(times.maghrib);
  const i = toM(times.isha);
  return f < d && d < a && a < m && m < i;
}

// =========================================================================
// FETCH PRAYER TIMES VIA YABILADI (ONLINE WITH ROBUST OFFLINE CACHE)
// =========================================================================
export interface PrayerTimesResult {
  times: PrayerTimes | null;
  isOfflineFallback: boolean;
  sourceUrl: string;
  sourceAttribution: string;
  errorMessage?: string;
}

export async function getPrayerTimesForLocation(
  city: CityLocation,
  _methodId: string = 'yabiladi',
  date: Date = new Date()
): Promise<PrayerTimesResult> {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateKey = `${yyyy}-${mm}-${dd}`;
  const cacheKey = `khatwati_yabiladi_cache_${city.id}_${dateKey}`;

  const cityConfig = findYabiladiCity(city.id);
  const sourceUrl = cityConfig?.canonicalUrl || `${YABILADI_SOURCE_HOMEPAGE}`;
  const sourceAttribution = 'Yabiladi';

  // 1. If navigator is online, try fetching fresh verified data from backend proxy
  if (typeof navigator === 'undefined' || navigator.onLine) {
    try {
      const apiUrl = `/api/prayer-times/yabiladi?cityId=${encodeURIComponent(city.id)}&date=${dateKey}`;
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.times && validateTimesFormat(data.times) && validateChronology(data.times)) {
          const prayerResult: PrayerTimes = {
            fajr: data.times.fajr,
            dhuhr: data.times.dhuhr,
            asr: data.times.asr,
            maghrib: data.times.maghrib,
            isha: data.times.isha,
            date: dateKey,
            readableDate: date.toLocaleDateString('ar-MA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            source: 'Yabiladi',
            sourceUrl: data.sourceUrl || sourceUrl,
            retrievalTimestamp: data.retrievalTimestamp || new Date().toISOString(),
            validationStatus: 'VALID',
            isCached: false,
          };

          // Store in persistent local cache with full metadata (Section 7)
          try {
            const cachePayload: YabiladiCachedSchedule = {
              cityId: city.id,
              cityNameArabic: city.nameArabic,
              prayerDate: dateKey,
              source: 'Yabiladi',
              sourceUrl: prayerResult.sourceUrl!,
              retrievalTimestamp: prayerResult.retrievalTimestamp!,
              validationStatus: 'VALID',
              times: {
                fajr: prayerResult.fajr,
                dhuhr: prayerResult.dhuhr,
                asr: prayerResult.asr,
                maghrib: prayerResult.maghrib,
                isha: prayerResult.isha,
              },
            };
            localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
          } catch (storageErr) {
            console.warn('Could not save to localStorage:', storageErr);
          }

          return {
            times: prayerResult,
            isOfflineFallback: false,
            sourceUrl: prayerResult.sourceUrl!,
            sourceAttribution,
          };
        }
      }
    } catch (networkErr) {
      console.warn('Network request to Yabiladi API proxy failed, checking offline cache...', networkErr);
    }
  }

  // 2. Offline behavior (Section 7)
  // Retrieve previously cached valid schedule strictly matching city and requested date
  try {
    const cachedStr = localStorage.getItem(cacheKey);
    if (cachedStr) {
      const parsed: YabiladiCachedSchedule = JSON.parse(cachedStr);
      if (
        parsed &&
        parsed.cityId === city.id &&
        parsed.prayerDate === dateKey &&
        parsed.validationStatus === 'VALID' &&
        validateTimesFormat(parsed.times) &&
        validateChronology(parsed.times)
      ) {
        const cachedTimes: PrayerTimes = {
          fajr: parsed.times.fajr,
          dhuhr: parsed.times.dhuhr,
          asr: parsed.times.asr,
          maghrib: parsed.times.maghrib,
          isha: parsed.times.isha,
          date: parsed.prayerDate,
          readableDate: date.toLocaleDateString('ar-MA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          source: 'Yabiladi',
          sourceUrl: parsed.sourceUrl || sourceUrl,
          retrievalTimestamp: parsed.retrievalTimestamp,
          validationStatus: 'VALID',
          isCached: true,
        };

        return {
          times: cachedTimes,
          isOfflineFallback: true,
          sourceUrl: cachedTimes.sourceUrl!,
          sourceAttribution,
        };
      }
    }
  } catch (cacheErr) {
    console.warn('Error reading offline cache:', cacheErr);
  }

  // 3. If offline and no matching valid cache exists for this date, inform the user cleanly (Section 5 & 7)
  return {
    times: null,
    isOfflineFallback: true,
    sourceUrl,
    sourceAttribution,
    errorMessage: `لا توجد بيانات مخزنة مسبقاً لمواقيت الصلاة لمدينة «${city.nameArabic}» بتاريخ اليوم (${dateKey}). يرجى الاتصال بالإنترنت لتحميل مواقيت Yabiladi المعتمدة.`,
  };
}

// =========================================================================
// CURRENT & NEXT PRAYER STATUS CALCULATION
// =========================================================================
export function getPrayerStatus(times: PrayerTimes | null, currentTime: Date = new Date()): PrayerStatusInfo | null {
  if (!times || !times.fajr || !times.dhuhr || !times.asr || !times.maghrib || !times.isha) {
    return null;
  }

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const toMinutes = (timeStr?: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const prayers = [
    { key: 'fajr' as PrayerKey, name: 'الفجر', minutes: toMinutes(times.fajr), time: times.fajr },
    ...(times.sunrise ? [{ key: 'sunrise' as any, name: 'الشروق', minutes: toMinutes(times.sunrise), time: times.sunrise }] : []),
    { key: 'dhuhr' as PrayerKey, name: 'الظهر', minutes: toMinutes(times.dhuhr), time: times.dhuhr },
    { key: 'asr' as PrayerKey, name: 'العصر', minutes: toMinutes(times.asr), time: times.asr },
    { key: 'maghrib' as PrayerKey, name: 'المغرب', minutes: toMinutes(times.maghrib), time: times.maghrib },
    { key: 'isha' as PrayerKey, name: 'العشاء', minutes: toMinutes(times.isha), time: times.isha },
  ];

  let currentP = prayers[prayers.length - 1]; // defaults to Isha
  let nextP = prayers[0]; // defaults to Fajr next day
  let diffMinutes = 0;

  if (currentMinutes < prayers[0].minutes) {
    // Before Fajr
    currentP = prayers[prayers.length - 1];
    nextP = prayers[0];
    diffMinutes = prayers[0].minutes - currentMinutes;
  } else if (currentMinutes >= prayers[prayers.length - 1].minutes) {
    // After Isha
    currentP = prayers[prayers.length - 1];
    nextP = prayers[0];
    diffMinutes = (24 * 60 - currentMinutes) + prayers[0].minutes;
  } else {
    for (let i = 0; i < prayers.length - 1; i++) {
      if (currentMinutes >= prayers[i].minutes && currentMinutes < prayers[i + 1].minutes) {
        currentP = prayers[i];
        nextP = prayers[i + 1];
        diffMinutes = prayers[i + 1].minutes - currentMinutes;
        break;
      }
    }
  }

  const hoursLeft = Math.floor(diffMinutes / 60);
  const minsLeft = diffMinutes % 60;
  const timeRemainingFormatted = hoursLeft > 0 ? `${hoursLeft} س و ${minsLeft} د` : `${minsLeft} دقيقة`;

  return {
    currentPrayer: currentP.key,
    currentPrayerName: currentP.name,
    nextPrayer: nextP.key,
    nextPrayerName: nextP.name,
    nextPrayerTime: nextP.time,
    timeRemainingMinutes: diffMinutes,
    timeRemainingFormatted,
  };
}
