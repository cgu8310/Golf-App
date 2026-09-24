import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRounds } from '../context/RoundsContext';
import { cardShadow } from '../styles';

const BLUE = '#4f46e5';

export default function HistoryScreen({ navigation }) {
  const { rounds, deleteRound, handicapIndex } = useRounds();
  const sorted = [...rounds].reverse();

  if (rounds.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>⛳</Text>
        <Text style={styles.emptyText}>No rounds yet</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddRound')}>
          <Text style={styles.buttonText}>Add your first round</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {handicapIndex !== null && (
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>Current Index</Text>
          <Text style={styles.summaryValue}>{handicapIndex.toFixed(1)}</Text>
          <Text style={styles.summaryMeta}>Based on {rounds.length} round{rounds.length !== 1 ? 's' : ''}</Text>
        </View>
      )}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('RoundDetail', { round: item })}
            onLongPress={() =>
              Alert.alert('Delete Round', `Remove round at "${item.courseName || 'Unnamed Course'}"?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteRound(item.id) },
              ])
            }
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.courseName}>{item.courseName || 'Unnamed Course'}</Text>
                {item.holes === 9 && <Text style={styles.nineHole}>9H</Text>}
              </View>
              <Text style={styles.meta}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.meta}>
                Score {item.adjustedGrossScore} · Rating {item.courseRating} · Slope {item.slopeRating}
              </Text>
            </View>
            <View style={styles.diffBadge}>
              <Text style={styles.diffText}>{item.differential > 0 ? '+' : ''}{item.differential}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={<Text style={styles.hint}>Tap for details · Long-press to delete</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  summary: { backgroundColor: BLUE, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  summaryLabel: { color: '#c7d2fe', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  summaryValue: { color: '#fff', fontSize: 40, fontWeight: '800' },
  summaryMeta: { color: '#c7d2fe', fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...cardShadow,
  },
  cardLeft: { flex: 1, marginRight: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  courseName: { fontSize: 15, fontWeight: '600', color: '#222' },
  nineHole: { fontSize: 11, fontWeight: '700', color: BLUE, backgroundColor: '#e0e7ff', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  diffBadge: { backgroundColor: '#e0e7ff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, minWidth: 50, alignItems: 'center' },
  diffText: { fontSize: 16, fontWeight: '700', color: BLUE },
  hint: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' },
  emptyIcon: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#555', marginBottom: 20 },
  button: { backgroundColor: BLUE, borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
