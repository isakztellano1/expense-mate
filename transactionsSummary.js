// File: backend/routes/transactionsSummary.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Kết nối đến cơ sở dữ liệu

// Lấy tổng thu nhập và chi tiêu
router.get('/summary', (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
    FROM transactions
  `;
  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      totalIncome: row.totalIncome || 0,
      totalExpense: row.totalExpense || 0
    });
  });
});

module.exports = router;
