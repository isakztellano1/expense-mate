const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const { Parser } = require('json2csv');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(':memory:');

// Init DB
db.serialize(() => {
  db.run(`CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    amount REAL,
    category TEXT,
    date TEXT
  )`);

  db.run(`CREATE TABLE budget (
    month TEXT PRIMARY KEY,
    amount REAL
  )`);
});

app.post('/transactions', (req, res) => {
  const { type, amount, category, date } = req.body;
  db.run('INSERT INTO transactions (type, amount, category, date) VALUES (?, ?, ?, ?)',
    [type, amount, category, date],
    function (err) {
      if (err) return res.status(500).send(err);
      res.send({ id: this.lastID });
    });
});

app.get('/transactions', (req, res) => {
  db.all('SELECT * FROM transactions', (err, rows) => {
    if (err) return res.status(500).send(err);
    res.send(rows);
  });
});

app.post('/budget', (req, res) => {
  const { month, amount } = req.body;
  db.run('INSERT OR REPLACE INTO budget (month, amount) VALUES (?, ?)', [month, amount], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});

app.get('/budget/:month', (req, res) => {
  db.get('SELECT amount FROM budget WHERE month = ?', [req.params.month], (err, row) => {
    if (err) return res.status(500).send(err);
    res.send(row || { amount: 0 });
  });
});

app.get('/export', (req, res) => {
  db.all('SELECT * FROM transactions', (err, rows) => {
    if (err) return res.status(500).send(err);
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
