// =====================================================================
// KHATWATI (خطوتي) — DOMAIN TYPES & ARCHITECTURAL DATA MODELS
// =====================================================================

export type ReligiousStatus = 'DRAFT' | 'RELIGIOUS_REVIEW' | 'APPROVED' | 'PUBLISHED';

export interface VerifiedContentItem {
  id: string;
  title?: string;
  titleArabic?: string;
  arabicText?: string;
  explanationDarija: string;
  source: string;
  sourceType: 'QURAN' | 'HADITH_SAHIH' | 'HADITH_HASAN' | 'MALIKI_FIQH' | 'SCHOLARLY_CONSENSUS';
  verificationStatus: ReligiousStatus;
  reviewer?: string;
  reviewDate?: string;
  version: string;
}

// --- PRAYER TIMES & LOCATION ---
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CityLocation {
  id: string;
  nameArabic: string;
  nameFrench: string;
  country: string;
  coords: Coordinates;
  timezone: string;
}

export type CalculationMethodId = 
  | '21' // Moroccan Ministry of Islamic Affairs (وزارة الأوقاف والشؤون الإسلامية المغربية)
  | '3'  // Muslim World League (رابطة العالم الإسلامي)
  | '4'  // Umm Al-Qura University, Makkah (جامعة أم القرى)
  | '5'  // Egyptian General Authority of Survey (الهيئة المصرية العامة للمساحة)
  | '2'  // ISNA (North America)
  | '1'  // University of Islamic Sciences, Karachi
  | '8'  // Gulf Region
  | '12'; // France (UOIF)

export type AsrMethod = 'STANDARD' | 'HANAFI'; // Standard (Maliki/Shafi'i/Hanbali = Shadow length 1x)

export interface PrayerTimes {
  fajr: string;
  sunrise?: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate?: string;
  readableDate?: string;
  source?: string;
  sourceUrl?: string;
  retrievalTimestamp?: string;
  validationStatus?: 'VALID' | 'INVALID';
  isCached?: boolean;
}

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerStatusInfo {
  currentPrayer: PrayerKey | 'sunrise' | 'none';
  currentPrayerName: string;
  nextPrayer: PrayerKey | 'sunrise';
  nextPrayerName: string;
  nextPrayerTime: string;
  timeRemainingMinutes: number;
  timeRemainingFormatted: string;
}

// --- 14-STEP VISUAL PRAYER TUTORIAL ---
export interface PrayerStep extends VerifiedContentItem {
  stepNumber: number;
  titleArabic: string;
  titleDarija: string;
  shortInstruction: string;
  detailedInstruction: string;
  postureType: 
    | 'TAKBEER' 
    | 'QIYAM' 
    | 'RUKU' 
    | 'ITIDAL' 
    | 'SUJOOD_1' 
    | 'JULUS' 
    | 'SUJOOD_2' 
    | 'QIYAM_2' 
    | 'TASHAHHUD_1' 
    | 'QIYAM_3' 
    | 'RUKU_3' 
    | 'TASHAHHUD_2' 
    | 'IBRAHIMIYYA' 
    | 'TASLEEM';
  recitationArabic: string;
  recitationTransliteration: string;
  recitationDarijaMeaning: string;
  audioRecitationText?: string;
  commonMistakes: string[];
  tipsForKhushu: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCircleBadge?: number | string;
  originalFilename?: string;
}

// --- FIVE DAILY PRAYERS SPEC ---
export interface DailyPrayerSpec {
  key: PrayerKey;
  nameArabic: string;
  rakatsCount: number;
  recitationType: 'AUDIBLE' | 'SILENT' | 'MIXED'; // جهرية / سرية
  recitationDescription: string;
  sunnahBefore: number;
  sunnahAfter: number;
  timeDescriptionDarija: string;
  preferredSurahsInfo: string;
}

// --- WUDU & PURITY ---
export interface WuduStep extends VerifiedContentItem {
  stepNumber: number;
  titleArabic: string;
  titleDarija: string;
  instructionDarija: string;
  duaaArabic?: string;
  duaaDarija?: string;
  isFaridha: boolean; // فرض أم سنة في المذهب المالكي
  cautionNote?: string;
}

export interface CommonMistakeItem extends VerifiedContentItem {
  wrongAction: string;
  correctAction: string;
  category: 'PRAYER' | 'WUDU' | 'RECITATION' | 'TIMING';
  evidenceSource: string;
  severity: 'INVALIDATES' | 'DISLIKED' | 'IMPERFECT'; // تبطل الصلاة / مكروه / ينقص الأجر
}

