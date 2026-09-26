import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Article, ArticleStatus, Edition, Category } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileEdit,
  Sliders,
  Plus,
  Trash2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Tag,
  Edit2,
  RefreshCw,
  Share2,
  FolderPlus,
  X
} from 'lucide-react';
import { ShareArticleModal } from './ShareArticleModal';

interface AdminDashboardProps {
  onOpenArticle: (article: Article) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenArticle }) => {
  const {
    currentUser,
    articles,
    categories,
    currentEdition,
    bannedKeywords,
    popularTags,
    allTags,
    updateArticleStatus,
    updateEditionLayout,
    addBannedKeyword,
    removeBannedKeyword,
    resolveFlag,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategoriesToDefault,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'compiler' | 'moderation' | 'categories'>('queue');
  
  // Manuscript in review modal
  const [selectedManuscript, setSelectedManuscript] = useState<Article | null>(null);
  const [editorialNote, setEditorialNote] = useState('');
  const [targetSection, setTargetSection] = useState('Spotlight Feature');
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  // Queue Filters
  const [queueSearch, setQueueSearch] = useState('');
  const [queueCategory, setQueueCategory] = useState<string>('all');
  const [queueTag, setQueueTag] = useState<string | null>(null);

  // Category Manager State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('amber');
  const [catActionFeedback, setCatActionFeedback] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatColor, setEditCatColor] = useState('amber');

  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignCategoryName, setReassignCategoryName] = useState<string>('');

  // Compiler state
  const [compilerEdition, setCompilerEdition] = useState<Edition>({ ...currentEdition });
  const [compilerSavedMessage, setCompilerSavedMessage] = useState(false);

  // Moderation state
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [moderationSearch, setModerationSearch] = useState('');
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);

  // Queue lists
  const pendingArticles = articles.filter(a => a.status === 'in_review' || a.status === 'revision_requested');
  const approvedArticles = articles.filter(a => a.status === 'approved' || a.status === 'published');
  const flaggedArticles = articles.filter(a => a.flagged);

  // Filtered Queue
  const filteredPendingArticles = useMemo(() => {
    return pendingArticles.filter(art => {
      if (queueCategory !== 'all' && art.category !== queueCategory) return false;
      if (queueTag && !(art.tags || []).some(t => t.toLowerCase() === queueTag.toLowerCase())) return false;
      
      const q = queueSearch.toLowerCase().trim();
      if (q) {
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchAuthor = art.authorName.toLowerCase().includes(q);
        const matchDept = art.authorDepartment.toLowerCase().includes(q);
        const matchCategory = art.category.toLowerCase().includes(q);
        const matchTags = (art.tags || []).some(t => t.toLowerCase().includes(q));
        const matchAbstract = (art.abstract || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchDept && !matchCategory && !matchTags && !matchAbstract) {
          return false;
        }
      }

      return true;
    });
  }, [pendingArticles, queueCategory, queueTag, queueSearch]);

  // Handle decisions
  const handleMakeDecision = (decision: 'approved' | 'revision_requested' | 'rejected') => {
    if (!selectedManuscript) return;

    const newStatus: ArticleStatus =
      decision === 'approved' ? 'published' : decision === 'revision_requested' ? 'revision_requested' : 'draft';

    updateArticleStatus(selectedManuscript.id, newStatus, {
      decision,
      notes: editorialNote || (decision === 'approved' ? 'Unanimously accepted for publication in the Annual Edition.' : 'Revisions requested by the editorial board.'),
      targetSection: decision === 'approved' ? targetSection : undefined,
    });

    // If approved, ensure it's in the edition TOC
    if (decision === 'approved') {
      const updatedTOC = compilerEdition.tableOfContents.map(sec => {
        if (sec.sectionTitle === targetSection) {
          return {
            ...sec,
            articleIds: Array.from(new Set([...sec.articleIds, selectedManuscript.id])),
          };
        }
        return sec;
      });
      const newEd = { ...compilerEdition, tableOfContents: updatedTOC };
      setCompilerEdition(newEd);
      updateEditionLayout(newEd);
    }

    setDecisionFeedback(`Decision recorded: Manuscript set to ${newStatus}. Author notified.`);
    setTimeout(() => {
      setDecisionFeedback(null);
      setSelectedManuscript(null);
      setEditorialNote('');
    }, 1500);
  };

  const handleSaveCompiler = (e: React.FormEvent) => {
    e.preventDefault();
    updateEditionLayout(compilerEdition);
    setCompilerSavedMessage(true);
    setTimeout(() => setCompilerSavedMessage(false), 3000);
  };

  const handleToggleArticleInSection = (sectionTitle: string, articleId: string) => {
    const updatedTOC = compilerEdition.tableOfContents.map(sec => {
      if (sec.sectionTitle === sectionTitle) {
        const hasArt = sec.articleIds.includes(articleId);
        return {
          ...sec,
          articleIds: hasArt ? sec.articleIds.filter(id => id !== articleId) : [...sec.articleIds, articleId],
        };
      }
      return sec;
    });
    setCompilerEdition(prev => ({ ...prev, tableOfContents: updatedTOC }));
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    addBannedKeyword(newKeywordInput);
    setNewKeywordInput('');
  };

  // Category Actions
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const res = addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || 'Curated campus literature & research section.',
      color: newCatColor,
    });

    if (res.success) {
      setCatActionFeedback(`Category "${newCatName}" created successfully.`);
      setNewCatName('');
      setNewCatDesc('');
      setShowAddCategoryModal(false);
      setTimeout(() => setCatActionFeedback(null), 3000);
    } else {
      alert(res.error || 'Failed to add category');
    }
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description);
    setEditCatColor(cat.color || 'amber');
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    updateCategory(editingCategory.id, {
      name: editCatName.trim(),
      description: editCatDesc.trim(),
      color: editCatColor,
    });

    setCatActionFeedback(`Category updated to "${editCatName}". Existing manuscripts synced.`);
    setEditingCategory(null);
    setTimeout(() => setCatActionFeedback(null), 3000);
  };

  const handleStartDeleteCategory = (cat: Category) => {
    setDeletingCategory(cat);
    const other = categories.find(c => c.id !== cat.id);
    setReassignCategoryName(other?.name || 'Technical Research');
  };

  const handleConfirmDeleteCategory = () => {
    if (!deletingCategory) return;
    const res = deleteCategory(deletingCategory.id, reassignCategoryName);
    setCatActionFeedback(
      `Category removed. ${res.countAffected} manuscript(s) safely reassigned to "${reassignCategoryName}".`
    );
    setDeletingCategory(null);
    setTimeout(() => setCatActionFeedback(null), 3500);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Admin Masthead Banner */}
      <div className="bg-stone-900 text-white rounded-sm p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Editorial Board Administration Portal
          </div>
          <h1 className="font-editorial-serif text-2xl sm:text-3xl font-medium mt-1">
            The Quadrangle Review Board Console
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xl">
            Logged in as {currentUser.name} ({currentUser.department}). Overseeing peer reviews, edition pagination, and campus publishing integrity.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-stone-800 px-4 py-2.5 rounded border border-stone-700">
            <div className="text-[10px] text-stone-400 uppercase">Pending Review</div>
            <div className="text-lg font-bold text-amber-300 tabular-nums">
              {pendingArticles.length}
            </div>
          </div>

          <div className="bg-stone-800 px-4 py-2.5 rounded border border-stone-700">
            <div className="text-[10px] text-stone-400 uppercase">Flagged Content</div>
            <div className="text-lg font-bold text-rose-400 tabular-nums">
              {flaggedArticles.length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-8 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'queue'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5 text-amber-400" />
          <span>Editorial Approval Queue ({pendingArticles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-amber-300" />
          <span>Manage Predefined Categories & Tags ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compiler')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'compiler'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#9A3412]" />
          <span>Annual Edition Layout Compiler</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>Banned Content & Moderation ({flaggedArticles.length})</span>
        </button>
      </div>

      {/* Tab 1: Editorial Approval Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
                Manuscript Submissions Awaiting Peer Review
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Filter manuscripts by category and author tags, review AI readability audits, and render official board decisions.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-400">
              {filteredPendingArticles.length} of {pendingArticles.length} queued
            </span>
          </div>

          {/* Queue Filter Bar */}
          <div className="p-4 bg-white border border-stone-200 rounded-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={queueSearch}
                  onChange={e => setQueueSearch(e.target.value)}
                  placeholder="Search submissions by title, author, or tag..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-stone-500 shrink-0">Category:</label>
                <select
                  value={queueCategory}
                  onChange={e => setQueueCategory(e.target.value)}
                  className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded outline-none cursor-pointer"
                >
                  <option value="all">All Predefined Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Popular Tags Quick Filters */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-stone-100 text-xs">
              <span className="text-stone-400 text-[11px] font-medium flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#9A3412]" />
                <span>Filter by Tag:</span>
              </span>
              {popularTags.slice(0, 8).map(({ tag, count }) => {
                const isSelected = queueTag?.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => setQueueTag(isSelected ? null : tag)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#9A3412] text-white font-semibold'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    #{tag} ({count})
                  </button>
                );
              })}
              {(queueTag || queueCategory !== 'all' || queueSearch) && (
                <button
                  onClick={() => {
                    setQueueTag(null);
                    setQueueCategory('all');
                    setQueueSearch('');
                  }}
                  className="text-[11px] text-[#9A3412] hover:underline ml-auto font-medium cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {filteredPendingArticles.length === 0 ? (
            <div className="p-12 text-center bg-white border border-stone-200 rounded-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-stone-800">No submissions matching the active filters.</p>
              {(queueTag || queueCategory !== 'all' || queueSearch) && (
                <button
                  onClick={() => {
                    setQueueTag(null);
                    setQueueCategory('all');
                    setQueueSearch('');
                  }}
                  className="text-xs text-[#9A3412] hover:underline font-medium cursor-pointer"
                >
                  Clear Queue Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPendingArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-white border border-stone-200 rounded-sm p-6 hover:border-stone-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-sans flex-wrap">
                      <span className="text-[#9A3412] font-semibold">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-stone-800">Author: {art.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{art.authorDepartment}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-stone-400">Submitted {art.createdAt}</span>
                    </div>

                    <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-stone-900">
                      {art.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {art.abstract || art.content.slice(0, 180) + '...'}
                    </p>

                    {/* Tags on Submission Card */}
                    {art.tags && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {art.tags.map((t, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => setQueueTag(queueTag?.toLowerCase() === t.toLowerCase() ? null : t)}
                            className={`text-[11px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                              queueTag?.toLowerCase() === t.toLowerCase()
                                ? 'bg-[#9A3412] text-white font-semibold'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                            }`}
                            title={`Filter queue by #${t}`}
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* AI Score pill highlight */}
                    {art.aiAnalysis && (
                      <div className="flex items-center gap-3 text-xs text-stone-600 pt-1">
                        <span className="flex items-center gap-1 text-[#9A3412] font-semibold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Readability: {art.aiAnalysis.readabilityScore}/100</span>
                        </span>
                        <span>·</span>
                        <span>Level: {art.aiAnalysis.gradeLevel}</span>
                        <span>·</span>
                        <span className="text-emerald-700">Clarity: {art.aiAnalysis.clarityScore}%</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedManuscript(art);
                        setEditorialNote(art.editorialFeedback?.notes || '');
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-amber-300" />
                      <span>Review & Decide</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approved Articles Archive view for admins */}
          <div className="pt-10 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-editorial-serif text-xl font-medium text-stone-900">
                Recently Accepted & Published Manuscripts ({approvedArticles.length})
              </h3>
              <span className="text-xs text-stone-400 font-mono">Archive</span>
            </div>
            <div className="bg-white border border-stone-200 rounded-sm divide-y divide-stone-100 text-xs">
              {approvedArticles.map(art => (
                <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-stone-900">{art.title}</span>
                    <span className="text-stone-500 ml-2">by {art.authorName} ({art.authorDepartment})</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#9A3412] font-semibold text-[11px]">{art.category}</span>
                      {art.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-1 rounded font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-emerald-700 font-medium">Published</span>
                    <button
                      onClick={() => setSharingArticle(art)}
                      className="text-stone-500 hover:text-[#9A3412] flex items-center gap-1 cursor-pointer p-1"
                      title="Share manuscript & citation"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                    <button
                      onClick={() => onOpenArticle(art)}
                      className="text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer border border-stone-200 px-2.5 py-1 rounded"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Predefined Categories & Tags Management */}
      {activeTab === 'categories' && (
        <div className="space-y-8 animate-in fade-in">
          
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
                Predefined Categories & Platform Tags Governance
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Define and manage the official set of categories (e.g., 'Creative Writing', 'Technical Research', 'Opinion', 'Campus Life') and monitor article tags.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetCategoriesToDefault}
                className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 rounded text-xs font-medium text-stone-700 cursor-pointer flex items-center gap-1"
                title="Restore canonical defaults"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddCategoryModal(true)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Define New Category</span>
              </button>
            </div>
          </div>

          {catActionFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{catActionFeedback}</span>
            </div>
          )}

          {/* Categories Grid List */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans border-b border-stone-100 pb-2 flex items-center justify-between">
              <span>01. Active Predefined Categories ({categories.length})</span>
              <span className="text-stone-400 font-normal">Available in submission editor & catalog filters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {categories.map(cat => {
                const count = articles.filter(a => a.category === cat.name).length;

                return (
                  <div
                    key={cat.id}
                    className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-3 flex flex-col justify-between hover:border-stone-400 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-editorial-serif text-lg font-medium text-stone-900">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-600">
                          {count} piece{count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 text-xs">
                      <span className="text-[11px] text-stone-400 font-mono">
                        ID: {cat.id.slice(0, 14)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(cat)}
                          className="px-2.5 py-1 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-stone-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartDeleteCategory(cat)}
                          className="p-1 text-stone-400 hover:text-rose-700 transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Tags Explorer */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans border-b border-stone-100 pb-2 flex items-center justify-between">
              <span>02. Platform Tags Explorer ({allTags.length} distinct tags)</span>
              <span className="text-stone-400 font-normal">Tags added by student authors</span>
            </div>

            <p className="text-xs text-stone-600">
              Authors can add multiple tags to their submissions (e.g. 'sci-fi', 'campus events', 'software development'). Click any tag below to inspect articles using it.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {popularTags.map(({ tag, count }) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800"
                >
                  <span className="font-semibold text-stone-900">#{tag}</span>
                  <span className="px-1.5 py-0.2 bg-stone-200/80 rounded text-[10px] text-stone-600 font-bold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Decision Drawer / Modal */}
      {selectedManuscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans">
                  Editorial Redline & Decision Protocol
                </span>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-stone-900">
                  {selectedManuscript.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedManuscript(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable inspection body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {decisionFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{decisionFeedback}</span>
                </div>
              )}

              {/* Author Metadata definitions */}
              <div className="p-4 bg-white border border-stone-200 rounded text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-stone-400 uppercase tracking-wider text-[10px]">Author</div>
                  <div className="font-semibold text-stone-900 mt-0.5">{selectedManuscript.authorName}</div>
                </div>
                <div>
                  <div className="text-stone-400 uppercase tracking-wider text-[10px]">Department</div>
                  <div className="font-semibold text-stone-900 mt-0.5">{selectedManuscript.authorDepartment}</div>
                </div>
                <div>
                  <div className="text-stone-400 uppercase tracking-wider text-[10px]">Category</div>
                  <div className="font-semibold text-[#9A3412] mt-0.5">{selectedManuscript.category}</div>
                </div>
                <div>
                  <div className="text-stone-400 uppercase tracking-wider text-[10px]">Word Count</div>
                  <div className="font-mono font-semibold text-stone-900 mt-0.5">
                    {selectedManuscript.content.trim().split(/\s+/).filter(Boolean).length} words
                  </div>
                </div>
              </div>

              {/* AI Assistant Pre-Flight Metrics */}
              {selectedManuscript.aiAnalysis && (
                <div className="p-4 bg-stone-100/80 border border-stone-200 rounded text-xs space-y-2">
                  <div className="flex items-center justify-between font-semibold text-stone-800">
                    <span className="flex items-center gap-1.5 text-[#9A3412]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Automated AI Grammar & Readability Pre-Flight
                    </span>
                    <span className="font-mono">Flesch Index: {selectedManuscript.aiAnalysis.readabilityScore}/100</span>
                  </div>
                  <p className="text-stone-600 leading-snug">
                    {selectedManuscript.aiAnalysis.toneAssessment}
                  </p>
                  {selectedManuscript.aiAnalysis.editorialCommendation && (
                    <p className="text-emerald-800 font-medium">
                      Commendation: {selectedManuscript.aiAnalysis.editorialCommendation}
                    </p>
                  )}
                </div>
              )}

              {/* Manuscript Text */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
                  Manuscript Body Galley Proof:
                </div>
                <div className="p-5 bg-white border border-stone-200 rounded max-h-80 overflow-y-auto font-serif text-sm text-stone-800 leading-relaxed whitespace-pre-line">
                  {selectedManuscript.content}
                </div>
              </div>

              {/* Section Assignment for Annual Edition */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Target Section in Annual Volume (If Approved):
                </label>
                <select
                  value={targetSection}
                  onChange={e => setTargetSection(e.target.value)}
                  className="w-full sm:w-80 px-3 py-2 text-xs bg-white border border-stone-300 rounded outline-none cursor-pointer"
                >
                  <option value="Spotlight Feature">Spotlight Feature</option>
                  <option value="Technical Dispatches">Technical Dispatches</option>
                  <option value="Poetic Anthology">Poetic Anthology</option>
                  <option value="Gallery & Reviews">Gallery & Reviews</option>
                </select>
              </div>

              {/* Editorial Feedback / Redline Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Official Editorial Feedback & Revision Directives:
                </label>
                <textarea
                  rows={3}
                  value={editorialNote}
                  onChange={e => setEditorialNote(e.target.value)}
                  placeholder="Enter specific commendations or required revisions that will be communicated to the student author..."
                  className="w-full p-3 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none leading-relaxed"
                />
              </div>

              {/* The Three Actions: Approve, Edit / Send Revision, Reject */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleMakeDecision('rejected')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-stone-500" />
                  <span>Reject Manuscript</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleMakeDecision('revision_requested')}
                    className="px-4 py-2 border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-purple-700" />
                    <span>Request Revisions from Author</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMakeDecision('approved')}
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Approve & Publish in Volume</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Annual Edition Layout Compiler */}
      {activeTab === 'compiler' && (
        <div className="space-y-8">
          <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
                Annual Print & Digital Edition Layout Compiler
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Curate Volume metadata, editorial prefatory letter, and assemble approved student manuscripts into thematic sections.
              </p>
            </div>

            {compilerSavedMessage && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edition compiled & published live to broadside!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveCompiler} className="space-y-8">
            
            {/* Metadata Fields */}
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans border-b border-stone-100 pb-2">
                01. Publication Marquee & Theme Definition
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Volume Number
                  </label>
                  <input
                    type="number"
                    value={compilerEdition.volume}
                    onChange={e => setCompilerEdition(p => ({ ...p, volume: parseInt(e.target.value) || 28 }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Issue Number
                  </label>
                  <input
                    type="number"
                    value={compilerEdition.issue}
                    onChange={e => setCompilerEdition(p => ({ ...p, issue: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={compilerEdition.academicYear}
                    onChange={e => setCompilerEdition(p => ({ ...p, academicYear: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Edition Title
                </label>
                <input
                  type="text"
                  value={compilerEdition.title}
                  onChange={e => setCompilerEdition(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-editorial-serif bg-stone-50 border border-stone-200 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Theme Subtitle & Discourse
                </label>
                <input
                  type="text"
                  value={compilerEdition.subtitle}
                  onChange={e => setCompilerEdition(p => ({ ...p, subtitle: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Letter from the Chief Editor
                </label>
                <textarea
                  rows={4}
                  value={compilerEdition.editorialLetter}
                  onChange={e => setCompilerEdition(p => ({ ...p, editorialLetter: e.target.value }))}
                  className="w-full p-3 text-xs bg-stone-50 border border-stone-200 rounded outline-none font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Section Assignment & Layout Compiler */}
            <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans border-b border-stone-100 pb-2">
                02. Section Pagination & Manuscript Inclusion
              </div>

              <div className="space-y-6">
                {compilerEdition.tableOfContents.map((section, secIdx) => (
                  <div key={secIdx} className="p-4 bg-stone-50 border border-stone-200 rounded-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-editorial-serif text-lg font-medium text-stone-900">
                        Section: {section.sectionTitle}
                      </h4>
                      <span className="text-xs font-mono text-stone-500">
                        {section.articleIds.length} pieces compiled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {approvedArticles.map(art => {
                        const isIncluded = section.articleIds.includes(art.id);
                        return (
                          <button
                            type="button"
                            key={art.id}
                            onClick={() => handleToggleArticleInSection(section.sectionTitle, art.id)}
                            className={`p-2.5 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${
                              isIncluded
                                ? 'bg-white border-[#9A3412] ring-1 ring-[#9A3412]'
                                : 'bg-white/60 border-stone-200 hover:border-stone-300 text-stone-600'
                            }`}
                          >
                            <div className="truncate mr-2">
                              <div className="font-medium text-stone-900 truncate">{art.title}</div>
                              <div className="text-[10px] text-stone-500">{art.authorName} · {art.category}</div>
                            </div>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isIncluded ? 'bg-[#9A3412] text-white' : 'bg-stone-100 text-stone-500'}`}>
                              {isIncluded ? 'Included' : '+ Add'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>Compile & Publish Broadside Edition</span>
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Tab 3: Banned Content & Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-8">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
              Content Moderation & Policy Governance
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Automated rule enforcement, prohibited phrases (academic dishonesty, essay mills, harassment), and flagged content adjudications.
            </p>
          </div>

          {/* Flagged Items Queue */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="text-xs uppercase tracking-widest text-rose-700 font-semibold font-sans border-b border-stone-100 pb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Flagged Manuscripts & Submissions Queue ({flaggedArticles.length})
            </div>

            {flaggedArticles.length === 0 ? (
              <div className="p-6 bg-stone-50 rounded text-center text-xs text-stone-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                No content is currently flagged for policy review.
              </div>
            ) : (
              <div className="space-y-3">
                {flaggedArticles.map(art => (
                  <div key={art.id} className="p-4 bg-rose-50/50 border border-rose-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">{art.title}</div>
                      <div className="text-stone-500">By {art.authorName} ({art.authorDepartment})</div>
                      <div className="text-rose-700 font-medium mt-1">
                        Reason: {art.flagReason || 'Reported by user for review'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => resolveFlag(art.id, 'dismiss')}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded hover:bg-stone-50 text-stone-700 cursor-pointer"
                      >
                        Dismiss Flag (Permit)
                      </button>
                      <button
                        onClick={() => resolveFlag(art.id, 'remove')}
                        className="px-3 py-1.5 bg-rose-700 text-white rounded hover:bg-rose-800 cursor-pointer font-medium"
                      >
                        Remove Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Banned Keywords Engine */}
          <div className="bg-white border border-stone-200 rounded-sm p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold font-sans border-b border-stone-100 pb-2">
              Prohibited Lexicon Blacklist (Auto-Flag Engine)
            </div>

            <p className="text-xs text-stone-600">
              Any student submission or reader commentary matching these phrases triggers automated quarantine and flags for review before public circulation.
            </p>

            <form onSubmit={handleAddKeyword} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newKeywordInput}
                onChange={e => setNewKeywordInput(e.target.value)}
                placeholder="Add restricted keyword or phrase..."
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium cursor-pointer"
              >
                Add Rule
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {bannedKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-xs font-mono text-stone-700"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => removeBannedKeyword(kw)}
                    className="text-stone-400 hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
