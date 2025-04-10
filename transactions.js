// File: backend/routes/transactions.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Kết nối đến cơ sở dữ liệu

// Xóa giao dịch theo ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  });
});

module.exports = router;
