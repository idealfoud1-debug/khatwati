import { PrayerStep, DailyPrayerSpec, WuduStep, CommonMistakeItem } from '../types';

// =========================================================================
// 11-CARD ORIGINAL USER IMAGES SPECIFICATION (البطاقات الـ 11 الأصلية لتعليم الصلاة)
// =========================================================================
export interface UserPrayerCard {
  cardNumber: number;
  originalFilename: string;
  encodedUrl: string;
  stepNumber: number;
  stepId: string;
  stepIndex: number;
  title: string;
  textInImage: string;
  postureDescription: string;
}

export const USER_ORIGINAL_11_CARDS: UserPrayerCard[] = [
  {
    cardNumber: 1,
    originalFilename: 'téléchargement (48).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (48).jfif'),
    stepNumber: 1,
    stepId: 'step_1',
    stepIndex: 0,
    title: 'استقبال القبلة والنية',
    textInImage: 'أَتَّوَجَّهُ إِلَى الْقِبْلَةِ وَ أَنْوِي الصَّلَاةَ',
    postureDescription: 'الوقوف مستقيماً باتجاه القبلة واستحضار النية بالقلب',
  },
  {
    cardNumber: 2,
    originalFilename: 'téléchargement (47).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (47).jfif'),
    stepNumber: 1,
    stepId: 'step_1',
    stepIndex: 0,
    title: 'تكبيرة الإحرام',
    textInImage: 'أَرْفَعُ الْيَدَيْنِ مَبْسُوطَتَيْنِ عَلَى مُسْتَوَى الْكَتِفِ وَأَقُولُ: اللَّهُ أَكْبَرُ',
    postureDescription: 'رفع اليدين مبسوطتين حذو المنكبين مع التكبير للدخول في الصلاة',
  },
  {
    cardNumber: 3,
    originalFilename: 'téléchargement (49).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (49).jfif'),
    stepNumber: 2,
    stepId: 'step_2',
    stepIndex: 1,
    title: 'قراءة الفاتحة وسورة',
    textInImage: 'أَقْرَأُ الْفَاتِحَةَ مَعَ سُورَةٍ مِنَ الْقُرْآنِ الْكَرِيمِ',
    postureDescription: 'القيام بخشوع وقراءة الفاتحة وسورة من القرآن الكريم',
  },
  {
    cardNumber: 4,
    originalFilename: 'téléchargement (50).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (50).jfif'),
    stepNumber: 3,
    stepId: 'step_3',
    stepIndex: 2,
    title: 'الركوع',
    textInImage: 'أَقُولُ: اللَّهُ أَكْبَرُ ثُمَّ أَرْكَعُ وَ أَقُولُ: سُبْحَانَ رَبِّيَ الْعَظِيمِ (ثَلَاثَ مَرَّاتٍ)',
    postureDescription: 'الانحناء للركوع مع قبض الركبتين واستواء الظهر والتسبيح ثلاثاً',
  },
  {
    cardNumber: 5,
    originalFilename: 'téléchargement (51).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (51).jfif'),
    stepNumber: 4,
    stepId: 'step_4',
    stepIndex: 3,
    title: 'الرفع من الركوع والاعتدال',
    textInImage: 'أَرْفَعُ مِنَ الرُّكُوعِ قَائِلًا: سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَ لَكَ الْحَمْدُ.',
    postureDescription: 'الاعتدال قائماً مطمئناً بعد الركوع وحمد الله سبحانه',
  },
  {
    cardNumber: 6,
    originalFilename: 'MilDE9.jfif',
    encodedUrl: '/images/prayer/MilDE9.jfif',
    stepNumber: 5,
    stepId: 'step_5',
    stepIndex: 4,
    title: 'السجود الأول',
    textInImage: 'أَهْوِي لِلسُّجُودِ قَائِلًا: اللَّهُ أَكْبَرُ وَ أَثْنَاءَ السُّجُودِ أَقُولُ: سُبْحَانَ رَبِّيَ الْأَعْلَى (ثَلَاثَ مَرَّاتٍ)',
    postureDescription: 'السجود على الأعضاء السبعة مع رفع المرفقين والتسبيح ثلاثاً',
  },
  {
    cardNumber: 7,
    originalFilename: 'téléchargement (52).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (52).jfif'),
    stepNumber: 6,
    stepId: 'step_6',
    stepIndex: 5,
    title: 'الجلوس بين السجدتين',
    textInImage: 'أَرْفَعُ مِنَ السُّجُودِ قَائِلًا: اللَّهُ أَكْبَرُ وَ عِنْدَ الِاسْتِوَاءِ فِي الْقُعُودِ أَقُولُ: رَبِّ اغْفِرْ لِي وَ ارْحَمْنِي',
    postureDescription: 'الجلوس باطمئنان بين السجدتين وافتراش الرجل وطلب المغفرة',
  },
  {
    cardNumber: 8,
    originalFilename: 'téléchargement (53).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (53).jfif'),
    stepNumber: 7,
    stepId: 'step_7',
    stepIndex: 6,
    title: 'السجود الثاني',
    textInImage: 'أَسْجُدُ ثَانِيَةً قَائِلًا: اللَّهُ أَكْبَرُ وَ أَثْنَاءَ السُّجُودِ أَقُولُ: سُبْحَانَ رَبِّيَ الْأَعْلَى (ثَلَاثَ مَرَّاتٍ)',
    postureDescription: 'السجود الثاني كالأول مع الطمأنينة وإتمام الركعة',
  },
  {
    cardNumber: 9,
    originalFilename: 'téléchargement (54).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (54).jfif'),
    stepNumber: 9,
    stepId: 'step_9',
    stepIndex: 8,
    title: 'الجلوس للتشهد',
    textInImage: 'بَعْدَ الْإِتْيَانِ بِالرَّكْعَةِ الثَّانِيَةِ تَمَامًا كَالْأُولَى أَجْلِسُ لِلتَّشَهُّدِ.',
    postureDescription: 'الجلوس بعد الركعة الثانية لقراءة التحيات والإشارة بالسبابة',
  },
  {
    cardNumber: 10,
    originalFilename: 'téléchargement (55).jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('téléchargement (55).jfif'),
    stepNumber: 14,
    stepId: 'step_14',
    stepIndex: 13,
    title: 'التسليم جهة اليمين',
    textInImage: 'بَعْدَ الِانْتِهَاءِ مِنَ التَّشَهُّدِ أُسَلِّمُ جِهَةَ الْيَمِينِ قَائِلًا: السَّلَامُ عَلَيْكُمْ',
    postureDescription: 'الالتفات جهة اليمين لنطق السلام للخروج من الصلاة',
  },
  {
    cardNumber: 11,
    originalFilename: 'مشاهد تعليم الصلاة للطفل السنة الثانية ابتدائي 🏆.jfif',
    encodedUrl: '/images/prayer/' + encodeURIComponent('مشاهد تعليم الصلاة للطفل السنة الثانية ابتدائي 🏆.jfif'),
    stepNumber: 14,
    stepId: 'step_14',
    stepIndex: 13,
    title: 'التسليم جهة اليسار',
    textInImage: 'ثُمَّ أُسَلِّمُ جِهَةَ الْيَسَارِ قَائِلًا: السَّلَامُ عَلَيْكُمْ',
    postureDescription: 'الالتفات جهة اليسار قائلاً السلام عليكم ختاماً للصلاة',
  },
];

