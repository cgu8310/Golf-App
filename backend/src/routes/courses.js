const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { courses } = db.read();
  res.json(courses);
});

router.post('/', (req, res) => {
  const { name, rating, slope } = req.body;
  if (!name || rating == null || slope == null || slope <= 0) {
    return res.status(400).json({ error: 'name, rating, and slope are required.' });
  }
  const course = { id: Date.now().toString(), name, rating, slope };
  const data = db.read();
  data.courses.push(course);
  db.write(data);
  res.status(201).json(course);
});

router.delete('/:id', (req, res) => {
  const data = db.read();
  data.courses = data.courses.filter((c) => c.id !== req.params.id);
  db.write(data);
  res.status(204).end();
});

module.exports = router;
