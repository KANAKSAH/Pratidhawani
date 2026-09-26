import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { X, Heart, MessageSquare, Share2, Send, Flag, ShieldAlert, CheckCircle2, BookmarkCheck } from 'lucide-react';
import { ShareArticleModal } from './ShareArticleModal';

interface ArticleReaderModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ article, onClose }) => {
  const { currentUser, toggleLikeArticle, addComment, flagArticle } = useApp();
  const [commentText, setCommentText] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!article) return null;

  const isLiked = article.likedBy.includes(currentUser.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(article.id, commentText);
    setCommentText('');
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagReason.trim()) return;
    flagArticle(article.id, flagReason);
    setFlagSubmitted(true);
    setTimeout(() => {
      setShowFlagModal(false);
      setFlagSubmitted(false);
      setFlagReason('');
    }, 2000);
  };

  const handleCopyCitation = () => {
    const citation = `${article.authorName} (${article.publishedAt ? article.publishedAt.split('-')[0] : '2026'}). "${article.title}". Pratidhwani: Campus Literary & Technical Review, Vol. XXVIII.`;
    navigator.clipboard.writeText(citation);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden">
        
        {/* Top utility reading bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
            <span className="text-[#9A3412] font-semibold">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>Vol. XXVIII Broadside Reader</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{article.readTimeMinutes} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-2.5 py-1.5 text-xs text-white bg-[#9A3412] hover:bg-[#832c0f] rounded font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Share manuscript"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleCopyCitation}
              className="p-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded hover:bg-stone-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Copy Academic Citation"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied Citation!' : 'Cite'}</span>
            </button>

            <button
              onClick={() => setShowFlagModal(true)}
              className="p-1.5 text-xs text-stone-400 hover:text-rose-700 rounded transition-colors cursor-pointer"
              title="Report content to moderation board"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto p-6 sm:p-10 lg:p-12 space-y-8">
          
          {/* Article Header */}
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="font-editorial-serif text-lg sm:text-xl text-stone-600 italic leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Author Byline */}
            <div className="flex items-center justify-between pt-4 border-t border-b border-stone-200 py-3">
              <div className="flex items-center gap-3">
                {article.authorAvatar && (
                  <img
                    src={article.authorAvatar}
                    alt={article.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-stone-300"
                  />
                )}
                <div>
                  <div className="font-semibold text-stone-900 text-sm">{article.authorName}</div>
                  <div className="text-xs text-stone-500">{article.authorDepartment}</div>
                </div>
              </div>

              <div className="text-right text-xs text-stone-500">
                <div>Published {article.publishedAt || article.createdAt}</div>
                <div className="text-[11px] text-stone-400">Peer-Reviewed Manuscript</div>
              </div>
            </div>
          </div>

          {/* Featured Visual Image (if present) */}
          {article.coverImage && (
            <div className="max-w-3xl mx-auto">
              <div className="relative rounded-sm overflow-hidden border border-stone-300 shadow-sm aspect-[16/9] bg-stone-100">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-editorial-serif text-stone-500 italic mt-2 text-center">
                Fig. 1 · Visual accompaniment published alongside "{article.title}"
              </p>
            </div>
          )}

          {/* Reading Column (Strict 65-75ch measure for optimal eye tracking) */}
          <div className="max-w-2xl mx-auto">
            
            {/* Abstract */}
            {article.abstract && (
              <div className="p-5 bg-white border-l-2 border-[#9A3412] shadow-xs rounded-r text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-8">
                <span className="font-semibold not-italic font-sans text-stone-900 mr-1">Abstract:</span>
                {article.abstract}
              </div>
            )}

            {/* Main Text with Drop Cap */}
            <div className="font-serif text-base sm:text-lg text-stone-800 leading-relaxed sm:leading-loose space-y-6">
              {article.content.split('\n\n').map((paragraph, pIdx) => {
                if (!paragraph.trim()) return null;
                const isFirst = pIdx === 0;

                return (
                  <p
                    key={pIdx}
                    className={isFirst ? 'editorial-drop-cap' : ''}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags list */}
            {article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-stone-200">
                <div className="text-xs uppercase tracking-wider text-stone-400 font-sans mb-2 font-semibold">
                  Disciplines & Key Concepts
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-stone-600 font-mono">
                  {article.tags.map((t, idx) => (
                    <span key={idx} className="bg-stone-100 px-2 py-1 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Likes & Engagement Row */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => toggleLikeArticle(article.id)}
                className={`px-4 py-2 rounded-md border text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                    : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{isLiked ? 'Appreciated' : 'Appreciate Work'}</span>
                <span className="font-mono tabular-nums font-semibold ml-1">({article.likesCount})</span>
              </button>

              <div className="text-xs text-stone-500 font-mono">
                {article.comments.length} Reader Comments
              </div>
            </div>

            {/* Reader Commentary Section */}
            <div className="mt-12 pt-8 border-t border-stone-200 space-y-6">
              <div>
                <h3 className="font-editorial-serif text-2xl font-medium text-stone-900">
                  Reader Dialogue & Academic Commentary
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Peer commentary from campus students, faculty reviewers, and literary members.
                </p>
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder={`Leave constructive review as ${currentUser.name} (${currentUser.role === 'editorial_admin' ? 'Board Admin' : 'Student'})...`}
                  required
                  className="w-full p-3 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#9A3412] outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Commentary</span>
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-4 pt-4">
                {article.comments.length === 0 ? (
                  <div className="p-4 bg-stone-50 rounded text-center text-xs text-stone-400">
                    No comments posted yet. Be the first to initiate collegiate discourse on this piece!
                  </div>
                ) : (
                  article.comments.map(c => (
                    <div key={c.id} className="p-4 bg-white border border-stone-200 rounded-sm space-y-2">
                      <div className="flex items-baseline justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900">{c.authorName}</span>
                          <span className="text-[11px] text-[#9A3412] font-mono">{c.authorRole}</span>
                        </div>
                        <span className="text-[11px] text-stone-400 font-mono">{c.createdAt}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                        {c.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Flag / Moderation Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70">
          <div className="bg-white border border-stone-300 rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
              <ShieldAlert className="w-5 h-5" />
              Report Manuscript for Moderation Review
            </div>
            {flagSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                Report logged. The Editorial Admin board will review this manuscript.
              </div>
            ) : (
              <form onSubmit={handleFlagSubmit} className="space-y-3">
                <p className="text-xs text-stone-600">
                  Please specify the policy violation (e.g. plagiarism, academic dishonesty, hate speech, essay mill content):
                </p>
                <textarea
                  rows={3}
                  value={flagReason}
                  onChange={e => setFlagReason(e.target.value)}
                  placeholder="Reason for flagging..."
                  required
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded outline-none focus:ring-1 focus:ring-rose-500"
                />
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setShowFlagModal(false)}
                    className="px-3 py-1.5 border border-stone-300 rounded text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-rose-700 text-white rounded font-medium hover:bg-rose-800 cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareArticleModal
        article={article}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

    </div>
  );
};
