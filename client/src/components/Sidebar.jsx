import { useClock } from '../hooks.js';

export default function Sidebar({ profile, sections, active, theme, onTheme }) {
  const time = useClock(profile.timezone);

  return (
    <aside className="sidebar">
      <a href="#top" className="brand">
        <span className="brand-mark">{profile.initials}</span>
        <span className="brand-text">
          <strong>{profile.name}</strong>
          <small>{profile.role}</small>
        </span>
      </a>

      <nav className="index" aria-label="Sections">
        <p className="eyebrow">Contents</p>
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id ? 'on' : ''}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="label">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="side-meta">
        <p className="meta-row mono">
          <span>{profile.location}</span>
          <span className="sep">/</span>
          <span>{time}</span>
        </p>
        <button
          type="button"
          className="theme-toggle"
          onClick={onTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className={theme === 'light' ? 'on' : ''}>Light</span>
          <span className={theme === 'dark' ? 'on' : ''}>Dark</span>
        </button>
      </div>
    </aside>
  );
}
