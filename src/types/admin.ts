import { ReligiousStatus, VerifiedContentItem } from './index';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'RELIGIOUS_REVIEWER'
  | 'MEDIA_ADMIN'
  | 'AI_KNOWLEDGE_ADMIN'
  | 'NOTIFICATION_ADMIN';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: AdminRole;
  roleTitleArabic: string;
  active: boolean;
  lastLogin?: string;
}

export type ReligiousReviewWorkflowStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'RELIGIOUS_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface ReligiousReviewRecord {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: 'PRAYER_STEP' | 'WUDU_STEP' | 'COMMON_MISTAKE' | 'DHIKR' | 'LESSON' | 'VIDEO' | 'AI_KNOWLEDGE' | 'SOURCE';
  reviewerId: string;
  reviewerName: string;
  decision: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  reviewNotes: string;
  timestamp: number;
  dateFormatted: string;
  version: string;
}

export interface IslamicSourceRecord {
  id: string;
  nameArabic: string;
  author: string;
  category: 'HADITH' | 'QURAN_EXEGESIS' | 'MALIKI_FIQH' | 'SCHOLARLY_COUNCIL';
  referenceDetails: string;
  verificationStatus: ReligiousReviewWorkflowStatus;
  verifiedBy?: string;
  reviewDate?: string;
  version: string;
}

export interface AIKnowledgeDocument {
  id: string;
  intentId: string;
  title: string;
  intentCategory: 'PRAYER' | 'WUDU' | 'QURAN' | 'ADHKAR' | 'NAVIGATION' | 'COMMON_MISTAKE';
  userQueryExamples: string[];
  approvedAnswerArabic: string;
  approvedAnswerDarija: string;
  deepLinkRoute?: string;
  workflowStatus: ReligiousReviewWorkflowStatus;
  sourceReference: string;
  reviewerName?: string;
  reviewDate?: string;
  version: string;
}

export interface NotificationScheduleRecord {
  id: string;
  titleArabic: string;
  messageBodyArabic: string;
  type: 'PRAYER_ALERT' | 'EDUCATIONAL' | 'FRIDAY_REMINDER' | 'DAILY_DHIKR';
  offsetMinutes?: number;
  scheduledTime?: string;
  targetAudience: 'ALL' | 'ADULTS' | 'CHILDREN';
  active: boolean;
  workflowStatus: ReligiousReviewWorkflowStatus;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  adminId: string;
  adminName: string;
  adminRole: AdminRole;
  action: 'LOGIN' | 'CREATE' | 'UPDATE' | 'SUBMIT_REVIEW' | 'APPROVE' | 'REJECT' | 'PUBLISH' | 'UNPUBLISH' | 'DELETE' | 'CHANGE_ROLE';
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress?: string;
}

export interface ContentVersionRecord {
  id: string;
  contentId: string;
  contentType: string;
  version: string;
  timestamp: number;
  authorName: string;
  changesSummary: string;
  snapshot: any;
}
