import React, { useState } from 'react';
import { Article } from '../types';
import { X, Check, Copy, Share2, Mail, ExternalLink, QrCode } from 'lucide-react';

interface ShareArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareArticleModal: React.FC<ShareArticleModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);
  const [citationFormat, setCitationFormat] = useState<'bibtex' | 'mla' | 'apa'>('mla');
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !article) return null;

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#article-${article.id}`
    : `https://pratidhwani.campus.edu/#article-${article.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const getCitation = (format: 'bibtex' | 'mla' | 'apa') => {
    const year = article.publishedAt ? article.publishedAt.split('-')[0] : '2026';
    if (format === 'bibtex') {
      const citeKey = `${article.authorName.split(' ').pop()?.toLowerCase() || 'author'}${year}`;
      return `@article{${citeKey},
  author = {${article.authorName}},
  title = {${article.title}},
  journal = {Pratidhwani: Campus Literary & Technical Review},
  volume = {XXVIII},
  year = {${year}},
  category = {${article.category}},
  keywords = {${article.tags.join(', ')}}
}`;
    }
    if (format === 'apa') {
      return `${article.authorName}. (${year}). ${article.title}. Pratidhwani: Campus Literary & Technical Review, 28, online. Retrieved from ${currentUrl}`;
    }
    // MLA
    return `${article.authorName}. "${article.title}." Pratidhwani: Campus Literary & Technical Review, vol. 28, ${year}. Web. <${currentUrl}>.`;
  };

  const handleCopyCitation = async () => {
    const citation = getCitation(citationFormat);
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedCitation(citationFormat);
      setTimeout(() => setCopiedCitation(null), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${article.title} - Pratidhwani`,
          text: `Read "${article.title}" by ${article.authorName} on Pratidhwani.`,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or not supported
      }
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const shareText = encodeURIComponent(`"${article.title}" by ${article.authorName} via @Pratidhwani Review: `);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}&color=1c1917&bgcolor=fbf9f5`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm shadow-2xl max-w-lg w-full overflow-hidden transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#9A3412]" />
            <h3 className="font-editorial-serif text-xl font-medium text-stone-900">
              Share Manuscript
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Article Summary Box */}
          <div className="p-3.5 bg-white border border-stone-200 rounded-sm space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#9A3412] font-semibold">
              {article.category} · Vol. XXVIII
            </div>
            <div className="font-editorial-serif text-base text-stone-900 font-medium leading-snug line-clamp-2">
              {article.title}
            </div>
            <div className="text-xs text-stone-500">
              By {article.authorName} ({article.authorDepartment})
            </div>
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1.5">
                {article.tags.slice(0, 4).map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Copy Link Bar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">
              Direct Manuscript Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded text-stone-700 truncate outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Platforms */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">
              Share to Channels & Campus Hubs
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white border border-stone-200 hover:border-stone-400 rounded text-center transition-colors group cursor-pointer"
              >
                <div className="text-xs font-semibold text-stone-800 group-hover:text-[#9A3412]">X / Twitter</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Post dispatch</div>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white border border-stone-200 hover:border-stone-400 rounded text-center transition-colors group cursor-pointer"
              >
                <div className="text-xs font-semibold text-stone-800 group-hover:text-[#9A3412]">LinkedIn</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Professional</div>
              </a>

              <a
                href={`https://wa.me/?text=${shareText}${encodedUrl}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white border border-stone-200 hover:border-stone-400 rounded text-center transition-colors group cursor-pointer"
              >
                <div className="text-xs font-semibold text-stone-800 group-hover:text-emerald-700">WhatsApp</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Study groups</div>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(`Collegiate Review: ${article.title}`)}&body=${encodeURIComponent(`Hi,\n\nI thought you would find this manuscript from The Quadrangle interesting:\n\n"${article.title}" by ${article.authorName}\nCategory: ${article.category}\n\nRead here:\n${currentUrl}\n\nAbstract:\n${article.abstract}`)}`}
                className="p-2.5 bg-white border border-stone-200 hover:border-stone-400 rounded text-center transition-colors group cursor-pointer flex flex-col items-center justify-center"
              >
                <div className="text-xs font-semibold text-stone-800 group-hover:text-[#9A3412] flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">Faculty / Peer</div>
              </a>
            </div>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Device Share Menu (AirDrop / Nearby Share)</span>
              </button>
            )}
          </div>

          {/* Academic Citation Generator */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">
                Academic & Archival Citation
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                {(['mla', 'apa', 'bibtex'] as const).map(fmt => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-2 py-0.5 rounded uppercase font-mono text-[10px] cursor-pointer transition-colors ${
                      citationFormat === fmt
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'text-stone-500 hover:text-stone-900 bg-stone-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed">
              {getCitation(citationFormat)}
            </div>

            <button
              type="button"
              onClick={handleCopyCitation}
              className="w-full py-2 border border-stone-300 hover:bg-stone-50 text-stone-800 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedCitation === citationFormat ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Citation Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy {citationFormat.toUpperCase()} Citation</span>
                </>
              )}
            </button>
          </div>

          {/* QR Code for Campus Print Broadside / Bulletin */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowQR(!showQR)}
                className="text-xs text-[#9A3412] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQR ? 'Hide Campus QR Placard' : 'Generate Campus QR Placard (Scan to Read)'}</span>
              </button>
            </div>

            {showQR && (
              <div className="mt-3 p-4 bg-white border border-stone-200 rounded flex flex-col items-center justify-center text-center space-y-2">
                <img
                  src={qrImageUrl}
                  alt="QR Code"
                  className="w-36 h-36 border border-stone-200 p-1 rounded"
                />
                <div className="text-[11px] text-stone-500 max-w-xs">
                  Scan with any smartphone camera to open "{article.title}" directly in the reading room.
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
