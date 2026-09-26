export type UserRole = 'student_contributor' | 'editorial_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  bio: string;
  studentId?: string;
  publicationsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color?: string; // amber, emerald, indigo, rose, stone, sky, purple, teal
  createdAt?: string;
}

export type ArticleCategory = string;

export type ArticleStatus = 
  | 'draft' 
  | 'in_review' 
  | 'revision_requested' 
  | 'approved' 
  | 'published';

export interface Comment {
  id: string;
  articleId: string;
  articleTitle: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorDepartment?: string;
  content: string;
  createdAt: string;
  isReadByAuthor: boolean;
}

export interface EditorialFeedback {
  reviewerName: string;
  decision: 'approved' | 'revision_requested' | 'rejected';
  notes: string;
  date: string;
  targetSection?: string;
}

export interface AIAnalysisResult {
  readabilityScore: number;
  gradeLevel: string;
  clarityScore: number;
  toneAssessment: string;
  grammarIssues: {
    original: string;
    suggestion: string;
    reason: string;
  }[];
  vocabularyElevations: {
    originalWord: string;
    alternative: string;
    contextualRationale: string;
  }[];
  editorialCommendation: string;
  revisionTip: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  authorId: string;
  authorName: string;
  authorDepartment: string;
  authorAvatar?: string;
  category: ArticleCategory;
  coverImage?: string;
  content: string;
  abstract: string;
  readTimeMinutes: number;
  tags: string[];
  status: ArticleStatus;
  editionId?: string;
  sectionName?: string;
  createdAt: string;
  publishedAt?: string;
  likesCount: number;
  likedBy: string[]; // user IDs
  comments: Comment[];
  editorialFeedback?: EditorialFeedback;
  aiAnalysis?: AIAnalysisResult;
  flagged?: boolean;
  flagReason?: string;
}

export interface Edition {
  id: string;
  volume: number;
  issue: number;
  academicYear: string;
  title: string;
  subtitle: string;
  coverImage: string;
  publicationDate: string;
  editorInChief: string;
  managingEditor: string;
  themeDescription: string;
  editorialLetter: string;
  tableOfContents: {
    sectionTitle: string;
    articleIds: string[];
  }[];
  isCurrentSpotlight: boolean;
}

export interface AppNotification {
  id: string;
  recipientUserId: string;
  type: 'comment' | 'status_change' | 'editorial_note' | 'like';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  articleId?: string;
}
