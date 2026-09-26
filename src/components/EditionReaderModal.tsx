import React from 'react';
import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { X, BookOpen, ExternalLink, Printer } from 'lucide-react';

interface EditionReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenArticle: (article: Article) => void;
}

export const EditionReaderModal: React.FC<EditionReaderModalProps> = ({
  isOpen,
  onClose,
  onOpenArticle,
}) => {
  const { currentEdition, articles } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col my-auto overflow-hidden">
        
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-stone-300 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-editorial-serif text-lg font-medium text-stone-900">
              Pratidhwani Digital Broadside
            </span>
            <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans hidden sm:inline">
              Vol. {currentEdition.volume} · Issue {currentEdition.issue}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded hover:bg-stone-50 transition-colors flex items-center gap-1 cursor-pointer"
              title="Print Broadside Galley"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Broadside</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable broadside */}
        <div className="overflow-y-auto p-6 sm:p-12 space-y-12 bg-[#FBF9F5]">
          
          {/* Cover & Volume Marquee */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-300 pb-12">
            <div className="md:col-span-5 flex justify-center">
              <div className="max-w-xs w-full shadow-2xl rounded-sm border border-stone-400 overflow-hidden aspect-[3/4]">
                <img
                  src={currentEdition.coverImage}
                  alt={currentEdition.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans">
                Official Campus Print & Digital Archive
              </div>
              <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
                {currentEdition.title}
              </h1>
              <p className="font-editorial-serif text-xl text-stone-700 italic">
                {currentEdition.subtitle}
              </p>
              <div className="text-xs text-stone-500 font-mono space-y-1 pt-2">
                <div>Academic Year: {currentEdition.academicYear} · Published: {currentEdition.publicationDate}</div>
                <div>Editor-in-Chief: {currentEdition.editorInChief}</div>
                <div>Managing Editor: {currentEdition.managingEditor}</div>
                <div>Catalog Accession: PRATIDHWANI-2026-VOL28-ISSUE1</div>
              </div>
            </div>
          </div>

          {/* Editorial Letter */}
          <div className="max-w-3xl mx-auto space-y-4 bg-white p-8 border border-stone-200 rounded-sm shadow-xs">
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans">
              Prefatory Note from the Editors
            </div>
            <h2 className="font-editorial-serif text-2xl font-medium text-stone-900">
              The Annual Letter from the Editorial Chair
            </h2>
            <div className="font-serif text-sm sm:text-base text-stone-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-stone-100 pt-4">
              {currentEdition.editorialLetter}
            </div>
          </div>

          {/* Table of Contents Section Breakdown */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans text-center">
              Complete Table of Contents
            </div>

            <div className="space-y-8">
              {currentEdition.tableOfContents.map((section, sIdx) => {
                const sectionArticles = articles.filter(a => section.articleIds.includes(a.id));

                return (
                  <div key={sIdx} className="bg-white border border-stone-200 rounded-sm p-6 space-y-4">
                    <h3 className="font-editorial-serif text-xl font-medium text-stone-900 border-b border-stone-200 pb-2">
                      {section.sectionTitle}
                    </h3>

                    {sectionArticles.length === 0 ? (
                      <p className="text-xs text-stone-400 italic">No articles compiled in this section yet.</p>
                    ) : (
                      <div className="divide-y divide-stone-100">
                        {sectionArticles.map(art => (
                          <div
                            key={art.id}
                            className="py-3 flex items-start justify-between gap-4 group cursor-pointer hover:bg-stone-50/80 -mx-2 px-2 rounded transition-colors"
                            onClick={() => {
                              onClose();
                              onOpenArticle(art);
                            }}
                          >
                            <div>
                              <h4 className="font-editorial-serif text-lg font-medium text-stone-900 group-hover:text-[#9A3412] transition-colors">
                                {art.title}
                              </h4>
                              <div className="text-xs text-stone-500 mt-0.5">
                                By {art.authorName} · {art.authorDepartment}
                              </div>
                            </div>
                            <span className="text-xs font-mono text-stone-400 shrink-0 flex items-center gap-1 group-hover:text-[#9A3412]">
                              <span>Read</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
