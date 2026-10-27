/** Polyline points for a small trend line, in a 80 x 32 box. */
export function sparkline(points: number[]): string {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const step = 80 / (points.length - 1);
  return points
    .map((v, i) => `${(i * step).toFixed(1)},${(28 - ((v - min) / (max - min || 1)) * 24).toFixed(1)}`)
    .join(' ');
}

/** Change in percent between the first and the last point. */
export function deltaPct(points: number[]): number {
  const first = points[0] || 1;
  return Math.round(((points[points.length - 1] - first) / Math.abs(first)) * 1000) / 10;
}

/**
 * Stable demo series for a label, so a card always has a line until the backend sends real history.
 * Small seeded walk; the sign of the drift is fixed per label.
 */
export function demoTrend(label: string): number[] {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
  const drift = (rnd() > 0.35 ? 1 : -1) * (0.008 + rnd() * 0.02);
  const out = [100];
  for (let i = 1; i < 9; i++) out.push(out[i - 1] * (1 + drift + (rnd() - 0.5) * 0.02));
  return out;
}

/** Labels where a rise is bad news. */
export const FALLING_IS_GOOD = /litige|opposition|alerte|retard|impay|vacan|contentieux|rejet/i;
