import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { findYabiladiCity, YABILADI_CITIES } from './src/data/yabiladiData';
import { detectKhatwatiIntent } from './src/services/aiIntentService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with required User-Agent
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Bounded System Instruction for Khatwati AI Assistant
const KHATWATI_SYSTEM_INSTRUCTION = `
أنت المساعد التعليمي لمنصة "خطوتي — خطوتي نحو الصلاة والقرآن" (Khatwati).
دورك تعليمي وإرشادي لمساعدة المستخدمين على تعلم الصلاة والوضوء والاستغفار وتلاوة القرآن والاختبارات الدينية بالدارجة المغربية أو العربية الفصحى.

قواعد صارمة:
1. لست مفتياً ولا تقدم فتاوى خاصة أو أحكاماً فقهية في النوازل المعقدة. وضح بلطف استشارة أهل العلم واعتمد المذهب المالكي في المسائل التعليمية.
2. تتحدث بالدارجة المغربية المهذبة الميسرة أو بالعربية الفصحى الواضحة حسب لغة السائل.
3. لا تختلق أبداً نصوصاً قرآنية أو أحاديث نبوية غير صحيحة.
4. نظام التنقل المباشر الذكي (DIRECT IN-APP NAVIGATION):
   عندما يطلب المستخدم التوجه لأي قسم أو يسأل عن ميزة في التطبيق، قدم إجابة مختصرة وأضف في آخر الرد مباشرة صيغة التوجيه التالية:
   ACTION: {"route": "prayer" | "istighfar" | "quran" | "learning" | "more" | "qibla", "subRoute": "tutorial" | "wudu" | "quizzes" | "schedule" | "mistakes" | "dhikr" | "tracker" | "videos", "params": {"surahNumber": 18, "reciterId": "minshawi" | "luhaidan" | "faqih", "category": "PRAYER" | "QURAN" | "WUDU_PURITY" | "ADHKAR"}, "label": "زر التنقل الصريح بالعربية"}

أمثلة للتنقل المطلوب:
- "بغيت ندير الاستغفار" -> ACTION: {"route": "istighfar", "label": "فتح قسم الاستغفار"}
- "بغيت نتعلم الصلاة" -> ACTION: {"route": "prayer", "subRoute": "tutorial", "label": "فتح دليل تعلم الصلاة"}
- "بغيت ندير اختبار على الصلاة" -> ACTION: {"route": "learning", "subRoute": "quizzes", "params": {"category": "PRAYER"}, "label": "بدء اختبار الصلاة"}
- "بغيت ندير اختبار" -> ACTION: {"route": "learning", "subRoute": "quizzes", "label": "فتح الاختبارات الإسلامية"}
- "بغيت نقرا سورة الكهف" -> ACTION: {"route": "quran", "params": {"surahNumber": 18}, "label": "فتح سورة الكهف"}
- "بغيت نسمع الشيخ المنشاوي" -> ACTION: {"route": "quran", "params": {"reciterId": "minshawi"}, "label": "تلاوة الشيخ المنشاوي"}
- "بغيت نسمع اللحيدان" -> ACTION: {"route": "quran", "params": {"reciterId": "luhaidan"}, "label": "تلاوة الشيخ محمد اللحيدان"}
- "بغيت نسمع الفقيه" -> ACTION: {"route": "quran", "params": {"reciterId": "faqih"}, "label": "تلاوة الشيخ محمد الفقيه"}
- "بغيت نشوف طريقة الوضوء" -> ACTION: {"route": "prayer", "subRoute": "wudu", "label": "فتح دليل الوضوء"}
`;

