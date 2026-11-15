import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';

const product = 'https://github.com/tk-reawakened/rpgtoolkit-reawakened';
const discussions = product + '/discussions';
const archive = 'https://tk-reawakened.github.io/corpus';
const corpus = 'https://github.com/tk-reawakened/corpus';
const gamesRepo = 'https://github.com/tk-reawakened/ludotheque';
const revision = '82c90b2da9590da7813417d22a6e0ff7173875cb';
const example = product + '/tree/' + revision + '/docs/spec/examples/game';
const exampleNotes = product + '/blob/' + revision + '/docs/spec/examples/README.md';
const runner = 'https://tkr-hosting-spike-2709.pages.dev/packages/runner-web/app/?package=games/authored-example.tpk&amp;mode=whole';
const downloads = product + '/releases';

const navigation = [
  ['/games/', 'Play'],
  ['/create/', 'Create'],
  ['/vault/', 'The Vault'],
  ['/docs/', 'Docs'],
  ['/community/', 'Community'],
  ['/download/', 'Download'],
];

const guides = [
  {
    slug: 'first-game',
    title: 'Your first game',
    summary: 'Play the Village Demo and explore the map, tiles and scripts that make it work.',
    keywords: 'getting started beginner board movement',
    body: `<p>TK Reawakened is still in development. This preview lets you explore an example; the game editor and a full first-game tutorial are not available yet.</p>
      <h2>Play the Village Demo</h2>
      <p>The demo currently needs a keyboard. On a computer, open it, press <kbd>Space</kbd> at the welcome screen, then use the arrow keys to explore the board.</p>
      <p><a class="button primary" href="/games/village/">Open the Village Demo</a></p>
      <h2>Look inside the project</h2>
      <ol>
        <li>Open <a href="${example}">the example project on GitHub</a>. <code>Main/example.gam</code> identifies the game and points to its project files.</li>
        <li>Open the <a href="${exampleNotes}">example reference</a> to see the village board, its tileset and its RPGCode programs.</li>
        <li>Sketch a small map of your own. Start with one room, one character to talk to and one exit. Use the example to see how Toolkit files represent each part.</li>
      </ol>
      <p>Want to try the desktop player instead? <a href="/docs/preview/desktop-player/">Read the source-build guide</a>, or <a href="/download/">check download availability</a>.</p>`,
  },
  {
    slug: 'desktop-player',
    title: 'Play on desktop',
    summary: 'Build the desktop player from source and open a packaged game.',
    keywords: 'install electron download tpk',
    body: `<h2>Prepare the project</h2>
      <p>Clone the product repository and follow the <a href="${product}/blob/main/CONTRIBUTING.md">project setup instructions</a> to install the pinned tools and dependencies.</p>
      <h2>Open a packaged game</h2>
      <p>From a built checkout, run this command with the path to your package. Keep the matching <code>.tpk.json</code> descriptor beside it.</p>
      <pre><code>pnpm desktop:run --game path/to/game.tpk</code></pre>
      <p><a href="${product}/blob/main/docs/playing-the-desktop-player.md">Read the complete desktop player guide</a></p>`,
  },
  {
    slug: 'legacy-games',
    title: 'Explore legacy game formats',
    summary: 'Find preserved RPG Toolkit games and learn where their maps and assets are stored.',
    keywords: 'archive import compatibility gam corpus ludotheque migration',
    body: `<h2>Find a preserved game</h2>
      <p>The <a href="${archive}/games/">TK Corpus game index</a> preserves catalogue entries. <a href="${gamesRepo}">Ludothèque</a> preserves recovered packages and their provenance.</p>
      <h2>Understand the project layout</h2>
      <p>A <code>.gam</code> file describes a game and can refer to separate boards, programs and assets. Keep the full project together when examining or moving it.</p>
      <p><a href="${product}/blob/main/docs/spec/formats/main-file.md">Read the game file specification</a></p>`,
  },
];

const archivedGames = [
  ['Final Destiny', 'Christopher B. Matthews · 2002', 'FinalDestiny'],
  ['Dark Age', 'Xorlak', 'DarkAge'],
  ['Little Man with a Pea Shooter', 'John@AlJo and Allan@AlJo · 2004–2005', 'LittleMan'],
];