// =========================================================================
// 14-STEP VISUAL PRAYER TUTORIAL (دليل الصلاة المرئي المكون من 14 خطوة)
// Verified religious baseline: Moroccan Maliki School & Sunnah consensus
// =========================================================================
export const PRAYER_14_STEPS: PrayerStep[] = [
  {
    id: 'step_1',
    stepNumber: 1,
    titleArabic: 'النية وتكبيرة الإحرام',
    titleDarija: 'النية وتكبيرة الإحرام (الدخول في الصلاة)',
    shortInstruction: 'استقبل القبلة، انوِ الصلاة بقلبك، وارفع يديك حذو منكبيك وقل: الله أكبر.',
    detailedInstruction: 'كتوقف مقاد اتجاه القبلة، كتنوي الصلاة اللي باغي تصليها بقلبك (النية محلها القلب وبلا تلفظ). كترفع يديك حذو المنكبين (أو الأذنين) وكتبدا الصلاة بقول: «اللهُ أَكْبَرُ». بهاد التكبيرة كتحرم عليك جميع مبطلات الصلاة بحال الكلام والأكل.',
    postureType: 'TAKBEER',
    recitationArabic: 'اللَّهُ أَكْبَرُ',
    recitationTransliteration: 'Allahu Akbar',
    recitationDarijaMeaning: 'الله أكبر وأعظم من كل شيء في الدنيا وما فيها.',
    audioRecitationText: 'اللهُ أَكْبَر',
    commonMistakes: [
      'التلفظ بالنية بصوت مرتفع (الأصل أن النية بالقلب).',
      'قول «الله وأكبر» بإضافة واو أو مد الألف (الصحيح: اللهُ أكبرُ باختصار).',
      'عدم استقبال القبلة بالجسد كاملاً.'
    ],
    tipsForKhushu: 'استحضر عظمة الله سبحانه وتعالى أنك واقف بين يديه وخلي قلبك حاضر.',
    source: 'الموطأ للإمام مالك، صحيح البخاري (حديث المسيء صلاته)',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'تكبيرة الإحرام ركن أساسي لا تصح الصلاة بدونه.',
    imageUrl: '/images/prayer/5926820681553219577.jpg',
    imageAlt: 'تكبيرة الإحرام - رفع اليدين حذو المنكبين والأذنين',
    imageCircleBadge: 1
  },
  {
    id: 'step_2',
    stepNumber: 2,
    titleArabic: 'القيام وقراءة سورة الفاتحة وما تيسر',
    titleDarija: 'الوقوف وقراءة سورة الفاتحة مع سورة قصيرة',
    shortInstruction: 'قف بخشوع، واقرأ سورة الفاتحة آية آية بتأنٍّ، ثم اقرأ ما تيسر من القرآن.',
    detailedInstruction: 'كتوقف مستقيم (وفي المذهب المالكي يسن السدل، ويجوز القبض بوضع اليمين على الشمال). كتقرأ سورة الفاتحة كاملة بتؤدة وبدون استعجال حيت قراءتها ركن في كل ركعة، ومن بعد كتقول «آمين» وتقرأ سورة أو آيات من القرآن الكريم في الركعتين الأوليين.',
    postureType: 'QIYAM',
    recitationArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝ آمين',
    recitationTransliteration: 'Bismillāhi r-Raḥmāni r-Raḥīm. Al-ḥamdu lillāhi Rabbi l-ʿālamīn...',
    recitationDarijaMeaning: 'الفاتحة هي أم الكتاب وشكر لله وطلب الهداية للطريق المستقيم.',
    audioRecitationText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    commonMistakes: [
      'قراءة الفاتحة بسرعة فائقة بدون تمييز الآيات.',
      'إسقاط آية أو حرف منها أو اللحن الجلي المغير للمعنى.',
      'الالتفات بالرأس أو البصر إلى السماء (النظر يكون لموضع السجود).'
    ],
    tipsForKhushu: 'وقف وقفة وقار، وخلي عينيك كيشوفو لبلاصة السجود، وتدبر كل آية كتقراها.',
    source: 'حديث: «لا صلاة لمن لم يقرأ بفاتحة الكتاب» (متفق عليه)',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الفاتحة ركن من أركان الصلاة لا تسقط عمداً ولا سهواً.'
  },
  {
    id: 'step_3',
    stepNumber: 3,
    titleArabic: 'الركوع',
    titleDarija: 'الركوع وتعظيم الله سبحانه',
    shortInstruction: 'كبّر وانحنِ حتى يستوي ظهرك، وضع كفيك على ركبتيك وقل: سبحان ربي العظيم.',
    detailedInstruction: 'كترفع يديك مع التكبير «الله أكبر» وكتنحني، كتحط يديك على ركبتيك وكتفرّج صباعك، ظهرك يكون مستوي وعنقك متوازن، وكتسبح الله بخشوع: «سُبْحَانَ رَبِّيَ الْعَظِيمِ» ثلاث مرات.',
    postureType: 'RUKU',
    recitationArabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ (3 مرات)',
    recitationTransliteration: 'Subhana Rabbiyal Azeem (3x)',
    recitationDarijaMeaning: 'تنزيه الله العظيم عن كل نقص وعيب.',
    audioRecitationText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    commonMistakes: [
      'عدم استواء الظهر (تقويس الظهر بشكل مائل جداً أو رفعه كلياً).',
      'الاستعجال وعدم الطمأنينة (الركوع ونقر الصلاة كالغراب).',
      'ثني الركبتين بشكل مبالغ فيه.'
    ],
    tipsForKhushu: 'استشعر أنك منحني خضوعاً لخالق الكون، وعظّم ربك بلسانك وقلبك.',
    source: 'حديث عائشة رضي الله عنها في صفة صلاة النبي ﷺ (صحيح مسلم)',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الركوع والطمأنينة فيه فرضان متفق عليهما.',
    imageUrl: '/images/prayer/5926820681553219578.jpg',
    imageAlt: 'الركوع - وضع الكفين على الركبتين واستواء الظهر (صورة 3)',
    imageCircleBadge: 3
  },
  {
    id: 'step_4',
    stepNumber: 4,
    titleArabic: 'الرفع من الركوع والاعتدال',
    titleDarija: 'الوقوف والاعتدال بعد الركوع وحمد الله',
    shortInstruction: 'ارفع رأسك من الركوع حتى يستقيم ظهرك قائماً، وقل: سمع الله لمن حمده، ربنا ولك الحمد.',
    detailedInstruction: 'كترفع راسك وظهرك من الركوع حتى توقف مستقيم ومرتاح، وكتنطق: «سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ»، ومين تستوي واقفاً كتقول: «رَبَّنَا وَلَكَ الْحَمْدُ». الطمأنينة هنا فرض مهم.',
    postureType: 'ITIDAL',
    recitationArabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ — رَبَّنَا وَلَكَ الْحَمْدُ',
    recitationTransliteration: 'Sami\'a Allahu liman hamidah — Rabbana wa lakal hamd',
    recitationDarijaMeaning: 'استجاب الله وتقبل ممن حمده، يا ربنا لك الحمد والثناء كله.',
    audioRecitationText: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ رَبَّنَا وَلَكَ الْحَمْدُ',
    commonMistakes: [
      'النزول مباشرة للسجود قبل أن يستقيم الظهر تماماً (إلغاء ركن الطمأنينة).',
      'تحريك الرجلين أو المشي أثناء الرفع.'
    ],
    tipsForKhushu: 'وقف وقفة اطمئنان حتى يرجع كل عظم لمكانه وتكون شاكراً لله على نعمه.',
    source: 'الموطأ، كتاب الصلاة، باب ما يقول من رفع رأسه من الركوع',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الاعتدال والطمأنينة فيه ركن مستقل.',
    imageUrl: '/images/prayer/5926820681553219579.jpg',
    imageAlt: 'الرفع من الركوع والاعتدال والاطمئنان قائماً (صورة 4)',
    imageCircleBadge: 4
  },
  {
    id: 'step_5',
    stepNumber: 5,
    titleArabic: 'السجود الأول',
    titleDarija: 'السجود الأول على الأعضاء السبعة',
    shortInstruction: 'اهوِ ساجداً مكبّراً، وضع جبهتك وأنفك وكفيك وركبتيك وأطراف قدميك على الأرض، وقل: سبحان ربي الأعلى.',
    detailedInstruction: 'كتنزل تكبّر «الله أكبر» وتسجد على سبعة أعضاء: الجبهة والأنف معاً، الكفين، الركبتين، وأطراف صباع القدمين مستقبلين القبلة. ظهرك يكون متناسق، وكتسبح: «سُبْحَانَ رَبِّيَ الأَعْلَى» 3 مرات.',
    postureType: 'SUJOOD_1',
    recitationArabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى (3 مرات)',
    recitationTransliteration: 'Subhana Rabbiyal A\'la (3x)',
    recitationDarijaMeaning: 'أنزه الله الأعلى فوق كل شيء عن كل نقص.',
    audioRecitationText: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
    commonMistakes: [
      'رفع الأنف عن الأرض والسجود على الجبهة فقط (يجب تمكين الأنف).',
      'بسط الذراعين على الأرض كالكلب (يسن رفع المرفقين عن الأرض للرجل).',
      'رفع القدمين في الهواء أثناء السجود.'
    ],
    tipsForKhushu: 'أقرب ما يكون العبد من ربه وهو ساجد، فهاد الموضع استشعر القرب من الله وادعُ بما تشاء.',
    source: 'حديث ابن عباس: «أمرت أن أسجد على سبعة أعظم» (متفق عليه)',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'السجود على الأعضاء السبعة مع الطمأنينة ركن أساسي.',
    imageUrl: '/images/prayer/5926820681553219580.jpg',
    imageAlt: 'السجود الأول على الأعضاء السبعة مع رفع المرفقين (صورة 5)',
    imageCircleBadge: 5
  },
  {
    id: 'step_6',
    stepNumber: 6,
    titleArabic: 'الجلوس بين السجدتين',
    titleDarija: 'الجلسة بين السجدتين وطلب المغفرة',
    shortInstruction: 'ارفع من السجود مكبّراً واجلس مستوياً بخشوع، وقل: رب اغفر لي، رب اغفر لي.',
    detailedInstruction: 'كترفع من السجود مع التكبير «الله أكبر»، كتجلس جالس مطمئن ومستقيم، كتحط يديك على فخذيك، وكتدعو: «رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي» أو «اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي».',
    postureType: 'JULUS',
    recitationArabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    recitationTransliteration: 'Rabbi-ghfir li, Rabbi-ghfir li',
    recitationDarijaMeaning: 'يا ربي سامحني واغفر لي ذنوبي وزلاتي.',
    audioRecitationText: 'رَبِّ اغْفِرْ لِي رَبِّ اغْفِرْ لِي',
    commonMistakes: [
      'عدم الجلوس بشكل كامل والنزول مباشرة للسجدة الثانية (نقر كالديك).',
      'عدم الطمأنينة واستعجال الحركة.'
    ],
    tipsForKhushu: 'هاد الجلسة فرصة لطلب المغفرة من الله بقلب صادق وتواضع تام.',
    source: 'سنن أبي داود، صحيح ابن ماجه',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الجلوس بين السجدتين مع الطمأنينة فرض لا تصح الصلاة بتركه.',
    imageUrl: '/images/prayer/5926820681553219581.jpg',
    imageAlt: 'الجلوس بين السجدتين - صفة نصب الرجل والافتراش من الخلف (صورة 6)',
    imageCircleBadge: 6
  },
  {
    id: 'step_7',
    stepNumber: 7,
    titleArabic: 'السجود الثاني',
    titleDarija: 'السجدة الثانية وتكرار التسبيح',
    shortInstruction: 'اسجد ثانيةً مكبراً كما في السجدة الأولى، وسبح: سبحان ربي الأعلى 3 مرات.',
    detailedInstruction: 'كتكبّر «الله أكبر» وكتسجد السجدة الثانية تماماً بحال الأولى على الأعضاء السبعة مع الطمأنينة، وكتسبح: «سُبْحَانَ رَبِّيَ الأَعْلَى» 3 مرات.',
    postureType: 'SUJOOD_2',
    recitationArabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى (3 مرات)',
    recitationTransliteration: 'Subhana Rabbiyal A\'la (3x)',
    recitationDarijaMeaning: 'تكرار تعظيم الله الأعلى في خضوع وتذلل.',
    audioRecitationText: 'سُبْحَانَ رَبِّيَ الأَعْلَى',
    commonMistakes: [
      'الاستعجال في السجدة الثانية بدعوى إتمام الركعة بسرعة.',
      'تحريك الأصابع أو العبث بالملابس.'
    ],
    tipsForKhushu: 'كمل الركعة الأولى وأنت في غاية السكينة وحمد الله على توفيقه ليك للصلاة.',
    source: 'الموطأ وصحيح البخاري',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'بهاد السجدة كتكون الركعة الأولى كملات بنجاح.',
    imageUrl: '/images/prayer/5926820681553219582.jpg',
    imageAlt: 'الجلوس بين السجدتين والاطمئنان التام من الأمام (صورة 7)',
    imageCircleBadge: 7
  },
  {
    id: 'step_8',
    stepNumber: 8,
    titleArabic: 'القيام للركعة الثانية',
    titleDarija: 'النهوض للركعة الثانية وإعادتها',
    shortInstruction: 'قم مكبّراً للركعة الثانية، وافعل فيها ما فعلت في الأولى من قراءة وركوع وسجود.',
    detailedInstruction: 'كتنوض واقفاً مكبّراً «الله أكبر»، وكتعاود نفس الأفعال ديال الركعة الأولى: قراءة الفاتحة وسورة قصيرة، الركوع والاعتدال، ثم السجود الأول والجلوس والسجود الثاني.',
    postureType: 'QIYAM_2',
    recitationArabic: 'اللَّهُ أَكْبَرُ (ثم الفاتحة وما تيسر)',
    recitationTransliteration: 'Allahu Akbar (then Al-Fatiha and Surah)',
    recitationDarijaMeaning: 'الاستمرار في صلاة الركعة الثانية بطمأنينة وحضور ذهن.',
    audioRecitationText: 'اللَّهُ أَكْبَرُ',
    commonMistakes: [
      'نسيان قراءة الفاتحة في الركعة الثانية أو الاكتفاء بالسورة القصيرة.',
      'التكاسل في الحركات مقارنة بالركعة الأولى.'
    ],
    tipsForKhushu: 'كل ركعة هي باب جديد للرحمة، حافظ على نفس التركيز والخشوع.',
    source: 'صحيح البخاري، صفة صلاة النبي ﷺ',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الركعة الثانية تماثل الأولى في جميع الأركان.'
  },
  {
    id: 'step_9',
    stepNumber: 9,
    titleArabic: 'الجلوس للتشهد الأول',
    titleDarija: 'الجلوس للتشهد الأول وقراءة التحيات',
    shortInstruction: 'بعد السجدة الثانية من الركعة الثانية، اجلس واقرأ التحيات لله (في الصلوات الثلاثية والرباعية).',
    detailedInstruction: 'من بعد ما كتسالي الركعة الثانية، كتجلس مطمئن كتقرأ التشهد الأول. في المذهب المالكي يُقرأ تشهد عمر بن الخطاب رضي الله عنه: «التحيات لله، الزاكيات لله، الطيبات الصلوات لله...». وكتشير بالسبابة مع تحريكها بلطف يميناً وشمالاً.',
    postureType: 'TASHAHHUD_1',
    recitationArabic: 'التَّحِيَّاتُ لِلَّهِ، الزَّاكِيَاتُ لِلَّهِ، الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ. السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
    recitationTransliteration: 'Attahiyyatu lillah, az-zakiyatu lillah, at-tayyibatu as-salawatu lillah...',
    recitationDarijaMeaning: 'جميع التعظيمات والبركات لله، السلام على رسول الله وعلينا وعلى عباد الله الصالحين، والشهادة بالتوحيد والرسالة.',
    audioRecitationText: 'التَّحِيَّاتُ لِلَّهِ الزَّاكِيَاتُ لِلَّهِ الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ',
    commonMistakes: [
      'قراءة الصلاة الإبراهيمية في التشهد الأول خطأً أو التطويل فيه.',
      'إهمال نطق الشهادتين بوضوح.'
    ],
    tipsForKhushu: 'استحضر السلام على النبي ﷺ كأنك بين يديه وتسلم عليه بكل محبة.',
    source: 'الموطأ للإمام مالك (تشهد سيدنا عمر بن الخطاب على المنبر)',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'التشهد الأول سنة مؤكدة في الصلوات الثلاثية (المغرب) والرباعية (الظهر، العصر، العشاء).',
    imageUrl: '/images/prayer/5926820681553219583.jpg',
    imageAlt: 'الجلوس للتشهد الأول والإشارة بالسبابة (صورة 9)',
    imageCircleBadge: 9
  },
  {
    id: 'step_10',
    stepNumber: 10,
    titleArabic: 'القيام للركعات الباقية',
    titleDarija: 'النهوض للركعة الثالثة (والرابعة)',
    shortInstruction: 'قم مكبّراً للركعة الثالثة (في المغرب والعشاء والظهر والعصر) واقرأ الفاتحة فقط سرّاً.',
    detailedInstruction: 'كتوقف مكبراً «الله أكبر»، وفي الركعات الباقية (الركعة الثالثة في المغرب، والثالثة والرابعة في الظهر والعصر والعشاء) كتقرأ فقط سورة الفاتحة بوحدها بدون سورة إضافية، وتكون القراءة سرية دايماً.',
    postureType: 'QIYAM_3',
    recitationArabic: 'اللَّهُ أَكْبَرُ (ثم سورة الفاتحة فقط سراً)',
    recitationTransliteration: 'Allahu Akbar (then Al-Fatiha silently)',
    recitationDarijaMeaning: 'القيام لإتمام ما تبقى من ركعات الصلاة.',
    audioRecitationText: 'اللَّهُ أَكْبَرُ',
    commonMistakes: [
      'قراءة سورة إضافية بعد الفاتحة في الركعة الثالثة أو الرابعة سهواً.',
      'الجهر بالقراءة في الركعات السرية.'
    ],
    tipsForKhushu: 'استمر في استشعار الوقوف بين يدي الله بتواضع.',
    source: 'صحيح مسلم، صفة صلاة النبي ﷺ',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'في الركعات الباقية تقتصر القراءة على الفاتحة فقط سرّاً.'
  },
  {
    id: 'step_11',
    stepNumber: 11,
    titleArabic: 'الركوع والسجود للركعات الباقية',
    titleDarija: 'إتمام ركوع وسجود الركعات الباقية',
    shortInstruction: 'أتمم الركوع والاعتدال والسجدتين في كل ركعة كما سبق مع المحافظة على الطمأنينة.',
    detailedInstruction: 'كترتع وتعتدل وتسجد السجدتين في كل ركعة متبقية بنفس الكيفية الشرعية الموصوفة سابقاً مع إعطاء كل ركن حقه من الوقت والسكينة.',
    postureType: 'RUKU_3',
    recitationArabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ / سُبْحَانَ رَبِّيَ الأَعْلَى',
    recitationTransliteration: 'Subhana Rabbiyal Azeem / Subhana Rabbiyal A\'la',
    recitationDarijaMeaning: 'تسبيح الله وتعظيمه في جميع أركان الصلاة.',
    audioRecitationText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    commonMistakes: [
      'التسارع في الركعات الأخيرة بسبب التعب أو العجلة.',
      'نقصان الطمأنينة في الركوع أو السجود الأخير.'
    ],
    tipsForKhushu: 'الصلاة خاتمتها حسنة إذا أتممتها بخشوع كما بدأتها.',
    source: 'الموطأ والسنن',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الأركان تتساوى في فرضية الطمأنينة في أول الصلاة وآخرها.'
  },
  {
    id: 'step_12',
    stepNumber: 12,
    titleArabic: 'الجلوس للتشهد الأخير',
    titleDarija: 'الجلوس الأخير وقراءة التشهد كاملاً',
    shortInstruction: 'اجلس بعد السجدة الأخيرة، واقرأ التحيات لله والشهادتين بخشوع تام.',
    detailedInstruction: 'كتجلس الجلسة الأخيرة، كتقرأ التحيات لله والشهادتين بتمهل وخشوع كما في التشهد الأول.',
    postureType: 'TASHAHHUD_2',
    recitationArabic: 'التَّحِيَّاتُ لِلَّهِ، الزَّاكِيَاتُ لِلَّهِ، الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ. السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
    recitationTransliteration: 'Attahiyyatu lillah... wa ash-hadu anna Muhammadan abduhu wa rasuluh',
    recitationDarijaMeaning: 'التشهد الأخير إعلان لتوحيد الله وإخلاص العبادة له.',
    audioRecitationText: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    commonMistakes: [
      'عدم استقرار الجلسة أو العجلة بالقيام قبل إنهاء الأذكار.',
      'تحريك الجسد بكثرة.'
    ],
    tipsForKhushu: 'أنت في ختام الصلاة، استجمع كل مشاعرك الإيمانية في هذه اللحظات المباركة.',
    source: 'الموطأ، كتاب الصلاة',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الجلوس للتشهد الأخير ركن في الصلاة.'
  },
  {
    id: 'step_13',
    stepNumber: 13,
    titleArabic: 'الصلاة الإبراهيمية والدعاء قبل السلام',
    titleDarija: 'الصلاة الإبراهيمية على النبي ﷺ والدعاء المستجاب',
    shortInstruction: 'صلِّ على النبي ﷺ بالصلاة الإبراهيمية، ثم استعذ بالله من أربع وادعُ بما تحب.',
    detailedInstruction: 'كتصلي على النبي ﷺ بالصيغة الإبراهيمية: «اللهم صل على محمد وعلى آل محمد...»، ومن السنة تستعيذ بالله من عذاب جهنم، وعذاب القبر، وفتنة المحيا والممات، ومن شر فتنة المسيح الدجال، وكتدعو بأي دعاء طيب للدنيا والآخرة حيت الدعاء هنا مستجاب.',
    postureType: 'IBRAHIMIYYA',
    recitationArabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ.',
    recitationTransliteration: 'Allahumma salli \'ala Muhammadin wa \'ala ali Muhammad...',
    recitationDarijaMeaning: 'طلب البركة والرحمة للنبي محمد ﷺ وآله كما باركت على سيدنا إبراهيم عليه السلام.',
    audioRecitationText: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    commonMistakes: [
      'إهمال الدعاء قبل السلام رغم أنه من مواطن إجابة الدعاء العظيمة.',
      'تغيير صيغة الصلاة الإبراهيمية بما لم يرد في السنة الصحيحة.'
    ],
    tipsForKhushu: 'ادعُ لوالديك ولنفسك بصلاح الحال وطلب المغفرة.',
    source: 'صحيح البخاري، صحيح مسلم',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الصلاة الإبراهيمية سنة مؤكدة مستحبة قبل التسليم.'
  },
  {
    id: 'step_14',
    stepNumber: 14,
    titleArabic: 'التسليم',
    titleDarija: 'التسليم والخروج من الصلاة بالسلام',
    shortInstruction: 'التفت بوجهك إلى اليمين وقل: السلام عليكم ورحمة الله، وبذلك تنتهي صلاتك.',
    detailedInstruction: 'كتلتفت جهة اليمين وكتنطق بصوت مسموع: «السَّلَامُ عَلَيْكُمُ» (وفي المذهب المالكي تجزئ تسليمة واحدة تلقاء الوجه مائلاً لليمين، والأفضل عن اليمين ثم اليسار «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ»). بهاد التسليم كتكون صلاتك كملات بسلام وأمان.',
    postureType: 'TASLEEM',
    recitationArabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    recitationTransliteration: 'As-Salamu \'alaykum wa Rahmatullah',
    recitationDarijaMeaning: 'السلام والأمان ورحمة الله وبركاته على المصلين والملائكة.',
    audioRecitationText: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    commonMistakes: [
      'القيام فوراً بعد السلام دون الاستغفار وأذكار ما بعد الصلاة.',
      'هز الرأس بشكل غير مشروع أثناء السلام.'
    ],
    tipsForKhushu: 'استشعر أنك خرجت من الصلاة برحمة ومغفرة، واستغفر الله ثلاثاً كما كان يفعل النبي ﷺ.',
    source: 'حديث: «وتحريمها التكبير وتحليلها التسليم» (سنن الترمذي وأبو داود)',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'التسليم هو الركن الختامي الذي يحل به كل ما حرم بتكبيرة الإحرام.'
  }
];

