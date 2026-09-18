import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRounds } from '../context/RoundsContext';
import { scoreDifferential } from '../hooks/useHandicap';

const GREEN = '#1a6b2e';

export default function AddRoundScreen({ navigation }) {
  const { addRound } = useRounds();

  const [courseName, setCourseName] = useState('');
  const [adjustedGrossScore, setAdjustedGrossScore] = useState('');
  const [courseRating, setCourseRating] = useState('');
  const [slopeRating, setSlopeRating] = useState('');

  const score = parseFloat(adjustedGrossScore);
  const rating = parseFloat(courseRating);
  const slope = parseFloat(slopeRating);

  const previewDiff =
    !isNaN(score) && !isNaN(rating) && !isNaN(slope) && slope > 0
      ? scoreDifferential(score, rating, slope)
      : null;

  function handleSave() {
    if (!adjustedGrossScore || !courseRating || !slopeRating) {
      Alert.alert('Missing fields', 'Please fill in Score, Course Rating, and Slope Rating.');
      return;
    }
    if (isNaN(score) || isNaN(rating) || isNaN(slope) || slope <= 0) {
      Alert.alert('Invalid values', 'Please enter valid numbers.');
      return;
    }

    addRound({ courseName, adjustedGrossScore: score, courseRating: rating, slopeRating: slope });
    navigation.navigate('Home');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Field label="Course Name (optional)" value={courseName} onChangeText={setCourseName} placeholder="e.g. Augusta National" />
        <Field
          label="Adjusted Gross Score *"
          value={adjustedGrossScore}
          onChangeText={setAdjustedGrossScore}
          placeholder="e.g. 88"
          keyboardType="numeric"
        />
        <Field
          label="Course Rating *"
          value={courseRating}
          onChangeText={setCourseRating}
          placeholder="e.g. 72.4"
          keyboardType="decimal-pad"
        />
        <Field
          label="Slope Rating *"
          value={slopeRating}
          onChangeText={setSlopeRating}
          placeholder="e.g. 131"
          keyboardType="numeric"
        />

        {previewDiff !== null && (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>Score Differential</Text>
            <Text style={styles.previewValue}>{previewDiff.toFixed(1)}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Round</Text>
        </TouchableOpacity>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>Where to find these values</Text>
          <Text style={styles.hintText}>Course Rating and Slope Rating are printed on your scorecard or available on the course website.</Text>
        </View>
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
  preview: {
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  previewLabel: { color: '#a5d6a7', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  previewValue: { color: '#fff', fontSize: 40, fontWeight: '800' },
  button: {
    backgroundColor: GREEN,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hint: { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 14 },
  hintTitle: { fontSize: 13, fontWeight: '700', color: GREEN, marginBottom: 4 },
  hintText: { fontSize: 13, color: '#555', lineHeight: 18 },
});
