# bluejetty — working notes for Claude

This repo serves **bluejetty.ca**: a one-page site at the root, and the PDF and
image tool suite under `PDF/`.

## Pushing works — with one setup condition

The Claude GitHub App is installed on the `bluejetty` account, so sessions can
push and open PRs normally. Push to a branch and let the user merge the PR; do
not push to `main`.

Two things that will still refuse, both fixed outside a session:

- **The app is installed per GitHub account.** The user also owns `dzmarkup`.
  Installing on one account does not cover the other, and the claude.ai side
  links one GitHub account at a time.
- **A repo must be selected in the picker when the session is created.** The
  git proxy only injects a credential for repos in the session's source set —
  it will refuse a repo added later with *"not in this session's authorized
  repository set"*, and `add_repo` refuses to add one from a different owner.
  A collaborator grant on GitHub does not change this.

If a push 403s, check those two before assuming anything else. A personal
access token does **not** help — the proxy applies its own policy regardless of
the credential presented, so asking for one only exposes it.

## Standing preferences

- **Confirm the destination before pushing.** The user owns two GitHub accounts
  (`bluejetty` and `dzmarkup`) with several repos between them, so a change can
  look right and still land in the wrong place. Name the repo and branch and
  get a yes first.
- **Hand over a backup zip with the work**, not just loose files: the changed
  files at their real paths, the list of files to delete, and a `git bundle`
  of any unpushed commits so the history survives the container.

## The DOCU app is not in this repo

DOCU lives at **dzdocu.com**, in the `dzmarkup/dzdocu` repo, and has its own
`CLAUDE.md` there. A copy used to sit at `docu/index.html` here as a test bed
before it got its own domain; it has been removed. Do not re-add it, and do not
treat anything in this repo as the source for that app.

## The PDF tool suite (`PDF/`)

Nine tools plus a hub. `PDF/index.html` redirects to `PDF/PDF-IMG-MGR.dc.html`,
which is the hub; the nine tools are listed in two places that must stay in
step — the `TOOLS` array and `activeTool` enum in `ToolHeader.dc.html`, and the
tile list in `PDF-IMG-MGR.dc.html`. Each tool needs a matching
`PDF/<NAME>.dc.html` and `PDF/assets/<NAME>.png`.

Icons are rendered at 94px. Keep them around 840px wide like the existing set —
one was committed at 3683px / 4.3 MB and every hub visit paid for it.

Shared code lives in `PDF/support.js`, `PDF/shared-file-store.js` and
`PDF/pdfEngine.js`, with shared components in `DropBox.dc.html`,
`Notepad.dc.html`, `SaveBox.dc.html` and `ToolHeader.dc.html`. There is a
design system under `PDF/_ds/`.

The tools load React, Babel and 29 libraries from `unpkg.com` and
`cdnjs.cloudflare.com` at runtime, so they break when those CDNs do — and
`@babel/standalone` means the browser compiles JSX on every page load.
Vendoring those locally is the largest available improvement.

## Known and unfinished

- **The homepage links to nothing but a PDF and a phone number.** Eleven
  working tools and no visitor can find them; `/PDF/` is invisible. Highest
  value-per-hour item in the repo.
- **~28 MB of unlinked PDFs sit at the root** (`CanadaNBC2020.pdf`,
  `CanadaNBC2020Sec9Illustrated.pdf`, `HOME-PLANS-…pdf`). These are deliberate —
  the user hosts them for direct linking. Do not delete them.
- There is a stale `PDF` branch on the remote, left over from a reorganisation.
