import React from 'react';
import { BookMarked, Landmark, Award, Users } from 'lucide-react';
import campusLiterarySociety from '../assets/images/campus_literary_society_1790412848157.jpg';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-society" className="py-16 lg:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-stone-200 gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans mb-1">
              Institutional Heritage · Est. 1984
            </div>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
              Pratidhwani Literary & Technical Society
            </h2>
          </div>
          <div className="text-xs text-stone-500 font-mono">
            Chartered by the Faculty Senate · Student Media Hall Rm 204
          </div>
        </div>

        {/* 2-Column Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          
          {/* Society Archival Photo */}
          <div className="lg:col-span-6">
            <div className="relative rounded-sm overflow-hidden border border-stone-300 shadow-sm aspect-[16/9] bg-stone-100">
              <img
                src={campusLiterarySociety}
                alt="Pratidhwani editorial board in library archives"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/15" />
            </div>
            <p className="text-xs font-editorial-serif text-stone-500 italic mt-2.5">
              Fig. 1 · The senior copyediting board reviewing proof galley sheets in the library archives, Spring 2026.
            </p>
          </div>

          {/* Society Ethos & Mission */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-stone-900 leading-snug">
              Bridging the C.P. Snow divide between laboratory precision and lyric introspection.
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Founded over four decades ago, Pratidhwani was established on a radical campus premise: that an engineer writing on microfluidics and a humanist composing an ode to grief share the identical intellectual impulse—to delineate form from chaotic noise.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our print editions are housed in the permanent rare book collections of the campus library, while our digital catalog reaches collegiate researchers, peer journals, and student literary circles worldwide.
            </p>

            {/* Zero-Pill Stat Row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              <div>
                <div className="font-editorial-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                  42
                </div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wider font-sans mt-0.5">
                  Years of Print
                </div>
              </div>

              <div>
                <div className="font-editorial-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                  520+
                </div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wider font-sans mt-0.5">
                  Student Authors
                </div>
              </div>

              <div>
                <div className="font-editorial-serif text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                  100%
                </div>
                <div className="text-[11px] text-stone-500 uppercase tracking-wider font-sans mt-0.5">
                  Peer-Reviewed
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Masthead Roster */}
        <div className="bg-[#FBF9F5] border border-stone-200 rounded-sm p-6 sm:p-8">
          <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans mb-4">
            Editorial Masthead & Advisory Board
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="border-l border-stone-300 pl-3">
              <div className="font-semibold text-stone-900">Prof. Gayatri Sengupta</div>
              <div className="text-stone-500">Editor-in-Chief & Faculty Chair</div>
              <div className="text-[11px] text-stone-400 mt-1">Dept. of English & Aesthetics</div>
            </div>

            <div className="border-l border-stone-300 pl-3">
              <div className="font-semibold text-stone-900">Dr. Anand Vardhan</div>
              <div className="text-stone-500">Managing Editor</div>
              <div className="text-[11px] text-stone-400 mt-1">Institute for Science & Society</div>
            </div>

            <div className="border-l border-stone-300 pl-3">
              <div className="font-semibold text-stone-900">Kavya Krishnan</div>
              <div className="text-stone-500">Technical Dispatches Section Editor</div>
              <div className="text-[11px] text-stone-400 mt-1">Computer Science & Indic Linguistics</div>
            </div>

            <div className="border-l border-stone-300 pl-3">
              <div className="font-semibold text-stone-900">Arjun Ramanathan</div>
              <div className="text-stone-500">Physical Sciences Liaison</div>
              <div className="text-[11px] text-stone-400 mt-1">Applied Physics & Quantum Optics</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