// =========================================================================
// THE FIVE DAILY PRAYERS SPECIFICATION (الصلوات الخمس المفروضة)
// =========================================================================
export const FIVE_DAILY_PRAYERS: DailyPrayerSpec[] = [
  {
    key: 'fajr',
    nameArabic: 'صلاة الصبح (الفجر)',
    rakatsCount: 2,
    recitationType: 'AUDIBLE',
    recitationDescription: 'جهرية في الركعتين معاً (يقرأ الإمام أو المنفرد بصوت مسموع خاشع).',
    sunnahBefore: 2, // رغيبة الفجر
    sunnahAfter: 0,
    timeDescriptionDarija: 'من طلوع الفجر الصادق حتى طلوع الشمس. وتسبقها ركعتا رغيبة الفجر (سنة مؤكدة).',
    preferredSurahsInfo: 'يستحب فيها طوال المفصل أو التوسط (مثل سورة الأعلى، الغاشية، الشمس، الليل).'
  },
  {
    key: 'dhuhr',
    nameArabic: 'صلاة الظهر',
    rakatsCount: 4,
    recitationType: 'SILENT',
    recitationDescription: 'سرية في الركعات الأربع كاملة (يقرأ في سره دون إخراج صوت مسموع).',
    sunnahBefore: 4,
    sunnahAfter: 2,
    timeDescriptionDarija: 'من زوال الشمس (ميلانها عن وسط السماء) حتى يصير ظل كل شيء مثله.',
    preferredSurahsInfo: 'يقرأ فيها الفاتحة وسورة في الركعتين الأوليين، والفاتحة فقط في الأخيرتين.'
  },
  {
    key: 'asr',
    nameArabic: 'صلاة العصر',
    rakatsCount: 4,
    recitationType: 'SILENT',
    recitationDescription: 'سرية في الركعات الأربع كاملة (الصلاة الوسطى).',
    sunnahBefore: 4,
    sunnahAfter: 0,
    timeDescriptionDarija: 'من صيرورة ظل الشيء مثله حتى اصفرار الشمس وتغير لونها قبيل الغروب.',
    preferredSurahsInfo: 'يقرأ فيها سراً الفاتحة مع سورة متوسطة في الأوليين، والفاتحة فقط في الأخيرتين.'
  },
  {
    key: 'maghrib',
    nameArabic: 'صلاة المغرب',
    rakatsCount: 3,
    recitationType: 'MIXED',
    recitationDescription: 'جهرية في الركعتين الأوليين، وسرية في الركعة الثالثة الأخيرة.',
    sunnahBefore: 0,
    sunnahAfter: 2,
    timeDescriptionDarija: 'من غروب قرص الشمس كاملاً وتواريها حتى مغيب الشفق الأحمر.',
    preferredSurahsInfo: 'يستحب فيها قصار المفصل مثل الإخلاص، الفلق، الناس، التين، الكوثر.'
  },
  {
    key: 'isha',
    nameArabic: 'صلاة العشاء',
    rakatsCount: 4,
    recitationType: 'MIXED',
    recitationDescription: 'جهرية في الركعتين الأوليين، وسرية في الركعتين الأخيرتين.',
    sunnahBefore: 0,
    sunnahAfter: 2, // يتبعها الشفع والوتر
    timeDescriptionDarija: 'من مغيب الشفق الأحمر إلى نصف الليل، ويتبعها ركعتا الشفع وركعة الوتر.',
    preferredSurahsInfo: 'يستحب فيها أوساط المفصل مثل الانشقاق، البروج، الطارق، أو ما تيسر.'
  }
];

