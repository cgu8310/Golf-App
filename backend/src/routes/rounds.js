const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { rounds } = db.read();
  res.json(rounds);
});

router.post('/', (req, res) => {
  const { courseName, par, holes, date, scores } = req.body;

  if (!Array.isArray(scores) || scores.length === 0) {
    return res.status(400).json({ error: 'scores array is required.' });
  }

  const newRound = {
    id: Date.now().toString(),
    courseName: courseName || '',
    par: par ? Number(par) : null,
    holes: holes === 9 ? 9 : 18,
    date: date || new Date().toISOString(),
    scores,
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
