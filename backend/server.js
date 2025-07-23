const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 修改为你的MySQL用户名
  password: '', // 修改为你的MySQL密码
  database: 'demo_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// 查询所有用户
app.get('/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 新增用户
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO user (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, name, email });
  });
});

// 修改用户
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  db.query('UPDATE user SET name=?, email=? WHERE id=?', [name, email, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, name, email });
  });
});

// 删除用户
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM user WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
