import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, Share2 } from 'lucide-react';

interface TestimonialsAndFooterProps {
  onOpenShareModal?: () => void;
}

export const TestimonialsAndFooter: React.FC<TestimonialsAndFooterProps> = ({ onOpenShareModal }) => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const testimonials = [
    {
      author: 'Kavya Krishnan',
      major: 'B.Tech Computer Science & Indic Linguistics \'26',
      publishedWork: 'Dhvani in the Digital Age (Vol. XXVIII)',
      quote:
        'Before submitting to Pratidhwani, I struggled to find a venue that didn\'t force me to choose between algorithmic transformers and classical Sanskrit aesthetic theory. The board\'s inline redline notes helped me refine my analysis of Anandavardhana’s Dhvanyaloka against self-attention mechanisms. Having my piece bound in the permanent library broadside led directly to our graduate lab grant.',
    },
    {
      author: 'Arjun Ramanathan',
      major: 'B.S. Applied Physics & Condensed Matter \'26',
      publishedWork: 'Bose-Einstein Statistics and Cryogenic Silence (Vol. XXVIII)',
      quote:
        'Most technical papers are stripped of physical atmosphere and historical lineage. Pratidhwani\'s editors encouraged me to connect Satyendra Nath Bose’s 1924 statistical paper with our sub-Kelvin dilution refrigerator. It completely changed how I communicate physics to the wider scientific community.',
    },
    {
      author: 'Devika Nambiar',
      major: 'B.A. Comparative Literature & Philosophy \'25',
      publishedWork: 'Varsha Ritu in the Central Archives (Vol. XXVIII)',
      quote:
        'The print reproduction fidelity is museum-grade. The annual layout compiler and curatorial board treated my monsoon poetic cycle with the same intellectual seriousness afforded to faculty monographs. The feedback from readers across campus was extraordinary.',
    },
  ];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryEmail.trim() || !inquiryMessage.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <footer id="contact-society" className="bg-[#FBF9F5] border-t border-stone-200">
      
      {/* Testimonials Block (Attributable proof per Section H) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 border-b border-stone-200">
        <div className="max-w-3xl mb-12">
          <div className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans mb-1">
            Author Voices & Alumni Impact
          </div>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl font-medium tracking-tight text-stone-900">
            From the Manuscript Desks: Student Author Reviews
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Reflections from published undergraduate and graduate contributors across disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-200 rounded-sm p-6 sm:p-7 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-4">
                {/* Pull quote styling */}
                <p className="font-editorial-serif text-base sm:text-lg text-stone-800 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <div className="font-semibold text-stone-900 text-sm">{t.author}</div>
                <div className="text-xs text-stone-500 mt-0.5">{t.major}</div>
                <div className="text-xs text-[#9A3412] font-medium mt-1">
                  Published: {t.publishedWork}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section & Editorial Office Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Chief Editor Contact & Office Hours */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#9A3412] font-semibold font-sans">
                Correspondence & Office Hours
              </span>
              <h3 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-stone-900 mt-1">
                Contact the Chief Editor
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Inquiries regarding manuscript queries, peer review candidacy, library exchange volumes, or permissions may be addressed directly to the editorial board.
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Prof. Gayatri Sengupta & Dr. Anand Vardhan, Editorial Chairs</div>
                  <a
                    href="mailto:editor@quadrangle-review.edu"
                    className="text-[#9A3412] hover:underline"
                  >
                    editor@quadrangle-review.edu
                  </a>
                  <div className="text-[11px] text-stone-400">Institutional PGP Key: 0x9AF4 31C9</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Student Media Hall · Room 204</div>
                  <div className="text-stone-500">Low Memorial Quadrangle, Central Campus</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#9A3412] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900">Weekly Open Manuscript Critiques</div>
                  <div className="text-stone-500">Tuesdays & Thursdays: 16:00 – 18:30 EST</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100/80 border border-stone-200 rounded text-xs text-stone-600">
              <span className="font-semibold text-stone-800">Volume XXIX Deadlines:</span> Spring submission window closes on April 15, 2026. Peer review notices returned within 21 days.
            </div>
          </div>

          {/* Right Column: Direct Editorial Dispatch Form */}
          <div className="lg:col-span-6 bg-white border border-stone-200 rounded-sm p-6 sm:p-8 shadow-xs">
            <h4 className="font-editorial-serif text-xl font-medium text-stone-900 mb-1">
              Send Dispatch to Editorial Secretariat
            </h4>
            <p className="text-xs text-stone-500 mb-5">
              Submit a formal inquiry or request physical broadside archives for your department.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-medium text-sm">Dispatch Transmitted to Chief Editor</p>
                <p className="text-stone-600">
                  Thank you. The editorial secretariat will reply within two academic business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={inquiryName}
                    onChange={e => setInquiryName(e.target.value)}
                    placeholder="e.g. Kavya Krishnan"
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Campus Email
                  </label>
                  <input
                    type="email"
                    value={inquiryEmail}
                    onChange={e => setInquiryEmail(e.target.value)}
                    placeholder="kavya.krishnan@campus.edu"
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Manuscript Query or Note
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    placeholder="Describe your inquiry or submission question..."
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded focus:bg-white focus:ring-1 focus:ring-[#9A3412] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Query to Chief Editor</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Quiet Editorial Copyright Footer */}
        <div className="pt-12 mt-12 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © 1984–2026 Pratidhwani Literary and Technical Review Society. All rights reserved by respective student authors.
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 text-stone-700 hover:text-[#9A3412] font-sans font-medium transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#9A3412]" />
                <span>Share Website</span>
              </button>
            )}
            <span>·</span>
            <span>ISSN 2419-8802</span>
            <span>·</span>
            <span>CC BY-NC 4.0 Open Campus License</span>
          </div>
        </div>
m
      </div>
    </footer>
  );
};
