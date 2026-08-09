# bluejetty — working notes for Claude

## DON'T TRY TO PUSH — IT WON'T WORK

Sessions on this repo have **read-only** GitHub access. Clones and fetches
succeed; every write is refused:

- `git push` → `403` from `https://github.com/bluejetty/bluejetty/`
- GitHub API `create_branch` / `push_files` → `403 Resource not accessible by
  integration`

This is a permission grant, not a flaky network. Retrying and backoff do not
help — it has been tried at length. **Do not spend the user's time on it.**

**A personal access token does not help either — do not ask for one.** The
session's proxy intercepts every GitHub request and applies its own policy
regardless of the credential presented. Tested with a valid PAT: `GET /user`
returns 200, but `GET /repos/bluejetty/bluejetty` returns 403 with a
proxy-authored message, *"GitHub access is not enabled for this session. An
org admin must connect the Claude GitHub App for this organization."* The fix
is connecting that app, which happens outside any session. If the user offers
a token, tell them it cannot work here and that pasting it exposes it.

Commit locally so the work has a record, then **hand the finished file to the
user with `SendUserFile`** — they upload it themselves. Say plainly that the
commit is local and unpushed. If a stop hook complains about unpushed commits,
that is expected here; acknowledge it and stop rather than retrying the push.

## Standing preferences

- **Confirm the destination before pushing.** The user owns more than one
  repository and the DOCU app is served from a different one than this. Never
  assume the repo you are sitting in is the one the change belongs to — name
  the repo and branch and get a yes first.
- **Hand over a backup zip with the work**, not just loose files: the changed
  files at their real paths, the list of files to delete, and a `git bundle`
  of any unpushed commits so the history survives the container.

## The DOCU app (`docu/index.html`)

One self-contained bundled page, ~860 KB, and **not hand-editable as it
stands**. Structure:

- Line 378 — JSON manifest of assets (gzip + base64: fonts, the framework, the
  `doc-page` web component).
- Line 390 — the whole application document as one JSON-escaped string.

To change it: parse line 390 with `json.loads`, edit the extracted HTML, then
re-serialise. Escaping detail that matters — the original escapes `</` as
`</`, so apply `.replace('</', '<\\u002F')` after `json.dumps` and assert
the round-trip before writing.

Verify print changes for real rather than by eye. Playwright is installed
globally (`/opt/node22/lib/node_modules/playwright`), Chromium lives at
`/opt/pw-browsers` — drive the app, then `page.pdf({ preferCSSPageSize: true,
printBackground: true })` and count `/Type /Page` in the output. That is what
catches an extra sheet.

### Label printing — the trap that caused the black page

Two screen-only affordances used to reach the printer and cost a whole extra
sheet:

- `.doc-stage-wrap` carries a 60px top gutter so the sheet clears the fixed
  toolbar. A label page is *exactly* one sheet tall, so 60px of offset pushed
  the whole page onto sheet 2.
- The `doc-page` host's desk colour (`#2b2b2b`) is set as an **inline** style —
  and re-applied in JS by `updateColsLayout()` — so it outranks the component's
  own `:host { background: none }` print rule. The component forces
  `print-color-adjust: exact`, so it prints even with "Background graphics"
  off. That is what filled the empty sheet 1 solid dark.

Both are reset in the document's print CSS. If a dark sheet ever comes back,
check those two rules survived a rebuild.

### Label addresses

Which address sits on which page is keyed by **page id** (`pageAddresses`), not
by position — "+ Page" can insert a repeated or blank label mid-run, and a
positional list makes the return-address toggle rewrite later pages with the
wrong address. The map is persisted with the document.
