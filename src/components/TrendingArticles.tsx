import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { Heart, MessageSquare, BookOpen, Search, ArrowUpRight, Tag, Share2, X, Filter } from 'lucide-react';
import { ShareArticleModal } from './ShareArticleModal';

interface TrendingArticlesProps {
  onSelectArticle: (article: Article) => void;
}

export const TrendingArticles: React.FC<TrendingArticlesProps> = ({ onSelectArticle }) => {
  const { articles, categories, popularTags, toggleLikeArticle, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'recent' | 'likes'>('trending');
  const [sharingArticle, setSharingArticle] = useState<Article | null>(null);

  const categoryNames = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  const publishedArticles = useMemo(() => {
    return articles.filter(a => a.status === 'published');
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter(art => {
      const matchCat = selectedCategory === 'All' || art.category === selectedCategory;
      const matchTag = !selectedTag || (art.tags || []).some(t => t.toLowerCase() === selectedTag.toLowerCase());
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        art.title.toLowerCase().includes(q) ||
        art.authorName.toLowerCase().includes(q) ||
        art.authorDepartment.toLowerCase().includes(q) ||
        (art.abstract && art.abstract.toLowerCase().includes(q)) ||
        art.category.toLowerCase().includes(q) ||
        (art.tags || []).some(t => t.toLowerCase().includes(q));

      return matchCat && matchTag && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'likes') return b.likesCount - a.likesCount;
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // trending: combination of likes + comments
      const scoreA = a.likesCount * 2 + a.comments.length * 3;
      const scoreB = b.likesCount * 2 + b.comments.length * 3;
      return scoreB - scoreA;
    });
  }, [publishedArticles, selectedCategory, selectedTag, searchQuery, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedTag(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedTag !== null || searchQuery.trim().length > 0;

  return (
    <section id="trending-articles" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-stone-200 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans mb-1 flex items-center gap-1.5">
              <span>Curated Scholarly & Literary Catalog</span>
              <span className="text-stone-300">·</span>
              <span className="font-mono text-stone-500 font-normal">{publishedArticles.length} Published Manuscripts</span>
            </div>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
              Trending Articles, Poems & Dispatches
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md">
            Peer-reviewed contributions searchable and filterable by editorial category and author tags across all collegiate disciplines.
          </p>
        </div>

        {/* Categories Bar & Search Filter */}
        <div className="space-y-4 mb-8">
          
          {/* Predefined Categories Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg overflow-x-auto scrollbar-none">
            {categoryNames.map(cat => {
              const count = cat === 'All'
                ? publishedArticles.length
                : publishedArticles.filter(a => a.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    selectedCategory === cat ? 'bg-stone-100 text-stone-700' : 'text-stone-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar + Sort + Tag Pills Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, tags (e.g. sci-fi, software development)..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              <span className="text-xs text-stone-400 font-sans hidden sm:inline">Order:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="py-1.5 px-3 text-xs bg-stone-50 border border-stone-200 rounded-md text-stone-700 outline-none cursor-pointer"
              >
                <option value="trending">Sort: Trending Discourse</option>
                <option value="likes">Sort: Most Appreciated</option>
                <option value="recent">Sort: Most Recent</option>
              </select>
            </div>

          </div>

          {/* Tags Filter Strip */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-stone-500 font-medium shrink-0">
              <Tag className="w-3 h-3 text-[#9A3412]" />
              <span>Explore Tags:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {popularTags.slice(0, 10).map(({ tag, count }) => {
                const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();

                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#9A3412] text-white font-semibold shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Indicators & Results Count */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-md text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-stone-500 font-medium">Active filters:</span>
                
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-300 rounded font-medium text-stone-800">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="text-stone-400 hover:text-stone-800 cursor-pointer">×</button>
                  </span>
                )}

                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-[#9A3412] rounded font-mono font-medium text-[#9A3412]">
                    Tag: #{selectedTag}
                    <button onClick={() => setSelectedTag(null)} className="text-[#9A3412] hover:text-stone-900 cursor-pointer">×</button>
                  </span>
                )}

                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-stone-300 rounded text-stone-700">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="text-stone-400 hover:text-stone-800 cursor-pointer">×</button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-stone-500 font-mono">
                  {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#9A3412] hover:underline font-semibold cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Articles Grid (Pattern C: 3-tier editorial salience) */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-stone-200 rounded-lg bg-stone-50 space-y-3">
            <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-medium text-stone-700">No published manuscripts match the selected tags or criteria.</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try choosing another category, clearing your search query, or selecting different tags.
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-2 px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-medium cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const isLiked = article.likedBy.includes(currentUser.id);

              return (
                <article
                  key={article.id}
                  className="flex flex-col bg-[#FBF9F5]/50 border border-stone-200/90 rounded-sm hover:border-stone-400 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
                  onClick={() => onSelectArticle(article)}
                >
                  {/* Optional Card Cover Image */}
                  {article.coverImage && (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Zero-Pill Unboxed Metadata with · separator */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-sans mb-2.5">
                        <span className="text-[#9A3412] font-semibold">{article.category}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{article.readTimeMinutes} min read</span>
                        {article.publishedAt && (
                          <>
                            <span aria-hidden="true" className="text-stone-300">·</span>
                            <span>{article.publishedAt}</span>
                          </>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-stone-900 group-hover:text-[#9A3412] transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                        {article.abstract || article.subtitle}
                      </p>

                      {/* Clickable Tags Badges */}
                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                          {article.tags.map((t, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(selectedTag?.toLowerCase() === t.toLowerCase() ? null : t);
                              }}
                              className={`text-[11px] font-mono px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                                selectedTag?.toLowerCase() === t.toLowerCase()
                                  ? 'bg-[#9A3412] text-white font-semibold'
                                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                              }`}
                              title={`Filter by tag #${t}`}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Author Row */}
                    <div className="pt-5 mt-6 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                      
                      {/* Author */}
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {article.authorAvatar && (
                          <img
                            src={article.authorAvatar}
                            alt={article.authorName}
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover shrink-0 border border-stone-200"
                          />
                        )}
                        <span className="font-medium text-stone-800 truncate">
                          {article.authorName}
                        </span>
                      </div>

                      {/* Interactive Likes, Comments, Share & Inspect */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeArticle(article.id);
                          }}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${
                            isLiked ? 'text-rose-600 font-semibold' : 'hover:text-stone-900'
                          }`}
                          title={isLiked ? 'Liked' : 'Like manuscript'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
                          <span className="font-mono tabular-nums text-xs">{article.likesCount}</span>
                        </button>

                        <div className="flex items-center gap-1 text-stone-500" title={`${article.comments.length} comments`}>
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums text-xs">{article.comments.length}</span>
                        </div>

                        {/* Quick Share Option */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSharingArticle(article);
                          }}
                          className="p-1 text-stone-400 hover:text-[#9A3412] transition-colors cursor-pointer"
                          title="Share Manuscript & Citation"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#9A3412] transition-colors ml-0.5" />
                      </div>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* Share Modal */}
      <ShareArticleModal
        article={sharingArticle}
        isOpen={Boolean(sharingArticle)}
        onClose={() => setSharingArticle(null)}
      />
    </section>
  );
};