// =========================================================================
// WUDU & PURITY STEPS (خطوات الوضوء والطهارة)
// =========================================================================
export const WUDU_8_STEPS: WuduStep[] = [
  {
    id: 'wudu_1',
    stepNumber: 1,
    titleArabic: 'النية وغسل الكفين ثلاثاً',
    titleDarija: 'النية بقلبك وغسل اليدين للكوعين 3 مرات',
    instructionDarija: 'كتنوي الطهارة للصلاة بقلبك وكتسمي الله «بسم الله»، ومن بعد كتغسل يديك بجوج حتى للكوعين ثلاث مرات مع تخليل الأصابع.',
    duaaArabic: 'بِسْمِ اللَّهِ',
    duaaDarija: 'كنبدا باسم الله ونيتي خالصة لله باش نتطهر.',
    isFaridha: false, // غسل اليدين للكوعين سنة والنية فرض
    source: 'الموطأ، كتاب الطهارة، فرائض الوضوء وسننه',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'النية فرض محله القلب، والتسمية وغسل الكفين سنة.'
  },
  {
    id: 'wudu_2',
    stepNumber: 2,
    titleArabic: 'المضمضة ثلاثاً',
    titleDarija: 'المضمضة (غسل الفم بالماء) 3 مرات',
    instructionDarija: 'كتاخذ شوية ديال الماء بيدك اليمنى، كديرو في فمك كتحركو مزيان باش يتنقى ومن بعد كترمو، كتعاودها 3 مرات.',
    isFaridha: false, // سنة في المذهب المالكي
    source: 'صحيح البخاري، باب الوضوء ثلاثا ثلاثا',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'المضمضة سنة لتنظيف الفم وتطييبه لذكر الله وقراءة القرآن.'
  },
  {
    id: 'wudu_3',
    stepNumber: 3,
    titleArabic: 'الاستنشاق والاستنثار ثلاثاً',
    titleDarija: 'الاستنشاق والاستنثار (تنظيف الأنف بالماء) 3 مرات',
    instructionDarija: 'كتجذب الماء بلطف لنيفك بيدك اليمنى (الاستنشاق)، وكتخرجو بيدك اليسرى بلطف (الاستنثار)، 3 مرات.',
    isFaridha: false, // سنة
    cautionNote: 'لا تبالغ في الاستنشاق إذا كنت صائماً لئلا ينزل الماء إلى الحلق.',
    source: 'صحيح مسلم، حديث حمران مولى عثمان في صفة وضوء النبي ﷺ',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'تنقية مجاري التنفس والأنف قبل الصلاة.'
  },
  {
    id: 'wudu_4',
    stepNumber: 4,
    titleArabic: 'غسل الوجه كاملاً ثلاثاً',
    titleDarija: 'غسل الوجه كامل من منبت الشعر للدقن 3 مرات',
    instructionDarija: 'كتغسل وجهك كامل من منبت شعر الرأس المعتاد حتى لأسفل الذقن طولاً، ومن شحمة الأذن لشحمة الأذن عرضاً مع إمرار اليد (الدلك).',
    isFaridha: true, // فرض بنص القرآن
    source: 'القرآن الكريم، سورة المائدة آية 6: «يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ»',
    sourceType: 'QURAN',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'غسل الوجه فرض قرآني محدد الحدود، والدلك واجب في الفقه المالكي.'
  },
  {
    id: 'wudu_5',
    stepNumber: 5,
    titleArabic: 'غسل اليدين إلى المرفقين ثلاثاً',
    titleDarija: 'غسل اليدين من الأصابع للمرفقين 3 مرات',
    instructionDarija: 'كتغسل يدك اليمنى من رؤوس الأصابع حتى تفوت المرفق (المرفق داخل في الغسل) مع الدلك، ثم اليد اليسرى بنفس الطريقة 3 مرات.',
    isFaridha: true, // فرض
    source: 'سورة المائدة آية 6: «وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ»',
    sourceType: 'QURAN',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'المرفقان يجب إدخالهما في الغسل ولا يكتفى بغسل الساعد فقط.'
  },
  {
    id: 'wudu_6',
    stepNumber: 6,
    titleArabic: 'مسح الرأس',
    titleDarija: 'مسح الرأس كامل من القدام للوراء',
    instructionDarija: 'كتبلل يديك بالماء وكتمررهما على رأسك كامل من مقدمة الرأس (منبت الشعر) حتى للقفا (نقرة الرأس)، ورد المسح سنة في المالكية.',
    isFaridha: true, // فرض
    source: 'سورة المائدة آية 6: «وَامْسَحُوا بِرُءُوسِكُمْ» والموطأ',
    sourceType: 'QURAN',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'مسح جميع الرأس فرض في المذهب المالكي ولا يجزئ مسح بعض الشعرات فقط.'
  },
  {
    id: 'wudu_7',
    stepNumber: 7,
    titleArabic: 'مسح الأذنين ظاهراً وباطناً',
    titleDarija: 'مسح الأذنين من الداخل والخارج',
    instructionDarija: 'كتدخل السبابتين في صماخي الأذنين (الداخل)، والابهامين كيمسحو ظاهر الأذنين (الخارج) بماء الرأس أو بماء جديد.',
    isFaridha: false, // سنة
    source: 'السنن، حديث: «الأذنان من الرأس» وسنن الوضوء في الفقه المالكي',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'مسح الأذنين سنة مؤكدة تابعة لمسح الرأس.'
  },
  {
    id: 'wudu_8',
    stepNumber: 8,
    titleArabic: 'غسل الرجلين مع الكعبين ثلاثاً',
    titleDarija: 'غسل الرجلين مع الكعبين حتى تنقاو 3 مرات',
    instructionDarija: 'كتغسل رجلك اليمنى حتى تفوت العظمين الناتئين (الكعبين) مع تخليل أصابع الرجلين بالخنصر والدلك، ثم كتغسل رجلك اليسرى بنفس الطريقة.',
    duaaArabic: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ.',
    duaaDarija: 'دعاء بعد الوضوء كيتفتحو بيه أبواب الجنة الثمانية بإذن الله.',
    isFaridha: true, // فرض
    source: 'سورة المائدة آية 6: «وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ»، وحديث «ويل للأعقاب من النار» (متفق عليه)',
    sourceType: 'QURAN',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'غسل الرجلين إلى الكعبين فرض حاسم مع الحذر من ترك العقب بدون ماء.'
  }
];

