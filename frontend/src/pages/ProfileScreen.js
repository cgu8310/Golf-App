import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useProfile } from '../context/ProfileContext';
import { useRounds } from '../context/RoundsContext';
import { cardShadow, greenCardShadow } from '../styles';

const GREEN = '#1a6b2e';

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const { rounds, handicapIndex } = useRounds();

  const [name, setName] = useState(profile.name || '');
  const [homeClub, setHomeClub] = useState(profile.homeClub || '');
  const [targetHandicap, setTargetHandicap] = useState(
    profile.targetHandicap != null ? String(profile.targetHandicap) : ''
  );
  const [saved, setSaved] = useState(false);

  const target = parseFloat(targetHandicap);
  const progress =
    handicapIndex !== null && !isNaN(target) && target < handicapIndex
      ? Math.max(0, Math.min(1, (handicapIndex - target) / handicapIndex))
      : null;

  function handleSave() {
    updateProfile({
      name,
      homeClub,
      targetHandicap: isNaN(target) ? null : target,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.card}>
          <Text style={styles.cardName}>{name || 'Golfer'}</Text>
          <Text style={styles.cardClub}>{homeClub || 'Set your home club below'}</Text>
          <View style={styles.cardStats}>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatNum}>
                {handicapIndex !== null ? handicapIndex.toFixed(1) : '—'}
              </Text>
              <Text style={styles.cardStatLabel}>Handicap</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardStat}>
              <Text style={styles.cardStatNum}>{rounds.length}</Text>
              <Text style={styles.cardStatLabel}>Rounds</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardStat}>
              <Text style={styles.cardStatNum}>{isNaN(target) ? '—' : target.toFixed(1)}</Text>
              <Text style={styles.cardStatLabel}>Goal</Text>
            </View>
          </View>
        </View>

        {progress !== null && (
          <View style={styles.goalSection}>
            <Text style={styles.goalTitle}>
              Progress toward {target.toFixed(1)} handicap goal
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.goalHint}>
              {(handicapIndex - target).toFixed(1)} strokes to go
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit Profile</Text>
          <Field label="Your Name" value={name} onChangeText={setName} placeholder="e.g. Tiger Woods" />
          <Field label="Home Club" value={homeClub} onChangeText={setHomeClub} placeholder="e.g. Augusta National" />
          <Field
            label="Target Handicap"
            value={targetHandicap}
            onChangeText={setTargetHandicap}
            placeholder="e.g. 10.0"
            keyboardType="decimal-pad"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{saved ? '✓ Saved!' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType || 'default'}
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
  card: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...greenCardShadow,
  },
  cardName: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  cardClub: { color: '#a5d6a7', fontSize: 14, marginBottom: 20 },
  cardStats: { flexDirection: 'row', alignItems: 'center' },
  cardStat: { alignItems: 'center', paddingHorizontal: 20 },
  cardStatNum: { color: '#fff', fontSize: 24, fontWeight: '800' },
  cardStatLabel: { color: '#a5d6a7', fontSize: 11, marginTop: 2 },
  cardDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  goalSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...cardShadow,
  },
  goalTitle: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 10 },
  progressBar: { height: 10, backgroundColor: '#e8f5e9', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: GREEN, borderRadius: 5 },
  goalHint: { fontSize: 12, color: '#888', marginTop: 6 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: { backgroundColor: GREEN, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
