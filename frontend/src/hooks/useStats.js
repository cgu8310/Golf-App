// Mini golf stats — operates on rounds with shape { scores: [{player, score}], par }

export function getMyScore(round) {
  return round.scores?.[0]?.score ?? null;
}

export function getNetScore(score, par) {
  return score - par;
}

export function getBestScore(rounds) {
  const scores = rounds.map(getMyScore).filter((s) => s !== null);
  return scores.length ? Math.min(...scores) : null;
}

export function getAvgScore(rounds) {
  const scores = rounds.map(getMyScore).filter((s) => s !== null);
  if (!scores.length) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function getAvgVsPar(rounds) {
  const nets = rounds
    .filter((r) => r.par && getMyScore(r) !== null)
    .map((r) => getMyScore(r) - r.par);
  if (!nets.length) return null;
  return Math.round((nets.reduce((a, b) => a + b, 0) / nets.length) * 10) / 10;
}

export function getBestNet(rounds) {
  const nets = rounds
    .filter((r) => r.par && getMyScore(r) !== null)
    .map((r) => getMyScore(r) - r.par);
  return nets.length ? Math.min(...nets) : null;
}
