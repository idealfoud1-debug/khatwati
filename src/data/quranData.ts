import { SurahMeta, Reciter, AyahItem } from '../types';

// =========================================================================
// RECITERS DIRECTORY (قائمة كبار القراء المعتمدين)
// High-reliability EveryAyah / QuranCDN audio CDN endpoints
// =========================================================================
export const APPROVED_RECITERS: Reciter[] = [
  {
    id: 'minshawi',
    nameArabic: 'محمد صديق المنشاوي (مرتل)',
    nameEnglish: 'Mohamed Siddiq Al-Minshawi',
    subfolder: 'Minshawy_Murattal_128kbps',
    surahAudioServer: 'https://cdn.mp3quran.net/audio/muhammad-minshawi/r1/',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'luhaidan',
    nameArabic: 'محمد اللحيدان',
    nameEnglish: 'Muhammad Al-Luhaidan',
    surahAudioServer: 'https://cdn.mp3quran.net/audio/muhammad-luhaidan/r1/',
    provider: 'MP3QURAN',
    audioFormat: 'SURAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'faqih',
    nameArabic: 'محمد الفقيه',
    nameEnglish: 'Muhammad Al-Faqih',
    surahAudioServer: 'https://cdn.mp3quran.net/audio/muhammad-faqih/r1/',
    provider: 'MP3QURAN',
    audioFormat: 'SURAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'alafasy',
    nameArabic: 'مشاري بن راشد العفاسي',
    nameEnglish: 'Mishary Rashid Alafasy',
    subfolder: 'Alafasy_128kbps',
    surahAudioServer: 'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'muaiqly',
    nameArabic: 'ماهر المعيقلي',
    nameEnglish: 'Maher Al-Muaiqly',
    subfolder: 'MaherAlMuaiqly128kbps',
    surahAudioServer: 'https://cdn.mp3quran.net/audio/maher-muaiqly/r1/',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'dussary',
    nameArabic: 'ياسر الدوسري',
    nameEnglish: 'Yasser Al-Dossari',
    subfolder: 'Yasser_Ad-Dussary_128kbps',
    surahAudioServer: 'https://cdn.mp3quran.net/audio/yasser-dosari/r1/',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'abdulbasit',
    nameArabic: 'عبد الباسط عبد الصمد (مرتل)',
    nameEnglish: 'Abdul Basit Abdul Samad',
    subfolder: 'Abdul_Basit_Murattal_192kbps',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'husary',
    nameArabic: 'محمود خليل الحصري',
    nameEnglish: 'Mahmoud Khalil Al-Husary',
    subfolder: 'Husary_128kbps',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
  {
    id: 'ghamadi',
    nameArabic: 'سعد الغامدي',
    nameEnglish: 'Saad Al-Ghamdi',
    subfolder: 'Ghamadi_40kbps',
    provider: 'EVERYAYAH',
    audioFormat: 'AYAH',
    riwayah: 'حفص عن عاصم'
  },
];

export function getAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterId: string = 'alafasy'): string {
  const reciter = APPROVED_RECITERS.find((r) => r.id === reciterId) || APPROVED_RECITERS[0];
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumber).padStart(3, '0');
  
  if (reciter.provider === 'MP3QURAN' && reciter.surahAudioServer) {
    return `${reciter.surahAudioServer}${sStr}.mp3`;
  }
  
  const subfolder = reciter.subfolder || 'Alafasy_128kbps';
  return `https://everyayah.com/data/${subfolder}/${sStr}${aStr}.mp3`;
}

export function getSurahAudioUrl(surahNumber: number, reciterId: string = 'minshawi'): string {
  const reciter = APPROVED_RECITERS.find((r) => r.id === reciterId) || APPROVED_RECITERS[0];
  const sStr = String(surahNumber).padStart(3, '0');
  if (reciter.surahAudioServer) {
    return `${reciter.surahAudioServer}${sStr}.mp3`;
  }
  // Fallback to minshawi or alafasy
  return `https://cdn.mp3quran.net/audio/muhammad-minshawi/r1/${sStr}.mp3`;
}

