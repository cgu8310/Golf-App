/**
 * World Handicap System (WHS) calculation helpers.
 *
 * Score Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating
 * Handicap Index = average of best N differentials × 0.96
 *
 * Number of differentials used based on rounds played:
 * 3-4 → 1, 5-6 → 1, 7-8 → 2, 9-10 → 3, 11-12 → 4,
 * 13-14 → 5, 15-16 → 6, 17-18 → 7, 19 → 8, 20+ → best 8 of last 20
 */

export function scoreDifferential(adjustedGrossScore, courseRating, slopeRating) {
  return ((adjustedGrossScore - courseRating) * 113) / slopeRating;
}

function differentialsToUse(count) {
  if (count < 3) return 0;
  if (count <= 6) return 1;
  if (count <= 8) return 2;
  if (count <= 10) return 3;
  if (count <= 12) return 4;
  if (count <= 14) return 5;
  if (count <= 16) return 6;
  if (count <= 18) return 7;
  return 8;
}

export function calculateHandicapIndex(rounds) {
  if (!rounds || rounds.length < 3) return null;

  const last20 = rounds.slice(-20);
  const sorted = [...last20].sort((a, b) => a.differential - b.differential);
  const count = differentialsToUse(last20.length);
  const best = sorted.slice(0, count);
  const avg = best.reduce((sum, r) => sum + r.differential, 0) / best.length;

  return Math.floor(avg * 0.96 * 10) / 10;
}
