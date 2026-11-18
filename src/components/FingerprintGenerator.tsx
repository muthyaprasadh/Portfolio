import { useId, useMemo } from 'react';

type FingerprintGeneratorProps = {
  seed: string;
  size?: number;
  scanProgress?: number;
  className?: string;
};

type Ridge = {
  path: string;
  weight: number;
};

const hashSeed = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const generateRidges = (seed: string): Ridge[] => {
  let state = hashSeed(seed) || 1;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const pattern = hashSeed(`${seed}:pattern`) % 3;
  const centerX = 120 + (random() - 0.5) * 22;
  const centerY = 120 + (random() - 0.5) * 18;
  const rotation = (random() - 0.5) * 0.28;
  const ridges: Ridge[] = [];

  if (pattern === 2) {
    for (let line = 0; line < 42; line += 1) {
      const yBase = 29 + line * 4.35;
      const amplitude = 9 + Math.sin(line * 0.12) * 8 + random() * 2;
      const points: string[] = [];
      for (let step = 0; step <= 54; step += 1) {
        const x = 4 + step * 4.15;
        const normalizedX = (x - 120) / 120;
        const arch = amplitude * (1 - normalizedX * normalizedX);
        const waviness = Math.sin(step * 0.18 + line * 0.27) * 1.15
          + Math.sin(step * 0.047 + line) * 1.5;
        const y = yBase - arch + waviness;
        const rotatedX = centerX + (x - 120) * Math.cos(rotation) - (y - 120) * Math.sin(rotation);
        const rotatedY = centerY + (x - 120) * Math.sin(rotation) + (y - 120) * Math.cos(rotation);
        points.push(`${step === 0 ? 'M' : 'L'}${rotatedX.toFixed(1)} ${rotatedY.toFixed(1)}`);
      }
      ridges.push({ path: points.join(' '), weight: random() });
    }
    return ridges;
  }

  for (let line = 0; line < 48; line += 1) {
    const radius = 16 + line * 2.42;
    const points: string[] = [];
    const loopOffset = pattern === 1 ? (line - 24) * 0.16 : 0;
    const startAngle = pattern === 1 ? -2.75 : 0;
    const endAngle = pattern === 1 ? 2.75 : Math.PI * 2;
    const steps = pattern === 1 ? 92 : 128;

    for (let step = 0; step <= steps; step += 1) {
      const angle = startAngle + ((endAngle - startAngle) * step) / steps;
      const swirl = pattern === 0
        ? Math.sin(angle * 2 + line * 0.09) * 2.1
        : Math.sin(angle * 1.4 + line * 0.06) * 2.6;
      const irregularity = Math.sin(angle * 5 + line * 0.4) * 0.75
        + Math.sin(angle * 9 - line * 0.23) * 0.35;
      const localRadius = radius + swirl + irregularity;
      const x = centerX + Math.cos(angle + loopOffset) * localRadius * 0.76;
      const y = centerY + Math.sin(angle) * localRadius;
      const rotatedX = centerX + (x - centerX) * Math.cos(rotation) - (y - centerY) * Math.sin(rotation);
      const rotatedY = centerY + (x - centerX) * Math.sin(rotation) + (y - centerY) * Math.cos(rotation);
      points.push(`${step === 0 ? 'M' : 'L'}${rotatedX.toFixed(1)} ${rotatedY.toFixed(1)}`);
    }

    ridges.push({ path: points.join(' '), weight: random() });
  }

  return ridges;
};

export const FingerprintGenerator = ({
  seed,
  size = 240,
  scanProgress,
  className,
}: FingerprintGeneratorProps) => {
  const reactId = useId().replace(/:/g, '');
  const clipId = `fingerprint-clip-${reactId}`;
  const glowId = `fingerprint-glow-${reactId}`;
  const ridges = useMemo(() => generateRidges(seed), [seed]);
  const isScanning = typeof scanProgress === 'number';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-label="Procedurally generated simulated fingerprint artwork"
    >
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="120" cy="120" rx="105" ry="110" />
        </clipPath>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="120" cy="120" rx="105" ry="110" fill="#10090b" stroke="#63202a" strokeWidth="1" />
      <g clipPath={`url(#${clipId})`} fill="none" stroke="#e23b49" filter={`url(#${glowId})`}>
        {ridges.map((ridge, index) => {
          const illuminated = !isScanning || index / ridges.length <= (scanProgress ?? 0);
          return (
            <path
              key={index}
              d={ridge.path}
              strokeWidth={0.72 + ridge.weight * 0.45}
              strokeOpacity={illuminated ? 0.82 : 0.16}
              className={illuminated && isScanning ? 'fingerprint-ridge-lit' : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
};
