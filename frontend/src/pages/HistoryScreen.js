import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRounds } from '../context/RoundsContext';

const GREEN = '#1a6b2e';

export default function HistoryScreen({ navigation }) {
  const { rounds, deleteRound, handicapIndex } = useRounds();
  const sorted = [...rounds].reverse();

  function confirmDelete(id, courseName) {
    Alert.alert(
      'Delete Round',
      `Remove round at "${courseName || 'Unnamed Course'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRound(id) },
      ]
    );
  }

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
          <Text style={styles.summaryLabel}>Current Handicap Index</Text>
          <Text style={styles.summaryValue}>{handicapIndex.toFixed(1)}</Text>
          <Text style={styles.summaryMeta}>Based on {rounds.length} round{rounds.length !== 1 ? 's' : ''}</Text>
        </View>
      )}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => confirmDelete(item.id, item.courseName)}
            style={styles.card}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.courseName}>{item.courseName || 'Unnamed Course'}</Text>
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
        ListFooterComponent={
          <Text style={styles.hint}>Long-press a round to delete it</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  summary: {
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: { color: '#a5d6a7', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  summaryValue: { color: '#fff', fontSize: 40, fontWeight: '800' },
  summaryMeta: { color: '#a5d6a7', fontSize: 12, marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flex: 1, marginRight: 12 },
  courseName: { fontSize: 15, fontWeight: '600', color: '#222' },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  diffBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  diffText: { fontSize: 16, fontWeight: '700', color: GREEN },
  hint: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' },
  emptyIcon: { fontSize: 60, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#555', marginBottom: 20 },
  button: { backgroundColor: GREEN, borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
