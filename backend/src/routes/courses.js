const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { courses } = db.read();
  res.json(courses);
});

router.post('/', (req, res) => {
  const { name, par, holes } = req.body;
  if (!name || par == null) {
    return res.status(400).json({ error: 'name and par are required.' });
  }
  const course = {
    id: Date.now().toString(),
    name,
    par: Number(par),
    holes: holes === 9 ? 9 : 18,
  };
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