function layout(title, section, content, script = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | TK Reawakened</title>
  <link rel="icon" type="image/png" href="/assets/sword-emblem.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header class="site-header">
    <div class="utility"><a href="${product}">GitHub <span aria-hidden="true">↗</span></a></div>
    <div class="header-frame frame">
      <a class="brand" href="/"><img src="/assets/tk-reawakened-lockup.png" width="843" height="341" alt="TK Reawakened home"></a>
      <nav aria-label="Primary"><ul>
        ${navigation.map(([href, label]) => `<li><a href="${href}"${href === section ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}
      </ul></nav>
    </div>
  </header>
  <main class="wrap" id="main" tabindex="-1">
    ${content}
  </main>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-about"><strong>TK Reawakened</strong><p>Open-source RPG creation and preservation, built together.</p></div>
        <nav aria-label="Footer">
          <div class="footer-links">
            <div><h2>Explore</h2><ul><li><a href="/games/">Games</a></li><li><a href="/vault/">The Vault</a></li><li><a href="/archive/">Archive</a></li></ul></div>
            <div><h2>Make &amp; learn</h2><ul><li><a href="/download/">Download</a></li><li><a href="/create/">Create</a></li><li><a href="/docs/">Documentation</a></li><li><a href="/docs/preview/first-game/">First-game guide</a></li></ul></div>
            <div><h2>Community</h2><ul><li><a href="/community/">Community</a></li><li><a href="${discussions}">Discussions</a></li><li><a href="${product}/blob/main/CONTRIBUTING.md">Contribute</a></li></ul></div>
            <div><h2>Project</h2><ul><li><a href="${product}">GitHub</a></li><li><a href="${product}/graphs/contributors">Contributors</a></li><li><a href="/credits/">Credits &amp; licences</a></li></ul></div>
          </div>
        </nav>
      </div>
      <div class="footer-bottom"><p>Website software © 2026 Jensen Chappell</p><a href="https://github.com/tk-reawakened/website/blob/main/LICENSE">Website licence</a></div>
    </div>
  </footer>
  ${script}
</body>
</html>`;
}

function intro(title, summary) {
  return `<header class="page-intro"><h1>${title}</h1><p>${summary}</p></header>`;
}

function card(title, description, href, label, heading = 'h2') {
  return `<article class="card"><${heading}>${title}</${heading}><p>${description}</p><a class="text-link" href="${href}">${label} <span aria-hidden="true">→</span></a></article>`;
}

const pages = new Map([
  ['/', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Coming soon | TK Reawakened</title>
  <link rel="icon" type="image/png" href="/assets/sword-emblem.png">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="site-header coming-soon-header"><div class="header-frame frame"><img class="coming-soon-brand" src="/assets/tk-reawakened-lockup.png" width="843" height="341" alt="TK Reawakened"></div></header>
  <main class="wrap coming-soon">
    <section class="hero">
      <div class="hero-copy">
        <h1>A new adventure is coming.</h1>
        <p>TK Reawakened is an open-source project bringing classic RPG Toolkit games back to life and building a place for new adventures.</p>
        <p>Our website and toolkit are in development. Come back soon to see what we’re making.</p>
        <div class="actions">
          <a class="button primary" href="${product}">Follow the project on GitHub</a>
          <a class="button secondary" href="${discussions}">Join the discussion</a>
        </div>
      </div>
      <figure class="hero-stage frame">
        <img src="/assets/hero-village.jpg" alt="Pixel-art village with timber houses and a stone road" width="541" height="279" fetchpriority="high">
        <figcaption><div><strong>More adventures ahead</strong><small>Concept artwork</small></div></figcaption>
      </figure>
    </section>
  </main>
  <footer class="site-footer"><div class="wrap footer-inner"><p>Website software © 2026 Jensen Chappell</p><a href="${product}/graphs/contributors">Project contributors</a></div></footer>
</body>
</html>`],
  ['/preview/', layout('Build and play 16-bit RPGs', '', `
    <section class="hero">
      <div class="hero-copy">
        <h1>Build &amp; play classic 16-bit RPGs.</h1>
        <p>TK Reawakened is an open-source project in development, working to bring classic RPG Toolkit games back to life and help you create new adventures.</p>
        <div class="actions">
          <a class="button primary" href="/games/village/">Try the Village Demo</a>
          <a class="button secondary" href="/download/">Downloads &amp; status</a>
        </div>
        <p class="status-note">No installer or game editor released yet · <a href="${product}">Follow development on GitHub</a></p>
      </div>
      <figure class="hero-stage frame">
        <img src="/assets/hero-village.jpg" alt="Pixel-art village with timber houses and a stone road" width="541" height="279" fetchpriority="high">
        <figcaption><div><strong>Imagine your next adventure</strong><small>Concept artwork</small></div>
          <a class="button primary" href="/docs/preview/first-game/">Read the first-game guide</a></figcaption>
      </figure>
    </section>
    <div class="shelves">
      ${card('Play &amp; discover', 'Try the Village Demo and explore games from the original RPG Toolkit community.', '/games/', 'Browse games')}
      ${card('The Vault', 'Open the example project and see how its maps, tiles and scripts fit together.', '/vault/', 'Explore the Vault')}
      ${card('Make games together', 'Ask a question, share your progress or invite someone to playtest your game.', '/community/', 'Meet the community')}
    </div>
    <section class="home-guide">
      <div><h2>New to making RPGs?</h2><p>Start with a small village and see how a game is put together.</p></div>
      <a class="text-link" href="/docs/preview/first-game/">Read the first-game guide <span aria-hidden="true">→</span></a>
    </section>`)],
  ['/download/', layout('Get the Toolkit', '/download/', `
    ${intro('Get the Toolkit', 'TK Reawakened is in development. There are no published releases or installers yet, and the game editor is not available.')}
    <div class="shelves">
      ${card('Try the browser preview', 'Explore the Village Demo on a computer with a keyboard. No installation is needed.', '/games/village/', 'Open the Village Demo')}
      ${card('Build the desktop player', 'For contributors: build the player from source using the project’s pinned tools.', '/docs/preview/desktop-player/', 'Read the desktop setup guide')}
      ${card('Check release availability', 'The official GitHub releases page will list releases and their notes when published.', downloads, 'View GitHub releases')}
    </div>
    <section class="home-guide">
      <div><h2>New here?</h2><p>Explore the demo and its project files with our preview guide.</p></div>
      <a class="text-link" href="/docs/preview/first-game/">Read the first-game guide <span aria-hidden="true">→</span></a>
    </section>`)],
  ['/create/', layout('Create', '/create/', `
    ${intro('Create your first RPG', 'Start by exploring a small working game. Use its map, characters and scripts as references for a project of your own.')}
    <div class="shelves">
      ${card('Begin with one room', 'Play the example, look inside its project files and sketch a small map for your own game.', '/docs/preview/first-game/', 'Read the first-game guide')}
      ${card('Study the example', 'See the board, tileset and scripts used in the Village Demo.', '/vault/', 'Explore the Vault')}
      ${card('Share what you’re making', 'Find help with a specific question or share what you want playtesters to try.', '/community/', 'Meet the community')}
    </div>`)],
  ['/docs/', layout('Documentation', '/docs/', `
    ${intro('Documentation', 'Preview guides for learning the toolkit, trying the player and exploring legacy projects.')}
    <section class="docs-index" aria-labelledby="guides">
      <h2 id="guides">Preview guides</h2>
      <div id="doc-search"></div>
      <ul class="guide-list">
        ${guides.map(guide => `<li><h3><a href="/docs/preview/${guide.slug}/">${guide.title}</a></h3><p>${guide.summary}</p></li>`).join('')}
      </ul>
    </section>
    <p><a href="${product}/blob/main/docs/spec/README.md">Browse the engine and format specifications</a></p>`,
    '<script type="module" src="/search.js"></script>')],
  ...guides.map(({ slug, title, summary, body }) => [
    '/docs/preview/' + slug + '/',
    layout(title, '/docs/', `
      <nav class="back" aria-label="Documentation navigation"><a href="/docs/">← All guides</a><span>Preview documentation</span></nav>
      ${intro(title, summary)}
      <article class="prose">${body}</article>`),
  ]),
  ['/games/', layout('Games', '/games/', `
    ${intro('Games', 'Play an authored example or discover the games preserved from the original RPG Toolkit community.')}
    <article class="feature-panel">
      <img src="/assets/authored-village.png" width="960" height="550" alt="The player character on the authored village board">
      <div><p class="eyebrow">Playable example</p><h2>Village Demo</h2><p>Visit a small map built to demonstrate the Toolkit project formats.</p><a class="button primary" href="/games/village/">Open the Village Demo</a></div>
    </article>
    <section class="section-stack">
      <h2>From the archive</h2>
      <div class="shelves">
        ${archivedGames.map(([title, credit, folder]) => card(title, credit, gamesRepo + '/tree/main/games/' + folder, 'Archive record for ' + title, 'h3')).join('')}
      </div>
      <p><a class="text-link" href="/archive/">Explore the full archive <span aria-hidden="true">→</span></a></p>
    </section>`)],
  ['/games/village/', layout('Village Demo', '/games/', `
    <nav class="back" aria-label="Games navigation"><a href="/games/">← All games</a></nav>
    ${intro('Village Demo', 'An authored TK Reawakened example built to show how a village board and its assets work together.')}
    <figure class="game-shot"><img src="/assets/authored-village.png" width="960" height="550" alt="The Village Demo running in the TK Reawakened browser player"><figcaption>TK Reawakened authored example</figcaption></figure>
    <div class="actions"><a class="button primary" href="${runner}">Play in browser</a><a class="button secondary" href="/docs/preview/first-game/">Read the first-game guide</a></div>
    <p class="status-note">The preview currently needs a keyboard: press <kbd>Space</kbd> at the welcome screen, then use the arrow keys to move.</p>`)],
  ['/vault/', layout('The Vault', '/vault/', `
    ${intro('The Vault', 'Find examples and resources you can use to learn how Toolkit projects are made.')}
    <article class="feature-panel">
      <img src="/assets/authored-village.png" width="960" height="550" alt="The authored village board">
      <div><h2>Village Demo project files</h2><p>Explore an original example by the TK Reawakened project. It includes a board, a tileset and RPGCode programs.</p><a class="button secondary" href="${example}">Open the example project</a></div>
    </article>
    <section class="section-stack"><h2>Technical resources</h2><div class="shelves">
      ${card('Annotated game files', 'See example boards, sprites, items and other game formats.', exampleNotes, 'Read the example reference', 'h3')}
      ${card('RPGCode reference', 'Look up the commands and conventions behind Toolkit scripts.', product + '/blob/main/docs/spec/engine/rpgcode-functions.md', 'Read the RPGCode reference', 'h3')}
    </div></section>`)],
  ['/community/', layout('Community', '/community/', `
    ${intro('Make games together', 'Ask your first game-making question, show what you’re working on or find people to try it.')}
    <div class="shelves">
      ${card('Get help', 'Tell us what you’re making, what you tried and where you got stuck.', discussions + '/categories/q-a', 'Open Q&amp;A')}
      ${card('Show your work', 'Share a screenshot or a playable build and say what kind of feedback would help.', discussions + '/categories/show-and-tell', 'Open Show and tell')}
      ${card('Talk Toolkit', 'Introduce yourself or talk about the games and tools you remember.', discussions, 'Browse GitHub Discussions')}
    </div>
    <p class="status-note">Anyone can read public discussions. Sign in to GitHub to start a discussion or reply.</p>`)],
  ['/archive/', layout('Archive', '', `
    ${intro('The RPG Toolkit archive', 'Explore what the original community made and shared.')}
    <div class="shelves">
      ${card('TK Corpus', 'Read recovered community pages, forum threads and documentation.', archive + '/', 'Browse the TK Corpus')}
      ${card('Ludothèque', 'Explore recovered Toolkit games and their preservation records.', gamesRepo, 'Browse Ludothèque')}
      ${card('Archive project', 'Find the source and provenance of the TK Corpus.', corpus, 'Open the corpus repository')}
    </div>`)],
  ['/credits/', layout('Credits', '', `
    ${intro('Credits', 'Sources for the artwork, examples and software used on this site.')}
    <ul class="guide-list">
      <li><h2>Brand and concept artwork</h2><p>The TK Reawakened sword and wordmark come from the project’s design prototype. The home page village illustration is concept artwork from that prototype.</p></li>
      <li><h2>Village Demo</h2><p>The playable example and its screenshots use the project-owned example at product revision <code>${revision.slice(0, 7)}</code>.</p><a href="${exampleNotes}">Read about the authored example</a></li>
      <li><h2>Historical game records</h2><p>Game titles and author credits come from Ludothèque and the TK Corpus. The archive retains each work’s provenance.</p><a href="/archive/">Explore the archive sources</a></li>
      <li><h2>Software</h2><a href="/notices/preact-MIT.txt">Preact MIT license</a></li>
    </ul>`)],
]);
if (process.argv.includes('--production')) {
  for (const route of pages.keys()) {
    if (route !== '/') pages.delete(route);
  }
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/notices', { recursive: true });
await cp('assets', 'dist/assets', { recursive: true });
await cp('style.css', 'dist/style.css');
await cp('node_modules/preact/LICENSE', 'dist/notices/preact-MIT.txt');
await build({
  entryPoints: ['src/search.tsx'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/search.js',
});
await writeFile('dist/search-index.json', JSON.stringify(guides.map(({ slug, title, summary, keywords }) => ({
  title,
  summary,
  keywords,
  href: '/docs/preview/' + slug + '/',
}))));
for (const [route, html] of pages) {
  const directory = 'dist' + route;
  await mkdir(directory, { recursive: true });
  await writeFile(directory + 'index.html', html);
}
console.log('Built ' + pages.size + ' pages in site/dist');
