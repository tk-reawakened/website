# Hosting spike 17.1 first pass

2026-11-14 · [Research issue #2709](https://github.com/tk-reawakened/rpgtoolkit-reawakened/issues/2709)

## Local browser proof

Built the product's existing browser runner with `pnpm build` and `pnpm browser:build` at product revision [82c90b2](https://github.com/tk-reawakened/rpgtoolkit-reawakened/commit/82c90b2da9590da7813417d22a6e0ff7173875cb). Packaged the authored village from `docs/spec/examples/game` using the product's existing package builder. The staged package contained `Main/example.gam` and the example project assets.

A plain HTTP file server bound to localhost served the player, its runtime assets, the package descriptor and the package. Chromium entered `boards/village.brd` through the public player page using `mode=whole`. The app reported no page errors or failed HTTP responses. This proof exercised a static origin with the runner mounted at the root. [Authored example](https://github.com/tk-reawakened/rpgtoolkit-reawakened/blob/82c90b2da9590da7813417d22a6e0ff7173875cb/docs/spec/examples/README.md)

| Measured input | Size |
| --- | ---: |
| Authored package | 10,127 bytes |
| Package descriptor | 238 bytes |
| Entire local static player fixture | 10,876,292 bytes across 34 files |

The total is the sum of the file sizes in a local browser build. The hosting trial should measure cold and warm transfer to visitors separately, with the provider's compression and caching in place. Keep the website catalogue entry and the playable build as separate inputs when modelling traffic.

The current runner uses origin-root URLs for its scripts, package descriptor and runtime assets. A GitHub Pages project preview can have a repository-name path prefix. Test that layout explicitly and use the same player origin for both website candidates if the runtime is hosted independently. [Browser runner entry](https://github.com/tk-reawakened/rpgtoolkit-reawakened/blob/82c90b2da9590da7813417d22a6e0ff7173875cb/packages/runner-web/app/main.ts) · [GitHub Pages site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#types-of-github-pages-sites)

## Candidate shortlist and cost model

Trial GitHub Pages and Cloudflare Pages. Both can serve the planned static catalogue and docs under their published free terms. GitHub Pages has a 1 GB deployed site limit and a 100 GB monthly soft bandwidth limit. Cloudflare Pages offers free static asset delivery and its free tier allows 500 builds per month, 20,000 files and 25 MiB per file. Cloudflare Workers Static Assets offers similar static delivery with a separate build-minute quota. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) · [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) · [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/) · [Workers build limits](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/)

The scenarios below estimate monthly USD before tax. They assume a 100 MB site, 1 MB and 20 requests per page view, and three build minutes per deploy. Quiet launch assumes 5,000 views and eight production plus eight preview builds. Sustained growth assumes 50,000 views and 20 production plus 20 preview builds. The burst month doubles sustained views. Build and page weights are assumptions for comparison. The local player fixture size is measured separately above.

| Site delivery only | 5 GB quiet launch | 50 GB sustained | 100 GB burst month |
| --- | ---: | ---: | ---: |
| GitHub Pages | $0 | $0 | $0 at the soft bandwidth limit |
| Cloudflare Pages | $0 | $0 | $0 |
| Cloudflare Workers Static Assets | $0 | $0 | $0 |
| Netlify | $0 at 240 credits | $14 with Personal and a top-up | $20 on Pro |
| AWS Amplify at metered rates | $1.27 | $8.79 | $16.29 |

GitHub may throttle Pages traffic, so reaching the soft limit is a reliability threshold. Cloudflare's free build and file limits constrain publishing, and any Functions calls have their own quota. Netlify Free pauses serving at 300 credits. Under the quiet scenario it reaches that cap at about 8.2 GB of site traffic, and 20 production deploys use the entire credit allowance by themselves. The Amplify estimate includes build time, transfer, and one month's retained artifact storage, with any introductory credits excluded. [Netlify credit rates](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) · [Netlify plan limits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) · [Amplify pricing](https://aws.amazon.com/amplify/pricing/)

Model large downloads and forum service independently. For example, a 250 MB download fetched 20,000 times transfers 5 TB. For such files, R2 Standard includes 10 GB-month of storage and has zero internet egress fees. At 25 GB-month and under the included operation limits, storage is about $0.23 per month. Production public delivery via a custom bucket domain requires a Cloudflare zone. Official product release artifacts can be linked from GitHub Releases. A forum can use GitHub Discussions or a separately hosted service, with account access, moderation and the cost of needed features evaluated separately. [R2 pricing](https://developers.cloudflare.com/r2/pricing/) · [Public bucket requirements](https://developers.cloudflare.com/r2/buckets/public-buckets/) · [GitHub release limits](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) · [Discourse plans](https://www.discourse.org/pricing)

## Deployed trial

1. Freeze a site build with a versioned docs page, search, a WIP game and a Vault item. Use Modern Web Guidance and Preact for the interactions. Record the artifact hash.
2. Deploy the same build to a GitHub Pages trial address and a Cloudflare Pages trial address. Verify direct navigation, reload, asset paths, keyboard use and browser play. Capture the first load and a later cached load. Record any host-specific base path or header configuration.
3. Publish a catalogue change from a reviewed PR and verify it appears on both hosts. Restore the previous build and recheck the same routes. For Cloudflare's built-in rollback, verify at least two production deployments on the trial project. Its preview deployments do not qualify as rollback targets. [Cloudflare Pages rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
4. Confirm account and repo access and document the DNS work for the chosen arrangement. GitHub Pages can keep the current DNS provider. Cloudflare Pages requires its nameservers to serve the apex directly and supports an external CNAME for a subdomain. Preserve Porkbun forwarding records in any later nameserver change. [Cloudflare Pages domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [Porkbun forwarding with external DNS](https://kb.porkbun.com/article/47-how-to-use-porkbun-email-when-your-dns-is-hosted-elsewhere)

The local player proof and the published pricing comparison are complete. Hosted deployment, PR publishing and rollback still need to be demonstrated on the trial projects.