// =========================================================================
// ALL 114 SURAHS METADATA (الفهرس الشامل لجميع سور القرآن الكريم الـ 114)
// Verified counts, revelation classification, and canonical ordering
// =========================================================================
export const ALL_114_SURAHS: SurahMeta[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'آل عمران', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'النساء', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'المائدة', englishName: 'Al-Maaida', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'aam', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan' },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raaf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan' },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan' },
  { number: 9, name: 'التوبة', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan' },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan' },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan' },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan' },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', numberOfAyahs: 99, revelationType: 'Meccan' },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bees', numberOfAyahs: 128, revelationType: 'Meccan' },
  { number: 17, name: 'الإسراء', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan' },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan' },
  { number: 20, name: 'طه', englishName: 'Taa-Haa', englishNameTranslation: 'Ta-Ha', numberOfAyahs: 135, revelationType: 'Meccan' },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan' },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan' },
  { number: 24, name: 'النور', englishName: 'An-Noor', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan' },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan' },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'araa', englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan' },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ants', numberOfAyahs: 93, revelationType: 'Meccan' },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan' },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan' },
  { number: 30, name: 'الروم', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan' },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan' },
  { number: 32, name: 'السجدة', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Clans', numberOfAyahs: 73, revelationType: 'Medinan' },
  { number: 34, name: 'سبأ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan' },
  { number: 35, name: 'فاطر', englishName: 'Faatir', englishNameTranslation: 'The Originator', numberOfAyahs: 45, revelationType: 'Meccan' },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Ya-Seen', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 37, name: 'الصافات', englishName: 'As-Saaffaat', englishNameTranslation: 'Those drawn up in Ranks', numberOfAyahs: 182, revelationType: 'Meccan' },
  { number: 38, name: 'ص', englishName: 'Saad', englishNameTranslation: 'The Letter Saad', numberOfAyahs: 88, revelationType: 'Meccan' },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Groups', numberOfAyahs: 75, revelationType: 'Meccan' },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan' },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail', numberOfAyahs: 54, revelationType: 'Meccan' },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'Consultation', numberOfAyahs: 53, revelationType: 'Meccan' },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'Ornaments of Gold', numberOfAyahs: 89, revelationType: 'Meccan' },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan' },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jaathiya', englishNameTranslation: 'Crouching', numberOfAyahs: 37, revelationType: 'Meccan' },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Dunes', numberOfAyahs: 35, revelationType: 'Meccan' },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan' },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan' },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Inner Apartments', numberOfAyahs: 18, revelationType: 'Medinan' },
  { number: 50, name: 'ق', englishName: 'Qaaf', englishNameTranslation: 'The Letter Qaf', numberOfAyahs: 45, revelationType: 'Meccan' },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhaariyat', englishNameTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan' },
  { number: 52, name: 'الطور', englishName: 'At-Toor', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan' },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan' },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan' },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan' },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan' },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan' },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahana', englishNameTranslation: 'She that is to be examined', numberOfAyahs: 13, revelationType: 'Medinan' },
  { number: 61, name: 'الصف', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan' },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'a', englishNameTranslation: 'Friday', numberOfAyahs: 11, revelationType: 'Medinan' },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan' },
  { number: 64, name: 'التغابن', englishName: 'At-Taghaabun', englishNameTranslation: 'Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan' },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaaq', englishNameTranslation: 'Divorce', numberOfAyahs: 12, revelationType: 'Medinan' },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'aarij', englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan' },
  { number: 71, name: 'نوح', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan' },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan' },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan' },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddathir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan' },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insaan', englishNameTranslation: 'Man', numberOfAyahs: 31, revelationType: 'Medinan' },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan' },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 79, name: 'النازعات', englishName: 'An-Naazi\'aat', englishNameTranslation: 'Those who drag forth', numberOfAyahs: 46, revelationType: 'Meccan' },
  { number: 80, name: 'عبس', englishName: 'Abasa', englishNameTranslation: 'He frowned', numberOfAyahs: 42, revelationType: 'Meccan' },
  { number: 81, name: 'التكوير', englishName: 'At-Takweer', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan' },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishNameTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'Meccan' },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Splitting Open', numberOfAyahs: 25, revelationType: 'Meccan' },
  { number: 85, name: 'البروج', englishName: 'Al-Burooj', englishNameTranslation: 'The Mansions of the Stars', numberOfAyahs: 22, revelationType: 'Meccan' },
  { number: 86, name: 'الطارق', englishName: 'At-Taariq', englishNameTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'Meccan' },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'laa', englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming Event', numberOfAyahs: 26, revelationType: 'Meccan' },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan' },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan' },
  { number: 92, name: 'الليل', englishName: 'Al-Lail', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan' },
  { number: 93, name: 'الضحى', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Consolation', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power, Fate', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 100, name: 'العاديات', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 101, name: 'القارعة', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 102, name: 'التكاثر', englishName: 'At-Takaathur', englishNameTranslation: 'Rivalry in world increase', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan' },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 106, name: 'قريش', englishName: 'Quraish', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 107, name: 'الماعون', englishName: 'Al-Maa\'un', englishNameTranslation: 'Small Kindnesses', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'Abundance', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan' },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'Divine Support', numberOfAyahs: 3, revelationType: 'Medinan' },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'Palm Fibre', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'الناس', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' }
];