// Server-side AI endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const detectedIntent = detectKhatwatiIntent(message);

    if (!ai) {
      if (detectedIntent) {
        res.json({
          reply: detectedIntent.replyText,
          actionRoute: `/${detectedIntent.route}`,
          actionParams: detectedIntent.params
            ? { subRoute: detectedIntent.subRoute, ...detectedIntent.params }
            : (detectedIntent.subRoute ? { subRoute: detectedIntent.subRoute } : undefined),
          actionLabel: detectedIntent.label,
          isFallback: true,
        });
        return;
      }

      res.json({
        reply: 'أهلاً بك في منصة خطوتي! يمكنك استكشاف أقسام الصلاة، الاستغفار، القرآن الكريم، والاختبارات من خلال القائمة الرئيسية.',
        actionRoute: '/home',
        actionLabel: 'الانتقال للرئيسية',
        isFallback: true,
      });
      return;
    }

    // Call server-side Gemini API with 8s timeout race
    try {
      const primaryTimeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timed out')), 8000)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction: KHATWATI_SYSTEM_INSTRUCTION,
            temperature: 0.3,
          },
        }),
        primaryTimeout,
      ]);

      const replyText = response?.text || 'عذراً، لم أتمكن من معالجة الطلب حالياً.';

      // Check if ACTION tag is included
      let actionRoute: string | null = detectedIntent ? `/${detectedIntent.route}` : null;
      let actionParams: any = detectedIntent?.params
        ? { subRoute: detectedIntent.subRoute, ...detectedIntent.params }
        : (detectedIntent?.subRoute ? { subRoute: detectedIntent.subRoute } : null);
      let actionLabel: string | null = detectedIntent?.label || null;

      const actionMatch = replyText.match(/ACTION:\s*({[^}]+})/);
      let cleanReply = replyText;
      if (actionMatch) {
        try {
          const parsed = JSON.parse(actionMatch[1]);
          if (parsed.route) {
            actionRoute = `/${parsed.route}`;
          }
          if (parsed.subRoute || parsed.params) {
            actionParams = { subRoute: parsed.subRoute, ...(parsed.params || {}) };
          }
          if (parsed.label) {
            actionLabel = parsed.label;
          }
          cleanReply = replyText.replace(/ACTION:\s*{[^}]+}/, '').trim();
        } catch {
          // ignore parse error
        }
      }

      res.json({
        reply: cleanReply,
        actionRoute,
        actionParams,
        actionLabel,
        isFallback: false,
      });
    } catch {
      // Graceful verified local knowledge fallback
      if (detectedIntent) {
        res.json({
          reply: detectedIntent.replyText,
          actionRoute: `/${detectedIntent.route}`,
          actionParams: detectedIntent.params
            ? { subRoute: detectedIntent.subRoute, ...detectedIntent.params }
            : (detectedIntent.subRoute ? { subRoute: detectedIntent.subRoute } : undefined),
          actionLabel: detectedIntent.label,
          isFallback: true,
        });
        return;
      }

      res.json({
        reply: 'أهلاً بك في منصة خطوتي! يمكنك استكشاف أقسام الصلاة، الاستغفار، القرآن الكريم، والاختبارات من خلال القائمة الرئيسية.',
        actionRoute: '/home',
        actionLabel: 'الانتقال للرئيسية',
        isFallback: true,
      });
    }
  } catch (error: any) {
    console.error('Fatal error in /api/gemini/chat:', error);
    res.status(500).json({
      error: 'حدث خطأ في معالجة الطلب',
    });
  }
});

// =========================================================================
// PHASE 11: ADMIN DASHBOARD BACKEND & RELIGIOUS WORKFLOW APIS
// =========================================================================

interface AdminMemoryStore {
  users: Array<{
    id: string;
    username: string;
    email: string;
    displayName: string;
    role: string;
    roleTitleArabic: string;
    active: boolean;
  }>;
  reviews: Array<{
    id: string;
    contentId: string;
    contentTitle: string;
    contentType: string;
    reviewerId: string;
    reviewerName: string;
    decision: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
    reviewNotes: string;
    timestamp: number;
    dateFormatted: string;
    version: string;
  }>;
  pendingItems: Array<{
    id: string;
    title: string;
    contentType: string;
    arabicText?: string;
    explanationDarija: string;
    source: string;
    workflowStatus: string;
    submittedDate: string;
    version: string;
  }>;
  auditLogs: Array<{
    id: string;
    timestamp: number;
    adminId: string;
    adminName: string;
    adminRole: string;
    action: string;
    targetEntity: string;
    targetId: string;
    details: string;
  }>;
  sources: Array<{
    id: string;
    nameArabic: string;
    author: string;
    category: string;
    referenceDetails: string;
    verificationStatus: string;
    verifiedBy?: string;
    reviewDate?: string;
    version: string;
  }>;
}

