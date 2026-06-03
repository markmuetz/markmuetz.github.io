# Setup: `markmuetz.github.io` — Quarto landing page + blog

A step-by-step runbook to stand up a personal site (simple landing page + a blog
with executable Python) using **Quarto**, hosted on **GitHub Pages**, with
**giscus** comments and GitHub configured to notify on every new comment.

## How to use this doc (note for Claude Code)

Steps are ordered and mostly automatable. A few steps **must be done by a human
in a web browser** (creating the GitHub repo, installing the giscus app, reading
IDs off giscus.app, clicking GitHub UI toggles). Those are clearly marked
`🧍 MANUAL (browser)`. Everything else is shell commands or files to create.

Placeholders to fill in:

- `markmuetz` — GitHub username (already correct throughout if that's you)
- `<REPO-ID>` / `<CATEGORY-ID>` — copied from giscus.app in Step 5
- Name / blurb / links in `index.qmd`

Do **not** proceed past Step 5's giscus config until the human has supplied the
two IDs.

---

## Step 1 — Install Quarto on Linux Mint

Linux Mint is Debian/Ubuntu-based, so the `.deb` package works directly. This URL
always points at the current stable release (no version to hard-code):

```bash
cd /tmp
wget https://quarto.org/download/latest/quarto-linux-amd64.deb
sudo apt install ./quarto-linux-amd64.deb   # ./ matters: installs the local file + deps
rm quarto-linux-amd64.deb
```

Verify:

```bash
quarto --version
quarto check
```

`quarto check` should report the binary, Pandoc, and (after Step 2) Jupyter as OK.

### Python + Jupyter (needed to execute Python in posts)

Quarto runs Python code cells through Jupyter. Install `uv` (fast Python package
manager that handles venv creation and installs) — no system pip/venv needed:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# restart your shell (or: source $HOME/.local/bin/env)
uv --version
```

The venv is created inside the project in Step 2.

---

## Step 2 — Scaffold the project

Create the Quarto **blog** project. The folder name matches the eventual repo:

```bash
cd ~/code          # or wherever you keep projects
quarto create project blog markmuetz.github.io
cd markmuetz.github.io
```

This generates `_quarto.yml`, an `index.qmd` (a blog listing), `about.qmd`,
`styles.css`, and a `posts/` folder with two example posts.

Set up the project venv and install the packages your posts will use:

```bash
uv venv .venv
source .venv/bin/activate
uv pip install jupyter matplotlib pandas numpy
```

Pin the environment for reproducibility by saving a requirements file:

```bash
uv pip freeze > requirements.txt
```

> Keep `.venv` activated whenever you render locally. Quarto uses whichever
> `jupyter` is on the active environment. To reinstall from scratch later:
> `uv pip install -r requirements.txt`

Add a `.gitignore`:

```bash
cat > .gitignore <<'EOF'
/.venv/
/_site/
/.quarto/
__pycache__/
.ipynb_checkpoints/
EOF
```

> Note: do **not** ignore `_freeze/` — that cache is committed on purpose
> (see Step 4).

---

## Step 3 — Configure the site: landing page + blog

By default `index.qmd` is the blog listing. We want a distinct landing page, so:
make `index.qmd` the **landing page**, and move the **listing** to `blog.qmd`.

### 3a. Replace `_quarto.yml`

```yaml
project:
  type: website
  output-dir: _site

website:
  title: "Mark Muetz"
  navbar:
    left:
      - href: index.qmd
        text: Home
      - href: blog.qmd
        text: Blog
      - href: about.qmd
        text: About
    right:
      - icon: github
        href: https://github.com/markmuetz
      - icon: rss
        href: blog.xml

format:
  html:
    theme: cosmo
    css: styles.css
    toc: true
```

### 3b. Landing page — `index.qmd`

Uses Quarto's `about` document type for a clean profile-style landing page:

```markdown
---
title: "Mark Muetz"
about:
  template: trestles
  image-shape: round
  links:
    - icon: github
      text: GitHub
      href: https://github.com/markmuetz
---

I'm Mark — short blurb about who you are and what you write about here.

Head to the [Blog](blog.qmd) for posts.
```

> Optional: drop a `profile.jpg` in the project root and add
> `image: profile.jpg` under `about:` to show a photo.

### 3c. Blog listing — `blog.qmd`

```markdown
---
title: "Blog"
listing:
  contents: posts
  sort: "date desc"
  type: default
  categories: true
  feed: true
---
```

`feed: true` generates `blog.xml` (the RSS feed linked in the navbar).

### 3d. About page — `about.qmd` (optional)

The scaffold already created one; edit it or delete it (and remove the navbar
entry) if you don't want it.

### 3e. Tidy the example posts

The scaffold's example posts live in `posts/`. Keep them as references or delete
them. A clean starting post is created in Step 6 of the writing guide
(`WRITING-QMD.md`).

### 3f. Preview locally

```bash
quarto preview
```

Opens a live-reloading local server. Confirm Home / Blog / About all render.

---

## Step 4 — Freeze (so CI never has to run your Python)

`freeze` caches executed code output so cells only re-run when their source
changes. Critically, it means the GitHub Actions runner serves pre-rendered HTML
and never needs your Python environment.

Blog projects already set this for the `posts/` folder. Confirm/ensure
`posts/_metadata.yml` contains:

```yaml
freeze: auto
```

Workflow implication: **you render locally** (where `.venv` lives), and the
committed `_freeze/` directory is what gets published. Commit `_freeze/` whenever
it changes.

---

## Step 5 — giscus comments (on blog posts only)

### 5a. 🧍 MANUAL (browser) — prerequisites

1. Create the GitHub repo `markmuetz/markmuetz.github.io` (public — giscus
   requires a public repo so visitors can read the discussion). If it doesn't
   exist yet, create it now; Step 7 wires the local project to it.
2. Enable Discussions: repo **Settings → General → Features → check
   Discussions**.
3. Install the giscus app: go to <https://github.com/apps/giscus>, click
   **Install**, choose **Only select repositories**, pick
   `markmuetz.github.io`.
4. Go to <https://giscus.app>, scroll to **Configuration**, and enter
   `markmuetz/markmuetz.github.io`. Choose **Discussion mapping: pathname**,
   pick a **category** (e.g. `Announcements` or a dedicated `Comments`
   category), and enable reactions if you like.
5. From the generated snippet, copy the values of **`data-repo-id`** and
   **`data-category-id`**. These are the `<REPO-ID>` and `<CATEGORY-ID>` below.

### 5b. Configure giscus in `posts/_metadata.yml`

Putting this in `posts/_metadata.yml` (not `_quarto.yml`) means comments appear
on **blog posts only**, not on the landing/blog/about pages. Combine it with the
freeze setting from Step 4:

```yaml
freeze: auto

comments:
  giscus:
    repo: markmuetz/markmuetz.github.io
    repo-id: "<REPO-ID>"
    category: "Announcements"
    category-id: "<CATEGORY-ID>"
    mapping: pathname
    reactions-enabled: true
    input-position: top
    theme: preferred_color_scheme
    loading: lazy
```

> To disable comments on a single post, add `comments: false` to that post's
> front matter.

---

## Step 6 — GitHub notifications (get pinged on every comment)

🧍 MANUAL (browser). The default watch level only notifies you about threads you
participate in, so brand-new comment threads would go unseen. Fix it:

1. On the repo page, click the **Watch** dropdown (top right) → **Custom** →
   tick **Discussions** → **Apply**. (Or choose **All Activity** for everything.)
2. Confirm delivery channel: **GitHub → Settings → Notifications**. Ensure email
   and/or "on GitHub" (web + mobile app) are enabled to your taste. Web inbox and
   email are toggled separately.

After you reply to a thread once, you're auto-subscribed to that thread
regardless of the above.

---

## Step 7 — Wire up Git and the GitHub repo

```bash
git init
git branch -M main
git add .
git commit -m "Initial Quarto site"
git remote add origin https://github.com/markmuetz/markmuetz.github.io.git
git push -u origin main
```

---

## Step 8 — Deploy to GitHub Pages

The first publish is a one-time local bootstrap; after that, a GitHub Action
rebuilds on every push to `main`.

### 8a. Bootstrap the `gh-pages` branch (run once, locally)

With `.venv` active:

```bash
quarto publish gh-pages
```

This renders the site, creates the `gh-pages` branch, pushes the output, and
writes `_publish.yml`. Commit that file:

```bash
git add _publish.yml && git commit -m "Add publish config" && git push
```

### 8b. 🧍 MANUAL (browser) — point Pages at `gh-pages`

Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch →
Branch: `gh-pages` / `(root)`** → Save. Quarto also prints a direct link to this
page after the first publish. The site goes live at
`https://markmuetz.github.io`.

### 8c. Add the auto-publish workflow — `.github/workflows/publish.yml`

Because of freeze, this workflow does **not** install Python — it just publishes
the pre-rendered output.

```yaml
on:
  workflow_dispatch:
  push:
    branches: main

name: Quarto Publish

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Quarto
        uses: quarto-dev/quarto-actions/setup@v2

      - name: Render and Publish
        uses: quarto-dev/quarto-actions/publish@v2
        with:
          target: gh-pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Commit and push it:

```bash
git add .github/workflows/publish.yml
git commit -m "Add Quarto publish workflow"
git push
```

---

## Step 9 — Day-to-day workflow for a new post

```bash
source .venv/bin/activate
mkdir -p posts/my-new-post
# create posts/my-new-post/index.qmd  (see WRITING-QMD.md)
quarto preview                 # write + check locally
git add -A
git commit -m "Post: my new post"
git push                       # Action renders + publishes automatically
```

To add a new package to your posts: `uv pip install <pkg>` then
`uv pip freeze > requirements.txt` and commit the updated file.

If a post executes new code, render locally first so the updated `_freeze/`
cache is committed.

---

## Verification checklist

- [ ] `quarto check` passes (binary, Pandoc, Jupyter all OK)
- [ ] `quarto preview` shows Home, Blog, About
- [ ] Blog listing shows posts; `blog.xml` feed is generated
- [ ] Repo is **public**, Discussions enabled, giscus app installed
- [ ] giscus IDs filled into `posts/_metadata.yml`; a comment posted on a live
      post appears under the repo's Discussions
- [ ] Repo Watch set to Custom → Discussions (or All Activity)
- [ ] Pages source set to `gh-pages` branch; site loads at the live URL
- [ ] A push to `main` triggers the Action and updates the site

## Common gotchas

- **giscus widget renders but is empty / errors locally**: the discussion search
  works against the live URL/path mapping; it often only behaves correctly once
  deployed. Verify on the live site, not just `quarto preview`.
- **Comments not notifying you**: almost always the Watch level — recheck Step 6.
- **CI fails trying to run Python**: it shouldn't need to. Confirm `freeze: auto`
  is set and `_freeze/` is committed (not git-ignored).
- **Site 404s after first publish**: the Pages source branch (Step 8b) wasn't
  switched to `gh-pages`.
