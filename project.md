# Rising Venture — project handoff

This file is the single-page brief for anyone (Claude or human) picking up this project.
Read it first. It documents **what the site is, how it's built, where it's deployed, and what's
still open.**

---

## 1. What this is

**Rising Venture** is a Brazil-based search fund founded by Jan Riehle in 2017. A search fund is
an investment vehicle in which investors back a manager who locates, acquires, and operates a
single existing private company over a 4–10 year hold.

The 2026 redesign re-positions the fund around an **AI operating thesis**: in service
businesses, AI deployment compresses both variable cost (cost of services delivered) and fixed
cost (SG&A) at the same time, multiplying margin expansion before any growth. The site argues
that thesis and signals it through the visual identity (`.ai` TLD, dark / mesh-gradient
aesthetic, mono accents).

**Audiences:**
- Search-fund investors (sophisticated finance, mid-market acquaintance)
- Owners of mid-market service companies considering succession
- M&A intermediaries / brokers
- Prospective interns / operators

**Live URLs:**
- `https://risingventure.ai/` — primary canonical (Cloudflare → GitHub Pages)
- `https://www.risingventure.ai/` — same
- `https://risingventure.com.br/` — currently served by GitHub Pages, JS-redirects to `.ai`
- `https://www.risingventure.com.br/` — same
- `https://risingventures.com.br/` — registro.br URL forward → `.ai` (typo / plural variant)

---

## 2. Site architecture

**Framework:** Astro 4.16 (static SSG, no SSR). Picked over staying on Jekyll because the
2026 visual direction (animations, mesh gradients, scroll choreography) outgrows Jekyll's
templating and the markdown content model maps cleanly to Astro's content collections.

**Stack summary:**
- Astro 4.16 + TypeScript (strict)
- No CSS framework — scoped Astro `<style>` blocks + a small set of CSS variables in
  `Layout.astro`
- Google Fonts: Inter (sans), Instrument Serif (italic accents), JetBrains Mono
- No client-side JS framework; one inline script handles a host-based redirect
- Content collections (`astro:content`) for blog posts
- Astro `redirects` config for legacy Jekyll permalinks

**No external services used at build time** beyond fonts. Site is fully static after build.

### Repo layout

```
.
├── project.md                  ← this file
├── _config.yml, _layouts/, _posts/, *.html, *.md, Gemfile, ...
│                                 ↑ original Jekyll source — kept for reference,
│                                 excluded from Pages build (see below)
├── assets/                       ← original assets (mirror of site/public/assets/)
├── CNAME                         ← legacy, ignored once Pages source = workflow
├── .github/workflows/deploy.yml  ← Astro build + Pages deploy
└── site/                         ← Astro project root
    ├── package.json
    ├── astro.config.mjs          ← redirects + image:noop config
    ├── tsconfig.json
    ├── public/
    │   ├── CNAME                 ← www.risingventure.com.br (emitted into dist)
    │   ├── .nojekyll             ← tells Pages not to Jekyll-process the build
    │   ├── favicon.ico
    │   └── assets/               ← jan-2026.jpg, rising_symbol.png, post images, PDFs
    └── src/
        ├── content/
        │   ├── config.ts         ← blog collection schema (zod)
        │   └── blog/
        │       ├── searchfund-update.md         (2023, B4A retrospective — long)
        │       ├── b4a-formation.md             (2017)
        │       ├── itaro-exit.md                (2017)
        │       ├── multi-vertical-ecommerce.md  (2017)
        │       ├── searchfund-asset-class-brazil.md (2017)
        │       ├── searchfund-performance.md    (2017, refreshed with Stanford/IESE 2024)
        │       └── external-links.md            (2017)
        ├── components/
        │   ├── Nav.astro         ← top navigation, brand mark + 5 links
        │   └── Footer.astro      ← three-column footer
        ├── layouts/
        │   ├── Layout.astro      ← <html>, fonts, dark CSS variables, .prose styles,
        │   │                        host-redirect inline script
        │   └── PageLayout.astro  ← Layout + Nav + page-hero + Footer wrapper
        └── pages/
            ├── index.astro       ← home
            ├── what.astro        ← thesis (search fund concept, criteria, 5 stages)
            ├── playbook.astro    ← AI operating thesis (the .ai brand argument)
            ├── about.astro       ← Jan's bio + ventures + education
            ├── contact.astro     ← Formspree-backed form
            └── posts/
                ├── index.astro   ← writing index
                └── [...slug].astro  ← dynamic post page
```