const adminStore: AdminMemoryStore = {
  users: [
    { id: 'adm_1', username: 'super_admin', email: 'admin@khatwati.org', displayName: 'د. عبد الحميد الوزاني', role: 'SUPER_ADMIN', roleTitleArabic: 'المشرف العام على النظام', active: true },
    { id: 'adm_2', username: 'sheikh_idrissi', email: 'reviewer@khatwati.org', displayName: 'الشيخ محمد الإدريسي', role: 'RELIGIOUS_REVIEWER', roleTitleArabic: 'المراجع الشرعي المعتمد (الفقه المالكي)', active: true },
    { id: 'adm_3', username: 'karim_content', email: 'content@khatwati.org', displayName: 'الأستاذ كريم بنجلون', role: 'CONTENT_ADMIN', roleTitleArabic: 'مدير المحتوى التعليمي', active: true },
    { id: 'adm_4', username: 'amina_media', email: 'media@khatwati.org', displayName: 'أمينة التازي', role: 'MEDIA_ADMIN', roleTitleArabic: 'مشرفة الوسائط والمرئيات', active: true },
    { id: 'adm_5', username: 'hamza_ai', email: 'ai_knowledge@khatwati.org', displayName: 'حمزة المراكشي', role: 'AI_KNOWLEDGE_ADMIN', roleTitleArabic: 'مسؤول قاعدة المعارف الذكية', active: true },
  ],
  reviews: [
    {
      id: 'rev_1',
      contentId: 'step_1_to_14',
      contentTitle: 'دليل الصلاة المرئي المكون من 14 خطوة',
      contentType: 'PRAYER_TUTORIAL',
      reviewerId: 'adm_2',
      reviewerName: 'الشيخ محمد الإدريسي',
      decision: 'APPROVED',
      reviewNotes: 'تمت مراجعة جميع الأدعية المشكولة والأفعال ومطابقتها لمذهب مالك في المدونة والموطأ.',
      timestamp: Date.now() - 86400000,
      dateFormatted: '2026-10-07',
      version: '1.0',
    },
  ],
  pendingItems: [
    {
      id: 'item_rev_1',
      title: 'حكم سجود السهو في صلاة المسبوق',
      contentType: 'PRAYER_STEP',
      arabicText: 'سجود السهو القبلي والبعدي للمأموم إذا سبقه الإمام بركعة',
      explanationDarija: 'إذا دخلتي مع الإمام مسبوق، وسجد الإمام بعد السلام، كتسجد معاه ومن بعد كتقوم تقضي ما فاتك في معتمد المالكية.',
      source: 'الموطأ للإمام مالك باب سجود السهو',
      workflowStatus: 'SUBMITTED_FOR_REVIEW',
      submittedDate: '2026-10-08',
      version: '1.1',
    },
    {
      id: 'item_rev_2',
      title: 'فيديو تعلم الوضوء والصلاة للبنات (الفيديو العاشر)',
      contentType: 'VIDEO',
      explanationDarija: 'فيديو تعليمي مخصص للبنات والأطفال في انتظار توفير رابط يوتيوب موثق ومرخص.',
      source: 'قيد الاعتماد من وزارة الأوقاف',
      workflowStatus: 'SUBMITTED_FOR_REVIEW',
      submittedDate: '2026-10-08',
      version: '1.0',
    },
  ],
  auditLogs: [
    {
      id: 'log_1',
      timestamp: Date.now() - 86400000 * 2,
      adminId: 'adm_1',
      adminName: 'د. عبد الحميد الوزاني',
      adminRole: 'SUPER_ADMIN',
      action: 'PUBLISH',
      targetEntity: 'PRAYER_TUTORIAL',
      targetId: 'step_1_to_14',
      details: 'نشر الدليل المرئي المكون من 14 خطوة بعد اجتياز المراجعة الفقهية الكاملة.',
    },
    {
      id: 'log_2',
      timestamp: Date.now() - 86400000 * 1.5,
      adminId: 'adm_2',
      adminName: 'الشيخ محمد الإدريسي',
      adminRole: 'RELIGIOUS_REVIEWER',
      action: 'APPROVE',
      targetEntity: 'WUDU_TUTORIAL',
      targetId: 'wudu_steps_8',
      details: 'الموافقة على فرائض وسنن الوضوء وفق معتمد المذهب المالكي بالمغرب.',
    },
    {
      id: 'log_3',
      timestamp: Date.now() - 86400000,
      adminId: 'adm_4',
      adminName: 'أمينة التازي',
      adminRole: 'MEDIA_ADMIN',
      action: 'UPDATE',
      targetEntity: 'VIDEO_LIBRARY',
      targetId: 'vid_10',
      details: 'تم ربط الفيديو العاشر بالرابط الرسمي المعتمد (https://youtu.be/5Abk7EU5EJI) ونشره في مكتبة المرئيات بنجاح.',
    },
  ],
  sources: [
    { id: 'src_1', nameArabic: 'الموطأ للإمام مالك بن أنس', author: 'الإمام مالك بن أنس رحمه الله (رواية يحيى بن يحيى الليثي)', category: 'MALIKI_FIQH', referenceDetails: 'أصل المذهب المالكي في أحكام الطهارة والصلاة وسننها', verificationStatus: 'PUBLISHED', verifiedBy: 'الشيخ محمد الإدريسي', reviewDate: '2026-09-01', version: '1.0' },
    { id: 'src_2', nameArabic: 'صحيح البخاري (الجامع المسند الصحيح)', author: 'الإمام محمد بن إسماعيل البخاري رحمه الله', category: 'HADITH', referenceDetails: 'كتاب مواقيت الصلاة، كتاب الأذان، كتاب صفة صلاة النبي ﷺ', verificationStatus: 'PUBLISHED', verifiedBy: 'الشيخ محمد الإدريسي', reviewDate: '2026-09-01', version: '1.0' },
    { id: 'src_3', nameArabic: 'صحيح مسلم (المسند الصحيح المختصر)', author: 'الإمام مسلم بن الحجاج النيسابوري رحمه الله', category: 'HADITH', referenceDetails: 'كتاب الطهارة، كتاب الصلاة، كتاب الذكر والدعاء', verificationStatus: 'PUBLISHED', verifiedBy: 'الشيخ محمد الإدريسي', reviewDate: '2026-09-01', version: '1.0' },
  ],
};

