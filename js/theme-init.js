// Inline head check to resolve dark theme immediately, avoiding flash of unstyled content (FOUC).
(function() {
  const stored = localStorage.getItem("adranin-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();