import { useEffect, useState } from 'react';
import { ArrowUpRight, Github, RefreshCw } from 'lucide-react';

const username = 'muthyaprasadh';

interface GitHubProfile {
  public_repos: number;
}

interface GitHubRepository {
  language: string | null;
}

interface GitHubEvent {
  type: string;
  created_at: string;
}

interface SurveillanceData {
  publicRepos: number;
  languages: Record<'Java' | 'Python' | 'TypeScript', number>;
  lastActivity: string | null;
}

const fetchGitHubJson = async <T,>(url: string, signal: AbortSignal): Promise<T> => {
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(
      response.status === 403
        ? 'GitHub API rate limit reached. Try again shortly.'
        : `GitHub API request failed (${response.status}).`
    );
  }

  return response.json() as Promise<T>;
};

export const GitHubSurveillance = () => {
  const [data, setData] = useState<SurveillanceData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    Promise.all([
      fetchGitHubJson<GitHubProfile>(
        `https://api.github.com/users/${username}`,
        controller.signal
      ),
      fetchGitHubJson<GitHubRepository[]>(
        `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
        controller.signal
      ),
      fetchGitHubJson<GitHubEvent[]>(
        `https://api.github.com/users/${username}/events/public?per_page=1`,
        controller.signal
      ),
    ])
      .then(([profile, repositories, events]) => {
        const languages: SurveillanceData['languages'] = {
          Java: 0,
          Python: 0,
          TypeScript: 0,
        };

        repositories.forEach(({ language }) => {
          if (language === 'Java' || language === 'Python' || language === 'TypeScript') {
            languages[language] += 1;
          }
        });

        setData({
          publicRepos: profile.public_repos,
          languages,
          lastActivity: events[0]?.created_at ?? null,
        });
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof Error && requestError.name === 'AbortError') return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Could not load GitHub surveillance data.'
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [refreshKey]);

  const activityDate = data?.lastActivity ? new Date(data.lastActivity) : null;
  const activityDays = activityDate
    ? (Date.now() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
    : null;

  return (
    <div className="github-surveillance" aria-live="polite">
      <div className="surveillance-header">
        <span className="surveillance-title">
          <Github size={17} /> FIELD SURVEILLANCE // GITHUB
        </span>
        <button
          type="button"
          className="surveillance-refresh"
          onClick={() => setRefreshKey((key) => key + 1)}
          disabled={loading}
          aria-label="Refresh GitHub stats"
          title="Refresh GitHub stats"
        >
          <RefreshCw size={14} className={loading ? 'refresh-spinning' : ''} />
          REFRESH
        </button>
      </div>

      {error ? (
        <div className="surveillance-error" role="status">
          <span>{error}</span>
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>
            RETRY
          </button>
        </div>
      ) : (
        <>
          <div className="surveillance-stats">
            <div className="surveillance-stat">
              <span className="surveillance-label">PUBLIC REPOSITORIES</span>
              <strong>{loading ? '—' : data?.publicRepos ?? '—'}</strong>
            </div>
            <div className="surveillance-stat">
              <span className="surveillance-label">JAVA REPOSITORIES</span>
              <strong>{loading ? '—' : data?.languages.Java ?? '—'}</strong>
            </div>
            <div className="surveillance-stat">
              <span className="surveillance-label">PYTHON REPOSITORIES</span>
              <strong>{loading ? '—' : data?.languages.Python ?? '—'}</strong>
            </div>
            <div className="surveillance-stat">
              <span className="surveillance-label">TYPESCRIPT REPOSITORIES</span>
              <strong>{loading ? '—' : data?.languages.TypeScript ?? '—'}</strong>
            </div>
          </div>

          <div className="surveillance-footer">
            <span className="activity-status">
              <span className={`live-dot ${activityDays !== null && activityDays > 30 ? 'quiet-dot' : ''}`} />
              {loading
                ? 'CHECKING PUBLIC ACTIVITY...'
                : !data?.lastActivity
                ? 'NO RECENT PUBLIC ACTIVITY'
                : activityDays !== null && activityDays <= 30
                ? `ACTIVE // LAST EVENT ${activityDate?.toLocaleDateString()}`
                : `QUIET // LAST EVENT ${activityDate?.toLocaleDateString()}`}
            </span>
            <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
              OPEN GITHUB <ArrowUpRight size={14} />
            </a>
          </div>
          <p className="surveillance-note">
            Language counts are primary repository languages; activity reflects public events only.
          </p>
        </>
      )}
    </div>
  );
};
