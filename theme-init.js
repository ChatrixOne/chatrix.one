/* Loaded in <head>, before the first paint: marks that JS is running (so
   .reveal sections may start hidden) and applies a saved light theme.
   The page is dark by default; the theme does not follow the OS setting. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    if (localStorage.getItem('chatrix:theme') === 'light') root.setAttribute('data-theme', 'light');
  } catch (_) {}
})();
