import { useEffect, useState, useCallback } from 'react';

const store = {
  get(key, storage = 'localStorage') {
    try {
      return window[storage].getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value, storage = 'localStorage') {
    try {
      window[storage].setItem(key, value);
    } catch {
      /* storage unavailable — fine */
    }
  },
};

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    store.set('theme', theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return [theme, toggle];
}

/** Fades elements with class "reveal" in as they scroll into view. */
export function useReveal(ready) {
  useEffect(() => {
    if (!ready) return;
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);
}

/** Which section is currently in the middle of the viewport. */
export function useActiveSection(ids, ready) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!ready) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids, ready]);
  return active;
}

export function useClock(timeZone) {
  const fmt = useCallback(
    () =>
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZone,
      }).format(new Date()),
    [timeZone]
  );
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, [fmt]);
  return time;
}
