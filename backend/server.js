const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 修改为你的MySQL用户名
  password: 'n3u3da!', // 修改为你的MySQL密码
  database: 'demo_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// 查询所有用户
// curl 示例：
// curl http://localhost:3000/users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 新增用户
// curl 示例：
// curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"name\":\"user$(echo $RANDOM)\",\"email\":\"user$(echo $RANDOM)@test.com\"}"
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const room_number = Math.floor(Math.random() * 900) + 100; 
  db.query(
    'INSERT INTO user (name, email, room_number) VALUES (?, ?, ?)',
    [name, email, room_number], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, name, email, room_number });
    }
  );
});

// 修改用户
// curl 示例：
// curl -X PUT http://localhost:3000/users/1 -H "Content-Type: application/json" -d "{\"name\":\"新名字\",\"email\":\"newemail@test.com\",\"room_number\":101}"
app.put('/users/:id', (req, res) => {
  const { name, email, room_number } = req.body;
  const { id } = req.params;
  db.query(
    'UPDATE user SET name=?, email=?, room_number=? WHERE id=?',
    [name, email, room_number || null, id], // Default to NULL if room_number is not provided
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id, name, email, room_number });
    }
  );
});

// 删除用户
// curl 示例：
// curl -X DELETE http://localhost:3000/users/1
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
