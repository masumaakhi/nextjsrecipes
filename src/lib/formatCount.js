export function formatCount(num) {
  if (typeof num !== "number" || isNaN(num)) return "0"; // ✅ safe fallback
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}
