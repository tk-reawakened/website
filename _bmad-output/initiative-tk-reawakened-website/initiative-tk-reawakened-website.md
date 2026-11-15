---
type: initiative
title: "TK Reawakened Website"
parent: none
covers: ["CAP-19"]
risk: medium
---

# TK Reawakened Website

Publish the official home for TK Reawakened. Visitors can get the software and find documentation that matches their release. The community goal is to help creators and players discover projects, share progress and give feedback.

## Delivery

1. **Engine and docs.** [Epic 17](epic-documentation-website/epic-documentation-website.md) gives visitors a clear explanation of the product, official downloads and searchable docs for their release. The home page leads to the first-game guide under Create or Docs. The [product initiative](https://github.com/tk-reawakened/rpgtoolkit-reawakened/blob/main/_bmad-output/initiative-rpgtoolkit-reawakened/initiative-rpgtoolkit-reawakened.md) supplies the engine, editor and release artifacts. The release walkthrough proves a beginner can use both the software and the docs.
2. **Community.** [Epic 29](epic-community/epic-community.md) opens a moderated place for beginner questions, playtesting and feedback. Connect the site to durable discussions and run one small prompt to give new makers a reason to participate.
3. **Asset and game sharing.** [Epic 30](epic-game-submissions/epic-game-submissions.md) delivers the Games catalogue and moderated game submissions. [Epic 31](epic-vault/epic-vault.md) delivers the Vault for extensions, templates and asset packs. Creators supply links and listing details. Moderators review submissions and publish approved entries through website pull requests.

The [website brief](brief-tk-reawakened-website/brief-tk-reawakened-website.md) supplies the audience, navigation and acceptance scenarios for the three stages. The [organization roadmap](https://github.com/orgs/tk-reawakened/projects/3) tracks the epics and stories.

## Repository and release handoff

The website has its own [repository](https://github.com/tk-reawakened/website). This planning import carries Epic 17, its discovery notes, the website brief and the hosting spike from the [product planning PR](https://github.com/tk-reawakened/rpgtoolkit-reawakened/pull/2706). The existing [Epic 17](https://github.com/tk-reawakened/rpgtoolkit-reawakened/issues/1362) and [hosting spike](https://github.com/tk-reawakened/rpgtoolkit-reawakened/issues/2709) keep their issue IDs. New website issues live in the website repository. The product initiative can link its CAP-19 handoff here once the planning import lands.

The product repository is the source of released builds and the normative specification. The website directs visitors to official builds and publishes public docs. Decide how the two repositories exchange release metadata and verification inputs, and where the guide source lives, before choosing the publication workflow.

The owner has chosen `tk-reawakened.com` as the site domain. The host is open. See the [hosting comparison](epic-documentation-website/discovery/hosting-options.md).


## Web implementation guidance

**Decision (2026-11-14).** Use Preact with TypeScript for interactive website components. Generate the public pages as static HTML and load interactive components where needed. This follows the editor’s Preact convention and keeps the same site build usable across candidate hosts. The static generator and hosting provider are open.

Use [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) for website implementation and review regardless of host, framework or forum choice. The repository’s [agent guidance](../../AGENTS.md) lists how to install the [published skills](https://github.com/GoogleChrome/modern-web-guidance) in the website checkout. The [source repository](https://github.com/GoogleChrome/modern-web-guidance-src) is the upstream authoring and evaluation reference.

## Community venue

**Decision (2026-11-14).** Start the community on GitHub Discussions. Provide beginner-oriented categories for help, works in progress, showcasing games and resources. Link each game to its own discussion and link that discussion back to the game page. Evaluate giscus for inline discussion and use direct links regardless of the embed. Test the experience with a beginner, including GitHub sign-in, and investigate exporting discussion history. Select the repository or organization discussion home and moderators during community setup.
