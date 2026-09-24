import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRounds } from '../context/RoundsContext';import { useProfile } from '../context/ProfileContext';
import { useGolfers } from '../context/GolfersContext';
import { useLanguage } from '../context/LanguageContext';
import { getBestScore, getAvgScore, getAvgVsPar, getMyScore } from '../hooks/useStats';
import { cardShadow, blueCardShadow } from '../styles';

const BLUE = '#4f46e5';
const LIGHT_BLUE = '#e0e7ff';
const MUTED_BLUE = '#c7d2fe';

function netLabel(score, par) {
  if (par == null) return '';
  const n = score - par;
  if (n === 0) return 'Even';
  return n > 0 ? `+${n}` : `${n}`;
}

export default function HomeScreen({ navigation }) {
  const { rounds, addRound } = useRounds();
  const { profile } = useProfile();
  const { golfers, loaded, addGolfer, deleteGolfer } = useGolfers();
  const { t } = useLanguage();
  const recent = [...rounds].reverse().slice(0, 3);

  const allTimeBest = getBestScore(rounds);
  const avg = getAvgScore(rounds);
  const avgNet = getAvgVsPar(rounds);

  const [newName, setNewName] = useState('');
  const [scores, setScores] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('@golf_scores')
      .then((raw) => { if (raw) setScores(JSON.parse(raw)); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!loaded || !profile.name) return;
    const today = new Date().toDateString();
    AsyncStorage.getItem('@golf_auto_add_date').then((stored) => {
      if (stored === today) return;
      AsyncStorage.setItem('@golf_auto_add_date', today);
      addGolfer(profile.name, golfers);
    });
  }, [loaded, profile.name]);

  function setScore(id, value) {
    setScores((prev) => {
      const updated = { ...prev, [id]: value };
      AsyncStorage.setItem('@golf_scores', JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }

  const leader = useMemo(() => {
    let result = null;
    for (const g of golfers) {
      const s = parseInt(scores[g.id] || '', 10);
      if (isNaN(s)) continue;
      if (result === null || s > result.score) {
        result = { id: g.id, name: g.name, score: s };
      }
    }
    return result;
  }, [golfers, scores]);

  function handleAddGolfer() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addGolfer(trimmed);
    setNewName('');
  }

  function resetScores() {
    setScores({});
    AsyncStorage.removeItem('@golf_scores').catch(console.error);
  }

  function confirmResetScores() {
    Alert.alert(
      'Reset scores?',
      'This will delete all player scores for the current game. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetScores },
      ]
    );
  }

  function finishGame() {
    const playerScores = golfers
      .map((g) => ({ name: g.name, score: parseInt(scores[g.id] || '0', 10) }))
      .filter((p) => p.score > 0);

    if (playerScores.length === 0) {
      Alert.alert('No scores', 'Enter at least one player score before finishing.');
      return;
    }

    const winner = leader;
    const msg = winner
      ? `Winner: ${winner.name} with ${winner.score} points!`
      : 'Game finished!';

    Alert.alert('Finish Game', msg, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save & Finish',
        onPress: () => {
          addRound({
            courseName: 'Putt Putt',
            adjustedGrossScore: winner?.score ?? 0,
            scores: playerScores,
            date: new Date().toISOString(),
          });
          resetScores();
        },
      },
    ]);
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      {profile.name ? (
        <Text style={styles.greeting}>{t('welcomeBack')}, {profile.name} ⛳</Text>
      ) : null}

      <View style={styles.card}>
        {leader ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.label}>{t('currentlyLeading')}</Text>
            <Text style={styles.bigNum}>{leader.score}</Text>
            <Text style={styles.leaderName}>{leader.name}</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.label}>{t('bestScore')}</Text>
            {allTimeBest !== null ? (
              <Text style={styles.bigNum}>{allTimeBest}</Text>
            ) : (
              <Text style={styles.noData}>{t('addRoundToTrack')}</Text>
            )}
            {avgNet !== null && (
              <Text style={styles.sub}>
                {t('avgVsPar')}: {avgNet > 0 ? `+${avgNet}` : avgNet}
              </Text>
            )}
            {avg !== null && <Text style={styles.sub}>{t('avgScore')}: {avg}</Text>}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('players')}</Text>
          {Object.keys(scores).some((k) => scores[k]) && (
            <TouchableOpacity onPress={confirmResetScores}>
              <Text style={styles.resetBtn}>Reset scores</Text>
            </TouchableOpacity>
          )}
        </View>

        {golfers.map((g) => {
          const isLeader = leader?.id === g.id;
          return (
          <View key={g.id} style={[styles.golferRow, isLeader && styles.golferRowLeader]}>
            <Text style={[styles.golferName, isLeader && styles.golferNameLeader]}>{g.name}</Text>
            <TextInput
              style={[styles.scoreInput, isLeader && styles.scoreInputLeader]}
              value={scores[g.id] ?? ''}
              onChangeText={(v) => setScore(g.id, v)}
              placeholder="—"
              placeholderTextColor="#ccc"
              keyboardType="number-pad"
              maxLength={4}
            />
            <TouchableOpacity onPress={() => deleteGolfer(g.id)} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={18} color="#4f46e5" />
            </TouchableOpacity>
          </View>
          );
        })}

        <View style={styles.addRow}>
          <TextInput
            style={styles.nameInput}
            value={newName}
            onChangeText={setNewName}
            placeholder={t('golferNamePlaceholder')}
            placeholderTextColor="#aaa"
            onSubmitEditing={handleAddGolfer}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addBtn, !newName.trim() && styles.addBtnDisabled]}
            onPress={handleAddGolfer}
            disabled={!newName.trim()}
          >
            <Text style={styles.addBtnText}>{t('add')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {golfers.length > 0 && (
        <TouchableOpacity style={styles.finishBtn} onPress={finishGame}>
          <Ionicons name="flag" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.finishBtnText}>Finish Game</Text>
        </TouchableOpacity>
      )}

      {recent.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('recentRounds')}</Text>
          {recent.map((r) => {
            const myScore = getMyScore(r);
            return (
              <TouchableOpacity
                key={r.id}
                style={styles.row}
                onPress={() => navigation.navigate('RoundDetail', { round: r })}
              >
                <View style={styles.rowLeft}>
                  <Text style={styles.courseName}>{r.courseName || 'Unknown Course'}</Text>
                  <Text style={styles.meta}>
                    {new Date(r.date).toLocaleDateString()}
                    {r.scores?.length > 1 ? ` · ${r.scores.length} players` : ''}
                  </Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreNum}>{myScore}</Text>
                  {r.par ? (
                    <Text style={styles.netLabel}>{netLabel(myScore, r.par)}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
  greeting: { fontSize: 15, color: '#555', marginBottom: 12, fontWeight: '500' },
  card: {
    backgroundColor: BLUE,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    ...blueCardShadow,
  },
  label: { color: MUTED_BLUE, fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  bigNum: { color: '#fff', fontSize: 72, fontWeight: '800', lineHeight: 80 },
  leaderName: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 4 },
  noData: { color: '#c7d2fe', fontSize: 15, marginTop: 8, textAlign: 'center' },
  sub: { color: MUTED_BLUE, fontSize: 13, marginTop: 4 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  resetBtn: { fontSize: 13, color: '#4f46e5', fontWeight: '600' },
  golferRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...cardShadow,
  },
  golferRowLeader: {
    backgroundColor: LIGHT_BLUE,
    borderWidth: 1.5,
    borderColor: BLUE,
  },
  golferName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#222' },
  golferNameLeader: { color: BLUE, fontWeight: '800' },
  scoreInput: {
    width: 56,
    backgroundColor: '#eef2ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: '700',
    color: BLUE,
    textAlign: 'center',
    marginRight: 8,
  },
  scoreInputLeader: {
    backgroundColor: '#fff',
    borderColor: BLUE,
  },
  deleteBtn: { padding: 6 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  nameInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addBtn: {
    backgroundColor: BLUE,
    borderRadius: 10,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: LIGHT_BLUE },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  finishBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  finishBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...cardShadow,
  },
  rowLeft: { flex: 1 },
  courseName: { fontSize: 15, fontWeight: '600', color: '#222' },
  meta: { fontSize: 12, color: '#888', marginTop: 2 },
  scoreBadge: { alignItems: 'center', marginLeft: 12 },
  scoreNum: { fontSize: 22, fontWeight: '800', color: BLUE },
  netLabel: { fontSize: 11, color: '#888', marginTop: 1 },
});
