import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User, Article, Edition, AppNotification, ArticleStatus, Comment, Category, UserRole } from '../types';
import { INITIAL_USERS, INITIAL_ARTICLES, INITIAL_EDITION, INITIAL_NOTIFICATIONS, BANNED_KEYWORDS, INITIAL_CATEGORIES } from '../data/initialData';

export interface RealTimeSession {
  sessionId: string;
  status: 'authenticated' | 'syncing' | 'guest';
  lastPing: string;
  device: string;
  activeRole: UserRole;
  socketConnected: boolean;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];
  articles: Article[];
  categories: Category[];
  currentEdition: Edition;
  notifications: AppNotification[];
  bannedKeywords: string[];
  allTags: string[];
  popularTags: { tag: string; count: number }[];
  realTimeSession: RealTimeSession;
  loginAs: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  signUpUser: (user: Omit<User, 'id'>) => void;
  addCategory: (cat: { name: string; description: string; color?: string }) => { success: boolean; error?: string };
  updateCategory: (id: string, updated: { name: string; description: string; color?: string }) => { success: boolean; error?: string };
  deleteCategory: (id: string, reassignToCategoryName?: string) => { success: boolean; countAffected: number };
  resetCategoriesToDefault: () => void;
  submitArticle: (articleData: Partial<Article>) => { success: boolean; error?: string };
  updateArticleStatus: (articleId: string, status: ArticleStatus, feedback?: { notes: string; decision: 'approved' | 'revision_requested' | 'rejected'; targetSection?: string }) => void;
  deleteArticle: (articleId: string) => void;
  toggleLikeArticle: (articleId: string) => void;
  addComment: (articleId: string, content: string) => void;
  markNotificationRead: (notificationId: string) => void;
  updateEditionLayout: (updatedEdition: Edition) => void;
  addBannedKeyword: (keyword: string) => void;
  removeBannedKeyword: (keyword: string) => void;
  flagArticle: (articleId: string, reason: string) => void;
  resolveFlag: (articleId: string, action: 'dismiss' | 'remove') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or use defaults
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [currentEdition, setCurrentEdition] = useState<Edition>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_edition');
    return saved ? JSON.parse(saved) : INITIAL_EDITION;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [bannedKeywords, setBannedKeywords] = useState<string[]>(() => {
    const saved = localStorage.getItem('pratidhwani_v1_banned_keywords');
    return saved ? JSON.parse(saved) : BANNED_KEYWORDS;
  });

  // Real-time Authentication session tracking
  const [realTimeSession, setRealTimeSession] = useState<RealTimeSession>(() => ({
    sessionId: `sess-${Date.now().toString(36)}`,
    status: 'authenticated',
    lastPing: 'Live synchronized',
    device: 'Campus Browser Gateway',
    activeRole: currentUser.role,
    socketConnected: true,
  }));

  // Keep realTimeSession activeRole in sync with currentUser
  useEffect(() => {
    setRealTimeSession(prev => ({
      ...prev,
      activeRole: currentUser.role,
      lastPing: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }));
  }, [currentUser]);

  // Periodic heartbeat for real-time authentication session state
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeSession(prev => ({
        ...prev,
        lastPing: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        socketConnected: true,
      }));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_edition', JSON.stringify(currentEdition));
  }, [currentEdition]);

  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pratidhwani_v1_banned_keywords', JSON.stringify(bannedKeywords));
  }, [bannedKeywords]);

  // Derived: All unique tags across all articles sorted alphabetically
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach(art => {
      (art.tags || []).forEach(t => {
        if (t && t.trim()) tagSet.add(t.trim());
      });
    });
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  // Derived: Popular tags with counts
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach(art => {
      (art.tags || []).forEach(t => {
        const cleaned = t.trim();
        if (cleaned) {
          counts[cleaned] = (counts[cleaned] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [articles]);

  const loginAs = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setRealTimeSession(prev => ({
        ...prev,
        activeRole: target.role,
        lastPing: 'Connected just now',
        status: 'authenticated',
      }));
    }
  };

  const switchRole = (targetRole: UserRole) => {
    const userWithRole = allUsers.find(u => u.role === targetRole);
    if (userWithRole) {
      loginAs(userWithRole.id);
    }
  };

  const logout = () => {
    // Switch to first student contributor as fallback guest session
    loginAs(allUsers[0].id);
  };

  const signUpUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...newUserData,
      id: `user-${Date.now()}`,
      publicationsCount: 0,
      avatar: newUserData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };
    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  // Category Management Handlers
  const addCategory = (catData: { name: string; description: string; color?: string }) => {
    const trimmedName = catData.name.trim();
    if (!trimmedName) {
      return { success: false, error: 'Category name cannot be empty.' };
    }
    const exists = categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      return { success: false, error: `Category "${trimmedName}" already exists.` };
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      description: catData.description.trim() || 'Campus publication discipline and curatorial archive section.',
      color: catData.color || 'amber',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCategories(prev => [...prev, newCategory]);
    return { success: true };
  };

  const updateCategory = (id: string, updated: { name: string; description: string; color?: string }) => {
    const target = categories.find(c => c.id === id);
    if (!target) return { success: false, error: 'Category not found.' };

    const oldName = target.name;
    const newName = updated.name.trim();

    if (!newName) return { success: false, error: 'Category name cannot be empty.' };

    // Update categories list
    setCategories(prev => prev.map(c => c.id === id ? {
      ...c,
      name: newName,
      description: updated.description.trim() || c.description,
      color: updated.color || c.color,
    } : c));

    // Cascade update to articles if name changed
    if (oldName !== newName) {
      setArticles(prev => prev.map(art => art.category === oldName ? { ...art, category: newName } : art));
    }

    return { success: true };
  };

  const deleteCategory = (id: string, reassignToCategoryName?: string) => {
    const target = categories.find(c => c.id === id);
    if (!target) return { success: false, countAffected: 0 };

    const fallback = reassignToCategoryName || (categories.find(c => c.id !== id)?.name || 'General');

    // Count how many articles will be affected
    const affected = articles.filter(a => a.category === target.name).length;

    // Remove category
    setCategories(prev => prev.filter(c => c.id !== id));

    // Reassign affected articles to fallback category
    if (affected > 0) {
      setArticles(prev => prev.map(art => art.category === target.name ? { ...art, category: fallback } : art));
    }

    return { success: true, countAffected: affected };
  };

  const resetCategoriesToDefault = () => {
    setCategories(INITIAL_CATEGORIES);
  };

  const submitArticle = (articleData: Partial<Article>) => {
    // Check moderation rules
    const combinedText = `${articleData.title || ''} ${articleData.content || ''}`.toLowerCase();
    const hitKeyword = bannedKeywords.find(k => combinedText.includes(k.toLowerCase()));

    const words = (articleData.content || '').trim().split(/\s+/).filter(Boolean);
    const readTime = Math.max(1, Math.ceil(words.length / 200));

    // Determine category: use selected, or first predefined category, or fallback
    const defaultCategory = categories[0]?.name || 'Technical Research';
    const chosenCategory = articleData.category || defaultCategory;

    // Clean tags array
    const cleanedTags = (articleData.tags || [])
      .map(t => t.trim())
      .filter(Boolean);

    const newArticle: Article = {
      id: articleData.id || `art-${Date.now()}`,
      title: articleData.title || 'Untitled Manuscript',
      subtitle: articleData.subtitle || '',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorDepartment: currentUser.department,
      authorAvatar: currentUser.avatar,
      category: chosenCategory,
      coverImage: articleData.coverImage || '/src/assets/images/article_neural_poetry_1790412823487.jpg',
      content: articleData.content || '',
      abstract: articleData.abstract || (articleData.content ? articleData.content.slice(0, 180) + '...' : ''),
      readTimeMinutes: readTime,
      tags: cleanedTags.length > 0 ? cleanedTags : ['Campus Literary', 'Scholarly'],
      status: articleData.status || 'in_review',
      createdAt: new Date().toISOString().split('T')[0],
      likesCount: 0,
      likedBy: [],
      comments: [],
      aiAnalysis: articleData.aiAnalysis,
      flagged: Boolean(hitKeyword),
      flagReason: hitKeyword ? `Automatically flagged: contains prohibited phrase "${hitKeyword}"` : undefined,
    };

    setArticles(prev => {
      const existingIdx = prev.findIndex(a => a.id === newArticle.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = { ...copy[existingIdx], ...newArticle };
        return copy;
      }
      return [newArticle, ...prev];
    });

    if (newArticle.status === 'in_review') {
      // Add notification for admins
      const adminNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientUserId: 'user-admin-1',
        type: 'status_change',
        title: 'New Manuscript Submitted',
        message: `${currentUser.name} submitted "${newArticle.title}" for editorial review under ${newArticle.category}.`,
        timestamp: 'Just now',
        read: false,
        articleId: newArticle.id,
      };
      setNotifications(prev => [adminNotif, ...prev]);
    }

    return { success: true };
  };

  const updateArticleStatus = (
    articleId: string,
    status: ArticleStatus,
    feedback?: { notes: string; decision: 'approved' | 'revision_requested' | 'rejected'; targetSection?: string }
  ) => {
    setArticles(prev => prev.map(art => {
      if (art.id !== articleId) return art;
      
      const updated: Article = {
        ...art,
        status,
        publishedAt: status === 'published' ? (art.publishedAt || new Date().toISOString().split('T')[0]) : art.publishedAt,
        sectionName: feedback?.targetSection || art.sectionName,
        editorialFeedback: feedback ? {
          reviewerName: currentUser.name,
          decision: feedback.decision,
          notes: feedback.notes,
          date: new Date().toISOString().split('T')[0],
          targetSection: feedback.targetSection,
        } : art.editorialFeedback,
      };

      // Notify the author
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientUserId: art.authorId,
        type: 'editorial_note',
        title: status === 'approved' ? 'Manuscript Accepted' : status === 'revision_requested' ? 'Revisions Requested' : 'Editorial Update',
        message: feedback?.notes || `Your manuscript "${art.title}" status has been set to ${status}.`,
        timestamp: 'Just now',
        read: false,
        articleId: art.id,
      };
      setNotifications(n => [notif, ...n]);

      return updated;
    }));
  };

  const deleteArticle = (articleId: string) => {
    setArticles(prev => prev.filter(a => a.id !== articleId));
  };

  const toggleLikeArticle = (articleId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id !== articleId) return art;
      const alreadyLiked = art.likedBy.includes(currentUser.id);
      const newLikedBy = alreadyLiked
        ? art.likedBy.filter(id => id !== currentUser.id)
        : [...art.likedBy, currentUser.id];
      const newCount = newLikedBy.length;

      // If liked, notify the author
      if (!alreadyLiked && art.authorId !== currentUser.id) {
        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          recipientUserId: art.authorId,
          type: 'like',
          title: 'Article Liked',
          message: `${currentUser.name} appreciated your work "${art.title}".`,
          timestamp: 'Just now',
          read: false,
          articleId: art.id,
        };
        setNotifications(n => [notif, ...n]);
      }

      return {
        ...art,
        likesCount: newCount,
        likedBy: newLikedBy,
      };
    }));
  };

  const addComment = (articleId: string, content: string) => {
    const targetArticle = articles.find(a => a.id === articleId);
    if (!targetArticle) return;

    // Moderation check on comment
    const hitKeyword = bannedKeywords.find(k => content.toLowerCase().includes(k.toLowerCase()));

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId,
      articleTitle: targetArticle.title,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'editorial_admin' ? 'Editorial Board Admin' : 'Student Contributor',
      authorDepartment: currentUser.department,
      content,
      createdAt: new Date().toISOString().split('T')[0],
      isReadByAuthor: false,
    };

    setArticles(prev => prev.map(art => {
      if (art.id !== articleId) return art;
      return {
        ...art,
        comments: [...art.comments, newComment],
        flagged: art.flagged || Boolean(hitKeyword),
        flagReason: hitKeyword ? `Flagged: comment contains prohibited phrase "${hitKeyword}"` : art.flagReason,
      };
    }));

    // Notify author if comment left by someone else
    if (targetArticle.authorId !== currentUser.id) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        recipientUserId: targetArticle.authorId,
        type: 'comment',
        title: 'New Reader Commentary',
        message: `${currentUser.name} left a review comment on "${targetArticle.title}": "${content.slice(0, 60)}..."`,
        timestamp: 'Just now',
        read: false,
        articleId: targetArticle.id,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const updateEditionLayout = (updatedEdition: Edition) => {
    setCurrentEdition(updatedEdition);
  };

  const addBannedKeyword = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (trimmed && !bannedKeywords.includes(trimmed)) {
      setBannedKeywords(prev => [...prev, trimmed]);
    }
  };

  const removeBannedKeyword = (keyword: string) => {
    setBannedKeywords(prev => prev.filter(k => k !== keyword.toLowerCase()));
  };

  const flagArticle = (articleId: string, reason: string) => {
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, flagged: true, flagReason: reason } : a));
  };

  const resolveFlag = (articleId: string, action: 'dismiss' | 'remove') => {
    if (action === 'dismiss') {
      setArticles(prev => prev.map(a => a.id === articleId ? { ...a, flagged: false, flagReason: undefined } : a));
    } else {
      setArticles(prev => prev.filter(a => a.id !== articleId));
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        allUsers,
        articles,
        categories,
        currentEdition,
        notifications,
        bannedKeywords,
        allTags,
        popularTags,
        realTimeSession,
        loginAs,
        switchRole,
        logout,
        signUpUser,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        submitArticle,
        updateArticleStatus,
        deleteArticle,
        toggleLikeArticle,
        addComment,
        markNotificationRead,
        updateEditionLayout,
        addBannedKeyword,
        removeBannedKeyword,
        flagArticle,
        resolveFlag,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
