import React, { useState } from 'react';
import { X, Check, Copy, Share2, Mail, ExternalLink, QrCode, Smartphone, MessageCircle, Send } from 'lucide-react';

interface ShareWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWebsiteModal: React.FC<ShareWebsiteModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');

  if (!isOpen) return null;

  // Use current production URL or fallback
  const fallbackUrl = 'https://ais-pre-tq5wo3dvbl7beweovhk7id-203078572687.asia-southeast1.run.app';
  const siteUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : fallbackUrl;

  const shareTitle = 'Pratidhwani - Campus Literary & Technical Review';
  const shareMessage = `Explore Pratidhwani (प्रतिध्वनि) — Campus Literary & Technical Review. Read peer-reviewed student research, essays, and poetry or submit your work: ${siteUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: siteUrl,
        });
      } catch (err) {
        // User dismissed
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(siteUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareMessage)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(siteUrl)}&color=1c1917&bgcolor=fbf9f5`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FBF9F5] border border-stone-300 rounded-sm shadow-2xl max-w-lg w-full overflow-hidden transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#9A3412]" />
            <h3 className="font-editorial-serif text-xl font-medium text-stone-900">
              Share Pratidhwani Website
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-sm hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
              activeTab === 'link'
                ? 'border-[#9A3412] text-[#9A3412]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Share Link & Apps
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 text-xs font-semibold cursor-pointer border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-[#9A3412] text-[#9A3412]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Scan QR Code
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'link' ? (
            <>
              {/* URL Copy Box */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1.5 font-sans">
                  Direct Live Website Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={siteUrl}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-sm text-stone-700 select-all focus:outline-none focus:border-[#9A3412]"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      copiedLink
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#9A3412] hover:bg-[#832b0f] text-white'
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
                {copiedLink && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    ✓ Link copied! Ready to paste into WhatsApp, email, or messages.
                  </p>
                )}
              </div>

              {/* Quick Share to Social / Messengers */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2 font-sans">
                  Share Instantly To
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-sm border border-stone-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-stone-700 hover:text-emerald-800 text-xs font-medium group cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-sm border border-stone-200 bg-white hover:border-stone-800 hover:bg-stone-50 transition-all text-stone-700 hover:text-stone-900 text-xs font-medium group cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-stone-800 mb-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X</span>
                  </a>

                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3 rounded-sm border border-stone-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all text-stone-700 hover:text-blue-800 text-xs font-medium group cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-[#0A66C2] mb-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href={mailtoUrl}
                    className="flex flex-col items-center justify-center p-3 rounded-sm border border-stone-200 bg-white hover:border-amber-600 hover:bg-amber-50/50 transition-all text-stone-700 hover:text-amber-900 text-xs font-medium group cursor-pointer"
                  >
                    <Mail className="w-5 h-5 text-amber-700 mb-1 group-hover:scale-110 transition-transform" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Native Mobile Share Sheet if available */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  Open Mobile Share Sheet
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-2">
              <div className="p-3 bg-white border border-stone-200 rounded-sm shadow-sm inline-block">
                <img
                  src={qrImageUrl}
                  alt="QR Code to Pratidhwani Website"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900">
                  Scan with your phone camera
                </h4>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Point any smartphone camera at this QR code to immediately open Pratidhwani on mobile.
                </p>
              </div>
            </div>
          )}

          {/* Quick info note */}
          <div className="p-3 bg-stone-100 rounded-sm border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
            <span className="font-semibold text-stone-800">Public Access: </span>
            Anyone who receives this link can read all published issues, explore student research, and view editorial archives without requiring an account.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500">
          <span>Pratidhwani · Vol. XXVIII</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-stone-300 rounded-sm text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
