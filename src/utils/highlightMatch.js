// src/utils/highlightMatch.js
// src/utils/highlightMatch.js

export function highlightMatch(text, keyword) {
  if (!text) return "";
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");

  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-300 text-black px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
