const express = require('express');
const cors = require('cors');
const roundsRouter = require('./routes/rounds');
const profileRouter = require('./routes/profile');
const coursesRouter = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/rounds', roundsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/courses', coursesRouter);

app.listen(PORT, () => {
  console.log(`Golf API running on http://localhost:${PORT}`);
});
