import { render } from 'preact';
import { useState } from 'preact/hooks';
const pages = [
  {version:'1.0', title:'Getting started', text:'Create and play a game', href:'/docs/1.0/#getting-started'},
  {version:'1.0', title:'Boards', text:'Build a place to explore', href:'/docs/1.0/#boards'},
  {version:'preview', title:'Getting started', text:'Create and play a game', href:'/docs/preview/#getting-started'},
  {version:'preview', title:'Boards', text:'Build a place to explore', href:'/docs/preview/#boards'}
];
function Search() {
  const [query,setQuery] = useState('');
  const [version,setVersion] = useState('1.0');
  const [submitted,setSubmitted] = useState(false);
  const matches = pages.filter(p => p.version === version && `${p.title} ${p.text}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <search><form onSubmit={e => {e.preventDefault(); setSubmitted(true);}}><label for="version">Documentation version</label><select id="version" value={version} onChange={e => setVersion(e.currentTarget.value)}><option value="1.0">1.0</option><option value="preview">Preview</option></select><label for="query">Search documentation</label><input id="query" type="search" value={query} onInput={e => setQuery(e.currentTarget.value)} /><button type="submit">Search</button></form><div role="status">{submitted && (query.trim() ? matches.length ? <ul>{matches.map(p => <li><a href={p.href}>{p.title}</a> — {p.text}</li>)}</ul> : <p>No matches. Try another search.</p> : <p>Enter a search term to find documentation.</p>)}</div></search>;
}
const root = document.getElementById('search'); if (root) render(<Search />,root);
