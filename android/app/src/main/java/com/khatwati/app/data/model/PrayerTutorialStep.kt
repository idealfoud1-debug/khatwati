package com.khatwati.app.data.model

/**
 * Khatwati — خطوتي نحو الصلاة والقرآن
 * Prayer Tutorial Step Model with Visual Image Mapping.
 * Matches 100% with Web/PWA verified 14-step Maliki fiqh sequence.
 */
data class PrayerTutorialStep(
    val id: String,
    val stepNumber: Int,
    val titleArabic: String,
    val titleDarija: String,
    val shortInstruction: String,
    val detailedInstruction: String,
    val recitationArabic: String,
    val imageFilename: String?,
    val imageCircleBadge: Int?,
    val assetPath: String?
)

object PrayerTutorialRepository {
    val PRAYER_STEPS: List<PrayerTutorialStep> = listOf(
        PrayerTutorialStep(
            id = "step_1",
            stepNumber = 1,
            titleArabic = "النية وتكبيرة الإحرام",
            titleDarija = "النية وتكبيرة الإحرام (الدخول في الصلاة)",
            shortInstruction = "استقبل القبلة، انوِ الصلاة بقلبك، وارفع يديك حذو منكبيك وقل: الله أكبر.",
            detailedInstruction = "كتوقف مقاد اتجاه القبلة، كترفع يديك حذو المنكبين وتكبر.",
            recitationArabic = "اللَّهُ أَكْبَرُ",
            imageFilename = "5926820681553219577.jpg",
            imageCircleBadge = 1,
            assetPath = "images/prayer/5926820681553219577.jpg"
        ),
        PrayerTutorialStep(
            id = "step_2",
            stepNumber = 2,
            titleArabic = "القيام وقراءة سورة الفاتحة وما تيسر",
            titleDarija = "الوقوف وقراءة سورة الفاتحة مع سورة قصيرة",
            shortInstruction = "قف بخشوع، واقرأ سورة الفاتحة آية آية بتأنٍّ، ثم اقرأ ما تيسر من القرآن.",
            detailedInstruction = "كتوقف مستقيم وتقرأ الفاتحة وسورة قصيرة.",
            recitationArabic = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        ),
        PrayerTutorialStep(
            id = "step_3",
            stepNumber = 3,
            titleArabic = "الركوع",
            titleDarija = "الركوع وتعظيم الله سبحانه",
            shortInstruction = "كبّر وانحنِ حتى يستوي ظهرك، وضع كفيك على ركبتيك وقل: سبحان ربي العظيم.",
            detailedInstruction = "كترفع يديك مع التكبير وتنحني مستوي الظهر واضعاً الكفين على الركبتين.",
            recitationArabic = "سُبْحَانَ رَبِّيَ الْعَظِيمِ (3 مرات)",
            imageFilename = "5926820681553219578.jpg",
            imageCircleBadge = 3,
            assetPath = "images/prayer/5926820681553219578.jpg"
        ),
        PrayerTutorialStep(
            id = "step_4",
            stepNumber = 4,
            titleArabic = "الرفع من الركوع والاعتدال",
            titleDarija = "الوقوف والاعتدال بعد الركوع وحمد الله",
            shortInstruction = "ارفع رأسك من الركوع حتى يستقيم ظهرك قائماً، وقل: سمع الله لمن حمده، ربنا ولك الحمد.",
            detailedInstruction = "كترفع راسك وظهرك حتى توقف مستقيم وتطمئن.",
            recitationArabic = "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ — رَبَّنَا وَلَكَ الْحَمْدُ",
            imageFilename = "5926820681553219579.jpg",
            imageCircleBadge = 4,
            assetPath = "images/prayer/5926820681553219579.jpg"
        ),
        PrayerTutorialStep(
            id = "step_5",
            stepNumber = 5,
            titleArabic = "السجود الأول",
            titleDarija = "السجود الأول على الأعضاء السبعة",
            shortInstruction = "اهوِ ساجداً مكبّراً، وضع جبهتك وأنفك وكفيك وركبتيك وأطراف قدميك على الأرض، وقل: سبحان ربي الأعلى.",
            detailedInstruction = "كتسجد على الأعضاء السبعة مع رفع المرفقين والطمأنينة.",
            recitationArabic = "سُبْحَانَ رَبِّيَ الأَعْلَى (3 مرات)",
            imageFilename = "5926820681553219580.jpg",
            imageCircleBadge = 5,
            assetPath = "images/prayer/5926820681553219580.jpg"
        ),
        PrayerTutorialStep(
            id = "step_6",
            stepNumber = 6,
            titleArabic = "الجلوس بين السجدتين",
            titleDarija = "الجلسة بين السجدتين وطلب المغفرة",
            shortInstruction = "ارفع من السجود مكبّراً واجلس مستوياً بخشوع، وقل: رب اغفر لي، رب اغفر لي.",
            detailedInstruction = "كتجلس باطمئنان مفترشاً رجلك اليسرى وناصباً اليمنى.",
            recitationArabic = "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
            imageFilename = "5926820681553219581.jpg",
            imageCircleBadge = 6,
            assetPath = "images/prayer/5926820681553219581.jpg"
        ),
        PrayerTutorialStep(
            id = "step_7",
            stepNumber = 7,
            titleArabic = "السجود الثاني",
            titleDarija = "السجدة الثانية وتكرار التسبيح",
            shortInstruction = "اسجد ثانيةً مكبراً كما في السجدة الأولى، وسبح: سبحان ربي الأعلى 3 مرات.",
            detailedInstruction = "كتسجد السجدة الثانية تماماً كالأولى.",
            recitationArabic = "سُبْحَانَ رَبِّيَ الأَعْلَى (3 مرات)",
            imageFilename = "5926820681553219582.jpg",
            imageCircleBadge = 7,
            assetPath = "images/prayer/5926820681553219582.jpg"
        ),
        PrayerTutorialStep(
            id = "step_8",
            stepNumber = 8,
            titleArabic = "القيام للركعة الثانية",
            titleDarija = "النهوض للركعة الثانية وإعادتها",
            shortInstruction = "قم مكبّراً للركعة الثانية، وافعل فيها ما فعلت في الأولى من قراءة وركوع وسجود.",
            detailedInstruction = "كتنوض واقفاً مكبّراً وتعاود نفس أفعال الركعة الأولى.",
            recitationArabic = "اللَّهُ أَكْبَرُ",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        ),
        PrayerTutorialStep(
            id = "step_9",
            stepNumber = 9,
            titleArabic = "الجلوس للتشهد الأول",
            titleDarija = "الجلوس للتشهد الأول وقراءة التحيات",
            shortInstruction = "بعد السجدة الثانية من الركعة الثانية، اجلس واقرأ التحيات لله والإشارة بالسبابة.",
            detailedInstruction = "كتجلس باطمئنان وتقرأ تشهد عمر بن الخطاب رضي الله عنه مع تحريك السبابة.",
            recitationArabic = "التَّحِيَّاتُ لِلَّهِ، الزَّاكِيَاتُ لِلَّهِ، الطَّيِّبَاتُ الصَّلَوَاتُ لِلَّهِ...",
            imageFilename = "5926820681553219583.jpg",
            imageCircleBadge = 9,
            assetPath = "images/prayer/5926820681553219583.jpg"
        ),
        PrayerTutorialStep(
            id = "step_10",
            stepNumber = 10,
            titleArabic = "القيام للركعات الباقية",
            titleDarija = "النهوض للركعة الثالثة (والرابعة)",
            shortInstruction = "قم مكبّراً للركعة الثالثة واقرأ الفاتحة فقط سرّاً.",
            detailedInstruction = "كتوقف مكبراً وتقرأ فقط الفاتحة سراً.",
            recitationArabic = "اللَّهُ أَكْبَرُ",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        ),
        PrayerTutorialStep(
            id = "step_11",
            stepNumber = 11,
            titleArabic = "الركوع والسجود للركعات الباقية",
            titleDarija = "إتمام ركوع وسجود الركعات الباقية",
            shortInstruction = "أتمم الركوع والاعتدال والسجدتين في كل ركعة كما سبق.",
            detailedInstruction = "كترتع وتعتدل وتسجد في كل ركعة متبقية.",
            recitationArabic = "سُبْحَانَ رَبِّيَ الْعَظِيمِ / سُبْحَانَ رَبِّيَ الأَعْلَى",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        ),
        PrayerTutorialStep(
            id = "step_12",
            stepNumber = 12,
            titleArabic = "الجلوس للتشهد الأخير",
            titleDarija = "الجلوس الأخير وقراءة التشهد كاملاً",
            shortInstruction = "اجلس بعد السجدة الأخيرة، واقرأ التحيات لله والشهادتين بخشوع تام.",
            detailedInstruction = "كتجلس الجلسة الأخيرة وتقرأ التحيات والشهادتين.",
            recitationArabic = "التَّحِيَّاتُ لِلَّهِ، الزَّاكِيَاتُ لِلَّهِ... وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        ),
        PrayerTutorialStep(
            id = "step_13",
            stepNumber = 13,
            titleArabic = "الصلاة الإبراهيمية والدعاء قبل السلام",
            titleDarija = "الصلاة الإبراهيمية على النبي ﷺ والدعاء المستجاب",
            shortInstruction = "صلِّ على النبي ﷺ بالصلاة الإبراهيمية وادعُ بما تحب.",
            detailedInstruction = "كتصلي على النبي ﷺ بالصيغة الإبراهيمية وتدعو بما تحب.",
            recitationArabic = "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ...",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        ),
        PrayerTutorialStep(
            id = "step_14",
            stepNumber = 14,
            titleArabic = "التسليم",
            titleDarija = "التسليم والخروج من الصلاة بالسلام",
            shortInstruction = "التفت بوجهك إلى اليمين وقل: السلام عليكم ورحمة الله.",
            detailedInstruction = "كتلتفت جهة اليمين وتنطق: السلام عليكم ورحمة الله.",
            recitationArabic = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
            imageFilename = null,
            imageCircleBadge = null,
            assetPath = null
        )
    )
}
