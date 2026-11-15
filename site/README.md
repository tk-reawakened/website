# TK Reawakened website

Run `npm ci`, `npm run check` and `npm run build` in this directory. Serve `dist/` at the root of a static host. Run `npm run preview` to view it locally on port 8943.

The root page is a temporary coming-soon landing page. The normal local build also generates the work-in-progress homepage at `/preview/` and the other preview pages. The production build (`npm run build -- --production`) excludes those pages.

The build generates the shared navigation, page markup and search index. The docs page can be browsed without JavaScript. Preact powers the optional search form.

The home, download and first-game pages describe the current preview, not a released editor or installer. Check the product repository's official GitHub releases and shipped documentation before updating release availability or installation guidance.

The Village Demo uses the published Cloudflare trial player. The product repository supplies its source and technical documentation. The TK Corpus and Ludothèque supply historical catalogue references. See the site’s Credits page for asset sources.

## Publishing

The Website GitHub Actions workflow checks pull requests and deploys changes merged to `main` to the `tk-reawakened-site` Cloudflare Worker. It builds the static site and Cloudflare output once, dry-runs that output, then deploys the same output. It does not deploy pull requests. A manual run deploys only when run on `main`.

Before the first deployment, add `CLOUDFLARE_ACCOUNT_ID` and a least-privilege `CLOUDFLARE_API_TOKEN` as GitHub Actions secrets. The token must be allowed to deploy Workers in the chosen Cloudflare account. Configure the production domain separately after verifying the deployment; do not modify existing mail DNS records. The workflow must be merged into `main` before it can publish.

To check the production package locally, run `npm ci`, `npm run check`, `npm run build -- --production`, `npx cf build --mode production`, and `npx cf deploy --prebuilt --mode production --dry-run`. The dry run does not deploy or verify credentials.
