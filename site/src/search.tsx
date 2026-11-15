import { render } from 'preact';
import { useState } from 'preact/hooks';

interface Guide {
  title: string;
  summary: string;
  keywords: string;
  href: string;
}

function Search({ guides }: { guides: Guide[] }) {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  const terms = submitted?.toLowerCase().split(/\s+/).filter(Boolean) ?? [];
  const matches = terms.length
    ? guides.filter(({ title, summary, keywords }) => {
      const entry = [title, summary, keywords].join(' ').toLowerCase();
      return terms.every(term => entry.includes(term));
    })
    : [];

  return <search class="doc-search">
    <form onSubmit={event => {
      event.preventDefault();
      setSubmitted(query.trim());
    }}>
      <label for="search-query">Search preview guides</label>
      <div class="search-controls">
        <input id="search-query" type="search" value={query} onInput={event => setQuery(event.currentTarget.value)} />
        <button class="button secondary" type="submit">Search</button>
      </div>
    </form>
    <p role="status">{submitted === null ? '' : !terms.length ? 'Enter a search term.' : matches.length
      ? `${matches.length} ${matches.length === 1 ? 'guide' : 'guides'} found.`
      : 'No guides match that search.'}</p>
    {matches.length > 0 && <ul class="guide-list">
      {matches.map(guide => <li key={guide.href}><a href={guide.href}>{guide.title}</a><p>{guide.summary}</p></li>)}
    </ul>}
  </search>;
}

const target = document.getElementById('doc-search');
if (target) {
  fetch('/search-index.json')
    .then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json() as Promise<Guide[]>;
    })
    .then(guides => render(<Search guides={guides} />, target))
    .catch(() => {
      target.textContent = 'Search is unavailable. Browse the guides below.';
    });
}
