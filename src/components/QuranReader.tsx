import React, { useState, useEffect, useRef } from 'react';
import {
  ALL_114_SURAHS,
  APPROVED_RECITERS,
  fetchSurahAyahs,
  getAyahAudioUrl,
} from '../data/quranData';
import { SurahMeta, AyahItem, Reciter, QuranReadingState } from '../types';
import { storageService } from '../services/storageService';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Volume2,
  Type,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface QuranReaderProps {
  initialSurahNumber?: number;
  initialReciterId?: string;
}

export const QuranReader: React.FC<QuranReaderProps> = ({
  initialSurahNumber,
  initialReciterId,
}) => {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(initialSurahNumber || 1);
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio & playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAyahNumber, setActiveAyahNumber] = useState<number>(1);
  const [selectedReciterId, setSelectedReciterId] = useState<string>(initialReciterId || 'minshawi');
  const [repeatMode, setRepeatMode] = useState<'OFF' | '1X' | '3X' | '5X' | 'CONTINUOUS'>('OFF');
  const [repeatCountRemaining, setRepeatCountRemaining] = useState<number>(0);
  
  // Reader display settings
  const [fontSize, setFontSize] = useState<number>(26);
  const [bookmarks, setBookmarks] = useState<Array<{ surahNumber: number; ayahNumber: number; surahName: string }>>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize from storage or props
  useEffect(() => {
    const saved = storageService.getQuranState();
    setSelectedSurahNumber(initialSurahNumber || saved.lastSurahNumber || 1);
    setActiveAyahNumber(saved.lastAyahNumber || 1);
    setFontSize(saved.fontSize || 26);
    setSelectedReciterId(initialReciterId || saved.currentReciterId || 'minshawi');
    setRepeatMode(saved.repeatMode || 'OFF');
    setBookmarks(saved.bookmarks || []);
  }, [initialSurahNumber, initialReciterId]);

  // Fetch ayahs when surah changes
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoadingAyahs(true);
      const data = await fetchSurahAyahs(selectedSurahNumber);
      if (isMounted) {
        setAyahs(data);
        setLoadingAyahs(false);
        // Persist last read position
        storageService.saveQuranState({ lastSurahNumber: selectedSurahNumber });
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber]);

  // Audio setup and auto-advance
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleEnded = () => {
      if (repeatMode !== 'OFF' && repeatCountRemaining > 1) {
        setRepeatCountRemaining((prev) => prev - 1);
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else {
        // Reset repeat for next ayah or advance
        if (repeatMode === '3X') setRepeatCountRemaining(3);
        else if (repeatMode === '5X') setRepeatCountRemaining(5);

        // Advance to next ayah if available
        if (activeAyahNumber < ayahs.length) {
          const nextAyah = activeAyahNumber + 1;
          setActiveAyahNumber(nextAyah);
          audio.src = getAyahAudioUrl(selectedSurahNumber, nextAyah, selectedReciterId);
          audio.play().catch(console.warn);
        } else {
          setIsPlaying(false);
        }
      }
    };

    const handleError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [activeAyahNumber, ayahs.length, repeatMode, repeatCountRemaining, selectedSurahNumber, selectedReciterId]);

  const currentSurahMeta = ALL_114_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_114_SURAHS[0];

  const handlePlayAyah = (ayahNum: number) => {
    setActiveAyahNumber(ayahNum);
    if (!audioRef.current) audioRef.current = new Audio();
    
    // Set repeat count
    if (repeatMode === '3X') setRepeatCountRemaining(3);
    else if (repeatMode === '5X') setRepeatCountRemaining(5);
    else setRepeatCountRemaining(1);

    audioRef.current.src = getAyahAudioUrl(selectedSurahNumber, ayahNum, selectedReciterId);
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Audio playback failed', err);
        setIsPlaying(false);
      });
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      handlePlayAyah(activeAyahNumber);
    }
  };

  const handleNextAyah = () => {
    if (activeAyahNumber < ayahs.length) {
      handlePlayAyah(activeAyahNumber + 1);
    }
  };

  const handlePrevAyah = () => {
    if (activeAyahNumber > 1) {
      handlePlayAyah(activeAyahNumber - 1);
    }
  };

  const handleReciterChange = (newReciterId: string) => {
    setSelectedReciterId(newReciterId);
    storageService.saveQuranState({ currentReciterId: newReciterId });
    if (isPlaying && audioRef.current) {
      audioRef.current.src = getAyahAudioUrl(selectedSurahNumber, activeAyahNumber, newReciterId);
      audioRef.current.play().catch(console.warn);
    }
  };

  const handleToggleBookmark = (ayahNum: number) => {
    const isBookmarked = storageService.toggleQuranBookmark(
      selectedSurahNumber,
      ayahNum,
      currentSurahMeta.name
    );
    const updated = storageService.getQuranState().bookmarks;
    setBookmarks([...updated]);
  };

  const isAyahBookmarked = (ayahNum: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === selectedSurahNumber && b.ayahNumber === ayahNum
    );
  };

  const filteredSurahs = ALL_114_SURAHS.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number) === searchQuery.trim()
  );

  return (
    <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-xs overflow-hidden text-right">
      {/* Top Banner & Surah Navigation */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-800 shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-emerald-950 font-ui">
                المصحف الشريف (الرسم العثماني)
              </h2>
              <p className="text-xs text-slate-500">
                114 سورة كاملة مع التلاوة الصوتية وتكرار الآيات للحفظ
              </p>
            </div>
          </div>

          {/* Search Surahs input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="ابحث باسم السورة أو رقمها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-8 pl-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Surahs Horizontal Chips Scrollable */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {filteredSurahs.slice(0, 30).map((s) => (
            <button
              key={s.number}
              onClick={() => setSelectedSurahNumber(s.number)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedSurahNumber === s.number
                  ? 'bg-emerald-800 text-amber-300 font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{s.number}. </span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Surah Header Card with Reciter Selector & Font Sizer */}
      <div className="p-4 sm:p-5 bg-gradient-to-l from-emerald-900 to-emerald-800 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center">
              {currentSurahMeta.number}
            </span>
            <h3 className="text-2xl font-bold font-ui text-white">سورة {currentSurahMeta.name}</h3>
          </div>
          <p className="text-xs text-emerald-200 mt-1">
            {currentSurahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · عدد الآيات: {currentSurahMeta.numberOfAyahs} · {currentSurahMeta.englishNameTranslation}
          </p>
        </div>

        {/* Reciter Selector & Font controls */}
        <div className="flex items-center gap-2">
          {/* Reciter dropdown */}
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/10 text-xs">
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            <select
              aria-label="اختر القارئ"
              value={selectedReciterId}
              onChange={(e) => handleReciterChange(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {APPROVED_RECITERS.map((r) => (
                <option key={r.id} value={r.id} className="text-slate-800">
                  {r.nameArabic}
                </option>
              ))}
            </select>
          </div>

          {/* Font scaler buttons */}
          <div className="flex items-center gap-1 bg-black/20 backdrop-blur-xs px-2 py-1 rounded-xl border border-white/10 text-xs">
            <Type className="w-3.5 h-3.5 text-amber-300" />
            <button
              onClick={() => setFontSize(Math.max(fontSize - 2, 18))}
              className="px-1.5 py-0.5 hover:text-amber-300 text-xs font-bold cursor-pointer"
              title="تصغير الخط"
            >
              -
            </button>
            <span className="font-mono text-[11px] tabular-nums">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(fontSize + 2, 42))}
              className="px-1.5 py-0.5 hover:text-amber-300 text-xs font-bold cursor-pointer"
              title="تكبير الخط"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Audio Control Bar */}
      <div className="bg-emerald-950 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs border-t border-emerald-800/40">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center hover:bg-amber-300 transition cursor-pointer"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handlePrevAyah}
            disabled={activeAyahNumber <= 1}
            className="text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
            title="الآية السابقة"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <span className="font-mono tabular-nums text-emerald-200">
            الآية {activeAyahNumber} من {currentSurahMeta.numberOfAyahs}
          </span>

          <button
            onClick={handleNextAyah}
            disabled={activeAyahNumber >= currentSurahMeta.numberOfAyahs}
            className="text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
            title="الآية التالية"
          >
            <SkipBack className="w-4 h-4" />
          </button>
        </div>

        {/* Memorization loop repetition mode selector */}
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline text-emerald-200 text-[11px]">تكرار للحفظ:</span>
          {(['OFF', '1X', '3X', '5X', 'CONTINUOUS'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setRepeatMode(mode);
                storageService.saveQuranState({ repeatMode: mode });
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                repeatMode === mode
                  ? 'bg-amber-400 text-emerald-950 font-bold'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {mode === 'OFF' ? 'بدون' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Ayahs List Display */}
      <div className="p-4 sm:p-8 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Basmala (for all surahs except At-Tawbah) */}
        {selectedSurahNumber !== 9 && selectedSurahNumber !== 1 && (
          <div className="text-center py-4 text-emerald-900 border-b border-emerald-900/10">
            <p className="font-quran text-2xl font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          </div>
        )}

        {loadingAyahs ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">جارٍ تحميل الآيات الكريمة بالرسم العثماني...</p>
          </div>
        ) : (
          ayahs.map((ayah) => {
            const isCurrent = activeAyahNumber === ayah.numberInSurah;
            const bookmarked = isAyahBookmarked(ayah.numberInSurah);

            return (
              <div
                key={ayah.numberInSurah}
                className={`p-4 rounded-2xl transition-all border ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  {/* Ayah number badge & audio play trigger */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayAyah(ayah.numberInSurah)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                        isCurrent && isPlaying
                          ? 'bg-amber-400 text-emerald-950'
                          : 'bg-slate-100 hover:bg-emerald-100 text-slate-700'
                      }`}
                      title="استمع لهذه الآية"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <span className="text-xs font-bold font-mono text-emerald-900">
                      ﴿{ayah.numberInSurah}﴾
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleToggleBookmark(ayah.numberInSurah)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      bookmarked
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                    title={bookmarked ? 'إزالة الإشارة المرجعية' : 'حفظ كإشارة مرجعية'}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Sacred Arabic Text */}
                <p
                  className="font-quran text-slate-900 leading-[2.4] font-medium text-right my-2"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ayah.text}{' '}
                  <span className="text-emerald-700 font-bold text-sm select-none">
                    ﴿{ayah.numberInSurah}﴾
                  </span>
                </p>

                {/* Darija Meaning if provided for core educational surahs */}
                {ayah.translationDarija && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-2">
                    <strong className="text-emerald-900">المعنى بالدارجة: </strong>
                    {ayah.translationDarija}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
