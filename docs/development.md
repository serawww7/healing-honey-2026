# Development log

## 2026-11-01 — Technical SEO audit (qiaomu-seo) + fixes

### Summary
Installed `qiaomu-seo` (`npx skills add joeseesun/qiaomu-seo`) and ran a technical SEO audit of the Hugo site `healing-honey.pp.ua`. Authorized fixes were applied immediately.

### Modified files
- `.agents/skills/qiaomu-seo/` (installed skill)
- `themes/pehtheme-hugo/layouts/partials/head.html`
- `themes/pehtheme-hugo/layouts/_default/baseof.html`
- `themes/pehtheme-hugo/layouts/_default/single.html`
- `themes/pehtheme-hugo/layouts/_default/list.html`
- `themes/pehtheme-hugo/layouts/_default/search.html` (added)
- `themes/pehtheme-hugo/layouts/search.html` (added)
- `themes/pehtheme-hugo/static/robots.txt`
- `layouts/404.html` (project-level; required for Hugo 0.164)
- `layouts/search.html`
- `hugo.toml`
- `content/search.md`
- `content/about.md`
- `content/posts/_index.md` (added)
- `content/posts/dlia-shlunka.md`
- `content/posts/yak-roztopyty-propolis.md`
- `content/posts/pry-vyraztsi-shlunka.md`
- `content/posts/pry-vyraztsi-shlunka-2026.md`
- `content/posts/what-dissolves-propolis.md`
- `content/posts/v-chomu-rozchyniaietsia.md`
- `content/posts/propolis-honey-preparation.md`
- Removed `content/404.md` (blocked generation of real `public/404.html`)
- `docs/seo-audit-2026-11-01.md`
- `docs/development.md`

### Added functionality / fixes
- Correct meta description / Open Graph / Twitter tags (including `og:image`)
- `og:type` = `website` vs `article`
- BlogPosting / WebSite / WebPage JSON-LD by page type
- Self-referencing canonicals for paginated home pages
- `noindex` for search; proper root `404.html` with `noindex`
- Search layout actually applied (was falling back to article single)
- Sitemap excludes search/404
- robots.txt disallows `/search/` and `/404.html`
- Unique titles + canonicals for near-duplicate posts
- Author moved under `[params.author]`; removed placeholder GA/Disqus
- Deprecated `languageCode` → `locale`; fixed `Language.Locale` / `Direction` in baseof

### Implementation notes
- Do not restore `content/404.md`: in Hugo 0.164 it prevents `public/404.html` from being emitted.
- Home pagination must call `.Paginate` with the same args in `head.html` and `home.html`.
- Redeploy `public/` (or CI build) for changes to become live.

## 2026-11-01 — TikTok embed nickname

### Summary
Updated TikTok sidebar embed nickname from `@coach.sergiy` to `@sergiy_polishchuk_ua`.

### Modified files
- `themes/pehtheme-hugo/layouts/partials/content/aside-banner.html`
- `docs/development.md`

### Notes
Video id unchanged (`7238259674942950661`). Site rebuilt with `hugo --minify`.

## 2026-11-01 — Fix Cloudflare Pages deploy

### Summary
Push to GitHub succeeded, but Cloudflare Pages build failed on Hugo `0.116.0` because `site.Language.Locale` is unavailable. Restored `LanguageCode` / `languageCode`, set Pages `HUGO_VERSION=0.164.0`, removed tracked `.agents` from the repo.

### Modified files
- `themes/pehtheme-hugo/layouts/_default/baseof.html`
- `hugo.toml`
- `.gitignore`
- Cloudflare Pages env `HUGO_VERSION`
- `docs/development.md`
