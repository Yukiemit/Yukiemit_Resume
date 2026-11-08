import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/** id → '01', '02'… for the sections that are actually shown. */
export const SectionNumbers = createContext({});

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const ext = { target: '_blank', rel: 'noreferrer' };

function Section({ id, title, kicker, children }) {
  const n = useContext(SectionNumbers)[id];
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <header className="section-head reveal">
        <span className="num">N° {n}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        {kicker && <p className="kicker">{kicker}</p>}
      </header>
      {children}
    </section>
  );
}

/* ───────────────────────── Hero ───────────────────────── */

export function Hero({ profile }) {
  const { headline } = profile;
  return (
    <section id="top" className="hero">
      <p className="status reveal">
        <span className="dot" aria-hidden />
        {profile.status}
      </p>

      <div className="hero-grid reveal">
        <h1 className="headline">
          {headline.lead} <em>{headline.em}</em>{headline.tail}
        </h1>
        <div className="avatar">
          {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : <span>{profile.initials}</span>}
        </div>
      </div>

      <p className="bio reveal">{profile.bio}</p>

      <ul className="socials reveal">
        {profile.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} {...(s.href.startsWith('mailto:') ? {} : ext)}>
              {s.label}
              <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>

      <dl className="stats reveal">
        {profile.stats.map((s) => (
          <div key={s.label}>
            <dd>{s.value}</dd>
            <dt>{s.label}</dt>
          </div>
        ))}
      </dl>

      <ul className="focus reveal" aria-label="Focus areas">
        {(profile.focus || profile.affiliations || []).map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────── Work ───────────────────────── */

export function Work({ projects }) {
  return (
    <Section id="work" title="Projects" kicker="Things I’ve designed and built end to end.">
      <div className="projects">
        {projects.map((p, i) => (
          <article className="project reveal" key={p.name}>
            <div className="project-top">
              <span className="project-no" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="tag">{p.tag}</span>
              <span className="project-year mono">{p.year}</span>
            </div>
            <h3>{p.name}</h3>
            {p.role && <p className="project-role">{p.role}</p>}
            <p>{p.description}</p>
            {p.stack?.length > 0 && (
              <ul className="chips small">
                {p.stack.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {p.links?.length > 0 && (
              <div className="project-links">
                {p.links.map((l) => (
                  <a key={l.label} href={l.href} {...ext}>
                    {l.label} <span aria-hidden>→</span>
                  </a>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── Background ───────────────────────── */

function Ledger({ items, label }) {
  if (!items?.length) return null;
  return (
    <div className="ledger-block">
      <p className="eyebrow">{label}</p>
      <ol className="ledger">
        {items.map((e) => (
          <li className="ledger-row reveal" key={e.role + e.company}>
            <span className="ledger-period mono">{e.period}</span>
            <div>
              <h3>
                {e.role} <span className="at">at</span> {e.company}
              </h3>
              {e.summary && <p>{e.summary}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Background({ education, experience, coursework, stack }) {
  return (
    <Section id="background" title="Background" kicker="Where I’ve learned, and what I work with.">
      <Ledger items={experience} label="Experience" />
      <Ledger items={education} label="Education" />

      {coursework?.length > 0 && (
        <div className="stack-group coursework reveal">
          <p className="eyebrow">Relevant coursework</p>
          <ul className="chips">
            {coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {stack && (
        <div className="stack reveal">
          {Object.entries(stack).map(([group, items]) => (
            <div className="stack-group" key={group}>
              <p className="eyebrow">{group}</p>
              <ul className="chips">
                {items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

/* ───────────────────────── Writing ───────────────────────── */

export function Writing({ posts }) {
  return (
    <Section id="writing" title="Writing" kicker="Notes from the work.">
      <ul className="posts">
        {posts.map((p) => (
          <li key={p.title} className="reveal">
            <a className="post" href={p.href}>
              <time className="mono" dateTime={p.date}>
                {dateFmt.format(new Date(p.date + 'T00:00:00'))}
              </time>
              <span className="post-body">
                <span className="post-title">{p.title}</span>
                <span className="post-excerpt">{p.excerpt}</span>
              </span>
              <span className="post-read mono">
                {p.read} <span aria-hidden>→</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ───────────────────────── Certifications ───────────────────────── */

export function Certifications({ items }) {
  return (
    <Section id="certifications" title="Certifications">
      <div className="certs">
        {items.map((c) => {
          const Tag = c.href ? 'a' : 'div';
          const linkProps = c.href ? { href: c.href, ...ext } : {};
          return (
            <Tag className={`cert reveal ${c.href ? 'is-link' : ''}`} key={c.name} {...linkProps}>
              <span className="cert-seal" aria-hidden>
                {c.badge || c.year}
              </span>
              <span className="cert-name">{c.name}</span>
              <span className="cert-issuer mono">
                {c.issuer}
                {c.year && c.badge ? ` · ${c.year}` : ''}
              </span>
              {c.href && (
                <span className="cert-verify">
                  Verify <span aria-hidden>↗</span>
                </span>
              )}
            </Tag>
          );
        })}
      </div>
    </Section>
  );
}

/* ───────────────────────── Kind words ───────────────────────── */

export function KindWords({ items }) {
  return (
    <Section id="kind-words" title="Kind words" kicker="From people I’ve shipped with.">
      <div className="quotes">
        {items.map((q, i) => (
          <figure className="quote reveal" key={i}>
            <blockquote>{q.quote}</blockquote>
            <figcaption>
              <strong>{q.name}</strong>
              <span>{q.title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────── Achievements ───────────────────────── */

export function Achievements({ data }) {
  return (
    <Section id="achievements" title="Achievements" kicker="Hackathons and other good weekends.">
      <div className="featured">
        {(data.featured || []).map((a) => (
          <article className="trophy reveal" key={a.title}>
            <div className="trophy-top">
              <span className="ribbon">{a.place}</span>
              <span className="mono">{a.year}</span>
            </div>
            <h3>{a.title}</h3>
            <p>{a.blurb}</p>
          </article>
        ))}
      </div>
      <ul className="others reveal">
        {(data.others || []).map((o) => (
          <li key={o.event}>
            <span className="others-place">{o.place}</span>
            <span className="others-event">{o.event}</span>
            <span className="mono muted">{o.year}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ───────────────────────── Activity graph ───────────────────────── */

export function Activity() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/activity')
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ days: [], total: 0, source: 'error' }));
  }, []);

  // Pad the front so the first column starts on Sunday.
  const cells = useMemo(() => {
    if (!data?.days?.length) return [];
    const first = new Date(data.days[0].date + 'T00:00:00').getDay();
    return [...Array(first).fill(null), ...data.days];
  }, [data]);

  return (
    <Section id="activity" title="Activity" kicker="A year of commits, at a glance.">
      <div className="activity reveal">
        <div className="activity-head">
          <p>
            {data?.source === 'unavailable' ? (
              'GitHub activity'
            ) : (
              <>
                <strong>{data ? data.total.toLocaleString() : '—'}</strong> contributions in the last year
              </>
            )}
          </p>
          {data?.username ? (
            <a className="mono muted gh-link" href={`https://github.com/${data.username}`} {...ext}>
              github.com/{data.username} ↗
            </a>
          ) : (
            <span className="mono muted">sample data · set your GitHub username</span>
          )}
        </div>
        {data?.source === 'unavailable' && (
          <p className="activity-empty">
            GitHub activity couldn’t be loaded right now —{' '}
            <a href={`https://github.com/${data.username}`} {...ext}>
              see it on GitHub ↗
            </a>
          </p>
        )}
        {data?.source !== 'unavailable' && (
          <>
        <div className="graph-scroll">
          <div className="graph" role="img" aria-label="Contribution graph for the past year">
            {cells.map((d, i) =>
              d ? (
                <span key={d.date} className={`cell l${d.level}`} title={`${d.count} on ${d.date}`} />
              ) : (
                <span key={`pad-${i}`} className="cell pad" />
              )
            )}
          </div>
        </div>
        <div className="legend mono">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={`cell l${l}`} />
          ))}
          more
        </div>
          </>
        )}
      </div>
    </Section>
  );
}

/* ───────────────────────── Contact ───────────────────────── */

const EMPTY = { name: '', email: '', message: '', company: '' };

export function Contact({ profile, onCopy }) {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: 'idle', errors: {}, message: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'sending', errors: {}, message: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (json.fallback === 'mailto') {
        // The server can't deliver mail (e.g. on Vercel without an email key):
        // open the visitor's mail app with everything filled in instead.
        const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
        const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
        window.location.href = `mailto:${json.to || profile.email}?subject=${subject}&body=${body}`;
        setState({ status: 'sent', errors: {}, message: 'Opening your email app with your message ready to send…' });
        return;
      }
      if (!res.ok) {
        setState({
          status: 'error',
          errors: json.errors || {},
          message: json.error || 'Check the highlighted fields.',
        });
        return;
      }
      setForm(EMPTY);
      setState({ status: 'sent', errors: {}, message: 'Thanks! Your message landed. I’ll reply within two days.' });
    } catch {
      setState({ status: 'error', errors: {}, message: 'Couldn’t reach the server. Try emailing me directly.' });
    }
  }

  const err = state.errors;

  return (
    <Section id="contact" title="Contact">
      <div className="contact">
        <div className="contact-intro reveal">
          <p className="big">
            Have something in mind? <em>Let’s make it.</em>
          </p>
          <p className="muted">
            Internship openings, project collaborations, or just saying hi — my inbox is open.
          </p>
          <div className="email-row">
            <a className="email" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <button type="button" className="ghost-btn" onClick={onCopy}>
              Copy
            </button>
          </div>
        </div>

        <form className="form reveal" onSubmit={submit} noValidate>
          <label className={err.name ? 'has-error' : ''}>
            <span>Name</span>
            <input value={form.name} onChange={update('name')} autoComplete="name" required />
            {err.name && <small>{err.name}</small>}
          </label>
          <label className={err.email ? 'has-error' : ''}>
            <span>Email</span>
            <input type="email" value={form.email} onChange={update('email')} autoComplete="email" required />
            {err.email && <small>{err.email}</small>}
          </label>
          <label className={err.message ? 'has-error' : ''}>
            <span>Message</span>
            <textarea rows={5} value={form.message} onChange={update('message')} required />
            {err.message && <small>{err.message}</small>}
          </label>
          {/* Honeypot for bots — hidden from people */}
          <input
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={update('company')}
            aria-hidden
          />
          <div className="form-foot">
            <button className="primary-btn" type="submit" disabled={state.status === 'sending'}>
              {state.status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden>→</span>
            </button>
            {state.message && (
              <p className={`form-note ${state.status}`} role="status">
                {state.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

export function Footer({ profile }) {
  return (
    <footer className="footer">
      <div className="footer-row">
        <span>
          © {new Date().getFullYear()} {profile.name}. Built with React &amp; Express.
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
      <p className="wordmark" aria-hidden>
        {profile.short}
        <span>.</span>
      </p>
    </footer>
  );
}
