const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { golfers } = db.read();
  res.json(golfers);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required.' });
  }
  const newGolfer = { id: Date.now().toString(), name: name.trim() };
  const data = db.read();
  data.golfers.push(newGolfer);
  db.write(data);
  res.status(201).json(newGolfer);
});

router.delete('/:id', (req, res) => {
  const data = db.read();
  data.golfers = data.golfers.filter((g) => g.id !== req.params.id);
  db.write(data);
  res.status(204).end();
});

module.exports = router;
