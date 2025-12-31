NAZO.FC site package

Folder structure:
- index.html (modern top)
- member.html / diary.html / gallery.html / bbs.html / links.html / contact.html (modern pages)
- retro.html (2008-style revival page)
- assets/style.css (shared styles for modern pages)
- assets/site.js (shared JS: drawer + BBS auto-numbering and fake posts)
- assets/retro.css (retro-only styles)

How to preview locally:
1) Open index.html in a browser.
2) For stricter browsers, run a local server:
   - python -m http.server 8000
   - then open http://localhost:8000/index.html
