# Chatrix.One - Website

Hugo source of https://chatrix.one (English and Bulgarian).

## Edit and preview

```
hugo server
```
Then open http://localhost:1313. This preview is for your PC only: its
output contains a livereload script and localhost links, so never upload it.

| What you want to change | File to open |
|-------------------------|-------------|
| English page text (headlines, features, downloads) | `content/en/_index.md` |
| Bulgarian page text | `content/bg/_index.md` |
| English nav, footer, labels | `i18n/en.toml` |
| Bulgarian nav, footer, labels | `i18n/bg.toml` |
| Colors, fonts, spacing | `static/styles.css` |
| Page structure | `layouts/` |
| Site settings | `config/_default/hugo.toml` |

## Publishing

Push to `main`. That's all.

1. GitHub Actions (`.github/workflows/deploy.yml`) builds the site with
   `hugo --minify` and checks it (`deploy/check-public.sh`).
2. If the check passes, the output is pushed to the `site` branch.
3. chatrix.one checks the `site` branch every 5 minutes and copies what
   changed into `/var/www/chatrix.one/site/` (`deploy/chatrix-site-sync`).

A failed build never reaches the server. Don't edit files on the server:
the next push overwrites them. Folders the build doesn't have (`rules/`,
`.well-known/`, `webchat/` and others made by the server) are never touched.

## Server setup (once, on chatrix.one, as root)

```
install -m 755 deploy/chatrix-site-sync /usr/local/sbin/
install -m 644 deploy/chatrix-site-sync.service deploy/chatrix-site-sync.timer /etc/systemd/system/
systemctl daemon-reload
chatrix-site-sync --dry-run
systemctl enable --now chatrix-site-sync.timer
```

Log: `journalctl -u chatrix-site-sync`. Sync now: `systemctl start chatrix-site-sync`.
