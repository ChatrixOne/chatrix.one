# TODO

- [x] **"Start in just three steps": an animated story** (asked 2026-10-27,
      done 2026-10-27; step 1 shows only the percentage, no ring, at the
      user's request; about 12 s)
      The section on the home page (`#start`, `.wire` in styles.css)
      should act out the sign-up, step by step:
      - Start: the three circles faded.
      - Step 1: the first circle comes in with one heartbeat (a single
        pulse), then a download animation 0-100% and a green check mark.
      - The green dot then travels along the line to step 2: one
        heartbeat, an "I'm human" check box being ticked (generic, not
        the hCaptcha logo), green check mark.
      - The dot travels to step 3: one heartbeat, the bot chat (typing
        dots, the word in a bubble, the reply going back), green check.
      - End: three circles with big check marks; the line glows fully
        green as a "connected" moment.
      Notes: play once when the section scrolls into view, not in a
      loop (a small replay button); about 2 s per step, 8 s at most;
      the same story on phones, the dot moving down the vertical lines;
      with reduced motion show the finished state at once; plain
      CSS/SVG and a little JS in app.js, no libraries.

- [ ] **Account pages in the website's style** (asked 2026-10-29)
      https://chatrix.one/user/change_password/ ("Change Password") and
      https://chatrix.one/user/delete/ ("Unregister an XMPP account")
      should look like the website: same fonts, colours, dark theme,
      logo/nav and footer, in EN and BG.
      Notes: these are not Hugo pages. nginx proxies /user/ to
      ejabberd's mod_register_web (127.0.0.1:8444/register/), which
      writes its own plain HTML, and the nginx config comes from the
      xmpp-install script. So the fix lives in the installer (e.g. nginx
      sub_filter adding the site's stylesheet, or our own pages that post
      to ejabberd), not in this repo. A hand edit on the server would be
      lost on the next script rebuild. Check the forms still work
      afterwards (change a test account's password, delete a test
      account).
