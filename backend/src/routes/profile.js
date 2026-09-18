const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const { profile } = db.read();
  res.json(profile);
});

router.put('/', (req, res) => {
  const data = db.read();
  data.profile = { ...data.profile, ...req.body };
  db.write(data);
  res.json(data.profile);
});

module.exports = router;
