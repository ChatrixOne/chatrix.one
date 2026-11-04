/* Account pages (change password, delete account): send the form to
   ejabberd's mod_register_web and show its one-line answer in the page.
   ejabberd answers 200 on success and 404 on an error, in the language
   asked for with Accept-Language. */
(function () {
  var form = document.getElementById('acctForm');
  if (!form) return;
  var result = document.getElementById('acctResult');
  var button = form.querySelector('button[type="submit"]');
  var label = button.textContent;
  var d = form.dataset;

  document.getElementById('acctShow').addEventListener('change', function () {
    var type = this.checked ? 'text' : 'password';
    form.querySelectorAll('input[name^="password"]').forEach(function (i) { i.type = type; });
  });

  function show(text, ok) {
    result.textContent = text;
    result.className = 'acct-result ' + (ok ? 'acct-ok' : 'acct-err');
    result.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // "name@chatrix.one" works too: ejabberd wants the name only.
    var user = form.username;
    var name = user.value.trim().toLowerCase();
    var at = name.lastIndexOf('@');
    if (at > 0 && name.slice(at + 1) === d.domain) name = name.slice(0, at);
    user.value = name;
    if (form.password2 && form.password.value !== form.password2.value) {
      show(d.mismatch, false);
      return;
    }
    button.disabled = true;
    button.textContent = d.busy;
    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept-Language': d.lang },
      body: new URLSearchParams(new FormData(form)),
      credentials: 'omit'
    }).then(function (r) {
      return r.text().then(function (text) {
        if (r.ok) {
          show(d.ok, true);
          form.querySelectorAll('input[type="password"], input[type="text"][name^="password"]')
            .forEach(function (i) { i.value = ''; });
        } else if (r.status === 429 || r.status === 503) {
          show(d.limit, false);
        } else {
          show(text.trim() || d.neterr, false);
        }
      });
    }).catch(function () {
      show(d.neterr, false);
    }).then(function () {
      button.disabled = false;
      button.textContent = label;
    });
  });
})();
