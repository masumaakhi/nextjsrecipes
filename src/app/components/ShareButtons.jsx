"use client";
import { useCallback, useMemo, useState } from "react";
import { FaShareAlt, FaLink, FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";

export default function ShareButtons({ title, text, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => url || (typeof window !== 'undefined' ? window.location.href : ''), [url]);
  const shareText = text || title || "Check this out";

  const tryWebShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {}
    } else {
      handleCopy();
    }
  }, [shareText, shareUrl, title]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }, [shareUrl]);

  const open = (targetUrl) => {
    if (typeof window !== 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <div className="flex items-center gap-2">
      <button onClick={tryWebShare} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2">
        <FaShareAlt /> Share
      </button>
      <button onClick={handleCopy} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2">
        <FaLink /> {copied ? 'Copied' : 'Copy link'}
      </button>
      <button onClick={() => open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`)} className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700">
        <FaWhatsapp />
      </button>
      <button onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700">
        <FaFacebook />
      </button>
      <button onClick={() => open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">
        <FaTwitter />
      </button>
    </div>
  );
}