### Component / layout responsibilities

- **`Layout.astro`** — base `<html>`, font preconnect, global CSS variables, `.prose` styles
  (used by both static page sections and rendered markdown), grain texture, and the inline
  `<script is:inline>` that redirects `*.com.br` hosts to `.ai`. Used by every page.
- **`PageLayout.astro`** — wraps `Layout` for non-home pages. Adds `Nav`, a page hero
  (`kicker`, `heading`, `lede` props), and `Footer`. Pages just `<slot />` their body.
- **`Nav.astro`** — fixed top nav with brand mark + links: Thesis, Playbook, Principal,
  Writing, Contact. Active link is detected from `Astro.url.pathname`.
- **`Footer.astro`** — 3-column layout: brand + tagline / site links / direct contact.
- The blog post detail page (`posts/[...slug].astro`) uses `Layout` directly (not
  `PageLayout`) because it has a different hero treatment (back link, post-meta row).
  The shared `.prose` styles for rendered markdown live in `Layout.astro` so all routes
  inherit them.

---

## 3. Style system

CSS variables in `Layout.astro` define the entire palette and typography:

```
--bg: #06080d          ← deep almost-black
--bg-elevated: #0c1018 ← cards, footer, math tables
--fg: #e7eaf0
--fg-muted: #8a92a3
--fg-subtle: #4a5063
--accent: #6ee7ff      ← cyan
--accent-2: #a78bfa    ← violet
--accent-3: #f0abfc    ← pink (used sparingly, in mesh gradients)
--border: rgba(255,255,255,0.08)
--border-strong: rgba(255,255,255,0.16)
--max-w: 1180px
--font-sans: 'Inter', ...
--font-mono: 'JetBrains Mono', ...
--font-serif: 'Instrument Serif', ...   ← used for italic emphasis only
```

**Visual motifs reused across pages:**
- Mesh-gradient blobs (3 floating circles with `mix-blend-mode: screen`, blurred, animated)
- Grid overlay with radial mask fading at edges (used in homepage hero)
- "// kicker" labels in mono font, accent color, lowercased
- Glassmorphic cards: subtle white-alpha gradient bg + 1px border + radial accent glow on hover
- Numbered sequence rows (sequence on `/playbook`, stages on `/what`)
- Italic serif inline `<em>` for emphasis ("acquiring _enduring businesses_", "_output ceiling_")
- Cyan→violet→pink gradient text for the most important number in any view

**Logo:** `site/public/assets/rising_symbol.png` — kept the original "rising bars" mark,
applied `filter: brightness(0) invert(1)` to render it pure white on the dark theme. Adds a
subtle cyan glow behind it on hover via a pseudo-element.

---

## 4. Local development

**Required Node:** ≥18.17.1 (Astro 4 requirement). The local machine has Node 19.1.0 via nvm,
which works with EBADENGINE warnings. CI uses Node 20.

```bash
# Path is in nvm
export PATH="$HOME/.nvm/versions/node/v19.1.0/bin:$PATH"

cd site
npm install      # ~30s
npm run dev      # port 4321
npm run build    # → site/dist/
```

**Preview server is also wired into Claude's MCP** via `.claude/launch.json` (name: `astro`).
The runtime args explicitly call `node site/node_modules/astro/astro.js dev --root site` to
bypass npm's engine warnings during development.

**Notes:**
- Sharp is in `optionalDependencies` but not actually used — `astro.config.mjs` sets
  `image.service = noop`. The site uses plain `<img>` tags throughout.
