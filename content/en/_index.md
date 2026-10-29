---
# ═══════════════════════════════════════════════════════════════
#  content/en/_index.md  —  English page content
#
#  THIS IS THE MAIN FILE YOU WILL EDIT.
#
#  HOW TO EDIT:
#    • Change any value after the colon on each line
#    • Keep the quotes around text values
#    • Keep the indentation (2 spaces) for list items
#    • Save — your site updates instantly while hugo server runs
# ═══════════════════════════════════════════════════════════════

title:       "Chatrix.One - Free Private XMPP Chat Server"
description: "Privacy-friendly XMPP communication. Free, decentralized, encrypted."

# ── HERO ──────────────────────────────────────────────────────
# The three lines of the big headline. Line 2 appears in italic green.
hero_title_1: "Communication that"
hero_title_2: "simply"
hero_title_3: "works"

# The three stat boxes below the hero buttons
hero_stat1_num: "A+"
hero_stat1_lbl: "Crypt-check rating"
hero_stat2_num: "0"
hero_stat2_lbl: "Trackers · Ads · Cookies"
hero_stat3_num: "2018"
hero_stat3_lbl: "Running since"

# ── FEATURES ──────────────────────────────────────────────────
# The 3×2 grid of feature cards. Edit title and body freely.
# The icons and numbering are automatic.
feat_title: "Everything you'd expect, nothing you wouldn't"

features:
  - num:   "01"
    title: "Instant messaging"
    body:  "Sent, received and read receipts. Edit messages, react with emoji, see how far others have read. Group chats and rooms."
    link_url:  "https://docs.chatrix.one/en/#features"
    link_key:  "feat_1_link"
  - num:   "02"
    title: "OMEMO encryption"
    body:  "End-to-end encryption that ensures every message and file stays strictly between participants. Forward secrecy, by default."
    link_url:  "https://en.wikipedia.org/wiki/OMEMO"
    link_key:  "feat_2_link"
  - num:   "03"
    title: "No ads. No telemetry."
    body:  "Communicate without analytics, banners, popups, or pressure to install something else. Funded by donations, not surveillance."
    link_url:  "https://docs.chatrix.one/en/faq/#will-the-service-be-available-after-x-years"
    link_key:  "feat_3_link"
  - num:   "04"
    title: "Audio & video calls"
    body:  "High-quality voice and video that connects you with the people who matter. Anytime, anywhere, across every device."
  - num:   "05"
    title: "Files of any kind"
    body:  "Share photos, documents, archives, any format you need. Quickly, conveniently, and securely whether you're at work or at home."
  - num:   "06"
    title: "Locations"
    body:  "Share live or precise locations to make meeting and traveling easier. The recipient will know exactly where you are. No explanation needed."

# ── DOWNLOADS ─────────────────────────────────────────────────
# Each download card. Add or remove items freely.
dl_title: "Bring it to every device"

downloads:
  - platform: "Android"
    name:     "Conversations"
    desc_key: "dl_android"
    links:
      - label: "F-Droid"
        url:   "https://f-droid.org/packages/eu.siacs.conversations/"
      - label: "Google Play"
        url:   "https://play.google.com/store/apps/details?id=eu.siacs.conversations"
  - platform: "iOS"
    name:     "Monal-IM"
    desc_key: "dl_ios"
    links:
      - label: "App Store"
        url:   "https://apps.apple.com/us/app/monal-xmpp-chat/id317711500"
  - platform: "Windows"
    name:     "Gajim"
    desc_key: "dl_windows"
    links:
      - label: "Download"
        url:   "https://gajim.org/download/"
  - platform: "Linux"
    name:     "Dino"
    desc_key: "dl_linux"
    links:
      - label: "Download"
        url:   "https://dino.im/#download"
  - platform: "macOS"
    name:     "Monal"
    desc_key: "dl_macos"
    links:
      - label: "App Store"
        url:   "https://apps.apple.com/us/app/monal-xmpp-chatting/id1637078500?mt=12"
  - platform: "Windows · macOS · Linux"
    icon:     "Desktop"
    name:     "Fluux Messenger"
    desc_key: "dl_fluux"
    links:
      - label: "Download"
        url:   "https://github.com/processone/fluux-messenger/releases/latest"
  - platform: "CLI"
    name:     "Profanity"
    desc_key: "dl_cli"
    links:
      - label: "Download"
        url:   "https://profanity-im.github.io/"
  - platform: "In the browser"
    icon:     "Browser"
    name:     "Converse.js"
    desc_key: "dl_webchat_note"
    links:
      - label: "Open"
        url:   "https://chatrix.one/webchat/"

# ── PRIVACY / KNOW BEFORE YOU GO ──────────────────────────────
kb_title: "Privacy is a practice, not a slogan"

privacy_cards:
  - num:      "A"
    title_key: "kb_1_title"
    body_key:  "kb_1_body"
    link_url:  "https://docs.chatrix.one/en/account/registration/"
    link_key:  "kb_1_link"
  - num:      "B"
    title_key: "kb_2_title"
    body_key:  "kb_2_body"
    link_url:  "https://docs.chatrix.one/en/faq/"
    link_key:  "kb_2_link"
  - num:      "C"
    title_key: "kb_3_title"
    body_key:  "kb_3_body"
    link_url:  "https://docs.chatrix.one/en/faq/#lists-of-free-xmpp-servers"
    link_key:  "kb_3_link"
  - num:      "D"
    title_key: "kb_4_title"
    body_key:  "kb_4_body"
    link_url:  "https://docs.chatrix.one/en/privacy/"
    link_key:  "kb_4_link"
  - num:      "E"
    title_key: "kb_5_title"
    body_key:  "kb_5_body"
    link_url:  "https://docs.chatrix.one/en/terms/"
    link_key:  "kb_5_link"
  - num:      "F"
    title_key: "kb_6_title"
    body_key:  "kb_6_body"
    link_url:  "https://docs.chatrix.one/en/status/#information-about-occurred-incidents"
    link_key:  "kb_6_link"

# ── FOOTER BADGES ─────────────────────────────────────────────
footer_badges:
  - "DNSSEC · A"
  - "CRYPT · A+"
  - "XMPP · A"
  - "100% COMPLIANT"

# ── QR CODE ───────────────────────────────────────────────────
# Place your QR code PNG in static/images/ and set the filename below.
# To disable the QR card, comment this line out with a # character.
qr_image: "images/chatrix-one-join-dark.svg"
qr_image_light: "images/chatrix-one-join-light.svg"

---
