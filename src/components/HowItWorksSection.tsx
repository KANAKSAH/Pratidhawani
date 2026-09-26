import React from 'react';
import { PenTool, GitPullRequest, BookOpen, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface HowItWorksSectionProps {
  onGoToSubmit: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onGoToSubmit }) => {
  const steps = [
    {
      number: '01',
      title: 'Write & Polish Manuscript',
      subtitle: 'Author Submission & AI Assist',
      icon: PenTool,
      description:
        'Compose technical treatises, poems, critical essays, or visual artwork. Use our embedded AI assistant to audit sentence cadence, Flesch readability, and elevated vocabulary before formal submission.',
      checklist: [
        'Markdown and rich prose formatting',
        'Built-in AI grammar, clarity & vocabulary advisor',
        'Save persistent drafts or direct board dispatch',
      ],
    },
    {
      number: '02',
      title: 'Double-Blind Peer Review',
      subtitle: 'Editorial Redline & Revisions',
      icon: GitPullRequest,
      description:
        'Submissions are assigned to senior student editors and faculty chairs. Manuscripts receive inline editorial critique, factual verification, and constructive feedback before final board voting.',
      checklist: [
        'Rigorous technical & literary rubrics',
        'Direct feedback notes from board reviewers',
        'Collaborative author revision cycles',
      ],
    },
    {
      number: '03',
      title: 'Annual Edition Publication',
      subtitle: 'Print Broadsheet & Permanent Archive',
      icon: BookOpen,
      description:
        'Accepted works are compiled into the official annual volume, assigned formal ISSN and accession metadata, and distributed in university library print archives and the digital broadside reader.',
      checklist: [
        'Curated section spotlighting & cover art',
        'Digital broadside and physical library circulation',
        'Permanent author attribution and citation index',
      ],
    },
  ];

  return (
    <section id="editorial-workflow" className="py-16 lg:py-24 bg-[#FBF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans mb-1">
            Curatorial Process & Standards
          </div>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
            How It Works: From Student Manuscript to Archival Print
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Pratidhwani maintains the editorial rigor of an academic journal alongside the creative spirit of a campus broadsheet. Every piece progresses through our three-tier review pipeline.
          </p>
        </div>

        {/* 3 Steps Grid with Natural Editorial Numbering (01., 02., 03.) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white border border-stone-200 rounded-sm p-7 flex flex-col justify-between shadow-xs relative"
              >
                <div>
                  {/* Step Editorial Index */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <span className="font-editorial-serif text-3xl font-medium text-[#9A3412]">
                      {step.number}.
                    </span>
                    <Icon className="w-5 h-5 text-stone-400" />
                  </div>

                  <div className="text-xs uppercase tracking-wider text-stone-500 font-sans mb-1">
                    {step.subtitle}
                  </div>
                  <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-stone-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2">
                  {step.checklist.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-stone-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Pipeline Banner */}
        <div className="mt-12 p-6 bg-white border border-stone-200 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#9A3412]/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#9A3412]" />
            </div>
            <div>
              <h4 className="font-editorial-serif text-lg font-medium text-stone-900">
                Ready to submit your manuscript for Volume XXIX?
              </h4>
              <p className="text-xs text-stone-500">
                Submissions are open to all currently matriculated undergraduate and graduate scholars.
              </p>
            </div>
          </div>

          <button
            onClick={onGoToSubmit}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0"
          >
            Start Submission in Editor
          </button>
        </div>

      </div>
    </section>
  );
};
