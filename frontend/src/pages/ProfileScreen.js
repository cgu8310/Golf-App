import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useProfile } from '../context/ProfileContext';
import { useRounds } from '../context/RoundsContext';
import { useLanguage } from '../context/LanguageContext';
import { cardShadow, blueCardShadow } from '../styles';

const BLUE = '#4f46e5';

export default function ProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const { rounds, handicapIndex } = useRounds();
  const { t } = useLanguage();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name || '');
  const [homeClub, setHomeClub] = useState(profile.homeClub || '');
  const [targetHandicap, setTargetHandicap] = useState(
    profile.targetHandicap != null ? String(profile.targetHandicap) : ''
  );

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
    setEditing(false);
  }

  function handleEdit() {
    setName(profile.name || '');
    setHomeClub(profile.homeClub || '');
    setTargetHandicap(profile.targetHandicap != null ? String(profile.targetHandicap) : '');
    setEditing(true);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={styles.card}>
          <Text style={styles.cardName}>{profile.name || 'Golfer'}</Text>
          <Text style={styles.cardClub}>{profile.homeClub || t('noHomeClub')}</Text>
          <View style={styles.cardStats}>
            <View style={styles.cardStat}>
              <Text style={styles.cardStatNum}>
                {handicapIndex !== null ? handicapIndex.toFixed(1) : '—'}
              </Text>
              <Text style={styles.cardStatLabel}>{t('handicap')}</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardStat}>
              <Text style={styles.cardStatNum}>{rounds.length}</Text>
              <Text style={styles.cardStatLabel}>{t('rounds')}</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardStat}>
              <Text style={styles.cardStatNum}>{isNaN(target) ? '—' : target.toFixed(1)}</Text>
              <Text style={styles.cardStatLabel}>{t('goal')}</Text>
            </View>
          </View>
        </View>

        {progress !== null && (
          <View style={styles.goalSection}>
            <Text style={styles.goalTitle}>
              {t('progressToward')} {target.toFixed(1)} {t('handicapGoal')}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.goalHint}>
              {(handicapIndex - target).toFixed(1)} {t('strokesToGo')}
            </Text>
          </View>
        )}

        {editing ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('editProfile')}</Text>
            <Field label={t('yourName')} value={name} onChangeText={setName} placeholder="e.g. Tiger Woods" />
            <Field label={t('homeClub')} value={homeClub} onChangeText={setHomeClub} placeholder="e.g. Augusta National" />
            <Field
              label={t('targetHandicap')}
              value={targetHandicap}
              onChangeText={setTargetHandicap}
              placeholder="e.g. 10.0"
              keyboardType="decimal-pad"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('profile')}</Text>
            <InfoRow label={t('name')} value={profile.name || '—'} />
            <InfoRow label={t('homeClub')} value={profile.homeClub || '—'} />
            <InfoRow label={t('targetHandicap')} value={!isNaN(target) ? target.toFixed(1) : '—'} />
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>{t('editProfile')}</Text>
            </TouchableOpacity>
          </View>
        )}

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

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
  card: {
    backgroundColor: BLUE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...blueCardShadow,
  },
  cardName: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  cardClub: { color: '#c7d2fe', fontSize: 14, marginBottom: 20 },
  cardStats: { flexDirection: 'row', alignItems: 'center' },
  cardStat: { alignItems: 'center', paddingHorizontal: 20 },
  cardStatNum: { color: '#fff', fontSize: 24, fontWeight: '800' },
  cardStatLabel: { color: '#c7d2fe', fontSize: 11, marginTop: 2 },
  cardDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  goalSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...cardShadow,
  },
  goalTitle: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 10 },
  progressBar: { height: 10, backgroundColor: '#e0e7ff', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: BLUE, borderRadius: 5 },
  goalHint: { fontSize: 12, color: '#888', marginTop: 6 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...cardShadow,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  cancelButtonText: { color: '#888', fontSize: 15, fontWeight: '600' },
  saveButton: { flex: 1, backgroundColor: BLUE, borderRadius: 10, padding: 14, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: { fontSize: 14, color: '#888', fontWeight: '500' },
  infoValue: { fontSize: 14, color: '#222', fontWeight: '600' },
  editButton: {
    marginTop: 14,
    backgroundColor: BLUE,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  editButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
