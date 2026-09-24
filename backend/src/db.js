const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'golf.json');

const DEFAULT = { rounds: [], profile: {}, courses: [], golfers: [] };

function read() {
  if (!fs.existsSync(DB_PATH)) return { ...DEFAULT };
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  return { ...DEFAULT, ...data };
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
