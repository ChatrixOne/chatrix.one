// Shows the address the visitor asked for in the 404 chat bubble.
// Separate from app.js, which expects the homepage's elements.
(function () {
  var el = document.getElementById('err404Path');
  if (!el) return;
  var path = window.location.pathname;
  try { path = decodeURI(path); } catch (e) { /* malformed %-escape: show it raw */ }
  el.textContent = path;
})();
