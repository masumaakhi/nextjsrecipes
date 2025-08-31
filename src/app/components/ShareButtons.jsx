// src/app/components/ShareButtons.jsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  FaShareAlt, FaLink, FaWhatsapp, FaFacebook, FaTwitter, FaTelegramPlane,
  FaLinkedin, FaRedditAlien, FaEnvelope, FaCode, FaTimes, FaCheck
} from "react-icons/fa";

export default function ShareButtons({ title, text, url, enableEmbed = true }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const dialogRef = useRef(null);

  const baseUrl = useMemo(
    () => url || (typeof window !== "undefined" ? window.location.href : ""),
    [url]
  );
  const shareTitle = title || "Share this";
  const shareText  = text  || title || "Check this out";

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => open && dialogRef.current && !dialogRef.current.contains(e.target) && setOpen(false);
    if (open) { document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onClick); }
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  // Auto contrast from modal bg
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const bg = getComputedStyle(dialogRef.current).backgroundColor;
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(bg);
    if (m) {
      const [r,g,b] = [parseInt(m[1],10), parseInt(m[2],10), parseInt(m[3],10)];
      const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
      setIsDarkBg(lum < 0.5);
    }
  }, [open]);

  const copy = useCallback(async (value, setWhich) => {
    try { await navigator.clipboard.writeText(value); setWhich(true); setTimeout(() => setWhich(false), 1500); } catch {}
  }, []);

  const tryWebShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: shareTitle, text: shareText, url: baseUrl }); return; } catch {}
    }
    copy(baseUrl, setCopied);
  }, [shareTitle, shareText, baseUrl, copy]);

  // Social targets (row + scroll)
  const encodedUrl  = encodeURIComponent(baseUrl);
  const encodedText = encodeURIComponent(shareText);
  const targets = [
    { name: "Embed",    icon: <FaCode/>,            color: "bg-gray-100 text-gray-700", onClick: "embed", hidden: !enableEmbed || !looksLikeYouTube(baseUrl) },
    { name: "WhatsApp", icon: <FaWhatsapp/>,        color: "bg-green-100 text-green-700", url: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { name: "Facebook", icon: <FaFacebook/>,        color: "bg-blue-100 text-blue-700",   url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "X",        icon: <FaTwitter/>,         color: "bg-slate-100 text-slate-700", url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { name: "Telegram", icon: <FaTelegramPlane/>,   color: "bg-cyan-100 text-cyan-700",   url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
    { name: "LinkedIn", icon: <FaLinkedin/>,        color: "bg-blue-100 text-blue-700",   url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: "Reddit",   icon: <FaRedditAlien/>,     color: "bg-orange-100 text-orange-700",url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(shareTitle)}` },
    { name: "Email",    icon: <FaEnvelope/>,        color: "bg-gray-100 text-gray-700",   url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}%0A%0A${encodedUrl}` },
  ].filter(t => !t.hidden);

  const openNew = (u) => typeof window !== "undefined" && window.open(u, "_blank", "noopener,noreferrer");

  // YouTube embed (without start-at)
  const embedCode = useMemo(() => {
    const info = parseYouTube(baseUrl); if (!info) return "";
    return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${info.id}" title="${escapeHtml(shareTitle)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }, [baseUrl, shareTitle]);

  // dynamic text shades
  const txtMain = isDarkBg ? "text-white"      : "text-slate-900";
  const txtSub  = isDarkBg ? "text-white/60"   : "text-slate-500";
  const chipBg  = isDarkBg ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-black/80";
  const fieldBg = isDarkBg ? "bg-white/10"     : "bg-black/5";
  const border  = isDarkBg ? "border-white/10" : "border-black/10";

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2">
        <FaShareAlt /> Share
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div ref={dialogRef} className="relative w-[92%] max-w-[560px] rounded-2xl bg-[#1b1b1b] text-white shadow-2xl">
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${border}`}>
              <h3 className={`text-lg font-semibold ${txtMain}`}>Share</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/10" aria-label="Close">
                <FaTimes className={txtMain} />
              </button>
            </div>

            {/* Device share */}
            <div className="px-5 pt-4">
              <button onClick={tryWebShare} className={`w-full py-3 rounded-full font-medium transition ${chipBg}`}>
                Share via device
              </button>
              <p className={`text-xs text-center mt-1 ${txtSub}`}>Uses your browser’s share menu if available</p>
            </div>

            {/* ROW icons (horizontal scroll) */}
            <div className="px-5 pt-3">
              <div className="no-scrollbar flex items-center gap-4 overflow-x-auto py-2">
                {targets.map((t) => (
                  <div key={t.name} className="flex flex-col items-center shrink-0">
                    <button
                      onClick={() => (t.onClick === "embed" ? null : openNew(t.url))}
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${t.color} hover:opacity-90`}
                      title={t.name}
                      aria-label={t.name}
                    >
                      {t.icon}
                    </button>
                    <span className={`text-xs mt-2 ${txtMain}`}>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy link */}
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2">
                <div className={`flex-1 ${fieldBg} rounded-lg overflow-hidden`}>
                  <input className={`w-full bg-transparent px-3 py-2 outline-none text-sm ${txtMain}`} value={baseUrl} readOnly />
                </div>
                <button onClick={() => copy(baseUrl, setCopied)} className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium flex items-center gap-2">
                  <FaLink /> {copied ? (<><FaCheck /> Copied</>) : "Copy"}
                </button>
              </div>
            </div>

            {/* Embed (YouTube only) */}
            {enableEmbed && looksLikeYouTube(baseUrl) && (
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-2 text-sm ${txtMain}`}><FaCode /> Embed</div>
                  <button onClick={() => copy(embedCode, setCopiedEmbed)} className={`px-3 py-1 rounded ${fieldBg} hover:bg-white/20 text-sm ${txtMain}`}>
                    {copiedEmbed ? "Copied" : "Copy embed"}
                  </button>
                </div>
                <textarea className={`w-full min-h-[90px] text-xs ${fieldBg} ${txtMain} ${border} border rounded-lg p-2 outline-none`} readOnly value={embedCode} />
              </div>
            )}
          </div>

          {/* hide scrollbar styles */}
          <style jsx global>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>
      )}
    </>
  );
}

/* ---------- helpers ---------- */
function looksLikeYouTube(u) {
  try {
    const { hostname, pathname, searchParams } = new URL(u);
    if (/youtu\.be$/i.test(hostname)) return true;
    if (/youtube\.com$/i.test(hostname)) {
      if (searchParams.get("v")) return true;
      if (pathname.startsWith("/shorts/")) return true;
    }
    return false;
  } catch { return false; }
}
function parseYouTube(u) {
  try {
    const url = new URL(u);
    if (/youtu\.be$/i.test(url.hostname)) {
      const id = url.pathname.replace("/", ""); return id ? { id } : null;
    }
    if (/youtube\.com$/i.test(url.hostname)) {
      if (url.pathname.startsWith("/watch")) {
        const id = url.searchParams.get("v"); return id ? { id } : null;
      }
      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/")[2]; return id ? { id } : null;
      }
    }
    return null;
  } catch { return null; }
}
function escapeHtml(s=""){ return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
