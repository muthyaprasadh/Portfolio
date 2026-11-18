import { useEffect, useState } from 'react';

const name = 'MUTHYA PRASADH';

const shouldPlayIntro = () =>
  typeof window === 'undefined' ||
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CinematicIntro = () => {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const exitTimer = window.setTimeout(() => setExiting(true), 4100);
    const removeTimer = window.setTimeout(() => setVisible(false), 4650);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`cinematic-intro${exiting ? ' is-exiting' : ''}`}
      role="region"
      aria-label="Portfolio introduction"
    >
      <button
        className="cinematic-intro-skip"
        onClick={() => setVisible(false)}
        type="button"
      >
        Skip intro <span aria-hidden="true">→</span>
      </button>

      <div className="cinematic-intro-content">
        <span className="cinematic-intro-line" aria-hidden="true" />
        <div className="cinematic-intro-initials" aria-hidden="true">
          M<span>P</span>
        </div>
        <p className="cinematic-intro-name" aria-label="Muthya Prasadh">
          {Array.from(name).map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              aria-hidden="true"
              style={{ animationDelay: `${1750 + index * 55}ms` }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </span>
          ))}
        </p>
        <p className="cinematic-intro-identity">
          SOFTWARE ENGINEER <i>·</i> SYSTEMS THINKER <i>·</i> BUILDER
        </p>
      </div>
    </div>
  );
};
