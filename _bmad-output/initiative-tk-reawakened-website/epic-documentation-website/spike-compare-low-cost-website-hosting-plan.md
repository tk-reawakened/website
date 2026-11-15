---
title: "Compare low-cost website hosting and publishing"
type: "feature"
ticket: 1
created: "2026-11-14"
status: "draft"
baseline_revision: "c8e035de43b10e5f1e798d371c3d7f98896f019c"
route: "full"
route_source: "auto"
risk: "medium"
review: ""
review_source: ""
lenses_ran: []
review_loop_iteration: 0
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

Build a representative static website and trial the same artifact on Cloudflare Pages and AWS S3 with CloudFront. Determine the cost and operating work to review and publish catalogue submissions, and recommend a launch host and fallback.

## Boundaries & Constraints

Use Preact for interactive components and Modern Web Guidance. Use original or licensed content, published product behavior and the authored game fixture. Keep the host choice open until the results are reviewed. Preserve the existing Porkbun mail configuration.

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
| --- | --- | --- | --- |
| First visit | Visitor opens homepage | Product, docs, Games and Vault are discoverable | Links remain usable with scripts disabled where practical |
| Docs | Visitor chooses a version and searches | Matching versioned documentation appears and deep links reload | Empty search has understandable feedback |
| Work in progress | Visitor opens a catalogue entry | Screenshots, browser play and a discussion link are available | Inaccessible discussion has a direct link |
| Deployment | Reviewer approves a catalogue PR | Same hashed artifact publishes and prior build can be restored | Record failed steps and recover the previous site |

</frozen-after-approval>

## Code Map

- `spike-compare-low-cost-website-hosting.md` holds the issue and acceptance criteria.
- `discovery/hosting-spike-first-pass.md` records pricing assumptions and a local proof of the product runner.
- `/tmp/tkr-website-hosting-trial.jbLpVo/public` contains the authored game and built runner. It expects origin-root paths. Reproduce from product revision 82c90b2 if the temporary fixture is unavailable.
- The website repository currently contains planning, with PR #1 still draft. Keep the trial reviewable on a dedicated branch.
- AWS profile `tk-reawakened-website` uses `us-east-2` and reports the FREE plan. Verify plan support and deployment permissions. Cloudflare credentials have not been found locally.

## Tasks & Acceptance

- [ ] Build a small static fixture with a homepage, two documentation versions and search, a WIP entry with screenshots and playable authored game, and a Vault item.
- [ ] Apply the relevant Modern Web Guidance and verify keyboard navigation, mobile layout, direct links and playback locally.
- [ ] Record the artifact hash and deploy the same build to CloudFront and Cloudflare Pages trial addresses. Record missing access if a provider cannot be reached.
- [ ] Review a catalogue change through a PR, publish it on each reachable provider and restore the previous build. Record commands, outputs, timing and cold and warm transfer.
- [ ] Update `discovery/hosting-spike-first-pass.md` and `discovery/hosting-options.md` with dated cost models, forum and download costs, limits, verified behavior, a recommendation and fallback.

Given the same artifact on both trial addresses, when a visitor opens each route, searches documentation and plays the WIP, then the results agree. Given a reviewed catalogue change, when a maintainer publishes and restores the earlier build, then the expected version is visible. Any unavailable provider is clearly identified as unverified.

## Implementation Notes

## Plan Change Log

## Review Triage Log

## Verification

Run the site build and its checks, exercise browser and keyboard flows against each deployed host, and validate the BMAD ticket tree and documentation links. Record the commands and outcomes in the spike report.
