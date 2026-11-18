import { useEffect, useState } from 'react';
import { Github, Radio, RefreshCw } from 'lucide-react';

type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

type ContributionResponse = {
  total: Record<string, number>;
  contributions: ContributionDay[];
};

type Snapshot = {
  updated: string;
  contributionsByYear: Record<number, ContributionDay[]>;
  totalsByYear: Record<number, number>;
  years: number[];
};

const username = 'muthyaprasadh';
const contributionApi = `https://github-contributions-api.jogruber.de/v4/${username}?y=all`;
const getContributionWeeks = (days: ContributionDay[]) => {
  if (!days.length) return [];

  const firstDay = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const paddedDays: (ContributionDay | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...days,
  ];

  while (paddedDays.length % 7 !== 0) paddedDays.push(null);

  return Array.from({ length: paddedDays.length / 7 }, (_, index) =>
    paddedDays.slice(index * 7, index * 7 + 7),
  );
};

const getContributionMonths = (weeks: (ContributionDay | null)[][]) => {
  const seenMonths = new Set<string>();

  return weeks.flatMap((week, index) => {
    const firstDay = week.find((day): day is ContributionDay => day !== null);
    if (!firstDay) return [];

    const monthKey = firstDay.date.slice(0, 7);
    if (seenMonths.has(monthKey)) return [];

    seenMonths.add(monthKey);
    return [{
      week: index + 1,
      label: new Date(`${firstDay.date}T00:00:00Z`).toLocaleDateString('en', {
        month: 'short',
        timeZone: 'UTC',
      }),
    }];
  });
};

export const GitHubSurveillance = () => {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(contributionApi);
      if (!response.ok) throw new Error('Unable to load live GitHub contribution activity.');
      const contributionResponse = await response.json() as ContributionResponse;
      const contributionsByYear: Record<number, ContributionDay[]> = {};
      contributionResponse.contributions.forEach((contribution) => {
        const year = Number(contribution.date.slice(0, 4));
        if (!contributionsByYear[year]) contributionsByYear[year] = [];
        contributionsByYear[year].push(contribution);
      });
      const years = Object.keys(contributionResponse.total)
        .filter((year) => /^\d{4}$/.test(year))
        .map(Number)
        .sort((a, b) => b - a);
      const totalsByYear = Object.fromEntries(
        years.map((year) => [year, contributionResponse.total[String(year)]]),
      );

      setData({
        updated: new Date().toLocaleTimeString(),
        contributionsByYear,
        totalsByYear,
        years,
      });
      setSelectedYear(years.includes(selectedYear) ? selectedYear : years[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load GitHub telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const selectedContributions = data?.contributionsByYear[selectedYear] || [];
  const selectedTotal = data?.totalsByYear[selectedYear] || 0;
  const contributionWeeks = getContributionWeeks(selectedContributions);
  const contributionMonths = getContributionMonths(contributionWeeks);

  return (
    <section className="github-surveillance">
      <div className="surveillance-heading">
        <div><span className="eyebrow"><Radio size={12} /> LIVE FIELD SURVEILLANCE</span><h3>GitHub <em>telemetry.</em></h3></div>
        <button onClick={load} aria-label="Refresh GitHub statistics" title="Refresh telemetry"><RefreshCw size={15} className={loading ? 'spin' : ''} /></button>
      </div>
      {error ? <p className="surveillance-error">{error} <button onClick={load}>RETRY</button></p> : (
        <>
          <div className="contribution-activity">
            <span className="eyebrow">CONTRIBUTION ACTIVITY</span>
            <div className="contribution-calendar">
              <div className="contribution-calendar-header">
                <strong>{loading ? 'Loading contributions...' : `${selectedTotal} contributions in ${selectedYear}`}</strong>
                <label>
                  <span className="sr-only">Contribution year</span>
                  <select
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(Number(event.target.value))}
                    disabled={loading || !data?.years.length}
                  >
                    {data?.years.map((year) => <option key={year} value={year}>{year}</option>)}
                  </select>
                </label>
              </div>
              <div className="contribution-scroll">
                <div
                  className="contribution-chart"
                  style={{ gridTemplateColumns: `repeat(${contributionWeeks.length}, 12px)` }}
                  role="img"
                  aria-label={`${selectedTotal} GitHub contributions in ${selectedYear}`}
                >
                  {contributionMonths.map((month) => (
                    <span
                      key={`${month.week}-${month.label}`}
                      className="contribution-month"
                      style={{ gridColumn: month.week, gridRow: 1 }}
                    >
                      {month.label}
                    </span>
                  ))}
                  {contributionWeeks.flatMap((week, weekIndex) =>
                    week.map((day, dayIndex) => day && (
                      <span
                        key={day.date}
                        className="contribution-day"
                        data-level={day.level}
                        title={`${day.count} contributions on ${day.date}`}
                        style={{ gridColumn: weekIndex + 1, gridRow: dayIndex + 2 }}
                      />
                    )),
                  )}
                </div>
              </div>
              <div className="contribution-legend" aria-label="Contribution intensity">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} />)}
                <span>More</span>
              </div>
            </div>
            <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
              VIEW FULL CONTRIBUTION PROFILE
            </a>
          </div>

          <p className="surveillance-foot"><Github size={13} /> SOURCE: LIVE GITHUB CONTRIBUTION ACTIVITY {data?.updated ? `// UPDATED ${data.updated}` : ''}</p>
        </>
      )}
    </section>
  );
};
