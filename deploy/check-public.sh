#!/bin/bash
# Refuses a build that would break the live site: missing pages, or leftovers
# of a "hugo server" build (livereload script, localhost URLs in sitemaps).
set -euo pipefail
dir=${1:-public}
fail=0
for f in index.html bg/index.html en/index.html sitemap.xml styles.css app.js; do
    [[ -s "${dir}/${f}" ]] || { echo "missing: ${f}"; fail=1; }
done
if grep -rlE 'livereload|localhost:1313' "$dir"; then
    echo "dev-server leftovers in the files above (build with hugo, not hugo server)"
    fail=1
fi
if grep -ohE '<loc>[^<]*' "$dir"/sitemap.xml "$dir"/*/sitemap.xml | grep -v '<loc>https://chatrix.one/'; then
    echo "sitemap URLs outside https://chatrix.one/"
    fail=1
fi
[[ $fail == 0 ]] && echo "build looks good"
exit $fail
