import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRounds } from '../context/RoundsContext';
import { cardShadow, blueCardShadow } from '../styles';

const BLUE = '#4f46e5';

function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function RoundDetailScreen({ route, navigation }) {
  const { round } = route.params;
  const { deleteRound, handicapIndex } = useRounds();

  const netScore =
    handicapIndex !== null && round.holes !== 9
      ? round.adjustedGrossScore - Math.round(handicapIndex)
      : null;

  function handleDelete() {
    Alert.alert('Delete Round', `Remove round at "${round.courseName || 'Unnamed Course'}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteRound(round.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Differential</Text>
        <Text style={styles.heroValue}>{round.differential > 0 ? '+' : ''}{round.differential}</Text>
        {round.holes === 9 && <Text style={styles.heroNote}>9-hole round (excluded)</Text>}
      </View>

      <View style={styles.card}>
        <DetailRow label="Course" value={round.courseName || 'Unnamed Course'} />
        {round.tee ? <DetailRow label="Tee" value={round.tee} /> : null}
        <DetailRow label="Holes" value={`${round.holes || 18}`} />
        <DetailRow label="Date" value={new Date(round.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
      </View>

      <View style={styles.card}>
        <DetailRow label="Adjusted Gross Score" value={round.adjustedGrossScore} />
        <DetailRow label="Course Rating" value={round.courseRating} />
        <DetailRow label="Slope Rating" value={round.slopeRating} />
        {netScore !== null && <DetailRow label="Net Score" value={netScore > 0 ? `+${netScore}` : netScore} />}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>🗑 Delete Round</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  hero: {
    backgroundColor: BLUE,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    ...blueCardShadow,
  },
  heroLabel: { color: '#c7d2fe', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  heroValue: { color: '#fff', fontSize: 64, fontWeight: '800', lineHeight: 72 },
  heroNote: { color: '#c7d2fe', fontSize: 12, marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rowLabel: { fontSize: 14, color: '#888', fontWeight: '500' },
  rowValue: { fontSize: 14, color: '#222', fontWeight: '600' },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#4f46e5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteText: { color: '#4f46e5', fontWeight: '700', fontSize: 15 },
});
