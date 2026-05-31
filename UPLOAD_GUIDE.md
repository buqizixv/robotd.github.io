# Article Upload Guide

## Quick Start (2 steps)

### Step 1 — Create your article JSON

Copy `articles/_TEMPLATE.json` to `articles/[number]-[slug].json` following the naming convention below.

### Step 2 — Register in content.js

Open `js/content.js`, add one entry to the `ARTICLE_MANIFEST` array at the bottom of the file:

```js
{ slug: "your-slug", date: "2026-05-15", category: "humanoid", featured: false }
```

That's it. The site will automatically load and display your article.

---

## Naming Convention

```
articles/{slug}.json
```

- The filename must **exactly match** the `slug` field in the JSON, plus `.json`.
- Example: if `"slug": "boston-dynamics-new-atlas"`, the file must be named `boston-dynamics-new-atlas.json`.

## Category Values

| slug | English Label | 中文 |
|------|--------------|------|
| `humanoid` | Humanoid Robots | 人形机器人 |
| `industrial` | Industrial Automation | 工业自动化 |
| `ai-robotics` | AI & Robotics | AI与机器人 |
| `drones` | Drones & UAVs | 无人机 |
| `medical` | Medical Robotics | 医疗机器人 |
| `research` | Research & Breakthroughs | 研究突破 |

## JSON Field Reference

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `slug` | Yes | string | URL identifier, must match filename slug |
| `date` | Yes | string | ISO format `YYYY-MM-DD` |
| `category` | Yes | string | One of the 6 category slugs above |
| `featured` | No | boolean | `true` = appears in hero featured section |
| `en.title` | Yes | string | English title, shown in h1 and `<title>` |
| `en.summary` | Yes | string | English summary, used in cards and `<meta name="description">` |
| `en.body` | Yes | string | Full article body in HTML. **Minimum 1000 words.** |
| `zh.*` | Yes | -- | Same fields, Chinese version |

## Body HTML — Allowed Tags

Use standard HTML for formatting. The CSS already handles styling:

- `<p>` — Paragraphs
- `<h2>` — Section headings (h1 is the article title, auto-generated)
- `<h3>` — Sub-headings
- `<ul><li>` — Bullet lists
- `<ol><li>` — Numbered lists
- `<strong>` — Bold
- `<em>` — Italic
- `<blockquote>` — Pull quotes
- `<code>` — Inline code

Do NOT use: `<img>`, `<script>`, `<style>`, or inline styles. Images go in `images/` folder and use `<img src="images/filename.jpg">`.

## Quality Requirements (for AdSense Approval)

- Each article body must be **1000+ words**
- Content must be **original** — not copied or auto-translated
- Each article should target **one primary keyword**, used in title, first paragraph, and 2-3 times in body
- Link to **3-5 related articles** within the body using `<a href="#related-slug">`

## Example Article Body Structure

```html
<p>[Hook: why this news matters, 2-3 sentences with primary keyword]</p>

<h2>Background</h2>
<p>[Context: what led to this development, 150-200 words]</p>

<h2>What Happened</h2>
<p>[Core news: the announcement, demo, paper, or product, 300-400 words]</p>

<h2>Why It Matters</h2>
<p>[Analysis: implications for the industry, 200-300 words]</p>

<h2>Expert Reactions</h2>
<p>[Quotes or context from researchers/industry, 150-200 words]</p>

<h2>What's Next</h2>
<p>[Forward-looking: roadmap, upcoming milestones, 150-200 words]</p>
```
