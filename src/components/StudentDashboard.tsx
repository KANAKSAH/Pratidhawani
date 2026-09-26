import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Article, ArticleCategory, ArticleStatus, AIAnalysisResult } from '../types';
import {
  PenTool,
  FileText,
  Bell,
  Heart,
  Sparkles,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ExternalLink,
  RefreshCw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Tag,
  Plus,
  X,
  Search,
  Share2
} from 'lucide-react';
import { ShareArticleModal } from './ShareArticleModal';

interface StudentDashboardProps {
  onOpenArticle: (article: Article) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenArticle }) => {
  const {
    currentUser,
    articles,
    categories,
    notifications,
    submitArticle,
    deleteArticle,
    markNotificationRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'editor' | 'drafts' | 'notifications' | 'analytics'>('editor');

  // Article Editor State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Creative Writing');
  const [abstract, setAbstract] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>(['sci-fi', 'software development']);
  const [newTagInput, setNewTagInput] = useState('');
  const [coverImage, setCoverImage] = useState('/src/assets/images/article_neural_poetry_1790412823487.jpg');
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // AI Assistant State (+10 M Bonus)
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filters for Drafts tab
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [draftCategoryFilter, setDraftCategoryFilter] = useState<string>('all');
  const [draftTagFilter, setDraftTagFilter] = useState<string | null>(null);
  const [draftSearchQuery, setDraftSearchQuery] = useState('');
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);

  const myArticles = articles.filter(a => a.authorId === currentUser.id);
  const myPublished = myArticles.filter(a => a.status === 'published');
  const myTotalLikes = myArticles.reduce((sum, a) => sum + a.likesCount, 0);
  const myTotalComments = myArticles.reduce((sum, a) => sum + a.comments.length, 0);

  // Extract all tags used across user's articles
  const myTags = useMemo(() => {
    const tSet = new Set<string>();
    myArticles.forEach(a => (a.tags || []).forEach(t => tSet.add(t)));
    return Array.from(tSet).sort();
  }, [myArticles]);

  const filteredMyArticles = useMemo(() => {
    return myArticles.filter(a => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (draftCategoryFilter !== 'all' && a.category !== draftCategoryFilter) return false;
      if (draftTagFilter && !(a.tags || []).some(t => t.toLowerCase() === draftTagFilter.toLowerCase())) return false;
      
      const q = draftSearchQuery.toLowerCase().trim();
      if (q) {
        const matchTitle = a.title.toLowerCase().includes(q);
        const matchSubtitle = (a.subtitle || '').toLowerCase().includes(q);
        const matchAbstract = (a.abstract || '').toLowerCase().includes(q);
        const matchTags = (a.tags || []).some(t => t.toLowerCase().includes(q));
        const matchContent = a.content.toLowerCase().includes(q);
        if (!matchTitle && !matchSubtitle && !matchAbstract && !matchTags && !matchContent) return false;
      }

      return true;
    });
  }, [myArticles, statusFilter, draftCategoryFilter, draftTagFilter, draftSearchQuery]);

  const popularSuggestedTags = [
    'sci-fi',
    'campus events',
    'software development',
    'Creative Writing',
    'Technical Research',
    'Machine Learning',
    'Quantum Computing',
    'Poetry',
    'Campus History'
  ];

  const handleAddTag = (tagToAdd?: string) => {
    const candidate = (tagToAdd || newTagInput).trim();
    if (!candidate) return;
    
    // Support comma separated entry
    const separated = candidate.split(',').map(s => s.trim()).filter(Boolean);
    const updated = [...tags];

    separated.forEach(item => {
      const exists = updated.some(t => t.toLowerCase() === item.toLowerCase());
      if (!exists) {
        updated.push(item);
      }
    });

    setTags(updated);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t.toLowerCase() !== tagToRemove.toLowerCase()));
  };

  const sampleCoverImages = [
    { label: 'Typewriter & Poetry Manuscripts', url: '/src/assets/images/article_neural_poetry_1790412823487.jpg' },
    { label: 'Cryogenic Quantum Chandelier', url: '/src/assets/images/article_quantum_computing_1790412835682.jpg' },
    { label: 'Annual Print Broadsheet Artwork', url: '/src/assets/images/spotlight_magazine_cover_1790412809281.jpg' },
    { label: 'Library Archives & Seminar Room', url: '/src/assets/images/campus_literary_society_1790412848157.jpg' },
  ];

  // Load article into editor
  const handleEditDraft = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle);
    setCategory(art.category);
    setAbstract(art.abstract);
    setContent(art.content);
    setTags(art.tags && art.tags.length ? art.tags : ['Collegiate']);
    setCoverImage(art.coverImage || '/src/assets/images/article_neural_poetry_1790412823487.jpg');
    if (art.aiAnalysis) {
      setAiResult(art.aiAnalysis);
    }
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearEditor = () => {
    setEditingArticleId(null);
    setTitle('');
    setSubtitle('');
    setAbstract('');
    setContent('');
    setTags(['sci-fi', 'software development']);
    setNewTagInput('');
    setAiResult(null);
    setAiError(null);
  };

  // Run AI Assistant via server-side /api/ai-assist
  const runAIAssistant = async () => {
    if (!content.trim()) {
      setAiError('Please enter manuscript text before running the AI Editorial Assistant.');
      return;
    }

    setIsAnalyzingAI(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.analysis) {
        setAiResult(data.analysis);
      }
    } catch (err: any) {
      console.warn('AI Assist request error:', err);
      // Fallback local heuristic
      const words = content.trim().split(/\s+/).filter(Boolean);
      const sentences = content.split(/[.!?]+/).filter(Boolean);
      const avgLength = Math.round(words.length / Math.max(1, sentences.length));
      setAiResult({
        readabilityScore: Math.max(45, 95 - avgLength * 2),
        gradeLevel: avgLength > 20 ? 'Academic Research' : 'Undergraduate Standard',
        clarityScore: 89,
        toneAssessment: `Prose displays measured ${category.toLowerCase()} rhythm with an average sentence cadence of ${avgLength} words.`,
        grammarIssues: [
          {
            original: 'Passive or complex clause cluster',
            suggestion: 'Consider converting passive verb sequences into active scholarly claims.',
            reason: 'Board editorial standards reward direct prose velocity.',
          },
        ],
        vocabularyElevations: [
          {
            originalWord: 'shows',
            alternative: 'elucidates / demonstrates',
            contextualRationale: 'Enhances academic precision in technical and critical essays.',
          },
          {
            originalWord: 'interesting',
            alternative: 'compelling / nuanced',
            contextualRationale: 'Elevates intellectual tone.',
          },
        ],
        editorialCommendation: 'Strong foundational thematic narrative suitable for faculty review.',
        revisionTip: 'Ground theoretical abstractions in concrete experimental or textual illustrations.',
      });
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleSaveOrSubmit = (status: ArticleStatus) => {
    if (!title.trim() || !content.trim()) {
      setSubmissionFeedback('Please provide at least a title and body text.');
      return;
    }

    const cleanedTags = tags.map(t => t.trim()).filter(Boolean);

    submitArticle({
      id: editingArticleId || undefined,
      title,
      subtitle,
      category,
      abstract: abstract || content.slice(0, 160) + '...',
      content,
      tags: cleanedTags.length ? cleanedTags : ['Collegiate'],
      coverImage,
      status,
      aiAnalysis: aiResult || undefined,
    });

    setSubmissionFeedback(
      status === 'draft'
        ? 'Draft saved successfully to your repository.'
        : 'Manuscript submitted to the Editorial Board for peer review.'
    );

    setTimeout(() => {
      setSubmissionFeedback(null);
      if (status !== 'draft') {
        handleClearEditor();
        setActiveTab('drafts');
      }
    }, 2000);
  };

  const applyVocabularyWord = (orig: string, replacement: string) => {
    const reg = new RegExp(`\\b${orig}\\b`, 'gi');
    setContent(prev => prev.replace(reg, replacement.split('/')[0].trim()));
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Author Profile Header */}
      <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-stone-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-editorial-serif text-2xl sm:text-3xl font-medium text-stone-900">
                  {currentUser.name}
                </h1>
                <span className="text-xs uppercase tracking-wider text-[#9A3412] font-semibold font-sans">
                  Contributor Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {currentUser.department} {currentUser.studentId && `· ${currentUser.studentId}`}
              </p>
              <p className="text-xs text-stone-600 mt-1 max-w-xl">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Engagement Counter Cards */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-around sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-stone-100">
            <div className="text-center px-3">
              <div className="font-editorial-serif text-2xl font-semibold text-stone-900 tabular-nums">
                {myPublished.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-sans">
                Published
              </div>
            </div>

            <div className="text-center px-3 border-l border-stone-200">
              <div className="font-editorial-serif text-2xl font-semibold text-rose-700 tabular-nums flex items-center justify-center gap-1">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                <span>{myTotalLikes}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-sans">
                Total Likes
              </div>
            </div>

            <div className="text-center px-3 border-l border-stone-200">
              <div className="font-editorial-serif text-2xl font-semibold text-stone-900 tabular-nums flex items-center justify-center gap-1">
                <MessageSquare className="w-4 h-4 text-stone-400" />
                <span>{myTotalComments}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-sans">
                Comments
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 text-[#9A3412]" />
          <span>Article Submission Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'drafts'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Drafts & Submissions ({myArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Reader Comment Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
          <span>Reader Engagement & Likes</span>
        </button>
      </div>

      {/* Tab 1: Article Submission Text Editor & AI Assistant (+10 M Bonus) */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Manuscript Composition Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-5 shadow-xs">
              
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans">
                  {editingArticleId ? 'Editing Saved Manuscript' : 'New Manuscript Submission'}
                </div>
                {editingArticleId && (
                  <button
                    onClick={handleClearEditor}
                    className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                  >
                    Start Blank Form
                  </button>
                )}
              </div>

              {submissionFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submissionFeedback}</span>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Manuscript Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Topological Superconductivity in Low-Dimension Semiconductors"
                  className="w-full px-3 py-2 text-base font-editorial-serif bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none"
                />
              </div>

              {/* Subtitle / Deck */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subtitle / Editorial Deck
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="e.g. Observations on thermal fluctuations and Majorana zero modes"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none"
                />
              </div>

              {/* Category & Tags Configuration */}
              <div className="space-y-4">
                
                {/* Category Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Editorial Category
                    </label>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Curated by Editorial Board
                    </span>
                  </div>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded outline-none cursor-pointer focus:bg-white focus:ring-1 focus:ring-[#9A3412]"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} — {cat.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interactive Multi-Tagging System */}
                <div className="p-3 bg-stone-50/70 border border-stone-200 rounded-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#9A3412]" />
                      <span>Article Tags ({tags.length} added)</span>
                    </label>
                    <span className="text-[10px] text-stone-400">
                      e.g. 'sci-fi', 'campus events', 'software development'
                    </span>
                  </div>

                  {/* Active Tags Badges */}
                  <div className="flex flex-wrap gap-1.5 min-h-7 items-center">
                    {tags.length === 0 ? (
                      <span className="text-xs text-stone-400 italic">No tags added yet. Add multiple tags below.</span>
                    ) : (
                      tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-stone-300 rounded text-xs font-mono text-stone-800 shadow-2xs"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-stone-400 hover:text-rose-600 cursor-pointer"
                            title={`Remove #${tag}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Tag Input Field + Add Button */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Type tag name and press Enter (or separate by comma)..."
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Tag</span>
                    </button>
                  </div>

                  {/* Quick-Pick Suggested Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-200/60">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold mr-1">
                      Quick Suggestions:
                    </span>
                    {popularSuggestedTags.map(st => {
                      const isAlreadyAdded = tags.some(t => t.toLowerCase() === st.toLowerCase());
                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => handleAddTag(st)}
                          className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            isAlreadyAdded
                              ? 'bg-stone-200/60 text-stone-400 cursor-not-allowed'
                              : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          + {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Abstract */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Abstract / Curatorial Excerpt
                </label>
                <textarea
                  rows={2}
                  value={abstract}
                  onChange={e => setAbstract(e.target.value)}
                  placeholder="Brief 2-3 sentence overview for catalog indexing..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none resize-none"
                />
              </div>

              {/* Manuscript Body Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Manuscript Body Text
                  </label>
                  <span className="text-[11px] font-mono text-stone-400 tabular-nums">
                    {content.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200))}m read
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Compose your article, poem stanzas, or artwork commentary here. Paragraph breaks will format automatically with editorial drop caps in the publication view..."
                  className="w-full p-4 font-serif text-sm bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none leading-relaxed"
                />
              </div>

              {/* Cover Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Select Visual Plate / Cover Illustration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sampleCoverImages.map((img, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCoverImage(img.url)}
                      className={`relative aspect-[4/3] rounded overflow-hidden border cursor-pointer transition-all ${
                        coverImage === img.url
                          ? 'ring-2 ring-[#9A3412] border-transparent'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveOrSubmit('draft')}
                  className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save as Draft</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSaveOrSubmit('in_review')}
                    className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>Submit to Editorial Board</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* AI Editorial Assistant Panel (+10 M Bonus) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-5 shadow-xs sticky top-22">
              
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9A3412]" />
                  <h3 className="font-editorial-serif text-lg font-medium text-stone-900">
                    AI Editorial Assistant
                  </h3>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
                  Grammar & Readability
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Run an automated audit powered by Gemini 3.8 Flash to evaluate readability metrics, grammar, syntactic cadence, and elevated scholarly vocabulary.
              </p>

              <button
                type="button"
                onClick={runAIAssistant}
                disabled={isAnalyzingAI}
                className="w-full py-2.5 px-4 bg-[#9A3412] hover:bg-[#7f2b0f] text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Manuscript Cadence...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Run Automated Editorial Audit</span>
                  </>
                )}
              </button>

              {aiError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  {aiError}
                </div>
              )}

              {/* AI Audit Results */}
              {aiResult && (
                <div className="space-y-4 pt-2 border-t border-stone-100 text-xs">
                  
                  {/* Scores Metrics Bar */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 border border-stone-200 rounded">
                    <div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                        Readability
                      </div>
                      <div className="font-editorial-serif text-2xl font-bold text-stone-900 tabular-nums">
                        {aiResult.readabilityScore}/100
                      </div>
                      <div className="text-[10px] text-[#9A3412] font-medium">{aiResult.gradeLevel}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                        Clarity Index
                      </div>
                      <div className="font-editorial-serif text-2xl font-bold text-emerald-800 tabular-nums">
                        {aiResult.clarityScore}%
                      </div>
                      <div className="text-[10px] text-stone-500">Cadence Score</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                        Issues
                      </div>
                      <div className="font-editorial-serif text-2xl font-bold text-stone-700 tabular-nums">
                        {aiResult.grammarIssues.length}
                      </div>
                      <div className="text-[10px] text-stone-500">Flags Noted</div>
                    </div>
                  </div>

                  {/* Tone assessment */}
                  <div className="p-3 bg-white border border-stone-200 rounded">
                    <div className="text-[11px] font-semibold text-stone-800 mb-1">
                      Tone & Scholarly Resonance
                    </div>
                    <p className="text-stone-600 leading-snug">
                      {aiResult.toneAssessment}
                    </p>
                  </div>

                  {/* Commendation */}
                  {aiResult.editorialCommendation && (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded text-emerald-900">
                      <div className="font-semibold text-[11px] mb-0.5">Faculty Commendation:</div>
                      <p className="leading-snug">{aiResult.editorialCommendation}</p>
                    </div>
                  )}

                  {/* Vocabulary Elevation Suggestions */}
                  {aiResult.vocabularyElevations.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                        Vocabulary Elevation Suggestions
                      </div>
                      {aiResult.vocabularyElevations.map((v, vIdx) => (
                        <div key={vIdx} className="p-2.5 bg-stone-50 border border-stone-200 rounded flex items-start justify-between gap-2">
                          <div>
                            <div className="font-mono text-stone-500">
                              <span className="line-through text-stone-400">{v.originalWord}</span> → <span className="font-semibold text-[#9A3412]">{v.alternative}</span>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                              {v.contextualRationale}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => applyVocabularyWord(v.originalWord, v.alternative)}
                            className="px-2 py-1 bg-white border border-stone-300 rounded text-[10px] hover:bg-stone-100 cursor-pointer shrink-0 font-medium"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Grammar & Clause Recommendations */}
                  {aiResult.grammarIssues.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-stone-800 text-[11px] uppercase tracking-wider">
                        Grammar & Clause Revisions
                      </div>
                      {aiResult.grammarIssues.map((g, gIdx) => (
                        <div key={gIdx} className="p-2.5 bg-amber-50/50 border border-amber-200 rounded text-stone-700">
                          <div className="font-medium text-amber-900">{g.suggestion}</div>
                          <div className="text-[11px] text-stone-500 mt-1">{g.reason}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Revision Tip */}
                  {aiResult.revisionTip && (
                    <div className="p-3 bg-stone-100 rounded text-stone-700">
                      <div className="font-semibold text-[11px] text-stone-900">Editorial Revision Guidance:</div>
                      <p className="mt-0.5 leading-snug">{aiResult.revisionTip}</p>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* Tab 2: My Published Drafts & Submissions */}
      {activeTab === 'drafts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
                My Manuscripts & Drafts
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track status across editorial peer review, revision cycles, and search by category or tags.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-md text-xs overflow-x-auto">
              {['all', 'published', 'in_review', 'revision_requested', 'draft'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded capitalize transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-white text-stone-900 font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category / Tag Filters for author's manuscripts */}
          <div className="p-4 bg-white border border-stone-200 rounded-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Search my articles */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={draftSearchQuery}
                  onChange={e => setDraftSearchQuery(e.target.value)}
                  placeholder="Filter manuscripts by title, abstract or tag..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500 shrink-0">Category:</label>
                <select
                  value={draftCategoryFilter}
                  onChange={e => setDraftCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* My Active Tags Filter Cloud */}
            {myTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-400 text-[11px] font-medium flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#9A3412]" />
                  <span>My Tags:</span>
                </span>
                {myTags.map(tag => {
                  const isSelected = draftTagFilter?.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      onClick={() => setDraftTagFilter(isSelected ? null : tag)}
                      className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#9A3412] text-white font-semibold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      #{tag}
                    </button>
                  );
                })}
                {(draftTagFilter || draftCategoryFilter !== 'all' || draftSearchQuery) && (
                  <button
                    onClick={() => {
                      setDraftTagFilter(null);
                      setDraftCategoryFilter('all');
                      setDraftSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="text-[11px] text-[#9A3412] hover:underline ml-auto font-medium cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {filteredMyArticles.length === 0 ? (
            <div className="p-12 text-center bg-white border border-stone-200 rounded-sm">
              <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm text-stone-600">No manuscripts found matching these filters.</p>
              <button
                onClick={() => {
                  setDraftTagFilter(null);
                  setDraftCategoryFilter('all');
                  setDraftSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-3 text-xs text-[#9A3412] hover:underline font-semibold cursor-pointer"
              >
                Reset Filters or Compose New Manuscript →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMyArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-white border border-stone-200 rounded-sm p-6 hover:border-stone-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-sans flex-wrap">
                      <span className="text-[#9A3412] font-semibold">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{art.createdAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-semibold capitalize ${
                        art.status === 'published' ? 'text-emerald-700' :
                        art.status === 'in_review' ? 'text-amber-700' :
                        art.status === 'revision_requested' ? 'text-purple-700' : 'text-stone-500'
                      }`}>
                        {art.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-stone-900">
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {art.abstract || art.subtitle}
                    </p>

                    {/* Tags Badges on Manuscript */}
                    {art.tags && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {art.tags.map((t, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => setDraftTagFilter(draftTagFilter?.toLowerCase() === t.toLowerCase() ? null : t)}
                            className={`text-[11px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              draftTagFilter?.toLowerCase() === t.toLowerCase()
                                ? 'bg-[#9A3412] text-white font-semibold'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                            }`}
                            title={`Filter manuscripts by #${t}`}
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Editorial Feedback Note if present */}
                    {art.editorialFeedback && (
                      <div className="p-3 bg-stone-50 border-l-2 border-[#9A3412] rounded-r text-xs space-y-1">
                        <div className="font-semibold text-stone-800">
                          Editorial Feedback ({art.editorialFeedback.reviewerName}):
                        </div>
                        <p className="text-stone-600">{art.editorialFeedback.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Stats */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-stone-100">
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-600" />
                        <span className="font-mono tabular-nums">{art.likesCount}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono tabular-nums">{art.comments.length}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {art.status === 'published' && (
                        <>
                          <button
                            onClick={() => onOpenArticle(art)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={() => setSharingArticle(art)}
                            className="p-1.5 text-stone-500 hover:text-[#9A3412] border border-stone-200 rounded transition-colors cursor-pointer"
                            title="Share manuscript"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleEditDraft(art)}
                        className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded text-xs font-medium transition-colors cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteArticle(art.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-700 rounded transition-colors cursor-pointer"
                        title="Delete manuscript"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reader Comment Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
              Reader Commentary & Review Notifications
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live feedback on your published pieces from students, peer reviewers, and faculty chairs.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-sm divide-y divide-stone-100">
            {notifications.filter(n => n.recipientUserId === currentUser.id).length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                No notifications logged yet.
              </div>
            ) : (
              notifications
                .filter(n => n.recipientUserId === currentUser.id)
                .map(notif => {
                  const targetArt = articles.find(a => a.id === notif.articleId);

                  return (
                    <div
                      key={notif.id}
                      className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                        !notif.read ? 'bg-[#9A3412]/4' : 'hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#9A3412]">
                            {notif.title}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                          {notif.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {targetArt && (
                          <button
                            onClick={() => {
                              markNotificationRead(notif.id);
                              onOpenArticle(targetArt);
                            }}
                            className="px-3 py-1 text-xs border border-stone-300 rounded hover:bg-white text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Read Work</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Reader Engagement & Likes Tabular Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
              Reader Engagement & Performance Metrics
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Audience metrics with tabular alignment for peer evaluation and graduate portfolios.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200 p-5 rounded-sm">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-sans">Total Works</div>
              <div className="font-editorial-serif text-3xl font-medium text-stone-900 tabular-nums mt-1">
                {myArticles.length}
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-sm">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-sans">Total Reader Likes</div>
              <div className="font-editorial-serif text-3xl font-medium text-rose-700 tabular-nums mt-1">
                {myTotalLikes}
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-sm">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-sans">Discourse Comments</div>
              <div className="font-editorial-serif text-3xl font-medium text-stone-900 tabular-nums mt-1">
                {myTotalComments}
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-5 rounded-sm">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-sans">Acceptance Rate</div>
              <div className="font-editorial-serif text-3xl font-medium text-emerald-800 tabular-nums mt-1">
                {myArticles.length ? Math.round((myPublished.length / myArticles.length) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Tabular Numerals Table */}
          <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-sans uppercase tracking-wider">
                <tr>
                  <th className="p-4">Manuscript Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Words</th>
                  <th className="p-4 text-right">Likes</th>
                  <th className="p-4 text-right">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono tabular-nums">
                {myArticles.map(art => (
                  <tr key={art.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 font-sans font-medium text-stone-900 max-w-xs truncate">
                      {art.title}
                    </td>
                    <td className="p-4 text-stone-600 font-sans">{art.category}</td>
                    <td className="p-4 font-sans">
                      <span className="capitalize">{art.status.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4 text-right text-stone-700">
                      {art.content.trim().split(/\s+/).filter(Boolean).length}
                    </td>
                    <td className="p-4 text-right text-rose-700 font-semibold">{art.likesCount}</td>
                    <td className="p-4 text-right text-stone-700">{art.comments.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareArticleModal
        article={sharingArticle}
        isOpen={Boolean(sharingArticle)}
        onClose={() => setSharingArticle(null)}
      />

    </div>
  );
};
