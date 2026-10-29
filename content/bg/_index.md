---
# ═══════════════════════════════════════════════════════════════
#  content/bg/_index.md  —  Българско съдържание на страницата
#
#  ОСНОВНИЯТ ФАЙЛ КОЙТО ЩЕ РЕДАКТИРАТЕ.
#
#  КАК ДА РЕДАКТИРАТЕ:
#    • Променете всяка стойност след двоеточието
#    • Запазете кавичките около текстовите стойности
#    • Запазете отстъпите (2 интервала) при елементите от списък
#    • Запазете — сайтът се актуализира мигновено
# ═══════════════════════════════════════════════════════════════

title:       "Chatrix.One - Безплатен български XMPP чат сървър"
description: "Поверителна XMPP комуникация. Безплатна, децентрализирана, криптирана."

# ── HERO ──────────────────────────────────────────────────────
hero_title_1: "Комуникация, която"
hero_title_2: "просто"
hero_title_3: "работи"

hero_stat1_num: "A+"
hero_stat1_lbl: "Crypt-check оценка"
hero_stat2_num: "0"
hero_stat2_lbl: "Тракери · Реклами · Бисквитки"
hero_stat3_num: "2018"
hero_stat3_lbl: "Работим от"

# ── FEATURES ──────────────────────────────────────────────────
feat_title: "Всичко, което очаквате, нищо излишно"

features:
  - num:   "01"
    title: "Незабавни съобщения"
    body:  "Маркери за изпратено, получено и прочетено. Редактиране на съобщения, реакции с емоджи, видимост докъде са прочели другите. Групови чатове и стаи."
    link_url:  "https://docs.chatrix.one/#%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%B8"
    link_key:  "feat_1_link"
  - num:   "02"
    title: "OMEMO криптиране"
    body:  "Криптиране от край до край, което гарантира, че всяко съобщение и файл остават единствено между участниците. Forward secrecy по подразбиране."
    link_url:  "https://en.wikipedia.org/wiki/OMEMO"
    link_key:  "feat_2_link"
  - num:   "03"
    title: "Без реклами. Без телеметрия."
    body:  "Общувайте без анализи, банери, изскачащи прозорци или натиск да инсталирате нещо друго. Финансирано с дарения, не с наблюдение."
    link_url:  "https://docs.chatrix.one/faq/?h=докато#ще-бъде-ли-достъпна-услугата-след-x-години"
    link_key:  "feat_3_link"
  - num:   "04"
    title: "Аудио и видео разговори"
    body:  "Висококачествени гласови и видео разговори, които ви свързват с важните за вас хора. По всяко време, навсякъде, на всяко устройство."
  - num:   "05"
    title: "Файлове от всякакъв вид"
    body:  "Споделяйте снимки, документи, архиви, във всеки формат. Бързо, удобно и сигурно, независимо дали сте на работа или у дома."
  - num:   "06"
    title: "Локации"
    body:  "Споделяйте локация на живо или точна позиция, за да улесните срещи и пътувания. Получателят ще знае точно къде сте. Без излишни обяснения."

# ── DOWNLOADS ─────────────────────────────────────────────────
dl_title: "На всяко устройство"

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
      - label: "Изтегли"
        url:   "https://gajim.org/download/"
  - platform: "Linux"
    name:     "Dino"
    desc_key: "dl_linux"
    links:
      - label: "Изтегли"
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
      - label: "Изтегли"
        url:   "https://github.com/processone/fluux-messenger/releases/latest"
  - platform: "CLI"
    name:     "Profanity"
    desc_key: "dl_cli"
    links:
      - label: "Изтегли"
        url:   "https://profanity-im.github.io/"
  - platform: "В браузъра"
    icon:     "Browser"
    name:     "Converse.js"
    desc_key: "dl_webchat_note"
    links:
      - label: "Отвори"
        url:   "https://chatrix.one/webchat/"

# ── PRIVACY / KNOW BEFORE YOU GO ──────────────────────────────
kb_title: "Поверителността е практика, не лозунг"

privacy_cards:
  - num:      "A"
    title_key: "kb_1_title"
    body_key:  "kb_1_body"
    link_url:  "https://docs.chatrix.one/account/registration/"
    link_key:  "kb_1_link"
  - num:      "B"
    title_key: "kb_2_title"
    body_key:  "kb_2_body"
    link_url:  "https://docs.chatrix.one/faq/"
    link_key:  "kb_2_link"
  - num:      "C"
    title_key: "kb_3_title"
    body_key:  "kb_3_body"
    link_url:  "https://docs.chatrix.one/faq/#списъци-с-безплатни-xmpp-сървъри"
    link_key:  "kb_3_link"
  - num:      "D"
    title_key: "kb_4_title"
    body_key:  "kb_4_body"
    link_url:  "https://docs.chatrix.one/privacy/"
    link_key:  "kb_4_link"
  - num:      "E"
    title_key: "kb_5_title"
    body_key:  "kb_5_body"
    link_url:  "https://docs.chatrix.one/terms/"
    link_key:  "kb_5_link"
  - num:      "F"
    title_key: "kb_6_title"
    body_key:  "kb_6_body"
    link_url:  "https://docs.chatrix.one/status/#%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B7%D0%B0-%D0%BD%D0%B0%D1%81%D1%82%D1%8A%D0%BF%D0%B8%D0%BB%D0%B8-%D0%B8%D0%BD%D1%86%D0%B8%D0%B4%D0%B5%D0%BD%D1%82%D0%B8"
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