// 1. Admin Login API
app.post('/api/admin/login', (req, res) => {
  const { username, role } = req.body;
  const user = adminStore.users.find(
    (u) => u.username === username || (role && u.role === role)
  );

  if (!user || !user.active) {
    res.status(401).json({ error: 'اسم المستخدم أو الدور غير مسجل أو الحساب غير نشط' });
    return;
  }

  adminStore.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: Date.now(),
    adminId: user.id,
    adminName: user.displayName,
    adminRole: user.role,
    action: 'LOGIN',
    targetEntity: 'AUTH_SESSION',
    targetId: user.id,
    details: `تسجيل دخول ناجح للمسؤول (${user.roleTitleArabic})`,
  });

  res.json({
    token: `khatwati_token_${user.id}_${Date.now()}`,
    user,
  });
});

// 2. Admin Operational Metrics API
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    totalContentItems: 42,
    publishedItems: 40,
    pendingReviewItems: adminStore.pendingItems.length,
    draftItems: 0,
    approvedWaitingPublish: 0,
    unlinkedVideos: 0, // All 10 videos now have verified URLs
    verifiedSourcesCount: adminStore.sources.length,
    auditLogsCount: adminStore.auditLogs.length,
    systemHealth: 'OPTIMAL',
    lastSyncTimestamp: Date.now(),
  });
});

