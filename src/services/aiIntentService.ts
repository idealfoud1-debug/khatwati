export interface AIIntentDestination {
  intent: string;
  route: string;
  subRoute?: string;
  params?: Record<string, any>;
  label: string;
  replyText: string;
  autoNavigate?: boolean;
}

export function detectKhatwatiIntent(query: string): AIIntentDestination | null {
  const q = query.trim().toLowerCase();

  // 1. ISTIGHFAR (الاستغفار)
  if (
    q.includes('استغفار') ||
    q.includes('أستغفر') ||
    q.includes('نستغفر') ||
    q.includes('مسبحة الاستغفار') ||
    q.includes('الاستغفار')
  ) {
    return {
      intent: 'OPEN_ISTIGHFAR',
      route: 'istighfar',
      label: 'فتح قسم الاستغفار الآن',
      replyText: 'مرحباً بك! الاستغفار يفرج الكروب ويجلب الرزق والمغفرة. يمكنك الانتقال مباشرة لقسم الاستغفار واستخدام المسبحة التفاعلية بأصح الصيغ النبوية.',
      autoNavigate: true
    };
  }

  // 2. SPECIFIC QUIZZES (الاختبارات المحددة)
  if (
    (q.includes('اختبار') || q.includes('كويز') || q.includes('امتحان')) &&
    (q.includes('صلاة') || q.includes('الصلاة'))
  ) {
    return {
      intent: 'OPEN_PRAYER_QUIZ',
      route: 'learning',
      subRoute: 'quizzes',
      params: { category: 'PRAYER' },
      label: 'بدء اختبار الصلاة والأركان',
      replyText: 'أهلاً بك! اختبار الصلاة يضم أسئلة موثقة عن أركان الصلاة وتكبيرة الإحرام والركوع والسجود مع الشرح بالدارجة المغربية.',
      autoNavigate: true
    };
  }

  if (
    (q.includes('اختبار') || q.includes('كويز') || q.includes('امتحان')) &&
    (q.includes('قرآن') || q.includes('القرآن') || q.includes('سورة') || q.includes('المصحف'))
  ) {
    return {
      intent: 'OPEN_QURAN_QUIZ',
      route: 'learning',
      subRoute: 'quizzes',
      params: { category: 'QURAN' },
      label: 'بدء اختبار القرآن الكريم',
      replyText: 'ممتاز! اختبار القرآن الكريم يختبر معلوماتك في سور وآيات القرآن وفضل السور كالفاتحة والمعوذات مع الشرح الميسر.',
      autoNavigate: true
    };
  }

  if (
    (q.includes('اختبار') || q.includes('كويز') || q.includes('امتحان')) &&
    (q.includes('وضوء') || q.includes('الوضوء') || q.includes('طهارة'))
  ) {
    return {
      intent: 'OPEN_WUDU_QUIZ',
      route: 'learning',
      subRoute: 'quizzes',
      params: { category: 'WUDU_PURITY' },
      label: 'بدء اختبار الطهارة والوضوء',
      replyText: 'تفضل ببدء اختبار الوضوء والطهارة وفق المذهب المالكي للتحقق من فرائض وسنن الوضوء السبعة ونواقضه.',
      autoNavigate: true
    };
  }

  // GENERAL QUIZZES
  if (
    q.includes('اختبار') ||
    q.includes('اختبارات') ||
    q.includes('كويز') ||
    q.includes('امتحان') ||
    q.includes('نختبر')
  ) {
    return {
      intent: 'OPEN_QUIZZES',
      route: 'learning',
      subRoute: 'quizzes',
      label: 'فتح قسم الاختبارات الإسلامية',
      replyText: 'قسم الاختبارات في مسار التعلم يوفر لك 4 فئات للاختبار: اختبار الصلاة، اختبار القرآن، اختبار الوضوء، واختبار الأذكار.',
      autoNavigate: true
    };
  }

  // 3. RECITERS (القراء المعتمدون)
  if (q.includes('منشاوي') || q.includes('المنشاوي')) {
    return {
      intent: 'OPEN_RECITER_MINSHAWI',
      route: 'quran',
      params: { reciterId: 'minshawi' },
      label: 'الاستماع لتلاوة الشيخ محمد صديق المنشاوي',
      replyText: 'تم توجيهك للمصحف الشريف مع اختيار تلاوة الشيخ محمد صديق المنشاوي (مرتل). يمكنك اختيار أي سورة والاستماع بخشوع.',
      autoNavigate: true
    };
  }

  if (q.includes('لحيدان') || q.includes('اللحيدان')) {
    return {
      intent: 'OPEN_RECITER_LUHAIDAN',
      route: 'quran',
      params: { reciterId: 'luhaidan' },
      label: 'الاستماع لتلاوة الشيخ محمد اللحيدان',
      replyText: 'تم توجيهك للمصحف الشريف مع اختيار تلاوة الشيخ محمد اللحيدان برواية حفص عن عاصم من خوادم الصوت المعتمدة.',
      autoNavigate: true
    };
  }

  if (q.includes('فقيه') || q.includes('الفقيه')) {
    return {
      intent: 'OPEN_RECITER_FAQIH',
      route: 'quran',
      params: { reciterId: 'faqih' },
      label: 'الاستماع لتلاوة الشيخ محمد الفقيه',
      replyText: 'تم توجيهك للمصحف الشريف مع اختيار تلاوة الشيخ محمد الفقيه المعتمدة.',
      autoNavigate: true
    };
  }

  if (q.includes('معيقلي') || q.includes('المعيقلي')) {
    return {
      intent: 'OPEN_RECITER_MUAIQLY',
      route: 'quran',
      params: { reciterId: 'muaiqly' },
      label: 'الاستماع لتلاوة الشيخ ماهر المعيقلي',
      replyText: 'تم توجيهك للمصحف الشريف مع اختيار تلاوة الشيخ ماهر المعيقلي.',
      autoNavigate: true
    };
  }

  if (q.includes('دوسري') || q.includes('الدوسري')) {
    return {
      intent: 'OPEN_RECITER_DOSSARI',
      route: 'quran',
      params: { reciterId: 'dussary' },
      label: 'الاستماع لتلاوة الشيخ ياسر الدوسري',
      replyText: 'تم توجيهك للمصحف الشريف مع اختيار تلاوة الشيخ ياسر الدوسري.',
      autoNavigate: true
    };
  }

  if (q.includes('عفاسي') || q.includes('العفاسي')) {
    return {
      intent: 'OPEN_RECITER_ALAFASY',
      route: 'quran',
      params: { reciterId: 'alafasy' },
      label: 'الاستماع لتلاوة الشيخ مشاري العفاسي',
      replyText: 'تم توجيهك للمصحف الشريف مع تلاوة الشيخ مشاري بن راشد العفاسي.',
      autoNavigate: true
    };
  }

  // 4. SPECIFIC SURAHS (سور محددة)
  if (q.includes('كهف') || q.includes('الكهف')) {
    return {
      intent: 'OPEN_SURAH_KAHF',
      route: 'quran',
      params: { surahNumber: 18 },
      label: 'فتح سورة الكهف بالمصحف الشريف',
      replyText: 'سورة الكهف نور ما بين الجمعتين. يمكنك قراءتها والاستماع لها بالرسم العثماني الآن!',
      autoNavigate: true
    };
  }

  if (q.includes('بقرة') || q.includes('البقرة')) {
    return {
      intent: 'OPEN_SURAH_BAQARAH',
      route: 'quran',
      params: { surahNumber: 2 },
      label: 'فتح سورة البقرة بالمصحف الشريف',
      replyText: 'سورة البقرة أطول سور القرآن الكريم وفيها آية الكرسي. تفضل بقراءتها والاستماع لتلاوتها.',
      autoNavigate: true
    };
  }

  if (q.includes('فاتحة') || q.includes('الفاتحة')) {
    return {
      intent: 'OPEN_SURAH_FATIHA',
      route: 'quran',
      params: { surahNumber: 1 },
      label: 'فتح سورة الفاتحة بالمصحف الشريف',
      replyText: 'سورة الفاتحة هي أم الكتاب والسبع المثاني وركن الصلاة. تفضل بقراءتها وسماع تلاوتها.',
      autoNavigate: true
    };
  }

  if (q.includes('يس') || q.includes('ياسين')) {
    return {
      intent: 'OPEN_SURAH_YASEEN',
      route: 'quran',
      params: { surahNumber: 36 },
      label: 'فتح سورة يس بالمصحف الشريف',
      replyText: 'تفضل بقراءة وتلاوة سورة يس المباركة في المصحف الشريف.',
      autoNavigate: true
    };
  }

  if (q.includes('ملك') || q.includes('تبارك')) {
    return {
      intent: 'OPEN_SURAH_MULK',
      route: 'quran',
      params: { surahNumber: 67 },
      label: 'فتح سورة الملك بالمصحف الشريف',
      replyText: 'سورة الملك المنجية من عذاب القبر. تفضل بتلاوتها والاستماع لها في المصحف.',
      autoNavigate: true
    };
  }

  // 5. GENERAL QURAN
  if (q.includes('قرآن') || q.includes('القرآن') || q.includes('مصحف') || q.includes('المصحف') || q.includes('سورة')) {
    return {
      intent: 'OPEN_QURAN',
      route: 'quran',
      label: 'فتح المصحف الشريف',
      replyText: 'المصحف الشريف يضم 114 سورة كاملة مع التلاوة الصوتية وتكرار الآيات للحفظ.',
      autoNavigate: true
    };
  }

  // 6. PRAYER LEARNING (تعلم الصلاة)
  if (
    q.includes('نتعلم الصلاة') ||
    q.includes('تعلم الصلاة') ||
    q.includes('كيفاش نصلي') ||
    q.includes('طريقة الصلاة') ||
    q.includes('خطوات الصلاة') ||
    q.includes('دليل الصلاة') ||
    q.includes('أركان الصلاة') ||
    q.includes('ركوع') ||
    q.includes('سجود')
  ) {
    return {
      intent: 'OPEN_PRAYER_LEARNING',
      route: 'prayer',
      subRoute: 'tutorial',
      label: 'فتح دليل تعلم الصلاة (14 خطوة)',
      replyText: 'تعلم الصلاة في 14 خطوة موثقة:\n1. النية وتكبيرة الإحرام (الله أكبر) واستقبال القبلة.\n2. القيام وقراءة الفاتحة وسورة قصيرة.\n3. الركوع واستواء الظهر (سبحان ربي العظيم 3 مرات).\n4. الرفع من الركوع والاعتدال (سمع الله لمن حمده، ربنا ولك الحمد).\n5. السجود الأول على الأعضاء السبعة (سبحان ربي الأعلى 3 مرات).\n6. الجلوس بين السجدتين وطلب المغفرة.\n7. السجود الثاني.\nثم إتمام الركعات والتشهد والتسليم. تفضل بالنقر أدناه لفتح الدليل المصور كاملاً.',
      autoNavigate: true
    };
  }

  // 7. WUDU & PURITY (الوضوء)
  if (
    q.includes('وضوء') ||
    q.includes('الوضوء') ||
    q.includes('نتوضأ') ||
    q.includes('نتوضا') ||
    q.includes('توضأ') ||
    q.includes('توضا') ||
    q.includes('طهارة') ||
    q.includes('كيفاش نتوضى') ||
    q.includes('كيفاش نتوضأ')
  ) {
    return {
      intent: 'OPEN_WUDU',
      route: 'prayer',
      subRoute: 'wudu',
      label: 'فتح دليل الوضوء والطهارة',
      replyText: 'خطوات الوضوء الشرعية بالترتيب (وفق المذهب المالكي):\n1. النية والتسمية وغسل اليدين إلى الكوعين 3 مرات.\n2. المضمضة والاستنشاق والاستنثار 3 مرات.\n3. غسل الوجه كاملاً 3 مرات.\n4. غسل اليدين إلى المرفقين مع الدلك وتخليل الأصابع 3 مرات.\n5. مسح الرأس كاملاً ذهاباً وإياباً مرة واحدة.\n6. مسح الأذنين ظاهراً وباطناً.\n7. غسل الرجلين إلى الكعبين 3 مرات مع تخليل الأصابع والدلك.\nفرائضه 7: النية، غسل الوجه، غسل اليدين للمرفقين، مسح الرأس، غسل الرجلين، الفور، والدلك.',
      autoNavigate: true
    };
  }

  // 8. QIBLA (القبلة)
  if (q.includes('قبلة') || q.includes('القبلة') || q.includes('اتجاه')) {
    return {
      intent: 'OPEN_QIBLA',
      route: 'qibla',
      label: 'فتح بوصلة القبلة التفاعلية',
      replyText: 'يمكنك تحديد اتجاه القبلة الدقيق نحو الكعبة المشرفة عبر بوصلة القبلة التفاعلية.',
      autoNavigate: true
    };
  }

  // 9. PRAYER TIMES (أوقات الصلاة)
  if (q.includes('وقت') || q.includes('مواقيت') || q.includes('أذان') || q.includes('صلاة العصر') || q.includes('صلاة الفجر')) {
    return {
      intent: 'OPEN_PRAYER_TIMES',
      route: 'home',
      subRoute: 'prayer-times',
      label: 'عرض مواقيت الصلاة اليومية',
      replyText: 'تجد في الصفحة الرئيسية جدول مواقيت الصلوات الخمس بدقة لمدينتك وفق تقويم وزارة الأوقاف المغربية.',
      autoNavigate: true
    };
  }

  // 10. ADHKAR & TASBIH (الأذكار والتسبيح)
  if (q.includes('أذكار') || q.includes('تسبيح') || q.includes('المساء') || q.includes('الصباح') || q.includes('سبحة')) {
    return {
      intent: 'OPEN_ADHKAR',
      route: 'more',
      subRoute: 'dhikr',
      label: 'فتح قسم الأذكار والتسبيح',
      replyText: 'قسم الأذكار يوفر لك أذكار الصباح والمساء، أذكار ما بعد الصلاة، وحاسبة تسبيح تفاعلية مع اهتزاز مريح.',
      autoNavigate: true
    };
  }

  // 11. VIDEOS (المرئيات)
  if (q.includes('فيديو') || q.includes('مرئيات') || q.includes('يوتيوب') || q.includes('شرح مرئي')) {
    return {
      intent: 'OPEN_VIDEOS',
      route: 'more',
      subRoute: 'videos',
      label: 'فتح مكتبة المرئيات المعتمدة',
      replyText: 'مكتبة المرئيات تضم 10 شروحات عملية موثوقة ومكتملة الروابط لتعلم الصلاة والوضوء للصغار والكبار.',
      autoNavigate: true
    };
  }

  return null;
}
