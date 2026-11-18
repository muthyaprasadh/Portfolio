import { useEffect, useState } from 'react';
import { Github, Radio, Activity, RefreshCw } from 'lucide-react';

type Repo = { language: string | null; fork: boolean; archived: boolean };
type Snapshot = { repos: number; languages: Record<string, number>; activity: string; updated: string };

export const GitHubSurveillance = () => {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [reposResponse, eventsResponse] = await Promise.all([
        fetch('https://api.github.com/users/muthyaprasadh/repos?per_page=100&sort=updated'),
        fetch('https://api.github.com/users/muthyaprasadh/events/public?per_page=1')
      ]);
      if (!reposResponse.ok) throw new Error('GitHub API is temporarily unavailable.');
      const repos: Repo[] = await reposResponse.json();
      const events = eventsResponse.ok ? await eventsResponse.json() : [];
      const languages: Record<string, number> = {};
      repos.forEach((repo) => {
        if (repo.language) languages[repo.language] = (languages[repo.language] || 0) + 1;
      });
      const lastEvent = events[0]?.created_at ? new Date(events[0].created_at) : null;
      const activity = lastEvent
        ? `Last public activity ${new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-Math.round((Date.now() - lastEvent.getTime()) / 86400000), 'day')}`
        : 'No recent public activity returned';
      setData({ repos: repos.length, languages, activity, updated: new Date().toLocaleTimeString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load GitHub telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const total = Object.values(data?.languages || {}).reduce((sum, count) => sum + count, 0);

  return (
    <section className="github-surveillance">
      <div className="surveillance-heading">
        <div><span className="eyebrow"><Radio size={12} /> LIVE FIELD SURVEILLANCE</span><h3>GitHub <em>telemetry.</em></h3></div>
        <button onClick={load} aria-label="Refresh GitHub statistics" title="Refresh telemetry"><RefreshCw size={15} className={loading ? 'spin' : ''} /></button>
      </div>
      {error ? <p className="surveillance-error">{error} <button onClick={load}>RETRY</button></p> : (
        <>
          <div className="surveillance-metrics">
            <div><strong>{loading ? '—' : data?.repos ?? 0}</strong><span>PUBLIC REPOSITORIES (LATEST 100)</span></div>
            <div><strong><Activity size={19} /></strong><span>{loading ? 'CHECKING...' : data?.activity}</span></div>
          </div>
          <div className="language-breakdown">
            <span className="eyebrow">PRIMARY LANGUAGE SIGNALS</span>
            {['Java', 'Python', 'TypeScript', 'JavaScript', 'C++', 'C'].map((language) => {
              const count = data?.languages[language] || 0;
              return <div className="language-row" key={language}><span>{language}</span><div><i style={{ width: `${total ? count / total * 100 : 0}%` }} /></div><b>{loading ? '—' : count}</b></div>;
            })}
          </div>
          <p className="surveillance-foot"><Github size={13} /> SOURCE: GITHUB PUBLIC REST API {data?.updated ? `// UPDATED ${data.updated}` : ''}</p>
        </>
      )}
    </section>
  );
};