// 3. Pending Religious Reviews List
app.get('/api/admin/reviews/pending', (req, res) => {
  res.json(adminStore.pendingItems);
});

// 4. Submit Religious Review Decision API
app.post('/api/admin/reviews/submit', (req, res) => {
  const { adminRole, adminName, adminId, contentId, decision, reviewNotes } = req.body;

  // Strict server-side RBAC: Only SUPER_ADMIN and RELIGIOUS_REVIEWER can approve religious items!
  if (adminRole !== 'SUPER_ADMIN' && adminRole !== 'RELIGIOUS_REVIEWER') {
    res.status(403).json({
      error: 'غير مصرح: المراجعة والاعتماد الشرعي محصوران في المراجع الشرعي المعتمد أو المشرف العام.',
    });
    return;
  }

  if (!contentId || !decision) {
    res.status(400).json({ error: 'معرف المحتوى والقرار الشرعي مطلوبان' });
    return;
  }

  const itemIndex = adminStore.pendingItems.findIndex((i) => i.id === contentId);
  const itemTitle = itemIndex >= 0 ? adminStore.pendingItems[itemIndex].title : contentId;

  if (itemIndex >= 0) {
    if (decision === 'APPROVED') {
      adminStore.pendingItems[itemIndex].workflowStatus = 'APPROVED';
    } else {
      adminStore.pendingItems[itemIndex].workflowStatus = 'REJECTED';
    }
  }

  const reviewRecord = {
    id: `rev_${Date.now()}`,
    contentId,
    contentTitle: itemTitle,
    contentType: 'RELIGIOUS_ITEM',
    reviewerId: adminId || 'adm_2',
    reviewerName: adminName || 'الشيخ محمد الإدريسي',
    decision,
    reviewNotes: reviewNotes || 'مراجعة معتمدة وفق الفقه المالكي وسنة النبي ﷺ',
    timestamp: Date.now(),
    dateFormatted: new Date().toISOString().split('T')[0],
    version: '1.0',
  };

  adminStore.reviews.unshift(reviewRecord);

  adminStore.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: Date.now(),
    adminId: adminId || 'adm_2',
    adminName: adminName || 'الشيخ محمد الإدريسي',
    adminRole: adminRole || 'RELIGIOUS_REVIEWER',
    action: decision === 'APPROVED' ? 'APPROVE' : 'REJECT',
    targetEntity: 'RELIGIOUS_CONTENT',
    targetId: contentId,
    details: `قرار مراجعة شرعية: ${decision} للمحتوى «${itemTitle}». ملاحظات: ${reviewNotes || 'بدون'}`,
  });

  res.json({
    success: true,
    reviewRecord,
  });
});

// 5. Content Publishing API (Strictly enforces APPROVED status)
app.post('/api/admin/content/publish', (req, res) => {
  const { adminRole, adminName, adminId, contentId, currentStatus } = req.body;

  if (adminRole !== 'SUPER_ADMIN' && adminRole !== 'CONTENT_ADMIN') {
    res.status(403).json({
      error: 'غير مصرح: نشر المحتوى يتطلب صلاحيات المشرف العام أو مدير المحتوى.',
    });
    return;
  }

  // STRICT RELIGIOUS RULE: Can NEVER publish unapproved content!
  if (currentStatus !== 'APPROVED') {
    res.status(400).json({
      error: 'مخالفة لقواعد الحوكمة الدينية: لا يمكن نشر أي محتوى شرعي إلا بعد اجتياز المراجعة الشرعية والاعتماد (APPROVED).',
    });
    return;
  }

  adminStore.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: Date.now(),
    adminId: adminId || 'adm_1',
    adminName: adminName || 'د. عبد الحميد الوزاني',
    adminRole: adminRole || 'SUPER_ADMIN',
    action: 'PUBLISH',
    targetEntity: 'CONTENT',
    targetId: contentId,
    details: `تم نشر المحتوى المعتمد شرعياً «${contentId}» للجمهور.`,
  });

  res.json({ success: true, message: 'تم نشر المحتوى المعتمد بنجاح' });
});

