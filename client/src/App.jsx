import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import {
  Hero,
  Work,
  Background,
  Writing,
  Certifications,
  KindWords,
  Achievements,
  Activity,
  Contact,
  Footer,
  SectionNumbers,
} from './components/Sections.jsx';
import { getSections } from './sections.js';
import { useTheme, useReveal, useActiveSection } from './hooks.js';

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [theme, toggleTheme] = useTheme();
  const [toast, setToast] = useState('');
  const toastTimer = useRef();

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        document.title = `${d.profile.name} — ${d.profile.role}`;
      })
      .catch((e) => setError(e.message));
  }, []);

  const sections = useMemo(() => (data ? getSections(data) : []), [data]);
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const numbers = useMemo(
    () => Object.fromEntries(sections.map((s, i) => [s.id, String(i + 1).padStart(2, '0')])),
    [sections]
  );
  const shown = (id) => id in numbers;

  useReveal(data);
  const active = useActiveSection(sectionIds, data);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);

  const copyEmail = useCallback(() => {
    const email = data?.profile.email;
    if (!email) return;
    navigator.clipboard
      ?.writeText(email)
      .then(() => notify('Email copied to clipboard'))
      .catch(() => notify(email));
  }, [data, notify]);

  if (error) {
    return (
      <div className="state">
        <p className="mono">Couldn’t reach the API ({error}).</p>
        <p>
          Is the Express server running? Start everything with <code>npm run dev</code>.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="state">
        <span className="loader" aria-label="Loading" />
      </div>
    );
  }

  const { profile } = data;

  return (
    <>
      <a className="skip" href={`#${sections[0]?.id || 'contact'}`}>
        Skip to content
      </a>
      <div className="shell">
        <Sidebar
          profile={profile}
          sections={sections}
          active={active}
          theme={theme}
          onTheme={toggleTheme}
        />
        <SectionNumbers.Provider value={numbers}>
          <main className="content">
            <Hero profile={profile} />
            {shown('work') && <Work projects={data.projects} />}
            {shown('background') && (
              <Background
                education={data.education}
                experience={data.experience}
                coursework={data.coursework}
                stack={data.stack}
              />
            )}
            {shown('writing') && <Writing posts={data.posts} />}
            {shown('certifications') && <Certifications items={data.certifications} />}
            {shown('kind-words') && <KindWords items={data.testimonials} />}
            {shown('achievements') && <Achievements data={data.achievements} />}
            <Activity />
            <Contact profile={profile} onCopy={copyEmail} />
            <Footer profile={profile} />
          </main>
        </SectionNumbers.Provider>
      </div>


      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
