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
