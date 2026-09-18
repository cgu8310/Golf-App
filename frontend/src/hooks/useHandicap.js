/**
 * World Handicap System (WHS) calculation helpers.
 *
 * Score Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating
 * Handicap Index = average of best N differentials × 0.96
 *
 * 9-hole rounds are stored but excluded from handicap index calculation.
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
  const eligible = (rounds || []).filter((r) => !r.holes || r.holes === 18);
  if (eligible.length < 3) return null;

  const last20 = eligible.slice(-20);
  const sorted = [...last20].sort((a, b) => a.differential - b.differential);
  const count = differentialsToUse(last20.length);
  const best = sorted.slice(0, count);
  const avg = best.reduce((sum, r) => sum + r.differential, 0) / best.length;

  return Math.floor(avg * 0.96 * 10) / 10;
}

export function getBestDifferentials(rounds) {
  const eligible = (rounds || []).filter((r) => !r.holes || r.holes === 18);
  if (eligible.length < 3) return new Set();
  const last20 = eligible.slice(-20);
  const sorted = [...last20].sort((a, b) => a.differential - b.differential);
  const count = differentialsToUse(last20.length);
  return new Set(sorted.slice(0, count).map((r) => r.id));
}
