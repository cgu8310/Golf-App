import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { cardShadow } from '../styles';

const BLUE = '#4f46e5';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export default function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        {LANGUAGES.map((lang) => {
          const active = language === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.row, active && styles.rowActive]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, active && styles.langLabelActive]}>
                {lang.label}
              </Text>
              {active && (
                <Ionicons name="checkmark-circle" size={22} color={BLUE} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 20 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...cardShadow,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowActive: {
    backgroundColor: '#e0e7ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    marginBottom: 2,
  },
  flag: { fontSize: 24, marginRight: 14 },
  langLabel: { flex: 1, fontSize: 16, fontWeight: '500', color: '#333' },
  langLabelActive: { fontWeight: '700', color: BLUE },
});
