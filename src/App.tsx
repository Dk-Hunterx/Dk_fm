import { useMemo, useState } from 'react';

type Story = { title: string; genre: string; description: string; image: string; audio: string };
const stories: Story[] = [
  { title: "The Billionaire's Secret Heir", genre: 'Romance', description: 'A hidden legacy. A dangerous secret. An unexpected love.', image: './story_billionaire_secret_1792061350911.jpg', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Shadow Realm: Rebirth of the Monarch', genre: 'Fantasy', description: 'Betrayed by his kingdom, a fallen monarch returns.', image: './story_shadow_monarch_1792061351672.jpg', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { title: 'Midnight Detective', genre: 'Mystery', description: 'A detective follows clues through a city lost in fog.', image: './story_midnight_detective_1792061351083.jpg', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Whispers in Blackwood Hollow', genre: 'Horror', description: 'An abandoned manor holds a chilling, ancient secret.', image: './story_whispers_in_hollow_1792061351596.jpg', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];
const genres = ['All', 'Romance', 'Fantasy', 'Mystery', 'Horror', 'Thriller'];

export default function App() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [playing, setPlaying] = useState<Story | null>(null);
  const [tab, setTab] = useState('Home');
  const [favourites, setFavourites] = useState<string[]>([]);
  const filtered = useMemo(() => stories.filter(s => (genre === 'All' || s.genre === genre) && (s.title + s.description + s.genre).toLowerCase().includes(query.toLowerCase())), [genre, query]);

  return <div className="dk-app">
    <header className="dk-header"><a className="dk-logo" href="#">DK<span>FM</span></a><input aria-label="Search stories" placeholder="Search stories" value={query} onChange={e => setQuery(e.target.value)} /><div className="dk-avatar">D</div></header>
    <main className="dk-main">
      <nav className="dk-genres" aria-label="Story genres">{genres.map(g => <button key={g} className={genre === g ? 'selected' : ''} onClick={() => setGenre(g)}>{g}</button>)}</nav>
      <section className="dk-section"><div className="dk-section-heading"><div><h1>Popular on DK FM</h1><p>Tap a story to explore its episodes.</p></div><span>{filtered.length} stories</span></div>
        <div className="dk-grid">{filtered.map(story => <article className="dk-story" key={story.title}><img src={story.image} alt={story.title} onError={e => { e.currentTarget.style.visibility = 'hidden'; }} /><div className="dk-story-content"><small>{story.genre}</small><h2>{story.title}</h2><p>{story.description}</p><div className="dk-actions"><button onClick={() => setPlaying(story)}>▶ Listen</button><button className="dk-secondary" aria-label="Toggle favourite" onClick={() => setFavourites(old => old.includes(story.title) ? old.filter(x => x !== story.title) : [...old, story.title])}>{favourites.includes(story.title) ? '♥' : '♡'}</button></div></div></article>)}</div>
        {!filtered.length && <p className="dk-empty">No stories found. Try another search.</p>}
      </section>
      <section className="dk-section"><h2>My Library</h2><p className="dk-muted">{favourites.length ? favourites.join(' · ') : 'Tap ♡ on a story to save it to your favourites.'}</p></section>
    </main>
    <section className="dk-player"><div className="dk-play-icon">▶</div><div className="dk-track"><strong>{playing?.title ?? 'Choose an episode'}</strong><span>DK FM · Audio stories</span></div><audio controls preload="none" src={playing?.audio} /></section>
    <nav className="dk-bottom">{['Home', 'Favourites', 'Downloads', 'Profile'].map((item, i) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}><span>{['⌂', '♡', '⇩', '◎'][i]}</span>{item}</button>)}</nav>
    {tab === 'Profile' && <div className="dk-profile-note">React/Vite preview. Google authentication and secure admin access remain in the existing live site until integrated.</div>}
  </div>;
}
