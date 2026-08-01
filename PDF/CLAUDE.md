# PDF-IMAGE-MANAGER project notes

- Logos/images: use PNG (not JPG) for anything with a shaped/non-white edge, so it composites cleanly if backgrounds ever change. Main brand mark is `assets/bluejetty.png`.
- Header logos across pages: keep consistent sizing (150px on desktop hub header; nav-bar icons 40px, active tool 100px, scales up on hover to match).
- Shared components: `DropBox.dc.html`, `Notepad.dc.html`, `SaveBox.dc.html` — reused across tool pages via `<dc-import>`. Update these once to change all pages that use them.
- New pages should reuse these shared components and match existing nav-bar/header pattern rather than reinventing.
