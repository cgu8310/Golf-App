import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRounds } from '../context/RoundsContext';
import { getBestDifferentials } from '../hooks/useHandicap';
import { cardShadow } from '../styles';

const GREEN = '#1a6b2e';

function StatCard({ label, value, sub }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

export default function StatsScreen() {
  const { rounds, handicapIndex } = useRounds();
  const eligible = rounds.filter((r) => !r.holes || r.holes === 18);

  if (rounds.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyText}>No data yet</Text>
        <Text style={styles.emptyHint}>Add rounds to see your stats</Text>
      </View>
    );
  }

  const bestIds = getBestDifferentials(rounds);
  const last20 = eligible.slice(-20);
  const diffs = eligible.map((r) => r.differential);
  const bestDiff = diffs.length ? Math.min(...diffs) : null;
  const worstDiff = diffs.length ? Math.max(...diffs) : null;
  const avgDiff = diffs.length ? diffs.reduce((s, d) => s + d, 0) / diffs.length : null;

  const thisYear = new Date().getFullYear();
  const roundsThisYear = rounds.filter((r) => new Date(r.date).getFullYear() === thisYear).length;
  const roundsLastYear = rounds.filter((r) => new Date(r.date).getFullYear() === thisYear - 1).length;

  const maxDiff = last20.length ? Math.max(...last20.map((r) => Math.abs(r.differential))) : 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.statsGrid}>
        <StatCard
          label="Handicap Index"
          value={handicapIndex !== null ? handicapIndex.toFixed(1) : '—'}
          sub={eligible.length < 3 ? `Need ${3 - eligible.length} more round${3 - eligible.length === 1 ? '' : 's'}` : null}
        />
        <StatCard label="Total Rounds" value={rounds.length} />
        <StatCard label="Best Differential" value={bestDiff !== null ? (bestDiff > 0 ? `+${bestDiff.toFixed(1)}` : bestDiff.toFixed(1)) : '—'} />
        <StatCard label="Avg Differential" value={avgDiff !== null ? avgDiff.toFixed(1) : '—'} />
      </View>

      <View style={styles.yearRow}>
        <View style={styles.yearCard}>
          <Text style={styles.yearNum}>{roundsThisYear}</Text>
          <Text style={styles.yearLabel}>Rounds {thisYear}</Text>
        </View>
        <View style={styles.yearCard}>
          <Text style={styles.yearNum}>{roundsLastYear}</Text>
          <Text style={styles.yearLabel}>Rounds {thisYear - 1}</Text>
        </View>
        <View style={styles.yearCard}>
          <Text style={styles.yearNum}>{worstDiff !== null ? (worstDiff > 0 ? `+${worstDiff.toFixed(1)}` : worstDiff.toFixed(1)) : '—'}</Text>
          <Text style={styles.yearLabel}>Worst Diff</Text>
        </View>
      </View>

      {last20.length >= 2 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Differential Trend (last {last20.length} rounds)</Text>
          <View style={styles.chart}>
            {last20.map((r, i) => {
              const isBest = bestIds.has(r.id);
              const height = Math.max(4, (Math.abs(r.differential) / maxDiff) * 80);
              return (
                <View key={r.id} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      { height, backgroundColor: isBest ? GREEN : '#a5d6a7' },
                    ]}
                  />
                  {i === last20.length - 1 && (
                    <Text style={styles.barLabel}>now</Text>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: GREEN }]} />
            <Text style={styles.legendText}>Used in handicap calculation</Text>
            <View style={[styles.legendDot, { backgroundColor: '#a5d6a7', marginLeft: 12 }]} />
            <Text style={styles.legendText}>Other rounds</Text>
          </View>
        </View>
      )}

      {rounds.filter((r) => r.holes === 9).length > 0 && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            ⚠️ {rounds.filter((r) => r.holes === 9).length} nine-hole round{rounds.filter((r) => r.holes === 9).length !== 1 ? 's' : ''} excluded from handicap calculation.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...cardShadow,
  },
  statValue: { fontSize: 32, fontWeight: '800', color: GREEN },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' },
  statSub: { fontSize: 11, color: '#aaa', marginTop: 2, textAlign: 'center' },
  yearRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  yearCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    ...cardShadow,
  },
  yearNum: { fontSize: 24, fontWeight: '800', color: '#333' },
  yearLabel: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'center' },
  chartSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 16 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 90, gap: 3 },
  barWrapper: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 3 },
  barLabel: { fontSize: 9, color: '#888', marginTop: 3 },
  legend: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#888', marginLeft: 4 },
  noteBox: { backgroundColor: '#fff8e1', borderRadius: 10, padding: 12, marginBottom: 12 },
  noteText: { fontSize: 13, color: '#795548' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' },
  emptyIcon: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#555' },
  emptyHint: { fontSize: 14, color: '#888', marginTop: 6 },
});
