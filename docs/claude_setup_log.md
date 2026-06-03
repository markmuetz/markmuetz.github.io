# Setup log — 3 June 2026

Session with Claude Code (claude-sonnet-4-6) to set up this repo as a Quarto blog
on GitHub Pages.

---

## Starting state

The repo (`markmuetz/markmuetz.github.io`) had two branches:
- `main` — contained a placeholder `index.html` and the legacy `webakt-dev/` tree
- (no other branches)

---

## What was done

### Git housekeeping

Created a `legacy_webakt_dev` branch to preserve all the existing webAKT content,
then cleared `main` completely (keeping only `.git`) so it was a clean slate for
the Quarto site.

### Step 1 — Verified tooling

- Quarto 1.8.27 already installed at `/home/markmuetz/opt/quarto-1.8.27`
- `uv` 0.11.7 already installed
- `quarto check` passed (Pandoc, Deno, Dart Sass all OK); the pre-existing Anaconda
  Jupyter had a missing `nbclient` but this was irrelevant since we use a project venv

### Step 2 — Scaffolded project and venv

```bash
quarto create project blog . --no-open --no-prompt
uv venv .venv
source .venv/bin/activate
uv pip install jupyter matplotlib pandas numpy \
               xarray seaborn easygems healpix healpy "intake==0.7.0"
uv pip freeze > requirements.txt
```

Extended the scaffold's `.gitignore` to also exclude `/.venv/`, `/_site/`,
`__pycache__/`, `.ipynb_checkpoints/`.

### Step 3 — Configured site structure

Changed from the default (blog listing on `index.qmd`) to a landing page +
separate blog listing:

| File | Role |
|---|---|
| `_quarto.yml` | Site config — title, navbar, theme (cosmo), `site-url`, explicit `render` list |
| `index.qmd` | Landing page using Quarto `trestles` about template |
| `blog.qmd` | Blog listing with categories and RSS feed |
| `about.qmd` | About page (placeholder) |
| `posts/_metadata.yml` | Per-post defaults: `freeze: auto`, giscus config |

Added `.quartoignore` (not effective for this Quarto version) and then switched to
an explicit `render` list in `_quarto.yml` to stop Quarto processing `docs/*.md`.

### Step 4 — Freeze

`freeze: auto` set in `posts/_metadata.yml` (changed from scaffold default of
`freeze: true`). `_freeze/` is committed and not gitignored. CI never runs Python
— it uses the committed cache.

**Key lesson:** draft posts still render (they just don't appear in listings), so
the freeze cache must be kept up to date. Always run `quarto render` locally before
pushing if post source has changed.

### Step 5 — giscus comments

Configured in `posts/_metadata.yml` (comments appear on all posts, not on
listing/home/about pages):

```yaml
comments:
  giscus:
    repo: markmuetz/markmuetz.github.io
    repo-id: "R_kgDONvl5Nw"
    category: "Announcements"
    category-id: "DIC_kwDONvl5N84C-dFo"
    mapping: pathname
    reactions-enabled: true
    input-position: bottom
    theme: preferred_color_scheme
    loading: lazy
```

Note: giscus only works on the live deployed site; it looks empty in local preview.

### Step 7 — Git remote and initial push

Remote was already configured. Staged and pushed the initial Quarto site.

### Step 8 — GitHub Pages deploy

`quarto publish gh-pages` has a bug where it globs for `*_files` directories in
the source tree even with `output-dir: _site` set. Worked around by:

1. Manually creating an orphan `gh-pages` branch and pushing it
2. Using `rsync + git worktree` to push `_site/` contents directly to `gh-pages`
3. Adding the GitHub Actions workflow for future deploys

Then set Pages source to `gh-pages` branch via GitHub Settings (manual step).

### GitHub Actions workflow — several iterations

The final working workflow (`..github/workflows/publish.yml`):

```
checkout → setup Quarto → install uv → uv venv + uv pip install -r requirements.txt
→ quarto render → quarto-actions/publish (render: false)
```

Issues encountered and resolved:

| Error | Cause | Fix |
|---|---|---|
| `config2.records[providerName] is not iterable` | `_publish.yml` scalar instead of list | Fixed format, then removed `_publish.yml` entirely |
| `Multiple previous publishes exist` | `_publish.yml` confusing CI | Removed the file; workflow specifies target directly |
| `ModuleNotFoundError: No module named 'nbformat'` | CI trying to render without Python | Added Python install step |
| `--system` blocked on uv-managed Python | `setup-uv` creates a protected interpreter | Switched to `uv venv .venv` + activate |
| `No module named 'numpy'` | Freeze hashes stale after `draft: true` added without re-rendering | Install full `requirements.txt` in CI; re-render locally first |

### Demo posts

Added executable code to the scaffold posts:
- `posts/post-with-code` — matplotlib plot, summary stats table, `FuncAnimation`
  wave animation via `to_jshtml()`
- `posts/plotly-animation` — two Plotly animations (Lissajous figure with
  play/pause/scrubber; spiral build-up)

All posts set to `draft: true` at end of session.

---

## Final state

- Live site: `https://markmuetz.github.io`
- CI: pushes to `main` trigger the Quarto Publish workflow → `gh-pages` branch →
  Pages build; typically live within ~2 minutes
- All three demo posts are drafts
- `requirements.txt` pinned and committed
- `_freeze/` committed and up to date