// --- QURAN READER & AUDIO ---
export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface AyahItem {
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  audioUrl?: string;
  translationDarija?: string;
}

export interface Reciter {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  subfolder?: string; // EveryAyah identifier (ayah-by-ayah)
  surahAudioServer?: string; // mp3quran CDN endpoint (surah-by-surah)
  provider: 'EVERYAYAH' | 'MP3QURAN';
  availableSurahs?: number[]; // if specific surahs, or undefined if all 114
  audioFormat: 'AYAH' | 'SURAH';
  riwayah?: string;
}

export interface QuranReadingState {
  lastSurahNumber: number;
  lastAyahNumber: number;
  bookmarks: Array<{ surahNumber: number; ayahNumber: number; surahName: string; date: string }>;
  fontSize: number; // in px
  currentReciterId: string;
  repeatMode: 'OFF' | '1X' | '3X' | '5X' | 'CONTINUOUS';
}

// --- ADHKAR & DUAS ---
export type DhikrCategory = 
  | 'MORNING' 
  | 'EVENING' 
  | 'AFTER_PRAYER' 
  | 'SLEEP' 
  | 'WAKING' 
  | 'GENERAL_DUA';

export interface DhikrItem extends VerifiedContentItem {
  category: DhikrCategory;
  categoryArabic: string;
  countTarget: number;
  fadlArabic: string; // الفضل والثواب
  fadlDarija: string;
  transliteration?: string;
}

// --- KHATWATI PRAYER TRACKER (خطوتي نحو الصلاة) ---
export interface DayPrayerLog {
  date: string; // YYYY-MM-DD
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  notes?: string;
}

// --- LEARNING TRACKS & QUIZZES ---
export type TargetAudience = 'ADULTS' | 'CHILDREN';

export interface QuizQuestion {
  id: string;
  questionArabic: string;
  optionsArabic: string[];
  correctOptionIndex: number;
  explanationDarija: string;
}

export interface LearningLesson extends VerifiedContentItem {
  audience: TargetAudience;
  moduleOrder: number;
  summaryDarija: string;
  contentDarija: string[];
  keyTakeaway: string;
  quiz?: QuizQuestion[];
}

// --- VIDEOS & MEDIA (PHASE 10) ---
export interface VideoItem extends VerifiedContentItem {
  title: string;
  order: number;
  youtubeId?: string; // YouTube video ID or undefined if not provided
  url?: string;
  hasValidUrl: boolean;
  instructor: string;
  category: 'PRAYER' | 'WUDU' | 'MISTAKES' | 'CHILDREN' | 'KHUSHU';
  categoryArabic: string;
  durationApprox?: string;
}

// --- AI ASSISTANT ---
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  actionRoute?: string;
  actionParams?: Record<string, any>;
  actionLabel?: string;
  isFallback?: boolean;
}

// --- DEDICATED ISTIGHFAR (الاستغفار) ---
export interface IstighfarFormula extends VerifiedContentItem {
  arabicText: string;
  transliteration?: string;
  explanationDarija: string;
  fadlArabic: string;
  fadlDarija: string;
  recommendedTarget: number;
}

export interface IstighfarState {
  currentCount: number;
  selectedFormulaId: string;
  targetGoal: number; // 33, 70, 100, 1000, 0 for open
  totalLifetimeCount: number;
  todayCount: number;
  lastDateStr: string;
}

// --- ISLAMIC QUIZZES (الاختبارات الإسلامية) ---
export type QuizCategoryId = 'PRAYER' | 'QURAN' | 'WUDU_PURITY' | 'ADHKAR';

export interface StandaloneQuizQuestion extends VerifiedContentItem {
  categoryId: QuizCategoryId;
  questionArabic: string;
  optionsArabic: string[];
  correctOptionIndex: number;
  explanationDarija: string;
  evidenceHadithOrAyah?: string;
}

export interface QuizCategoryInfo {
  id: QuizCategoryId;
  titleArabic: string;
  titleDarija: string;
  descriptionDarija: string;
  iconName: string;
  questionsCount: number;
  estimatedMinutes: number;
}

export interface QuizAttemptRecord {
  id: string;
  categoryId: QuizCategoryId;
  score: number;
  totalQuestions: number;
  completedAt: string;
  wrongQuestionIds?: string[];
}