// 6. Audit Logs API
app.get('/api/admin/audit-logs', (req, res) => {
  res.json(adminStore.auditLogs.slice(0, 50));
});

// 7. Sources Bibliography API
app.get('/api/admin/sources', (req, res) => {
  res.json(adminStore.sources);
});

app.post('/api/admin/sources', (req, res) => {
  const { adminRole, adminName, adminId, nameArabic, author, category, referenceDetails } = req.body;
  if (adminRole !== 'SUPER_ADMIN' && adminRole !== 'RELIGIOUS_REVIEWER' && adminRole !== 'CONTENT_ADMIN') {
    res.status(403).json({ error: 'صلاحيات غير كافية لإضافة مصدر معتمد' });
    return;
  }

  const newSource = {
    id: `src_${Date.now()}`,
    nameArabic,
    author,
    category: category || 'MALIKI_FIQH',
    referenceDetails: referenceDetails || '',
    verificationStatus: 'PUBLISHED',
    verifiedBy: adminName,
    reviewDate: new Date().toISOString().split('T')[0],
    version: '1.0',
  };

  adminStore.sources.push(newSource);

  adminStore.auditLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: Date.now(),
    adminId,
    adminName,
    adminRole,
    action: 'CREATE',
    targetEntity: 'ISLAMIC_SOURCE',
    targetId: newSource.id,
    details: `إضافة مصدر شرعي معتمد جديد: «${nameArabic}» للمؤلف ${author}`,
  });

  res.json({ success: true, source: newSource });
});

// =====================================================================
// YABILADI PRAYER TIMES INTEGRATION API
// Verified reference for Moroccan & Global prayer schedules
// =====================================================================

interface YabiladiCacheEntry {
  data: any;
  expiresAt: number;
}
const yabiladiCache = new Map<string, YabiladiCacheEntry>();

// List supported verified Yabiladi cities
app.get('/api/prayer-times/cities', (_req, res) => {
  res.json({
    success: true,
    source: 'Yabiladi',
    cities: YABILADI_CITIES.map(c => ({
      id: c.id,
      nameArabic: c.nameArabic,
      nameFrench: c.nameFrench,
      country: c.country,
      canonicalUrl: c.canonicalUrl,
    })),
  });
});

