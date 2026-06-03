# Writing `.qmd` files — Python, notebooks, and embeds

Practical examples for authoring blog posts in Quarto. Everything here assumes the
project set up in `SETUP.md` (a blog project with `freeze: auto` on `posts/`).

A `.qmd` file is plain Markdown plus a YAML header plus **executable code cells**.
That's the whole point of choosing `.qmd` over `.md`: Quarto runs the code at
render time and drops the output (text, tables, plots) into the page.

---

## 1. Anatomy of a post

Each post lives in its own folder: `posts/<slug>/index.qmd`. Minimal example:

````markdown
---
title: "My First Post"
description: "What this post is about"
author: "Mark Muetz"
date: "2026-06-03"
categories: [python, data]
---

Intro paragraph in **Markdown**.

```{python}
print("Hello from an executable cell")
```
````

Notes:

- `date` drives ordering in the blog listing; `categories` become filter tags.
- The folder name (the slug) becomes part of the URL.
- Put images/data the post needs in the **same folder** and reference them
  relatively (`![](diagram.png)`, `pd.read_csv("data.csv")`).

---

## 2. Markdown quick reference

```markdown
## A heading

Normal text with *italics*, **bold**, `inline code`, and a [link](https://quarto.org).

- bullet
- list

1. numbered
2. list

> A blockquote.

Inline math $E = mc^2$ and display math:

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$
```

Math renders out of the box (MathJax in HTML).

---

## 3. Executable Python cells

A fenced block tagged `{python}` is executed; its output is inserted below it.

````markdown
```{python}
import numpy as np

x = np.arange(5)
x ** 2
```
````

Renders the code **and** the result `array([ 0,  1,  4,  9, 16])`.

### Cell options

Options go at the top of the cell as `#|` comments:

````markdown
```{python}
#| echo: false        # hide the source, keep the output
#| warning: false     # suppress warnings
#| code-fold: true    # show code in a collapsible <details> (overrides echo)
import pandas as pd
pd.DataFrame({"a": [1, 2], "b": [3, 4]})
```
````

Common options:

| Option        | Effect                                                      |
|---------------|-------------------------------------------------------------|
| `echo`        | `true`/`false` — show or hide the source code               |
| `eval`        | `true`/`false` — run the code or just display it            |
| `output`      | `true`/`false`/`asis` — show output (`asis` = raw markdown) |
| `code-fold`   | `true`/`show` — collapsible code block                      |
| `warning`     | `false` to hide warnings                                    |
| `error`       | `true` to render even if the cell raises                    |
| `include`     | `false` to run the cell but show neither code nor output    |

A document-wide default can be set in the front matter:

```yaml
---
title: "..."
execute:
  echo: true
  warning: false
---
```

---

## 4. Figures with captions and cross-references

Give a plotting cell a `label` starting with `fig-` and a `fig-cap`, then refer to
it in prose with `@fig-...`:

````markdown
```{python}
#| label: fig-parabola
#| fig-cap: "A simple parabola."
import matplotlib.pyplot as plt

x = range(-10, 11)
plt.plot(list(x), [v**2 for v in x])
plt.show()
```

As shown in @fig-parabola, the curve is symmetric about zero.
````

Quarto auto-numbers the figure and turns `@fig-parabola` into a clickable
"Figure 1" link.

Tables work the same way with a `tbl-` label and `tbl-cap`.

---

## 5. Embedding output from a separate `.ipynb`

If you keep a Jupyter notebook as a working document and only want to surface a
specific result in a post, use the `embed` shortcode instead of pasting code.

Given a notebook `analysis.ipynb` in the post folder, label the cell you want
(in Jupyter, set the cell's metadata/tag, or in a `.qmd`-style notebook use
`#| label: fig-results`), then:

```markdown
See the key result below.

{{< embed analysis.ipynb#fig-results >}}
```

- `analysis.ipynb` — path to the notebook (relative to the post).
- `#fig-results` — the **label** of the cell whose output you want.
- You can embed multiple cells with multiple shortcodes.
- Add `echo=true` to also show the source:
  `{{< embed analysis.ipynb#fig-results echo=true >}}`

This renders the notebook's *output* into your post without re-typing the code,
which is ideal when the notebook is your exploratory scratchpad and the post is
the polished write-up.

> You can also author an entire post **as** a notebook: put `index.ipynb` in the
> post folder instead of `index.qmd`, with a raw first cell holding the YAML
> front matter. For mostly-prose posts, `.qmd` is easier; for heavy interactive
> exploration, a notebook can be more comfortable. Both render identically.

---

## 6. A complete worked post

`posts/first-analysis/index.qmd`:

````markdown
---
title: "A First Data Analysis"
description: "Plotting a noisy signal with numpy and matplotlib."
author: "Mark Muetz"
date: "2026-06-03"
categories: [python, numpy, plotting]
---

This post generates a noisy sine wave and smooths it, to show off executable
code, a captioned figure, and a table.

## Generate data

```{python}
#| code-fold: true
import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
t = np.linspace(0, 4 * np.pi, 200)
signal = np.sin(t)
noisy = signal + rng.normal(0, 0.3, size=t.size)
```

## Plot it

```{python}
#| label: fig-signal
#| fig-cap: "Noisy signal (grey) vs. true sine (black)."
#| echo: false
import matplotlib.pyplot as plt

plt.figure(figsize=(7, 3))
plt.plot(t, noisy, color="0.7", label="noisy")
plt.plot(t, signal, color="black", label="true")
plt.legend()
plt.show()
```

@fig-signal shows the noise we added. The summary statistics:

```{python}
#| label: tbl-stats
#| tbl-cap: "Summary of the noisy signal."
#| echo: false
pd.DataFrame({
    "metric": ["mean", "std", "min", "max"],
    "value": [noisy.mean(), noisy.std(), noisy.min(), noisy.max()],
}).round(3)
```

Comments (giscus) appear automatically at the bottom of this post.
````

Preview it with `quarto preview`, then commit — including the updated `_freeze/`
cache so the GitHub Action publishes the rendered output without running Python.

---

## 7. Freeze reminder

Because `posts/_metadata.yml` sets `freeze: auto`:

- Cells re-execute **only** when their source changes.
- Render **locally** (with your `.venv` active) so results are cached in
  `_freeze/`.
- **Commit `_freeze/`.** That cache is what gets published; CI never runs your
  Python. If you forget, the live site shows stale or missing output.

To force a clean re-render of everything:

```bash
quarto render --cache-refresh
```

---

## 8. Handy commands

```bash
quarto preview                       # live-reloading local preview of the site
quarto preview posts/first-analysis/ # preview one post
quarto render                        # render the whole site to _site/
quarto render posts/first-analysis/index.qmd   # render a single file
```
