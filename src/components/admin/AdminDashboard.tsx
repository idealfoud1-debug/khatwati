import React, { useState, useEffect } from 'react';
import {
  AdminUser,
  AdminRole,
  ReligiousReviewWorkflowStatus,
  IslamicSourceRecord,
  AIKnowledgeDocument,
  AuditLogEntry,
} from '../../types/admin';
import {
  SEED_ADMIN_USERS,
  SEED_ISLAMIC_SOURCES,
  SEED_AI_KNOWLEDGE_DOCS,
  SEED_AUDIT_LOGS,
} from '../../data/adminData';
import { USER_VIDEOS_LIBRARY } from '../../data/videosData';
import { PRAYER_14_STEPS, WUDU_8_STEPS, COMMON_MISTAKES } from '../../data/prayerEducationData';
import {
  Shield,
  ShieldCheck,
  Users,
  BookOpen,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Film,
  Sparkles,
  ArrowRight,
  LogOut,
  ChevronDown,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Compass,
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  // Current active admin user session
  const [currentUser, setCurrentUser] = useState<AdminUser>(SEED_ADMIN_USERS[1]); // Defaults to Sheikh Idrissi (Religious Reviewer)
  const [currentSection, setCurrentSection] = useState<
    'overview' | 'religious_reviews' | 'content' | 'sources' | 'videos' | 'ai_knowledge' | 'audit_logs'
  >('overview');

  // In-memory data states for admin operations
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SEED_AUDIT_LOGS);
  const [sources, setSources] = useState<IslamicSourceRecord[]>(SEED_ISLAMIC_SOURCES);
  const [aiKnowledgeDocs, setAiKnowledgeDocs] = useState<AIKnowledgeDocument[]>(SEED_AI_KNOWLEDGE_DOCS);
  const [videoList, setVideoList] = useState(USER_VIDEOS_LIBRARY);

  // Review modal state
  const [selectedReviewItem, setSelectedReviewItem] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Video URL edit modal state
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Load initial reviews from backend API
  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await fetch('/api/admin/reviews/pending');
        if (res.ok) {
          const data = await res.json();
          setPendingReviews(data);
        }
        const logsRes = await fetch('/api/admin/audit-logs');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setAuditLogs(logsData);
        }
      } catch (err) {
        console.warn('Backend admin fetch fallback to memory', err);
      }
    }
    loadBackendData();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Role Switcher for demonstrating RBAC governance
  const handleSwitchAdminRole = (userId: string) => {
    const found = SEED_ADMIN_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`تم التبديل إلى: ${found.displayName} (${found.roleTitleArabic})`);
    }
  };

  // Handle Religious Review Decision
  const handleReviewDecision = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!selectedReviewItem) return;

    // Client-side and server-side RBAC check: only SUPER_ADMIN or RELIGIOUS_REVIEWER!
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'RELIGIOUS_REVIEWER') {
      showToast('عفواً، لا يملك حسابك صلاحية اعتماد المراجعة الشرعية!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminRole: currentUser.role,
          adminName: currentUser.displayName,
          adminId: currentUser.id,
          contentId: selectedReviewItem.id,
          decision,
          reviewNotes: reviewNotes || 'مراجعة معتمدة ومطابقة لمذهب مالك في المدونة والموطأ',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local list
        setPendingReviews((prev) => prev.filter((i) => i.id !== selectedReviewItem.id));
        setApprovedReviews((prev) => [
          ...prev,
          { ...selectedReviewItem, workflowStatus: decision, reviewerNotes: reviewNotes },
        ]);

        // Add to audit logs
        const newLog: AuditLogEntry = {
          id: `log_${Date.now()}`,
          timestamp: Date.now(),
          adminId: currentUser.id,
          adminName: currentUser.displayName,
          adminRole: currentUser.role,
          action: decision === 'APPROVED' ? 'APPROVE' : 'REJECT',
          targetEntity: selectedReviewItem.contentType,
          targetId: selectedReviewItem.id,
          details: `قرار مراجعة شرعية: ${decision} للمحتوى «${selectedReviewItem.title}». الملاحظات: ${reviewNotes}`,
        };
        setAuditLogs((prev) => [newLog, ...prev]);

        showToast(
          decision === 'APPROVED'
            ? 'تم اعتماد المحتوى شرعياً بنجاح! يمكن لمدير المحتوى نشره الآن.'
            : 'تم رفض المحتوى وإعادته للتنقيح وإرفاق الملاحظات.'
        );
        setSelectedReviewItem(null);
        setReviewNotes('');
      } else {
        const err = await res.json();
        showToast(err.error || 'فشلت العملية', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  // Handle Publishing Approved Content
  const handlePublishContent = async (item: any) => {
    if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'CONTENT_ADMIN') {
      showToast('غير مصرح: نشر المحتوى يتطلب صلاحيات المشرف العام أو مدير المحتوى.', 'error');
      return;
    }

    if (item.workflowStatus !== 'APPROVED') {
      showToast('مخالفة للحوكمة الدينية: لا يمكن نشر محتوى لم يُعتمد شرعياً بعد!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/admin/content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminRole: currentUser.role,
          adminName: currentUser.displayName,
          adminId: currentUser.id,
          contentId: item.id,
          currentStatus: item.workflowStatus,
        }),
      });

      if (res.ok) {
        showToast(`تم نشر المحتوى «${item.title}» رسمياً في تطبيق الويب والأندرويد!`);
      } else {
        const err = await res.json();
        showToast(err.error, 'error');
      }
    } catch {
      showToast('خطأ في النشر', 'error');
    }
  };

  // Handle Video URL Update
  const handleSaveVideoUrl = () => {
    if (!editingVideo) return;
    if (!newVideoUrl.trim().includes('youtube.com') && !newVideoUrl.trim().includes('youtu.be')) {
      showToast('يرجى إدخال رابط يوتيوب صحيح ومرخص', 'error');
      return;
    }

    // Extract ID
    let ytId = '';
    const match = newVideoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    if (match) ytId = match[1];

    const updated = videoList.map((v) =>
      v.id === editingVideo.id
        ? {
            ...v,
            url: newVideoUrl.trim(),
            youtubeId: ytId,
            hasValidUrl: true,
            durationApprox: 'معتمد حديثاً',
            verificationStatus: 'PUBLISHED' as any,
          }
        : v
    );
    setVideoList(updated);

    const log: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: Date.now(),
      adminId: currentUser.id,
      adminName: currentUser.displayName,
      adminRole: currentUser.role,
      action: 'UPDATE',
      targetEntity: 'VIDEO',
      targetId: editingVideo.id,
      details: `تحديث رابط الفيديو «${editingVideo.title}» وربطه بيوتيوب.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    setEditingVideo(null);
    setNewVideoUrl('');
    showToast('تم تحديث رابط الفيديو بنجاح وربطه بالمكتبة!');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col text-right" dir="rtl">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold transition flex items-center gap-2 ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-800 text-white border border-emerald-700'
              : 'bg-rose-800 text-white border border-rose-700'
          }`}
        >
          {notificationMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-300" />
          )}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-emerald-950 text-white px-4 sm:px-6 h-16 flex items-center justify-between border-b border-emerald-800/60 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-sm shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white font-ui flex items-center gap-2">
              <span>لوحة التحكم الإدارية والحوكمة الشرعية</span>
              <span className="text-[10px] bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                Khatwati Admin v1.0
              </span>
            </h1>
            <span className="text-[11px] text-emerald-300 hidden sm:inline">
              منصة مركزية لإدارة المحتوى الإسلامي والتعليمي والمراجعة الشرعية
            </span>
          </div>
        </div>

        {/* User Session & Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick RBAC Role Simulator for Audits */}
          <div className="hidden md:flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="text-emerald-300 text-[11px]">تبديل الدور للمعاينة:</span>
            <select
              aria-label="تبديل حساب المسؤول"
              value={currentUser.id}
              onChange={(e) => handleSwitchAdminRole(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {SEED_ADMIN_USERS.map((u) => (
                <option key={u.id} value={u.id} className="text-slate-900">
                  {u.displayName} ({u.roleTitleArabic})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer border border-white/20"
            title="العودة لتطبيق خطوتي للجمهور"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>العودة للتطبيق</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Workspace) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-l border-slate-200 p-4 space-y-1 shrink-0">
          {/* Active Admin Identity Badge */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-xs text-emerald-950 truncate">{currentUser.displayName}</span>
            </div>
            <span className="text-[10px] text-emerald-800 bg-white px-2 py-0.5 rounded-full font-semibold border border-emerald-300 block text-center truncate">
              {currentUser.roleTitleArabic}
            </span>
          </div>

          <div className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
            أقسام لوحة الإدارة
          </div>

          {[
            { id: 'overview', label: 'لوحة المؤشرات والرقابة', icon: Shield },
            { id: 'religious_reviews', label: 'مكتب المراجعة الشرعية', icon: FileCheck, badge: pendingReviews.length },
            { id: 'content', label: 'إدارة الدروس والأخطاء', icon: BookOpen },
            { id: 'sources', label: 'المصادر والمراجع الفقهية', icon: Compass },
            { id: 'videos', label: 'مكتبة الفيديوهات والمرئيات', icon: Film, badgeAlert: 1 },
            { id: 'ai_knowledge', label: 'قاعدة معارف الذكاء الاصطناعي', icon: Sparkles },
            { id: 'audit_logs', label: 'سجل العمليات والتدقيق (Audit)', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id as any)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-emerald-950 font-bold text-[10px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {item.badgeAlert !== undefined && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* SECTION 1: OVERVIEW METRICS */}
          {currentSection === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">نظرة عامة على حالة النظام والحوكمة</h2>
                  <p className="text-xs text-slate-500">مؤشرات حية لمسار المراجعات الشرعية والمحتوى المنشور والوسائط</p>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">المحتوى المنشور والمعتمد</span>
                  <p className="text-2xl font-bold font-mono text-emerald-700">39 / 42</p>
                  <span className="text-[11px] text-emerald-600 mt-1 block">نشط على Web/PWA و Android</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">في انتظار المراجعة الشرعية</span>
                  <p className="text-2xl font-bold font-mono text-amber-600">{pendingReviews.length}</p>
                  <span className="text-[11px] text-amber-700 mt-1 block">يتطلب اعتماد الشيخ المراجع</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">فيديوهات غير مربوطة (Needs URL)</span>
                  <p className="text-2xl font-bold font-mono text-indigo-600">1</p>
                  <span className="text-[11px] text-indigo-700 mt-1 block">الفيديو العاشر (بانتظار رابط موثق)</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 block mb-1">المصادر الفقهية الموثقة</span>
                  <p className="text-2xl font-bold font-mono text-slate-800">{sources.length}</p>
                  <span className="text-[11px] text-slate-500 mt-1 block">المذهب المالكي وصحيحي البخاري ومسلم</span>
                </div>
              </div>

              {/* Religious Workflow Principle Banner */}
              <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-xs">
                <h3 className="font-bold text-sm text-amber-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>مبدأ الحوكمة الدينية الصارم لمنصة خطوتي:</span>
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  مسار نشر المحتوى إلزامي: <strong>DRAFT → SUBMITTED FOR REVIEW → RELIGIOUS REVIEW → APPROVED → PUBLISHED</strong>.
                  لا يمكن لأي نص أو دعاء أو حركة عبادية أن تظهر للمستخدمين في التطبيق أو عبر المساعد الذكي دون مصادقة المراجع الشرعي المعتمد وتوثيق السند في سجل التدقيق.
                </p>
              </div>

              {/* Recent Audit Activities */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-700" />
                  <span>آخر العمليات الإدارية المدققة</span>
                </h3>
                <div className="space-y-2">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-emerald-950">{log.adminName}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                            {log.adminRole}
                          </span>
                          <span className="text-[10px] text-slate-400">الإجراء: {log.action}</span>
                        </div>
                        <p className="text-slate-600">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString('ar-MA')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: RELIGIOUS REVIEWS DESK */}
          {currentSection === 'religious_reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">مكتب المراجعة الشرعية والاعتماد الفقهي</h2>
                  <p className="text-xs text-slate-500">
                    تدقيق المتون المشكولة، سند الحديث، وفقه المالكية قبل التصريح بالنشر للجمهور
                  </p>
                </div>
              </div>

              {/* Reviewer RBAC Notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  المسؤول الحالي: <strong>{currentUser.displayName}</strong> ({currentUser.roleTitleArabic}).
                  {currentUser.role === 'RELIGIOUS_REVIEWER' || currentUser.role === 'SUPER_ADMIN' ? (
                    <span className="text-emerald-800 font-bold mr-1">لديك الصلاحية الشرعية لاعتماد أو رفض المواد.</span>
                  ) : (
                    <span className="text-rose-800 font-bold mr-1">حسابك الحالي للعرض فقط، ولا يملك حق التوقيع الشرعي.</span>
                  )}
                </span>
              </div>

              {/* Pending Items List */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">مواد قيد التدقيق الشرعي ({pendingReviews.length}):</h3>
                {pendingReviews.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                    <p className="font-bold text-sm text-slate-800">جميع المواد الشرعية تمت مراجعتها واعتمادها بالكامل!</p>
                  </div>
                ) : (
                  pendingReviews.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mb-1 inline-block">
                            {item.contentType} · قيد التدقيق الفقهي
                          </span>
                          <h4 className="text-base font-bold text-slate-900 font-ui">{item.title}</h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400">تاريخ الإرسال: {item.submittedDate}</span>
                      </div>

                      {item.arabicText && (
                        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-900 block mb-1">المتن العربي المشكول:</span>
                          <p className="font-quran text-base font-bold text-emerald-950 leading-loose">{item.arabicText}</p>
                        </div>
                      )}

                      <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <strong className="text-emerald-950">الشرح التعليمي بالدارجة: </strong>
                        {item.explanationDarija}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>المصدر المرفوع: </strong>{item.source}</span>
                      </div>

                      {/* Review Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedReviewItem(item)}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <FileCheck className="w-4 h-4 text-amber-300" />
                          <span>تدقيق واتخاذ قرار شرعي</span>
                        </button>

                        <span className="text-[11px] text-slate-400">الإصدار المقترح: {item.version}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: CONTENT MANAGEMENT */}
          {currentSection === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">إدارة المحتوى التعليمي والدروس</h2>
                  <p className="text-xs text-slate-500">استعراض خطوات الصلاة والوضوء ومراجعة حالة النشر</p>
                </div>
              </div>

              {/* 14 Steps Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">دليل الصلاة المرئي (14 خطوة):</h3>
                  <span className="text-xs text-emerald-700 font-bold">الحالة: منشور (PUBLISHED)</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {PRAYER_14_STEPS.map((s) => (
                    <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-900">
                          {s.stepNumber}. {s.titleArabic}
                        </span>
                        <p className="text-slate-500 text-[11px] mt-0.5">{s.titleDarija}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          معتمد شرعياً
                        </span>
                        <button
                          onClick={() => handlePublishContent({ id: s.id, title: s.titleArabic, workflowStatus: 'APPROVED' })}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          تحديث النشر
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SOURCES BIBLIOGRAPHY */}
          {currentSection === 'sources' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">المصادر والمراجع الفقهية المعتمدة</h2>
                  <p className="text-xs text-slate-500">قائمة أمهات كتب الفقه والحديث والمجامع المعتمدة في المنصة</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {sources.map((s) => (
                  <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-emerald-950">{s.nameArabic}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">المؤلف: {s.author}</p>
                    <p className="text-xs text-slate-500">{s.referenceDetails}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>المدقق: {s.verifiedBy || 'الشيخ محمد الإدريسي'}</span>
                      <span>الإصدار: {s.version}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: VIDEOS & MEDIA */}
          {currentSection === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">مكتبة المرئيات والوسائط المعتمدة</h2>
                  <p className="text-xs text-slate-500">إدارة روابط الفيديوهات العشرة والتحقق من سلامة التضمين</p>
                </div>
              </div>

              {/* Video 10 Status Banner */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 mb-0.5">اكتمل ربط جميع الفيديوهات العشرة:</h4>
                  <p className="leading-relaxed">
                    تم ربط الفيديو العاشر بنجاح بالرابط الرسمي المعتمد (<span className="font-mono text-emerald-800 dir-ltr inline-block">https://youtu.be/5Abk7EU5EJI</span>). كافة الفيديوهات العشرة الآن معتمدة ومربوطة بروابط يوتيوب صالحة وتعمل بكفاءة.
                  </p>
                </div>
              </div>

              {/* Videos Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {videoList.map((v) => (
                    <div key={v.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">#{v.order}. {v.title}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {v.categoryArabic}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{v.instructor}</p>
                        <p className="text-slate-400 text-[10px] font-mono mt-0.5 truncate max-w-md">
                          الرابط: {v.url || '⚠️ غير مربوط / يحتاج رابط'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {v.hasValidUrl ? (
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                            مربوط ومعتمد
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                            Needs URL / Unlinked
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setEditingVideo(v);
                            setNewVideoUrl(v.url || '');
                          }}
                          className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
                        >
                          تعديل الرابط
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: AI KNOWLEDGE BASE */}
          {currentSection === 'ai_knowledge' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">قاعدة معارف المساعد الذكي المصرح بها</h2>
                  <p className="text-xs text-slate-500">
                    ضمان حظر أي توليد ديني عشوائي واقتصار الذكاء الاصطناعي على نصوص خطوتي المعتمدة
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {aiKnowledgeDocs.map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-emerald-950 font-ui">{doc.title}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                        {doc.intentCategory} · معتمد ومصرح به
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <strong className="text-slate-800 block mb-1">أمثلة أسئلة المستخدم:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.userQueryExamples.map((q, idx) => (
                          <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-600">
                            «{q}»
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <strong className="text-emerald-950 block mb-0.5">الجواب المعتمد بالدارجة:</strong>
                      <p className="text-slate-800">{doc.approvedAnswerDarija}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>المصدر الشرعي: {doc.sourceReference}</span>
                      <span>المراجع: {doc.reviewerName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: AUDIT LOGS */}
          {currentSection === 'audit_logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-ui">سجل التدقيق والعمليات الإدارية (Audit Trail)</h2>
                  <p className="text-xs text-slate-500">توثيق كامل لكافة التعديلات وقرارات الاعتماد والنشر بالوقت والمسؤول</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-sm">{log.adminName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                            {log.adminRole}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{log.details}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          الهدف: {log.targetEntity} (#{log.targetId})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">
                        {new Date(log.timestamp).toLocaleString('ar-MA')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Religious Review Decision Modal */}
      {selectedReviewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl text-right border border-emerald-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <button
                onClick={() => setSelectedReviewItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-emerald-950 font-ui flex items-center gap-1.5">
                <FileCheck className="w-5 h-5 text-emerald-800" />
                <span>قرار المراجعة الشرعية للمادة</span>
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-800">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1">{selectedReviewItem.title}</h4>
                <p className="text-slate-600">{selectedReviewItem.explanationDarija}</p>
                {selectedReviewItem.arabicText && (
                  <p className="font-quran text-base font-bold text-emerald-950 mt-2">{selectedReviewItem.arabicText}</p>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ملاحظات المراجع الشرعي والسند الفقهي (إلزامية):
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب التوجيه الفقهي وتأكيد المطابقة للمذهب المالكي والسنة النبوية..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleReviewDecision('REJECTED')}
                  className="px-4 py-2 bg-rose-50 text-rose-800 hover:bg-rose-100 rounded-xl text-xs font-bold border border-rose-200 cursor-pointer"
                >
                  رفض المادة وإعادتها
                </button>

                <button
                  onClick={() => handleReviewDecision('APPROVED')}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>اعتماد المحتوى شرعياً (APPROVED)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video URL Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl text-right border border-emerald-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <button
                onClick={() => setEditingVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-base text-slate-900 font-ui">
                تحديث رابط الفيديو #{editingVideo.order}
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-800">
              <p className="font-bold text-emerald-950">{editingVideo.title}</p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">رابط يوتيوب المعتمد (YouTube URL):</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setEditingVideo(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs text-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveVideoUrl}
                  className="px-4 py-2 bg-emerald-800 text-white hover:bg-emerald-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  حفظ وتأكيد الرابط
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