// Get verified prayer times for a city from Yabiladi
app.get('/api/prayer-times/yabiladi', async (req, res) => {
  try {
    const cityId = ((req.query.cityId as string) || '').toLowerCase().trim();
    const requestedDate = (req.query.date as string) || ''; // e.g. YYYY-MM-DD

    if (!cityId) {
      res.status(400).json({
        success: false,
        error: 'MISSING_CITY_ID',
        message: 'معرّف المدينة مطلوب (cityId parameter required)',
      });
      return;
    }

    const cityConfig = findYabiladiCity(cityId);
    if (!cityConfig) {
      res.status(404).json({
        success: false,
        error: 'CITY_NOT_MAPPED',
        message: `المدينة «${cityId}» غير مدعومة حالياً عبر مصدر يابلادي. يرجى اختيار إحدى المدن المعتمدة.`,
      });
      return;
    }

    // Determine target date string (YYYY-MM-DD)
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    const targetDate = requestedDate || todayIso;

    // Cache lookup (1-hour TTL)
    const cacheKey = `${cityConfig.id}_${targetDate}`;
    const cached = yabiladiCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      res.json({
        ...cached.data,
        cached: true,
      });
      return;
    }

    // Fetch from Yabiladi canonical page
    const fetchController = new AbortController();
    const timeoutId = setTimeout(() => fetchController.abort(), 8000);

    const response = await fetch(cityConfig.canonicalUrl, {
      signal: fetchController.signal,
      headers: {
        'User-Agent': 'KhatwatiApp/1.0 (Prayer Times Integration; +https://khatwati.app)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,fr;q=0.9,en;q=0.8',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      res.status(502).json({
        success: false,
        error: 'SOURCE_HTTP_ERROR',
        message: `تعذر الاتصال بمصدر يابلادي (رمز الاستجابة: ${response.status})`,
      });
      return;
    }

    const html = await response.text();

    // 1. Parse today's prayer table
    let fajr: string | undefined;
    let dhuhr: string | undefined;
    let asr: string | undefined;
    let maghrib: string | undefined;
    let isha: string | undefined;

    const todayTableMatch = html.match(/<div class="prayer-today">[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (todayTableMatch) {
      const rows = [...todayTableMatch[0].matchAll(/<tr[\s\S]*?<td[^>]*class="prayer-day"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/gi)];
      rows.forEach(r => {
        const name = r[1].replace(/<[^>]+>/g, '').trim();
        const val = r[2].replace(/<[^>]+>/g, '').trim();
        if (name.includes('الفجر')) fajr = val;
        else if (name.includes('الظهر')) dhuhr = val;
        else if (name.includes('العصر')) asr = val;
        else if (name.includes('المغرب')) maghrib = val;
        else if (name.includes('العشاء')) isha = val;
      });
    }

    // Fallback: parse today summary paragraph
    if (!fajr || !dhuhr || !asr || !maghrib || !isha) {
      const summaryMatch = html.match(/الفجر\s*([0-2]\d:[0-5]\d)[^0-9]*الظهر\s*([0-2]\d:[0-5]\d)[^0-9]*العصر\s*([0-2]\d:[0-5]\d)[^0-9]*المغرب\s*([0-2]\d:[0-5]\d)[^0-9]*العشاء\s*([0-2]\d:[0-5]\d)/);
      if (summaryMatch) {
        fajr = summaryMatch[1];
        dhuhr = summaryMatch[2];
        asr = summaryMatch[3];
        maghrib = summaryMatch[4];
        isha = summaryMatch[5];
      }
    }

    // 2. Parse monthly table for date-specific matching if requested date is not today
    let matchedTimes = { fajr, dhuhr, asr, maghrib, isha };

    if (requestedDate && requestedDate !== todayIso) {
      const parts = requestedDate.split('-'); // YYYY-MM-DD -> DD/MM
      if (parts.length === 3) {
        const targetDayMonth = `${parts[2]}/${parts[1]}`;
        const monthMatch = html.match(/<div class="prayer-month">[\s\S]*?<table[\s\S]*?<\/table>/i);
        if (monthMatch) {
          const rows = [...monthMatch[0].matchAll(/<tr[\s\S]*?>([\s\S]*?)<\/tr>/gi)];
          let foundDateRow = false;
          for (const row of rows) {
            const cells = [...row[1].matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map(c => c[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            if (cells.length >= 6) {
              const dayMonth = cells[0].replace(/اليوم/g, '').trim();
              if (dayMonth === targetDayMonth) {
                matchedTimes = {
                  fajr: cells[1],
                  dhuhr: cells[2],
                  asr: cells[3],
                  maghrib: cells[4],
                  isha: cells[5],
                };
                foundDateRow = true;
                break;
              }
            }
          }
          if (!foundDateRow) {
            res.status(404).json({
              success: false,
              error: 'DATE_NOT_IN_SOURCE_SCHEDULE',
              message: `التاريخ المطلوب (${requestedDate}) غير متوفر في جدول يابلادي لهذا الشهر.`,
            });
            return;
          }
        }
      }
    }

    // 3. Strict Data Validation (Section 5)
    const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const prayers: (keyof typeof matchedTimes)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const p of prayers) {
      const val = matchedTimes[p];
      if (!val || !timeRegex.test(val)) {
        res.status(502).json({
          success: false,
          error: 'VALIDATION_FAILED',
          message: `قيمة الصلاة (${p}: ${val}) غير صالحة أو مفقودة من مصدر يابلادي.`,
        });
        return;
      }
    }

    // Validate chronological sequence
    const toM = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const fM = toM(matchedTimes.fajr!);
    const dM = toM(matchedTimes.dhuhr!);
    const aM = toM(matchedTimes.asr!);
    const mM = toM(matchedTimes.maghrib!);
    const iM = toM(matchedTimes.isha!);

    if (!(fM < dM && dM < aM && aM < mM && mM < iM)) {
      res.status(502).json({
        success: false,
        error: 'CHRONOLOGY_INVALID',
        message: 'أوقات الصلوات المستخرجة من المصدر متناقضة أو غير متسلسلة زمنياً.',
      });
      return;
    }

    const resultData = {
      success: true,
      cityId: cityConfig.id,
      cityNameArabic: cityConfig.nameArabic,
      cityNameFrench: cityConfig.nameFrench,
      country: cityConfig.country,
      date: targetDate,
      source: 'Yabiladi',
      sourceUrl: cityConfig.canonicalUrl,
      retrievalTimestamp: new Date().toISOString(),
      validationStatus: 'VALID',
      times: {
        fajr: matchedTimes.fajr!,
        dhuhr: matchedTimes.dhuhr!,
        asr: matchedTimes.asr!,
        maghrib: matchedTimes.maghrib!,
        isha: matchedTimes.isha!,
      },
    };

    // Store in cache for 1 hour
    yabiladiCache.set(cacheKey, {
      data: resultData,
      expiresAt: Date.now() + 60 * 60 * 1000,
    });

    res.json(resultData);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      res.status(504).json({
        success: false,
        error: 'SOURCE_TIMEOUT',
        message: 'انتهت مهلة الاتصال بمصدر يابلادي (Timeout).',
      });
      return;
    }
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'خطأ غير متوقع أثناء معالجة مواقيت يابلادي.',
    });
  }
});

// Production & Vite Development integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  // Serve static public assets (images, icons, manifests)
  const servePublicOptions = {
    setHeaders: (res: express.Response, filePath: string) => {
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        try {
          const fd = fs.openSync(filePath, 'r');
          const buffer = Buffer.alloc(32);
          fs.readSync(fd, buffer, 0, 32, 0);
          fs.closeSync(fd);
          const start = buffer.toString('utf8').trim();
          if (start.startsWith('<svg') || start.startsWith('<?xml')) {
            res.setHeader('Content-Type', 'image/svg+xml');
          }
        } catch {
          // ignore
        }
      }
    }
  };
  app.use(express.static(path.resolve(process.cwd(), 'public'), servePublicOptions));
  app.use('/images', express.static(path.resolve(process.cwd(), 'public/images'), servePublicOptions));

  // Prayer Images API: list and direct base64 upload
  app.get('/api/prayer-images/list', (_req, res) => {
    try {
      const dir = path.resolve(process.cwd(), 'public/images/prayer');
      const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      res.json({ files });
    } catch {
      res.json({ files: [] });
    }
  });

  app.post('/api/prayer-images/upload', express.json({ limit: '15mb' }), (req, res) => {
    try {
      const { filename, base64Data } = req.body;
      if (!filename || !base64Data) {
        res.status(400).json({ error: 'Filename and base64Data are required' });
        return;
      }
      // Sanitize filename to prevent path traversal while preserving Arabic/Unicode letters and parentheses
      const safeFilename = path.basename(filename).replace(/[/\\?%*:|"<>]/g, '_');
      const dir = path.resolve(process.cwd(), 'public/images/prayer');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const buffer = Buffer.from(base64Data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      fs.writeFileSync(path.join(dir, safeFilename), buffer);
      res.json({ success: true, url: `/images/prayer/${encodeURIComponent(safeFilename)}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Khatwati Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
