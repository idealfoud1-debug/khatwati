import { CityLocation } from '../types';

export interface YabiladiCityConfig extends CityLocation {
  yabiladiId: number;
  slug: string;
  encodedPath: string;
  canonicalUrl: string;
}

export interface YabiladiCachedSchedule {
  cityId: string;
  cityNameArabic: string;
  prayerDate: string; // YYYY-MM-DD
  source: 'Yabiladi';
  sourceUrl: string;
  retrievalTimestamp: string;
  validationStatus: 'VALID' | 'INVALID';
  times: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export interface YabiladiPrayerResponse {
  success: boolean;
  cityId?: string;
  cityNameArabic?: string;
  cityNameFrench?: string;
  country?: string;
  date?: string;
  source?: 'Yabiladi';
  sourceUrl?: string;
  retrievalTimestamp?: string;
  validationStatus?: 'VALID' | 'INVALID';
  times?: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  cached?: boolean;
  error?: string;
  message?: string;
}

// Explicit verified mapping between supported Khatwati cities and Yabiladi sources
export const YABILADI_CITIES: YabiladiCityConfig[] = [
  // --- المدن المغربية (المملكة المغربية الشريفة) ---
  {
    id: 'agadir',
    nameArabic: 'أكادير',
    nameFrench: 'Agadir',
    country: 'المغرب',
    coords: { latitude: 30.4278, longitude: -9.5981 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 66,
    slug: 'اكادير',
    encodedPath: '/prieres/details/66/%D8%A7%D9%83%D8%A7%D8%AF%D9%8A%D8%B1.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/66/اكادير.html',
  },
  {
    id: 'casablanca',
    nameArabic: 'الدار البيضاء',
    nameFrench: 'Casablanca',
    country: 'المغرب',
    coords: { latitude: 33.5731, longitude: -7.5898 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 71,
    slug: 'الدار-البيضاء',
    encodedPath: '/prieres/details/71/%D8%A7%D9%84%D8%AF%D8%A7%D8%B1-%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D8%A1.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/71/الدار-البيضاء.html',
  },
  {
    id: 'rabat',
    nameArabic: 'الرباط',
    nameFrench: 'Rabat',
    country: 'المغرب',
    coords: { latitude: 34.0209, longitude: -6.8416 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 95,
    slug: 'الرباط',
    encodedPath: '/prieres/details/95/%D8%A7%D9%84%D8%B1%D8%A8%D8%A7%D8%B7.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/95/الرباط.html',
  },
  {
    id: 'fes',
    nameArabic: 'فاس',
    nameFrench: 'Fes',
    country: 'المغرب',
    coords: { latitude: 34.0331, longitude: -5.0003 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 78,
    slug: 'فاس',
    encodedPath: '/prieres/details/78/%D9%81%D8%A7%D8%B3.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/78/فاس.html',
  },
  {
    id: 'marrakech',
    nameArabic: 'مراكش',
    nameFrench: 'Marrakech',
    country: 'المغرب',
    coords: { latitude: 31.6295, longitude: -7.9811 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 88,
    slug: 'مراكش',
    encodedPath: '/prieres/details/88/%D9%85%D8%B1%D8%A7%D9%83%D8%B4.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/88/مراكش.html',
  },
  {
    id: 'tangier',
    nameArabic: 'طنجة',
    nameFrench: 'Tangier',
    country: 'المغرب',
    coords: { latitude: 35.7595, longitude: -5.8340 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 101,
    slug: 'طنجة',
    encodedPath: '/prieres/details/101/%D8%B7%D9%86%D8%AC%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/101/طنجة.html',
  },
  {
    id: 'oujda',
    nameArabic: 'وجدة',
    nameFrench: 'Oujda',
    country: 'المغرب',
    coords: { latitude: 34.6814, longitude: -1.9086 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 93,
    slug: 'وجدة',
    encodedPath: '/prieres/details/93/%D9%88%D8%AC%D8%AF%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/93/وجدة.html',
  },
  {
    id: 'meknes',
    nameArabic: 'مكناس',
    nameFrench: 'Meknes',
    country: 'المغرب',
    coords: { latitude: 33.8935, longitude: -5.5473 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 89,
    slug: 'مكناس',
    encodedPath: '/prieres/details/89/%D9%85%D9%83%D9%86%D8%A7%D8%B3.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/89/مكناس.html',
  },
  {
    id: 'tetouan',
    nameArabic: 'تطوان',
    nameFrench: 'Tetouan',
    country: 'المغرب',
    coords: { latitude: 35.5889, longitude: -5.3626 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 100,
    slug: 'تطوان',
    encodedPath: '/prieres/details/100/%D8%AA%D8%B7%D9%88%D8%A7%D9%86.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/100/تطوان.html',
  },
  {
    id: 'laayoune',
    nameArabic: 'العيون',
    nameFrench: 'Laayoune',
    country: 'المغرب',
    coords: { latitude: 27.1536, longitude: -13.2033 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 85,
    slug: 'لعيون',
    encodedPath: '/prieres/details/85/%D9%84%D8%B9%D9%8A%D9%88%D9%86.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/85/لعيون.html',
  },
  {
    id: 'kenitra',
    nameArabic: 'القنيطرة',
    nameFrench: 'Kenitra',
    country: 'المغرب',
    coords: { latitude: 34.2610, longitude: -6.5802 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 81,
    slug: 'القنيطرة',
    encodedPath: '/prieres/details/81/%D8%A7%D9%84%D9%82%D9%86%D9%8A%D8%B7%D8%B1%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/81/القنيطرة.html',
  },
  {
    id: 'safi',
    nameArabic: 'آسفي',
    nameFrench: 'Safi',
    country: 'المغرب',
    coords: { latitude: 32.2994, longitude: -9.2372 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 96,
    slug: 'آسفي',
    encodedPath: '/prieres/details/96/%D8%A2%D8%B3%D9%81%D9%8A.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/96/آسفي.html',
  },
  {
    id: 'el_jadida',
    nameArabic: 'الجديدة',
    nameFrench: 'El Jadida',
    country: 'المغرب',
    coords: { latitude: 33.2316, longitude: -8.5007 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 74,
    slug: 'الجديدة',
    encodedPath: '/prieres/details/74/%D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/74/الجديدة.html',
  },
  {
    id: 'beni_mellal',
    nameArabic: 'بني ملال',
    nameFrench: 'Beni Mellal',
    country: 'المغرب',
    coords: { latitude: 32.3373, longitude: -6.3498 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 68,
    slug: 'بني-ملال',
    encodedPath: '/prieres/details/68/%D8%A8%D9%86%D9%8A-%D9%85%D9%84%D8%A7%D9%84.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/68/بني-ملال.html',
  },
  {
    id: 'nador',
    nameArabic: 'الناظور',
    nameFrench: 'Nador',
    country: 'المغرب',
    coords: { latitude: 35.1681, longitude: -2.9335 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 91,
    slug: 'الناظور',
    encodedPath: '/prieres/details/91/%D8%A7%D9%84%D9%86%D8%A7%D8%B8%D9%88%D8%B1.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/91/الناظور.html',
  },
  {
    id: 'taza',
    nameArabic: 'تازة',
    nameFrench: 'Taza',
    country: 'المغرب',
    coords: { latitude: 34.2130, longitude: -4.0100 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 105,
    slug: 'تازة',
    encodedPath: '/prieres/details/105/%D8%AA%D8%A7%D8%B2%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/105/تازة.html',
  },
  {
    id: 'tiznit',
    nameArabic: 'تزنيت',
    nameFrench: 'Tiznit',
    country: 'المغرب',
    coords: { latitude: 29.6974, longitude: -9.7316 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 106,
    slug: 'تزنيت',
    encodedPath: '/prieres/details/106/%D8%AA%D8%B2%D9%86%D9%8A%D8%AA.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/106/تزنيت.html',
  },
  {
    id: 'taroudant',
    nameArabic: 'تارودانت',
    nameFrench: 'Taroudant',
    country: 'المغرب',
    coords: { latitude: 30.4703, longitude: -8.8770 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 103,
    slug: 'تارودانت',
    encodedPath: '/prieres/details/103/%D8%AA%D8%A7%D8%B1%D9%88%D8%AF%D8%A7%D9%86%D8%AA.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/103/تارودانت.html',
  },
  {
    id: 'dakhla',
    nameArabic: 'الداخلة',
    nameFrench: 'Dakhla',
    country: 'المغرب',
    coords: { latitude: 23.6848, longitude: -15.9570 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 73,
    slug: 'الداخلة',
    encodedPath: '/prieres/details/73/%D8%A7%D9%84%D8%AF%D8%A7%D8%AE%D9%84%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/73/الداخلة.html',
  },
  {
    id: 'essaouira',
    nameArabic: 'الصويرة',
    nameFrench: 'Essaouira',
    country: 'المغرب',
    coords: { latitude: 31.5085, longitude: -9.7595 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 76,
    slug: 'الصويرة',
    encodedPath: '/prieres/details/76/%D8%A7%D9%84%D8%B5%D9%88%D9%8A%D8%B1%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/76/الصويرة.html',
  },
  {
    id: 'chefchaouen',
    nameArabic: 'شفشاون',
    nameFrench: 'Chefchaouen',
    country: 'المغرب',
    coords: { latitude: 35.1688, longitude: -5.2636 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 72,
    slug: 'شفشاون',
    encodedPath: '/prieres/details/72/%D8%B4%D9%81%D8%B4%D8%A7%D9%88%D9%86.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/72/شفشاون.html',
  },
  {
    id: 'alhoceima',
    nameArabic: 'الحسيمة',
    nameFrench: 'Al Hoceima',
    country: 'المغرب',
    coords: { latitude: 35.2472, longitude: -3.9322 },
    timezone: 'Africa/Casablanca',
    yabiladiId: 79,
    slug: 'الحسيمة',
    encodedPath: '/prieres/details/79/%D8%A7%D9%84%D8%AD%D8%B3%D9%8A%D9%85%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/79/الحسيمة.html',
  },

  // --- عواصم ومدن إسلامية وعالمية معتمدة عبر Yabiladi ---
  {
    id: 'makkah',
    nameArabic: 'مكة المكرمة',
    nameFrench: 'Makkah',
    country: 'السعودية',
    coords: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh',
    yabiladiId: 13,
    slug: 'مكة-المكرمة',
    encodedPath: '/prieres/details/13/%D9%85%D9%83%D8%A9-%D8%A7%D9%84%D9%85%D9%83%D8%B1%D9%85%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/13/مكة-المكرمة.html',
  },
  {
    id: 'madinah',
    nameArabic: 'المدينة المنورة',
    nameFrench: 'Madinah',
    country: 'السعودية',
    coords: { latitude: 24.4672, longitude: 39.6111 },
    timezone: 'Asia/Riyadh',
    yabiladiId: 12,
    slug: 'المدينة-المنورة',
    encodedPath: '/prieres/details/12/%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9-%D8%A7%D9%84%D9%85%D9%86%D9%88%D8%B1%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/12/المدينة-المنورة.html',
  },
  {
    id: 'cairo',
    nameArabic: 'القاهرة',
    nameFrench: 'Cairo',
    country: 'مصر',
    coords: { latitude: 30.0444, longitude: 31.2357 },
    timezone: 'Africa/Cairo',
    yabiladiId: 42,
    slug: 'القاهرة',
    encodedPath: '/prieres/details/42/%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/42/القاهرة.html',
  },
  {
    id: 'paris',
    nameArabic: 'باريس',
    nameFrench: 'Paris',
    country: 'فرنسا',
    coords: { latitude: 48.8566, longitude: 2.3522 },
    timezone: 'Europe/Paris',
    yabiladiId: 158,
    slug: 'باريس',
    encodedPath: '/prieres/details/158/%D8%A8%D8%A7%D8%B1%D9%8A%D8%B3.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/158/باريس.html',
  },
  {
    id: 'london',
    nameArabic: 'لندن',
    nameFrench: 'London',
    country: 'بريطانيا',
    coords: { latitude: 51.5074, longitude: -0.1278 },
    timezone: 'Europe/London',
    yabiladiId: 7,
    slug: 'لندن',
    encodedPath: '/prieres/details/7/%D9%84%D9%86%D8%AF%D9%86.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/7/لندن.html',
  },
  {
    id: 'madrid',
    nameArabic: 'مدريد',
    nameFrench: 'Madrid',
    country: 'إسبانيا',
    coords: { latitude: 40.4168, longitude: -3.7038 },
    timezone: 'Europe/Madrid',
    yabiladiId: 203,
    slug: 'مدريد',
    encodedPath: '/prieres/details/203/%D9%85%D8%AF%D8%B1%D9%8A%D8%AF.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/203/مدريد.html',
  },
  {
    id: 'montreal',
    nameArabic: 'مونتريال',
    nameFrench: 'Montreal',
    country: 'كندا',
    coords: { latitude: 45.5017, longitude: -73.5673 },
    timezone: 'America/Toronto',
    yabiladiId: 51,
    slug: 'مونتريال',
    encodedPath: '/prieres/details/51/%D9%85%D9%88%D9%86%D8%AA%D8%B1%D9%8A%D8%A7%D9%84.html',
    canonicalUrl: 'https://ar.yabiladi.com/prieres/details/51/مونتريال.html',
  },
];

export function findYabiladiCity(cityId: string): YabiladiCityConfig | undefined {
  return YABILADI_CITIES.find(
    (c) => c.id.toLowerCase() === cityId.toLowerCase()
  );
}

export function isCitySupportedByYabiladi(cityId: string): boolean {
  return !!findYabiladiCity(cityId);
}
