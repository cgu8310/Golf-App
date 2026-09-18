import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRounds } from '../context/RoundsContext';
import { useProfile } from '../context/ProfileContext';

const GREEN = '#1a6b2e';
const LIGHT_GREEN = '#e8f5e9';

export default function HomeScreen({ navigation }) {
  const { rounds, handicapIndex } = useRounds();
  const { profile } = useProfile();
  const recent = [...rounds].reverse().slice(0, 3);
  const eligibleCount = rounds.filter((r) => !r.holes || r.holes === 18).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {profile.name ? (
        <Text style={styles.greeting}>Welcome back, {profile.name} 👋</Text>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.label}>Handicap Index</Text>
        {handicapIndex !== null ? (
          <Text style={styles.index}>{handicapIndex.toFixed(1)}</Text>
        ) : (
          <Text style={styles.noIndex}>
            {eligibleCount < 3
              ? `Add ${3 - eligibleCount} more 18-hole round${3 - eligibleCount === 1 ? '' : 's'} to calculate`
              : '—'}
          </Text>
        )}
        <Text style={styles.rounds}>
          {rounds.length} round{rounds.length !== 1 ? 's' : ''} recorded
        </Text>
      </View>

      {recent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Rounds</Text>
          {recent.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.row}
              onPress={() => navigation.navigate('RoundDetail', { round: r })}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.courseName}>{r.courseName || 'Unnamed Course'}</Text>
                <Text style={styles.meta}>
                  {new Date(r.date).toLocaleDateString()} · Score {r.adjustedGrossScore}
                  {r.holes === 9 ? ' · 9 holes' : ''}
                </Text>
              </View>
              <Text style={styles.diff}>
                {r.differential > 0 ? '+' : ''}{r.differential}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddRound')}>
        <Text style={styles.buttonText}>+ Add Round</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
  greeting: { fontSize: 15, color: '#555', marginBottom: 12, fontWeight: '500' },
  card: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: { color: '#a5d6a7', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  index: { color: '#fff', fontSize: 72, fontWeight: '800', lineHeight: 80 },
  noIndex: { color: '#c8e6c9', fontSize: 15, marginTop: 8, textAlign: 'center' },
  rounds: { color: '#a5d6a7', fontSize: 13, marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rowLeft: { flex: 1 },
  courseName: { fontSize: 15, fontWeight: '600', color: '#222' },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  diff: { fontSize: 18, fontWeight: '700', color: GREEN, marginLeft: 12 },
  button: {
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
