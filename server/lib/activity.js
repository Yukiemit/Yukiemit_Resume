// Contribution data for the activity graph.
// If a GitHub username is set in data/portfolio.js, real public contributions are
// fetched (cached for 6 hours). With no username, a sample pattern is generated.
// If GitHub can't be reached, the page links to the profile instead of faking a graph.

let cache = { at: 0, key: '', data: null };
const SIX_HOURS = 6 * 60 * 60 * 1000;

export async function getActivity(username) {
  const key = username || '__sample__';
  if (cache.data && cache.key === key && Date.now() - cache.at < SIX_HOURS) return cache.data;

  let data = null;
  if (username) {
    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (res.ok) {
        const json = await res.json();
        const days = (json.contributions || []).map((d) => ({
          date: d.date,
          count: d.count,
          level: d.level,
        }));
        const total = json.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
        data = { source: 'github', username, total, days };
      }
    } catch (err) {
      console.warn('GitHub contributions unavailable:', err.message);
    }
  }

  if (!data && username) {
    // Don't show made-up data on a real profile — and retry sooner next time.
    cache = { at: Date.now() - SIX_HOURS + 5 * 60 * 1000, key, data: { source: 'unavailable', username, total: 0, days: [] } };
    return cache.data;
  }
  if (!data) data = sampleActivity();
  cache = { at: Date.now(), key, data };
  return data;
}

function sampleActivity() {
  // Small seeded PRNG so the sample graph looks the same on every load.
  let seed = 20261104;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const sprint = Math.sin(i / 9) > 0.35; // bursts of busier weeks
    const r = rand();
    let count = 0;
    if (r > (weekend ? 0.7 : 0.22)) count = Math.floor(rand() * (sprint ? 14 : 7)) + 1;
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
    days.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  return { source: 'sample', total: days.reduce((s, d) => s + d.count, 0), days };
}
