# PDF-IMG-MGR project notes

## Logo/asset conventions
- All tool logos live in `assets/`, one PNG per tool named exactly after its page (e.g. `PDF-SPLITTER.png`), plus `assets/bluejetty.png` for the bluejetty mark.
- Format: **PNG**, not JPG — even though these logos have no real transparency (flattened onto white), PNG is still the standard here for consistency and to be future-proof if a logo ever needs transparency or a non-white background.
- Size: all logos are standardized to a **600×600 square canvas**, image contained/centered with ~8% padding, on a white background. Any new logo should be processed the same way (see the resize script pattern used previously — canvas fill white, draw scaled+centered, save PNG) before wiring it in.
- Nav bar usage: each page shows its own logo large (100px, rounded corners + border + drop-shadow "extruded" card look) and links to every other tool at 40px, which scale up to 100px on hover (transition on width/height). New tools should follow this exact pattern for consistency.
- Shared reusable pieces (drop zone, notepad, resolution+save control) are built as standalone Design Components (DropBox.dc.html, Notepad.dc.html, SaveBox.dc.html) and imported via `<dc-import>` rather than duplicated per page — do this for any other UI block that repeats across tools.
