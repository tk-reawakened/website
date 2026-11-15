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

The current runner uses origin-root URLs for its scripts, package descriptor and runtime assets. If we use the GitHub Pages fallback, test its repository-name path prefix or serve the runner from a separate root-mounted origin. Use the same player origin for both trials if we host the runner independently. [Browser runner entry](https://github.com/tk-reawakened/rpgtoolkit-reawakened/blob/82c90b2da9590da7813417d22a6e0ff7173875cb/packages/runner-web/app/main.ts) · [GitHub Pages site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#types-of-github-pages-sites)

## Candidate shortlist and cost model

Trial Cloudflare Pages and a private S3 bucket behind a flat-rate CloudFront distribution. Both can serve the planned static catalogue and docs. Cloudflare Pages offers free static asset delivery and its free tier allows 500 builds per month, 20,000 files and 25 MiB per file. Cloudflare Workers Static Assets offers similar static delivery with a separate build-minute quota. GitHub Pages is a fallback with a 1 GB deployed site limit and a 100 GB monthly soft bandwidth limit. [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) · [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/) · [Workers build limits](https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/) · [CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/) · [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

The scenarios below estimate monthly USD before tax. They assume a 100 MB site, 1 MB and 20 requests per page view, and three build minutes per deploy. Quiet launch assumes 5,000 views and eight production plus eight preview builds. Sustained growth assumes 50,000 views and 20 production plus 20 preview builds. The burst month doubles sustained views. Build and page weights are assumptions for comparison. The local player fixture size is measured separately above.

| Site delivery only | 5 GB quiet launch | 50 GB sustained | 100 GB burst month |
| --- | ---: | ---: | ---: |
| GitHub Pages | $0 | $0 | $0 at the soft bandwidth limit |
| Cloudflare Pages | $0 | $0 | $0 |
| Cloudflare Workers Static Assets | $0 | $0 | $0 |
| Netlify | $0 at 240 credits | $14 with Personal and a top-up | $20 on Pro |
| AWS Amplify at metered rates | $1.27 | $8.79 | $16.29 |
| AWS S3 + CloudFront Free (delivery plan) | $0 | $0 at the 1M request allowance | $0 at 100 GB and 2M requests |

GitHub may throttle Pages traffic, so reaching the soft limit is a reliability threshold. Cloudflare's free build and file limits constrain publishing, and any Functions calls have their own quota. Netlify Free pauses serving at 300 credits. Under the quiet scenario it reaches that cap at about 8.2 GB of site traffic, and 20 production deploys use the entire credit allowance by themselves. The Amplify estimate includes build time, transfer, and one month's retained artifact storage, with any introductory credits excluded. [Netlify credit rates](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/) · [Netlify plan limits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) · [Amplify pricing](https://aws.amazon.com/amplify/pricing/)

CloudFront Free includes 100 GB transfer, 1 million requests and a 5 GB S3 Standard storage credit per month. At 20 requests per view, the burst scenario reaches 2 million requests. CloudFront charges no delivery overages and documents normal service for a first spike up to three times the monthly allowances. Sustained or unusually high excess can affect performance. Pro is $15 per month with 50 TB transfer, 10 million requests and a 50 GB S3 Standard storage credit. The table shows the CloudFront plan price. S3 bucket requests, storage above the credit and any separately billed deployment or DNS services need their own estimates. [CloudFront allowances and excess usage](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html#flat-rate-pricing-plan-allowances) · [CloudFront pricing](https://aws.amazon.com/cloudfront/pricing/) · [S3 pricing](https://aws.amazon.com/s3/pricing/)

Model large downloads and forum service independently. For example, a 250 MB download fetched 20,000 times transfers 5 TB. For such files, R2 Standard includes 10 GB-month of storage and has zero internet egress fees. At 25 GB-month and under the included operation limits, storage is about $0.23 per month. Production public delivery via a custom bucket domain requires a Cloudflare zone. Official product release artifacts can be linked from GitHub Releases. A forum can use GitHub Discussions or a separately hosted service, with account access, moderation and the cost of needed features evaluated separately. [R2 pricing](https://developers.cloudflare.com/r2/pricing/) · [Public bucket requirements](https://developers.cloudflare.com/r2/buckets/public-buckets/) · [GitHub release limits](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) · [Discourse plans](https://www.discourse.org/pricing)

The same 5 TB download workload fits the CloudFront Pro transfer allowance. If the downloads share the site's distribution, count game and Vault traffic against the same request and transfer allowances. Model a separate distribution separately if the trial uses one. Measure origin requests and cache behavior before adopting pack or game hosting. [CloudFront flat-rate plans](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)

## AWS self-serve submissions

The creator submits a WIP game or Vault listing. A moderator reviews the submission and a website pull request updates the static catalogue. For an on-site form, keep the submission and review status in a small API and database. If the site accepts files, give authenticated creators short-lived, size-limited browser uploads to a private S3 intake bucket. Keep files private until scan and review pass. The catalogue PR includes only approved metadata and links. Serve creator-supplied web builds on a separate origin from the main site. [S3 browser upload policy](https://docs.aws.amazon.com/AmazonS3/latest/developerguide/sigv4-HTTPPOSTConstructPolicy.html) · [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)

| Intake scope | Incremental AWS budget at launch | Estimated development time |
| --- | ---: | ---: |
| Linked intake using the community or a GitHub Issue Form, with an external build or download link and a maintainer-written PR | $0 to the website's AWS bill | A few days |
| Website form for screenshots and externally hosted build or pack links, with sign-in, review status and a small moderator queue | Around $0–$2/month | 1–2 developer weeks total |
| Website intake with private build and pack uploads, scanning, moderation and approved catalogue PRs | Around $3–$5/month in the modeled workload | 2–4 developer weeks total |

The dollar ranges are planning estimates for US East (N. Virginia), separate from the public CloudFront delivery plan, published file storage, and forum service. The upload model assumes 100 submissions per month, four objects per submission, 20 GB scanned, 20 GB-month retained in private intake, 1,000 HTTP API calls and light logging. At list rates, scanning is about $1.89 and S3 Standard storage about $0.46 before credits. HTTP API and DynamoDB requests are fractions of a cent at that load. Cognito Lite or Essentials and Lambda can fit within their eligible free allowances. One GitHub App key in Secrets Manager would add $0.40/month plus requests if PR creation is automated. [S3 Standard rate example](https://aws.amazon.com/blogs/database/automate-postgresql-audit-log-extraction-and-analysis-with-amazon-s3/) · [GuardDuty pricing](https://aws.amazon.com/guardduty/pricing/) · [HTTP API pricing](https://aws.amazon.com/api-gateway/pricing/) · [DynamoDB pricing](https://aws.amazon.com/dynamodb/pricing/) · [Cognito pricing](https://aws.amazon.com/cognito/pricing/) · [Lambda pricing](https://aws.amazon.com/lambda/pricing/) · [Secrets Manager pricing](https://aws.amazon.com/secrets-manager/pricing/)

The time ranges assume one developer and an existing static site and CI. Budget 10–20 minutes to review a straightforward entry, or about 5–10 hours from moderators for 30 entries. Use the trial to time one WIP submission from creator intake through a moderator checking browser play, screenshots, credit and the discussion backlink, then previewing, publishing and rolling back its catalogue PR. Try a form with external build links first and use a private file upload as a separate proof for when the site takes on storage. [GitHub Issue Forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)

## Deployed trial

1. Freeze a site build with a versioned docs page, search, a WIP game and a Vault item. Use Modern Web Guidance and Preact for the interactions. Record the artifact hash.
2. Deploy the same build to Cloudflare Pages and CloudFront trial addresses. Use a private S3 origin with CloudFront origin access control. Verify direct navigation, reload, asset paths, keyboard use and browser play. Capture the first load and a later cached load. Record the configuration for nested docs URLs, response headers and browser runner assets. [CloudFront S3 origin access control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
3. Publish a catalogue change from a reviewed PR and verify it appears on both hosts. Restore the previous build and recheck the same routes. Exercise Cloudflare's built-in rollback with two production deployments on the trial project. On AWS, restore the previous build artifact and verify visitors receive it after cache invalidation. Record the work needed to give reviewers a PR preview on AWS. [Cloudflare Pages rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/) · [CloudFront invalidations](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
4. Confirm account and repo access and document the DNS work for the chosen arrangement. Cloudflare Pages requires its nameservers to serve the apex directly and supports an external CNAME for a subdomain. For CloudFront, verify the apex record and TLS certificate setup with the existing DNS provider and compare with an attached Route 53 zone. Preserve Porkbun forwarding records in any later nameserver change. [Cloudflare Pages domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [CloudFront alternate domains](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html) · [Porkbun forwarding with external DNS](https://kb.porkbun.com/article/47-how-to-use-porkbun-email-when-your-dns-is-hosted-elsewhere)

The player runs locally on a static origin. Hosted deployment, PR publishing, rollback and AWS origin request costs still need to be checked on the trial projects.
