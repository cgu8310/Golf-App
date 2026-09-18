const express = require('express');
const db = require('../db');

const router = express.Router();

function scoreDifferential(score, rating, slope) {
  return ((score - rating) * 113) / slope;
}

router.get('/', (req, res) => {
  const { rounds } = db.read();
  res.json(rounds);
});

router.post('/', (req, res) => {
  const { courseName, adjustedGrossScore, courseRating, slopeRating, date, holes, tee } = req.body;

  if (adjustedGrossScore == null || courseRating == null || slopeRating == null || slopeRating <= 0) {
    return res.status(400).json({ error: 'adjustedGrossScore, courseRating, and slopeRating are required.' });
  }

  const differential = Math.round(scoreDifferential(adjustedGrossScore, courseRating, slopeRating) * 10) / 10;
  const newRound = {
    id: Date.now().toString(),
    courseName: courseName || '',
    tee: tee || '',
    holes: holes === 9 ? 9 : 18,
    adjustedGrossScore,
    courseRating,
    slopeRating,
    differential,
    date: date || new Date().toISOString(),
  };

  const data = db.read();
  data.rounds.push(newRound);
  db.write(data);

  res.status(201).json(newRound);
});

router.delete('/:id', (req, res) => {
  const data = db.read();
  data.rounds = data.rounds.filter((r) => r.id !== req.params.id);
  db.write(data);
  res.status(204).end();
});

module.exports = router;