// =========================================================================
// VERIFIED OFFLINE TEXT DATASET FOR CRITICAL EDUCATIONAL SURAHS
// Uthmani Verified Sacred Arabic text (Never AI-generated or modified)
// =========================================================================
export const VERIFIED_LOCAL_SURAHS: Record<number, AyahItem[]> = {
  // Surah 1: Al-Fatiha
  1: [
    { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', juz: 1, page: 1, translationDarija: 'كنبداو باسم الله الرحمن الرحيم' },
    { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', juz: 1, page: 1, translationDarija: 'الحمد والشكر لله رب العالمين كاملين' },
    { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', juz: 1, page: 1, translationDarija: 'الرحيم بعباده رحمة واسعة' },
    { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', juz: 1, page: 1, translationDarija: 'مالك يوم الحساب والجزاء' },
    { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', juz: 1, page: 1, translationDarija: 'نعبدك وحدك ونطلب عونك وحدك' },
    { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', juz: 1, page: 1, translationDarija: 'وفقنا وسيرنا في طريق الحق والخير' },
    { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', juz: 1, page: 1, translationDarija: 'طريق الأنبياء والصالحين ماشي طريق المغضوب عليهم ولا اللي تاهو' }
  ],
  // Surah 108: Al-Kawthar
  108: [
    { numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', juz: 30, page: 602, translationDarija: 'أعطيناك يا رسول الله الخير الكثير ونهر الكوثر' },
    { numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', juz: 30, page: 602, translationDarija: 'صلي لربك خالصاً واذبح الأضحية لوجهه الكريم' },
    { numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', juz: 30, page: 602, translationDarija: 'اللي كيكرهك هو المقطوع من كل خير وذكر حسن' }
  ],
  // Surah 103: Al-Asr
  103: [
    { numberInSurah: 1, text: 'وَالْعَصْرِ', juz: 30, page: 601, translationDarija: 'قسم بالزمان والوقت' },
    { numberInSurah: 2, text: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', juz: 30, page: 601, translationDarija: 'كل إنسان في خسارة وضياع' },
    { numberInSurah: 3, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', juz: 30, page: 601, translationDarija: 'إلا اللي آمنو وعملو الصالحات وتواصاو بالحق وتواصاو بالصبر' }
  ],
  // Surah 110: An-Nasr
  110: [
    { numberInSurah: 1, text: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', juz: 30, page: 603, translationDarija: 'مين جا نصر الله وفتح مكة' },
    { numberInSurah: 2, text: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', juz: 30, page: 603, translationDarija: 'وشفتي الناس كيدخلو في دين الإسلام جماعات' },
    { numberInSurah: 3, text: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا', juz: 30, page: 603, translationDarija: 'سبح بحمد ربك واطلب مغفرته، إنه غفور رحيم' }
  ],
  // Surah 112: Al-Ikhlas
  112: [
    { numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', juz: 30, page: 604, translationDarija: 'قل هو الله الواحد الأحد لا شريك له' },
    { numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', juz: 30, page: 604, translationDarija: 'الله المقصود في كل الحوائج' },
    { numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', juz: 30, page: 604, translationDarija: 'ما عندو ولد ولا والد' },
    { numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', juz: 30, page: 604, translationDarija: 'ولا مثيل ولا شبيه له سبحانه' }
  ],
  // Surah 113: Al-Falaq
  113: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', juz: 30, page: 604, translationDarija: 'كنلتجئ لرب الصبح والنور' },
    { numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', juz: 30, page: 604, translationDarija: 'من شر كل المخلوقات' },
    { numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', juz: 30, page: 604, translationDarija: 'ومن شر ظلمة الليل إذا دخلت' },
    { numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', juz: 30, page: 604, translationDarija: 'ومن شر السحرة والحاسدين' },
    { numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', juz: 30, page: 604, translationDarija: 'ومن شر عين الحاسد وأذاه' }
  ],
  // Surah 114: An-Nas
  114: [
    { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', juz: 30, page: 604, translationDarija: 'ألتجئ وأحتمي برب الناس وخالقهم' },
    { numberInSurah: 2, text: 'مَلِكِ النَّاسِ', juz: 30, page: 604, translationDarija: 'ملك الناس ومالكهم الحقيقي' },
    { numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', juz: 30, page: 604, translationDarija: 'معبود الناس بحق' },
    { numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', juz: 30, page: 604, translationDarija: 'من شر الشيطان الوسواس اللي كيهرب عند ذكر الله' },
    { numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', juz: 30, page: 604, translationDarija: 'اللي كيوسوس في قلوب العباد بالشر والشك' },
    { numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', juz: 30, page: 604, translationDarija: 'سواء كان شيطان من الجن أو إنسي مضل' }
  ],
  // Surah 109: Al-Kafirun
  109: [
    { numberInSurah: 1, text: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ', juz: 30, page: 603, translationDarija: 'قل يا أيها الكافرون' },
    { numberInSurah: 2, text: 'لَا أَعْبُدُ مَا تَعْبُدُونَ', juz: 30, page: 603, translationDarija: 'ما كنعبدش الأصنام والأوثان اللي كتعرفوها' },
    { numberInSurah: 3, text: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', juz: 30, page: 603, translationDarija: 'وما نتوما عابدين الله الواحد اللي كنعبدو' },
    { numberInSurah: 4, text: 'وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ', juz: 30, page: 603, translationDarija: 'وما عمري غنعبد ما عبدتم' },
    { numberInSurah: 5, text: 'وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ', juz: 30, page: 603, translationDarija: 'وما نتوما عابدين معبودي الحق' },
    { numberInSurah: 6, text: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ', juz: 30, page: 603, translationDarija: 'لكم دينكم الباطل ولي ديني الحق' }
  ],
  // Surah 105: Al-Fil
  105: [
    { numberInSurah: 1, text: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ', juz: 30, page: 601, translationDarija: 'واش ما شفتيش كيف دار الله بأصحاب الفيل اللي جاو يهدمو الكعبة؟' },
    { numberInSurah: 2, text: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ', juz: 30, page: 601, translationDarija: 'ألم يجعل مكرهم وخداعهم في خسران وضياع؟' },
    { numberInSurah: 3, text: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ', juz: 30, page: 601, translationDarija: 'وصيفط عليهم جماعات من الطيور' },
    { numberInSurah: 4, text: 'تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ', juz: 30, page: 601, translationDarija: 'كترميهم بحجارة من طين محروق' },
    { numberInSurah: 5, text: 'فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ', juz: 30, page: 601, translationDarija: 'فردهم ربي بحال ورق الزرع المأكول المسحوق' }
  ],
  // Surah 106: Quraish
  106: [
    { numberInSurah: 1, text: 'لِإِيلَافِ قُرَيْشٍ', juz: 30, page: 602, translationDarija: 'لأجل ألفة قريش ونعمة أمنهم' },
    { numberInSurah: 2, text: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', juz: 30, page: 602, translationDarija: 'أمن رحلتهم للتجارة في الشتاء لليمن وفي الصيف للشام' },
    { numberInSurah: 3, text: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', juz: 30, page: 602, translationDarija: 'فيعبدو الله رب هذا البيت العتيق (الكعبة)' },
    { numberInSurah: 4, text: 'الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ', juz: 30, page: 602, translationDarija: 'اللي رزقهم الطعام وحماهم من كل خوف' }
  ],
  // Surah 107: Al-Ma'un
  107: [
    { numberInSurah: 1, text: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ', juz: 30, page: 602, translationDarija: 'واش شفتي اللي كيكذب بيوم الحساب والجزاء؟' },
    { numberInSurah: 2, text: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ', juz: 30, page: 602, translationDarija: 'هذاك هو اللي كيدفع اليتيم بعنف وكيحرمو حقه' },
    { numberInSurah: 3, text: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ', juz: 30, page: 602, translationDarija: 'وما كيشجعش على إطعام المحتاجين' },
    { numberInSurah: 4, text: 'فَوَيْلٌ لِّلْمُصَلِّينَ', juz: 30, page: 602, translationDarija: 'فهلاك وعذاب للمصلين الغافلين' },
    { numberInSurah: 5, text: 'الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ', juz: 30, page: 602, translationDarija: 'اللي مضيعين صلاتهم وكيأخروها على وقتها' },
    { numberInSurah: 6, text: 'الَّذِينَ هُمْ يُرَاءُونَ', juz: 30, page: 602, translationDarija: 'اللي كيتظاهرو بالصلاح قدام الناس (الرياء)' },
    { numberInSurah: 7, text: 'وَيَمْنَعُونَ الْمَاعُونَ', juz: 30, page: 602, translationDarija: 'وكيمتنعو حتى على مساعدة الجار بالحاجة البسيطة' }
  ]
};

// Async loader with offline-first cache
export async function fetchSurahAyahs(surahNumber: number): Promise<AyahItem[]> {
  // If we already have the verified local Uthmani data, return it immediately
  if (VERIFIED_LOCAL_SURAHS[surahNumber]) {
    return VERIFIED_LOCAL_SURAHS[surahNumber];
  }

  // Check localStorage / IndexedDB cache first
  const cacheKey = `khatwati_surah_cache_${surahNumber}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore storage error
  }

  // Fetch from verified open Quran API (alquran.cloud - Simple Clean Arabic Edition)
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    if (data.code === 200 && data.data && data.data.ayahs) {
      const ayahs: AyahItem[] = data.data.ayahs.map((a: any) => ({
        numberInSurah: a.numberInSurah,
        text: a.text,
        juz: a.juz,
        page: a.page,
      }));
      try {
        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
      } catch (e) {
        // quota limit fallback
      }
      return ayahs;
    }
  } catch (err) {
    console.warn(`Could not load surah ${surahNumber} online, using fallback placeholder`, err);
  }

  // If completely offline and not preloaded, return an informative fallback state without inventing text
  const meta = ALL_114_SURAHS.find((s) => s.number === surahNumber);
  const count = meta ? meta.numberOfAyahs : 7;
  return Array.from({ length: Math.min(count, 5) }, (_, idx) => ({
    numberInSurah: idx + 1,
    text: `[الآية ${idx + 1} من سورة ${meta?.name || ''} — يتطلب الاتصال بالإنترنت للتحميل الكامل أول مرة]`,
    juz: 1,
    page: 1,
  }));
}
