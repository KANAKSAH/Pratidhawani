import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

interface HeroSpotlightProps {
  onOpenEditionModal: () => void;
  onGoToSubmit: () => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  onOpenEditionModal,
  onGoToSubmit,
}) => {
  const { currentEdition, articles } = useApp();

  const spotlightArticles = articles.filter(a => a.editionId === currentEdition.id && a.status === 'published');

  return (
    <section id="edition-spotlight" className="relative border-b border-stone-200/80 bg-[#FBF9F5] py-14 lg:py-20 overflow-hidden">
      
      {/* Delicate background architectural lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#1c1917_0.75px,transparent_0.75px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-stone-300 pb-4 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans mb-1">
              Current Spotlight Edition · Annual Print & Digital Volume
            </div>
            <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900 text-balance">
              Volume {currentEdition.volume}, Issue {currentEdition.issue}: {currentEdition.title.split(':')[1]?.trim() || currentEdition.title}
            </h1>
          </div>
          <div className="mt-3 md:mt-0 text-xs text-stone-500 font-mono tracking-tight shrink-0">
            Published {currentEdition.publicationDate} · ISSN 2419-8802
          </div>
        </div>

        {/* 2-Column Curatorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Magazine Cover & Physical Presence */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group cursor-pointer max-w-sm w-full" onClick={onOpenEditionModal}>
              {/* Subtle paper shadow framing */}
              <div className="absolute -inset-2 bg-stone-300/60 rounded-sm transform rotate-1 group-hover:rotate-0 transition-transform duration-300 -z-10" />
              <div className="relative overflow-hidden rounded-sm border border-stone-400/40 shadow-xl bg-stone-100 aspect-[3/4]">
                <img
                  src={currentEdition.coverImage}
                  alt={currentEdition.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[11px] uppercase tracking-widest text-amber-200/90 font-mono">
                    Annual Issue
                  </span>
                  <div className="font-editorial-serif text-xl sm:text-2xl font-normal leading-tight text-white mt-1">
                    {currentEdition.title}
                  </div>
                  <div className="text-xs text-stone-300 mt-2 flex items-center gap-2">
                    <span>Click to inspect broadside</span>
                    <ArrowRight className="w-3 h-3 text-amber-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Theme Manifesto & Editorial Letters */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Zero-pill metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-sans">
              <span className="text-[#9A3412] font-semibold">Chief Editor: {currentEdition.editorInChief}</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>Managing: {currentEdition.managingEditor}</span>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <span>Academic Year {currentEdition.academicYear}</span>
            </div>

            <p className="font-editorial-serif text-xl sm:text-2xl text-stone-800 leading-relaxed italic border-l-2 border-[#9A3412] pl-4">
              "{currentEdition.subtitle}"
            </p>

            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {currentEdition.themeDescription}
            </p>

            {/* Table of contents highlights */}
            <div className="bg-white/80 border border-stone-200/90 rounded-md p-5 backdrop-blur-xs">
              <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 font-sans mb-3 flex items-center justify-between">
                <span>Selected Manuscripts in this Issue</span>
                <span className="font-mono text-[11px] text-stone-400">Peer Reviewed</span>
              </div>
              <ul className="divide-y divide-stone-100 text-xs sm:text-sm">
                {spotlightArticles.slice(0, 3).map(art => (
                  <li key={art.id} className="py-2.5 flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-editorial-serif text-stone-900 font-medium text-base hover:text-[#9A3412] transition-colors cursor-pointer">
                        {art.title}
                      </span>
                      <div className="text-xs text-stone-500 mt-0.5">
                        By {art.authorName} · <span className="italic">{art.authorDepartment}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-stone-400 shrink-0">
                      {art.readTimeMinutes}m read
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenEditionModal}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-amber-200" />
                <span>Read Full Digital Issue</span>
              </button>

              <button
                onClick={onGoToSubmit}
                className="px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#9A3412]" />
                <span>Submit for Vol. XXIX Review</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
