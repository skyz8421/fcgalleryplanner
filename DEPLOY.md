# Release FCGallery

Domain: `https://fcgallery.wiki/`. Cloudflare Workers static assets serve `out/`; the deployment config contains this site's dedicated name and custom domain.

1. Run `pnpm build` and inspect all failures.
2. Verify core tools, light/dark layouts, navigation, SEO, mobile and production headers.
3. Complete independent reviews and fix release blockers. Record the final reviewed source with `node scripts/check-review-stamp.mjs --record --report _review/final-review.md --reviewer independent-codex`.
4. Run `pnpm cf:deploy` using the configured Cloudflare account.
5. Recheck every sitemap route, actual 404 status, redirects, scripts, fonts, images and the tools on the live domain. Platform submission is not proof of indexing or analytics arrival.

Cloudflare retains deploy versions. Use the previous verified version ID with Wrangler rollback if a live regression is found. The initial release has no older production version; retain its version ID as the next release's rollback target.
