import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useCourses } from '../context/CoursesContext';
import { useLanguage } from '../context/LanguageContext';
import { cardShadow } from '../styles';

const BLUE = '#4f46e5';

export default function CoursesScreen() {
  const { courses, addCourse, deleteCourse } = useCourses();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [slope, setSlope] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const r = parseFloat(rating);
    const s = parseFloat(slope);
    if (!name.trim()) { setError(t('errCourseNameRequired')); return; }
    if (isNaN(r)) { setError(t('errValidCourseRating')); return; }
    if (isNaN(s) || s <= 0) { setError(t('errValidSlopeRating')); return; }
    setError('');
    addCourse({ name: name.trim(), rating: r, slope: s });
    setName('');
    setRating('');
    setSlope('');
  }

  function confirmDelete(id, courseName) {
    Alert.alert(t('removeCourse'), `${t('removeCourseMsg')}\n"${courseName}"`, [
      { text: t('cancel'), style: 'cancel' },
      { text: t('remove'), style: 'destructive', onPress: () => deleteCourse(id) },
    ]);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        style={styles.container}
        data={courses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <View style={styles.form}>
              <Text style={styles.formTitle}>{t('addACourse')}</Text>
              <Field label={`${t('courseName')} *`} value={name} onChangeText={setName} placeholder={`${t('eg')} Augusta National`} />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Field label={`${t('rating')} *`} value={rating} onChangeText={setRating} placeholder="72.4" keyboardType="decimal-pad" />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label={`${t('slope')} *`} value={slope} onChangeText={setSlope} placeholder="131" keyboardType="numeric" />
                </View>
              </View>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>+ {t('addCourse')}</Text>
              </TouchableOpacity>
            </View>
            {courses.length > 0 && <Text style={styles.sectionTitle}>{t('savedCourses')}</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onLongPress={() => confirmDelete(item.id, item.name)}
          >
            <View>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseMeta}>{t('rating')} {item.rating} · {t('slope')} {item.slope}</Text>
            </View>
            <TouchableOpacity onPress={() => confirmDelete(item.id, item.name)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('noSavedCourses')}</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
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
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 16 },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    ...cardShadow,
  },
  formTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  row: { flexDirection: 'row' },
  field: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  error: { color: '#4f46e5', fontSize: 13, marginBottom: 8 },
  button: { backgroundColor: BLUE, borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 10 },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...cardShadow,
  },
  courseName: { fontSize: 15, fontWeight: '600', color: '#222' },
  courseMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  deleteBtn: { padding: 8 },
  deleteText: { color: '#ccc', fontSize: 16, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { color: '#bbb', fontSize: 14 },
});
