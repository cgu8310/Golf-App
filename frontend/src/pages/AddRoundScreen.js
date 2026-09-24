import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform, Modal, FlatList,
} from 'react-native';
import { useRounds } from '../context/RoundsContext';
import { useCourses } from '../context/CoursesContext';
import { scoreDifferential } from '../hooks/useHandicap';

const BLUE = '#4f46e5';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddRoundScreen({ navigation }) {
  const { addRound } = useRounds();
  const { courses } = useCourses();

  const [courseName, setCourseName] = useState('');
  const [tee, setTee] = useState('');
  const [holes, setHoles] = useState(18);
  const [adjustedGrossScore, setAdjustedGrossScore] = useState('');
  const [courseRating, setCourseRating] = useState('');
  const [slopeRating, setSlopeRating] = useState('');
  const [date, setDate] = useState(todayString());
  const [showCoursePicker, setShowCoursePicker] = useState(false);

  const score = parseFloat(adjustedGrossScore);
  const rating = parseFloat(courseRating);
  const slope = parseFloat(slopeRating);

  const previewDiff =
    !isNaN(score) && !isNaN(rating) && !isNaN(slope) && slope > 0
      ? scoreDifferential(score, rating, slope)
      : null;

  function selectCourse(c) {
    setCourseName(c.name);
    setCourseRating(String(c.rating));
    setSlopeRating(String(c.slope));
    setShowCoursePicker(false);
  }

  function handleSave() {
    if (!adjustedGrossScore || !courseRating || !slopeRating) {
      Alert.alert('Missing fields', 'Please fill in Score, Course Rating, and Slope Rating.');
      return;
    }
    if (isNaN(score) || isNaN(rating) || isNaN(slope) || slope <= 0) {
      Alert.alert('Invalid values', 'Please enter valid numbers.');
      return;
    }
    addRound({
      courseName,
      tee,
      holes,
      adjustedGrossScore: score,
      courseRating: rating,
      slopeRating: slope,
      date: date ? new Date(date).toISOString() : undefined,
    });
    navigation.navigate('Home');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        {courses.length > 0 && (
          <TouchableOpacity style={styles.pickerButton} onPress={() => setShowCoursePicker(true)}>
            <Text style={styles.pickerButtonText}>📋 Choose Saved Course</Text>
          </TouchableOpacity>
        )}

        <Field label="Course Name (optional)" value={courseName} onChangeText={setCourseName} placeholder="e.g. Augusta National" />
        <Field label="Tee (optional)" value={tee} onChangeText={setTee} placeholder="e.g. White, Blue, Red" />

        <View style={styles.field}>
          <Text style={styles.label}>Holes</Text>
          <View style={styles.toggle}>
            {[18, 9].map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.toggleBtn, holes === h && styles.toggleBtnActive]}
                onPress={() => setHoles(h)}
              >
                <Text style={[styles.toggleText, holes === h && styles.toggleTextActive]}>
                  {h} holes
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Field
          label="Adjusted Gross Score *"
          value={adjustedGrossScore}
          onChangeText={setAdjustedGrossScore}
          placeholder={holes === 9 ? 'e.g. 44' : 'e.g. 88'}
          keyboardType="numeric"
        />
        <Field
          label="Course Rating *"
          value={courseRating}
          onChangeText={setCourseRating}
          placeholder={holes === 9 ? 'e.g. 36.2' : 'e.g. 72.4'}
          keyboardType="decimal-pad"
        />
        <Field
          label="Slope Rating *"
          value={slopeRating}
          onChangeText={setSlopeRating}
          placeholder="e.g. 131"
          keyboardType="numeric"
        />
        <Field label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

        {previewDiff !== null && (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Score Differential</Text>
            <Text style={styles.previewValue}>{previewDiff.toFixed(1)}</Text>
            {holes === 9 && <Text style={styles.previewNote}>9-hole round (excluded)</Text>}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Round</Text>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Where to find these values</Text>
          <Text style={styles.hintText}>Course Rating and Slope Rating are printed on your scorecard or available on the course website.</Text>
        </View>

        <TouchableOpacity style={styles.saveCourseLink} onPress={() => navigation.navigate('Courses')}>
          <Text style={styles.saveCourseText}>⭐ Manage saved courses</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showCoursePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Choose a Course</Text>
            <FlatList
              data={courses}
              keyExtractor={(c) => c.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.courseRow} onPress={() => selectCourse(item)}>
                  <Text style={styles.courseRowName}>{item.name}</Text>
                  <Text style={styles.courseRowMeta}>Rating {item.rating} · Slope {item.slope}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowCoursePicker(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  pickerButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BLUE,
    alignItems: 'center',
  },
  pickerButtonText: { color: BLUE, fontWeight: '700', fontSize: 15 },
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
  toggle: { flexDirection: 'row', gap: 8 },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: BLUE, borderColor: BLUE },
  toggleText: { fontWeight: '600', color: '#555', fontSize: 15 },
  toggleTextActive: { color: '#fff' },
  preview: { backgroundColor: BLUE, borderRadius: 12, padding: 18, alignItems: 'center', marginBottom: 20 },
  previewLabel: { color: '#c7d2fe', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  previewValue: { color: '#fff', fontSize: 40, fontWeight: '800' },
  previewNote: { color: '#c7d2fe', fontSize: 12, marginTop: 4 },
  button: { backgroundColor: BLUE, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { backgroundColor: '#e0e7ff', borderRadius: 10, padding: 14, marginBottom: 12 },
  hintTitle: { fontSize: 13, fontWeight: '700', color: BLUE, marginBottom: 4 },
  hintText: { fontSize: 13, color: '#555', lineHeight: 18 },
  saveCourseLink: { alignItems: 'center', paddingVertical: 8 },
  saveCourseText: { color: BLUE, fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 16 },
  courseRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  courseRowName: { fontSize: 15, fontWeight: '600', color: '#222' },
  courseRowMeta: { fontSize: 13, color: '#888', marginTop: 2 },
  modalClose: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 12 },
  modalCloseText: { fontWeight: '700', color: '#555', fontSize: 15 },
});
