# Hosting spike fixture

This is a disposable static hosting trial, not the production website. Version labels and short docs text demonstrate routing and search; they do not describe released documentation. The screenshot is from the authored village example at product revision `82c90b2da9590da7813417d22a6e0ff7173875cb` and is credited on every page. The game and runner are built from that product revision, including its bundled asset notices.

Use a separate checkout of the product repository at that revision, install its dependencies, then run `pnpm build` and `pnpm browser:build` there. In this directory:

```sh
npm ci
TKR_PRODUCT_ROOT=/absolute/path/to/product node prepare-runner.mjs
npm run check
npm run build
```

`dist/` contains the site and runner mounted at the origin root. `TKR_RUNNER_FIXTURE` can point `npm run build` at an already staged equivalent. The staged binary output and dependencies are intentionally not committed. The `pages.dev` trial is public; it is not connected to the production domain or mail DNS.
