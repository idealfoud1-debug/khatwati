import { DayPrayerLog, QuranReadingState, PrayerKey } from '../types';

const STORAGE_KEYS = {
  PRAYER_LOGS: 'khatwati_prayer_logs_v1',
  QURAN_STATE: 'khatwati_quran_state_v1',
  USER_SETTINGS: 'khatwati_user_settings_v1',
  CACHED_TIMINGS: 'khatwati_cached_prayer_timings_v1',
  QUIZ_PROGRESS: 'khatwati_quiz_progress_v1',
  DHIKR_COUNTS: 'khatwati_dhikr_counts_v1',
};

export interface UserSettings {
  selectedCityId: string;
  calculationMethod: string;
  asrMethod: 'STANDARD' | 'HANAFI';
  notificationOffsets: number[]; // e.g. [0, 10]
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

const DEFAULT_SETTINGS: UserSettings = {
  selectedCityId: 'casablanca',
  calculationMethod: '21', // Moroccan Ministry
  asrMethod: 'STANDARD',
  notificationOffsets: [0],
  notificationsEnabled: false,
  theme: 'light',
};

const DEFAULT_QURAN_STATE: QuranReadingState = {
  lastSurahNumber: 1,
  lastAyahNumber: 1,
  bookmarks: [],
  fontSize: 26,
  currentReciterId: 'alafasy',
  repeatMode: 'OFF',
};

// Safe storage wrapper
export const storageService = {
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
    return updated;
  },

  getPrayerLogs(): Record<string, DayPrayerLog> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRAYER_LOGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getTodayPrayerLog(dateStr: string): DayPrayerLog {
    const logs = this.getPrayerLogs();
    if (logs[dateStr]) {
      return logs[dateStr];
    }
    return {
      date: dateStr,
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
  },

  togglePrayerCompleted(dateStr: string, prayer: PrayerKey): DayPrayerLog {
    const logs = this.getPrayerLogs();
    const current = logs[dateStr] || {
      date: dateStr,
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
    current[prayer] = !current[prayer];
    logs[dateStr] = current;
    try {
      localStorage.setItem(STORAGE_KEYS.PRAYER_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save prayer log:', e);
    }
    return current;
  },

  getQuranState(): QuranReadingState {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QURAN_STATE);
      return data ? { ...DEFAULT_QURAN_STATE, ...JSON.parse(data) } : DEFAULT_QURAN_STATE;
    } catch {
      return DEFAULT_QURAN_STATE;
    }
  },

  saveQuranState(state: Partial<QuranReadingState>): QuranReadingState {
    const current = this.getQuranState();
    const updated = { ...current, ...state };
    try {
      localStorage.setItem(STORAGE_KEYS.QURAN_STATE, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save quran state:', e);
    }
    return updated;
  },

  toggleQuranBookmark(surahNumber: number, ayahNumber: number, surahName: string): boolean {
    const state = this.getQuranState();
    const existingIndex = state.bookmarks.findIndex(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );

    let isNowBookmarked = false;
    if (existingIndex >= 0) {
      state.bookmarks.splice(existingIndex, 1);
      isNowBookmarked = false;
    } else {
      state.bookmarks.push({
        surahNumber,
        ayahNumber,
        surahName,
        date: new Date().toISOString(),
      });
      isNowBookmarked = true;
    }

    this.saveQuranState(state);
    return isNowBookmarked;
  },

  getDhikrCounts(): Record<string, number> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DHIKR_COUNTS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveDhikrCount(dhikrId: string, count: number) {
    const counts = this.getDhikrCounts();
    counts[dhikrId] = count;
    try {
      localStorage.setItem(STORAGE_KEYS.DHIKR_COUNTS, JSON.stringify(counts));
    } catch (e) {
      // ignore
    }
  },

  // --- DEDICATED ISTIGHFAR PERSISTENCE ---
  getIstighfarState(): {
    currentCount: number;
    selectedFormulaId: string;
    targetGoal: number;
    totalLifetimeCount: number;
    todayCount: number;
    lastDateStr: string;
  } {
    const defaultState = {
      currentCount: 0,
      selectedFormulaId: 'istighfar_1',
      targetGoal: 70,
      totalLifetimeCount: 0,
      todayCount: 0,
      lastDateStr: new Date().toISOString().split('T')[0],
    };
    try {
      const data = localStorage.getItem('khatwati_istighfar_state_v1');
      if (!data) return defaultState;
      const parsed = JSON.parse(data);
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastDateStr !== today) {
        parsed.todayCount = 0;
        parsed.lastDateStr = today;
      }
      return { ...defaultState, ...parsed };
    } catch {
      return defaultState;
    }
  },

  saveIstighfarState(state: Partial<{
    currentCount: number;
    selectedFormulaId: string;
    targetGoal: number;
    totalLifetimeCount: number;
    todayCount: number;
    lastDateStr: string;
  }>) {
    const current = this.getIstighfarState();
    const updated = { ...current, ...state };
    try {
      localStorage.setItem('khatwati_istighfar_state_v1', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save istighfar state:', e);
    }
    return updated;
  },

  // --- QUIZ PROGRESS PERSISTENCE ---
  getQuizAttempts(): Record<string, { score: number; total: number; completedAt: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveQuizAttempt(categoryId: string, score: number, total: number) {
    const attempts = this.getQuizAttempts();
    attempts[categoryId] = {
      score,
      total,
      completedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(attempts));
    } catch (e) {
      console.warn('Failed to save quiz attempt:', e);
    }
    return attempts;
  },

  clearAllUserData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRAYER_LOGS);
      localStorage.removeItem(STORAGE_KEYS.QURAN_STATE);
      localStorage.removeItem(STORAGE_KEYS.CACHED_TIMINGS);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.DHIKR_COUNTS);
      localStorage.removeItem('khatwati_istighfar_state_v1');
    } catch (e) {
      // ignore
    }
  },
};
