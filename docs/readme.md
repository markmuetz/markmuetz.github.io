# Day-to-day guide

## Writing and publishing a post

```bash
cd ~/projects/markmuetz.github.io
source .venv/bin/activate

# create a new post
mkdir -p posts/my-post-slug
# edit posts/my-post-slug/index.qmd  (see WRITING-QMD.md)

# preview locally with live reload
quarto preview

# when happy, render to update _freeze/
quarto render

# commit everything (source + updated _freeze/) and push
git add -A
git commit -m "Post: my post title"
git push
```

The GitHub Action runs on every push to `main` and the live site updates within
~1–2 minutes.

## Drafts

Add `draft: true` to a post's front matter to hide it from the blog listing while
still rendering it locally. Remove the line when ready to publish.

Note: draft posts still render and execute code — always run `quarto render`
locally and commit `_freeze/` before pushing, otherwise CI will re-execute cells
and may fail.

## Adding a Python package

```bash
source .venv/bin/activate
uv pip install <package>
uv pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add <package> to requirements"
```

## Monitoring a deploy

After pushing, check the Action at:
```
https://github.com/markmuetz/markmuetz.github.io/actions
```

Or from the terminal:
```bash
gh run list --repo markmuetz/markmuetz.github.io --limit 5
gh run view <run-id> --repo markmuetz/markmuetz.github.io
```

Two runs appear per deploy:
1. **Quarto Publish** — renders and pushes to `gh-pages` (~1 min)
2. **pages build and deployment** — GitHub bakes the HTML (~30 s)

The site is live once both are green.

## Checking the live site

```bash
# quick check from the terminal
gh api repos/markmuetz/markmuetz.github.io/pages --jq '.status'
```

Or just open `https://markmuetz.github.io`.