- `npm run dev` may need a `Cmd-Shift-R` after edits if the browser cached the inline JS
  redirect (`localhost` doesn't trigger the redirect anyway, but caching can be sticky).

---

## 5. Deployment

**Hosting:** GitHub Pages (free tier, public repo).

**Repo:** [`janriehle/risingventure`](https://github.com/janriehle/risingventure)
**Default branch:** `master`
**Pages source mode:** **`workflow`** (changed from `legacy` during the 2026 deploy — must
remain `workflow`)

**Build & deploy:** `.github/workflows/deploy.yml`
- Triggers on push to `master` (and manual `workflow_dispatch`)
- Permissions: `contents:read`, `pages:write`, `id-token:write`
- Steps: `actions/checkout@v4` → `actions/setup-node@v4` (Node 20) → `npm ci` → `npm run build`
  in `site/` → `actions/upload-pages-artifact@v3` from `site/dist` → `actions/deploy-pages@v4`
- Total runtime: ~30 s (build 17 s, deploy 11 s)

**What ends up live:** the contents of `site/dist/`, served at the root of
`www.risingventure.com.br` and (via Cloudflare proxy) `risingventure.ai`.

**Critical files in the build output:**
- `CNAME` (from `site/public/CNAME`) — `www.risingventure.com.br`. Required for Pages.
- `.nojekyll` (from `site/public/.nojekyll`) — empty file, tells Pages to skip Jekyll.
- The legacy Jekyll source files at the repo root are **excluded from the workflow build**
  because the build only operates inside `site/`. They sit there as historical reference;
  `_config.yml` was also updated to exclude `site/` and `.github/` so any final accidental
  Jekyll build is harmless.

### URL redirects (legacy Jekyll permalinks)

Configured in `site/astro.config.mjs` — Astro emits static meta-refresh HTML pages for these:

```
/2023/01/30/searchfund-update.html              → /posts/searchfund-update
/2017/08/20/b4a-formation.html                  → /posts/b4a-formation
/2017/04/13/itaro-exit.html                     → /posts/itaro-exit
/2017/05/09/multiple-store-brand-positioning-ecommerce.html → /posts/multi-vertical-ecommerce
/2017/03/29/Brazil.html                         → /posts/searchfund-asset-class-brazil
/2017/03/29/performance.html                    → /posts/searchfund-performance
/2017/03/18/performance.html                    → /posts/searchfund-performance
/2017/03/29/links.html                          → /posts/external-links
/2017/03/17/links.html                          → /posts/external-links
```

**Do not add self-referential entries** like `'/about/': '/about'` — they create infinite
redirect loops on GitHub Pages because Pages canonicalizes clean URLs to trailing-slash form,
which our redirect would then send back to the no-slash form. We learned this the hard way in
PR #14.

---

## 6. Domains & DNS

| Domain                     | Hosting           | Purpose                                   |
|----------------------------|-------------------|-------------------------------------------|
| `risingventure.ai`         | Cloudflare → GH Pages | **Primary canonical**                  |
| `www.risingventure.ai`     | Cloudflare → GH Pages | Same                                   |
| `risingventure.com.br`     | GH Pages (registro.br DNS) | Serves Astro site, JS redirects to .ai |
| `www.risingventure.com.br` | GH Pages (registro.br DNS) | Same                                   |
| `risingventures.com.br`    | registro.br URL forward | 301 → `.ai` (typo/plural variant)    |

### `risingventure.com.br` DNS (registro.br, advanced mode)

```
A     risingventure.com.br        192.30.252.153   ← deprecated GH Pages IP
A     risingventure.com.br        192.30.252.154   ← deprecated GH Pages IP
MX    risingventure.com.br        1  aspmx.l.google.com         ← Gmail
MX    risingventure.com.br        5  alt1.aspmx.l.google.com    ← Gmail
MX    risingventure.com.br        5  alt2.aspmx.l.google.com    ← Gmail
MX    risingventure.com.br        10 alt3.aspmx.l.google.com    ← Gmail
MX    risingventure.com.br        10 alt4.aspmx.l.google.com    ← Gmail
CNAME www.risingventure.com.br    janriehle.github.io.          ← the Pages site
```

- **DNSSEC is enabled** at registro.br (DNSKEY/NSEC records present).
- **No TXT records** — no SPF, DKIM, DMARC. Gmail outbound works thanks to Google's
  auto-DKIM. Worth adding `v=spf1 include:_spf.google.com ~all` someday for deliverability
  hygiene.
- The two A records point at GitHub's *deprecated* Pages IPs (192.30.252.153/154). Modern IPs
  are 185.199.108.153, .109.153, .110.153, .111.153. The deprecated ones still work but should
  be updated when DNS is touched next.

### `risingventure.ai` (Cloudflare)

- Account: `Janriehle@gmail.com`'s Cloudflare account (same as the registrar — Cloudflare
  Registrar)
- Acts as DNS + reverse proxy in front of GitHub Pages
- Both apex and `www` resolve to Cloudflare anycast IPs (104.21.x / 172.67.x), which then
  proxy to GitHub Pages

### `risingventures.com.br` (registro.br)

- Configured via registro.br panel: **DNS → Configurar Endereçamento → Endereço do site:
  `https://risingventure.ai`**
- This sets a registro.br-managed redirect (no Cloudflare, no Pages).
- No email configured on this domain.

---

## 7. Pages content overview

| Route        | Astro file              | What it argues                              |
|--------------|-------------------------|---------------------------------------------|
| `/`          | `pages/index.astro`     | Hero + 3 stats + 3 pillars + playbook callout + 4 latest posts |
| `/what`      | `pages/what.astro`      | Search fund concept, criteria, what we offer to owners and investors, 5-stage timeline |
| `/playbook`  | `pages/playbook.astro`  | The AI operating thesis: 2 wedges, the math (15% → 40% EBITDA), why now, why search funds, order of operations |
| `/about`     | `pages/about.astro`     | Jan's bio + photo + ventures + education + languages |
| `/contact`   | `pages/contact.astro`   | Formspree-backed form (target email: jan@risingventure.com.br) |
| `/posts`     | `pages/posts/index.astro`     | Writing index (date-sorted) |
| `/posts/[slug]` | `pages/posts/[...slug].astro` | Dynamic post pages with TOC support, prose styling, back link |

**Headline copy on home:**
> Acquiring _enduring businesses._
> Compounding for decades. *(gradient)*
>
> Rising Venture is a search fund identifying, acquiring, and operating enduring private
> companies in the Americas. Compounding value through hands-on operating leadership,
> AI-native modernization, and patient capital.

**Pillar titles (homepage):**
- 01 Identify — Pattern recognition over deal flow
- 02 Acquire — One company at a time (cadence: ~one every 3–5 years)
- 03 Operate — Long-term value compounding

**Stats (homepage):**
- 35.1% — Aggregate IRR, US & Canada search funds (Stanford 2024 study)
- US$ 8–30M — Target enterprise value range
- 4–10 yrs — Typical search-to-exit horizon

---

## 8. External integrations

- **Formspree** — `https://formspree.io/jan@risingventure.com.br` (POST). Used by the
  contact form. Free tier; first inbound triggers a confirm-by-email handshake.
- **Google Workspace** — `jan@risingventure.com.br` runs on Google's MX (5 records).
  Account is owned by the registro.br domain holder (Jan).
- **Cloudflare** — anycast proxy for `.ai`, registrar for `.ai`, DNS for `.ai`.
- **GitHub Pages** — static hosting, custom domain, free TLS via Let's Encrypt.
- **registro.br** — registrar + DNS for `.com.br` domains, plus URL-forward service for
  `risingventures.com.br`.
- **Google Fonts** — Inter, Instrument Serif, JetBrains Mono (loaded via `<link>` from
  `Layout.astro`).

---

## 9. Open items / known issues

### Pending: clean DNS-level 301 from `.com.br` → `.ai`

Currently using a **client-side JS redirect** in `Layout.astro` to canonicalize
`*.risingventure.com.br` → `risingventure.ai`. Works, but isn't a proper 301 and search
engines see two URLs serving the same content with a JS hop.

The proper fix is to migrate `risingventure.com.br` from registro.br DNS to Cloudflare DNS
and add a Bulk Redirect rule. **This is deferred** because:
- DNSSEC is enabled on the domain — naive nameserver swap would cause SERVFAIL outages for
  validating resolvers (Google 8.8.8.8, Cloudflare 1.1.1.1, many ISPs)
- Email risk: the 5 MX records must be perfectly mirrored on Cloudflare before NS switch
- Wall-clock realistic estimate: 4–24 hours including DNSSEC handoff sequencing

Detailed playbook for when this gets done lives in
`~/.claude/projects/.../memory/pending_cloudflare_dnssec_migration.md` (project memory).

### Other small things worth doing eventually

- **SPF record** on `.com.br` — currently no TXT records, Gmail outbound relies on auto-DKIM.
  Add `v=spf1 include:_spf.google.com ~all` next time DNS is touched.
- **Modernize A records** on `.com.br` apex — currently pointing to deprecated GH Pages IPs
  (192.30.252.153/154). Update to 185.199.108–111.153 next time.
- **Node 24 deprecation** — GitHub Actions warned that the v4 actions running on Node 20
  will be force-upgraded to Node 24 by June 2026. The Astro 4 build should be fine with 24,
  but worth bumping `setup-node` version when convenient.
- **Astro 5 / 6 upgrade** — currently pinned to ^4.16.18. Astro 6 is out (per the dev server
  banner). Not urgent.

---

## 10. Useful commands cheat-sheet

```bash
# Local dev
cd site && npm run dev                                  # port 4321
cd site && npm run build                                # builds to site/dist/
cd site && npx astro check                              # type-check + lint

# Working with content
ls site/src/content/blog/                               # all posts
ls site/public/assets/                                  # all bundled assets

# Deploy / GitHub
gh pr create --base master --head <branch> --title ... --body ...
gh pr merge <num> --merge --admin                       # admin merge bypasses checks
gh run watch <run_id> --exit-status                     # watch a deploy
gh run list --workflow=deploy.yml --limit 5             # recent deploys

# DNS / domain inspection
dig +short <domain>          ANY
dig +short <domain>          MX
dig +short <domain>          NS
curl -sIL https://<domain>/  | grep -E "HTTP|location"

# Pages config inspection (gh API)
gh api /repos/janriehle/risingventure/pages | jq
gh api -X PUT /repos/janriehle/risingventure/pages -f build_type=workflow  # don't run unless reverting
```

---

## 11. Conventions for future edits

- **Always work on a feature branch**, push, open a PR, merge. The deploy fires from a push
  to `master` regardless, but PRs let the diff be reviewed.
- **Verify post-deploy with `curl`** at minimum: home, every nav link, one post, one legacy
  redirect.
- **Don't add self-referential redirects** in `astro.config.mjs` (see §5 above).
- **Don't move `CNAME` out of `site/public/`** — Pages requires it in the deploy artifact.
- **Don't touch the `risingventure.com.br` MX records.** Gmail depends on them.
- **Image overflow on posts** — the shared `.prose img { max-width: 100% }` in `Layout.astro`
  prevents wide images from breaking out of the 760px post container. If you add a new
  layout/route for posts, make sure it inherits from `Layout`.
- **Numbers on the site that may go stale** — Stanford / IESE search-fund stats (refresh
  biennially), the EBITDA-margin illustration on `/playbook`, the headline IRR stat on home.

---

## 12. History (what the redesign actually did, abbreviated)

The 2026 rebuild on this branch:

1. Scaffolded Astro 4 in `site/`, ported the original Jekyll content into MD content
   collections, fixed typos, refreshed search-fund stats (Stanford 2016 → 2024, IESE 2024
   with the cohort-immaturity caveat).
2. Built the dark / mesh-gradient visual system, retained the original `rising_symbol.png`
   logo via CSS filtering rather than redrawing.
3. Wired `.github/workflows/deploy.yml` and switched Pages source from `legacy` (Jekyll) to
   `workflow` (Actions) via `gh api`.
4. Authored `/playbook` to give the `.ai` brand actual substance (the AI operating thesis
   for service businesses).
5. Set up `risingventures.com.br` URL forwarding at registro.br.
6. Added the JS host-redirect for `risingventure.com.br` → `.ai` as a temporary measure,
   pending the proper Cloudflare migration.
7. Hot-fixed an infinite redirect loop on `/what /about /contact /posts` caused by
   self-referential entries in `astro.config.mjs` (PR #14).

Pull requests of note:
- #13 — Initial Astro deploy
- #14 — Hotfix for redirect loop
- #15 — Client-side `.com.br` → `.ai` redirect
- #16 — `/playbook` page + homepage callout

---

If you're picking this up cold: read sections **1, 2, 5, 6, 9** first. That's enough to be
productive. The rest is reference.