// =========================================================================
// COMMON MISTAKES IN PRAYER & WUDU (أخطاء شائعة وتصحيحها)
// =========================================================================
export const COMMON_MISTAKES: CommonMistakeItem[] = [
  {
    id: 'mistake_1',
    title: 'عدم الطمأنينة وسرعة الحركات (نقر الصلاة)',
    category: 'PRAYER',
    wrongAction: 'الركوع والسجود والرفع بسرعة دون استقرار الأعضاء أو أخذ النفس الكافي.',
    correctAction: 'الاستقرار في كل ركن حتى يسكن كل عضو ويرجع إلى موضعه، وتدبر الذكر والدعاء.',
    severity: 'INVALIDATES',
    evidenceSource: 'حديث النبي ﷺ للمسيء صلاته: «ارجع فصل فإنك لم تصل» (صحيح البخاري ومسلم)',
    source: 'صحيح البخاري، كتاب الأذان',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الطمأنينة ركن أساسي في كل حركات الصلاة، وبدونها الصلاة باطلة شرعاً ويجب إعادتها.'
  },
  {
    id: 'mistake_2',
    title: 'مسابقة الإمام في صلاة الجماعة',
    category: 'PRAYER',
    wrongAction: 'الركوع أو السجود أو الرفع قبل الإمام أو معه تماماً.',
    correctAction: 'متابعة الإمام؛ فلا تركع حتى ينتهي الإمام من الركوع ويصل إليه، ولا تسجد حتى يصل الإمام للأرض.',
    severity: 'INVALIDATES',
    evidenceSource: 'حديث: «إنما جعل الإمام ليؤتم به، فإذا كبر فكبروا، وإذا ركع فاركعوا» (متفق عليه)',
    source: 'صحيح البخاري وصحيح مسلم',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'مسابقة الإمام عمداً تبطل الصلاة، والواجب هو المتابعة بعد حركة الإمام مباشرة.'
  },
  {
    id: 'mistake_3',
    title: 'عدم غسل الكعبين أو الأعقاب في الوضوء',
    category: 'WUDU',
    wrongAction: 'رش الماء على مقدمة القدم وترك العقبين (مؤخرة القدم) أو الكعبين جافين.',
    correctAction: 'تعميم الماء باليد والدلك الجيد ليصل الماء إلى الكعبين وما بين الأصابع والعقب كاملاً.',
    severity: 'INVALIDATES',
    evidenceSource: 'حديث النبي ﷺ: «وَيْلٌ لِلأَعْقَابِ مِنَ النَّارِ» (متفق عليه)',
    source: 'صحيح البخاري وصحيح مسلم',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'إذا بقي جزء يسير من العضو لم يصبه الماء بطل الوضوء، وبالتالي بطلت الصلاة.'
  },
  {
    id: 'mistake_4',
    title: 'رفع البصر إلى السماء أثناء الصلاة',
    category: 'PRAYER',
    wrongAction: 'النظر إلى الأعلى أو السقف أو الالتفات يميناً وشمالاً أثناء الصلاة.',
    correctAction: 'توجيه النظر بخشوع إلى موضع السجود طوال الصلاة إلا في التشهد فالنظر إلى السبابة.',
    severity: 'DISLIKED',
    evidenceSource: 'حديث النبي ﷺ: «ما بال أقوام يرفعون أبصارهم إلى السماء في صلاتهم... لينتهن أو لتخطفن أبصارهم» (صحيح البخاري)',
    source: 'صحيح البخاري',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'حركة منهي عنها بشدة تنقص الخشوع وتشتت تركيز المصلي.'
  },
  {
    id: 'mistake_5',
    title: 'عدم تمكين الأنف في السجود',
    category: 'PRAYER',
    wrongAction: 'وضع الجبهة وحدها على الأرض ورفع الأنف عنها.',
    correctAction: 'السجود على الجبهة والأنف معاً كعضو واحد ملاصق للأرض.',
    severity: 'INVALIDATES',
    evidenceSource: 'حديث: «أمرت أن أسجد على سبعة أعظم: الجبهة - وأشار بيده إلى أنفه - والكفين والركبتين وأطراف القدمين»',
    source: 'صحيح مسلم',
    sourceType: 'HADITH_SAHIH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'الأنف جزء لا يتجزأ من ركن الجبهة في السجود الصحيح.'
  },
  {
    id: 'mistake_6',
    title: 'التلفظ بالنية جهراً',
    category: 'PRAYER',
    wrongAction: 'قول «نويت أن أصلي أربع ركعات لصلاة كذا...» بصوت مسموع.',
    correctAction: 'استحضار النية بالقلب بدون تلفظ باللسان، فالله سبحانه يعلم ما في الصدور.',
    severity: 'DISLIKED',
    evidenceSource: 'لم يثبت عن رسول الله ﷺ ولا صحابته التلفظ بالنية في الصلاة (الفقه المالكي والجمهور)',
    source: 'الموطأ والمدونة الكبرى',
    sourceType: 'MALIKI_FIQH',
    verificationStatus: 'PUBLISHED',
    version: '1.0',
    explanationDarija: 'النية عمل قلبي محض، والجهر بها قد يشوش على المصلين ولا أصل له في السنة.'
  }
];
